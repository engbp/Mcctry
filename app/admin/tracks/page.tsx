import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ActionForm } from "@/components/admin/ActionForm";
import { saveTrackAction, deleteTrackAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminTracksPage() {
  await requireAdmin("/admin/tracks");
  const supabase = await createSupabaseServerClient();
  const { data: tracks } = await supabase.from("tracks").select("*").order("position");

  return (
    <>
      <header className="mcc-admin-page-head">
        <div>
          <span className="mcc-section-label">LEARNING</span>
          <h1>Tracks</h1>
          <p>Create, edit, publish, unpublish, and delete learning tracks.</p>
        </div>
      </header>

      <section className="mcc-admin-section" aria-labelledby="new-track">
        <h2 id="new-track">New track</h2>
        <ActionForm action={saveTrackAction} submitLabel="Create track" className="mcc-admin-form">
          <label>Title<input name="title" required maxLength={160} /></label>
          <label>Slug <small>(optional — generated from title)</small><input name="slug" placeholder="auto" /></label>
          <label>Description<textarea name="description" rows={2} /></label>
          <label>Color<input name="color" type="color" defaultValue="#0078d4" /></label>
          <label>Duration label<input name="duration" placeholder="e.g. 4h 20m" /></label>
          <label>Position<input name="position" type="number" defaultValue={0} /></label>
          <label className="mcc-admin-check"><input name="published" type="checkbox" /> Published</label>
          <label className="mcc-admin-check"><input name="featured" type="checkbox" /> Featured</label>
        </ActionForm>
      </section>

      <section className="mcc-admin-section" aria-labelledby="all-tracks">
        <h2 id="all-tracks">Existing tracks ({tracks?.length ?? 0})</h2>
        {!tracks || tracks.length === 0 ? (
          <p className="mcc-admin-empty">No tracks yet.</p>
        ) : (
          <div className="mcc-admin-card-list">
            {tracks.map((track) => (
              <article key={track.id} className="mcc-admin-edit-card">
                <h3>{track.title} {track.published ? <span className="mcc-admin-badge mcc-admin-badge-accepted">published</span> : <span className="mcc-admin-badge mcc-admin-badge-pending">draft</span>}</h3>
                <ActionForm action={saveTrackAction} submitLabel="Save" className="mcc-admin-form">
                  <input type="hidden" name="id" value={track.id} />
                  <label>Title<input name="title" defaultValue={track.title} required maxLength={160} /></label>
                  <label>Slug<input name="slug" defaultValue={track.slug} required /></label>
                  <label>Description<textarea name="description" defaultValue={track.description ?? ""} rows={2} /></label>
                  <label>Color<input name="color" type="color" defaultValue={track.color ?? "#0078d4"} /></label>
                  <label>Duration<input name="duration" defaultValue={track.duration ?? ""} /></label>
                  <label>Position<input name="position" type="number" defaultValue={track.position} /></label>
                  <label className="mcc-admin-check"><input name="published" type="checkbox" defaultChecked={track.published} /> Published</label>
                  <label className="mcc-admin-check"><input name="featured" type="checkbox" defaultChecked={track.featured} /> Featured</label>
                </ActionForm>
                <ActionForm
                  action={deleteTrackAction}
                  submitLabel="Delete"
                  className="mcc-admin-delete-form"
                  confirmMessage={`Delete track "${track.title}"? Courses in it must be moved or deleted first.`}
                >
                  <input type="hidden" name="id" value={track.id} />
                </ActionForm>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
