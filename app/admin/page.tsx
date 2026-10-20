import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Layers3,
  MessageSquareText,
  QrCode,
  Users,
} from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

const actions = [
  {
    label: "LEARNING",
    title: "Learning content",
    description: "Organize tracks, courses, video lessons, and supporting resources.",
    href: "/admin/tracks",
    action: "Manage content",
    Icon: Layers3,
  },
  {
    label: "ACCESS",
    title: "People & roles",
    description: "Manage accounts, access levels, and track-leader assignments.",
    href: "/admin/people",
    action: "Manage people",
    Icon: Users,
  },
  {
    label: "FEEDBACK",
    title: "Feedback inbox",
    description: "Read anonymous course reviews, complaints, and session responses.",
    href: "/admin/feedback",
    action: "Read feedback",
    Icon: MessageSquareText,
  },
  {
    label: "SESSIONS",
    title: "Session QR links",
    description: "Create a QR link to collect anonymous feedback after an in-person session.",
    href: "/admin/sessions",
    action: "Manage sessions",
    Icon: QrCode,
  },
];

export default async function AdminOverviewPage() {
  const profile = await getCurrentProfile();
  if (profile?.role === "leader") redirect("/admin/leader");
  if (!profile || profile.role !== "admin") redirect("/dashboard?error=admin-required");

  return (
    <div className="mcc-ops-page mcc-admin-home mcc-workspace-overview">
      <header className="mcc-ops-page-head">
        <div className="mcc-ops-title-icon"><Layers3 size={22} strokeWidth={1.8} /></div>
        <div>
          <p className="mcc-ops-eyebrow">MCC MNU / WORKSPACE</p>
          <h1>Admin workspace</h1>
          <p>Keep learning content organized and make the next step easy for students.</p>
        </div>
      </header>

      <section className="mcc-workspace-welcome" aria-label="Workspace guidance">
        <div>
          <span className="mcc-workspace-welcome-label"><SparklesIcon /> A CLEAR PLACE TO START</span>
          <h2>{profile.display_name?.trim() ? `Welcome back, ${profile.display_name.trim().split(/\\s+/)[0]}.` : "What needs your attention?"}</h2>
          <p>Choose a task below. The tools are grouped around the work you need to do.</p>
        </div>
        <Link href="/courses" className="mcc-workspace-public-link">
          Preview learning site <ArrowUpRight size={16} />
        </Link>
      </section>

      <div className="mcc-workspace-action-grid">
        {actions.map(({ label, title, description, href, action, Icon }, index) => (
          <Link href={href} className="mcc-workspace-action" key={href}>
            <span className="mcc-workspace-action-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="mcc-workspace-action-icon"><Icon size={20} strokeWidth={1.8} /></span>
            <span className="mcc-workspace-action-copy">
              <small>{label}</small>
              <strong>{title}</strong>
              <span>{description}</span>
              <em>{action} <ArrowRight size={15} /></em>
            </span>
            <ArrowUpRight className="mcc-workspace-action-arrow" size={17} aria-hidden="true" />
          </Link>
        ))}
      </div>

      <div className="mcc-workspace-note">
        <BookOpen size={19} strokeWidth={1.8} aria-hidden="true" />
        <p>
          Only published learning content appears in the student-facing catalogue.
          Account roles and feedback permissions continue to be enforced by the
          server and Supabase row-level security.
        </p>
      </div>
    </div>
  );
}

function SparklesIcon() {
  return <span className="mcc-workspace-welcome-mark" aria-hidden="true">✳</span>;
}
