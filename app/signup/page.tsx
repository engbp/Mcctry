"use client";

import Link from "next/link";
import { useActionState, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuthShell, AuthFieldError, AuthNotice } from "@/components/auth/AuthShell";
import { signupAction, type AuthFormState } from "@/lib/auth-actions";

function SignupForm() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const strength = useMemo(() => [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length, [password]);
  const next = searchParams.get("next") ?? "";
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    signupAction,
    { status: "idle" }
  );

  if (state.status === "needs_confirmation") {
    return (
      <AuthShell
        title="Confirm your email"
        lede="We sent you a confirmation link. Open it to activate your account, then sign in."
        footer={<p><Link href="/login">Back to sign in</Link></p>}
      >
        <AuthNotice kind="success">
          <CheckCircle size={17} /> {state.message}
        </AuthNotice>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      lede="A student account lets you watch lessons and keep your learning progress in one place."
      footer={
        <p>
          Already have an account? <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}>Sign in</Link>
        </p>
      }
    >
      {state.status === "error" && state.message && (
        <AuthNotice kind="error">{state.message}</AuthNotice>
      )}
      <form className="auth-form" action={formAction} noValidate>
        {next && <input type="hidden" name="next" value={next} />}
        <div className="jn-field">
          <label htmlFor="displayName">Full name</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            maxLength={120}
            required
            aria-invalid={state.fieldErrors?.displayName ? true : undefined}
          />
          <AuthFieldError message={state.fieldErrors?.displayName} />
        </div>
        <div className="jn-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={state.fieldErrors?.email ? true : undefined}
          />
          <AuthFieldError message={state.fieldErrors?.email} />
        </div>
        <div className="jn-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            aria-invalid={state.fieldErrors?.password ? true : undefined}
          />
          <AuthFieldError message={state.fieldErrors?.password} />
          <p className="auth-hint">At least 8 characters.</p>
        </div>
        <Button variant="primary" type="submit" size="lg" disabled={isPending} style={{ width: "100%" }}>
          <UserPlus size={17} /> {isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
