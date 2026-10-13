import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdmin("/admin");
  return (
    <div className="mcc-admin-shell">
      <AdminNav role={profile.role} displayName={profile.display_name} />
      <div className="mcc-admin-main-body" id="admin-main">
        {children}
      </div>
    </div>
  );
}
