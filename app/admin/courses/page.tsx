import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ActionForm } from "@/components/admin/ActionForm";
import { saveCourseAction, deleteCourseAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  await requireAdmin("/admin/courses");
  const supabase = await createSupabaseServerClient();
  const [{ data: courses }, { data: tracks }] = await Promise.all([
    supabase.from("courses").select("*, tracks!inner(id, title, slug)").order("position"),
    supabase.from("tracks").select("id, title").order("title"),
  ]);

  return (
    <>
      <header className="mcc-admin-page-head">
        <div>
          <span className="mcc-section-label">LEARNING</span>
          <h1>Courses</h1>
          <p>Courses belong to a track. Publish only finished courses.</p>
        </div>
      </header>

      <section className="mcc-admin-section" aria-labelledby="new-course">
        <h2 id="new-course">New course</h2>
        {tracks && tracks.length > 0 ? (
          <ActionForm action={saveCourseAction} submitLabel="Create course" className="mcc-admin-form">
            <label>Track
              <select name="trackId" required>
                <option value="">Choose…</option>
                {tracks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </label>
            <label>Title<input name="title" required maxLength={160} /></label>
            <label>Slug <small>(optional)</small><input name="slug" placeholder="auto" /></label>
            <label>Description<textarea name="description" rows={2} /></label>
            <label>Level<input name="level" placeholder="Beginner" /></label>
            <label>Color<input name="color" type="color" defaultValue="#0078d4" /></label>
            <label>Duration label<input name="duration" placeholder="e.g. 2h 40m" /></label>
            <label>Position<input name="position" type="number" defaultValue={0} /></label>
            <label className="mcc-admin-check"><input name="published" type="checkbox" /> Published</label>
            <label className="mcc-admin-check"><input name="featured" type="checkbox" /> Featured</label>
          </ActionForm>
        ) : (
          <p className="mcc-admin-empty">Create a track first — courses must belong to one.</p>
        )}
      </section>

      <section className="mcc-admin-section" aria-labelledby="all-courses">
        <h2 id="all-courses">Existing courses ({courses?.length ?? 0})</h2>
        {!courses || courses.length === 0 ? (
          <p className="mcc-admin-empty">No courses yet.</p>
        ) : (
          <div className="mcc-admin-card-list">
            {courses.map((course) => (
              <article key={course.id} className="mcc-admin-edit-card">
                <h3>{course.title} {course.published ? <span className="mcc-admin-badge mcc-admin-badge-accepted">published</span> : <span className="mcc-admin-badge mcc-admin-badge-pending">draft</span>}</h3>
                <ActionForm action={saveCourseAction} submitLabel="Save" className="mcc-admin-form">
                  <input type="hidden" name="id" value={course.id} />
                  <label>Track
                    <select name="trackId" defaultValue={course.track_id} required>
                      {tracks?.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                  </label>
                  <label>Title<input name="title" defaultValue={course.title} required maxLength={160} /></label>
                  <label>Slug<input name="slug" defaultValue={course.slug} required /></label>
                  <label>Description<textarea name="description" defaultValue={course.description ?? ""} rows={2} /></label>
                  <label>Level<input name="level" defaultValue={course.level ?? ""} /></label>
                  <label>Color<input name="color" type="color" defaultValue={course.color ?? "#0078d4"} /></label>
                  <label>Duration<input name="duration" defaultValue={course.duration ?? ""} /></label>
                  <label>Position<input name="position" type="number" defaultValue={course.position} /></label>
                  <label className="mcc-admin-check"><input name="published" type="checkbox" defaultChecked={course.published} /> Published</label>
                  <label className="mcc-admin-check"><input name="featured" type="checkbox" defaultChecked={course.featured} /> Featured</label>
                </ActionForm>
                <ActionForm
                  action={deleteCourseAction}
                  submitLabel="Delete"
                  className="mcc-admin-delete-form"
                  confirmMessage={`Delete course "${course.title}"? Its lessons are removed too.`}
                >
                  <input type="hidden" name="id" value={course.id} />
                </ActionForm>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
