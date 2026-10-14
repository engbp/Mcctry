import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ActionForm } from "@/components/admin/ActionForm";
import { updateApplicationStatusAction } from "../actions";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "reviewing", "accepted", "rejected", "withdrawn"] as const;

export default async function AdminApplicationsPage() {
  await requireAdmin("/admin/applications");
  const supabase = await createSupabaseServerClient();
  const [applicationResult, questionResult] = await Promise.all([
    supabase.from("applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200),
    (supabase as unknown as { from: (table: string) => any }).from("recruitment_questions")
      .select("id,label").order("position"),
  ]);
  const { data, error } = applicationResult;
  const questionLabels = new Map<string, string>(((questionResult.data ?? []) as Array<{id:string;label:string}>).map((q) => [q.id,q.label]));


  return (
    <>
      <header className="mcc-admin-page-head">
        <div>
          <span className="mcc-section-label">RECRUITMENT</span>
          <h1>Applications</h1>
          <p>Join-form submissions. Visible only to administrators (RLS-enforced).</p>
        </div>
      </header>

      {error && <div className="notice" role="alert">{error.message}</div>}

      {!data || data.length === 0 ? (
        <p className="mcc-admin-empty">No applications submitted yet.</p>
      ) : (
        <div className="mcc-admin-card-list">
          {data.map((app) => (
            <article key={app.id} className="mcc-admin-app-card">
              <div className="mcc-admin-app-head">
                <div>
                  <h3>{app.name}</h3>
                  <a href={`mailto:${app.email}`}>{app.email}</a>
                </div>
                <span className={`mcc-admin-badge mcc-admin-badge-${app.status}`}>{app.status}</span>
              </div>
              {app.phone_number && <p className="mcc-admin-app-phone"><strong>Phone:</strong> <a href={`tel:${app.phone_number}`}>{app.phone_number}</a></p>}
              {app.interests?.length > 0 && (
                <p className="mcc-admin-app-interests">{app.interests.join(" · ")}</p>
              )}
              {app.answers && Object.keys(app.answers).length > 0 && (
                <dl className="mcc-admin-app-answers">
                  {Object.entries(app.answers as Record<string, string>).map(([questionId, answer]) => (
                    <div key={questionId}><dt>{questionLabels.get(questionId) ?? "Additional answer"}</dt><dd>{answer}</dd></div>
                  ))}
                </dl>
              )}
              {app.motivation && <p className="mcc-admin-app-motivation">{app.motivation}</p>}
              <div className="mcc-admin-app-foot">
                <small>Submitted {new Date(app.created_at).toLocaleString()}</small>
                <ActionForm action={updateApplicationStatusAction} submitLabel="Update status" className="mcc-admin-inline-form">
                  <input type="hidden" name="id" value={app.id} />
                  <select name="status" defaultValue={app.status} aria-label="New status">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </ActionForm>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
