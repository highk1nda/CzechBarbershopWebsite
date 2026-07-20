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
-- reservations — source of truth for the booking system. date/time stored as
-- plain date+time (wall-clock, Europe/Prague implied), not timestamptz, to
-- avoid DST arithmetic — the whole frontend already works in "YYYY-MM-DD"/
-- "HH:MM" strings.
-- ---------------------------------------------------------------------------

create extension if not exists btree_gist;

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),

  reservation_date date not null,
  starts_at time not null,
  ends_at time not null,

  team_member_id uuid not null references team_members(id) on delete restrict,
  was_auto_assigned boolean not null default false,

  customer_name text not null,
  customer_email text,
  customer_phone text,
  notes text,

  status text not null default 'new' check (status in ('new', 'approved', 'done')),
  source text not null default 'online' check (source in ('online', 'admin')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint reservations_ends_after_starts_chk check (ends_at > starts_at),
  constraint reservations_contact_chk check (customer_email is not null or customer_phone is not null),

  -- Unbypassable guard: no two rows for the same specialist may have
  -- overlapping [starts_at, ends_at) ranges on the same date. Checked
  -- atomically by Postgres itself on every INSERT/UPDATE.
  constraint reservations_no_overlap exclude using gist (
    team_member_id with =,
    tsrange((reservation_date + starts_at), (reservation_date + ends_at), '[)') with &&
  )
);

create index if not exists reservations_date_idx on reservations(reservation_date);
create index if not exists reservations_team_member_id_idx on reservations(team_member_id);

drop trigger if exists trg_reservations_updated_at on reservations;
create trigger trg_reservations_updated_at
  before update on reservations
  for each row execute function set_updated_at();

-- Line items. service_id "on delete restrict" mirrors team_member_id above.
-- service_name_snapshot keeps admin history legible if a service is renamed later.
create table if not exists reservation_services (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references reservations(id) on delete cascade,
  service_id text not null references services(id) on delete restrict,
  service_name_snapshot text not null,
  unique (reservation_id, service_id)
);

create index if not exists reservation_services_reservation_id_idx on reservation_services(reservation_id);
create index if not exists reservation_services_service_id_idx on reservation_services(service_id);

-- Structured, admin-editable business hours — seed only if absent so a
-- re-run never clobbers an admin's later edits.
insert into site_settings (key, value) values
  ('booking_weekday_open', '09:00'),
  ('booking_weekday_close', '19:00'),
  ('booking_saturday_open', '09:00'),
  ('booking_saturday_close', '16:00'),
  ('booking_saturday_closed', 'false'),
  ('booking_sunday_closed', 'true')
on conflict (key) do nothing;

-- Retire the old free-text hours fields now that Contact.jsx / SiteContentPage.jsx
-- read the structured keys above instead.
delete from site_settings where key in ('hours_weekdays_time', 'hours_saturday_time', 'hours_sunday_closed');

-- ---------------------------------------------------------------------------
-- RLS for reservations: deliberately NOT added to the public_read/admin_write
-- loop below — that would expose every customer's name/email/phone/notes to
-- anon. Anon's entire surface on this data is the two SECURITY DEFINER
-- functions further down (get_booked_ranges / create_reservation).
-- ---------------------------------------------------------------------------

alter table reservations enable row level security;
drop policy if exists reservations_admin_all on reservations;
create policy reservations_admin_all on reservations
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter table reservation_services enable row level security;
drop policy if exists reservation_services_admin_all on reservation_services;
create policy reservation_services_admin_all on reservation_services
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- get_booked_ranges — PII-free availability read, callable by anon. Returns
-- only which specialist is booked when, never name/email/phone/notes/status.
-- ---------------------------------------------------------------------------

create or replace function get_booked_ranges(p_date date)
returns table(team_member_id uuid, starts_at time, ends_at time)
language sql
security definer
set search_path = public
stable
as $$
  select r.team_member_id, r.starts_at, r.ends_at
  from reservations r
  where r.reservation_date = p_date;
$$;

revoke all on function get_booked_ranges(date) from public;
grant execute on function get_booked_ranges(date) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- _book_reservation — shared internal implementation (not directly grantable
-- to anon/authenticated; only the two wrappers below call it). Computes
-- duration server-side from the LIVE services table (client never sends a
-- duration — nothing to spoof), applies the null-duration fallback, resolves
-- auto-assignment, and inserts. Concurrency safety comes from the EXCLUDE
-- constraint: on exclusion_violation we either report a conflict (explicit
-- specialist) or retry with a different free candidate (auto-assign).
-- ---------------------------------------------------------------------------

create or replace function _book_reservation(
  p_date date,
  p_starts_at time,
  p_service_ids text[],
  p_team_member_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_notes text,
  p_enforce_hours boolean,
  p_status text,
  p_source text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_duration_minutes int;
  v_ends_at time;
  v_dow int;
  v_open time; v_close time; v_closed boolean;
  v_team_member_id uuid;
  v_was_auto boolean := false;
  v_reservation_id uuid;
  v_service_count int;
  v_settings jsonb;
begin
  p_service_ids := array(select distinct unnest(p_service_ids));

  if p_customer_name is null or btrim(p_customer_name) = '' then
    return jsonb_build_object('status', 'error', 'code', 'missing_name');
  end if;
  if (p_customer_email is null or btrim(p_customer_email) = '')
     and (p_customer_phone is null or btrim(p_customer_phone) = '') then
    return jsonb_build_object('status', 'error', 'code', 'missing_contact');
  end if;
  if p_service_ids is null or array_length(p_service_ids, 1) is null then
    return jsonb_build_object('status', 'error', 'code', 'no_services');
  end if;
  if p_date < current_date then
    return jsonb_build_object('status', 'error', 'code', 'date_in_past');
  end if;
  -- Same-day: reject a start time that has already passed "now" in Prague.
  if p_date = current_date and p_starts_at < (now() at time zone 'Europe/Prague')::time then
    return jsonb_build_object('status', 'error', 'code', 'time_in_past');
  end if;

  select count(*) into v_service_count from services where id = any(p_service_ids) and active;
  if v_service_count <> array_length(p_service_ids, 1) then
    return jsonb_build_object('status', 'error', 'code', 'invalid_services');
  end if;

  select coalesce(sum(coalesce(duration_min_minutes, 60)), 0) into v_duration_minutes
  from services where id = any(p_service_ids) and active;

  v_ends_at := p_starts_at + (v_duration_minutes || ' minutes')::interval;
  if v_ends_at <= p_starts_at then -- midnight-wraparound guard
    return jsonb_build_object('status', 'error', 'code', 'invalid_duration');
  end if;

  if p_enforce_hours then
    select jsonb_object_agg(key, value) into v_settings from site_settings
      where key in ('booking_weekday_open','booking_weekday_close',
                    'booking_saturday_open','booking_saturday_close',
                    'booking_saturday_closed','booking_sunday_closed');
    v_dow := extract(dow from p_date); -- 0 Sun .. 6 Sat
    if v_dow = 0 then
      v_closed := coalesce((v_settings->>'booking_sunday_closed')::boolean, true);
      v_open := null; v_close := null;
    elsif v_dow = 6 then
      v_closed := coalesce((v_settings->>'booking_saturday_closed')::boolean, false);
      v_open := (v_settings->>'booking_saturday_open')::time;
      v_close := (v_settings->>'booking_saturday_close')::time;
    else
      v_closed := false;
      v_open := (v_settings->>'booking_weekday_open')::time;
      v_close := (v_settings->>'booking_weekday_close')::time;
    end if;
    if v_closed or v_open is null or v_close is null
       or p_starts_at < v_open or v_ends_at > v_close then
      return jsonb_build_object('status', 'error', 'code', 'outside_business_hours');
    end if;
  end if;

  if p_team_member_id is not null then
    if not exists (select 1 from team_members where id = p_team_member_id and active) then
      return jsonb_build_object('status', 'error', 'code', 'specialist_unavailable');
    end if;
    v_team_member_id := p_team_member_id;
    begin
      insert into reservations (reservation_date, starts_at, ends_at, team_member_id, was_auto_assigned,
        customer_name, customer_email, customer_phone, notes, status, source)
      values (p_date, p_starts_at, v_ends_at, v_team_member_id, false,
        btrim(p_customer_name), nullif(btrim(p_customer_email), ''), nullif(btrim(p_customer_phone), ''),
        nullif(btrim(p_notes), ''), p_status, p_source)
      returning id into v_reservation_id;
    exception when exclusion_violation then
      return jsonb_build_object('status', 'conflict', 'code', 'slot_taken');
    end;
  else
    -- No preference: tier 1 (qualified for every cart item + free), then
    -- tier 2 (any active + free). Retry on exclusion_violation picks a
    -- different free candidate instead of failing the whole booking.
    v_was_auto := true;
    for v_attempt in 1..3 loop
      select tm.id into v_team_member_id from team_members tm
        where tm.active
          and (select count(*) from service_workers sw
               where sw.team_member_id = tm.id and sw.service_id = any(p_service_ids)) = array_length(p_service_ids, 1)
          and not exists (select 1 from reservations r where r.team_member_id = tm.id
                and r.reservation_date = p_date and (r.starts_at, r.ends_at) overlaps (p_starts_at, v_ends_at))
        order by random() limit 1;

      if v_team_member_id is null then
        select tm.id into v_team_member_id from team_members tm
          where tm.active
            and not exists (select 1 from reservations r where r.team_member_id = tm.id
                  and r.reservation_date = p_date and (r.starts_at, r.ends_at) overlaps (p_starts_at, v_ends_at))
          order by random() limit 1;
      end if;

      if v_team_member_id is null then
        return jsonb_build_object('status', 'error', 'code', 'no_specialist_available');
      end if;

      begin
        insert into reservations (reservation_date, starts_at, ends_at, team_member_id, was_auto_assigned,
          customer_name, customer_email, customer_phone, notes, status, source)
        values (p_date, p_starts_at, v_ends_at, v_team_member_id, true,
          btrim(p_customer_name), nullif(btrim(p_customer_email), ''), nullif(btrim(p_customer_phone), ''),
          nullif(btrim(p_notes), ''), p_status, p_source)
        returning id into v_reservation_id;
        exit;
      exception when exclusion_violation then
        v_reservation_id := null; v_team_member_id := null;
      end;
    end loop;
    if v_reservation_id is null then
      return jsonb_build_object('status', 'conflict', 'code', 'slot_taken');
    end if;
  end if;

  insert into reservation_services (reservation_id, service_id, service_name_snapshot)
  select v_reservation_id, s.id, coalesce(st.name, s.id)
  from services s
  left join service_translations st on st.service_id = s.id and st.lang = 'cs'
  where s.id = any(p_service_ids);

  return jsonb_build_object('status', 'ok', 'reservation_id', v_reservation_id,
    'team_member_id', v_team_member_id, 'was_auto_assigned', v_was_auto,
    'starts_at', p_starts_at, 'ends_at', v_ends_at, 'duration_minutes', v_duration_minutes);
end;
$$;

revoke all on function _book_reservation(date, time, text[], uuid, text, text, text, text, boolean, text, text) from public;

-- Public wrapper — enforces business hours, always status 'new'/source 'online'.
create or replace function create_reservation(
  p_date date, p_starts_at time, p_service_ids text[],
  p_team_member_id uuid default null,
  p_customer_name text default null, p_customer_email text default null,
  p_customer_phone text default null, p_notes text default null
) returns jsonb language sql security definer set search_path = public as $$
  select _book_reservation(p_date, p_starts_at, p_service_ids, p_team_member_id,
    p_customer_name, p_customer_email, p_customer_phone, p_notes,
    true, 'new', 'online');
$$;
revoke all on function create_reservation(date, time, text[], uuid, text, text, text, text) from public;
grant execute on function create_reservation(date, time, text[], uuid, text, text, text, text) to anon, authenticated;

-- Admin wrapper — skips the business-hours gate (exceptional entries allowed),
-- lets admin set an explicit status, still fully protected by the EXCLUDE
-- constraint. Gated by both GRANT (below) and an in-function role check.
create or replace function admin_create_reservation(
  p_date date, p_starts_at time, p_service_ids text[],
  p_team_member_id uuid default null,
  p_customer_name text default null, p_customer_email text default null,
  p_customer_phone text default null, p_notes text default null,
  p_status text default 'approved'
) returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if auth.role() <> 'authenticated' then
    raise exception 'not_authorized' using errcode = '42501';
  end if;
  return _book_reservation(p_date, p_starts_at, p_service_ids, p_team_member_id,
    p_customer_name, p_customer_email, p_customer_phone, p_notes,
    false, p_status, 'admin');
end;
$$;
revoke all on function admin_create_reservation(date, time, text[], uuid, text, text, text, text, text) from public;
grant execute on function admin_create_reservation(date, time, text[], uuid, text, text, text, text, text) to authenticated;

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
