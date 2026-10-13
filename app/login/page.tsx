"use client";

import Link from "next/link";
import { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuthShell, AuthFieldError, AuthNotice } from "@/components/auth/AuthShell";
import { loginAction, type AuthFormState } from "@/lib/auth-actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    loginAction,
    { status: "idle" }
  );

  return (
    <AuthShell
      title="Sign in"
      lede="Use your MCC student account to access courses and track your progress."
      footer={
        <p>
          New here? <Link href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}>Create a student account</Link>
          {" · "}
          <Link href="/auth/reset-password">Forgot password?</Link>
        </p>
      }
    >
      {state.status === "error" && state.message && (
        <AuthNotice kind="error">{state.message}</AuthNotice>
      )}
      {state.status === "needs_confirmation" && state.message && (
        <AuthNotice kind="info">{state.message}</AuthNotice>
      )}
      <form className="auth-form" action={formAction} noValidate>
        {next && <input type="hidden" name="next" value={next} />}
        <div className="jn-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={state.fieldErrors?.email ? true : undefined}
            aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
          />
          <span id="email-error">
            <AuthFieldError message={state.fieldErrors?.email} />
          </span>
        </div>
        <div className="jn-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-invalid={state.fieldErrors?.password ? true : undefined}
            aria-describedby={state.fieldErrors?.password ? "password-error" : undefined}
          />
          <span id="password-error">
            <AuthFieldError message={state.fieldErrors?.password} />
          </span>
        </div>
        <Button variant="primary" type="submit" size="lg" disabled={isPending} style={{ width: "100%" }}>
          <LogIn size={17} /> {isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
