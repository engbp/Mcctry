"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

type MagneticButtonProps = {
  children: React.ReactNode;
  className?: string;
  strength?: { x: number; y: number };
};

export function MagneticButton({ children, className = "", strength = { x: 0.25, y: 0.4 } }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let raf = 0;
    let curX = 0;
    let curY = 0;
    let targetX = 0;
    let targetY = 0;

    const animate = () => {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
      if (Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1) {
        raf = requestAnimationFrame(animate);
      } else {
        raf = 0;
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(animate);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      targetX = dx * strength.x;
      targetY = dy * strength.y;
      kick();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      kick();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced, strength.x, strength.y]);

  return (
    <div ref={ref} className={`magnetic-wrap${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
