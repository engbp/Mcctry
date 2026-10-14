import { redirect } from "next/navigation";

// Legacy demo admin URL — the real admin workspace lives at /admin.
export default function DemoAdminPage() {
  redirect("/admin");
}
