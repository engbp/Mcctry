import Link from "next/link";
import { BookOpen, ExternalLink, Plus, Save, Trash2 } from "lucide-react";
import { requireAdminOrLeader } from "@/lib/admin/authorization";
import { deleteAssignedResourceAction, saveAssignedResourceAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function LeaderResourcesPage() {
  const { profile, supabase, assignedTrackIds } = await requireAdminOrLeader("/admin/leader/resources");
  const db = supabase as unknown as { from: (table: string) => any };
  const [{ data: tracks }, { data: courses }, { data: lessons }, { data: resources, error }] = await Promise.all([
    db.from("tracks").select("id,title").order("position"),
    db.from("courses").select("id,title,track_id").order("position"),
    db.from("lessons").select("id,title,course_id").order("position"),
    db.from("resources").select("id,title,slug,description,link,category,icon,course_id,lesson_id,external,published,position").order("position"),
  ]);
  const visibleTracks = ((tracks ?? []) as Array<{id:string;title:string}>).filter(t=>profile.role==="admin"||assignedTrackIds.includes(t.id));
  const visibleTrackIds = new Set(visibleTracks.map(t=>t.id));
  const visibleCourses = ((courses ?? []) as Array<{id:string;title:string;track_id:string}>).filter(c=>visibleTrackIds.has(c.track_id));
  const visibleCourseIds = new Set(visibleCourses.map(c=>c.id));
  const visibleLessons = ((lessons ?? []) as Array<{id:string;title:string;course_id:string}>).filter(l=>visibleCourseIds.has(l.course_id));
  const visibleLessonIds = new Set(visibleLessons.map(l=>l.id));
  const allResources = (resources ?? []) as Array<{id:string;title:string;slug:string;description:string|null;link:string|null;category:string|null;icon:string|null;course_id:string|null;lesson_id:string|null;external:boolean;published:boolean;position:number}>;
  const visibleResources = allResources.filter(r=>profile.role==="admin"||(r.course_id&&visibleCourseIds.has(r.course_id))||(r.lesson_id&&visibleLessonIds.has(r.lesson_id)));
  const courseById = new Map(visibleCourses.map(c=>[c.id,c]));
  const lessonById = new Map(visibleLessons.map(l=>[l.id,l]));
  const attachmentLabel = (r: typeof allResources[number]) => {
    const courseId = r.course_id ?? (r.lesson_id ? lessonById.get(r.lesson_id)?.course_id : undefined);
    const courseName = courseId ? courseById.get(courseId)?.title : undefined;
    const lessonName = r.lesson_id ? lessonById.get(r.lesson_id)?.title : undefined;
    return [courseName, lessonName].filter(Boolean).join(" / ") || "Not attached";
  };
  return <div className="mcc-ops-page">
    <header className="mcc-ops-page-head"><div className="mcc-ops-title-icon"><BookOpen size={22}/></div><div><p className="mcc-ops-eyebrow">LEARNING RESOURCES</p><h1>Resource links</h1><p>Manage learning links attached to your assigned courses or lessons. Club-wide standalone links stay with global admins.</p></div></header>
    {error&&<div className="mcc-ops-alert">Resources could not be loaded. Apply the community-feature migration and confirm database access.</div>}
    <section className="mcc-ops-card"><h2><Plus size={18}/> Add a resource</h2><form action={saveAssignedResourceAction} className="mcc-ops-form">
      <label>Title<input name="title" required maxLength={200}/></label><label>URL slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="resource-title"/></label>
      <label>Course (required)<select name="course_id" defaultValue="" required><option value="">Choose a course…</option>{visibleCourses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
      <label>Optional lesson<select name="lesson_id" defaultValue=""><option value="">Attach to the whole course</option>{visibleLessons.map(l=><option key={l.id} value={l.id}>{courseById.get(l.course_id)?.title ?? "Course"} / {l.title}</option>)}</select></label>
      <label>Link<input name="link" type="url" placeholder="https://…"/></label><label>Description<textarea name="description" rows={3} maxLength={3000}/></label>
      <div className="mcc-ops-form-split"><label>Category<input name="category" placeholder="Learning"/></label><label>Icon<input name="icon" defaultValue="BookOpen"/></label></div>
      <label>Order<input name="position" type="number" defaultValue={0} min={0}/></label>
      <label className="mcc-ops-checkbox"><input name="external" type="checkbox" defaultChecked/> External link</label><label className="mcc-ops-checkbox"><input name="published" type="checkbox"/> Published</label>
      <button type="submit" className="mcc-ops-primary">Create resource <Plus size={15}/></button>
    </form></section>
    <section className="mcc-ops-card"><div className="mcc-ops-card-head"><h2>Existing resources</h2><span className="mcc-ops-count">{visibleResources.length}</span></div>
      {visibleResources.length===0?<p className="mcc-ops-empty">No attached resources yet.</p>:<div className="mcc-ops-question-list">{visibleResources.map(r=><article key={r.id} className="mcc-ops-resource-row"><div><span className={r.published?"mcc-ops-tag active":"mcc-ops-tag muted"}>{r.published?"Published":"Draft"}</span><h3>{r.title}</h3><p>{attachmentLabel(r)}</p>{r.link&&<a href={r.link} target="_blank" rel="noreferrer" className="mcc-ops-session-url">{r.link} <ExternalLink size={13}/></a>}</div>
        <details className="mcc-ops-editor"><summary>Edit</summary><form action={saveAssignedResourceAction} className="mcc-ops-form">
          <input type="hidden" name="id" value={r.id}/><label>Title<input name="title" defaultValue={r.title} required maxLength={200}/></label><label>Slug<input name="slug" defaultValue={r.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*"/></label>
          <label>Course<select name="course_id" defaultValue={r.course_id ?? (r.lesson_id ? lessonById.get(r.lesson_id)?.course_id : "") ?? ""} required><option value="">Choose course…</option>{visibleCourses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
          <label>Lesson<select name="lesson_id" defaultValue={r.lesson_id ?? ""}><option value="">Attach to the whole course</option>{visibleLessons.map(l=><option key={l.id} value={l.id}>{courseById.get(l.course_id)?.title ?? "Course"} / {l.title}</option>)}</select></label>
          <label>Link<input name="link" type="url" defaultValue={r.link ?? ""}/></label><label>Description<textarea name="description" defaultValue={r.description ?? ""} rows={2}/></label><div className="mcc-ops-form-split"><label>Category<input name="category" defaultValue={r.category ?? ""}/></label><label>Icon<input name="icon" defaultValue={r.icon ?? "BookOpen"}/></label></div><label>Order<input name="position" type="number" min={0} defaultValue={r.position}/></label>
          <label className="mcc-ops-checkbox"><input name="external" type="checkbox" defaultChecked={r.external}/> External link</label><label className="mcc-ops-checkbox"><input name="published" type="checkbox" defaultChecked={r.published}/> Published</label><button type="submit" className="mcc-ops-primary"><Save size={14}/> Save resource</button>
        </form></details><form action={deleteAssignedResourceAction}><input type="hidden" name="id" value={r.id}/><button type="submit" className="mcc-ops-danger"><Trash2 size={14}/> Delete</button></form>
      </article>)}</div>}
    </section><p className="mcc-ops-footnote">Changes are checked against your assigned track on the server and by RLS. {profile.role==="admin"&&<Link href="/admin/resources">Open full resource manager ↗</Link>}</p>
  </div>;
}
