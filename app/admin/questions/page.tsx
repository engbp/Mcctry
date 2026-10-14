import { ClipboardList, Plus, CheckCircle2 } from "lucide-react";
import { requireGlobalAdmin } from "@/lib/admin/authorization";
import { createRecruitmentQuestionAction, deleteRecruitmentQuestionAction, updateRecruitmentQuestionAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function RecruitmentQuestionsPage() {
  const { supabase } = await requireGlobalAdmin("/admin/questions");
  const db = supabase as unknown as { from: (table: string) => any };
  const { data, error } = await db.from("recruitment_questions").select("id,label,field_type,options,required,enabled,position,created_at").order("position").order("created_at");
  const questions = (data ?? []) as Array<{id:string;label:string;field_type:string;options:string[];required:boolean;enabled:boolean;position:number;created_at:string}>;
  return <div className="mcc-ops-page">
    <header className="mcc-ops-page-head"><div className="mcc-ops-title-icon"><ClipboardList size={22}/></div><div><p className="mcc-ops-eyebrow">RECRUITMENT CONFIGURATION</p><h1>Application questions</h1><p>Build the application form without changing code. Enabled questions appear on the public recruitment page.</p></div></header>
    {error && <div className="mcc-ops-alert">The recruitment_questions table is not available yet. Apply the new Supabase migration before using this page.</div>}
    <section className="mcc-ops-card">
      <h2><Plus size={18}/> Add a question</h2>
      <form action={createRecruitmentQuestionAction} className="mcc-ops-form">
        <label>Question label<input name="label" required minLength={2} maxLength={200} placeholder="What project would you like to work on?" /></label>
        <div className="mcc-ops-form-split">
          <label>Answer type<select name="field_type" defaultValue="textarea"><option value="text">Short text</option><option value="textarea">Long answer</option><option value="select">Choose from options</option></select></label>
          <label>Display order<input type="number" name="position" min={0} defaultValue={questions.length * 10} /></label>
        </div>
        <label>Options <span>(one per line; select questions need at least 2)</span><textarea name="options" rows={3} placeholder={"Web Development\nAI & Machine Learning\nCloud"} /></label>
        <label className="mcc-ops-checkbox"><input type="checkbox" name="required" /> Required answer</label>
        <button className="mcc-ops-primary" type="submit">Add question <Plus size={16}/></button>
      </form>
    </section>
    <section className="mcc-ops-card">
      <div className="mcc-ops-card-head"><h2>Current questions</h2><span className="mcc-ops-count">{questions.length} total</span></div>
      {questions.length === 0 ? <p className="mcc-ops-empty">No custom questions yet. Add one above; name, email, phone, and interests are collected separately.</p> : <div className="mcc-ops-question-list">
        {questions.map((q) => <article className="mcc-ops-question" key={q.id}>
          <div className="mcc-ops-question-main"><div><span className="mcc-ops-tag">{q.field_type}</span>{q.required && <span className="mcc-ops-tag required">Required</span>}{!q.enabled && <span className="mcc-ops-tag muted">Hidden</span>}<h3>{q.label}</h3>{q.field_type === "select" && <p>{(q.options ?? []).join(" · ")}</p>}</div></div>
          <div className="mcc-ops-inline-actions">
            <form action={updateRecruitmentQuestionAction}><input type="hidden" name="id" value={q.id}/><input type="hidden" name="enabled" value={String(!q.enabled)}/><button className="mcc-ops-secondary" type="submit">{q.enabled ? "Disable" : "Enable"}</button></form>
            <form action={deleteRecruitmentQuestionAction}><input type="hidden" name="id" value={q.id}/><button className="mcc-ops-danger" type="submit">Delete</button></form>
          </div>
        </article>)}
      </div>}
    </section>
    <p className="mcc-ops-footnote"><CheckCircle2 size={14}/> Required fields are checked again on the server and in the database. Account passwords are never part of recruitment applications.</p>
  </div>;
}
