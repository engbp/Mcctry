import { redirect } from "next/navigation";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdminOrLeader(nextPath = "/admin/leader") {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=" + encodeURIComponent(nextPath));
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "leader")) redirect("/dashboard?error=admin-required");
  const supabase = await createSupabaseServerClient();
  let assignedTrackIds: string[] = [];
  if (profile.role === "leader") {
    const result = await (supabase as unknown as { from: (table: string) => any })
      .from("track_leaders").select("track_id").eq("user_id", user.id);
    assignedTrackIds = (result.data ?? []).map((row: { track_id: string }) => row.track_id);
  }
  return { user, profile, supabase, assignedTrackIds };
}

export async function requireGlobalAdmin(nextPath = "/admin") {
  const { user, profile, supabase } = await requireAdminOrLeader(nextPath);
  if (profile.role !== "admin") redirect("/admin/leader?error=admin-only");
  return { user, profile, supabase };
}
