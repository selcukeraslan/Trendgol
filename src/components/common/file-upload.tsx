"use client";

import * as React from "react";
import { FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { uploadFile } from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  /** Mevcut dosya URL'i (yüklenince güncellenir). */
  value?: string;
  onChange: (url: string) => void;
  /** Storage içindeki klasör (ör. "rules"). */
  folder?: string;
  /** Kabul edilen dosya tipleri (input accept). */
  accept?: string;
  /** Yüklü dosya için görünen etiket. */
  label?: string;
}

/**
 * PDF gibi görsel olmayan dosyaları Supabase Storage'a yükleyen bileşen.
 * Yüklü dosyayı yeni sekmede açan bir link gösterir.
 */
export function FileUpload({
  value,
  onChange,
  folder = "uploads",
  accept = "application/pdf",
  label = "Yüklenen dosyayı görüntüle",
}: FileUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, folder, "pdf", {
        useOriginalName: true,
      });
      onChange(url);
      toast.success("Dosya yüklendi.");
    } catch {
      toast.error("Yükleme başarısız. Tekrar deneyin.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
        >
          <FileText className="size-4" aria-hidden="true" />
          {label}
        </a>
      ) : null}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
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
          {value ? "Değiştir" : "Dosya Yükle"}
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
