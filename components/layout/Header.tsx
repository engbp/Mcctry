"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, LayoutDashboard, LogIn, Menu, X } from "lucide-react";

type HeaderProps = { isSignedIn?: boolean; isAdmin?: boolean; isTrackLeader?: boolean };

const menus = [
  { label: "Learn", href: "/courses", children: [
    { label: "Courses", href: "/courses", hint: "Video lessons and learning progress" },
    { label: "Learning tracks", href: "/tracks", hint: "Explore the paths published by MCC" },
    { label: "Resources", href: "/resources", hint: "Helpful links for your next build" },
  ]},
  { label: "Club", href: "/about", children: [
    { label: "About MCC", href: "/about", hint: "What we're here to build together" },
    { label: "Recruitment", href: "/join", hint: "Learn how to apply to the club" },
  ]},
];

export function Header({ isSignedIn = false, isAdmin = false, isTrackLeader = false }: HeaderProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dashboardHref = isAdmin || isTrackLeader ? "/admin" : "/dashboard";

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return <header className="mcc-v2-header">
    <div className="mcc-v2-nav-shell">
      <Link href="/" className="mcc-v2-brand" aria-label="MCC MNU home">
        <Image src="/mcc-mnu-logo.svg" alt="Microsoft Campus Club — Mansoura National University" width={228} height={54} priority />
      </Link>
      <nav className="mcc-v2-desktop-nav" aria-label="Main navigation" ref={navRef}>
        <Link href="/courses" className={pathname.startsWith("/courses") ? "mcc-v2-nav-link active" : "mcc-v2-nav-link"}>Courses</Link>
        <Link href="/tracks" className={pathname.startsWith("/tracks") ? "mcc-v2-nav-link active" : "mcc-v2-nav-link"}>Tracks</Link>
        {menus.map((menu) => <div className="mcc-v2-nav-menu" key={menu.label} onPointerEnter={() => setOpenMenu(menu.label)} onPointerLeave={() => setOpenMenu((current) => current === menu.label ? null : current)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenMenu(null); }}>
          <button type="button" className={openMenu === menu.label ? "mcc-v2-nav-trigger active" : "mcc-v2-nav-trigger"} aria-haspopup="true" aria-expanded={openMenu === menu.label} onClick={() => setOpenMenu((current) => current === menu.label ? null : menu.label)}>{menu.label}<ChevronDown size={14} className={openMenu === menu.label ? "is-open" : ""} /></button>
          {openMenu === menu.label && <div className="mcc-v2-dropdown">{menu.children.map((child) => <Link key={child.href} href={child.href} onClick={() => setOpenMenu(null)} className="mcc-v2-dropdown-item"><span>{child.label}</span><small>{child.hint}</small></Link>)}</div>}
        </div>)}
        <Link href="/about" className={pathname === "/about" ? "mcc-v2-nav-link active" : "mcc-v2-nav-link"}>About</Link>
      </nav>
      <div className="mcc-v2-nav-actions">
        {isSignedIn ? <Link href={dashboardHref} className="mcc-v2-nav-account"><LayoutDashboard size={16} /> {isAdmin ? "Admin workspace" : isTrackLeader ? "Track workspace" : "My dashboard"}</Link> : <><Link href="/login" className="mcc-v2-nav-login"><LogIn size={16} /> Sign in</Link><Link href="/signup" className="mcc-v2-nav-join">Create account <ArrowUpRight size={15} /></Link></>}
      </div>
      <button ref={menuButtonRef} type="button" className="mcc-v2-mobile-toggle" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
    </div>
    {mobileOpen && <nav className="mcc-v2-mobile-nav" aria-label="Mobile navigation">
      <Link href="/courses">Courses</Link><Link href="/tracks">Learning tracks</Link><Link href="/resources">Resources</Link><Link href="/about">About MCC</Link><Link href="/join">Recruitment</Link>
      {isSignedIn ? <Link href={dashboardHref}>{isAdmin ? "Admin workspace" : isTrackLeader ? "Track workspace" : "My dashboard"}</Link> : <><Link href="/login">Sign in</Link><Link href="/signup">Create account</Link></>}
    </nav>}
  </header>;
}
