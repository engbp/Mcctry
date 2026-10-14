import { MessageSquareText, Star, AlertTriangle } from "lucide-react";
import { requireAdminOrLeader } from "@/lib/admin/authorization";

export const dynamic = "force-dynamic";

type CourseFeedback = { id:string; course_id:string; lesson_id:string|null; kind:"review"|"complaint"; rating:number|null; message:string; created_at:string };
type SessionFeedback = { id:string; session_id:string; rating:number; message:string; created_at:string };

export default async function FeedbackInboxPage() {
  const { supabase, profile, assignedTrackIds } = await requireAdminOrLeader("/admin/feedback");
  const db = supabase as unknown as { from: (table: string) => any };
  const [{ data: courseFeedback, error: courseError }, { data: sessionFeedback, error: sessionError }, { data: courses }, { data: sessions }, { data: lessons }, { data: tracks }] = await Promise.all([
    db.from("course_feedback").select("id,course_id,lesson_id,kind,rating,message,created_at").order("created_at", { ascending: false }).limit(200),
    db.from("session_feedback").select("id,session_id,rating,message,created_at").order("created_at", { ascending: false }).limit(200),
    db.from("courses").select("id,title,track_id"),
    db.from("feedback_sessions").select("id,title,course_id,track_id"),
    db.from("lessons").select("id,title,course_id"),
    db.from("tracks").select("id,title"),
  ]);
  const trackFilter = profile.role === "admin" ? null : new Set(assignedTrackIds);
  const courseItems = (courses ?? []) as Array<{id:string;title:string;track_id:string}>;
  const sessionItems = ((sessions ?? []) as Array<{id:string;title:string;course_id:string;track_id:string}>).filter(s => !trackFilter || trackFilter.has(s.track_id));
  const permittedCourseIds = new Set(courseItems.filter(c => !trackFilter || trackFilter.has(c.track_id)).map(c => c.id));
  const courseItemsVisible = courseItems.filter(c => permittedCourseIds.has(c.id));
  const courseMap = new Map(courseItemsVisible.map(c => [c.id,c]));
  const sessionMap = new Map(sessionItems.map(s => [s.id,s]));
  const lessonMap = new Map(((lessons ?? []) as Array<{id:string;title:string;course_id:string}>).map(l => [l.id,l]));
  const trackMap = new Map(((tracks ?? []) as Array<{id:string;title:string}>).map(t => [t.id,t.title]));
  const courseItemsFeedback = ((courseFeedback ?? []) as CourseFeedback[]).filter(f => permittedCourseIds.has(f.course_id));
  const sessionItemsFeedback = ((sessionFeedback ?? []) as SessionFeedback[]).filter(f => sessionMap.has(f.session_id));
  const total = courseItemsFeedback.length + sessionItemsFeedback.length;
  return <div className="mcc-ops-page">
    <header className="mcc-ops-page-head"><div className="mcc-ops-title-icon"><MessageSquareText size={22}/></div><div><p className="mcc-ops-eyebrow">LISTEN AND IMPROVE</p><h1>Feedback inbox</h1><p>Anonymous course reviews, complaints, and offline-session feedback. No student account IDs are shown here.</p></div></header>
    {(courseError || sessionError) && <div className="mcc-ops-alert">Some feedback could not be loaded. Ensure the community feedback migration is installed.</div>}
    <div className="mcc-ops-summary-row"><div className="mcc-ops-summary"><span>Course / lesson feedback</span><strong>{courseItemsFeedback.length}</strong></div><div className="mcc-ops-summary"><span>Offline sessions</span><strong>{sessionItemsFeedback.length}</strong></div><div className="mcc-ops-summary"><span>Total responses</span><strong>{total}</strong></div></div>

    <section className="mcc-ops-card">
      <div className="mcc-ops-card-head"><h2><MessageSquareText size={18}/> Course and lesson feedback</h2><span className="mcc-ops-count">{courseItemsFeedback.length} responses</span></div>
      {courseItemsFeedback.length === 0 ? <p className="mcc-ops-empty">No course reviews or complaints have been submitted yet.</p> :
        <div className="mcc-ops-feedback-list">{courseItemsFeedback.map(item => {
          const course = courseMap.get(item.course_id);
          const lesson = item.lesson_id ? lessonMap.get(item.lesson_id) : null;
          return <article className="mcc-ops-feedback-item" key={item.id}>
            <div className="mcc-ops-feedback-item-top"><div className="mcc-ops-feedback-context"><span className={item.kind === "complaint" ? "mcc-ops-tag complaint" : "mcc-ops-tag active"}>{item.kind === "complaint" ? <><AlertTriangle size={12}/> Complaint</> : "Course review"}</span><strong>{course?.title ?? "Course"}{lesson ? " / " + lesson.title : ""}</strong></div><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString()}</time></div>
            {item.rating !== null && <div className="mcc-ops-feedback-rating" aria-label={item.rating + " out of 5"}>{Array.from({length:5},(_,i) => <Star key={i} size={14} fill={i < item.rating! ? "currentColor" : "none"} />)}<span>{item.rating}/5</span></div>}
            <p>{item.message}</p>
            <small>{course ? trackMap.get(course.track_id) : ""}</small>
          </article>;
        })}</div>}
    </section>

    <section className="mcc-ops-card">
      <div className="mcc-ops-card-head"><h2><Star size={18}/> Offline-session feedback</h2><span className="mcc-ops-count">{sessionItemsFeedback.length} responses</span></div>
      {sessionItemsFeedback.length === 0 ? <p className="mcc-ops-empty">No in-person session feedback yet.</p> :
        <div className="mcc-ops-feedback-list">{sessionItemsFeedback.map(item => {
          const session = sessionMap.get(item.session_id);
          const course = session ? courseMap.get(session.course_id) : null;
          return <article className="mcc-ops-feedback-item" key={item.id}>
            <div className="mcc-ops-feedback-item-top"><div className="mcc-ops-feedback-context"><span className="mcc-ops-tag active">Session feedback</span><strong>{session?.title ?? "Session"}{course ? " / " + course.title : ""}</strong></div><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString()}</time></div>
            <div className="mcc-ops-feedback-rating" aria-label={item.rating + " out of 5"}>{Array.from({length:5},(_,i) => <Star key={i} size={14} fill={i < item.rating ? "currentColor" : "none"} />)}<span>{item.rating}/5</span></div><p>{item.message}</p><small>{session ? trackMap.get(session.track_id) : ""}</small>
          </article>;
        })}</div>}
    </section>
    <p className="mcc-ops-footnote">Feedback content may contain personal information typed by a respondent; handle it discreetly. Session links that are closed or expired are not accepted by the database.</p>
  </div>;
}
