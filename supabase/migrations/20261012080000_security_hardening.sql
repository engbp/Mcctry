-- MCC MNU — corrective security hardening.
-- Answers the live Supabase security advisor warnings for the database created
-- by supabase/migrations/20261011235451_init.sql.
--
--   1. mutable search_path on set_updated_at() and the authorization helpers
--   2. current_app_role() / is_admin() / protect_profile_role() executable by anon
--   3. admin_set_profile_role() callable by authenticated as SECURITY DEFINER
--   4. overlapping / broadly-scoped RLS policies
--   5. profile policy performance (two permissive policies + per-row auth.uid())
--
-- IDEMPOTENT: every statement is create-or-replace / drop-if-exists / revoke /
-- grant, so this file is a no-op when run on a database that was created by an
-- already-corrected 20261011235451_init.sql, and applies the fix when run on a
-- database created by the pre-correction version of that file.
--
-- NOT APPLIED TO ANY REMOTE PROJECT. Apply manually, deliberately, after review.
--
-- ---------------------------------------------------------------------------
-- On admin_set_profile_role() RPC exposure (advisor warning 3):
-- The function must remain SECURITY DEFINER, because column-level grants deny
-- UPDATE on profiles.role to `authenticated` (admins included) — so a definer
-- path is the only way to change a role. It must remain callable by
-- `authenticated`, because Supabase exposes only anon/authenticated/service_role
-- to the API and there is no "admin" Postgres role to GRANT EXECUTE to. Moving
-- it to an unexposed schema would remove role management from the API entirely,
-- and serving it via the service role from an app server would move the
-- privilege check out of the database (the server would assert "I am admin"
-- instead of the database verifying the caller's JWT) — both are worse.
-- So the exposure is necessary; the protection is the in-body gate: null
-- auth.uid() raises, non-admin callers raise, and EXECUTE stays revoked from
-- PUBLIC and anon with a pinned search_path.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. Pin search_path on every function (CREATE OR REPLACE updates proconfig).
--    Empty is the strictest safe value: only pg_catalog (implicitly always
--    searched) is visible, and every object these bodies touch is qualified.
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

-- ---------------------------------------------------------------------------
-- 2. Function execution privileges. Functions are EXECUTE-by-PUBLIC by default.
--    Trigger functions are called by the trigger machinery, not by clients;
--    current_app_role() is internal to is_admin(); is_admin() is only ever
--    reached from policies scoped `to authenticated`.
--    SECURITY DEFINER bodies run as the owner, which keeps EXECUTE, so these
--    revokes cannot break calls made inside those bodies or from triggers.
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

revoke execute on function public.admin_set_profile_role(uuid, app_role)
  from public, anon;
grant execute on function public.admin_set_profile_role(uuid, app_role)
  to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Policies.
--    Public reads become function-free and anon-scoped-plus-authenticated:
--    anonymous visitors read published rows without ever executing a function.
--    Every policy that calls is_admin() becomes `to authenticated`, so anon
--    never evaluates a function it can no longer execute.
-- ---------------------------------------------------------------------------

-- teams
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

-- profiles: collapse each overlapping pair into one policy, scope to
-- authenticated, and evaluate auth.uid() once per query via a subquery.
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_admin_select on public.profiles;
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_admin_update on public.profiles;
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id or public.is_admin())
  with check ((select auth.uid()) = id or public.is_admin());

-- tracks
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

-- courses
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

-- lessons
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

-- content_items
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

-- resources
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

-- applications. applications_anon_insert is unchanged: anonymous visitors must
-- still be able to submit, and it references no function, so it needs no role
-- scoping. It still forces status = 'pending'.
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
-- 4. Re-state the role-escalation column grants (idempotent). Non-admins have
--    no UPDATE on profiles.role or profiles.id; role changes go only through
--    admin_set_profile_role(), which the protect_profile_role trigger allows
--    solely for administrator callers.
-- ---------------------------------------------------------------------------
revoke update on table public.profiles from authenticated;
grant update (display_name, team_id) on table public.profiles to authenticated;
