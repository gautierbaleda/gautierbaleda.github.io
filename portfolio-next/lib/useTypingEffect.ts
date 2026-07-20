"use client";
import { useEffect, useState } from "react";

type Mode = "typing" | "erasing";

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function useTypingEffect(
  phrases: string[],
  opts: {
    typeSpeedMs?: number;
    pauseMs?: number;
    eraseSpeedMs?: [number, number];
    eraseDelayMs?: number;
  } = {}
): { text: string; done: boolean } {
  const {
    typeSpeedMs = 70,
    pauseMs = 1100,
    eraseSpeedMs = [26, 46],
    eraseDelayMs = 320,
  } = opts;
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [mode, setMode] = useState<Mode>("typing");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const phrase = phrases[phraseIdx];

    if (mode === "typing") {
      if (charIdx < phrase.length) {
        const t = setTimeout(() => setCharIdx((c) => c + 1), typeSpeedMs);
        return () => clearTimeout(t);
      }
      if (phraseIdx === phrases.length - 1) {
        setDone(true);
        return;
      }
      const t = setTimeout(() => setMode("erasing"), pauseMs);
      return () => clearTimeout(t);
    }

    // mode === "erasing"
    if (charIdx > 0) {
      const t = setTimeout(
        () => setCharIdx((c) => c - 1),
        randomBetween(eraseSpeedMs[0], eraseSpeedMs[1])
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPhraseIdx((i) => i + 1);
      setMode("typing");
    }, eraseDelayMs);
    return () => clearTimeout(t);
  }, [phraseIdx, charIdx, mode, done, phrases, typeSpeedMs, pauseMs, eraseSpeedMs, eraseDelayMs]);

  return { text: phrases[phraseIdx].slice(0, charIdx), done };
}
