"use client";

import * as React from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { uploadImage } from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "@/components/common/image-preview";
import { ImageCropper } from "@/components/common/image-cropper";

interface ImageUploadProps {
  /** Mevcut görsel URL'i (yüklenince güncellenir). */
  value?: string;
  onChange: (url: string) => void;
  /** Storage içindeki klasör (ör. "logos", "teams", "blog"). */
  folder?: string;
  alt?: string;
  /** Önizleme kutusu boyut sınıfları. */
  previewClassName?: string;
  /** Kırpma çerçevesi en-boy oranı (genişlik / yükseklik). Varsayılan kare. */
  aspect?: number;
}

/**
 * Dosya seçip kırpma/çerçeveleme sonrası Supabase Storage'a yükleyen,
 * yüklenen görselin önizlemesini gösteren yeniden kullanılabilir bileşen.
 */
export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  alt = "Görsel",
  previewClassName,
  aspect = 1,
}: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [pendingFile, setPendingFile] = React.useState<File | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (file) setPendingFile(file);
  }

  async function handleCropped(blob: Blob) {
    setPendingFile(null);
    setUploading(true);
    try {
      const ext = blob.type === "image/png" ? "png" : "jpg";
      const file = new File([blob], `image.${ext}`, { type: blob.type });
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success("Görsel yüklendi.");
    } catch {
      toast.error("Yükleme başarısız. Tekrar deneyin.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <ImagePreview url={value} alt={alt} className={previewClassName} />
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="size-4" aria-hidden="true" />
          )}
          {value ? "Değiştir" : "Görsel Yükle"}
        </Button>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
          >
            Kaldır
          </Button>
        ) : null}
      </div>

      {pendingFile ? (
        <ImageCropper
          file={pendingFile}
          aspect={aspect}
          onCancel={() => setPendingFile(null)}
          onCrop={handleCropped}
        />
      ) : null}
    </div>
  );
}
