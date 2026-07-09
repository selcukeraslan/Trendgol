"use client";

import * as React from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ImageCropperProps {
  file: File;
  /** Hedef en-boy oranı (genişlik / yükseklik). Ör. 1, 16/9. */
  aspect: number;
  /** Kırpılan görselin en fazla genişliği (px). */
  maxWidth?: number;
  onCancel: () => void;
  onCrop: (blob: Blob) => void;
}

interface Offset {
  x: number;
  y: number;
}

const MAX_ZOOM = 4;

/**
 * Basit, kütüphanesiz görsel kırpıcı: oran sabit çerçeve içinde sürükle + yakınlaştır,
 * "Uygula" ile son görsel canvas'tan üretilir. Overlay olarak render edilir.
 */
export function ImageCropper({
  file,
  aspect,
  maxWidth = 1200,
  onCancel,
  onCrop,
}: ImageCropperProps) {
  const [src] = React.useState(() => URL.createObjectURL(file));
  const frameRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const dragRef = React.useRef<{
    startX: number;
    startY: number;
    ox: number;
    oy: number;
  } | null>(null);

  const [natural, setNatural] = React.useState<{ w: number; h: number } | null>(
    null,
  );
  const [frameW, setFrameW] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState<Offset>({ x: 0, y: 0 });

  const naturalRef = React.useRef<{ w: number; h: number } | null>(null);
  const centeredRef = React.useRef(false);

  React.useEffect(() => () => URL.revokeObjectURL(src), [src]);

  const centerImage = React.useCallback(
    (nat: { w: number; h: number }, fw: number) => {
      if (!fw) return;
      const fh = fw / aspect;
      const bs = Math.max(fw / nat.w, fh / nat.h);
      setOffset({ x: (fw - nat.w * bs) / 2, y: (fh - nat.h * bs) / 2 });
      centeredRef.current = true;
    },
    [aspect],
  );

  // Çerçeve genişliğini ölç ve (hazırsa) görseli ortala.
  React.useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      setFrameW(w);
      if (naturalRef.current && !centeredRef.current) {
        centerImage(naturalRef.current, w);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [centerImage]);

  const frameH = frameW / aspect;
  const baseScale =
    natural && frameW
      ? Math.max(frameW / natural.w, frameH / natural.h)
      : 1;
  const displayScale = baseScale * zoom;
  const dispW = natural ? natural.w * displayScale : 0;
  const dispH = natural ? natural.h * displayScale : 0;

  const clamp = React.useCallback(
    (o: Offset): Offset => ({
      x: Math.min(0, Math.max(frameW - dispW, o.x)),
      y: Math.min(0, Math.max(frameH - dispH, o.y)),
    }),
    [frameW, frameH, dispW, dispH],
  );

  // Görselin doğal boyutunu okur ve (çerçeve hazırsa) ortalar.
  const initFromImg = React.useCallback(() => {
    const img = imgRef.current;
    if (!img || !img.naturalWidth || naturalRef.current) return;
    const nat = { w: img.naturalWidth, h: img.naturalHeight };
    naturalRef.current = nat;
    setNatural(nat);
    const fw = frameRef.current?.clientWidth ?? 0;
    if (fw) centerImage(nat, fw);
  }, [centerImage]);

  // Blob görsel anında (senkron) yüklenip onLoad kaçırılırsa yakala.
  React.useEffect(() => {
    if (imgRef.current?.complete) initFromImg();
  }, [initFromImg]);

  function onZoomChange(next: number) {
    const z = Math.min(MAX_ZOOM, Math.max(1, next));
    if (!natural || !frameW) {
      setZoom(z);
      return;
    }
    // Çerçeve merkezini sabit tutarak yakınlaştır.
    const oldScale = baseScale * zoom;
    const newScale = baseScale * z;
    const cx = (frameW / 2 - offset.x) / oldScale;
    const cy = (frameH / 2 - offset.y) / oldScale;
    const nx = frameW / 2 - cx * newScale;
    const ny = frameH / 2 - cy * newScale;
    const nDispW = natural.w * newScale;
    const nDispH = natural.h * newScale;
    setZoom(z);
    setOffset({
      x: Math.min(0, Math.max(frameW - nDispW, nx)),
      y: Math.min(0, Math.max(frameH - nDispH, ny)),
    });
  }

  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    setOffset(
      clamp({
        x: d.ox + (e.clientX - d.startX),
        y: d.oy + (e.clientY - d.startY),
      }),
    );
  }

  function onPointerUp(e: React.PointerEvent) {
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  function handleApply() {
    const img = imgRef.current;
    if (!img || !natural || !frameW) return;

    const sourceW = frameW / displayScale;
    const sourceH = frameH / displayScale;
    const sourceX = Math.min(
      Math.max(-offset.x / displayScale, 0),
      natural.w - sourceW,
    );
    const sourceY = Math.min(
      Math.max(-offset.y / displayScale, 0),
      natural.h - sourceH,
    );

    const outW = Math.round(Math.min(maxWidth, sourceW));
    const outH = Math.round(outW / aspect);

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      0,
      0,
      outW,
      outH,
    );

    const type = file.type === "image/png" ? "image/png" : "image/jpeg";
    canvas.toBlob(
      (blob) => {
        if (blob) onCrop(blob);
      },
      type,
      0.9,
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-4 shadow-2xl">
        <h3 className="mb-3 font-heading text-base font-bold">
          Görseli Çerçevele
        </h3>

        <div
          ref={frameRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative w-full touch-none select-none overflow-hidden rounded-lg border border-border bg-muted"
          style={{ aspectRatio: String(aspect), cursor: "grab" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt=""
            draggable={false}
            onLoad={initFromImg}
            className="pointer-events-none absolute left-0 top-0 max-w-none origin-top-left"
            style={{
              width: dispW ? `${dispW}px` : undefined,
              height: dispH ? `${dispH}px` : undefined,
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              visibility: natural ? "visible" : "hidden",
            }}
          />
          {!natural ? (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
              Görsel yükleniyor…
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <ZoomOut
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            aria-label="Yakınlaştır"
            className="h-1.5 w-full cursor-pointer accent-[color:var(--primary)]"
          />
          <ZoomIn
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Sürükleyerek konumlandır, kaydırıcıyla yakınlaştır.
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Vazgeç
          </Button>
          <Button type="button" onClick={handleApply}>
            Uygula
          </Button>
        </div>
      </div>
    </div>
  );
}
