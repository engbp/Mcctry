import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, Layers3, MessageSquareText, QrCode, Users } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const quickLinks = [
  { href: "/admin/people", label: "Manage people & roles", detail: "Promote admins and assign track leaders", Icon: Users },
  { href: "/admin/sessions", label: "Create session QR", detail: "Collect anonymous feedback at offline sessions", Icon: QrCode },
  { href: "/admin/feedback", label: "Read feedback", detail: "Review anonymous course and session responses", Icon: MessageSquareText },
  { href: "/admin/leader", label: "Manage learning tracks", detail: "Edit tracks, courses and video lessons", Icon: Layers3 },
];

export default async function AdminOverviewPage() {
  const profile = await getCurrentProfile();
  if (profile?.role === "leader") redirect("/admin/leader");
  if (!profile || profile.role !== "admin") redirect("/dashboard?error=admin-required");
  const supabase = await createSupabaseServerClient();
  const [{ count: tracks }, { count: courses }, { count: lessons }, { count: apps }, { count: users }, { data: latest }] = await Promise.all([
    supabase.from("tracks").select("id", { count: "exact", head: true }),
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("lessons").select("id", { count: "exact", head: true }),
    supabase.from("applications").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("applications").select("id,name,status,created_at").order("created_at", { ascending: false }).limit(5),
  ]);
  const stats = [
    { label: "Tracks", value: tracks ?? 0 },
    { label: "Courses", value: courses ?? 0 },
    { label: "Video lessons", value: lessons ?? 0 },
    { label: "Applications", value: apps ?? 0 },
    { label: "Accounts", value: users ?? 0 },
  ];
  return <div className="mcc-ops-page mcc-admin-home">
    <header className="mcc-ops-page-head"><div className="mcc-ops-title-icon"><Layers3 size={22}/></div><div><p className="mcc-ops-eyebrow">MCC MNU / ADMINISTRATION</p><h1>What needs doing?</h1><p>A workspace for managing learning content, track assignments, and community feedback.</p></div></header>
    <div className="mcc-ops-summary-row mcc-ops-admin-stats">{stats.map(stat=><div className="mcc-ops-summary" key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div>
    <section className="mcc-ops-card"><div className="mcc-ops-card-head"><h2>Quick actions</h2><span className="mcc-ops-count">ADMIN TOOLKIT</span></div><div className="mcc-ops-admin-shortcuts">{quickLinks.map(({href,label,detail,Icon})=><Link href={href} key={href} className="mcc-ops-admin-shortcut"><span className="mcc-ops-admin-shortcut-icon"><Icon size={18}/></span><span><strong>{label}</strong><small>{detail}</small></span><ArrowRight size={17}/></Link>)}</div></section>
    <section className="mcc-ops-card"><div className="mcc-ops-card-head"><h2>Recent applications</h2><Link className="mcc-ops-text-link" href="/admin/applications">View all <ArrowRight size={15}/></Link></div>{(latest ?? []).length===0?<p className="mcc-ops-empty">No applications have been submitted yet.</p>:<div className="mcc-ops-recent-apps">{(latest ?? []).map(app=><div key={app.id}><span className="mcc-ops-admin-app-avatar">{(app.name||"?").slice(0,1).toUpperCase()}</span><span className="mcc-ops-recent-app-name"><strong>{app.name}</strong><small>{new Date(app.created_at).toLocaleString()}</small></span><span className={"mcc-ops-tag "+(app.status==="accepted"?"active":"")}>{app.status}</span></div>)}</div>}</section>
    <p className="mcc-ops-footnote"><BookOpen size={14}/> Manage real database content only. Changes to roles, track assignments and session feedback are restricted on the server and in Supabase row-level security.</p>
  </div>;
}
