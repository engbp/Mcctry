import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

interface AuthShellProps {
  title: string;
  lede: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, lede, children, footer }: AuthShellProps) {
  return (
    <section className="section auth-section" aria-labelledby="auth-title">
      <div className="container auth-container">
        <Link href="/" className="auth-back">
          <ArrowLeft size={15} /> Back to home
        </Link>
        <div className="auth-card">
          <span className="hp-section-kicker">MCC MNU ACCOUNT</span>
          <h1 id="auth-title" className="auth-title">{title}</h1>
          <p className="auth-lede">{lede}</p>
          {children}
        </div>
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </section>
  );
}

export function AuthFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="auth-field-error" role="alert">
      {message}
    </p>
  );
}

export function AuthNotice({
  kind,
  children,
}: {
  kind: "error" | "success" | "info";
  children: ReactNode;
}) {
  return (
    <div className={`notice auth-notice auth-notice-${kind}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
