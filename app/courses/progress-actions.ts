"use server";

// Lesson completion server actions. Progress rows are per-student; RLS
// restricts every read/write to the caller's own user_id.

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export interface ProgressActionState {
  ok: boolean;
  completed?: boolean;
  message?: string;
}

export async function setLessonCompletion(
  lessonId: string,
  courseId: string,
  completed: boolean
): Promise<ProgressActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, message: "Sign in to save your progress." };
  }
  if (!lessonId || !courseId) {
    return { ok: false, message: "Missing lesson." };
  }

  const supabase = await createSupabaseServerClient();

  if (completed) {
    const { error } = await supabase
      .from("lesson_progress")
      .upsert(
        { user_id: user.id, lesson_id: lessonId, course_id: courseId },
        { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
      );
    if (error) return { ok: false, message: error.message };
    return { ok: true, completed: true };
  }

  const { error } = await supabase
    .from("lesson_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId);
  if (error) return { ok: false, message: error.message };
  return { ok: true, completed: false };
}

export async function toggleLessonCompletion(
  _prev: ProgressActionState,
  formData: FormData
): Promise<ProgressActionState> {
  const lessonId = String(formData.get("lessonId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const lessonSlug = String(formData.get("lessonSlug") ?? "");
  const courseSlug = String(formData.get("courseSlug") ?? "");
  const currentlyCompleted = String(formData.get("completed") ?? "") === "true";
  const result = await setLessonCompletion(lessonId, courseId, !currentlyCompleted);
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath(`/courses/${courseSlug || "unknown"}`);
    if (courseSlug && lessonSlug) {
      revalidatePath(`/courses/${courseSlug}/lessons/${lessonSlug}`);
    }
  }
  return result;
}
