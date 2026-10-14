import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ActionForm } from "@/components/admin/ActionForm";
import { saveLessonAction, deleteLessonAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLessonsPage() {
  await requireAdmin("/admin/lessons");
  const supabase = await createSupabaseServerClient();
  const [{ data: lessons }, { data: courses }] = await Promise.all([
    supabase.from("lessons").select("*, courses!inner(id, title)").order("position"),
    supabase.from("courses").select("id, title").order("title"),
  ]);

  return (
    <>
      <header className="mcc-admin-page-head">
        <div>
          <span className="mcc-section-label">LEARNING</span>
          <h1>Lessons</h1>
          <p>Lessons belong to a course. Video URL must be a public http(s) link (e.g. YouTube watch URL).</p>
        </div>
      </header>

      <section className="mcc-admin-section" aria-labelledby="new-lesson">
        <h2 id="new-lesson">New lesson</h2>
        {courses && courses.length > 0 ? (
          <ActionForm action={saveLessonAction} submitLabel="Create lesson" className="mcc-admin-form">
            <label>Course
              <select name="courseId" required>
                <option value="">Choose…</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </label>
            <label>Title<input name="title" required maxLength={200} /></label>
            <label>Slug <small>(optional)</small><input name="slug" placeholder="auto" /></label>
            <label>Video URL<input name="videoUrl" type="url" placeholder="https://www.youtube.com/watch?v=…" /></label>
            <label>Duration label<input name="duration" placeholder="09:00" /></label>
            <label>Type<input name="type" defaultValue="video" /></label>
            <label>Position<input name="position" type="number" defaultValue={0} /></label>
            <label className="mcc-admin-check"><input name="published" type="checkbox" /> Published</label>
          </ActionForm>
        ) : (
          <p className="mcc-admin-empty">Create a course first — lessons must belong to one.</p>
        )}
      </section>

      <section className="mcc-admin-section" aria-labelledby="all-lessons">
        <h2 id="all-lessons">Existing lessons ({lessons?.length ?? 0})</h2>
        {!lessons || lessons.length === 0 ? (
          <p className="mcc-admin-empty">No lessons yet.</p>
        ) : (
          <div className="mcc-admin-card-list">
            {lessons.map((lesson) => (
              <article key={lesson.id} className="mcc-admin-edit-card">
                <h3>{lesson.title} {lesson.published ? <span className="mcc-admin-badge mcc-admin-badge-accepted">published</span> : <span className="mcc-admin-badge mcc-admin-badge-pending">draft</span>}</h3>
                <ActionForm action={saveLessonAction} submitLabel="Save" className="mcc-admin-form">
                  <input type="hidden" name="id" value={lesson.id} />
                  <label>Course
                    <select name="courseId" defaultValue={lesson.course_id} required>
                      {courses?.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </label>
                  <label>Title<input name="title" defaultValue={lesson.title} required maxLength={200} /></label>
                  <label>Slug<input name="slug" defaultValue={lesson.slug} required /></label>
                  <label>Video URL<input name="videoUrl" defaultValue={lesson.video_url ?? ""} type="url" /></label>
                  <label>Duration<input name="duration" defaultValue={lesson.duration ?? ""} /></label>
                  <label>Type<input name="type" defaultValue={lesson.type ?? "video"} /></label>
                  <label>Position<input name="position" type="number" defaultValue={lesson.position} /></label>
                  <label className="mcc-admin-check"><input name="published" type="checkbox" defaultChecked={lesson.published} /> Published</label>
                </ActionForm>
                <ActionForm
                  action={deleteLessonAction}
                  submitLabel="Delete"
                  className="mcc-admin-delete-form"
                  confirmMessage={`Delete lesson "${lesson.title}"?`}
                >
                  <input type="hidden" name="id" value={lesson.id} />
                </ActionForm>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
