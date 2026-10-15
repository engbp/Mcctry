-- Add the fourth MCC role. This migration intentionally only changes the enum;
-- PostgreSQL requires a newly added enum value to be committed before it can
-- be used by a column default or other expression.
alter type public.app_role add value if not exists 'student';
