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

const operations = [
  {
    number: "01",
    title: "People & roles",
    description: "Manage accounts and track-leader access.",
    href: "/admin/people",
    label: "ACCESS",
    Icon: Users,
  },
  {
    number: "02",
    title: "Feedback inbox",
    description: "Read anonymous course and session responses.",
    href: "/admin/feedback",
    label: "COMMUNITY",
    Icon: MessageSquareText,
  },
  {
    number: "03",
    title: "Session QR links",
    description: "Collect anonymous feedback after in-person sessions.",
    href: "/admin/sessions",
    label: "SESSIONS",
    Icon: QrCode,
  },
];

const contentLinks = [
  { href: "/admin/tracks", label: "Tracks" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/lessons", label: "Video lessons" },
  { href: "/admin/resources", label: "Resources" },
];

export default async function AdminOverviewPage() {
  const profile = await getCurrentProfile();

  if (profile?.role === "leader") redirect("/admin/leader");
  if (!profile || profile.role !== "admin") redirect("/dashboard?error=admin-required");

  const firstName = profile.display_name?.trim().split(/\s+/)[0];

  return (
    <div className="mcc-admin-home-v3">
      <header className="mcc-admin-intro-v3">
        <p className="mcc-admin-kicker-v3">MCC MNU <span>/</span> ADMIN WORKSPACE</p>
        <h1>{firstName ? "Welcome back, " + firstName + "." : "Manage the learning space."}</h1>
        <p>Update the material students see, manage access, and keep feedback in one place.</p>
      </header>

      <section className="mcc-admin-content-feature-v3" aria-labelledby="mcc-admin-content-title">
        <div className="mcc-admin-content-feature-copy-v3">
          <span className="mcc-admin-feature-label-v3"><Layers3 size={15} /> THE LEARNING CATALOGUE</span>
          <h2 id="mcc-admin-content-title">Everything students learn starts here.</h2>
          <p>Publish a track, organize its courses, add lesson videos, and attach useful resources.</p>
          <Link href="/admin/tracks" className="mcc-admin-feature-button-v3">
            Manage learning content <ArrowRight size={17} />
          </Link>
        </div>
        <div className="mcc-admin-content-links-v3" aria-label="Learning content shortcuts">
          {contentLinks.map((item, index) => (
            <Link href={item.href} key={item.href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.label}</strong>
              <ArrowUpRight size={17} />
            </Link>
          ))}
        </div>
        <div className="mcc-admin-content-decoration-v3" aria-hidden="true">
          <span className="mcc-admin-decoration-circle-v3" />
          <span className="mcc-admin-decoration-cross-v3">+</span>
          <span className="mcc-admin-decoration-word-v3">MCC<span>.</span></span>
        </div>
      </section>

      <section className="mcc-admin-operations-v3" aria-labelledby="mcc-admin-operations-title">
        <div className="mcc-admin-operations-heading-v3">
          <div>
            <p className="mcc-admin-kicker-v3">THE REST OF THE WORK</p>
            <h2 id="mcc-admin-operations-title">Keep things running.</h2>
          </div>
          <span>03 TASKS</span>
        </div>
        <div className="mcc-admin-operations-list-v3">
          {operations.map(({ number, title, description, href, label, Icon }) => (
            <Link href={href} className="mcc-admin-operation-v3" key={href}>
              <span className="mcc-admin-operation-number-v3">{number}</span>
              <span className="mcc-admin-operation-icon-v3"><Icon size={20} strokeWidth={1.7} /></span>
              <span className="mcc-admin-operation-copy-v3">
                <small>{label}</small>
                <strong>{title}</strong>
                <span>{description}</span>
              </span>
              <ArrowUpRight size={19} className="mcc-admin-operation-arrow-v3" />
            </Link>
          ))}
        </div>
      </section>

      <p className="mcc-admin-footnote-v3">
        <BookOpen size={17} />
        Only published learning content appears in the student catalogue. Permissions continue to be enforced on the server and by Supabase row-level security.
      </p>
    </div>
  );
}
