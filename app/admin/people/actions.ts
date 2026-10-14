"use server";

import { revalidatePath } from "next/cache";
import { requireGlobalAdmin } from "@/lib/admin/authorization";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function updateMemberRoleAction(formData: FormData) {
  const { user, supabase } = await requireGlobalAdmin("/admin/people");
  const targetUserId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "");
  const trackId = String(formData.get("track_id") ?? "");
  if (!UUID.test(targetUserId) || !["admin", "leader", "member"].includes(role)) return;
  if (targetUserId === user.id && role !== "admin") return;
  if (role === "leader" && !UUID.test(trackId)) return;

  const db = supabase as unknown as { from: (table: string) => any; rpc: (fn: string, args: Record<string, unknown>) => Promise<{ error: { message: string } | null }> };
  const { data: target } = await db.from("profiles").select("id,role").eq("id", targetUserId).maybeSingle();
  if (!target) return;
  if (target.role === "admin" && role !== "admin") {
    const { count } = await db.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) <= 1) return;
  }
  const changed = await db.rpc("admin_set_profile_role", { target_user_id: targetUserId, new_role: role });
  if (changed.error) return;

  if (role === "leader") {
    await db.from("track_leaders").upsert({ user_id: targetUserId, track_id: trackId, assigned_by: user.id }, { onConflict: "track_id,user_id" });
  } else {
    await db.from("track_leaders").delete().eq("user_id", targetUserId);
  }
  revalidatePath("/admin/people");
  revalidatePath("/admin/leader");
  revalidatePath("/admin");
}
