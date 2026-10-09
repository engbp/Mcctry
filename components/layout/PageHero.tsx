import { ReactNode, HTMLAttributes } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge, Kicker } from "@/components/ui/Badge";
import { TextLink } from "@/components/ui/Links";

interface PageHeroProps extends HTMLAttributes<HTMLElement> {
  label: string;
  title: string;
  lede?: string;
  badge?: string;
  badgeVariant?: "blue" | "cyan" | "navy" | "demo" | "featured" | "success" | "warning";
  visual?: ReactNode;
  kicker?: string;
  kickerLineColor?: string;
  className?: string;
  number?: string;
}

export function PageHero({ 
  label, 
  title, 
  lede, 
  badge, 
  badgeVariant = "blue", 
  visual, 
  kicker,
  kickerLineColor,
  className = "",
  number
}: PageHeroProps) {
  return (
    <header className={`page-hero ${className}`.trim()}>
      <div className="page-hero-copy">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">{label}</span>
        </nav>
        {kicker && <Kicker lineColor={kickerLineColor}>{kicker}</Kicker>}
        {badge && <Badge variant={badgeVariant} style={{ marginTop: "16px", display: "inline-block" }}>{badge}</Badge>}
        {number && <span className="page-hero-number">{number}</span>}
        <h1 className="page-title">{title}</h1>
        {lede && <p className="page-lede">{lede}</p>}
      </div>
      {visual && <div className="page-visual" aria-hidden="true">{visual}</div>}
    </header>
  );
}

interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  number?: string;
  label: string;
  title: string;
  action?: ReactNode;
  className?: string;
  dark?: boolean;
  divider?: boolean;
}

export function SectionHeader({ number, label, title, action, className = "", dark = false, divider = true, style, ...props }: SectionHeaderProps) {
  return (
    <div className={`section-header ${dark ? "section-header-dark" : ""} ${className}`.trim()}>
      <div className="section-header-content">
        {number && <span className="editorial-mark">{number}</span>}
        <span className={dark ? "section-label-light" : "section-label"}>{label}</span>
        <h2 className={dark ? "heading-lg text-inverse" : "heading-lg"}>{title}</h2>
      </div>
      {action && <div className="section-header-action">{action}</div>}
      {divider && <hr className={`section-divider ${dark ? "divider-dark" : ""}`} aria-hidden="true" />}
    </div>
  );
}

interface HeroVisualProps {
  children: ReactNode;
  className?: string;
  aspectRatio?: string;
}

export function HeroVisual({ children, className = "", aspectRatio }: HeroVisualProps) {
  return (
    <div className={`hero-visual ${className}`.trim()} style={{ aspectRatio }} aria-hidden="true">
      {children}
    </div>
  );
}

interface PosterVisualProps {
  children: ReactNode;
  className?: string;
}

export function PosterVisual({ children, className = "" }: PosterVisualProps) {
  return (
    <div className={`poster-visual ${className}`.trim()} aria-hidden="true">
      {children}
    </div>
  );
}