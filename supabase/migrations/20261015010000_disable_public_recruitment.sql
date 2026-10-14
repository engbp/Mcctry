-- Disable public recruitment intake without deleting historic records.
-- The website no longer exposes a join/application form; keep stored rows intact.

drop policy if exists applications_anon_insert on public.applications;
revoke insert on table public.applications from anon, authenticated, public;
revoke insert (phone_number, answers) on table public.applications from anon, authenticated, public;

-- Recruitment questions are no longer exposed to public visitors. Preserve the
-- table and its records for audit/history, but do not serve them to the website.
drop policy if exists recruitment_questions_public_enabled_read on public.recruitment_questions;
revoke select on table public.recruitment_questions from anon, public;
