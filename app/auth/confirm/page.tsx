"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { AuthShell, AuthNotice } from "@/components/auth/AuthShell";

function ConfirmInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    const code = searchParams.get("code");
    const next = searchParams.get("next");
    const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

    async function run() {
      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({ type: type as never, token_hash: tokenHash });
        if (!error) {
          router.replace(safeNext);
          return;
        }
      } else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace(safeNext);
          return;
        }
      }
      // Fall through: show failure state (handled below via data-status).
      const el = document.getElementById("confirm-fail");
      if (el) el.hidden = false;
      const busy = document.getElementById("confirm-busy");
      if (busy) busy.hidden = true;
    }
    void run();
  }, [searchParams, router]);

  return (
    <AuthShell
      title="Confirming your email"
      lede="Verifying the confirmation link from your inbox…"
      footer={<p><Link href="/login">Back to sign in</Link></p>}
    >
      <p id="confirm-busy" className="auth-lede" role="status">
        One moment while we activate your account.
      </p>
      <div id="confirm-fail" hidden>
        <AuthNotice kind="error">
          This confirmation link is invalid or has expired. Sign in — if your
          account is still unconfirmed, request a new link from the password
          reset page or sign up again.
        </AuthNotice>
      </div>
    </AuthShell>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmInner />
    </Suspense>
  );
}
