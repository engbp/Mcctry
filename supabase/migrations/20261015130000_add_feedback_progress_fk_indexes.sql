-- Add covering indexes for foreign keys identified by Supabase performance advisor.
-- Keep these indexes aligned with the live database migration applied on 15 Oct 2026.

create index if not exists course_feedback_lesson_id_idx
  on public.course_feedback (lesson_id);

create index if not exists feedback_sessions_course_id_idx
  on public.feedback_sessions (course_id);

create index if not exists feedback_sessions_created_by_idx
  on public.feedback_sessions (created_by);

create index if not exists lesson_progress_course_id_idx
  on public.lesson_progress (course_id);

create index if not exists lesson_progress_lesson_id_idx
  on public.lesson_progress (lesson_id);

create index if not exists track_leaders_assigned_by_idx
  on public.track_leaders (assigned_by);
