"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

type RevealProps = React.HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "article" | "span" | "li" | "ul" | "header" | "a";
  children?: React.ReactNode;
  delay?: number;
  href?: string;
};

export function Reveal({ as = "div", className = "", delay = 0, children, style, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      setVisible(true);
      return;
    }
    let io: IntersectionObserver | null = null;
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      if (io) io.disconnect();
      window.removeEventListener("scroll", check);
      setVisible(true);
    };
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) reveal();
    };
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            return;
          }
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => {
      if (io) io.disconnect();
      window.removeEventListener("scroll", check);
    };
  }, [reduced]);

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ ...(delay ? { transitionDelay: `${delay}ms` } : null), ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
