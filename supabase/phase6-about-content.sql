-- Faz 6 — "Biz Kimiz" sayfasının admin panelinden yönetilmesi
-- Supabase SQL Editor'de bir kez çalıştırın. Mevcut görünümdeki metinler
-- varsayılan değer olarak eklenir; mevcut site_settings satırı korunur.

alter table public.site_settings
  add column if not exists about_eyebrow          text  not null default 'Hakkımızda',
  add column if not exists about_title            text  not null default 'Biz Kimiz',
  add column if not exists about_subtitle         text  not null default 'Halı saha futbolunu profesyonel bir lig deneyimine dönüştürüyoruz.',
  add column if not exists about_story_title      text  not null default 'Lig Hikayemiz',
  add column if not exists about_team_label       text  not null default 'Takım',
  add column if not exists about_prize_pool_label text  not null default 'Ödül Havuzu',
  add column if not exists about_season           text  not null default '2026',
  add column if not exists about_season_label     text  not null default 'Sezon',
  add column if not exists about_mission_title    text  not null default 'Misyonumuz',
  add column if not exists about_mission_text     text  not null default 'Her seviyeden futbolseveri, adil ve güvenilir bir ortamda buluşturmak; kazananı sahada belli olan, ödülü hak edenin aldığı bir lig deneyimi sunmak.',
  add column if not exists about_values_title     text  not null default 'Neden Bize Güvenmelisiniz?',
  add column if not exists about_values           jsonb not null default '[{"title":"Adil Rekabet","text":"Şeffaf fikstür ve tarafsız hakemlik ile her takıma eşit şans."},{"title":"Güvenilir Ödeme","text":"Katılım ve ödül süreçleri net, izlenebilir ve güvence altında."},{"title":"Profesyonel Organizasyon","text":"Amatör futbolu profesyonel bir işleyişle buluşturuyoruz."}]'::jsonb,
  add column if not exists about_cta_title         text  not null default 'Sen de aramıza katıl',
  add column if not exists about_cta_text          text  not null default 'Takımını kaydet, sahaya çık ve ödül havuzundan payını al.',
  add column if not exists about_cta_button_label  text  not null default 'Takımını Kaydet';
