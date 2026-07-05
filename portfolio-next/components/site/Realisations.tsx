"use client";
import { useState } from "react";
import { projects, type Project } from "@/content/projects";

export function Realisations() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section className="rounded-[20px] px-12 py-10">
      <div className="mb-10">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-accent">
          MES RÉALISATIONS
        </p>
        <h2 className="text-2xl font-bold text-ink">Projets &amp; Use case</h2>
      </div>

      <div className="flex items-stretch gap-14">
        <div className="relative flex-[0_0_44%] overflow-hidden rounded-2xl bg-[#F5F5F7]">
          {active ? (
            <div
              className="flex h-full flex-col items-center justify-center p-10 text-center"
              style={{ background: active.bg, color: active.textColor }}
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] opacity-45">
                {active.name}
              </p>
              <p className="text-2xl font-extrabold leading-tight tracking-tight">
                {active.longName}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {active.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <p className="text-sm font-semibold text-[#8E8E93]">En attente…</p>
              <p className="text-xs text-[#B8B8BE]">Survole un projet</p>
            </div>
          )}
        </div>

        <div className="flex-1">
          {projects.map((p) => (
            <div key={p.slug}>
              <a
                href={`/projets/${p.slug}`}
                data-testid={`project-row-${p.slug}`}
                onMouseEnter={() => setActive(p)}
                onMouseLeave={() => setActive(null)}
                className="flex items-center gap-5 rounded-2xl px-4 py-[22px] hover:bg-black/[0.03]"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1.5 text-[17px] font-bold text-ink">{p.longName}</h3>
                  <p className="text-[13px] leading-relaxed text-muted-2">{p.description}</p>
                </div>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFC800" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
              <div className="mx-4 h-px bg-hairline" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
