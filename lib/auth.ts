import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppRole, Profile } from "@/lib/supabase/types";

export interface AuthUser {
  id: string;
  email: string;
}

/**
 * Current authenticated user from the session cookie, or null.
 * Never trusts client-supplied identity.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return null;
  return { id: user.id, email: user.email };
}

/**
 * The signed-in user's profile row (role, display name). Null when signed
 * out. RLS scopes this to the caller's own row.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return data ?? null;
}

/** Redirects to /login when signed out. Returns the user when signed in. */
export async function requireUser(nextPath?: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login");
  }
  return user;
}

/**
 * Redirects to /login when signed out, and to /dashboard when the account is
 * not an administrator. Role comes from the profiles table via RLS — never
 * from a query parameter or client header.
 */
export async function requireAdmin(nextPath?: string): Promise<{ user: AuthUser; profile: Profile }> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login");
  }
  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile || profile.role !== ("admin" as AppRole)) {
    redirect("/dashboard?error=admin-required");
  }
  return { user, profile };
}
