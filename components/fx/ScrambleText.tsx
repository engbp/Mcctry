"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

const GLYPHS = "!<>-_/[]{}=+*^?#01";

type ScrambleTextProps = {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p" | "div";
  className?: string;
  delay?: number;
};

export function ScrambleText({ text, as = "span", className = "", delay = 0 }: ScrambleTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let raf = 0;
    let started = false;

    const run = () => {
      const start = performance.now();
      const duration = 640;
      const scrambleWindow = 4;
      const step = (now: number) => {
        const p = Math.min(1, (now - start - delay) / duration);
        if (p < 0) {
          raf = requestAnimationFrame(step);
          return;
        }
        const revealAt = p * (text.length + scrambleWindow);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const local = revealAt - i;
          if (local <= 0 || local >= scrambleWindow) {
            out += text[i];
          } else {
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
        setDisplay(p >= 1 ? text : out);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced, text, delay]);

  const Tag = as;
  return (
    <Tag ref={ref as never} className={`scramble-text${className ? ` ${className}` : ""}`}>
      {display}
    </Tag>
  );
}
