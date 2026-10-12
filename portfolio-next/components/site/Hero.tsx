"use client";
import { useEffect, useState } from "react";
import { useTypingEffect } from "@/lib/useTypingEffect";
import { HeroCard } from "./HeroCard";

const CARDS: { variant: "bricks" | "code" | "gears" | "rocket"; label: string }[] = [
  { variant: "bricks", label: "Concevoir" },
  { variant: "code", label: "Développer" },
  { variant: "gears", label: "Automatiser" },
  { variant: "rocket", label: "Déployer" },
];

const GREETINGS = [
  "HELLO WORLD...",
  "BONJOUR LE MONDE...",
  "MANAO AHOANA DAHOLO...",
  "HELLO WORLD ! JE SUIS",
];

export function Hero() {
  const { text: typed } = useTypingEffect(GREETINGS, { typeSpeedMs: 60 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Double rAF: a single rAF can fire before the browser paints the
    // initial (invisible) state, so the fade-in transition never renders.
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
    <section
      className={`hero-section flex min-h-[calc(100svh-112px)] flex-col items-center justify-center rounded-[20px] px-0 py-10 pb-12 text-center sm:px-16 md:min-h-[calc(100vh-148px)] md:pb-[72px] ${
        visible ? "hero-visible" : ""
      }`}
    >
      <p className="hero-typing mb-4 min-h-[1.6em] font-mono text-sm font-medium sm:text-lg uppercase tracking-[0.07em] text-muted-2">
        {typed}
        <span className="animate-[cursorBlink_1s_step-start_infinite]">|</span>
      </p>

      <h1 className="hero-h1 mb-10 text-[56px] font-extrabold sm:mb-16 sm:text-7xl lg:text-8xl xl:text-[116px] leading-[0.95] tracking-tight text-accent">
        Gautier Baleda
      </h1>

      <div className="hero-cards-wrapper mb-12 flex items-center justify-center py-[30px] sm:mb-[72px]">
        {CARDS.map((c) => (
          <HeroCard key={c.variant} variant={c.variant} label={c.label} />
        ))}
      </div>

      <h2 className="hero-h2 mb-[22px] text-[44px] font-extrabold sm:text-6xl lg:text-7xl xl:text-[90px] leading-none tracking-tight text-ink">
        Product Builder
      </h2>
      <p className="hero-subtitle mb-10 text-base sm:text-[19px] text-muted-2">Je construis des outils sur mesure</p>
    </section>
  );
}
