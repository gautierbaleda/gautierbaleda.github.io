"use client";
import { useRef, useState } from "react";

export function useTiltHover(maxDeg = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    `perspective(800px) rotateX(0deg) rotateY(0deg)`
  );

  function onMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rotateY = (px - 0.5) * 2 * maxDeg;
    const rotateX = -(py - 0.5) * 2 * maxDeg;
    setTransform(
      `perspective(800px) rotateX(${rotateX.toFixed(0)}deg) rotateY(${rotateY.toFixed(0)}deg)`
    );
  }

  function onMouseLeave() {
    setTransform(`perspective(800px) rotateX(0deg) rotateY(0deg)`);
  }

  return { ref, style: { transform }, onMouseMove, onMouseLeave };
}
