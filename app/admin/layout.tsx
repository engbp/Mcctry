import { redirect } from "next/navigation";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=%2Fadmin");
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "leader")) redirect("/dashboard?error=admin-required");
  return (
    <div className="mcc-admin-shell">
      <AdminNav role={profile.role} displayName={profile.display_name} />
      <div className="mcc-admin-main-body" id="admin-main">{children}</div>
    </div>
  );
}
