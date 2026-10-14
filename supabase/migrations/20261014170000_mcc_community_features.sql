-- MCC MNU community features. Review/apply only after application and RLS tests pass.
-- Ensure the lesson editor has its expected video field on fresh databases.
alter table public.lessons add column if not exists video_url text;

alter table public.profiles add column if not exists email text;
update public.profiles p set email = u.email from auth.users u
 where u.id = p.id and p.email is distinct from u.email;

create or replace function public.sync_profile_auth_identity()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''))
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;
drop trigger if exists auth_user_sync_profile_identity on auth.users;
create trigger auth_user_sync_profile_identity after insert or update of email on auth.users
for each row execute function public.sync_profile_auth_identity();
revoke execute on function public.sync_profile_auth_identity() from public, anon, authenticated;

alter table public.applications add column if not exists phone_number text;
alter table public.applications add column if not exists answers jsonb not null default '{}'::jsonb;
alter table public.applications drop constraint if exists applications_phone_number_len;
alter table public.applications add constraint applications_phone_number_len
 check (phone_number is null or char_length(phone_number) between 7 and 30);
alter table public.applications drop constraint if exists applications_answers_object;
alter table public.applications add constraint applications_answers_object check (jsonb_typeof(answers) = 'object');
grant insert (phone_number, answers) on public.applications to anon, authenticated;

create table if not exists public.recruitment_questions (
 id uuid primary key default gen_random_uuid(),
 label text not null check (char_length(label) between 2 and 200),
 field_type text not null default 'text' check (field_type in ('text','textarea','select')),
 options text[] not null default '{}',
 required boolean not null default false,
 enabled boolean not null default true,
 position integer not null default 0 check (position >= 0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check (cardinality(options) <= 30)
);
create index if not exists recruitment_questions_enabled_position_idx on public.recruitment_questions(enabled, position);
alter table public.recruitment_questions enable row level security;
drop policy if exists recruitment_questions_public_enabled_read on public.recruitment_questions;
create policy recruitment_questions_public_enabled_read on public.recruitment_questions for select to anon using (enabled);
drop policy if exists recruitment_questions_authenticated_read on public.recruitment_questions;
create policy recruitment_questions_authenticated_read on public.recruitment_questions for select to authenticated using (enabled or public.is_admin());
drop policy if exists recruitment_questions_admin_insert on public.recruitment_questions;
create policy recruitment_questions_admin_insert on public.recruitment_questions for insert to authenticated with check (public.is_admin());
drop policy if exists recruitment_questions_admin_update on public.recruitment_questions;
create policy recruitment_questions_admin_update on public.recruitment_questions for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists recruitment_questions_admin_delete on public.recruitment_questions;
create policy recruitment_questions_admin_delete on public.recruitment_questions for delete to authenticated using (public.is_admin());
grant select on public.recruitment_questions to anon, authenticated;
grant insert, update, delete on public.recruitment_questions to authenticated;

create table if not exists public.track_leaders (
 track_id uuid not null references public.tracks(id) on delete cascade,
 user_id uuid not null references public.profiles(id) on delete cascade,
 assigned_by uuid references public.profiles(id) on delete set null,
 created_at timestamptz not null default now(),
 primary key (track_id, user_id)
);
create index if not exists track_leaders_user_id_idx on public.track_leaders(user_id);
alter table public.track_leaders enable row level security;

create or replace function public.is_track_leader_for_track(target_track_id uuid)
returns boolean language sql security definer set search_path = '' stable as $$
 select exists (select 1 from public.track_leaders tl where tl.track_id = target_track_id and tl.user_id = auth.uid());
$$;
create or replace function public.is_track_leader_for_course(target_course_id uuid)
returns boolean language sql security definer set search_path = '' stable as $$
 select exists (select 1 from public.courses c join public.track_leaders tl on tl.track_id = c.track_id
 where c.id = target_course_id and tl.user_id = auth.uid());
$$;
create or replace function public.is_track_leader_for_lesson(target_lesson_id uuid)
returns boolean language sql security definer set search_path = '' stable as $$
 select exists (select 1 from public.lessons l join public.courses c on c.id = l.course_id
 join public.track_leaders tl on tl.track_id = c.track_id where l.id = target_lesson_id and tl.user_id = auth.uid());
$$;
revoke execute on function public.is_track_leader_for_track(uuid) from public, anon;
revoke execute on function public.is_track_leader_for_course(uuid) from public, anon;
revoke execute on function public.is_track_leader_for_lesson(uuid) from public, anon;
grant execute on function public.is_track_leader_for_track(uuid) to authenticated;
grant execute on function public.is_track_leader_for_course(uuid) to authenticated;
grant execute on function public.is_track_leader_for_lesson(uuid) to authenticated;

drop policy if exists track_leaders_admin_all on public.track_leaders;
create policy track_leaders_admin_all on public.track_leaders for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists track_leaders_self_read on public.track_leaders;
create policy track_leaders_self_read on public.track_leaders for select to authenticated using (user_id = auth.uid() or public.is_admin());
grant select, insert, update, delete on public.track_leaders to authenticated;

drop policy if exists tracks_leader_read_assigned on public.tracks;
create policy tracks_leader_read_assigned on public.tracks for select to authenticated using (public.is_admin() or public.is_track_leader_for_track(id));
drop policy if exists tracks_leader_update_assigned on public.tracks;
create policy tracks_leader_update_assigned on public.tracks for update to authenticated using (public.is_track_leader_for_track(id)) with check (public.is_track_leader_for_track(id));

drop policy if exists courses_leader_read_assigned on public.courses;
create policy courses_leader_read_assigned on public.courses for select to authenticated using (public.is_admin() or public.is_track_leader_for_track(track_id));
drop policy if exists courses_leader_insert_assigned on public.courses;
create policy courses_leader_insert_assigned on public.courses for insert to authenticated with check (public.is_track_leader_for_track(track_id));
drop policy if exists courses_leader_update_assigned on public.courses;
create policy courses_leader_update_assigned on public.courses for update to authenticated using (public.is_track_leader_for_track(track_id)) with check (public.is_track_leader_for_track(track_id));
drop policy if exists courses_leader_delete_assigned on public.courses;
create policy courses_leader_delete_assigned on public.courses for delete to authenticated using (public.is_track_leader_for_track(track_id));

drop policy if exists lessons_leader_read_assigned on public.lessons;
create policy lessons_leader_read_assigned on public.lessons for select to authenticated using (public.is_admin() or public.is_track_leader_for_course(course_id));
drop policy if exists lessons_leader_insert_assigned on public.lessons;
create policy lessons_leader_insert_assigned on public.lessons for insert to authenticated with check (public.is_track_leader_for_course(course_id));
drop policy if exists lessons_leader_update_assigned on public.lessons;
create policy lessons_leader_update_assigned on public.lessons for update to authenticated using (public.is_track_leader_for_course(course_id)) with check (public.is_track_leader_for_course(course_id));
drop policy if exists lessons_leader_delete_assigned on public.lessons;
create policy lessons_leader_delete_assigned on public.lessons for delete to authenticated using (public.is_track_leader_for_course(course_id));

-- Anonymous course and lesson reviews. No profile or authentication ID is saved.
create table if not exists public.course_feedback (
 id uuid primary key default gen_random_uuid(),
 course_id uuid not null references public.courses(id) on delete cascade,
 lesson_id uuid references public.lessons(id) on delete set null,
 kind text not null default 'review' check (kind in ('review','complaint')),
 rating smallint check (rating is null or rating between 1 and 5),
 message text not null check (char_length(trim(message)) between 3 and 4000),
 created_at timestamptz not null default now(),
 check ((kind = 'review' and rating is not null) or kind = 'complaint')
);
create index if not exists course_feedback_course_created_idx on public.course_feedback(course_id, created_at desc);
alter table public.course_feedback enable row level security;
drop policy if exists course_feedback_anon_insert on public.course_feedback;
create policy course_feedback_anon_insert on public.course_feedback for insert to anon
 with check (exists (select 1 from public.courses c where c.id = course_id and c.published)
 and (lesson_id is null or exists (select 1 from public.lessons l where l.id = lesson_id and l.course_id = course_id and l.published)));
drop policy if exists course_feedback_authenticated_insert on public.course_feedback;
create policy course_feedback_authenticated_insert on public.course_feedback for insert to authenticated
 with check (exists (select 1 from public.courses c where c.id = course_id and c.published)
 and (lesson_id is null or exists (select 1 from public.lessons l where l.id = lesson_id and l.course_id = course_id and l.published)));
drop policy if exists course_feedback_admin_read on public.course_feedback;
create policy course_feedback_admin_read on public.course_feedback for select to authenticated using (public.is_admin());
drop policy if exists course_feedback_leader_read on public.course_feedback;
create policy course_feedback_leader_read on public.course_feedback for select to authenticated using (public.is_track_leader_for_course(course_id));
grant insert on public.course_feedback to anon, authenticated;
grant select on public.course_feedback to authenticated;

grant select (id, email, display_name, role, team_id, created_at, updated_at) on public.profiles to authenticated;

-- QR feedback links are time-limited and can be closed before expiry.
create table if not exists public.feedback_sessions (
 id uuid primary key default gen_random_uuid(),
 track_id uuid not null references public.tracks(id) on delete cascade,
 course_id uuid not null references public.courses(id) on delete cascade,
 title text not null check (char_length(title) between 2 and 200),
 feedback_token uuid not null unique default gen_random_uuid(),
 feedback_expires_at timestamptz not null,
 feedback_closed_at timestamptz,
 created_by uuid references public.profiles(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create or replace function public.validate_feedback_session_course_track()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  course_track_id uuid;
begin
  select c.track_id into course_track_id
    from public.courses c
   where c.id = new.course_id;
  if course_track_id is null or course_track_id <> new.track_id then
    raise exception 'session course must belong to the selected track';
  end if;
  return new;
end;
$$;
revoke execute on function public.validate_feedback_session_course_track() from public, anon, authenticated;
drop trigger if exists feedback_sessions_validate_course_track on public.feedback_sessions;
create trigger feedback_sessions_validate_course_track
before insert or update on public.feedback_sessions
for each row execute function public.validate_feedback_session_course_track();

create index if not exists feedback_sessions_track_created_idx on public.feedback_sessions(track_id, created_at desc);
create index if not exists feedback_sessions_token_expiry_idx on public.feedback_sessions(feedback_token, feedback_expires_at);
alter table public.feedback_sessions enable row level security;

create or replace function public.is_active_feedback_session(target_session_id uuid, target_token uuid)
returns boolean language sql security definer set search_path = '' stable as $$
 select exists (select 1 from public.feedback_sessions s where s.id = target_session_id
   and s.feedback_token = target_token and s.feedback_closed_at is null and s.feedback_expires_at > now());
$$;
revoke execute on function public.is_active_feedback_session(uuid, uuid) from public;
grant execute on function public.is_active_feedback_session(uuid, uuid) to anon, authenticated;

drop policy if exists feedback_sessions_public_active_read on public.feedback_sessions;
create policy feedback_sessions_public_active_read on public.feedback_sessions for select to anon
 using (feedback_closed_at is null and feedback_expires_at > now());
drop policy if exists feedback_sessions_auth_read on public.feedback_sessions;
create policy feedback_sessions_auth_read on public.feedback_sessions for select to authenticated
 using (public.is_admin() or public.is_track_leader_for_track(track_id)
   or (feedback_closed_at is null and feedback_expires_at > now()));
drop policy if exists feedback_sessions_admin_insert on public.feedback_sessions;
create policy feedback_sessions_admin_insert on public.feedback_sessions for insert to authenticated
 with check (public.is_admin() and created_by = auth.uid()
   and exists (select 1 from public.courses c where c.id = feedback_sessions.course_id and c.track_id = feedback_sessions.track_id));
drop policy if exists feedback_sessions_admin_update on public.feedback_sessions;
create policy feedback_sessions_admin_update on public.feedback_sessions for update to authenticated
 using (public.is_admin()) with check (public.is_admin());
drop policy if exists feedback_sessions_leader_insert on public.feedback_sessions;
create policy feedback_sessions_leader_insert on public.feedback_sessions for insert to authenticated
 with check (public.is_track_leader_for_track(track_id) and created_by = auth.uid()
   and exists (select 1 from public.courses c where c.id = feedback_sessions.course_id and c.track_id = feedback_sessions.track_id));
drop policy if exists feedback_sessions_leader_update on public.feedback_sessions;
create policy feedback_sessions_leader_update on public.feedback_sessions for update to authenticated
 using (public.is_track_leader_for_track(track_id)) with check (public.is_track_leader_for_track(track_id));
grant select (id, track_id, course_id, title, feedback_token, feedback_expires_at, feedback_closed_at, created_at) on public.feedback_sessions to anon, authenticated;
grant insert, update on public.feedback_sessions to authenticated;

create table if not exists public.session_feedback (
 id uuid primary key default gen_random_uuid(),
 session_id uuid not null references public.feedback_sessions(id) on delete cascade,
 feedback_token uuid not null,
 rating smallint not null check (rating between 1 and 5),
 message text not null check (char_length(trim(message)) between 3 and 2000),
 created_at timestamptz not null default now()
);
create index if not exists session_feedback_session_created_idx on public.session_feedback(session_id, created_at desc);
alter table public.session_feedback enable row level security;
drop policy if exists session_feedback_active_anon_insert on public.session_feedback;
create policy session_feedback_active_anon_insert on public.session_feedback for insert to anon
 with check (public.is_active_feedback_session(session_id, feedback_token));
drop policy if exists session_feedback_active_auth_insert on public.session_feedback;
create policy session_feedback_active_auth_insert on public.session_feedback for insert to authenticated
 with check (public.is_active_feedback_session(session_id, feedback_token));
drop policy if exists session_feedback_admin_read on public.session_feedback;
create policy session_feedback_admin_read on public.session_feedback for select to authenticated
 using (public.is_admin() or exists (select 1 from public.feedback_sessions s
   where s.id = session_id and public.is_track_leader_for_track(s.track_id)));
grant insert on public.session_feedback to anon, authenticated;
grant select on public.session_feedback to authenticated;

-- Defence in depth: required recruitment questions are enforced even if the
-- submission bypasses the web server action and calls the database API directly.
create or replace function public.validate_application_answers()
returns trigger language plpgsql set search_path = ''
as $$
declare
  q record;
  answer text;
begin
  if new.phone_number is null or char_length(new.phone_number) < 7 or char_length(new.phone_number) > 30 then
    raise exception 'a valid phone number is required';
  end if;
  if jsonb_typeof(coalesce(new.answers, '{}'::jsonb)) <> 'object' then
    raise exception 'application answers must be a JSON object';
  end if;
  for q in select id, label, field_type, options, required from public.recruitment_questions where enabled = true
  loop
    answer := nullif(trim(new.answers ->> q.id::text), '');
    if q.required and answer is null then
      raise exception 'missing required answer for question: %', q.label;
    end if;
    if answer is not null and q.field_type = 'select' and not (answer = any(q.options)) then
      raise exception 'invalid answer for question: %', q.label;
    end if;
    if answer is not null and char_length(answer) > 2000 then
      raise exception 'answer is too long for question: %', q.label;
    end if;
  end loop;
  return new;
end;
$$;
drop trigger if exists applications_validate_answers on public.applications;
create trigger applications_validate_answers before insert or update of answers, phone_number
on public.applications for each row execute function public.validate_application_answers();
revoke execute on function public.validate_application_answers() from public, anon, authenticated;

-- Resources attached to a course or lesson can be managed by the leader for
-- that assigned track. Standalone club-wide resources remain admin-only.
drop policy if exists resources_leader_read_assigned on public.resources;
create policy resources_leader_read_assigned on public.resources
 for select to authenticated using (
   public.is_admin()
   or (course_id is not null and public.is_track_leader_for_course(course_id))
   or (lesson_id is not null and public.is_track_leader_for_lesson(lesson_id))
 );
drop policy if exists resources_leader_insert_assigned on public.resources;
create policy resources_leader_insert_assigned on public.resources
 for insert to authenticated with check (
   (course_id is not null and public.is_track_leader_for_course(course_id))
   or (lesson_id is not null and public.is_track_leader_for_lesson(lesson_id))
 );
drop policy if exists resources_leader_update_assigned on public.resources;
create policy resources_leader_update_assigned on public.resources
 for update to authenticated
 using (
   (course_id is not null and public.is_track_leader_for_course(course_id))
   or (lesson_id is not null and public.is_track_leader_for_lesson(lesson_id))
 )
 with check (
   (course_id is not null and public.is_track_leader_for_course(course_id))
   or (lesson_id is not null and public.is_track_leader_for_lesson(lesson_id))
 );
drop policy if exists resources_leader_delete_assigned on public.resources;
create policy resources_leader_delete_assigned on public.resources
 for delete to authenticated using (
   (course_id is not null and public.is_track_leader_for_course(course_id))
   or (lesson_id is not null and public.is_track_leader_for_lesson(lesson_id))
 );
grant select, insert, update, delete on public.resources to authenticated;
