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
  video,
  screenshots,
  githubUrl,
  externalUrl,
  front,
  bg,
}: {
  tool: string;
  tools: string[];
  title: string;
  description: string;
  descriptionLongue: DocumentElement[];
  image: string | null;
  video?: string | null;
  screenshots: string[];
  githubUrl: string;
  externalUrl: string;
  front: React.ReactNode;
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
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.22)",
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: flipped ? 0 : 1, background: bg }}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            front
          )}
          {/* Sans survol (tactile), le titre est affiché sur la face avant. */}
          <span
            data-title={title}
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/60 to-transparent px-3 pb-3 pt-8 text-left text-sm font-bold text-white before:content-[attr(data-title)] pointer-coarse:block"
          />
        </div>
        <div
          className="absolute inset-0 flex flex-col justify-end border border-black/5 p-4 transition-opacity duration-200 sm:p-6"
          style={{
            transform: "rotateY(180deg)",
            background: "#FFFFFF",
            opacity: flipped ? 1 : 0,
          }}
        >
          <span className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-black/40">
            {tool}
          </span>
          <h3 className="mb-2 text-lg font-extrabold tracking-tight text-ink sm:text-2xl">
            {title}
          </h3>
          <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-black/60">
            {description}
          </p>
          <div className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
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
        video={video ?? null}
        bg={bg ?? "#F7F5F0"}
        descriptionLongue={descriptionLongue}
        screenshots={screenshots}
        githubUrl={githubUrl}
        externalUrl={externalUrl}
      />
    </div>
  );
}
