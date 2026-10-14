import Link from "next/link";
import { BookOpen, ArrowUpRight, Network, Video, MessageSquareText, QrCode, Save, Plus } from "lucide-react";
import { requireAdminOrLeader } from "@/lib/admin/authorization";
import { saveAssignedCourseAction, saveAssignedLessonAction, saveAssignedTrackAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function TrackLeaderWorkspace() {
  const { user, profile, supabase, assignedTrackIds } = await requireAdminOrLeader("/admin/leader");
  const db = supabase as unknown as { from: (table: string) => any };
  const [{ data: tracks }, { data: courses }, { data: lessons }] = await Promise.all([
    db.from("tracks").select("id,title,slug,description,published,position").order("position"),
    db.from("courses").select("id,title,slug,description,track_id,published,position").order("position"),
    db.from("lessons").select("id,title,slug,course_id,video_url,published,position").order("position"),
  ]);
  const assigned = new Set(profile.role === "admin" ? ((tracks ?? []) as Array<{id:string}>).map(t=>t.id) : assignedTrackIds);
  const trackItems = ((tracks ?? []) as Array<{id:string;title:string;slug:string;description:string|null;published:boolean;position:number}>).filter(t=>assigned.has(t.id));
  const courseItems = ((courses ?? []) as Array<{id:string;title:string;slug:string;description:string|null;track_id:string;published:boolean;position:number}>).filter(c=>assigned.has(c.track_id));
  const courseIds = new Set(courseItems.map(c=>c.id));
  const lessonItems = ((lessons ?? []) as Array<{id:string;title:string;slug:string;course_id:string;video_url:string|null;published:boolean;position:number}>).filter(l=>courseIds.has(l.course_id));

  return <div className="mcc-ops-page">
    <header className="mcc-ops-page-head"><div className="mcc-ops-title-icon"><Network size={22}/></div><div><p className="mcc-ops-eyebrow">TRACK LEADER WORKSPACE</p><h1>{profile.role === "admin" ? "Track management" : "Your assigned tracks"}</h1><p>{profile.role === "admin" ? "Edit learning structure and manage published content." : "This workspace allows edits only to your assigned tracks. Supabase row-level security independently enforces those boundaries."}</p></div></header>
    <div className="mcc-ops-quick-actions"><Link href="/admin/sessions"><QrCode size={18}/><span><strong>Session QR feedback</strong><small>Create or close offline feedback forms</small></span><ArrowUpRight size={17}/></Link><Link href="/admin/feedback"><MessageSquareText size={18}/><span><strong>Feedback inbox</strong><small>Read anonymous reviews for your tracks</small></span><ArrowUpRight size={17}/></Link></div>
    {trackItems.length === 0 ? <section className="mcc-ops-card"><p className="mcc-ops-empty">No tracks are assigned to your account. Ask a global administrator to assign a track in People &amp; roles.</p></section> : trackItems.map(track => {
      const trackCourses=courseItems.filter(c=>c.track_id===track.id);
      return <section className="mcc-ops-card mcc-ops-leader-track" key={track.id}>
        <div className="mcc-ops-leader-track-head"><div><span className={track.published?"mcc-ops-tag active":"mcc-ops-tag muted"}>{track.published?"Published":"Draft"}</span><h2>{track.title}</h2><p>{track.description || "No track description."}</p></div><Link href={`/tracks/${track.slug}`} target="_blank" className="mcc-ops-secondary as-link">View public track ↗</Link></div>
        <details className="mcc-ops-editor"><summary>Edit track details</summary><form action={saveAssignedTrackAction} className="mcc-ops-form"><input type="hidden" name="track_id" value={track.id}/><label>Track title<input name="title" defaultValue={track.title} required maxLength={160}/></label><label>Description<textarea name="description" defaultValue={track.description ?? ""} rows={3} maxLength={2000}/></label><button type="submit" className="mcc-ops-primary"><Save size={15}/> Save track details</button></form></details>
        <div className="mcc-ops-card-head mcc-ops-course-heading"><h3><BookOpen size={17}/> Courses</h3><span className="mcc-ops-count">{trackCourses.length}</span></div>
        {trackCourses.length===0&&<p className="mcc-ops-empty">No courses currently belong to this track. Use the form below to create one.</p>}
        <div className="mcc-ops-leader-courses">{trackCourses.map(course=><article key={course.id} className="mcc-ops-leader-course">
          <div className="mcc-ops-leader-course-head"><BookOpen size={18}/><div><strong>{course.title}</strong><small>{lessonItems.filter(l=>l.course_id===course.id).length} lessons · /{course.slug}</small></div><span className={course.published?"mcc-ops-tag active":"mcc-ops-tag muted"}>{course.published?"Published":"Draft"}</span></div>
          <details className="mcc-ops-editor"><summary>Edit course</summary><form action={saveAssignedCourseAction} className="mcc-ops-form"><input type="hidden" name="course_id" value={course.id}/><input type="hidden" name="track_id" value={track.id}/><label>Course title<input name="title" defaultValue={course.title} required maxLength={160}/></label><label>URL slug<input name="slug" defaultValue={course.slug} pattern="[a-z0-9]+(-[a-z0-9]+)*" required/></label><label>Description<textarea name="description" defaultValue={course.description ?? ""} rows={3} maxLength={3000}/></label><label className="mcc-ops-checkbox"><input name="published" type="checkbox" defaultChecked={course.published}/> Published</label><button type="submit" className="mcc-ops-primary"><Save size={15}/> Save course</button></form></details>
          <div className="mcc-ops-leader-lessons">{lessonItems.filter(l=>l.course_id===course.id).map(lesson=><details key={lesson.id} className="mcc-ops-lesson-editor"><summary><Video size={14}/><span>{lesson.title}</span><small>{lesson.published?"Published":"Draft"}</small></summary><form action={saveAssignedLessonAction} className="mcc-ops-form"><input type="hidden" name="lesson_id" value={lesson.id}/><input type="hidden" name="course_id" value={course.id}/><label>Lesson title<input name="title" defaultValue={lesson.title} maxLength={160} required/></label><label>URL slug<input name="slug" defaultValue={lesson.slug} pattern="[a-z0-9]+(-[a-z0-9]+)*" required/></label><label>Video URL<input name="video_url" type="url" defaultValue={lesson.video_url ?? ""} placeholder="https://…" required/></label><label className="mcc-ops-checkbox"><input name="published" type="checkbox" defaultChecked={lesson.published}/> Published</label><button type="submit" className="mcc-ops-primary"><Save size={14}/> Save lesson</button></form></details>)}</div>
          <details className="mcc-ops-editor"><summary><Plus size={14}/> Add lesson</summary><form action={saveAssignedLessonAction} className="mcc-ops-form"><input type="hidden" name="course_id" value={course.id}/><label>Lesson title<input name="title" placeholder="Lesson title" required maxLength={160}/></label><label>URL slug<input name="slug" placeholder="lesson-title" pattern="[a-z0-9]+(-[a-z0-9]+)*" required/></label><label>Video URL<input name="video_url" type="url" placeholder="https://…" required/></label><label className="mcc-ops-checkbox"><input name="published" type="checkbox"/> Publish immediately</label><button type="submit" className="mcc-ops-primary"><Plus size={15}/> Add lesson</button></form></details>
          <Link className="mcc-ops-session-url" href={`/courses/${course.slug}`} target="_blank">Preview public course ↗</Link>
        </article>)}</div>
        <details className="mcc-ops-editor"><summary><Plus size={15}/> Add course to this track</summary><form action={saveAssignedCourseAction} className="mcc-ops-form"><input type="hidden" name="track_id" value={track.id}/><label>Course title<input name="title" placeholder="Course title" required maxLength={160}/></label><label>URL slug<input name="slug" placeholder="course-title" pattern="[a-z0-9]+(-[a-z0-9]+)*" required/></label><label>Description<textarea name="description" rows={3} maxLength={3000}/></label><label className="mcc-ops-checkbox"><input name="published" type="checkbox"/> Publish immediately</label><button type="submit" className="mcc-ops-primary"><Plus size={15}/> Create course</button></form></details>
      </section>;
    })}
    <p className="mcc-ops-footnote">Signed in as {user.email}. Standard member accounts cannot open this workspace. Track leaders are limited to assigned track/course/lesson rows in both server actions and database RLS.</p>
  </div>;
}
