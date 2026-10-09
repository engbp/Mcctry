import Link from "next/link";
import { ArrowRight, ArrowLeft, ExternalLink, ChevronRight } from "lucide-react";
import { ReactNode, AnchorHTMLAttributes } from "react";

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  variant?: "default" | "light" | "muted" | "inverse";
  withArrow?: boolean;
  arrowDirection?: "right" | "left";
  className?: string;
  external?: boolean;
  prefetch?: boolean;
  asChild?: boolean;
}

export function TextLink({ 
  href, 
  children, 
  variant = "default", 
  withArrow = true, 
  arrowDirection = "right", 
  className = "", 
  external = false, 
  prefetch = true,
  asChild = false,
  style,
  ...props
}: TextLinkProps) {
  const variantClasses = {
    default: "text-link",
    light: "text-link-light",
    muted: "text-link-muted",
    inverse: "text-link-inverse",
  };

  const ArrowIcon = arrowDirection === "left" ? ArrowLeft : ArrowRight;
  const LinkComponent = external ? "a" : Link;

  const content = (
    <>
      {children}
      {withArrow && (external ? <ExternalLink className="arrow-icon" size={14} /> : <ArrowIcon className="arrow-icon" size={16} />)}
    </>
  );

  const linkProps = {
    href,
    className: `${variantClasses[variant]} ${className}`.trim(),
    prefetch: external ? undefined : prefetch,
    target: external ? "_blank" : undefined,
    rel: external ? "noopener noreferrer" : undefined,
    style,
    ...props
  };

  if (asChild) {
    return <LinkComponent {...linkProps}>{content}</LinkComponent>;
  }

  return <LinkComponent {...linkProps}>{content}</LinkComponent>;
}

interface CardLinkProps {
  href?: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  external?: boolean;
  as?: "a" | "div";
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLDivElement>;
  [key: string]: unknown;
}

export function CardLink({ href, children, className = "", prefetch = true, external = false, style, as: Component = "a", onClick, ...props }: CardLinkProps) {
  const LinkComponent = external ? "a" : Link;
  
  // Extract href from props to avoid passing it to div
  const { href: _href, ...restProps } = props;
  
  const baseProps = {
    className: `card-link ${className}`.trim(),
    style,
    onClick,
    ...restProps
  };

  if (Component === "a") {
    return (
      <LinkComponent 
        href={href!} 
        prefetch={external ? undefined : prefetch}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...baseProps}
      >
        {children}
      </LinkComponent>
    );
  }

  return <div {...baseProps}>{children}</div>;
}

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  active?: boolean;
  className?: string;
}

export function NavLink({ href, children, active = false, className = "", ...props }: NavLinkProps) {
  return (
    <Link href={href} className={`nav-link ${active ? "active" : ""} ${className}`.trim()} {...props}>
      {children}
    </Link>
  );
}

interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`breadcrumbs ${className}`.trim()} aria-label="Breadcrumb">
      <ol style={{ display: "flex", alignItems: "center", gap: "8px", listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((item, index) => (
          <li key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {index > 0 && <ChevronRight size={14} aria-hidden="true" style={{ color: "var(--mcc-text-light)" }} />}
            {item.href ? (
              <Link href={item.href} style={{ fontSize: "13px", color: "var(--mcc-text-light)", fontWeight: 500 }}>{item.label}</Link>
            ) : (
              <span aria-current="page" style={{ fontSize: "13px", fontWeight: 600, color: "var(--mcc-text)" }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}