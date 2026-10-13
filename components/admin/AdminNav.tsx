"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardCheck, Network, BookOpen, ListChecks, Link2, LogOut } from "lucide-react";
import { signOutAction } from "@/lib/auth-actions";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: ClipboardCheck },
  { href: "/admin/tracks", label: "Tracks", icon: Network },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/lessons", label: "Lessons", icon: ListChecks },
  { href: "/admin/resources", label: "Resources", icon: Link2 },
];

export function AdminNav({ role, displayName }: { role: string; displayName: string | null }) {
  const pathname = usePathname();
  return (
    <aside className="mcc-admin-nav" aria-label="Admin navigation">
      <Link href="/admin" className="mcc-admin-brand-link">
        MCC <span>MNU</span> <small>ADMIN</small>
      </Link>
      <nav className="mcc-admin-links">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={active ? "is-current" : undefined} aria-current={active ? "page" : undefined}>
              <Icon size={17} /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="mcc-admin-nav-foot">
        <span className="mcc-admin-who">
          <strong>{displayName ?? "Admin"}</strong>
          <small>{role}</small>
        </span>
        <form action={signOutAction}>
          <button type="submit" className="mcc-admin-signout">
            <LogOut size={15} /> Sign out
          </button>
        </form>
        <Link href="/dashboard" className="mcc-admin-back">← Student dashboard</Link>
      </div>
    </aside>
  );
}
