-- MAISON beauty admin panel schema
-- Apply once via Supabase Studio SQL editor (or `supabase db execute -f supabase/schema.sql`).
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / CREATE OR REPLACE / DROP POLICY IF EXISTS).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- team_members
-- ---------------------------------------------------------------------------

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  photo_url text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_team_members_updated_at on team_members;
create trigger trg_team_members_updated_at
  before update on team_members
  for each row execute function set_updated_at();

create table if not exists team_member_translations (
  team_member_id uuid not null references team_members(id) on delete cascade,
  lang text not null check (lang in ('cs', 'en', 'uk')),
  name text not null,
  role text,
  primary key (team_member_id, lang)
);

-- ---------------------------------------------------------------------------
-- tabs (Dámské / Pánské & dětské / Kosmetika & Nehty)
-- ---------------------------------------------------------------------------

create table if not exists tabs (
  id uuid primary key default gen_random_uuid(),
  icon text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_tabs_updated_at on tabs;
create trigger trg_tabs_updated_at
  before update on tabs
  for each row execute function set_updated_at();

create table if not exists tab_translations (
  tab_id uuid not null references tabs(id) on delete cascade,
  lang text not null check (lang in ('cs', 'en', 'uk')),
  label text not null,
  heading text,
  description text,
  note text,
  primary key (tab_id, lang)
);

-- ---------------------------------------------------------------------------
-- categories (within a tab)
-- ---------------------------------------------------------------------------

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  tab_id uuid not null references tabs(id) on delete cascade,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_categories_updated_at on categories;
create trigger trg_categories_updated_at
  before update on categories
  for each row execute function set_updated_at();

create table if not exists category_translations (
  category_id uuid not null references categories(id) on delete cascade,
  lang text not null check (lang in ('cs', 'en', 'uk')),
  title text not null,
  primary key (category_id, lang)
);

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
-- id stays a human-readable text slug (not uuid): it's already load-bearing as
-- the booking cart's item key (BookingCartContext holds a Set<string> of these).

create table if not exists services (
  id text primary key,
  icon text,
  category_id uuid not null references categories(id) on delete cascade,

  price_min int,
  price_max int,
  price_open_ended boolean not null default false,
  price_unknown boolean not null default false,
  price_currency text not null default 'CZK',

  duration_min_minutes int,
  duration_max_minutes int,
  duration_up_to boolean not null default false,

  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint services_price_range_chk check (
    price_unknown or price_min is not null
  ),
  constraint services_price_order_chk check (
    price_max is null or price_min is null or price_max >= price_min
  ),
  constraint services_duration_order_chk check (
    duration_max_minutes is null or duration_min_minutes is null
      or duration_max_minutes >= duration_min_minutes
  )
);

create index if not exists services_category_id_idx on services(category_id);

drop trigger if exists trg_services_updated_at on services;
create trigger trg_services_updated_at
  before update on services
  for each row execute function set_updated_at();

create table if not exists service_translations (
  service_id text not null references services(id) on delete cascade,
  lang text not null check (lang in ('cs', 'en', 'uk')),
  name text not null,
  description text,
  details_text text,
  details_steps jsonb,
  primary key (service_id, lang)
);

create table if not exists service_photos (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references services(id) on delete cascade,
  url text not null,
  sort_order int not null default 0
);

create index if not exists service_photos_service_id_idx on service_photos(service_id);

create table if not exists service_workers (
  service_id text not null references services(id) on delete cascade,
  team_member_id uuid not null references team_members(id) on delete cascade,
  primary key (service_id, team_member_id)
);

-- ---------------------------------------------------------------------------
-- recommended_addons ("customers also book")
-- ---------------------------------------------------------------------------

create table if not exists recommended_addons (
  category_id uuid not null references categories(id) on delete cascade,
  service_id text not null references services(id) on delete cascade,
  sort_order int not null default 0,
  primary key (category_id, service_id)
);

-- ---------------------------------------------------------------------------
-- site_settings (untranslated singleton config: phone, email, address, ...)
-- ---------------------------------------------------------------------------

create table if not exists site_settings (
  key text primary key,
  value text
);

-- ---------------------------------------------------------------------------
-- site_content (translated marketing copy, dot-path keys e.g. "hero.tagline")
-- ---------------------------------------------------------------------------

create table if not exists site_content (
  key text not null,
  lang text not null check (lang in ('cs', 'en', 'uk')),
  value text not null,
  primary key (key, lang)
);

-- ---------------------------------------------------------------------------
-- Row Level Security: public read, authenticated write, everywhere.
-- Single admin account model — any authenticated session may write.
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'team_members', 'team_member_translations',
    'tabs', 'tab_translations',
    'categories', 'category_translations',
    'services', 'service_translations', 'service_photos', 'service_workers',
    'recommended_addons',
    'site_settings', 'site_content'
  ])
  loop
    execute format('alter table %I enable row level security', t);

    execute format('drop policy if exists %I on %I', t || '_public_read', t);
    execute format(
      'create policy %I on %I for select using (true)',
      t || '_public_read', t
    );

    execute format('drop policy if exists %I on %I', t || '_admin_write', t);
    execute format(
      'create policy %I on %I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')',
      t || '_admin_write', t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Storage: single public bucket for admin-uploaded photos.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('salon-media', 'salon-media', true)
on conflict (id) do nothing;

drop policy if exists salon_media_public_read on storage.objects;
create policy salon_media_public_read
  on storage.objects for select
  using (bucket_id = 'salon-media');

drop policy if exists salon_media_admin_write on storage.objects;
create policy salon_media_admin_write
  on storage.objects for all
  using (bucket_id = 'salon-media' and auth.role() = 'authenticated')
  with check (bucket_id = 'salon-media' and auth.role() = 'authenticated');
