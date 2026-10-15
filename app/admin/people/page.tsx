import { Users, ShieldCheck } from "lucide-react";
import { requireGlobalAdmin } from "@/lib/admin/authorization";
import { updateMemberRoleAction } from "./actions";

export const dynamic = "force-dynamic";

type Role = "admin" | "leader" | "member" | "student";

export default async function PeopleAndRolesPage() {
  const { supabase, user } = await requireGlobalAdmin("/admin/people");
  const db = supabase as unknown as { from: (table: string) => any };
  const [{ data: people, error }, { data: tracks }, { data: assignments }] = await Promise.all([
    db.from("profiles").select("id,email,display_name,role,created_at").order("created_at", { ascending: false }),
    db.from("tracks").select("id,title,slug,published").order("position"),
    db.from("track_leaders").select("user_id,track_id"),
  ]);
  const members = (people ?? []) as Array<{ id: string; email: string | null; display_name: string | null; role: Role; created_at: string }>;
  const trackItems = (tracks ?? []) as Array<{ id: string; title: string; slug: string; published: boolean }>;
  const assignmentItems = (assignments ?? []) as Array<{ user_id: string; track_id: string }>;
  const names = new Map(trackItems.map((track) => [track.id, track.title]));

  return <div className="mcc-ops-page">
    <header className="mcc-ops-page-head"><div className="mcc-ops-title-icon"><Users size={22}/></div><div><p className="mcc-ops-eyebrow">ACCESS CONTROL</p><h1>People &amp; roles</h1><p>Manage the four-level MCC access hierarchy: Admin → Leader → Member → Student.</p></div></header>
    {error && <div className="mcc-ops-alert">The profiles list could not be loaded. Apply the latest Supabase migrations and check the admin database permissions.</div>}
    <div className="mcc-ops-callout"><ShieldCheck size={18}/><p><strong>Protect your last administrator.</strong> You cannot remove your own admin role here, and the last remaining global admin cannot be demoted.</p></div>
    <section className="mcc-ops-card">
      <div className="mcc-ops-card-head"><h2>Registered accounts</h2><span className="mcc-ops-count">{members.length} users</span></div>
      <div className="mcc-ops-member-list">
        {members.map((member) => {
          const assigned = assignmentItems.filter((entry) => entry.user_id === member.id);
          return <article className="mcc-ops-member" key={member.id}>
            <div className="mcc-ops-member-identity"><span className="mcc-ops-avatar">{(member.display_name || member.email || "?").slice(0,1).toUpperCase()}</span><div><strong>{member.display_name || "Unnamed account"}</strong><small>{member.email || member.id}{member.id === user.id ? " · You" : ""}</small><div className="mcc-ops-assigned-tags">{member.role === "leader" ? (assigned.length ? assigned.map((entry) => <span key={entry.track_id}>{names.get(entry.track_id) ?? "Unknown track"}</span>) : <span>Leader has no assigned track</span>) : null}</div></div></div>
            <form action={updateMemberRoleAction} className="mcc-ops-role-form">
              <input type="hidden" name="user_id" value={member.id}/>
              <label>Role<select name="role" defaultValue={member.role}><option value="admin">Admin</option><option value="leader">Leader</option><option value="member">Member</option><option value="student">Student</option></select></label>
              <label>Track to assign<select name="track_id" defaultValue={assigned[0]?.track_id ?? ""}><option value="">No track assignment</option>{trackItems.map((track) => <option key={track.id} value={track.id}>{track.title}{!track.published ? " (draft)" : ""}</option>)}</select></label>
              <button className="mcc-ops-primary" type="submit">Save</button>
            </form>
          </article>;
        })}
        {members.length === 0 && <p className="mcc-ops-empty">No profile rows are visible yet.</p>}
      </div>
    </section>
    <p className="mcc-ops-footnote">A leader can be assigned to tracks; changing a leader to Admin, Member, or Student removes their track-leader assignments. Role checks are enforced server-side and by Supabase RLS.</p>
  </div>;
}
