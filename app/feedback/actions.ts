"use server";

import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type FeedbackState = { status: "idle" | "success" | "error"; message?: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function limited(key: string) {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? requestHeaders.get("x-real-ip") ?? "unknown";
  const decision = checkRateLimit(key + ":" + ip, 5, 10 * 60 * 1000);
  return decision.allowed ? null : "Too many submissions. Please wait a few minutes and try again.";
}

export async function submitCourseFeedback(_previous: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const wait = await limited("course-feedback");
  if (wait) return { status: "error", message: wait };

  const courseId = String(formData.get("course_id") ?? "");
  const lessonId = String(formData.get("lesson_id") ?? "");
  const kind = String(formData.get("kind") ?? "review");
  const message = String(formData.get("message") ?? "").trim();
  const ratingRaw = String(formData.get("rating") ?? "");
  const rating = ratingRaw ? Number(ratingRaw) : null;

  if (!UUID.test(courseId) || (lessonId && !UUID.test(lessonId))) {
    return { status: "error", message: "That course or lesson could not be found. Refresh the page and try again." };
  }
  if (kind !== "review" && kind !== "complaint") return { status: "error", message: "Choose review or complaint." };
  if (message.length < 3 || message.length > 4000) return { status: "error", message: "Your message must be between 3 and 4,000 characters." };
  if (kind === "review" && (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating))) {
    return { status: "error", message: "Choose a rating from 1 to 5." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await (supabase as unknown as { from: (table: string) => any })
    .from("course_feedback")
    .insert({ course_id: courseId, lesson_id: lessonId || null, kind, rating: kind === "review" ? rating : null, message });
  if (error) {
    return { status: "error", message: "Feedback could not be saved. The course may no longer be available; please try again." };
  }
  return { status: "success", message: "Thanks. Your feedback was submitted anonymously." };
}

export async function submitSessionFeedback(_previous: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const wait = await limited("session-feedback");
  if (wait) return { status: "error", message: wait };

  const sessionId = String(formData.get("session_id") ?? "");
  const token = String(formData.get("feedback_token") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 0);
  if (!UUID.test(sessionId) || !UUID.test(token)) return { status: "error", message: "This feedback link is invalid." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { status: "error", message: "Choose a rating from 1 to 5." };
  if (message.length < 3 || message.length > 2000) return { status: "error", message: "Your message must be between 3 and 2,000 characters." };

  const supabase = await createSupabaseServerClient();
  const { error } = await (supabase as unknown as { from: (table: string) => any })
    .from("session_feedback")
    .insert({ session_id: sessionId, feedback_token: token, rating, message });
  if (error) {
    return { status: "error", message: "This link may have expired or been closed by the organizer. Ask the session organizer for a new link." };
  }
  return { status: "success", message: "Thank you. Your session feedback was sent anonymously." };
}
