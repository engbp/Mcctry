"use client";

import { useActionState } from "react";
import { Send, ShieldCheck, MessageSquareText } from "lucide-react";
import { submitSessionFeedback, type FeedbackState } from "@/app/feedback/actions";

export function SessionFeedbackForm({ sessionId, token, title, courseTitle, trackTitle, expiresAt }: {
  sessionId: string; token: string; title: string; courseTitle: string; trackTitle: string; expiresAt: string;
}) {
  const [state, formAction, pending] = useActionState<FeedbackState, FormData>(submitSessionFeedback, { status: "idle" });
  return <main className="mcc-session-feedback">
    <div className="mcc-session-brand"><span className="mcc-session-monogram">M</span><span><strong>MCC MNU</strong><small>MICROSOFT CAMPUS CLUB</small></span></div>
    <div className="mcc-session-feedback-card">
      <div className="mcc-feedback-icon large"><MessageSquareText size={24} /></div>
      <p className="mcc-v2-overline">SESSION FEEDBACK</p>
      <h1>{title}</h1><p className="mcc-session-context">{trackTitle} <span>/</span> {courseTitle}</p>
      <p className="mcc-session-expiry">Feedback closes {new Date(expiresAt).toLocaleString()}</p>
      <p className="mcc-session-intro">Your feedback helps the club improve future sessions. This form is anonymous and does not ask you to sign in.</p>
      <form action={formAction} className="mcc-feedback-form">
        <input type="hidden" name="session_id" value={sessionId} /><input type="hidden" name="feedback_token" value={token} />
        <fieldset className="mcc-rating-field"><legend>How was this session?</legend><div className="mcc-rating-choices">{[1,2,3,4,5].map((n) => <label key={n}><input type="radio" name="rating" value={n} required /><span>{n}</span></label>)}</div><div className="mcc-rating-ends"><span>Needs work</span><span>Excellent</span></div></fieldset>
        <label>What could we improve or keep doing?<textarea name="message" rows={5} minLength={3} maxLength={2000} required placeholder="Share an idea, concern, or something that worked well…" /></label>
        {state.message && <p className={state.status === "success" ? "mcc-feedback-status success" : "mcc-feedback-status error"} role="status">{state.message}</p>}
        <button className="mcc-session-submit" type="submit" disabled={pending}>{pending ? "Sending…" : "Send anonymous feedback"} <Send size={16} /></button>
      </form>
      <p className="mcc-session-privacy"><ShieldCheck size={14} /> We save your rating and message only — not your account ID.</p>
    </div>
    <footer className="mcc-session-footer">MCC MNU · Learn · Build · Grow</footer>
  </main>;
}
