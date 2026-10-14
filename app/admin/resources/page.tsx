import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ActionForm } from "@/components/admin/ActionForm";
import { saveResourceAction, deleteResourceAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  await requireAdmin("/admin/resources");
  const supabase = await createSupabaseServerClient();
  const { data: resources } = await supabase.from("resources").select("*").order("position");

  return (
    <>
      <header className="mcc-admin-page-head">
        <div>
          <span className="mcc-section-label">CURATED LINKS</span>
          <h1>Resources</h1>
          <p>Public reading list. Only published resources appear on /resources.</p>
        </div>
      </header>

      <section className="mcc-admin-section" aria-labelledby="new-resource">
        <h2 id="new-resource">New resource</h2>
        <ActionForm action={saveResourceAction} submitLabel="Create resource" className="mcc-admin-form">
          <label>Title<input name="title" required maxLength={200} /></label>
          <label>Slug <small>(optional)</small><input name="slug" placeholder="auto" /></label>
          <label>Description<textarea name="description" rows={2} /></label>
          <label>Link<input name="link" placeholder="https://…" /></label>
          <label>Category<input name="category" placeholder="Learning" /></label>
          <label>Icon<input name="icon" defaultValue="BookOpen" /></label>
          <label>Position<input name="position" type="number" defaultValue={0} /></label>
          <label className="mcc-admin-check"><input name="external" type="checkbox" defaultChecked /> External link</label>
          <label className="mcc-admin-check"><input name="published" type="checkbox" /> Published</label>
        </ActionForm>
      </section>

      <section className="mcc-admin-section" aria-labelledby="all-resources">
        <h2 id="all-resources">Existing resources ({resources?.length ?? 0})</h2>
        {!resources || resources.length === 0 ? (
          <p className="mcc-admin-empty">No resources yet.</p>
        ) : (
          <div className="mcc-admin-card-list">
            {resources.map((resource) => (
              <article key={resource.id} className="mcc-admin-edit-card">
                <h3>{resource.title} {resource.published ? <span className="mcc-admin-badge mcc-admin-badge-accepted">published</span> : <span className="mcc-admin-badge mcc-admin-badge-pending">draft</span>}</h3>
                <ActionForm action={saveResourceAction} submitLabel="Save" className="mcc-admin-form">
                  <input type="hidden" name="id" value={resource.id} />
                  <label>Title<input name="title" defaultValue={resource.title} required maxLength={200} /></label>
                  <label>Slug<input name="slug" defaultValue={resource.slug} required /></label>
                  <label>Description<textarea name="description" defaultValue={resource.description ?? ""} rows={2} /></label>
                  <label>Link<input name="link" defaultValue={resource.link ?? ""} /></label>
                  <label>Category<input name="category" defaultValue={resource.category ?? ""} /></label>
                  <label>Icon<input name="icon" defaultValue={resource.icon ?? "BookOpen"} /></label>
                  <label>Position<input name="position" type="number" defaultValue={resource.position} /></label>
                  <label className="mcc-admin-check"><input name="external" type="checkbox" defaultChecked={resource.external} /> External link</label>
                  <label className="mcc-admin-check"><input name="published" type="checkbox" defaultChecked={resource.published} /> Published</label>
                </ActionForm>
                <ActionForm
                  action={deleteResourceAction}
                  submitLabel="Delete"
                  className="mcc-admin-delete-form"
                  confirmMessage={`Delete resource "${resource.title}"?`}
                >
                  <input type="hidden" name="id" value={resource.id} />
                </ActionForm>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
