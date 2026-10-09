import { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ScrambleText } from "@/components/fx/ScrambleText";
import { Reveal } from "@/components/fx/Reveal";

interface Crumb {
  label: string;
  href?: string;
}

interface BandHeroProps {
  crumbs: Crumb[];
  kicker: string;
  title: string;
  lede?: string;
  meta?: ReactNode;
  color?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

export function BandHero({ crumbs, kicker, title, lede, meta, color = "#0078d4", icon, actions, children }: BandHeroProps) {
  return (
    <header className="band-hero" style={{ "--band-color": color } as React.CSSProperties}>
      <div className="band-hero-bg" aria-hidden="true">
        <span className="band-hero-orb band-hero-orb-a" />
        <span className="band-hero-orb band-hero-orb-b" />
        <span className="band-hero-grid" />
      </div>
      <div className="container band-hero-inner">
        <Reveal className="band-hero-copy">
          <nav className="breadcrumbs band-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            {crumbs.map((crumb, i) => (
              <span key={crumb.label} aria-current={i === crumbs.length - 1 ? "page" : undefined}>
                {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
                {i < crumbs.length - 1 && <ChevronRight size={14} aria-hidden="true" style={{ marginLeft: 8, display: "inline" }} />}
              </span>
            ))}
          </nav>
          <span className="band-hero-kicker">{kicker}</span>
          <ScrambleText as="h1" className="band-hero-title" text={title} />
          {lede && <p className="band-hero-lede">{lede}</p>}
          {meta && <div className="band-hero-meta">{meta}</div>}
          {actions && <div className="band-hero-actions">{actions}</div>}
        </Reveal>
        {(icon || children) && (
          <div className="band-hero-visual" aria-hidden="true">
            {children ?? (
              <span className="band-hero-icon">{icon}</span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
