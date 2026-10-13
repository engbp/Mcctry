"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import type { AdminActionResult } from "@/app/admin/actions";

interface ActionFormProps {
  action: (prev: AdminActionResult, formData: FormData) => Promise<AdminActionResult>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
  confirmMessage?: string;
}

export function ActionForm({ action, children, submitLabel, className, confirmMessage }: ActionFormProps) {
  const [state, formAction, isPending] = useActionState<AdminActionResult, FormData>(action, { ok: true });

  return (
    <form
      action={formAction}
      className={className}
      onSubmit={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {children}
      <Button variant="primary" type="submit" disabled={isPending}>
        {isPending ? "Working…" : submitLabel}
      </Button>
      {state.ok === false && state.message && (
        <p className="auth-field-error" role="alert">{state.message}</p>
      )}
    </form>
  );
}
