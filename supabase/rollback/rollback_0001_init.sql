-- MCC MNU — ROLLBACK for supabase/migrations/20261011235451_init.sql.
-- DESTRUCTIVE. Drops all Stage B objects. Never apply automatically.
-- Lives OUTSIDE supabase/migrations/ on purpose: the Supabase CLI applies
-- everything in that directory, so a rollback must not be stored there.
-- Use only on a dev/test instance, run manually by a human.
-- Never run against production data.

-- Policies ------------------------------------------------------------------
drop policy if exists teams_public_read        on public.teams;
drop policy if exists teams_admin_insert       on public.teams;
drop policy if exists teams_admin_update       on public.teams;
drop policy if exists teams_admin_delete       on public.teams;

drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_admin_select    on public.profiles;
drop policy if exists profiles_select          on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_admin_update    on public.profiles;
drop policy if exists profiles_update          on public.profiles;

drop policy if exists tracks_public_read       on public.tracks;
drop policy if exists tracks_admin_insert      on public.tracks;
drop policy if exists tracks_admin_update      on public.tracks;
drop policy if exists tracks_admin_delete      on public.tracks;

drop policy if exists courses_public_read      on public.courses;
drop policy if exists courses_admin_insert     on public.courses;
drop policy if exists courses_admin_update     on public.courses;
drop policy if exists courses_admin_delete     on public.courses;

drop policy if exists lessons_public_read      on public.lessons;
drop policy if exists lessons_admin_insert     on public.lessons;
drop policy if exists lessons_admin_update     on public.lessons;
drop policy if exists lessons_admin_delete     on public.lessons;

drop policy if exists content_items_public_read   on public.content_items;
drop policy if exists content_items_admin_insert  on public.content_items;
drop policy if exists content_items_admin_update  on public.content_items;
drop policy if exists content_items_admin_delete  on public.content_items;

drop policy if exists resources_public_read    on public.resources;
drop policy if exists resources_admin_insert   on public.resources;
drop policy if exists resources_admin_update   on public.resources;
drop policy if exists resources_admin_delete   on public.resources;

drop policy if exists applications_anon_insert    on public.applications;
drop policy if exists applications_admin_select   on public.applications;
drop policy if exists applications_admin_update   on public.applications;
drop policy if exists applications_admin_delete   on public.applications;

-- Triggers ------------------------------------------------------------------
drop trigger if exists teams_set_updated_at        on public.teams;
drop trigger if exists profiles_set_updated_at     on public.profiles;
drop trigger if exists profiles_protect_role       on public.profiles;
drop trigger if exists tracks_set_updated_at       on public.tracks;
drop trigger if exists courses_set_updated_at      on public.courses;
drop trigger if exists lessons_set_updated_at      on public.lessons;
drop trigger if exists content_items_set_updated_at on public.content_items;
drop trigger if exists resources_set_updated_at    on public.resources;
drop trigger if exists applications_set_updated_at on public.applications;

-- Functions -----------------------------------------------------------------
drop function if exists public.admin_set_profile_role(uuid, app_role);
drop function if exists public.protect_profile_role();
drop function if exists public.set_updated_at();
drop function if exists public.is_admin();
drop function if exists public.current_app_role();

-- Tables (dependency order: children first) --------------------------------
drop table if exists public.resources;
drop table if exists public.applications;
drop table if exists public.content_items;
drop table if exists public.lessons;
drop table if exists public.courses;
drop table if exists public.tracks;
drop table if exists public.profiles;
drop table if exists public.teams;

-- Types ---------------------------------------------------------------------
drop type if exists application_status;
drop type if exists content_kind;
drop type if exists app_role;
