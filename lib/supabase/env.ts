// Central, validated access to Stage B environment variables.
// No value is ever hard-coded here. Nothing is exposed to the browser unless
// it is explicitly prefixed NEXT_PUBLIC_ by the operator.

const MISSING = "Supabase environment variable is not set";

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error(`${MISSING}: NEXT_PUBLIC_SUPABASE_URL`);
  return url;
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error(`${MISSING}: NEXT_PUBLIC_SUPABASE_ANON_KEY`);
  return key;
}

/**
 * Service-role key. Server-only. Must never be passed to a client component or
 * prefixed with NEXT_PUBLIC_. Returns null instead of throwing so optional
 * admin paths can degrade without crashing the public site.
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
