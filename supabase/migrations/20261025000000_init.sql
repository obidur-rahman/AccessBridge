-- AccessBridge initial schema (docs/05_BACKEND_SCHEMA.md).
-- Logical schema approved by the specification pack. Apply with the Supabase CLI
-- or the SQL editor. Review before running against a shared project.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enumerated value checks are plain CHECK constraints so a value change is a
-- visible migration instead of a hidden enum swap.
-- ---------------------------------------------------------------------------

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  name_en text,
  name_bn text,
  category text not null
    check (category in ('benefits', 'government', 'health', 'accessibility', 'transport', 'ngo')),
  place_type text,
  summary_en text,
  summary_bn text,
  address_en text,
  address_bn text,
  area_name text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  location_precision text not null default 'unknown'
    check (location_precision in ('verified', 'approximate', 'unknown')),
  phone_public text,
  email_public text,
  website_url text,
  source_type text
    check (source_type in ('official_source', 'organisation_source', 'reviewer_observation', 'community_report', 'other')),
  source_label text,
  source_url text,
  source_checked_at timestamptz,
  ingestion_method text not null default 'manual_research'
    check (ingestion_method in ('manual_research', 'structured_import', 'user_submission')),
  import_batch_id text,
  opening_hours jsonb,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'archived')),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listings_has_a_name check (coalesce(nullif(name_en, ''), nullif(name_bn, '')) is not null),
  constraint listings_publication_needs_source check (
    publication_status <> 'published'
    or (source_label is not null and source_checked_at is not null)
  )
);

create table public.accessibility_observations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  feature_states jsonb not null,
  notes_public text,
  observed_at date not null,
  source_type text not null
    check (source_type in ('official_source', 'organisation_source', 'reviewer_observation', 'community_report', 'other')),
  source_url text,
  source_label text,
  ingestion_method text not null default 'user_submission'
    check (ingestion_method in ('manual_research', 'structured_import', 'user_submission')),
  import_batch_id text,
  review_status text not null default 'pending'
    check (review_status in ('pending', 'accepted', 'rejected', 'needs_more_info')),
  reviewer_id uuid references auth.users (id),
  reviewed_at timestamptz,
  review_reason text,
  contact_private text,
  submitted_at timestamptz not null default now(),
  public_receipt_token text unique,
  constraint observations_feature_states_is_object check (jsonb_typeof(feature_states) = 'object'),
  constraint observations_accepted_needs_source check (
    review_status <> 'accepted'
    or (source_label is not null and observed_at is not null)
  ),
  constraint observations_notes_length check (notes_public is null or length(notes_public) <= 500)
);

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('reviewer', 'admin')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users (id),
  action text not null,
  entity_type text not null check (entity_type in ('listing', 'observation', 'profile')),
  entity_id uuid not null,
  reason text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes (docs/05 §6)
-- ---------------------------------------------------------------------------

create index listings_publication_status_idx on public.listings (publication_status);
create index listings_category_idx on public.listings (category);
create index listings_area_name_idx on public.listings (area_name);
create index listings_name_search_idx on public.listings
  using gin (to_tsvector('simple', coalesce(name_en, '') || ' ' || coalesce(name_bn, '')));

create index observations_listing_id_idx on public.accessibility_observations (listing_id);
create index observations_review_status_idx on public.accessibility_observations (review_status);
create index observations_observed_at_idx on public.accessibility_observations (observed_at desc);

-- ---------------------------------------------------------------------------
-- Staff helpers. SECURITY DEFINER so the role lookup is not blocked by RLS on
-- profiles, which would otherwise cause infinite recursion in policies.
-- ---------------------------------------------------------------------------

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.active
      and p.role in ('reviewer', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.active
      and p.role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Public read model. Views run with security_invoker so the caller's RLS
-- policies on the base tables still apply.
-- ---------------------------------------------------------------------------

create view public.public_listings
with (security_invoker = true)
as
select
  id,
  name_en,
  name_bn,
  category,
  place_type,
  summary_en,
  summary_bn,
  address_en,
  address_bn,
  area_name,
  latitude,
  longitude,
  location_precision,
  phone_public,
  email_public,
  website_url,
  source_label,
  source_url,
  source_checked_at
from public.listings
where publication_status = 'published';

-- One row per accepted feature value.
create view public.public_feature_observations
with (security_invoker = true)
as
select
  o.id as observation_id,
  o.listing_id,
  f.key as feature_key,
  f.value as state,
  o.observed_at,
  o.source_type,
  o.source_label,
  o.source_url,
  o.notes_public,
  o.submitted_at
from public.accessibility_observations o
cross join lateral jsonb_each_text(o.feature_states) as f (key, value)
where o.review_status = 'accepted';

-- Latest accepted edition of each feature. Older rows stay in the base table
-- for history.
create view public.public_current_features
with (security_invoker = true)
as
select distinct on (listing_id, feature_key)
  listing_id,
  feature_key,
  state,
  observed_at,
  source_type,
  source_label,
  source_url,
  notes_public,
  submitted_at
from public.public_feature_observations
order by listing_id, feature_key, observed_at desc, submitted_at desc;

grant select on public.public_listings to anon, authenticated;
grant select on public.public_feature_observations to anon, authenticated;
grant select on public.public_current_features to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security (docs/05 §5)
-- ---------------------------------------------------------------------------

alter table public.listings enable row level security;
alter table public.accessibility_observations enable row level security;
alter table public.profiles enable row level security;
alter table public.audit_log enable row level security;

-- Listings: the public sees published records only. Staff see everything.
create policy listings_public_read on public.listings
  for select to anon, authenticated
  using (publication_status = 'published');

create policy listings_staff_read on public.listings
  for select to authenticated
  using (public.is_staff());

create policy listings_staff_write on public.listings
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Observations: the public sees accepted records only.
create policy observations_public_read on public.accessibility_observations
  for select to anon, authenticated
  using (review_status = 'accepted');

create policy observations_staff_read on public.accessibility_observations
  for select to authenticated
  using (public.is_staff());

create policy observations_staff_write on public.accessibility_observations
  for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Anonymous submissions are allowed only through a narrowly scoped insert
-- policy. The server endpoint validates the payload first, then inserts with
-- the publishable key. A report can only arrive as pending: it cannot be born
-- accepted, cannot name a reviewer, and cannot publish a listing.
create policy observations_anon_insert on public.accessibility_observations
  for insert to anon
  with check (
    review_status = 'pending'
    and reviewer_id is null
    and reviewed_at is null
    and review_reason is null
    and ingestion_method = 'user_submission'
    and public_receipt_token is not null
    and listing_id is not null
  );

create policy listings_anon_insert on public.listings
  for insert to anon
  with check (
    publication_status = 'draft'
    and ingestion_method = 'user_submission'
    and source_label is not null
    and source_checked_at is not null
    and created_by is null
  );

-- Profiles: a user reads their own row. Admins manage all rows.
create policy profiles_self_read on public.profiles
  for select to authenticated
  using (user_id = auth.uid());

create policy profiles_admin_all on public.profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No one may change their own role: the admin policy is the only write path.

-- Audit log: staff may append. Only admins read the log.
create policy audit_staff_insert on public.audit_log
  for insert to authenticated
  with check (public.is_staff() and actor_id = auth.uid());

create policy audit_admin_read on public.audit_log
  for select to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Table privileges. RLS narrows these; it never replaces them.
-- ---------------------------------------------------------------------------

grant select on public.listings to anon, authenticated;
grant select on public.accessibility_observations to anon, authenticated;
grant insert on public.listings to anon;
grant insert on public.accessibility_observations to anon;
grant update on public.listings to authenticated;
grant update on public.accessibility_observations to authenticated;
grant select on public.profiles to authenticated;
grant insert on public.audit_log to authenticated;
grant select on public.audit_log to authenticated;
