import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppRole, Profile } from "@/lib/supabase/types";

export interface AuthUser {
  id: string;
  email: string;
}

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;

  return {
    id: data.claims.sub,
    email: typeof data.claims.email === "string" ? data.claims.email : "",
  };
});

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("id,email,role,display_name,team_id,created_at,updated_at")
    .eq("id", user.id)
    .maybeSingle();
  return data ?? null;
});

export async function requireUser(nextPath?: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login");
  }
  return user;
}

export async function requireAdmin(nextPath?: string): Promise<{ user: AuthUser; profile: Profile }> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login");
  }
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== ("admin" as AppRole)) {
    redirect("/dashboard?error=admin-required");
  }
  return { user, profile };
}
