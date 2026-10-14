"use client";

import { useActionState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuthShell, AuthFieldError, AuthNotice } from "@/components/auth/AuthShell";
import { requestPasswordResetAction, type AuthFormState } from "@/lib/auth-actions";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    requestPasswordResetAction,
    { status: "idle" }
  );

  return (
    <AuthShell
      title="Reset your password"
      lede="Enter your account email and we'll send you a link to set a new password."
      footer={<p><Link href="/login">Back to sign in</Link></p>}
    >
      {state.status === "success" && state.message && (
        <AuthNotice kind="success">{state.message}</AuthNotice>
      )}
      {state.status === "error" && state.message && (
        <AuthNotice kind="error">{state.message}</AuthNotice>
      )}
      <form className="auth-form" action={formAction} noValidate>
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
        <Button variant="primary" type="submit" size="lg" disabled={isPending} style={{ width: "100%" }}>
          <KeyRound size={17} /> {isPending ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </AuthShell>
  );
}
