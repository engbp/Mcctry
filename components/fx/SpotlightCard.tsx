"use client";

import { useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

type SpotlightCardProps = {
  as?: "div" | "article" | "a" | "li" | "span";
  className?: string;
  children?: React.ReactNode;
  tilt?: boolean;
};

export function SpotlightCard({ as = "div", className = "", children, tilt = true }: SpotlightCardProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || reduced || e.pointerType !== "mouse" || !tilt) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--spot", "1");
    const rotY = (px - 0.5) * 12;
    const rotX = (0.5 - py) * 12;
    el.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.02)`;
  };

  const onPointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--spot", "0");
    el.style.removeProperty("transform");
    if (e.pointerType !== "mouse") return;
  };

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={`spot-card${className ? ` ${className}` : ""}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </Tag>
  );
}
