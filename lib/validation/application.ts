// Server-side validation for join-form applications.
// Deliberately framework-agnostic and dependency-free so it can be unit-tested
// locally with no network and no Supabase instance.

export type ValidationResult =
  | { ok: true; value: ValidatedApplication }
  | { ok: false; errors: Record<string, string> };

export interface ValidatedApplication {
  name: string;
  email: string;
  phone: string;
  interests: string[];
  answers: Record<string, string>;
  motivation: string | null;
  heardFrom: string | null;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MOTIVATION = 3000;
const MAX_PHONE = 30;
const MAX_HEARD_FROM = 200;
const MAX_INTERESTS = 20;

export interface RawApplicationInput {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  interests?: unknown;
  answers?: unknown;
  customInterest?: unknown;
  motivation?: unknown;
  heardFrom?: unknown;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validate and normalise a raw join-form payload.
 * `customInterest` is folded into `interests` so a student can add a topic that
 * is not in the predefined checkbox list.
 */
export function validateApplication(
  input: RawApplicationInput
): ValidationResult {
  const errors: Record<string, string> = {};

  const name = asString(input.name);
  if (!name) errors.name = "Name is required";
  else if (name.length > MAX_NAME) errors.name = `Name must be ${MAX_NAME} characters or fewer`;

  const email = asString(input.email).toLowerCase();
  if (!email) errors.email = "Email is required";
  else if (email.length > MAX_EMAIL) errors.email = `Email must be ${MAX_EMAIL} characters or fewer`;
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address";

  const phone = asString(input.phone);
  const compactPhone = phone.replace(/[\s().-]/g, "");
  if (!phone) errors.phone = "Phone number is required";
  else if (phone.length > MAX_PHONE || !/^\+?[0-9]{7,20}$/.test(compactPhone)) errors.phone = "Enter a valid phone number (7–20 digits)";

  const rawAnswers = input.answers && typeof input.answers === "object" && !Array.isArray(input.answers)
    ? input.answers as Record<string, unknown>
    : {};
  const answers: Record<string, string> = {};
  for (const [id, value] of Object.entries(rawAnswers)) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) continue;
    if (typeof value === "string" && value.trim()) answers[id] = value.trim().slice(0, 2000);
  }

  const rawInterests = Array.isArray(input.interests)
    ? input.interests.filter((i): i is string => typeof i === "string").map((i) => i.trim()).filter(Boolean)
    : [];
  const customInterest = asString(input.customInterest);
  const interests = customInterest ? [...rawInterests, customInterest] : rawInterests;

  if (interests.length === 0) {
    errors.interests = "Select at least one interest or add your own";
  } else if (interests.length > MAX_INTERESTS) {
    errors.interests = `Choose ${MAX_INTERESTS} interests or fewer`;
  } else if (interests.some((i) => i.length > 120)) {
    errors.interests = "Each interest must be 120 characters or fewer";
  }

  const motivationRaw = asString(input.motivation);
  let motivation: string | null = null;
  if (motivationRaw) {
    if (motivationRaw.length > MAX_MOTIVATION) {
      errors.motivation = `Motivation must be ${MAX_MOTIVATION} characters or fewer`;
    } else {
      motivation = motivationRaw;
    }
  }

  const heardFrom = asString(input.heardFrom) || null;
  if (heardFrom && heardFrom.length > MAX_HEARD_FROM) {
    errors.heardFrom = `This field must be ${MAX_HEARD_FROM} characters or fewer`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: { name, email, phone, interests, answers, motivation, heardFrom },
  };
}
