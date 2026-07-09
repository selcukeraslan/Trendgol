-- Faz 5 — Statik içerik admin'den düzenlenebilir + Kurallar PDF
-- site_settings tablosuna yeni içerik alanları eklenir. Supabase SQL Editor'de
-- bir kez çalıştırın. Mevcut satır varsayılan değerlerle güncellenir.

alter table public.site_settings
  add column if not exists rules_pdf_url       text,
  add column if not exists participation_terms jsonb not null default '[]'::jsonb,
  add column if not exists how_to_join_steps    jsonb not null default '[]'::jsonb,
  add column if not exists cta_title            text  not null default '',
  add column if not exists cta_text             text  not null default '',
  add column if not exists footer_description   text  not null default '';
