-- MCC MNU — MVP migration: auth profile bootstrap, lesson video URLs,
-- per-student lesson progress, and one published test course.
--
-- IDEMPOTENT: every statement is create-or-replace / drop-if-exists /
-- on-conflict-do-nothing-or-update, so re-applying is safe.
--
-- Contents:
--   1. lessons.video_url column
--   2. lesson_progress table + RLS (per-student rows only)
--   3. handle_new_user() trigger — creates a profile with role 'member'
--      for every new auth.users row (Supabase Auth signup)
--   4. Seed: one published track, one published course, two published
--      lessons with verified Microsoft Learn YouTube video URLs

-- ---------------------------------------------------------------------------
-- 1. lessons.video_url
-- ---------------------------------------------------------------------------
alter table public.lessons
  add column if not exists video_url text;

alter table public.lessons
  drop constraint if exists lessons_video_url_len;

alter table public.lessons
  add constraint lessons_video_url_len
    check (video_url is null or char_length(video_url) <= 2048);

comment on column public.lessons.video_url is
  'Publicly accessible video URL (YouTube watch/embed or direct file). No secrets.';

-- ---------------------------------------------------------------------------
-- 2. lesson_progress — one row per (student, lesson) completion.
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  lesson_id   uuid not null references public.lessons(id) on delete cascade,
  course_id   uuid not null references public.courses(id) on delete cascade,
  completed_at timestamptz not null default now(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index if not exists lesson_progress_user_course_idx
  on public.lesson_progress (user_id, course_id);

create index if not exists lesson_progress_user_idx
  on public.lesson_progress (user_id);

comment on table public.lesson_progress is
  'Per-student lesson completion. Each student reads/writes only their own rows via RLS.';

drop trigger if exists lesson_progress_set_updated_at on public.lesson_progress;
create trigger lesson_progress_set_updated_at
  before update on public.lesson_progress
  for each row execute function public.set_updated_at();

alter table public.lesson_progress enable row level security;

-- Students see only their own progress. No admin override: progress is
-- personal data, and admins have no legitimate need to read or edit it.
drop policy if exists lesson_progress_select_own on public.lesson_progress;
create policy lesson_progress_select_own on public.lesson_progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists lesson_progress_insert_own on public.lesson_progress;
create policy lesson_progress_insert_own on public.lesson_progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists lesson_progress_update_own on public.lesson_progress;
create policy lesson_progress_update_own on public.lesson_progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists lesson_progress_delete_own on public.lesson_progress;
create policy lesson_progress_delete_own on public.lesson_progress
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Table privileges for the authenticated role. RLS is the row filter;
-- without these grants PostgREST returns 42501 before RLS even runs.
grant select, insert, update, delete on public.lesson_progress to authenticated;

-- Defense-in-depth: authenticated may not reassign user_id via column grants.
revoke all on table public.lesson_progress from anon;
revoke update on table public.lesson_progress from authenticated;
grant update (completed_at) on table public.lesson_progress to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Auto-create a profile (role = member) for every new auth user.
--    SECURITY DEFINER so the profiles RLS policies do not block the insert.
--    The role is hard-coded to 'member'; signup can never set admin/leader.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, role, display_name)
  values (
    new.id,
    'member',
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), '')
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

revoke execute on function public.handle_new_user()
  from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Seed one published test track + course + two lessons.
--    Video URLs are real, publicly accessible Microsoft Learn videos
--    (verified via YouTube oEmbed before seeding):
--      L1: AI-900 Course Intro (Microsoft Learn)      — 0Xl-Q161RIA
--      L2: AI for Beginners announcement (MS Dev)     — m2KrAk0cC1c
-- ---------------------------------------------------------------------------
insert into public.tracks (
  slug, title, description, color, icon, duration, featured, published, position
)
values (
  'getting-started',
  'Getting Started',
  'New to MCC MNU? Start here. Short orientation lessons that show how the club works and how to learn with free Microsoft resources.',
  '#0078d4',
  'Sparkles',
  '25 min',
  true,
  true,
  0
)
on conflict (slug) do update set
  title       = excluded.title,
  description = excluded.description,
  color       = excluded.color,
  icon        = excluded.icon,
  duration    = excluded.duration,
  featured    = excluded.featured,
  published   = excluded.published,
  position    = excluded.position,
  updated_at  = now();

insert into public.courses (
  track_id, slug, title, description, level, color, duration, featured, published, position
)
select
  t.id,
  'introduction-to-ai',
  'Introduction to AI',
  'A short, real-video introduction to artificial intelligence using Microsoft''s free AI-900 course intro and the AI for Beginners curriculum. Watch both lessons, mark them complete, and continue on Microsoft Learn.',
  'Beginner',
  '#0078d4',
  '25 min',
  true,
  true,
  0
from public.tracks t
where t.slug = 'getting-started'
on conflict (slug) do update set
  track_id    = excluded.track_id,
  title       = excluded.title,
  description = excluded.description,
  level       = excluded.level,
  color       = excluded.color,
  duration    = excluded.duration,
  featured    = excluded.featured,
  published   = excluded.published,
  position    = excluded.position,
  updated_at  = now();

insert into public.lessons (
  course_id, slug, title, duration, type, video_url, published, position
)
select
  c.id,
  v.slug,
  v.title,
  v.duration,
  'video',
  v.video_url,
  true,
  v.position
from public.courses c
cross join (values
  (
    'course-introduction',
    'Course introduction: AI-900 fundamentals',
    '09 min',
    'https://www.youtube.com/watch?v=0Xl-Q161RIA',
    1
  ),
  (
    'ai-for-beginners',
    'Explore the AI for Beginners curriculum',
    '04 min',
    'https://www.youtube.com/watch?v=m2KrAk0cC1c',
    2
  )
) as v(slug, title, duration, video_url, position)
where c.slug = 'introduction-to-ai'
on conflict (course_id, slug) do update set
  title      = excluded.title,
  duration   = excluded.duration,
  video_url  = excluded.video_url,
  type       = excluded.type,
  published  = excluded.published,
  position   = excluded.position,
  updated_at = now();
