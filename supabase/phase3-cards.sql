-- Faz 3 — Sarı/kırmızı kart kayıtları
-- Maçlara kart kayıtları (jsonb) eklenir. Kart istatistikleri (İstatistikler
-- sayfası) bu kayıtlardan türetilir. Supabase SQL Editor'de bir kez çalıştırın.
--
-- Yapı: [{ "playerId": "...", "type": "yellow" | "red" }, ...]

alter table public.matches
  add column if not exists cards jsonb not null default '[]'::jsonb;
