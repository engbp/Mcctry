import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  await requireAdmin("/admin");
  const supabase = await createSupabaseServerClient();

  const [tracks, courses, lessons, resources, applications, profiles] = await Promise.all([
    supabase.from("tracks").select("id, title, published", { count: "exact" }),
    supabase.from("courses").select("id, title, published", { count: "exact" }),
    supabase.from("lessons").select("id, title, published", { count: "exact" }),
    supabase.from("resources").select("id, title, published", { count: "exact" }),
    supabase.from("applications").select("id, status, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(5),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  const pendingApps = (applications.data ?? []).filter((a) => a.status === "pending").length;
  const totalApps = applications.count ?? 0;

  const stats = [
    { label: "Tracks", value: tracks.count ?? 0, sub: `${(tracks.data ?? []).filter((t) => t.published).length} shown publicly`, href: "/admin/tracks" },
    { label: "Courses", value: courses.count ?? 0, sub: `${(courses.data ?? []).filter((c) => c.published).length} published`, href: "/admin/courses" },
    { label: "Lessons", value: lessons.count ?? 0, sub: `${(lessons.data ?? []).filter((l) => l.published).length} published`, href: "/admin/lessons" },
    { label: "Resources", value: resources.count ?? 0, sub: `${(resources.data ?? []).filter((r) => r.published).length} published`, href: "/admin/resources" },
    { label: "Applications", value: totalApps, sub: `${pendingApps} in the latest batch`, href: "/admin/applications" },
    { label: "Student accounts", value: profiles.count ?? 0, sub: "Profiles in the database", href: undefined },
  ];

  return (
    <>
      <header className="mcc-admin-page-head">
        <div>
          <span className="mcc-section-label">CONTROL ROOM</span>
          <h1>Overview</h1>
          <p>Live counts from the club database. Every number below is a real query.</p>
        </div>
      </header>

      <div className="mcc-admin-stat-grid">
        {stats.map((stat) => {
          const inner = (
            <>
              <span className="mcc-admin-stat-label">{stat.label}</span>
              <strong className="mcc-admin-stat-value">{stat.value}</strong>
              <small>{stat.sub}</small>
            </>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="mcc-admin-stat">
              {inner}
            </Link>
          ) : (
            <div key={stat.label} className="mcc-admin-stat">{inner}</div>
          );
        })}
      </div>

      <section className="mcc-admin-section" aria-labelledby="recent-apps">
        <div className="mcc-admin-section-bar">
          <h2 id="recent-apps">Recent applications</h2>
          <Link href="/admin/applications">Manage all →</Link>
        </div>
        {(applications.data ?? []).length === 0 ? (
          <p className="mcc-admin-empty">No applications yet. Submitted join forms appear here.</p>
        ) : (
          <table className="mcc-admin-table">
            <thead>
              <tr><th>Submitted</th><th>Status</th></tr>
            </thead>
            <tbody>
              {(applications.data ?? []).map((app) => (
                <tr key={app.id}>
                  <td>{new Date(app.created_at).toLocaleString()}</td>
                  <td><span className={`mcc-admin-badge mcc-admin-badge-${app.status}`}>{app.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
