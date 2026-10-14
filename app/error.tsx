"use client";

import { ArrowRight } from "lucide-react";

// Friendly error boundary for pages. In production the error message is a
// generic identifier, so raw database/network details never reach visitors —
// only the digest is logged for operators.
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  console.error(error);

  return (
    <div className="section" role="alert">
      <div className="container">
        <div className="mcc-empty-public">
          <span className="mcc-section-label">SOMETHING WENT WRONG</span>
          <h2>This page couldn&apos;t load.</h2>
          <p>Please try again — the problem is usually temporary. If it continues, check MCC MNU&apos;s official channels for updates.</p>
          <button type="button" className="mcc-text-link" onClick={() => retry()}>
            Try again <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
