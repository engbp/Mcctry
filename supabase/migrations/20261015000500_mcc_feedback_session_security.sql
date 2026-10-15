-- MCC MNU feedback-session security hardening.
-- The function only needs to read rows already visible through the public
-- active-session policy, so SECURITY INVOKER avoids exposing a privileged RPC.

create or replace function public.is_active_feedback_session(target_session_id uuid, target_token uuid)
returns boolean language sql security invoker set search_path = '' stable as $$
  select exists (
    select 1
    from public.feedback_sessions s
    where s.id = target_session_id
      and s.feedback_token = target_token
      and s.feedback_closed_at is null
      and s.feedback_expires_at > now()
  );
$$;

revoke execute on function public.is_active_feedback_session(uuid, uuid) from public;
grant execute on function public.is_active_feedback_session(uuid, uuid) to anon, authenticated;
