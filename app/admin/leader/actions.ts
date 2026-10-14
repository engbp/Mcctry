"use server";

import { revalidatePath } from "next/cache";
import { requireAdminOrLeader } from "@/lib/admin/authorization";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const clean = (value: FormDataEntryValue | null) => String(value ?? "").trim();

async function canManageTrack(trackId: string) {
  const auth = await requireAdminOrLeader("/admin/leader");
  if (auth.profile.role === "leader" && !auth.assignedTrackIds.includes(trackId)) {
    throw new Error("This track is not assigned to your account.");
  }
  return auth;
}

export async function saveAssignedTrackAction(formData: FormData) {
  const trackId = clean(formData.get("track_id"));
  const title = clean(formData.get("title"));
  const description = clean(formData.get("description")) || null;
  if (!UUID.test(trackId) || title.length < 1 || title.length > 160 || (description && description.length > 2000)) return;
  const { supabase } = await canManageTrack(trackId);
  const db = supabase as unknown as { from: (table: string) => any };
  await db.from("tracks").update({ title, description, updated_at: new Date().toISOString() }).eq("id", trackId);
  revalidatePath("/admin/leader");
  revalidatePath("/tracks");
  revalidatePath("/");
}

export async function saveAssignedCourseAction(formData: FormData) {
  const courseId = clean(formData.get("course_id"));
  const trackId = clean(formData.get("track_id"));
  const title = clean(formData.get("title"));
  const slug = clean(formData.get("slug"));
  const description = clean(formData.get("description")) || null;
  const published = clean(formData.get("published")) === "on";
  if (!UUID.test(trackId) || title.length < 1 || title.length > 160 || !SLUG.test(slug) || (description && description.length > 3000)) return;
  const { supabase } = await canManageTrack(trackId);
  const db = supabase as unknown as { from: (table: string) => any };
  if (courseId) {
    if (!UUID.test(courseId)) return;
    const { data: existing } = await db.from("courses").select("id,track_id").eq("id", courseId).maybeSingle();
    if (!existing || existing.track_id !== trackId) return;
    await db.from("courses").update({ title, slug, description, published, updated_at: new Date().toISOString() }).eq("id", courseId);
  } else {
    const { count } = await db.from("courses").select("id", { count: "exact", head: true }).eq("track_id", trackId);
    await db.from("courses").insert({ track_id: trackId, title, slug, description, published, position: (count ?? 0) * 10 });
  }
  revalidatePath("/admin/leader");
  revalidatePath("/courses");
  revalidatePath("/");
}

export async function saveAssignedLessonAction(formData: FormData) {
  const lessonId = clean(formData.get("lesson_id"));
  const courseId = clean(formData.get("course_id"));
  const title = clean(formData.get("title"));
  const slug = clean(formData.get("slug"));
  const videoUrl = clean(formData.get("video_url"));
  const published = clean(formData.get("published")) === "on";
  if (!UUID.test(courseId) || title.length < 1 || title.length > 160 || !SLUG.test(slug) || !videoUrl || videoUrl.length > 2048) return;
  try {
    const parsed = new URL(videoUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return;
  } catch { return; }

  const { supabase, profile, assignedTrackIds } = await requireAdminOrLeader("/admin/leader");
  const db = supabase as unknown as { from: (table: string) => any };
  const { data: course } = await db.from("courses").select("id,track_id").eq("id", courseId).maybeSingle();
  if (!course || (profile.role === "leader" && !assignedTrackIds.includes(course.track_id))) return;
  if (lessonId) {
    if (!UUID.test(lessonId)) return;
    const { data: existing } = await db.from("lessons").select("id,course_id").eq("id", lessonId).maybeSingle();
    if (!existing || existing.course_id !== courseId) return;
    await db.from("lessons").update({ title, slug, video_url: videoUrl, published, updated_at: new Date().toISOString() }).eq("id", lessonId);
  } else {
    const { count } = await db.from("lessons").select("id", { count: "exact", head: true }).eq("course_id", courseId);
    await db.from("lessons").insert({ course_id: courseId, title, slug, video_url: videoUrl, published, position: (count ?? 0) * 10 });
  }
  revalidatePath("/admin/leader");
  revalidatePath("/courses");
  revalidatePath("/");
}
