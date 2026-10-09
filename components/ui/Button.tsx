"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { ArrowRight, ArrowLeft, ExternalLink, ChevronDown } from "lucide-react";
import { ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  withArrow?: boolean;
  arrowDirection?: "right" | "left";
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", withArrow = false, arrowDirection = "right", asChild = false, children, className = "", disabled, style, ...props }, ref) => {
    const baseClasses = "btn";
    const variantClasses = `btn-${variant}`;
    const sizeClasses = size !== "md" ? `btn-${size}` : "";

    const ArrowIcon = arrowDirection === "left" ? ArrowLeft : ArrowRight;

    const renderContent = () => (
      <>
        {children}
        {withArrow && <ArrowIcon className="arrow-icon" size={size === "sm" ? 14 : size === "lg" ? 20 : 17} />}
      </>
    );

    if (asChild) {
      return (
        <button
          ref={ref}
          className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()}
          disabled={disabled}
          style={style}
          {...props}
        >
          {renderContent()}
        </button>
      );
    }

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()}
        disabled={disabled}
        style={style}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

Button.displayName = "Button";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: "ghost" | "outline" | "primary";
  size?: "sm" | "md";
}

export function IconButton({ icon, label, variant = "ghost", size = "md", className = "", ...props }: IconButtonProps) {
  return (
    <Button variant={variant} size={size} className={`${className} icon-btn`.trim()} aria-label={label} {...props}>
      {icon}
      <span className="visually-hidden">{label}</span>
    </Button>
  );
}

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ButtonGroup({ children, className = "" }: ButtonGroupProps) {
  return <div className={`btn-group ${className}`.trim()}>{children}</div>;
}