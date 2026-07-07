-- Site logosu (dosya yükleme) için ek kurulum.
-- Supabase SQL Editor'de bir kez çalıştırın. Idempotent'tir (tekrar çalıştırılabilir).

-- 1) Ayarlara logo kolonu
alter table public.site_settings
  add column if not exists logo_url text;

-- 2) Görseller için public Storage bucket
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;

-- 3) Storage politikaları (herkes okur, giriş yapan yükler/günceller/siler)
drop policy if exists "public read assets"  on storage.objects;
drop policy if exists "auth upload assets"  on storage.objects;
drop policy if exists "auth update assets"  on storage.objects;
drop policy if exists "auth delete assets"  on storage.objects;

create policy "public read assets" on storage.objects
  for select using (bucket_id = 'assets');

create policy "auth upload assets" on storage.objects
  for insert with check (
    bucket_id = 'assets' and auth.role() = 'authenticated'
  );

create policy "auth update assets" on storage.objects
  for update using (
    bucket_id = 'assets' and auth.role() = 'authenticated'
  );

create policy "auth delete assets" on storage.objects
  for delete using (
    bucket_id = 'assets' and auth.role() = 'authenticated'
  );
