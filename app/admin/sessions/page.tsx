import { requireAdminOrLeader } from "@/lib/admin/authorization";
import { SessionManager } from "@/components/admin/SessionManager";

export const dynamic = "force-dynamic";

export default async function SessionFeedbackAdminPage() {
  const { supabase, profile, assignedTrackIds } = await requireAdminOrLeader("/admin/sessions");
  const db = supabase as unknown as { from: (table: string) => any };
  const [trackResult, courseResult, sessionResult] = await Promise.all([
    db.from("tracks").select("id,title,published,position").order("position"),
    db.from("courses").select("id,track_id,title,published,position").order("position"),
    db.from("feedback_sessions").select("id,title,track_id,course_id,feedback_token,feedback_expires_at,feedback_closed_at,created_at").order("created_at", { ascending: false }).limit(50),
  ]);
  const allowedIds = profile.role === "admin" ? null : new Set(assignedTrackIds);
  const tracks = ((trackResult.data ?? []) as Array<{id:string;title:string;published:boolean;position:number}>)
    .filter((track) => !allowedIds || allowedIds.has(track.id));
  const trackIdSet = new Set(tracks.map((track) => track.id));
  const courses = ((courseResult.data ?? []) as Array<{id:string;track_id:string;title:string;published:boolean;position:number}>)
    .filter((course) => trackIdSet.has(course.track_id));
  const sessions = ((sessionResult.data ?? []) as Array<{id:string;title:string;track_id:string;course_id:string;feedback_token:string;feedback_expires_at:string;feedback_closed_at:string|null;created_at:string}>)
    .filter((session) => trackIdSet.has(session.track_id));
  const error = trackResult.error || courseResult.error || sessionResult.error;
  return <div className="mcc-ops-page">
    <header className="mcc-ops-page-head"><div className="mcc-ops-title-icon"><span aria-hidden="true">QR</span></div><div><p className="mcc-ops-eyebrow">IN-PERSON LEARNING</p><h1>Session QR feedback</h1><p>Create a QR code for an offline session, choose its expiry, and close the form whenever you need to.</p></div></header>
    {error && <div className="mcc-ops-alert">Session feedback storage is not available yet. Confirm that the new Supabase migration has been applied to the intended test environment.</div>}
    <SessionManager tracks={tracks} courses={courses} sessions={sessions} isAdmin={profile.role === "admin"} />
  </div>;
}
