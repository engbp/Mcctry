"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
};

const COLORS = ["rgba(79, 195, 247, 0.6)", "rgba(0, 164, 239, 0.55)", "rgba(154, 165, 190, 0.4)"];

export function ParticleBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;
    let pointerX = -9999;
    let pointerY = -9999;
    let hasPointer = false;

    const seed = () => {
      const count = Math.min(130, Math.floor((width * height) / 14000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) drawFrame(false);
    };

    const drawFrame = (advance: boolean) => {
      ctx.clearRect(0, 0, width, height);

      if (advance) {
        for (const p of particles) {
          if (hasPointer) {
            const dx = p.x - pointerX;
            const dy = p.y - pointerY;
            const distSq = dx * dx + dy * dy;
            if (distSq < 28900 && distSq > 0.01) {
              const dist = Math.sqrt(distSq);
              const force = (170 - dist) / 170;
              p.vx += (dx / dist) * force * 0.12;
              p.vy += (dy / dist) * force * 0.12;
            }
          }
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.992;
          p.vy *= 0.992;
          if (p.vx < -0.05 && p.vx > -0.35) p.vx = -0.35;
          if (p.vx < 0.35 && p.vx > 0.05) p.vx = 0.35;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 16000) {
            const alpha = 0.14 * (1 - distSq / 16000);
            ctx.strokeStyle = `rgba(79, 195, 247, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      if (!running) return;
      drawFrame(true);
      raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      hasPointer = true;
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduced) raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return <canvas ref={ref} className="fx-particles" aria-hidden="true" />;
}
