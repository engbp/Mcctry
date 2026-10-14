import { redirect } from "next/navigation";

// Non-MVP public sections are intentionally unavailable until real content
// and admin workflows exist. Redirect to the home page rather than showing
// empty prototype shells.
export default function EventsPage() {
  redirect("/");
}
