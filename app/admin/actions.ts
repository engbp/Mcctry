"use server";

// Admin server actions. Every action re-checks the caller's session and role
// on the server; RLS on the tables is the final enforcement boundary.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export interface AdminActionResult {
  ok: boolean;
  message?: string;
}

async function requireAdminClient() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard?error=admin-required");
  }
  return { user, supabase };
}

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/tracks");
  revalidatePath("/admin/courses");
  revalidatePath("/admin/lessons");
  revalidatePath("/admin/resources");
  revalidatePath("/");
  revalidatePath("/tracks");
  revalidatePath("/courses");
  revalidatePath("/resources");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// ---------------------------------------------------------------------------
// Tracks
// ---------------------------------------------------------------------------

export async function saveTrackAction(
  _prev: AdminActionResult,
  formData: FormData
): Promise<AdminActionResult> {
  const { supabase } = await requireAdminClient();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const description = String(formData.get("description") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "").trim() || null;
  const duration = String(formData.get("duration") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const position = Number(formData.get("position") ?? 0) || 0;

  if (!title || title.length > 160) return { ok: false, message: "Title is required (max 160 chars)." };
  if (!slug) return { ok: false, message: "Slug is required." };

  if (id) {
    const { error } = await supabase
      .from("tracks")
      .update({ title, slug, description, color, duration, published, featured, position })
      .eq("id", id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase
      .from("tracks")
      .insert({ title, slug, description, color, duration, published, featured, position });
    if (error) return { ok: false, message: error.message };
  }
  revalidateAdmin();
  revalidatePath("/tracks");
  return { ok: true };
}

export async function deleteTrackAction(
  _prev: AdminActionResult,
  formData: FormData
): Promise<AdminActionResult> {
  const { supabase } = await requireAdminClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Missing track." };
  const { error } = await supabase.from("tracks").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidateAdmin();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

export async function saveCourseAction(
  _prev: AdminActionResult,
  formData: FormData
): Promise<AdminActionResult> {
  const { supabase } = await requireAdminClient();
  const id = String(formData.get("id") ?? "");
  const trackId = String(formData.get("trackId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const description = String(formData.get("description") ?? "").trim() || null;
  const level = String(formData.get("level") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "").trim() || null;
  const duration = String(formData.get("duration") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const position = Number(formData.get("position") ?? 0) || 0;

  if (!title || title.length > 160) return { ok: false, message: "Title is required (max 160 chars)." };
  if (!trackId) return { ok: false, message: "Choose a track." };

  if (id) {
    const { error } = await supabase
      .from("courses")
      .update({ track_id: trackId, title, slug, description, level, color, duration, published, featured, position })
      .eq("id", id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase
      .from("courses")
      .insert({ track_id: trackId, title, slug, description, level, color, duration, published, featured, position });
    if (error) return { ok: false, message: error.message };
  }
  revalidateAdmin();
  revalidatePath("/courses");
  return { ok: true };
}

export async function deleteCourseAction(
  _prev: AdminActionResult,
  formData: FormData
): Promise<AdminActionResult> {
  const { supabase } = await requireAdminClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Missing course." };
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidateAdmin();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

export async function saveLessonAction(
  _prev: AdminActionResult,
  formData: FormData
): Promise<AdminActionResult> {
  const { supabase } = await requireAdminClient();
  const id = String(formData.get("id") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const duration = String(formData.get("duration") ?? "").trim() || null;
  const type = String(formData.get("type") ?? "").trim() || "video";
  const videoUrl = String(formData.get("videoUrl") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const position = Number(formData.get("position") ?? 0) || 0;

  if (!title || title.length > 200) return { ok: false, message: "Title is required (max 200 chars)." };
  if (!courseId) return { ok: false, message: "Choose a course." };
  if (videoUrl && !/^https?:\/\//i.test(videoUrl)) {
    return { ok: false, message: "Video URL must start with http:// or https://." };
  }

  if (id) {
    const { error } = await supabase
      .from("lessons")
      .update({ course_id: courseId, title, slug, duration, type, video_url: videoUrl, published, position })
      .eq("id", id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase
      .from("lessons")
      .insert({ course_id: courseId, title, slug, duration, type, video_url: videoUrl, published, position });
    if (error) return { ok: false, message: error.message };
  }
  revalidateAdmin();
  revalidatePath("/courses");
  return { ok: true };
}

export async function deleteLessonAction(
  _prev: AdminActionResult,
  formData: FormData
): Promise<AdminActionResult> {
  const { supabase } = await requireAdminClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Missing lesson." };
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidateAdmin();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

export async function saveResourceAction(
  _prev: AdminActionResult,
  formData: FormData
): Promise<AdminActionResult> {
  const { supabase } = await requireAdminClient();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const description = String(formData.get("description") ?? "").trim() || null;
  const link = String(formData.get("link") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim() || null;
  const icon = String(formData.get("icon") ?? "").trim() || "BookOpen";
  const external = formData.get("external") === "on";
  const published = formData.get("published") === "on";
  const position = Number(formData.get("position") ?? 0) || 0;

  if (!title || title.length > 200) return { ok: false, message: "Title is required (max 200 chars)." };
  if (link && !/^https?:\/\//i.test(link) && !link.startsWith("/")) {
    return { ok: false, message: "Link must be an http(s) URL or a site path." };
  }

  if (id) {
    const { error } = await supabase
      .from("resources")
      .update({ title, slug, description, link, category, icon, external, published, position })
      .eq("id", id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase
      .from("resources")
      .insert({ title, slug, description, link, category, icon, external, published, position });
    if (error) return { ok: false, message: error.message };
  }
  revalidateAdmin();
  revalidatePath("/resources");
  return { ok: true };
}

export async function deleteResourceAction(
  _prev: AdminActionResult,
  formData: FormData
): Promise<AdminActionResult> {
  const { supabase } = await requireAdminClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Missing resource." };
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidateAdmin();
  return { ok: true };
}
