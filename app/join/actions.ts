"use server";

// Server action for the join form.
//
// Protections, in order:
//   1. Honeypot field — bots that fill it get a fake success, no insert.
//   2. In-memory rate limit per IP — best-effort, per-instance (documented).
//   3. Server-side validation — never trust the client's own checks.
//   4. Anon RLS insert — status is forced to 'pending', never user-controlled.
//
// No credentials appear here. The anon key is read from the environment by the
// client factory, and the service-role key is never used on this path.

import { headers } from "next/headers";
import { validateApplication } from "@/lib/validation/application";
import { checkRateLimit } from "@/lib/rate-limit";
import { submitApplication } from "@/lib/supabase/applications";

export interface JoinFormServerState {
  status: "idle" | "success" | "error";
  errors?: Record<string, string>;
  message?: string;
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function clientIp(headersList: Headers): string {
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headersList.get("x-real-ip") ?? "unknown";
}

export async function submitJoinApplication(
  _previous: JoinFormServerState,
  formData: FormData
): Promise<JoinFormServerState> {
  // 1. Honeypot. Real users never see or fill this field.
  const honeypot = String(formData.get("website") ?? "");
  if (honeypot.trim().length > 0) {
    // Pretend success so the bot gets no signal that it was caught.
    return { status: "success" };
  }

  // 2. Rate limit.
  const headersList = await headers();
  const ip = clientIp(headersList);
  const decision = checkRateLimit(
    `join:${ip}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS
  );
  if (!decision.allowed) {
    return {
      status: "error",
      message: `Too many submissions. Please try again in ${decision.retryAfterSeconds} seconds.`,
    };
  }

  // 3. Validate.
  const parsed = validateApplication({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    answers: Object.fromEntries([...formData.entries()].filter(([key]) => key.startsWith("question_")).map(([key, value]) => [key.slice("question_".length), String(value)])),
    interests: formData.getAll("interests"),
    customInterest: formData.get("customInterest"),
    motivation: formData.get("motivation"),
    heardFrom: formData.get("heardFrom"),
  });
  if (!parsed.ok) {
    return { status: "error", errors: parsed.errors };
  }

  // Load current form configuration on the server; validate answers even if a
  // caller bypasses the browser's required attributes.
  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const questionClient = await createSupabaseServerClient();
  const questionResult = await (questionClient as unknown as { from: (table: string) => any })
    .from("recruitment_questions").select("id,label,field_type,options,required").eq("enabled", true);
  if (questionResult.error) {
    return { status: "error", message: "The application form is temporarily unavailable. Please try again later." };
  }
  const acceptedAnswers: Record<string, string> = {};
  for (const question of (questionResult.data ?? []) as Array<{ id: string; label: string; field_type: string; options: string[]; required: boolean }>) {
    const raw = parsed.value.answers[question.id] ?? "";
    if (question.required && !raw.trim()) {
      return { status: "error", errors: { ["question_" + question.id]: question.label + " is required." } };
    }
    if (raw && (raw.length > 2000 || (question.field_type === "select" && !(question.options ?? []).includes(raw)))) {
      return { status: "error", errors: { ["question_" + question.id]: "Choose a valid answer for this question." } };
    }
    if (raw) acceptedAnswers[question.id] = raw;
  }

  // 4. Persist (anon client, RLS-enforced pending).
  const result = await submitApplication(
    {
      name: parsed.value.name,
      email: parsed.value.email,
      interests: parsed.value.interests,
      phone_number: parsed.value.phone,
      answers: acceptedAnswers,
      motivation: parsed.value.motivation,
      heard_from: parsed.value.heardFrom,
    },
    ip === "unknown" ? null : ip
  );

  if (!result.ok) {
    return { status: "error", message: result.message };
  }

  return { status: "success" };
}
