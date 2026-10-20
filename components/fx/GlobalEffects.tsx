"use client";

import { usePathname } from "next/navigation";
import { ParticleBackground } from "./ParticleBackground";

export function GlobalEffects() {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  // Keep the site's animated atmosphere on public pages, but never run the
  // particle canvas or cursor-following glow inside the admin workspace.
  if (isAdminRoute) return null;

  return <ParticleBackground />;
}
