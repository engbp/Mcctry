import { ReactNode, HTMLAttributes, ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
import { CardLink } from "./Links";
import { ArrowRight } from "lucide-react";
import { Badge } from "./Badge";

type LucideIcon = ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>>;

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "dark" | "featured" | "outline" | "elevated";
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "article" | "section";
}

export function Card({ 
  children, 
  variant = "default", 
  className = "", 
  hover = true, 
  padding = "md",
  as: Component = "div",
  style,
  role,
  ...props
}: CardProps) {
  const variantClasses = {
    default: "card",
    dark: "card-dark",
    featured: "card card-featured",
    outline: "card card-outline",
    elevated: "card card-elevated",
  };

  const paddingClasses = {
    none: "",
    sm: "p-sm",
    md: "p-md",
    lg: "p-lg",
  };

  const hoverClass = hover ? "card-hover" : "";

  return (
    <Component className={`${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClass} ${className}`.trim()} style={style} role={role} {...props}>
      {children}
    </Component>
  );
}

interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "21/9";
  overlay?: ReactNode;
}

export function CardMedia({ children, className = "", aspectRatio = "16/9", overlay, style, ...props }: CardMediaProps) {
  return (
    <div className={`card-media ${className}`.trim()} style={{ aspectRatio, ...style }} {...props}>
      {children}
      {overlay && <div className="card-media-overlay">{overlay}</div>}
    </div>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "", style, ...props }: CardContentProps) {
  return <div className={`card-content ${className}`.trim()} style={style} {...props}>{children}</div>;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "", style, ...props }: CardFooterProps) {
  return <div className={`card-footer ${className}`.trim()} style={style} {...props}>{children}</div>;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "", style, ...props }: CardHeaderProps) {
  return <div className={`card-header ${className}`.trim()} style={style} {...props}>{children}</div>;
}

interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  number?: string;
  label?: string;
  title: string;
  description?: string;
  meta?: string | ReactNode;
  href?: string;
  accent?: boolean;
  icon?: ReactNode;
  image?: ReactNode;
  className?: string;
  actionLabel?: string;
}

export function FeatureCard({ 
  number, 
  label, 
  title, 
  description, 
  meta, 
  href, 
  accent = false, 
  icon, 
  image,
  className = "",
  actionLabel = "Explore",
  style,
  role,
  ...props
}: FeatureCardProps) {
  const content = (
    <article className="feature-card">
      {number && <span className="feature-card-number">{number}</span>}
      {image && <div className="feature-card-media">{image}</div>}
      {icon && <div className="feature-card-icon" aria-hidden="true">{icon}</div>}
      <div className="feature-card-body">
        {label && <span className="feature-card-label">{label}</span>}
        <h3 className="feature-card-title">{title}</h3>
        {description && <p className="feature-card-description">{description}</p>}
        {meta && <div className="feature-card-meta">{meta}</div>}
      </div>
      {href && (
        <div className="feature-card-action">
          <CardLink href={href}>
            <span>{actionLabel}</span>
            <ArrowRight className="arrow-icon" size={16} />
          </CardLink>
        </div>
      )}
    </article>
  );

  if (href) {
    return <CardLink href={href} className={`${accent ? "feature-card-accent" : ""} ${className}`.trim()} style={style} {...props}>{content}</CardLink>;
  }

  return <Card variant={accent ? "dark" : "default"} className={`${accent ? "feature-card-accent" : ""} ${className}`.trim()} style={style} role={role} {...props}>{content}</Card>;
}

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: ReactNode | LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
  variant?: "default" | "dark" | "accent";
}

export function StatCard({ label, value, icon, trend, className = "", variant = "default", style, role, ...props }: StatCardProps) {
  const variantClasses = {
    default: "stat-card",
    dark: "stat-card stat-card-dark",
    accent: "stat-card stat-card-accent",
  };

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === "function") {
      // It's a Lucide icon component
      const IconComponent = icon as React.ComponentType<{ size?: number }>;
      return <div className="stat-icon" aria-hidden="true" style={{ width: "40px", height: "40px", background: "var(--mcc-blue)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mcc-white)" }}><IconComponent size={20} /></div>;
    }
    return <div className="stat-icon" aria-hidden="true" style={{ width: "40px", height: "40px", background: "var(--mcc-blue)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mcc-white)" }}>{icon}</div>;
  };

  return (
    <Card variant="default" className={`${variantClasses[variant]} ${className}`.trim()} style={style} role={role} {...props}>
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <span className="micro" style={{ color: "var(--mcc-text-light)" }}>{label}</span>
          {renderIcon()}
        </div>
        <strong style={{ fontSize: "36px", fontWeight: 700, display: "block", lineHeight: 1 }}>{value}</strong>
        {trend && (
          <p className="body-sm" style={{ 
            color: trend.positive ? "var(--mcc-accent-green)" : "var(--mcc-accent-red)", 
            marginTop: "4px",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
            {trend.positive ? "▲" : "▼"} {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface MediaCardProps extends HTMLAttributes<HTMLDivElement> {
  image: ReactNode;
  category: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  href?: string;
  tags?: string[];
  className?: string;
  featured?: boolean;
}

export function MediaCard({ 
  image, 
  category, 
  title, 
  description, 
  meta, 
  href, 
  tags = [],
  className = "",
  featured = false,
  style,
  role,
  ...props
}: MediaCardProps) {
  const content = (
    <article className={`media-card ${featured ? "media-card-featured" : ""}`}>
      <div className="media-card-media" aria-hidden="true">
        {image}
        <div className="media-card-category">{category}</div>
        {featured && <Badge variant="featured" className="media-card-badge">Featured</Badge>}
      </div>
      <div className="media-card-body">
        {tags.length > 0 && (
          <div className="media-card-tags" style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {tags.map((tag) => <Badge key={tag} variant="blue" size="sm">{tag}</Badge>)}
          </div>
        )}
        <h3 className="media-card-title">{title}</h3>
        {description && <p className="media-card-description">{description}</p>}
        {meta && <div className="media-card-meta">{meta}</div>}
      </div>
      {href && (
        <div className="media-card-action">
          <CardLink href={href} className="text-link">
            View Details <ArrowRight size={14} />
          </CardLink>
        </div>
      )}
    </article>
  );

  if (href) {
    return <CardLink href={href} className={className} style={style} {...props}>{content}</CardLink>;
  }

  return <Card variant="default" className={className} style={style} role={role} {...props}>{content}</Card>;
}