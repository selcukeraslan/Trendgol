-- Faz 4 — A / B grupları
-- Takımlara grup alanı eklenir (null = grupsuz). Fikstür ve puan durumu grup
-- bazında ayrılır; istatistikler birleşik kalır. Supabase SQL Editor'de bir kez.
--
-- Değerler: 'A', 'B' veya null.

alter table public.teams
  add column if not exists group_name text;
