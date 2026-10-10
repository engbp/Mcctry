"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { tracksData, coursesData, eventsData } from "@/lib/data";

const navigation = [
  {
    label: "Learn",
    href: "/courses",
    children: [
      { label: "All Courses", href: "/courses", description: "Browse the complete course catalogue" },
      { label: "Learning Tracks", href: "/tracks", description: "Guided paths from beginner to advanced" },
      { label: "Resources", href: "/resources", description: "Tools, references, and learning materials" },
    ],
  },
  {
    label: "Build",
    href: "/projects",
    children: [
      { label: "Student Projects", href: "/projects", description: "See what MCC members are building" },
      { label: "Events & Workshops", href: "/events", description: "Hands-on sessions and build nights" },
      { label: "Opportunities", href: "/opportunities", description: "Hackathons, competitions, programs" },
    ],
  },
  {
    label: "Connect",
    href: "/about",
    children: [
      { label: "About MCC", href: "/about", description: "Our mission, values, and community" },
      { label: "Join MCC", href: "/join", description: "Become a member today" },
      { label: "Student Dashboard", href: "/demo/dashboard", description: "Track your learning progress" },
    ],
  },
];

const searchIndex = [
  ...coursesData.map((c) => ({ label: c.title, href: `/courses/${c.slug}`, type: "Course" })),
  ...tracksData.map((t) => ({ label: t.title, href: `/tracks/${t.slug}`, type: "Track" })),
  ...eventsData.map((e) => ({ label: e.title, href: `/events/${e.slug}`, type: "Event" })),
  { label: "About MCC", href: "/about", type: "Page" },
  { label: "Join MCC", href: "/join", type: "Page" },
  { label: "Student Projects", href: "/projects", type: "Page" },
  { label: "Opportunities", href: "/opportunities", type: "Page" },
  { label: "Resources", href: "/resources", type: "Page" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (mobileOpen) {
      panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setOpenDropdown(null);
        if (mobileOpen) {
          setMobileOpen(false);
          menuBtnRef.current?.focus();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [mobileOpen]);

  const results = query.trim()
    ? searchIndex.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 7)
    : searchIndex.slice(0, 6);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="site-header" role="banner" ref={headerRef}>
      <div className="nav-wrap">
        <Link className="brand" href="/" aria-label="MCC MNU home">
          <img className="brand-image" src="/mcc-mnu-logo.svg" alt="Microsoft Campus Club - MNU" width="228" height="54" />
          <span className="brand-mark" aria-hidden="true">
            <i /><i /><i /><i />
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => {
            const open = openDropdown === item.label;
            return (
              <div key={item.label} className={`nav-item ${open ? "nav-item-open" : ""}`}>
                <button
                  className={`nav-link ${isActive(item.href) || item.children.some((c) => isActive(c.href)) ? "nav-link-active" : ""}`}
                  aria-expanded={open}
                  aria-haspopup="true"
                  onClick={() => setOpenDropdown(open ? null : item.label)}
                  onMouseEnter={() => setOpenDropdown(item.label)}
                >
                  {item.label}
                  <ChevronDown className="nav-chevron" size={14} />
                </button>
                <div
                  className={`nav-dropdown ${open ? "nav-dropdown-open" : ""}`}
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  role="menu"
                >
                  <span className="nav-dropdown-heading">{item.label}</span>
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className={`nav-dropdown-link ${isActive(child.href) ? "nav-dropdown-link-active" : ""}`}
                      role="menuitem"
                    >
                      <span className="nav-dropdown-label">{child.label}</span>
                      <span className="nav-dropdown-desc">{child.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="nav-actions">
          <button
            className={`search-btn ${searchOpen ? "search-btn-open" : ""}`}
            aria-label="Search"
            aria-expanded={searchOpen}
            aria-controls="site-search-overlay"
            onClick={() => setSearchOpen((s) => !s)}
          >
            <Search size={16} />
            <span className="search-btn-label">Search</span>
            <kbd className="search-kbd">Ctrl K</kbd>
          </button>
          <Button variant="primary" asChild className="nav-join">
            <Link href="/join">Join MCC <ArrowUpRight size={15} /></Link>
          </Button>
          <button
            ref={menuBtnRef}
            className="menu-btn"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu-panel"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="search-overlay" id="site-search-overlay" role="dialog" aria-modal="true" aria-label="Site search">
          <div className="search-panel">
            <div className="search-input-row">
              <Search size={18} aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, tracks, events…"
                aria-label="Search courses, tracks, events"
              />
              <button className="search-close" aria-label="Close search" onClick={() => setSearchOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="search-results" role="listbox">
              {results.length === 0 && <p className="search-empty">No results for “{query}”.</p>}
              {results.map((item) => (
                <Link key={`${item.type}-${item.label}`} href={item.href} className="search-result" role="option">
                  <span className="search-result-type">{item.type}</span>
                  <span className="search-result-label">{item.label}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="mobile-panel" id="mobile-menu-panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="mobile-panel-head">
            <strong>MCC MNU</strong>
            <button
              className="menu-btn"
              aria-label="Close navigation"
              onClick={() => {
                setMobileOpen(false);
                menuBtnRef.current?.focus();
              }}
            >
              <X size={22} />
            </button>
          </div>
          {navigation.map((item) => {
            const expanded = mobileSection === item.label;
            const subId = `mobile-sub-${item.label.toLowerCase()}`;
            return (
              <div key={item.label} className="mobile-nav-section">
                <button
                  className={`mobile-nav-link ${expanded ? "mobile-nav-link-open" : ""}`}
                  aria-expanded={expanded}
                  aria-controls={subId}
                  onClick={() => setMobileSection(expanded ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown className={expanded ? "rotated" : ""} size={16} />
                </button>
                {expanded && (
                  <div className="mobile-nav-sublinks" id={subId}>
                    {item.children.map((child) => (
                      <Link key={child.label} href={child.href} className="mobile-nav-sublink" onClick={() => setMobileOpen(false)}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Button variant="primary" className="mobile-join" asChild>
            <Link href="/join" onClick={() => setMobileOpen(false)}>Join MCC <ArrowUpRight size={15} /></Link>
          </Button>
        </div>
      )}
    </header>
  );
}
