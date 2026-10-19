"use server";

import { revalidatePath } from "next/cache";
import { requireGlobalAdmin } from "@/lib/admin/authorization";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ROLES = ["admin", "leader", "member", "student"] as const;
type Role = (typeof ROLES)[number];

export async function updateMemberRoleAction(formData: FormData) {
  const { user, supabase } = await requireGlobalAdmin("/admin/people");
  const targetUserId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "") as Role;
  const trackId = String(formData.get("track_id") ?? "");
  if (!UUID.test(targetUserId) || !ROLES.includes(role)) return;
  if (targetUserId === user.id && role !== "admin") return;
  if (role === "leader" && !UUID.test(trackId)) return;

  const db = supabase as unknown as { from: (table: string) => any };
  const { data: target } = await db.from("profiles").select("id,role").eq("id", targetUserId).maybeSingle();
  if (!target) return;
  if (target.role === "admin" && role !== "admin") {
    const { count } = await db.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) <= 1) return;
  }

  const { data: changed, error: changeError } = await db.from("profiles")
    .update({ role })
    .eq("id", targetUserId)
    .select("id")
    .maybeSingle();
  if (changeError || !changed) return;

  if (role === "leader") {
    await db.from("track_leaders").upsert({ user_id: targetUserId, track_id: trackId, assigned_by: user.id }, { onConflict: "track_id,user_id" });
  } else {
    await db.from("track_leaders").delete().eq("user_id", targetUserId);
  }

  revalidatePath("/admin/people");
  revalidatePath("/admin/leader");
  revalidatePath("/admin");
}
