"use client";

import { useActionState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuthShell, AuthFieldError, AuthNotice } from "@/components/auth/AuthShell";
import { updatePasswordAction, type AuthFormState } from "@/lib/auth-actions";

export default function UpdatePasswordPage() {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    updatePasswordAction,
    { status: "idle" }
  );

  return (
    <AuthShell
      title="Set a new password"
      lede="Choose a new password for your MCC student account."
      footer={<p><Link href="/dashboard">Back to dashboard</Link></p>}
    >
      {state.status === "error" && state.message && (
        <AuthNotice kind="error">{state.message}</AuthNotice>
      )}
      <form className="auth-form" action={formAction} noValidate>
        <div className="jn-field">
          <label htmlFor="password">New password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            aria-invalid={state.fieldErrors?.password ? true : undefined}
          />
          <AuthFieldError message={state.fieldErrors?.password} />
        </div>
        <div className="jn-field">
          <label htmlFor="confirm">Confirm new password</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            aria-invalid={state.fieldErrors?.confirm ? true : undefined}
          />
          <AuthFieldError message={state.fieldErrors?.confirm} />
        </div>
        <Button variant="primary" type="submit" size="lg" disabled={isPending} style={{ width: "100%" }}>
          <KeyRound size={17} /> {isPending ? "Saving…" : "Update password"}
        </Button>
      </form>
    </AuthShell>
  );
}
