import { redirect } from "next/navigation";

// Legacy demo dashboard URL — the real student dashboard lives at /dashboard.
export default function DemoDashboardPage() {
  redirect("/dashboard");
}
