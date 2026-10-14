import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { getSupabaseUrl, getServiceRoleKey } from "./env";

/**
 * Privileged server-only client. Uses the secret key (legacy name:
 * "service_role key"), which bypasses RLS — use ONLY for admin/automation
 * paths that are themselves gated by an explicit is_admin() check.
 * Never export this to a client component. Never prefix its key NEXT_PUBLIC_.
 */
export function createSupabaseAdminClient(): SupabaseClient<Database> {
  const key = getServiceRoleKey();
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Admin client unavailable."
    );
  }
  return createClient<Database>(getSupabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
