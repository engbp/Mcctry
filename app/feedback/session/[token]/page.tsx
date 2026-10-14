import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SessionFeedbackForm } from "@/components/feedback/SessionFeedbackForm";

export const dynamic = "force-dynamic";

export default async function SessionFeedbackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) notFound();
  const supabase = await createSupabaseServerClient();
  const db = supabase as unknown as { from: (table: string) => any };
  const { data: session } = await db.from("feedback_sessions")
    .select("id,track_id,course_id,title,feedback_token,feedback_expires_at,feedback_closed_at")
    .eq("feedback_token", token).is("feedback_closed_at", null).gt("feedback_expires_at", new Date().toISOString()).maybeSingle();
  if (!session) return <main className="mcc-session-expired"><div className="mcc-session-brand"><span className="mcc-session-monogram">M</span><strong>MCC MNU</strong></div><h1>This feedback link is no longer active.</h1><p>The organizer may have closed the form, or its time limit may have expired.</p><Link href="/">Return to MCC MNU</Link></main>;

  const [{ data: course }, { data: track }] = await Promise.all([
    db.from("courses").select("title").eq("id", session.course_id).maybeSingle(),
    db.from("tracks").select("title").eq("id", session.track_id).maybeSingle(),
  ]);
  return <SessionFeedbackForm sessionId={session.id} token={session.feedback_token} title={session.title}
    courseTitle={course?.title ?? "MCC session"} trackTitle={track?.title ?? "Learning track"} expiresAt={session.feedback_expires_at} />;
}
