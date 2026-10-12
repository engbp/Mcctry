import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";
import { getSupabaseUrl, getSupabaseAnonKey } from "./env";

/**
 * Browser-side Supabase client. Uses the publishable key (legacy name: "anon
 * key") only, so RLS is the enforcement boundary. Never import the secret key
 * (legacy name: "service_role key") into this file.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
