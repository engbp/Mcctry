import { Users, ShieldCheck } from "lucide-react";
import { requireGlobalAdmin } from "@/lib/admin/authorization";
import { updateMemberRoleAction } from "./actions";

export const dynamic = "force-dynamic";

type Role = "admin" | "leader" | "member" | "student";
type Person = { id: string; email: string | null; display_name: string | null; role: Role; created_at: string };
type Track = { id: string; title: string; slug: string; published: boolean };

const roleLabels: Record<Role, string> = { admin: "Admin", leader: "Leader", member: "Member", student: "Student" };

export default async function PeopleAndRolesPage() {
  const { supabase, user } = await requireGlobalAdmin("/admin/people");
  const db = supabase as unknown as { from: (table: string) => any };
  const [{ data: people, error }, { data: tracks }, { data: assignments }] = await Promise.all([
    db.from("profiles").select("id,email,display_name,role,created_at").order("created_at", { ascending: false }),
    db.from("tracks").select("id,title,slug,published").order("position"),
    db.from("track_leaders").select("user_id,track_id"),
  ]);
  const members = (people ?? []) as Person[];
  const trackItems = (tracks ?? []) as Track[];
  const assignmentItems = (assignments ?? []) as Array<{ user_id: string; track_id: string }>;
  const names = new Map(trackItems.map((track) => [track.id, track.title]));
  const counts = (Object.keys(roleLabels) as Role[]).map((role) => ({ role, count: members.filter((person) => person.role === role).length }));

  return <div className="mcc-ops-page">
    <header className="mcc-ops-page-head"><div className="mcc-ops-title-icon"><Users size={22}/></div><div><p className="mcc-ops-eyebrow">PEOPLE</p><h1>People &amp; roles</h1><p>Find a person, open their settings, and save one change.</p></div></header>
    {error && <div className="mcc-ops-alert">People could not be loaded. Check Supabase access and migrations.</div>}
    <div className="mcc-ops-summary-row">{counts.map(({ role, count }) => <div className="mcc-ops-summary" key={role}><span>{roleLabels[role]}s</span><strong>{count}</strong></div>)}</div>
    <div className="mcc-ops-callout"><ShieldCheck size={18}/><p><strong>Admin safety is on.</strong> You cannot remove your own admin role or demote the last administrator.</p></div>
    <section className="mcc-ops-card">
      <div className="mcc-ops-card-head"><h2>Accounts</h2><span className="mcc-ops-count">{members.length} total</span></div>
      <div className="mcc-ops-member-list">
        {members.map((member) => {
          const assigned = assignmentItems.filter((entry) => entry.user_id === member.id);
          const name = member.display_name || member.email || "Unnamed account";
          return <details className="mcc-ops-member mcc-ops-person-details" key={member.id}>
            <summary className="mcc-ops-person-summary">
              <span className="mcc-ops-avatar">{name.slice(0, 1).toUpperCase()}</span>
              <span className="mcc-ops-person-text"><strong>{name}{member.id === user.id ? " · You" : ""}</strong><small>{member.email || member.id}</small></span>
              <span className="mcc-ops-tag muted">{roleLabels[member.role] ?? member.role}</span>
            </summary>
            <div className="mcc-ops-person-settings">
              {member.role === "leader" && <p className="mcc-ops-card-intro">Assigned tracks: {assigned.length ? assigned.map((entry) => names.get(entry.track_id) ?? "Unknown track").join(", ") : "None yet"}</p>}
              <form action={updateMemberRoleAction} className="mcc-ops-role-form">
                <input type="hidden" name="user_id" value={member.id}/>
                <label>Role<select name="role" defaultValue={member.role}><option value="admin">Admin</option><option value="leader">Leader</option><option value="member">Member</option><option value="student">Student</option></select></label>
                <label>Track assignment<select name="track_id" defaultValue={assigned[0]?.track_id ?? ""}><option value="">No track</option>{trackItems.map((track) => <option key={track.id} value={track.id}>{track.title}{!track.published ? " (draft)" : ""}</option>)}</select></label>
                <button className="mcc-ops-primary" type="submit">Save changes</button>
              </form>
              <small className="mcc-ops-footnote">Track assignment is used for leaders. Other roles have no leader-track assignment.</small>
            </div>
          </details>;
        })}
        {members.length === 0 && <p className="mcc-ops-empty">No accounts found.</p>}
      </div>
    </section>
    <p className="mcc-ops-footnote">Only global admins can change roles. Access is enforced on the server and in Supabase.</p>
  </div>;
}
