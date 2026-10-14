import { createSupabaseServerClient } from "@/lib/supabase/server";
import { JoinClient, type RecruitmentQuestion } from "./JoinClient";

export const dynamic = "force-dynamic";

export default async function JoinPage() {
  let questions: RecruitmentQuestion[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    const result = await (supabase as unknown as { from: (table: string) => any })
      .from("recruitment_questions")
      .select("id,label,field_type,options,required")
      .eq("enabled", true)
      .order("position", { ascending: true });
    if (Array.isArray(result.data)) questions = result.data as RecruitmentQuestion[];
  } catch {
    // The rest of the recruitment page remains usable if the optional table is not migrated yet.
  }
  return <JoinClient questions={questions} />;
}
