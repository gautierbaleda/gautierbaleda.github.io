"use client";
import { useState } from "react";
import { useTiltHover } from "@/lib/useTiltHover";

export function PlaygroundCard({
  tool,
  title,
  description,
  front,
  span,
  dark = false,
  bg,
}: {
  tool: string;
  title: string;
  description: string;
  front: React.ReactNode;
  span: 1 | 2;
  dark?: boolean;
  bg?: string;
}) {
  const { style, onMouseMove, onMouseLeave } = useTiltHover(8);
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      data-testid={`playground-card-${title}`}
      className={`relative h-[300px] cursor-pointer rounded-2xl ${span === 2 ? "col-span-2" : ""}`}
      style={{ ...style, transition: "transform 0.1s ease", cursor: "pointer" }}
      onMouseMove={(e) => {
        onMouseMove(e);
        setFlipped(true);
      }}
      onMouseLeave={() => {
        onMouseLeave();
        setFlipped(false);
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl transition-transform duration-500"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: flipped ? 0 : 1, background: bg }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-200"
          style={{
            transform: "rotateY(180deg)",
            background: dark ? "#1D1D1F" : undefined,
            opacity: flipped ? 1 : 0,
          }}
        >
          <span className={`mb-2 text-[11px] font-bold uppercase tracking-[0.12em] ${dark ? "text-white/45" : "text-black/40"}`}>
            {tool}
          </span>
          <h3 className={`mb-2 text-2xl font-extrabold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
            {title}
          </h3>
          <p className={`mb-5 text-sm leading-relaxed ${dark ? "text-white/70" : "text-black/60"}`}>
            {description}
          </p>
          <div className={`inline-flex items-center gap-1.5 text-sm font-bold ${dark ? "text-white" : "text-ink"}`}>
            Tester l&apos;app →
          </div>
        </div>
      </div>
    </div>
  );
}
