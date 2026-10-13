import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReactNode } from "react";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth";

interface MainLayoutProps {
  children: ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;
  return (
    <>
      <Header isSignedIn={Boolean(user)} isAdmin={profile?.role === "admin"} />
      <main id="main-content" className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}
