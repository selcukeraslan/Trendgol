"use client";

import * as React from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { uploadImage } from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "@/components/common/image-preview";

interface ImageUploadProps {
  /** Mevcut görsel URL'i (yüklenince güncellenir). */
  value?: string;
  onChange: (url: string) => void;
  /** Storage içindeki klasör (ör. "logos", "teams", "blog"). */
  folder?: string;
  alt?: string;
  /** Önizleme kutusu boyut sınıfları. */
  previewClassName?: string;
}

/**
 * Dosya seçip Supabase Storage'a yükleyen, yüklenen görselin önizlemesini
 * gösteren yeniden kullanılabilir bileşen. URL alanlarının yerini alır.
 */
export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  alt = "Görsel",
  previewClassName,
}: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success("Görsel yüklendi.");
    } catch {
      toast.error("Yükleme başarısız. Tekrar deneyin.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
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
    </div>
  );
}
