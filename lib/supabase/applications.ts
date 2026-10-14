// Insert path for join-form applications.
//
// Uses the ANON client (not the service-role admin client) on purpose: RLS is
// the enforcement boundary, and the `applications_anon_insert` policy requires
// `status = 'pending'`. A compromised or buggy caller therefore cannot inject a
// reviewed/accepted row, and cannot read anyone's submission.

import { createSupabaseServerClient } from "./server";
import { isSupabaseConfigured } from "./env";
import type { ApplicationInsert } from "./types";

export type SubmitResult =
  | { ok: true }
  | { ok: false; kind: "duplicate" | "unavailable" | "error"; message: string };

export async function submitApplication(
  input: ApplicationInsert,
  submittedIp: string | null
): Promise<SubmitResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      kind: "unavailable",
      message: "Applications are not connected yet. Please try again later.",
    };
  }

  const supabase = await createSupabaseServerClient();

  // Cast the insert payload: supabase-js narrows `.insert()` awkwardly against
  // our hand-written Database type, so we assert the row shape explicitly.
  const row = {
    name: input.name,
    email: input.email,
    interests: input.interests,
    phone_number: input.phone_number,
    answers: input.answers,
    motivation: input.motivation ?? null,
    heard_from: input.heard_from ?? null,
    status: "pending" as const,
    submitted_ip: submittedIp,
  };

  const { error } = await (supabase
    .from("applications") as unknown as {
      insert: (values: Record<string, unknown>) => Promise<{ error: { code?: string; message: string } | null }>;
    }).insert(row);

  if (error) {
    // 23505 = unique_violation on lower(email).
    if (error.code === "23505") {
      return {
        ok: false,
        kind: "duplicate",
        message: "An application for this email already exists.",
      };
    }
    return { ok: false, kind: "error", message: error.message };
  }

  return { ok: true };
}
