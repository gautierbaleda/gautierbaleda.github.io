"use client";
import { useState } from "react";

export function ProjectCarousel({
  screenshotsCount,
  bg,
}: {
  screenshotsCount: number;
  bg: string;
}) {
  const [idx, setIdx] = useState(0);

  const goTo = (next: number) => {
    setIdx(((next % screenshotsCount) + screenshotsCount) % screenshotsCount);
  };

  return (
    <div className="relative h-[320px] overflow-hidden rounded-2xl" style={{ background: "#F7F5F0" }}>
      {Array.from({ length: screenshotsCount }, (_, i) => (
        <div
          key={i}
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-[400ms]"
          style={{ opacity: i === idx ? 1 : 0, pointerEvents: i === idx ? "auto" : "none", background: bg }}
        >
          <span className="text-sm font-semibold text-white/70">Capture {i + 1}</span>
        </div>
      ))}

      <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white">
        {idx + 1} / {screenshotsCount}
      </span>

      <button
        type="button"
        aria-label="Précédent"
        onClick={() => goTo(idx - 1)}
        className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg"
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Suivant"
        onClick={() => goTo(idx + 1)}
        className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg"
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {Array.from({ length: screenshotsCount }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Capture ${i + 1}`}
            onClick={() => goTo(i)}
            className="h-2 rounded-full transition-all"
            style={{
              width: i === idx ? 20 : 8,
              background: i === idx ? "#1D1D1F" : "rgba(29,29,31,0.25)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
