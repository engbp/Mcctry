import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { getSupabaseUrl, getSupabaseAnonKey } from "./env";

/**
 * Cookieless Supabase client for public, read-only content queries. Uses only
 * the publishable key (legacy name: "anon key"), so RLS is the enforcement
 * boundary. Unlike `createSupabaseServerClient`, it never touches request APIs
 * (cookies/headers), so pages that query through it stay statically
 * prerenderable and revalidatable. Never import the secret key into this file.
 */
export function createSupabasePublicClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Bound every content query so a flaky network degrades quickly to the
      // static fallback instead of hanging a render.
      fetch: (input, init) => {
        const signal = init?.signal ?? AbortSignal.timeout(8_000);
        return fetch(input, { ...init, signal });
      },
    },
  });
}
