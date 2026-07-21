-- Faz 7 — Kullanıcı tarafından yönetilen dinamik lig/gruplar
-- Supabase SQL Editor'de bir kez çalıştırın.

create table if not exists public.league_groups (
  name       text primary key check (char_length(btrim(name)) between 1 and 80),
  created_at timestamptz not null default now()
);

-- Eski boş değerleri temizle, mevcut A/B gibi değerleri grup kaydına dönüştür.
update public.teams
set group_name = null
where group_name is not null and btrim(group_name) = '';

insert into public.league_groups (name)
select distinct group_name
from public.teams
where group_name is not null
on conflict (name) do nothing;

-- Yeni esnek yapı için başlangıç grubu.
insert into public.league_groups (name)
values ('Trendgol Yaz Ligi')
on conflict (name) do nothing;

alter table public.league_groups enable row level security;

drop policy if exists "public read league groups" on public.league_groups;
drop policy if exists "auth write league groups" on public.league_groups;

create policy "public read league groups" on public.league_groups
  for select using (true);

create policy "auth write league groups" on public.league_groups
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Grup yeniden adlandırılırsa takım da güncellenir; silinirse takım grupsuz kalır.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'teams_group_name_fkey'
      and conrelid = 'public.teams'::regclass
  ) then
    alter table public.teams
      add constraint teams_group_name_fkey
      foreign key (group_name)
      references public.league_groups(name)
      on update cascade
      on delete set null;
  end if;
end $$;
