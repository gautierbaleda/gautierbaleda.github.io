"use client";
import { useEffect, useState } from "react";

export function useTypingEffect(
  words: string[],
  opts: { typeSpeedMs?: number; pauseMs?: number } = {}
): string {
  const { typeSpeedMs = 70, pauseMs = 1400 } = opts;
  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const word = words[wordIndex % words.length];
    if (charCount < word.length) {
      const t = setTimeout(() => setCharCount((c) => c + 1), typeSpeedMs);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCharCount(0);
      setWordIndex((i) => i + 1);
    }, pauseMs);
    return () => clearTimeout(t);
  }, [charCount, wordIndex, words, typeSpeedMs, pauseMs]);

  return words[wordIndex % words.length].slice(0, charCount);
}
