import { ReactNode, HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "blue" | "cyan" | "navy" | "demo" | "featured" | "success" | "warning" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
  dot?: boolean;
  dotColor?: string;
}

export function Badge({ 
  children, 
  variant = "default", 
  size = "md", 
  className = "", 
  dot = false,
  dotColor,
  style,
  ...props
}: BadgeProps) {
  const variantClasses = {
    blue: "badge-blue",
    cyan: "badge-cyan",
    navy: "badge-navy",
    demo: "badge-demo",
    featured: "badge-featured",
    success: "badge-success",
    warning: "badge-warning",
    default: "",
  };

  const sizeClasses = {
    sm: "badge-sm",
    md: "",
    lg: "badge-lg",
  };

  const dotStyle = dotColor ? { "--dot-color": dotColor } : {};

  return (
    <span className={`badge ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()} style={{ ...dotStyle, ...style }} {...props}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

interface KickerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  lineColor?: string;
}

export function Kicker({ children, className = "", lineColor, style, ...props }: KickerProps) {
  const lineStyle = lineColor ? { "--kicker-line-color": lineColor } : {};

  return (
    <div className={`kicker ${className}`.trim()} style={{ ...lineStyle, ...style }} {...props}>
      <span className="kicker-line" aria-hidden="true" />
      {children}
    </div>
  );
}

interface TagProps {
  children: ReactNode;
  className?: string;
  removable?: boolean;
  onRemove?: () => void;
}

export function Tag({ children, className = "", removable = false, onRemove }: TagProps) {
  return (
    <span className={`tag ${className}`.trim()}>
      {children}
      {removable && (
        <button type="button" className="tag-remove" onClick={onRemove} aria-label="Remove tag">
          ×
        </button>
      )}
    </span>
  );
}