"use client";

import { useActionState } from "react";
import { MessageSquareText, ShieldCheck, Send } from "lucide-react";
import { submitCourseFeedback, type FeedbackState } from "@/app/feedback/actions";

export function FeedbackForm({ courseId, courseTitle, lessonId }: { courseId: string; courseTitle: string; lessonId?: string }) {
  const [state, formAction, pending] = useActionState<FeedbackState, FormData>(submitCourseFeedback, { status: "idle" });
  return <section className="mcc-feedback-panel" aria-labelledby="mcc-course-feedback-title">
    <div className="mcc-feedback-heading"><span className="mcc-feedback-icon"><MessageSquareText size={20} /></span><div><p className="mcc-v2-overline">HELP US IMPROVE</p><h2 id="mcc-course-feedback-title">Feedback on {lessonId ? "this lesson" : "this course"}</h2></div></div>
    <p className="mcc-feedback-description">Reviews and complaints are anonymous. You do not need to sign in, and we do not attach your account ID to the submission.</p>
    <form action={formAction} className="mcc-feedback-form">
      <input type="hidden" name="course_id" value={courseId} />
      {lessonId && <input type="hidden" name="lesson_id" value={lessonId} />}
      <div className="mcc-feedback-fields">
        <label>Type of feedback<select name="kind" defaultValue="review"><option value="review">Course / lesson review</option><option value="complaint">Report a problem or complaint</option></select></label>
        <label>Rating <span>(required for reviews)</span><select name="rating" defaultValue=""><option value="">No rating</option><option value="5">5 — Excellent</option><option value="4">4 — Good</option><option value="3">3 — Okay</option><option value="2">2 — Poor</option><option value="1">1 — Very poor</option></select></label>
      </div>
      <label>Your feedback<textarea name="message" minLength={3} maxLength={4000} rows={4} required placeholder={`What should we keep, improve, or fix in ${lessonId ? "this lesson" : courseTitle}?`} /></label>
      {state.message && <p className={state.status === "success" ? "mcc-feedback-status success" : "mcc-feedback-status error"} role="status">{state.message}</p>}
      <div className="mcc-feedback-submit-row"><span><ShieldCheck size={15} /> Anonymous submission</span><button type="submit" disabled={pending}>{pending ? "Sending…" : "Send feedback"} <Send size={15} /></button></div>
    </form>
  </section>;
}
