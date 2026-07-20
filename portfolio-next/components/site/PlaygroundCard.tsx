"use client";
import { useState } from "react";
import type { DocumentElement } from "@keystatic/core";
import { useTiltHover } from "@/lib/useTiltHover";
import { PlaygroundDetailDialog } from "./PlaygroundDetailDialog";

export function PlaygroundCard({
  tool,
  tools,
  title,
  description,
  descriptionLongue,
  image,
  githubUrl,
  externalUrl,
  front,
  dark = false,
  bg,
}: {
  tool: string;
  tools: string[];
  title: string;
  description: string;
  descriptionLongue: DocumentElement[];
  image: string | null;
  githubUrl: string;
  externalUrl: string;
  front: React.ReactNode;
  dark?: boolean;
  bg?: string;
}) {
  const { style, onMouseMove, onMouseLeave } = useTiltHover(8);
  const [flipped, setFlipped] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div
      data-testid={`playground-card-${title}`}
      className="relative aspect-square w-full cursor-pointer rounded-2xl"
      style={{ ...style, transition: "transform 0.1s ease", cursor: "pointer" }}
      onMouseMove={(e) => {
        onMouseMove(e);
        setFlipped(true);
      }}
      onMouseLeave={() => {
        onMouseLeave();
        setFlipped(false);
      }}
      onClick={() => setOpen(true)}
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
      <PlaygroundDetailDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        tools={tools}
        image={image}
        bg={bg ?? "#F7F5F0"}
        descriptionLongue={descriptionLongue}
        githubUrl={githubUrl}
        externalUrl={externalUrl}
      />
    </div>
  );
}
