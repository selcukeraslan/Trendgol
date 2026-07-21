-- Faz 8 — İletişim sayfası Google Maps haritası
-- Supabase SQL Editor'de bir kez çalıştırın.

alter table public.site_settings
  add column if not exists map_embed_url text
  default 'https://www.google.com/maps?q=%C3%87engelk%C3%B6y%20Spor%20Kul%C3%BCb%C3%BC%20Tesisleri&output=embed';
