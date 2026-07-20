"use client";

import { useCallback, useRef } from "react";

const GRID = 72;

const GLOW_POINTS: { gx: number; gy: number; phase: number }[] = [
  { gx: 3, gy: 2, phase: 0 },
  { gx: 8, gy: 5, phase: 1.4 },
  { gx: 14, gy: 3, phase: 2.7 },
  { gx: 5, gy: 9, phase: 0.8 },
  { gx: 11, gy: 8, phase: 3.2 },
  { gx: 17, gy: 7, phase: 1.1 },
  { gx: 2, gy: 13, phase: 2.0 },
  { gx: 7, gy: 15, phase: 0.3 },
  { gx: 13, gy: 12, phase: 4.1 },
  { gx: 18, gy: 14, phase: 1.9 },
  { gx: 4, gy: 18, phase: 3.6 },
  { gx: 10, gy: 17, phase: 0.6 },
  { gx: 16, gy: 19, phase: 2.3 },
  { gx: 6, gy: 22, phase: 1.7 },
  { gx: 12, gy: 21, phase: 3.9 },
  { gx: 19, gy: 11, phase: 0.2 },
  { gx: 1, gy: 7, phase: 2.8 },
  { gx: 15, gy: 16, phase: 1.3 },
];

export function SiteBackground() {
  const cleanupRef = useRef<() => void>(() => {});

  const setCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    cleanupRef.current();
    cleanupRef.current = () => {};

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let scrollY = window.scrollY;
    let rafId = 0;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      t++;

      const offsetY = -(scrollY * 0.12);

      ctx.save();
      ctx.strokeStyle = "rgba(29,29,31,0.07)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([]);
      const startY = offsetY % GRID;
      for (let x = 0; x < w; x += GRID) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = startY; y < h + GRID; y += GRID) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      GLOW_POINTS.forEach((p) => {
        const pulse = 0.3 + 0.25 * Math.sin(t * 0.025 + p.phase);
        const gx = p.gx * GRID;
        const gy = p.gy * GRID + offsetY;
        if (gy < -40 || gy > h + 40) return;

        const glowR = 55 + pulse * 45;
        const grd = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowR);
        grd.addColorStop(0, `rgba(255,200,0,${0.5 * pulse})`);
        grd.addColorStop(0.2, `rgba(255,200,0,${0.28 * pulse})`);
        grd.addColorStop(0.5, `rgba(255,200,0,${0.08 * pulse})`);
        grd.addColorStop(1, "rgba(255,200,0,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(gx, gy, glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,200,0,${0.35 + 0.25 * pulse})`;
        ctx.beginPath();
        ctx.arc(gx, gy, 1.5 + pulse * 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    cleanupRef.current = () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={setCanvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}
