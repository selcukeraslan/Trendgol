-- Trendgol / Halı Saha Ligi — Supabase şeması
-- Supabase SQL Editor'de bu dosyayı çalıştırın (bir kez).
-- Kolon adları snake_case; uygulama tipleri camelCase (repository katmanında eşlenir).
-- Kimlikler mevcut seed ile uyum için TEXT; yeni kayıtlarda otomatik üretilir.

-- ============================ Tablolar ============================

create table if not exists public.teams (
  id          text primary key default gen_random_uuid()::text,
  name        text not null,
  logo_url    text,
  color       text not null,
  captain     text not null,
  description text not null,
  photo_url   text,
  created_at  timestamptz not null default now()
);

create table if not exists public.players (
  id       text primary key default gen_random_uuid()::text,
  team_id  text not null references public.teams(id) on delete cascade,
  name     text not null,
  number   int,
  position text
);

create table if not exists public.matches (
  id           text primary key default gen_random_uuid()::text,
  week         int not null,
  home_team_id text not null references public.teams(id) on delete cascade,
  away_team_id text not null references public.teams(id) on delete cascade,
  date         timestamptz not null,
  time         text not null,
  venue        text not null,
  status       text not null default 'scheduled',
  home_score   int,
  away_score   int,
  scorers      jsonb not null default '[]'::jsonb
);

create table if not exists public.blog_posts (
  id              text primary key default gen_random_uuid()::text,
  slug            text not null unique,
  title           text not null,
  excerpt         text not null,
  content         text not null,
  cover_image_url text,
  category        text not null,
  author          text not null,
  published_at    timestamptz not null default now(),
  featured        boolean not null default false,
  published       boolean not null default true
);

-- Tekil kayıt: sabit id 'default'.
create table if not exists public.site_settings (
  id            text primary key default 'default',
  hero_title    text not null,
  hero_subtitle text not null,
  about_text    text not null,
  contact       jsonb not null default '{}'::jsonb,
  sponsors      jsonb not null default '[]'::jsonb
);

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  team_name  text,
  message    text not null,
  created_at timestamptz not null default now()
);

-- ============================ RLS ============================
-- Public tablolar herkese OKUNUR; yazma yalnızca giriş yapmış (admin) kullanıcı.
-- İletişim mesajları: herkes EKLEYEBİLİR, yalnızca giriş yapan OKUYABİLİR.

alter table public.teams            enable row level security;
alter table public.players          enable row level security;
alter table public.matches          enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.site_settings    enable row level security;
alter table public.contact_messages enable row level security;

-- Okuma (anon + authenticated)
create policy "public read teams"     on public.teams         for select using (true);
create policy "public read players"   on public.players       for select using (true);
create policy "public read matches"   on public.matches       for select using (true);
create policy "public read blog"      on public.blog_posts    for select using (true);
create policy "public read settings"  on public.site_settings for select using (true);

-- Yazma (yalnızca authenticated)
create policy "auth write teams"    on public.teams         for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write players"  on public.players       for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write matches"  on public.matches       for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write blog"     on public.blog_posts    for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write settings" on public.site_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- İletişim mesajları
create policy "anyone insert contact" on public.contact_messages for insert
  with check (true);
create policy "auth read contact"     on public.contact_messages for select
  using (auth.role() = 'authenticated');
