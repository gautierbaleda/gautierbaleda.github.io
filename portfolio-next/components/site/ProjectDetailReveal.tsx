"use client";
import { useEffect, useState } from "react";

export function ProjectDetailReveal({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Double rAF: a single rAF can fire before the browser paints the
    // initial (off-screen) state, so the slide-in transition never renders.
    let innerId = 0;
    const outerId = requestAnimationFrame(() => {
      innerId = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(outerId);
      cancelAnimationFrame(innerId);
    };
  }, []);

  return (
    <div className={`project-detail-reveal ${visible ? "project-detail-reveal-visible" : ""}`}>
      {children}
    </div>
  );
}
