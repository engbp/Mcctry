// Central, validated access to Stage B environment variables.
// No value is ever hard-coded here. Nothing is exposed to the browser unless
// it is explicitly prefixed NEXT_PUBLIC_ by the operator.
//
// Supabase's current API key formats (both accepted, passed through verbatim):
//   - Publishable key: `sb_publishable_...` — public, browser-safe (NEXT_PUBLIC_*).
//   - Secret key:      `sb_secret_...`      — server-only, never NEXT_PUBLIC_*.
// The legacy "anon key" / "service_role key" JWTs (`eyJ...`) also still work.

const MISSING = "Supabase environment variable is not set";

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error(`${MISSING}: NEXT_PUBLIC_SUPABASE_URL`);
  return url;
}

/**
 * Publishable key (legacy name: "anon key"). `sb_publishable_...`. Public and
 * browser-safe; RLS is the enforcement boundary when this key is used.
 */
export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error(`${MISSING}: NEXT_PUBLIC_SUPABASE_ANON_KEY`);
  return key;
}

/**
 * Secret key (legacy name: "service_role key"). `sb_secret_...`. Server-only.
 * Must never be passed to a client component or prefixed with NEXT_PUBLIC_.
 * Returns null instead of throwing so optional admin paths can degrade without
 * crashing the public site.
 */
export function getServiceRoleKey(): string | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return key && key.length > 0 ? key : null;
}

/**
 * True when a live Supabase project is configured. Public pages use this to
 * decide between "serve from DB" and "serve the built-in preview content",
 * so the site never hard-fails when credentials are absent.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
