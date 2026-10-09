"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

type TypedTerminalProps = {
  lines: string[];
  label?: string;
  className?: string;
  speed?: number;
  loop?: boolean;
  showBar?: boolean;
};

export function TypedTerminal({
  lines,
  label = "visionlab.py",
  className = "",
  speed = 28,
  loop = true,
  showBar = true,
}: TypedTerminalProps) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState<string[]>(() => (reduced ? lines : []));
  const [done, setDone] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setShown(lines);
      setDone(true);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const run = () => {
      setShown([]);
      setDone(false);
      let lineIdx = 0;
      let charIdx = 0;

      const step = () => {
        if (cancelled) return;
        if (lineIdx >= lines.length) {
          setDone(true);
          if (loop) {
            timer = setTimeout(() => {
              if (!cancelled) run();
            }, 3200);
          }
          return;
        }
        charIdx++;
        const current = lines[lineIdx].slice(0, charIdx);
        setShown((prev) => {
          const next = prev.slice(0, lineIdx);
          next.push(current);
          return next;
        });
        if (charIdx >= lines[lineIdx].length) {
          lineIdx++;
          charIdx = 0;
          timer = setTimeout(step, 260);
        } else {
          timer = setTimeout(step, speed);
        }
      };
      timer = setTimeout(step, 500);
    };

      run();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [reduced]);

  const fullText = lines.join("\n");

  return (
    <div className={`term${className ? ` ${className}` : ""}`} aria-label={fullText}>
      {showBar ? (
        <div className="term-bar" aria-hidden="true">
          <span className="term-dot term-dot-r" />
          <span className="term-dot term-dot-y" />
          <span className="term-dot term-dot-g" />
          <span className="term-name">{label}</span>
        </div>
      ) : null}
      <pre className="term-body" aria-hidden="true">
        {shown.map((line, i) => (
          <div key={i} className="term-line">
            <span className="term-prompt">$</span>
            {line}
            {i === shown.length - 1 && !done ? <span className="term-caret" /> : null}
          </div>
        ))}
        {shown.length === 0 ? <div className="term-line">&nbsp;</div> : null}
        {done ? <span className="term-caret term-caret-idle" /> : null}
      </pre>
    </div>
  );
}
