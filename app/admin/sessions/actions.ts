"use server";

import { revalidatePath } from "next/cache";
import { requireAdminOrLeader } from "@/lib/admin/authorization";

export type CreatedFeedbackSession = { id: string; token: string; expiresAt: string; title: string };
export type CreateSessionState = { status: "idle" | "success" | "error"; message?: string; session?: CreatedFeedbackSession };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function createFeedbackSessionAction(_previous: CreateSessionState, formData: FormData): Promise<CreateSessionState> {
  const { user, profile, supabase, assignedTrackIds } = await requireAdminOrLeader("/admin/sessions");
  const trackId = String(formData.get("track_id") ?? "");
  const courseId = String(formData.get("course_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const preset = String(formData.get("duration_preset") ?? "60");
  const custom = Number(formData.get("custom_minutes") ?? 0);
  const durationMinutes = preset === "custom" ? custom : Number(preset);
  if (!UUID.test(trackId) || !UUID.test(courseId)) return { status: "error", message: "Choose a valid track and course." };
  if (profile.role === "leader" && !assignedTrackIds.includes(trackId)) return { status: "error", message: "You can create sessions only for tracks assigned to your account." };
  if (title.length < 2 || title.length > 200) return { status: "error", message: "Session title must be between 2 and 200 characters." };
  if (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 10080) return { status: "error", message: "Choose a duration from 1 minute to 7 days." };

  const db = supabase as unknown as { from: (table: string) => any };
  const { data: course } = await db.from("courses").select("id,track_id,title").eq("id", courseId).maybeSingle();
  if (!course || course.track_id !== trackId) return { status: "error", message: "That course does not belong to the selected track." };

  const expiresAt = new Date(Date.now() + durationMinutes * 60_000).toISOString();
  const { data, error } = await db.from("feedback_sessions")
    .insert({ track_id: trackId, course_id: courseId, title, feedback_expires_at: expiresAt, created_by: user.id })
    .select("id,feedback_token,feedback_expires_at,title").single();
  if (error || !data) return { status: "error", message: "The QR feedback session could not be created. Confirm the Supabase migration is applied and try again." };

  revalidatePath("/admin/sessions");
  revalidatePath("/admin/feedback");
  return { status: "success", message: "QR feedback session created.", session: { id: data.id, token: data.feedback_token, expiresAt: data.feedback_expires_at, title: data.title } };
}

export async function closeFeedbackSessionAction(formData: FormData) {
  const { user, profile, supabase, assignedTrackIds } = await requireAdminOrLeader("/admin/sessions");
  const sessionId = String(formData.get("session_id") ?? "");
  if (!UUID.test(sessionId)) return;
  const db = supabase as unknown as { from: (table: string) => any };
  const { data: session } = await db.from("feedback_sessions").select("id,track_id,feedback_closed_at").eq("id", sessionId).maybeSingle();
  if (!session || session.feedback_closed_at) return;
  if (profile.role === "leader" && !assignedTrackIds.includes(session.track_id)) return;
  const { error } = await db.from("feedback_sessions").update({ feedback_closed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", sessionId);
  if (!error) {
    revalidatePath("/admin/sessions");
    revalidatePath("/admin/feedback");
  }
}
