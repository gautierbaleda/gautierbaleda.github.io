"use client";
import { useTypingEffect } from "@/lib/useTypingEffect";
import { HeroCard } from "./HeroCard";

const CARDS: { variant: "bricks" | "code" | "gears" | "rocket"; label: string }[] = [
  { variant: "bricks", label: "Concevoir" },
  { variant: "code", label: "Développer" },
  { variant: "gears", label: "Automatiser" },
  { variant: "rocket", label: "Déployer" },
];

export function Hero() {
  const typed = useTypingEffect(["Hello world 👋"], { typeSpeedMs: 60, pauseMs: 4000 });

  return (
    <section className="flex min-h-[calc(100vh-148px)] flex-col items-center justify-center rounded-[20px] px-16 py-10 pb-[72px] text-center">
      <p className="mb-4 min-h-[1.6em] font-mono text-lg font-medium uppercase tracking-[0.07em] text-muted-2">
        {typed}
        <span className="animate-[cursorBlink_1s_step-start_infinite]">|</span>
      </p>

      <h1 className="mb-16 text-[116px] font-extrabold leading-[0.95] tracking-tight text-accent">
        Gautier Baleda
      </h1>

      <div className="mb-[72px] flex items-center justify-center py-[30px]">
        {CARDS.map((c) => (
          <HeroCard key={c.variant} variant={c.variant} label={c.label} />
        ))}
      </div>

      <h2 className="mb-[22px] text-[90px] font-extrabold leading-none tracking-tight text-ink">
        Product Builder
      </h2>
      <p className="mb-10 text-[19px] text-muted-2">Je construis des outils sur mesure</p>
    </section>
  );
}
