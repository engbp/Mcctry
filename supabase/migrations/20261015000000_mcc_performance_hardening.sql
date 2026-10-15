-- MCC MNU performance hardening.
-- Adds covering indexes for foreign keys and avoids per-row auth evaluation
-- in the policies identified by Supabase's performance advisor.

create index if not exists course_feedback_lesson_id_idx
  on public.course_feedback(lesson_id);
create index if not exists feedback_sessions_course_id_idx
  on public.feedback_sessions(course_id);
create index if not exists feedback_sessions_created_by_idx
  on public.feedback_sessions(created_by);
create index if not exists lesson_progress_lesson_id_idx
  on public.lesson_progress(lesson_id);
create index if not exists lesson_progress_course_id_idx
  on public.lesson_progress(course_id);
create index if not exists track_leaders_assigned_by_idx
  on public.track_leaders(assigned_by);

alter policy track_leaders_self_read on public.track_leaders
  using ((user_id = (select auth.uid()) or (select public.is_admin())));

alter policy feedback_sessions_admin_insert on public.feedback_sessions
  with check ((select public.is_admin()) and created_by = (select auth.uid())
    and exists (
      select 1
      from public.courses c
      where c.id = feedback_sessions.course_id
        and c.track_id = feedback_sessions.track_id
    ));

alter policy feedback_sessions_leader_insert on public.feedback_sessions
  with check ((select public.is_track_leader_for_track(track_id))
    and created_by = (select auth.uid())
    and exists (
      select 1
      from public.courses c
      where c.id = feedback_sessions.course_id
        and c.track_id = feedback_sessions.track_id
    ));
