import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      <main id="main-content" className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}