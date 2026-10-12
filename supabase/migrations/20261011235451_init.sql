-- MCC MNU — Stage B initial schema.
-- Version-controlled migration. NOT applied to any remote project.
-- Standard PostgreSQL + RLS so this can be ported to Azure PostgreSQL later.
--
-- Tables (7):
--   teams, profiles, tracks, courses, lessons, content_items, applications
--
-- Every content table carries a `published` flag so public reads only ever see
-- published rows and admin edits happen as drafts.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Enum types
-- ---------------------------------------------------------------------------
do $$ begin
  create type app_role as enum ('admin', 'leader', 'member');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_kind as enum
    ('event', 'project', 'opportunity', 'news', 'achievement');
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum
    ('pending', 'reviewing', 'accepted', 'rejected', 'withdrawn');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- teams — operational teams (club-wide membership)
-- ---------------------------------------------------------------------------
create table if not exists public.teams (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.teams is
  'Operational teams. Public may read published rows only.';

-- ---------------------------------------------------------------------------
-- profiles — 1:1 with auth.users. Role lives here, server-enforced via RLS.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        app_role not null default 'member',
  display_name text,
  team_id     uuid references public.teams(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint profiles_display_name_len check
    (display_name is null or char_length(display_name) between 1 and 120)
);

create index if not exists profiles_team_id_idx on public.profiles (team_id);
create index if not exists profiles_role_idx on public.profiles (role);

comment on table public.profiles is
  'One row per auth user. `role` is the server-side authorization source of truth.';

-- ---------------------------------------------------------------------------
-- tracks — public learning tracks
-- ---------------------------------------------------------------------------
create table if not exists public.tracks (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  description text,
  color       text,
  icon        text,
  duration    text,
  featured    boolean not null default false,
  published   boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint tracks_title_len check (char_length(title) between 1 and 160),
  constraint tracks_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

comment on column public.tracks.duration is
  'Editorial total duration label (e.g. ''4h 20m''). Course count is computed from courses, not stored.';

create index if not exists tracks_published_idx on public.tracks (published);
create index if not exists tracks_position_idx on public.tracks (position);

-- ---------------------------------------------------------------------------
-- courses — belong to a track
-- ---------------------------------------------------------------------------
create table if not exists public.courses (
  id          uuid primary key default gen_random_uuid(),
  track_id    uuid not null references public.tracks(id) on delete restrict,
  slug        text not null unique,
  title       text not null,
  description text,
  level       text,
  color       text,
  thumbnail   text,
  duration    text,
  featured    boolean not null default false,
  published   boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint courses_title_len check (char_length(title) between 1 and 160),
  constraint courses_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

comment on column public.courses.duration is
  'Editorial duration label (e.g. ''2h 40m''). Lesson count is computed from lessons, not stored.';

create index if not exists courses_track_id_idx on public.courses (track_id);
create index if not exists courses_published_idx on public.courses (published);

-- ---------------------------------------------------------------------------
-- lessons — belong to a course, ordered by position
-- ---------------------------------------------------------------------------
create table if not exists public.lessons (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references public.courses(id) on delete restrict,
  slug       text not null,
  title      text not null,
  duration   text,
  type       text,
  published  boolean not null default false,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lessons_title_len check (char_length(title) between 1 and 200),
  constraint lessons_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint lessons_position_nonneg check (position >= 0),
  unique (course_id, slug)
);

create index if not exists lessons_course_id_idx on public.lessons (course_id);
create index if not exists lessons_course_position_idx on public.lessons (course_id, position);

-- ---------------------------------------------------------------------------
-- content_items — polymorphic public content (events/projects/etc.)
-- Hybrid model: typed columns hold fields that need reliable filtering,
-- sorting, or querying. `meta` (jsonb) holds optional, display-only attributes.
-- Kind-specific typed columns are nullable and are only meaningful for their
-- kind; a CHECK guards against using a date column for the wrong kind.
-- ---------------------------------------------------------------------------
create table if not exists public.content_items (
  id             uuid primary key default gen_random_uuid(),
  kind           content_kind not null,
  slug           text not null unique,
  title          text not null,
  description    text,
  body           text,
  category       text,
  meta           jsonb not null default '{}'::jsonb,
  featured       boolean not null default false,
  published      boolean not null default false,
  -- events
  event_date     date,
  event_time     text,
  location       text,
  -- opportunities (deliberately NOT stored in event_date)
  opportunity_date date,
  deadline       date,
  link           text,
  -- projects
  long_description text,
  technologies   text[],
  github_url     text,
  demo_url       text,
  thumbnail      text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint content_items_title_len check (char_length(title) between 1 and 200),
  constraint content_items_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint content_items_meta_object check (jsonb_typeof(meta) = 'object'),
  constraint content_items_technologies_array check (technologies is null or cardinality(technologies) between 1 and 40),
  -- Kind-specific typed columns may only be populated on their own kind; each
  -- group is all-NULL for every other kind. (Comments kept out of the
  -- expression body: psql treats `--` as a line comment and would otherwise
  -- swallow the newline, merging lines and breaking the syntax.)
  constraint content_items_typed_columns_match_kind check (
    ((event_date is null and event_time is null and location is null) or kind = 'event')
    and
    ((opportunity_date is null and deadline is null and link is null) or kind = 'opportunity')
    and
    ((long_description is null and technologies is null and github_url is null and demo_url is null and thumbnail is null) or kind = 'project')
  )
);

create index if not exists content_items_kind_published_idx
  on public.content_items (kind, published);
create index if not exists content_items_published_idx
  on public.content_items (published);
create index if not exists content_items_meta_gin_idx
  on public.content_items using gin (meta);
-- Sortable/filterable typed columns.
create index if not exists content_items_event_date_idx
  on public.content_items (event_date) where kind = 'event';
create index if not exists content_items_deadline_idx
  on public.content_items (deadline) where kind = 'opportunity';
create index if not exists content_items_technologies_gin_idx
  on public.content_items using gin (technologies);

comment on column public.content_items.meta is
  'Optional display-only attributes. Application-layer validated; not used for filtering/sorting.';
comment on column public.content_items.event_date is
  'Event start date (kind = event only). Paired with event_time (display label) and location.';
comment on column public.content_items.opportunity_date is
  'Opportunity listing date (kind = opportunity only). Distinct from deadline; never stored in event_date.';
comment on column public.content_items.deadline is
  'Application/submission deadline (kind = opportunity only).';
comment on column public.content_items.technologies is
  'Technologies used (kind = project only). GIN-indexed for containment queries.';

-- ---------------------------------------------------------------------------
-- resources — curated links with optional course/lesson associations.
-- ---------------------------------------------------------------------------
create table if not exists public.resources (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  description text,
  link        text,
  external    boolean not null default false,
  category    text,
  icon        text,
  course_id   uuid references public.courses(id) on delete set null,
  lesson_id   uuid references public.lessons(id) on delete set null,
  published   boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint resources_title_len check (char_length(title) between 1 and 200),
  constraint resources_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint resources_link_len check (link is null or char_length(link) <= 2048)
);

create index if not exists resources_published_idx on public.resources (published);
create index if not exists resources_position_idx on public.resources (position);
create index if not exists resources_course_id_idx on public.resources (course_id);
create index if not exists resources_lesson_id_idx on public.resources (lesson_id);

comment on table public.resources is
  'Curated learning resources. Public may read published rows only. Optional FKs link a resource to a course or lesson.';

-- ---------------------------------------------------------------------------
-- applications — join-form submissions. NEVER publicly readable.
-- ---------------------------------------------------------------------------
create table if not exists public.applications (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  email          text not null,
  interests      text[] not null default '{}',
  motivation     text,
  heard_from     text,
  status         application_status not null default 'pending',
  submitted_ip   inet,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint applications_name_len check (char_length(name) between 1 and 120),
  constraint applications_email_len check (char_length(email) between 3 and 254),
  constraint applications_email_shape check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint applications_motivation_len check
    (motivation is null or char_length(motivation) <= 3000),
  constraint applications_heard_from_len check
    (heard_from is null or char_length(heard_from) <= 200),
  constraint applications_interests_len check (cardinality(interests) between 1 and 20)
);

-- One application per email per recruitment cycle. No `cycle_id` column exists
-- yet, so this enforces global uniqueness of a normalized (lowercased) email.
create unique index if not exists applications_email_unique_idx
  on public.applications (lower(email));

create index if not exists applications_status_idx on public.applications (status);
create index if not exists applications_created_at_idx on public.applications (created_at desc);

comment on table public.applications is
  'Join-form submissions. Insert-only for anonymous users; select/update admin-only.';

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now(); -- pg_catalog is implicitly searched even when empty
  return new;
end;
$$;

drop trigger if exists teams_set_updated_at on public.teams;
create trigger teams_set_updated_at
  before update on public.teams
  for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists tracks_set_updated_at on public.tracks;
create trigger tracks_set_updated_at
  before update on public.tracks
  for each row execute function public.set_updated_at();

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

drop trigger if exists lessons_set_updated_at on public.lessons;
create trigger lessons_set_updated_at
  before update on public.lessons
  for each row execute function public.set_updated_at();

drop trigger if exists content_items_set_updated_at on public.content_items;
create trigger content_items_set_updated_at
  before update on public.content_items
  for each row execute function public.set_updated_at();

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

drop trigger if exists resources_set_updated_at on public.resources;
create trigger resources_set_updated_at
  before update on public.resources
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Authorization helper. SECURITY DEFINER so RLS on `profiles` cannot recurse
-- into itself when a policy asks "is this actor an admin?".
-- ---------------------------------------------------------------------------
create or replace function public.current_app_role()
returns app_role
language sql
security definer
set search_path = ''
stable
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select coalesce(public.current_app_role() = 'admin', false);
$$;

-- ---------------------------------------------------------------------------
-- Role-change guard. SECURITY DEFINER so it can read the caller's role from
-- `profiles` even while a trigger on `profiles` is mid-update (avoids RLS
-- recursion). Blocks any change to `role` unless the actor is an admin.
-- `admin_set_profile_role()` (below) is the sanctioned path for role changes;
-- this trigger is defense-in-depth in case a policy is ever misconfigured.
-- ---------------------------------------------------------------------------
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role then
    if not public.is_admin() then
      raise exception 'only administrators can change profile roles';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role
  before update on public.profiles
  for each row
  execute function public.protect_profile_role();

-- ---------------------------------------------------------------------------
-- Sanctioned role-change API. SECURITY DEFINER + pinned search_path.
-- Verifies the caller is an admin before touching `role`.
-- RLS and column grants are bypassed by design (definer), so the ONLY gate is
-- the explicit is_admin() check here. Execution is granted only to authenticated.
-- ---------------------------------------------------------------------------
create or replace function public.admin_set_profile_role(
  target_user_id uuid,
  new_role app_role
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;
  if not public.is_admin() then
    raise exception 'only administrators can change profile roles';
  end if;
  update public.profiles
     set role = new_role
   where id = target_user_id;
  if not found then
    raise exception 'profile % not found', target_user_id;
  end if;
end;
$$;

-- Restrict execution: not PUBLIC, not anon; only authenticated users (admins).
revoke execute on function public.admin_set_profile_role(uuid, app_role)
  from public, anon;
grant execute on function public.admin_set_profile_role(uuid, app_role)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Function execution privileges.
-- Every function is EXECUTE-by-PUBLIC by default, which the advisor reports as
-- "executable by anon". Revoking the default and re-granting narrowly:
--   * trigger functions are invoked by the trigger machinery, never by clients;
--   * current_app_role() is an internal helper called only by is_admin();
--   * is_admin() is called by RLS policies, which are scoped `to authenticated`
--     (see below), so only authenticated needs it;
--   * admin_set_profile_role() stays authenticated-only and is gated in-body.
-- SECURITY DEFINER bodies always run as the owner, which retains EXECUTE, so
-- revoking from clients cannot break cross-function calls inside those bodies.
-- ---------------------------------------------------------------------------
revoke execute on function public.set_updated_at()
  from public, anon, authenticated;
revoke execute on function public.protect_profile_role()
  from public, anon, authenticated;
revoke execute on function public.current_app_role()
  from public, anon, authenticated;
revoke execute on function public.is_admin()
  from public, anon;
grant execute on function public.is_admin()
  to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.teams          enable row level security;
alter table public.profiles       enable row level security;
alter table public.tracks         enable row level security;
alter table public.courses        enable row level security;
alter table public.lessons        enable row level security;
alter table public.content_items  enable row level security;
alter table public.applications   enable row level security;
alter table public.resources      enable row level security;

-- teams: anyone may read published; admins may create/update/delete.
drop policy if exists teams_public_read on public.teams;
create policy teams_public_read on public.teams
  for select to anon, authenticated
  using (published = true);

drop policy if exists teams_admin_insert on public.teams;
create policy teams_admin_insert on public.teams
  for insert to authenticated with check (public.is_admin());

drop policy if exists teams_admin_update on public.teams;
create policy teams_admin_update on public.teams
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists teams_admin_delete on public.teams;
create policy teams_admin_delete on public.teams
  for delete to authenticated using (public.is_admin());

-- profiles: users read/update their own row; admins read all and may set role/team.
-- Merged into ONE select policy: two permissive SELECT policies (own + admin)
-- overlap and are reported by the advisor, and each query then evaluates a
-- single policy. `to authenticated` keeps anon away from profiles entirely, so
-- anon never evaluates is_admin() (it no longer has EXECUTE on it). auth.uid()
-- is wrapped in a subquery so it is evaluated once per query, not once per row.
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_admin_select on public.profiles;
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id or public.is_admin());

-- Update: ONE policy (own row OR admin) so there is no overlapping pair and
-- each query evaluates a single policy. Row identity: a non-admin can only
-- touch their own row; an admin can touch any row. The policy still cannot
-- express "role must not change", because RLS WITH CHECK evaluates only the
-- proposed NEW row and has no access to the OLD row. Column-level `role`
-- protection is enforced by:
--   (a) the column-level GRANT (authenticated lacks UPDATE on `role`/`id`), and
--   (b) the `profiles_protect_role` BEFORE UPDATE trigger.
-- Role changes reach the table only via admin_set_profile_role(), which the
-- trigger permits because is_admin() is true for an administrator caller.
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_admin_update on public.profiles;
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id or public.is_admin())
  with check ((select auth.uid()) = id or public.is_admin());

-- No anonymous insert into profiles. Account creation is via Supabase Auth,
-- which is trusted to create the auth.users row; the profile row is created by
-- the admin bootstrap process or a trusted server path using the service role.

-- tracks: public read published; admin write.
drop policy if exists tracks_public_read on public.tracks;
create policy tracks_public_read on public.tracks
  for select to anon, authenticated
  using (published = true);

drop policy if exists tracks_admin_insert on public.tracks;
create policy tracks_admin_insert on public.tracks
  for insert to authenticated with check (public.is_admin());

drop policy if exists tracks_admin_update on public.tracks;
create policy tracks_admin_update on public.tracks
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists tracks_admin_delete on public.tracks;
create policy tracks_admin_delete on public.tracks
  for delete to authenticated using (public.is_admin());

-- courses: public read published; admin write.
drop policy if exists courses_public_read on public.courses;
create policy courses_public_read on public.courses
  for select to anon, authenticated
  using (published = true);

drop policy if exists courses_admin_insert on public.courses;
create policy courses_admin_insert on public.courses
  for insert to authenticated with check (public.is_admin());

drop policy if exists courses_admin_update on public.courses;
create policy courses_admin_update on public.courses
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists courses_admin_delete on public.courses;
create policy courses_admin_delete on public.courses
  for delete to authenticated using (public.is_admin());

-- lessons: public read published; admin write.
drop policy if exists lessons_public_read on public.lessons;
create policy lessons_public_read on public.lessons
  for select to anon, authenticated
  using (published = true);

drop policy if exists lessons_admin_insert on public.lessons;
create policy lessons_admin_insert on public.lessons
  for insert to authenticated with check (public.is_admin());

drop policy if exists lessons_admin_update on public.lessons;
create policy lessons_admin_update on public.lessons
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists lessons_admin_delete on public.lessons;
create policy lessons_admin_delete on public.lessons
  for delete to authenticated using (public.is_admin());

-- content_items: public read published; admin write.
drop policy if exists content_items_public_read on public.content_items;
create policy content_items_public_read on public.content_items
  for select to anon, authenticated
  using (published = true);

drop policy if exists content_items_admin_insert on public.content_items;
create policy content_items_admin_insert on public.content_items
  for insert to authenticated with check (public.is_admin());

drop policy if exists content_items_admin_update on public.content_items;
create policy content_items_admin_update on public.content_items
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists content_items_admin_delete on public.content_items;
create policy content_items_admin_delete on public.content_items
  for delete to authenticated using (public.is_admin());

-- resources: public read published; admin write.
drop policy if exists resources_public_read on public.resources;
create policy resources_public_read on public.resources
  for select to anon, authenticated
  using (published = true);

drop policy if exists resources_admin_insert on public.resources;
create policy resources_admin_insert on public.resources
  for insert to authenticated with check (public.is_admin());

drop policy if exists resources_admin_update on public.resources;
create policy resources_admin_update on public.resources
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists resources_admin_delete on public.resources;
create policy resources_admin_delete on public.resources
  for delete to authenticated using (public.is_admin());

-- applications: anonymous may INSERT only. No SELECT/UPDATE/DELETE for anon.
-- Admins may select and update status. The insert policy also blocks an anon
-- user from choosing a non-pending status.
drop policy if exists applications_anon_insert on public.applications;
create policy applications_anon_insert on public.applications
  for insert with check (status = 'pending');

drop policy if exists applications_admin_select on public.applications;
create policy applications_admin_select on public.applications
  for select to authenticated using (public.is_admin());

drop policy if exists applications_admin_update on public.applications;
create policy applications_admin_update on public.applications
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists applications_admin_delete on public.applications;
create policy applications_admin_delete on public.applications
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Column-level GRANT hardening for `profiles`.
-- Defense-in-depth: even if a policy were misconfigured, a non-admin cannot
-- write `id` or `role` because they lack the table/column privilege. Role
-- changes go exclusively through admin_set_profile_role(); identity (id) and
-- role are never writable by the row owner.
-- ---------------------------------------------------------------------------
revoke update on table public.profiles from authenticated;
grant update (display_name, team_id) on table public.profiles to authenticated;
