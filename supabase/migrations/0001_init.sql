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
  featured    boolean not null default false,
  published   boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint tracks_title_len check (char_length(title) between 1 and 160),
  constraint tracks_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

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
  featured    boolean not null default false,
  published   boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint courses_title_len check (char_length(title) between 1 and 160),
  constraint courses_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

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
-- Keeps one table instead of five sparse ones. `meta` holds kind-specific data.
-- ---------------------------------------------------------------------------
create table if not exists public.content_items (
  id          uuid primary key default gen_random_uuid(),
  kind        content_kind not null,
  slug        text not null unique,
  title       text not null,
  description text,
  body        text,
  meta        jsonb not null default '{}'::jsonb,
  featured    boolean not null default false,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint content_items_title_len check (char_length(title) between 1 and 200),
  constraint content_items_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint content_items_meta_object check (jsonb_typeof(meta) = 'object')
);

create index if not exists content_items_kind_published_idx
  on public.content_items (kind, published);
create index if not exists content_items_published_idx
  on public.content_items (published);
create index if not exists content_items_meta_gin_idx
  on public.content_items using gin (meta);

comment on column public.content_items.meta is
  'Kind-specific fields (date, location, technologies, links, ...). Application-layer validated.';

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
as $$
begin
  new.updated_at := now();
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

-- ---------------------------------------------------------------------------
-- Authorization helper. SECURITY DEFINER so RLS on `profiles` cannot recurse
-- into itself when a policy asks "is this actor an admin?".
-- ---------------------------------------------------------------------------
create or replace function public.current_app_role()
returns app_role
language sql
security definer
set search_path = public
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
set search_path = public
stable
as $$
  select coalesce(public.current_app_role() = 'admin', false);
$$;

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

-- teams: anyone may read published; admins may create/update/delete.
drop policy if exists teams_public_read on public.teams;
create policy teams_public_read on public.teams
  for select using (published = true or public.is_admin());

drop policy if exists teams_admin_insert on public.teams;
create policy teams_admin_insert on public.teams
  for insert with check (public.is_admin());

drop policy if exists teams_admin_update on public.teams;
create policy teams_admin_update on public.teams
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists teams_admin_delete on public.teams;
create policy teams_admin_delete on public.teams
  for delete using (public.is_admin());

-- profiles: users read/update their own row; admins read all and may set role/team.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

drop policy if exists profiles_admin_select on public.profiles;
create policy profiles_admin_select on public.profiles
  for select using (public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- No anonymous insert into profiles. Account creation is via Supabase Auth,
-- which is trusted to create the auth.users row; the profile row is created by
-- the admin bootstrap process or a trusted server path using the service role.

-- tracks: public read published; admin write.
drop policy if exists tracks_public_read on public.tracks;
create policy tracks_public_read on public.tracks
  for select using (published = true or public.is_admin());

drop policy if exists tracks_admin_insert on public.tracks;
create policy tracks_admin_insert on public.tracks
  for insert with check (public.is_admin());

drop policy if exists tracks_admin_update on public.tracks;
create policy tracks_admin_update on public.tracks
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists tracks_admin_delete on public.tracks;
create policy tracks_admin_delete on public.tracks
  for delete using (public.is_admin());

-- courses: public read published; admin write.
drop policy if exists courses_public_read on public.courses;
create policy courses_public_read on public.courses
  for select using (published = true or public.is_admin());

drop policy if exists courses_admin_insert on public.courses;
create policy courses_admin_insert on public.courses
  for insert with check (public.is_admin());

drop policy if exists courses_admin_update on public.courses;
create policy courses_admin_update on public.courses
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists courses_admin_delete on public.courses;
create policy courses_admin_delete on public.courses
  for delete using (public.is_admin());

-- lessons: public read published; admin write.
drop policy if exists lessons_public_read on public.lessons;
create policy lessons_public_read on public.lessons
  for select using (published = true or public.is_admin());

drop policy if exists lessons_admin_insert on public.lessons;
create policy lessons_admin_insert on public.lessons
  for insert with check (public.is_admin());

drop policy if exists lessons_admin_update on public.lessons;
create policy lessons_admin_update on public.lessons
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists lessons_admin_delete on public.lessons;
create policy lessons_admin_delete on public.lessons
  for delete using (public.is_admin());

-- content_items: public read published; admin write.
drop policy if exists content_items_public_read on public.content_items;
create policy content_items_public_read on public.content_items
  for select using (published = true or public.is_admin());

drop policy if exists content_items_admin_insert on public.content_items;
create policy content_items_admin_insert on public.content_items
  for insert with check (public.is_admin());

drop policy if exists content_items_admin_update on public.content_items;
create policy content_items_admin_update on public.content_items
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists content_items_admin_delete on public.content_items;
create policy content_items_admin_delete on public.content_items
  for delete using (public.is_admin());

-- applications: anonymous may INSERT only. No SELECT/UPDATE/DELETE for anon.
-- Admins may select and update status. The insert policy also blocks an anon
-- user from choosing a non-pending status.
drop policy if exists applications_anon_insert on public.applications;
create policy applications_anon_insert on public.applications
  for insert with check (status = 'pending');

drop policy if exists applications_admin_select on public.applications;
create policy applications_admin_select on public.applications
  for select using (public.is_admin());

drop policy if exists applications_admin_update on public.applications;
create policy applications_admin_update on public.applications
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists applications_admin_delete on public.applications;
create policy applications_admin_delete on public.applications
  for delete using (public.is_admin());
