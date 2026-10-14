"use server";

import { revalidatePath } from "next/cache";
import { requireGlobalAdmin } from "@/lib/admin/authorization";

export async function createRecruitmentQuestionAction(formData: FormData) {
  const { supabase } = await requireGlobalAdmin("/admin/questions");
  const label = String(formData.get("label") ?? "").trim();
  const fieldType = String(formData.get("field_type") ?? "text");
  const options = String(formData.get("options") ?? "").split("\n").map((value) => value.trim()).filter(Boolean).slice(0, 30);
  const required = formData.get("required") === "on";
  const position = Number(formData.get("position") ?? 0);
  if (label.length < 2 || label.length > 200 || !["text", "textarea", "select"].includes(fieldType)) return;
  if (fieldType === "select" && options.length < 2) return;
  const db = supabase as unknown as { from: (table: string) => any };
  await db.from("recruitment_questions").insert({ label, field_type: fieldType, options: fieldType === "select" ? options : [], required, enabled: true, position: Number.isFinite(position) ? position : 0 });
  revalidatePath("/admin/questions");
  revalidatePath("/join");
}

export async function updateRecruitmentQuestionAction(formData: FormData) {
  const { supabase } = await requireGlobalAdmin("/admin/questions");
  const id = String(formData.get("id") ?? "");
  const enabled = formData.get("enabled") === "true";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  const db = supabase as unknown as { from: (table: string) => any };
  await db.from("recruitment_questions").update({ enabled, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/questions");
  revalidatePath("/join");
}

export async function deleteRecruitmentQuestionAction(formData: FormData) {
  const { supabase } = await requireGlobalAdmin("/admin/questions");
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  const db = supabase as unknown as { from: (table: string) => any };
  await db.from("recruitment_questions").delete().eq("id", id);
  revalidatePath("/admin/questions");
  revalidatePath("/join");
}
