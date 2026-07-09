// Supabase Storage görsel yükleme yardımcıları. Public "assets" bucket'ına
// yükler ve herkese açık URL döner (bkz. supabase/storage.sql).

import { getSupabase } from "./client";

const BUCKET = "assets";

/** Türkçe karakterleri sadeleştirip URL-güvenli slug üretir. */
function slugify(value: string): string {
  const map: Record<string, string> = {
    ğ: "g",
    ü: "u",
    ş: "s",
    ı: "i",
    ö: "o",
    ç: "c",
  };
  return (
    value
      .toLocaleLowerCase("tr")
      .replace(/[ğüşıöç]/g, (c) => map[c] ?? c)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "dosya"
  );
}

interface UploadOptions {
  /** true ise dosya adı (slug'lanmış) kullanılır; değilse rastgele UUID. */
  useOriginalName?: boolean;
}

/**
 * Bir dosyayı public "assets" bucket'ına yükler ve public URL'ini döner.
 * Giriş yapmış kullanıcı gerektirir (Storage RLS politikası).
 */
export async function uploadFile(
  file: File,
  folder = "uploads",
  fallbackExt = "bin",
  options: UploadOptions = {},
): Promise<string> {
  const dot = file.name.lastIndexOf(".");
  const base = dot > 0 ? file.name.slice(0, dot) : file.name;
  const ext = (dot > 0 ? file.name.slice(dot + 1) : fallbackExt).toLowerCase();
  const name = options.useOriginalName ? slugify(base) : crypto.randomUUID();
  const path = `${folder}/${name}.${ext}`;

  const supabase = getSupabase();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Görsel yükler (uploadFile ince sarmalayıcı). */
export async function uploadImage(
  file: File,
  folder = "uploads",
): Promise<string> {
  return uploadFile(file, folder, "png");
}
