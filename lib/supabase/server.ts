import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";
import { getSupabaseUrl, getSupabaseAnonKey } from "./env";

/**
 * Server-side Supabase client bound to the request cookie store.
 * Uses the publishable key (legacy name: "anon key"), so RLS still applies.
 * Authenticated identity comes from the session cookie, never from
 * client-supplied headers.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component; middleware refreshes the session.
        }
      },
    },
  });
}
