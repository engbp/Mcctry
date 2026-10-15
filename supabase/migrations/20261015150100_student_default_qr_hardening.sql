-- The enum value is available because the preceding migration commits first.
alter table public.profiles
  alter column role set default 'student'::public.app_role;

-- QR feedback sessions must point to a published track and course.
create or replace function public.validate_feedback_session_course_track()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  course_track_id uuid;
  course_is_published boolean;
  track_is_published boolean;
begin
  select c.track_id, c.published into course_track_id, course_is_published
    from public.courses c
   where c.id = new.course_id;

  select t.published into track_is_published
    from public.tracks t
   where t.id = new.track_id;

  if course_track_id is null or course_track_id <> new.track_id then
    raise exception 'session course must belong to the selected track';
  end if;
  if not coalesce(course_is_published, false) or not coalesce(track_is_published, false) then
    raise exception 'session feedback requires a published track and course';
  end if;
  return new;
end;
$$;

revoke execute on function public.validate_feedback_session_course_track() from public, anon, authenticated;
