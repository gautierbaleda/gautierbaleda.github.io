"use client";
import { useEffect, useState } from "react";

export function ProjectDetailReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
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
    // Le conteneur coupe le contenu tant qu'il est hors écran : sans lui, les
    // navigateurs mobiles élargissent la fenêtre pour l'englober (dézoom).
    <div className="overflow-x-clip">
      <div className={`project-detail-reveal ${visible ? "project-detail-reveal-visible" : ""} ${className}`}>
        {children}
      </div>
    </div>
  );
}
