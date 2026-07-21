-- Faz 9 — Hikâye ve katılım kartlarının admin panelinden yönetilmesi.
-- Supabase SQL Editor'de bir kez çalıştırın. Mevcut görünümdeki kartlar
-- varsayılan olarak eklenir ve sonrasında admin panelinden çoğaltılıp silinebilir.

alter table public.site_settings
  add column if not exists about_story_cards jsonb not null default
    '[{"label":"Takım","value":"","hint":"","icon":"users","valueSource":"teamCount","highlighted":false},{"label":"Ödül Havuzu","value":"","hint":"","icon":"trophy","valueSource":"prizePool","highlighted":false},{"label":"Sezon","value":"2026","hint":"","icon":"award","valueSource":"custom","highlighted":false}]'::jsonb,
  add column if not exists participation_cards jsonb not null default
    '[{"label":"Katılım Ücreti","value":"","hint":"Sezon başı, tek seferlik","icon":"wallet","valueSource":"entryFee","highlighted":false},{"label":"Maç Başı Ücret","value":"","hint":"Her maç öncesi","icon":"coins","valueSource":"perMatchFee","highlighted":false},{"label":"Ödül Havuzu","value":"","hint":"Sezon sonu şampiyona","icon":"trophy","valueSource":"prizePool","highlighted":true}]'::jsonb;
