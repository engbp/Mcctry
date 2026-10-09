"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, ChevronDown, ArrowUpRight } from "lucide-react";
import { TextLink } from "@/components/ui/Links";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const navigation = [
  { 
    label: "Learn", 
    href: "/courses", 
    children: [
      { label: "All Courses", href: "/courses", description: "Browse the complete course catalogue" },
      { label: "Learning Tracks", href: "/tracks", description: "Guided paths from beginner to advanced" },
      { label: "Resources", href: "/resources", description: "Tools, references, and learning materials" },
    ]
  },
  { 
    label: "Build", 
    href: "/projects", 
    children: [
      { label: "Student Projects", href: "/projects", description: "See what MCC members are building" },
      { label: "Events & Workshops", href: "/events", description: "Hands-on sessions and build nights" },
      { label: "Opportunities", href: "/opportunities", description: "Hackathons, competitions, programs" },
    ]
  },
  { 
    label: "Connect", 
    href: "/about", 
    children: [
      { label: "About MCC", href: "/about", description: "Our mission, values, and community" },
      { label: "Join MCC", href: "/join", description: "Become a member today" },
      { label: "Student Dashboard", href: "/demo/dashboard", description: "Track your learning progress" },
    ]
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="site-header" role="banner">
      <div className="nav-wrap">
        <Link className="brand" href="/" aria-label="MCC MNU home">
          <span className="brand-mcc">MCC</span>
          <span className="brand-rule" aria-hidden="true" />
          <span className="brand-mnu">MNU</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <div key={item.label} className="nav-item">
              <Link
                href={item.href}
                className="nav-link"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.label}
                <ChevronDown className="nav-chevron" size={14} />
              </Link>
              {activeDropdown === item.label && (
                <div 
                  className="nav-dropdown" 
                  onMouseEnter={() => setActiveDropdown(item.label)} 
                  onMouseLeave={() => setActiveDropdown(null)}
                  role="menu"
                >
                  {item.children.map((child) => (
                    <Link 
                      key={child.label} 
                      href={child.href} 
                      className="nav-dropdown-link"
                      role="menuitem"
                    >
                      <span className="nav-dropdown-label">{child.label}</span>
                      <span className="nav-dropdown-desc">{child.description}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="search-btn" aria-label="Search">
            <Search size={16} />
            <span>Search</span>
          </button>
          <button className="language-btn" aria-label="Change language">
            عربي
          </button>
          <Button variant="primary" asChild>
            <Link href="/join">Join MCC <ArrowUpRight size={15} /></Link>
          </Button>
          <button className="menu-btn" aria-label="Open navigation" onClick={() => setMobileOpen(true)}>
            <Menu size={21} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-panel" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="mobile-panel-head">
            <strong>MCC MNU</strong>
            <button className="menu-btn" aria-label="Close navigation" onClick={() => setMobileOpen(false)}>
              <X size={22} />
            </button>
          </div>
          {navigation.map((item) => (
            <div key={item.label} className="mobile-nav-section">
              <Link href={item.href} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                {item.label}
                <ChevronDown size={16} />
              </Link>
              <div className="mobile-nav-sublinks">
                {item.children.map((child) => (
                  <Link key={child.label} href={child.href} className="mobile-nav-sublink" onClick={() => setMobileOpen(false)}>
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Button variant="primary" className="mobile-join" asChild onClick={() => setMobileOpen(false)}>
            <Link href="/join">Join MCC <ArrowUpRight size={15} /></Link>
          </Button>
        </div>
      )}
    </header>
  );
}