"use client";
import { useState } from "react";
import Image from "next/image";

export function ImageCarousel({ screenshots }: { screenshots: string[] }) {
  const [idx, setIdx] = useState(0);
  const count = screenshots.length;

  const goTo = (next: number) => {
    setIdx(((next % count) + count) % count);
  };

  return (
    <div className="relative h-[320px]">
      {screenshots.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[400ms]"
          style={{ opacity: i === idx ? 1 : 0, pointerEvents: i === idx ? "auto" : "none" }}
        >
          <Image
            src={src}
            alt={`Capture ${i + 1}`}
            fill
            sizes="820px"
            className="rounded-2xl object-contain"
          />
        </div>
      ))}

      <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white">
        {idx + 1} / {count}
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
        {screenshots.map((src, i) => (
          <button
            key={src}
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
