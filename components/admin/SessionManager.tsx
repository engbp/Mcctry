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
    const svg = document.querySelector(".mcc-ops-qr-card svg") as SVGSVGElement | null;
    if (!svg || !state.session) return;
    const source = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `mcc-feedback-${state.session.token}.svg`;
    anchor.click();
    URL.revokeObjectURL(href);
  }

  return <div className="mcc-ops-session-layout">
    <section className="mcc-ops-card">
      <h2><QrCode size={19}/> Generate session QR</h2>
      <p className="mcc-ops-card-intro">Choose the learning track, course, session title, and how long the anonymous feedback link stays open. You can close it at any time.</p>
      <form action={formAction} className="mcc-ops-form">
        <label>Track<select name="track_id" required value={trackId} onChange={(event) => setTrackId(event.target.value)}><option value="">Choose a track…</option>{tracks.map((track) => <option key={track.id} value={track.id}>{track.title}{!track.published ? " (draft)" : ""}</option>)}</select></label>
        <label>Course<select name="course_id" required value={courseId} onChange={(event) => setCourseId(event.target.value)}><option value="">Choose a course…</option>{filteredCourses.map((course) => <option key={course.id} value={course.id}>{course.title}{!course.published ? " (draft)" : ""}</option>)}</select></label>
        <label>Session title<input name="title" required minLength={2} maxLength={200} placeholder="e.g. Intro to AI — in-person workshop" /></label>
        <label>Feedback duration<select name="duration_preset" defaultValue="60"><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">1 hour</option><option value="240">4 hours</option><option value="1440">24 hours</option><option value="custom">Custom duration</option></select></label>
        <label>Custom duration in minutes <span>(only used for Custom; max 10,080 minutes / 7 days)</span><input name="custom_minutes" type="number" min={1} max={10080} defaultValue={90} /></label>
        <button className="mcc-ops-primary" type="submit" disabled={pending || !tracks.length || !filteredCourses.length}>{pending ? "Creating…" : "Create QR feedback session"} <QrCode size={16}/></button>
      </form>
      {state.message && <p className={state.status === "success" ? "mcc-feedback-status success" : "mcc-feedback-status error"} role="status">{state.message}</p>}
      {state.session && <div className="mcc-ops-qr-result">
        <div className="mcc-ops-qr-card" id="feedback-qr"><QRCodeSVG value={url} size={232} level="H" includeMargin /></div>
        <div className="mcc-ops-qr-copy"><span className="mcc-ops-tag active">QR READY</span><h3>{state.session.title}</h3><p>Expires {new Date(state.session.expiresAt).toLocaleString()}</p><code>{url}</code><div className="mcc-ops-inline-actions"><button className="mcc-ops-primary" type="button" onClick={copyUrl}><Copy size={15}/>{copied ? "Copied" : "Copy link"}</button><button className="mcc-ops-secondary" type="button" onClick={downloadQr}><Download size={15}/>Download QR</button><button className="mcc-ops-secondary" type="button" onClick={() => window.print()}>Print QR</button><Link className="mcc-ops-secondary as-link" href={`/feedback/session/${state.session.token}`} target="_blank">Preview form</Link></div></div>
      </div>}
    </section>
    <section className="mcc-ops-card">
      <div className="mcc-ops-card-head"><h2><Clock3 size={19}/> Session links</h2><span className="mcc-ops-count">{sessions.length} sessions</span></div>
      {sessions.length === 0 ? <p className="mcc-ops-empty">No session feedback links yet.</p> : <div className="mcc-ops-session-list">{sessions.map((session) => {
        const track = tracks.find((item) => item.id === session.track_id);
        const course = courses.find((item) => item.id === session.course_id);
        const expired = new Date(session.feedback_expires_at).getTime() <= Date.now();
        const closed = Boolean(session.feedback_closed_at);
        return <article className="mcc-ops-session" key={session.id}>
          <div className="mcc-ops-session-copy"><span className={closed ? "mcc-ops-tag muted" : expired ? "mcc-ops-tag expired" : "mcc-ops-tag active"}>{closed ? "Closed early" : expired ? "Expired" : "Accepting feedback"}</span><h3>{session.title}</h3><p>{track?.title ?? "Track"} / {course?.title ?? "Course"}</p><small>{closed ? "Closed " + new Date(session.feedback_closed_at!).toLocaleString() : "Expires " + new Date(session.feedback_expires_at).toLocaleString()}</small><Link href={`/feedback/session/${session.feedback_token}`} target="_blank" className="mcc-ops-session-url">Open public link ↗</Link></div>
          {!closed && !expired && <form action={closeFeedbackSessionAction}><input type="hidden" name="session_id" value={session.id}/><button className="mcc-ops-danger" type="submit" title="Close feedback now"><XCircle size={15}/> Close now</button></form>}
          {(closed || expired) && <span className="mcc-ops-session-done"><CheckCircle2 size={16}/></span>}
        </article>;
      })}</div>}
    </section>
    <p className="mcc-ops-footnote">Expired/closed QR codes stop accepting submissions on the database policy too. People can submit without an account, and their account IDs are not stored with responses. {isAdmin ? "Only global admins can create or close forms for any track; track leaders are limited to assigned tracks." : "Your access is limited to tracks assigned to your account."}</p>
  </div>;
}
