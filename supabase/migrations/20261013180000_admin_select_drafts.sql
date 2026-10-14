-- MCC MNU — admin SELECT policies for draft content in the admin workspace.
--
-- Public rows still use existing published=true SELECT policies.
-- Admins additionally see unpublished rows via is_admin().
-- IDEMPOTENT: drop-if-exists + create.

drop policy if exists tracks_admin_select on public.tracks;
create policy tracks_admin_select on public.tracks
  for select to authenticated
  using (public.is_admin());

drop policy if exists courses_admin_select on public.courses;
create policy courses_admin_select on public.courses
  for select to authenticated
  using (public.is_admin());

drop policy if exists lessons_admin_select on public.lessons;
create policy lessons_admin_select on public.lessons
  for select to authenticated
  using (public.is_admin());

drop policy if exists resources_admin_select on public.resources;
create policy resources_admin_select on public.resources
  for select to authenticated
  using (public.is_admin());
