"use client";

import * as React from "react";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  /** Önizlenecek görsel URL'i. Boşsa hiçbir şey gösterilmez. */
  url?: string;
  alt: string;
  /** Kapsayıcı boyut/oran sınıfları. */
  className?: string;
}

/**
 * URL alanları için canlı görsel önizleme. Görsel yüklenemezse (kırık URL)
 * bilgilendirici bir yer tutucu gösterir. Backend/upload gelene kadar
 * URL bazlı girişleri doğrulamayı kolaylaştırır.
 */
export function ImagePreview({ url, alt, className }: ImagePreviewProps) {
  // Hatalı URL'i tutarız; URL değişince türetilen `errored` kendiliğinden
  // sıfırlanır (effect + setState gerektirmez).
  const [erroredUrl, setErroredUrl] = React.useState<string | null>(null);
  const trimmed = url?.trim();
  const errored = erroredUrl === trimmed;

  if (!trimmed) return null;

  return (
    <div
      className={cn(
        "mt-2 flex h-32 w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30",
        className,
      )}
    >
      {errored ? (
        <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
          <ImageOff className="size-5" aria-hidden="true" />
          Görsel yüklenemedi
        </div>
      ) : (
        // Harici URL — next/image yerine img (backend/upload henüz yok).
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={trimmed}
          alt={alt}
          className="size-full object-cover"
          onError={() => setErroredUrl(trimmed)}
        />
      )}
    </div>
  );
}
