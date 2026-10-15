"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { CheckCircle2, Clock3, Copy, Download, QrCode, XCircle } from "lucide-react";
import { closeFeedbackSessionAction, createFeedbackSessionAction, type CreateSessionState } from "@/app/admin/sessions/actions";

type TrackOption = { id: string; title: string; published: boolean };
type CourseOption = { id: string; track_id: string; title: string; published: boolean };
type Session = { id: string; title: string; track_id: string; course_id: string; feedback_token: string; feedback_expires_at: string; feedback_closed_at: string | null; created_at: string };
const initialState: CreateSessionState = { status: "idle" };

export function SessionManager({ tracks, courses, sessions, isAdmin, publicOrigin }: { tracks: TrackOption[]; courses: CourseOption[]; sessions: Session[]; isAdmin: boolean; publicOrigin: string }) {
  const [state, formAction, pending] = useActionState(createFeedbackSessionAction, initialState);
  const [trackId, setTrackId] = useState(tracks[0]?.id ?? "");
  const [copied, setCopied] = useState(false);
  const filteredCourses = useMemo(() => courses.filter((course) => course.track_id === trackId), [courses, trackId]);
  const [courseId, setCourseId] = useState("");
  useEffect(() => {
    if (!filteredCourses.some((course) => course.id === courseId)) setCourseId(filteredCourses[0]?.id ?? "");
  }, [filteredCourses, courseId]);

  const url = state.session ? `${publicOrigin}/feedback/session/${state.session.token}` : "";

  async function copyUrl() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function downloadQr() {
    const svg = document.querySelector("#feedback-qr svg") as SVGSVGElement | null;
    if (!svg || !state.session) return;
    const source = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `mcc-feedback-${state.session.token}.svg`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(href), 1000);
  }

  return <div className="mcc-ops-session-layout">
    <section className="mcc-ops-card">
      <h2><QrCode size={19}/> Create a feedback QR</h2>
      <p className="mcc-ops-card-intro">Choose a course. The QR link is anonymous and closes automatically after its expiry.</p>
      <form action={formAction} className="mcc-ops-form">
        <label>Track<select name="track_id" required value={trackId} onChange={(event) => setTrackId(event.target.value)}><option value="">Choose a track…</option>{tracks.map((track) => <option key={track.id} value={track.id}>{track.title}</option>)}</select></label>
        <label>Course<select name="course_id" required value={courseId} onChange={(event) => setCourseId(event.target.value)}><option value="">Choose a course…</option>{filteredCourses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
        <label>Session name<input name="title" required minLength={2} maxLength={200} placeholder="e.g. Intro to AI workshop" /></label>
        <label>Link stays open<select name="duration_preset" defaultValue="60"><option value="60">1 hour</option><option value="240">4 hours</option><option value="1440">24 hours</option><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="custom">Custom…</option></select></label>
        <details className="mcc-ops-advanced"><summary>Custom duration settings</summary><label>Minutes (only for Custom)<input name="custom_minutes" type="number" min={1} max={10080} defaultValue={90} /></label><small>Maximum 7 days.</small></details>
        <button className="mcc-ops-primary" type="submit" disabled={pending || !tracks.length || !filteredCourses.length}>{pending ? "Creating QR…" : "Create QR"} <QrCode size={16}/></button>
      </form>
      {state.message && <p className={state.status === "success" ? "mcc-feedback-status success" : "mcc-feedback-status error"} role="status">{state.message}</p>}
      {state.session && <div className="mcc-ops-qr-result">
        <div className="mcc-ops-qr-card" id="feedback-qr"><QRCodeSVG value={url} size={232} level="H" includeMargin /></div>
        <div className="mcc-ops-qr-copy"><span className="mcc-ops-tag active">QR READY</span><h3>{state.session.title}</h3><p>Expires {new Date(state.session.expiresAt).toLocaleString()}</p><code>{url}</code><div className="mcc-ops-inline-actions"><button className="mcc-ops-primary" type="button" onClick={copyUrl}><Copy size={15}/>{copied ? "Copied" : "Copy link"}</button><button className="mcc-ops-secondary" type="button" onClick={downloadQr}><Download size={15}/>Download QR</button><button className="mcc-ops-secondary" type="button" onClick={() => window.print()}>Print QR</button><Link className="mcc-ops-secondary as-link" href={`/feedback/session/${state.session.token}`} target="_blank">Preview form</Link></div></div>
      </div>}
    </section>
    <section className="mcc-ops-card">
      <div className="mcc-ops-card-head"><h2><Clock3 size={19}/> Existing sessions</h2><span className="mcc-ops-count">{sessions.length}</span></div>
      {sessions.length === 0 ? <p className="mcc-ops-empty">No feedback sessions yet.</p> : <div className="mcc-ops-session-list">{sessions.map((session) => {
        const track = tracks.find((item) => item.id === session.track_id);
        const course = courses.find((item) => item.id === session.course_id);
        const expired = new Date(session.feedback_expires_at).getTime() <= Date.now();
        const closed = Boolean(session.feedback_closed_at);
        return <article className="mcc-ops-session" key={session.id}>
          <div className="mcc-ops-session-copy"><span className={closed ? "mcc-ops-tag muted" : expired ? "mcc-ops-tag expired" : "mcc-ops-tag active"}>{closed ? "Closed" : expired ? "Expired" : "Open"}</span><h3>{session.title}</h3><p>{track?.title ?? "Track"} / {course?.title ?? "Course"}</p><small>{closed ? "Closed " + new Date(session.feedback_closed_at!).toLocaleString() : "Expires " + new Date(session.feedback_expires_at).toLocaleString()}</small><Link href={`/feedback/session/${session.feedback_token}`} target="_blank" className="mcc-ops-session-url">Open public link ↗</Link></div>
          {!closed && !expired && <form action={closeFeedbackSessionAction}><input type="hidden" name="session_id" value={session.id}/><button className="mcc-ops-danger" type="submit" title="Close feedback now"><XCircle size={15}/> Close</button></form>}
          {(closed || expired) && <span className="mcc-ops-session-done"><CheckCircle2 size={16}/></span>}
        </article>;
      })}</div>}
    </section>
    <p className="mcc-ops-footnote">Submissions are anonymous. {isAdmin ? "You can manage sessions for every track." : "You can manage sessions only for tracks assigned to you."}</p>
  </div>;
}
