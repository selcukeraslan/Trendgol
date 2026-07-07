// Supabase Storage görsel yükleme yardımcıları. Public "assets" bucket'ına
// yükler ve herkese açık URL döner (bkz. supabase/storage.sql).

import { getSupabase } from "./client";

const BUCKET = "assets";

/**
 * Bir görsel dosyasını yükler ve public URL'ini döner.
 * Giriş yapmış kullanıcı gerektirir (Storage RLS politikası).
 */
export async function uploadImage(
  file: File,
  folder = "uploads",
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const supabase = getSupabase();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
