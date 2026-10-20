"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  LayoutDashboard,
  Layers3,
  Link2,
  LogOut,
  MessageSquareText,
  QrCode,
  Users,
} from "lucide-react";
import { signOutAction } from "@/lib/auth-actions";

const adminGroups = [
  {
    label: "Workspace",
    links: [{ href: "/admin", label: "Overview", Icon: LayoutDashboard }],
  },
  {
    label: "Learning content",
    links: [
      { href: "/admin/tracks", label: "Tracks", Icon: Layers3 },
      { href: "/admin/courses", label: "Courses", Icon: BookOpen },
      { href: "/admin/lessons", label: "Lessons", Icon: BookOpen },
      { href: "/admin/resources", label: "Resources", Icon: Link2 },
    ],
  },
  {
    label: "Community",
    links: [
      { href: "/admin/sessions", label: "Session feedback QR", Icon: QrCode },
      { href: "/admin/feedback", label: "Feedback inbox", Icon: MessageSquareText },
    ],
  },
  {
    label: "Access",
    links: [{ href: "/admin/people", label: "People & roles", Icon: Users }],
  },
];

const leaderGroups = [
  {
    label: "Workspace",
    links: [
      { href: "/admin/leader", label: "Assigned tracks", Icon: Layers3 },
      { href: "/admin/leader/resources", label: "Track resources", Icon: Link2 },
    ],
  },
  {
    label: "Community",
    links: [
      { href: "/admin/sessions", label: "Session feedback QR", Icon: QrCode },
      { href: "/admin/feedback", label: "Feedback inbox", Icon: MessageSquareText },
    ],
  },
];

export function AdminNav({ role, displayName }: { role: string; displayName: string | null }) {
  const pathname = usePathname();
  const groups = role === "admin" ? adminGroups : leaderGroups;

  return (
    <aside className="mcc-admin-nav" aria-label="Workspace navigation">
      <Link href="/" className="mcc-admin-brand-link" aria-label="MCC MNU home">
        <span className="mcc-admin-brand-symbol"><Layers3 size={21} strokeWidth={1.8} /></span>
        <span className="mcc-admin-brand-copy">
          <strong>MCC <i>MNU</i></strong>
          <small>ADMIN WORKSPACE</small>
        </span>
      </Link>

      <nav className="mcc-admin-links" aria-label="Admin sections">
        {groups.map((group) => (
          <div className="mcc-admin-nav-group" key={group.label}>
            <p className="mcc-admin-nav-label">{group.label}</p>
            <div className="mcc-admin-nav-items">
              {group.links.map(({ href, label, Icon }) => {
                const exactRoute = href === "/admin" || href === "/admin/leader";
                const active = exactRoute ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={active ? "is-current" : undefined}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mcc-admin-nav-foot">
        <div className="mcc-admin-who">
          <span className="mcc-admin-user-avatar" aria-hidden="true">
            {(displayName || (role === "admin" ? "A" : "L")).slice(0, 1).toUpperCase()}
          </span>
          <span className="mcc-admin-user-copy">
            <strong>{displayName || (role === "admin" ? "Administrator" : "Track leader")}</strong>
            <small>{role === "admin" ? "Global administrator" : "Track leader"}</small>
          </span>
        </div>
        <Link href="/" className="mcc-admin-back">
          View learning site <ArrowUpRight size={15} />
        </Link>
        <form action={signOutAction}>
          <button type="submit" className="mcc-admin-signout">
            <LogOut size={15} /> Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
