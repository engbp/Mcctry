"use server";

import { revalidatePath } from "next/cache";
import { requireAdminOrLeader } from "@/lib/admin/authorization";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const clean = (value: FormDataEntryValue | null) => String(value ?? "").trim();

export async function saveAssignedResourceAction(formData: FormData) {
  const id = clean(formData.get("id"));
  const courseId = clean(formData.get("course_id"));
  const lessonId = clean(formData.get("lesson_id"));
  const title = clean(formData.get("title"));
  const slug = clean(formData.get("slug"));
  const description = clean(formData.get("description")) || null;
  const link = clean(formData.get("link")) || null;
  const category = clean(formData.get("category")) || null;
  const icon = clean(formData.get("icon")) || "BookOpen";
  const published = formData.get("published") === "on";
  const external = formData.get("external") === "on";
  const position = Number(formData.get("position") ?? 0);

  if ((id && !UUID.test(id)) || !UUID.test(courseId) || (lessonId && !UUID.test(lessonId))) return;
  if (title.length < 1 || title.length > 200 || !SLUG.test(slug) || (description && description.length > 3000) || (link && link.length > 2048) || !Number.isInteger(position) || position < 0) return;
  if (link) {
    try { const parsed = new URL(link); if (!["https:", "http:"].includes(parsed.protocol)) return; }
    catch { return; }
  }

  const { profile, assignedTrackIds, supabase } = await requireAdminOrLeader("/admin/leader/resources");
  const db = supabase as unknown as { from: (table: string) => any };
  const { data: course } = await db.from("courses").select("id,track_id").eq("id", courseId).maybeSingle();
  if (!course || (profile.role === "leader" && !assignedTrackIds.includes(course.track_id))) return;
  if (lessonId) {
    const { data: lesson } = await db.from("lessons").select("id,course_id").eq("id", lessonId).maybeSingle();
    if (!lesson || lesson.course_id !== courseId) return;
  }
  if (id) {
    const { data: existing } = await db.from("resources").select("id,course_id,lesson_id").eq("id", id).maybeSingle();
    if (!existing) return;
    if (profile.role === "leader" && !existing.course_id && !existing.lesson_id) return;
  }

  const record = { title, slug, description, link, category, icon, course_id: courseId, lesson_id: lessonId || null, published, external, position, updated_at: new Date().toISOString() };
  if (id) await db.from("resources").update(record).eq("id", id);
  else await db.from("resources").insert(record);
  revalidatePath("/admin/leader/resources");
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  revalidatePath("/courses");
}

export async function deleteAssignedResourceAction(formData: FormData) {
  const id = clean(formData.get("id"));
  if (!UUID.test(id)) return;
  const { profile, assignedTrackIds, supabase } = await requireAdminOrLeader("/admin/leader/resources");
  const db = supabase as unknown as { from: (table: string) => any };
  const { data: existing } = await db.from("resources").select("id,course_id,lesson_id").eq("id", id).maybeSingle();
  if (!existing) return;
  if (profile.role === "leader") {
    let courseId: string | null = existing.course_id;
    if (!courseId && existing.lesson_id) {
      const { data: lesson } = await db.from("lessons").select("course_id").eq("id", existing.lesson_id).maybeSingle();
      courseId = lesson?.course_id ?? null;
    }
    if (!courseId) return;
    const { data: course } = await db.from("courses").select("track_id").eq("id", courseId).maybeSingle();
    if (!course || !assignedTrackIds.includes(course.track_id)) return;
  }
  await db.from("resources").delete().eq("id", id);
  revalidatePath("/admin/leader/resources");
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
}
