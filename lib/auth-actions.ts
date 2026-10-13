"use server";

// Authentication server actions. All identity decisions come from Supabase
// Auth via the cookie-bound server client — never from client input.

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

export interface AuthFormState {
  status: "idle" | "error" | "success" | "needs_confirmation";
  message?: string;
  fieldErrors?: Record<string, string>;
}

const AUTH_RATE_LIMIT_MAX = 10;
const AUTH_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function sanitizeNext(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/dashboard";
}

function rateLimited(state: AuthFormState, key: string): AuthFormState | null {
  const decision = checkRateLimit(key, AUTH_RATE_LIMIT_MAX, AUTH_RATE_LIMIT_WINDOW_MS);
  if (!decision.allowed) {
    return {
      status: "error",
      message: `Too many attempts. Please try again in ${decision.retryAfterSeconds} seconds.`,
    };
  }
  return null;
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = sanitizeNext(formData.get("next") as string | null);

  const fieldErrors: Record<string, string> = {};
  if (!email) fieldErrors.email = "Email is required.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (!password) fieldErrors.password = "Password is required.";
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  const limited = rateLimited({ status: "error" }, `login:${email}`);
  if (limited) return limited;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        status: "needs_confirmation",
        message: "Please confirm your email address first. Check your inbox for the confirmation link.",
      };
    }
    if (error.message.toLowerCase().includes("invalid login")) {
      return { status: "error", message: "Incorrect email or password." };
    }
    return { status: "error", message: error.message };
  }
  if (!data.session) {
    return { status: "error", message: "Sign-in failed. Please try again." };
  }

  redirect(next);
}

export async function signupAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = sanitizeNext(formData.get("next") as string | null);

  const fieldErrors: Record<string, string> = {};
  if (!displayName) fieldErrors.displayName = "Name is required.";
  else if (displayName.length > 120) fieldErrors.displayName = "Name must be 120 characters or fewer.";
  if (!email) fieldErrors.email = "Email is required.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (!password) fieldErrors.password = "Password is required.";
  else if (password.length < 8) fieldErrors.password = "Password must be at least 8 characters.";
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  const limited = rateLimited({ status: "error" }, `signup:${email}`);
  if (limited) return limited;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // The database trigger (handle_new_user) creates the profile with
      // role 'member'. display_name is a hint only; role is never taken
      // from metadata.
      data: { display_name: displayName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mcctry.vercel.app"}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return {
        status: "error",
        message: "An account with this email already exists. Try signing in instead.",
      };
    }
    return { status: "error", message: error.message };
  }

  // No session => email confirmation is required before sign-in.
  if (!data.session) {
    return {
      status: "needs_confirmation",
      message: "Almost there — check your inbox and confirm your email address, then sign in.",
    };
  }

  redirect(next);
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordResetAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: "error", fieldErrors: { email: "Enter a valid email address." } };
  }

  const limited = rateLimited({ status: "error" }, `reset:${email}`);
  if (limited) return limited;

  const supabase = await createSupabaseServerClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mcctry.vercel.app"}/auth/update-password`,
  });
  // Always show success so the response does not reveal whether the email exists.
  return {
    status: "success",
    message: "If an account exists for that email, a password reset link is on its way.",
  };
}

export async function updatePasswordAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const fieldErrors: Record<string, string> = {};
  if (!password || password.length < 8) fieldErrors.password = "Password must be at least 8 characters.";
  if (password !== confirm) fieldErrors.confirm = "Passwords do not match.";
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/auth/update-password");
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { status: "error", message: error.message };
  }
  redirect("/dashboard");
}
