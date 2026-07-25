"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { type ProjectSummary } from "@/content/projects";

export function Realisations({ projects }: { projects: ProjectSummary[] }) {
  const [active, setActive] = useState<ProjectSummary | null>(null);

  const [wrapperEl, setStickyWrapper] = useState<HTMLDivElement | null>(null);
  const [listContainerEl, setListContainer] = useState<HTMLDivElement | null>(null);
  const [listInnerEl, setListInner] = useState<HTMLDivElement | null>(null);

  const overflowRef = useRef(0);
  const wrapperAbsTopRef = useRef(0);

  const updateStickyLayout = useCallback(() => {
    if (!wrapperEl || !listContainerEl || !listInnerEl) return;
    const innerH = listInnerEl.scrollHeight;
    const containerH = listContainerEl.clientHeight;
    const overflow = Math.max(0, innerH - containerH);
    overflowRef.current = overflow;
    wrapperEl.style.height = `calc(100vh - 116px + ${overflow}px)`;
    wrapperAbsTopRef.current = wrapperEl.getBoundingClientRect().top + window.scrollY;
  }, [wrapperEl, listContainerEl, listInnerEl]);

  const updateListScroll = useCallback(() => {
    if (!overflowRef.current || !listInnerEl) return;
    const progress = Math.min(
      overflowRef.current,
      Math.max(0, window.scrollY - (wrapperAbsTopRef.current - 100))
    );
    listInnerEl.style.transform = `translateY(-${progress}px)`;
  }, [listInnerEl]);

  useEffect(() => {
    if (!wrapperEl || !listContainerEl || !listInnerEl) return;

    updateStickyLayout();
    const timeout = setTimeout(updateStickyLayout, 200);

    window.addEventListener("resize", updateStickyLayout);
    window.addEventListener("scroll", updateListScroll, { passive: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateStickyLayout);
      window.removeEventListener("scroll", updateListScroll);
    };
  }, [wrapperEl, listContainerEl, listInnerEl, updateStickyLayout, updateListScroll]);

  return (
    <div id="projets" ref={setStickyWrapper}>
      <section
        className="sticky-section rounded-[20px] px-12 py-10"
        style={{
          position: "sticky",
          top: 100,
          height: "calc(100vh - 116px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div className="mb-10">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-accent">
            MES RÉALISATIONS
          </p>
          <h2 className="text-2xl font-bold text-ink">Projets &amp; Use case</h2>
        </div>

        <div className="flex flex-1 items-stretch gap-14" style={{ minHeight: 0 }}>
          <div className="relative flex-[0_0_44%] overflow-hidden rounded-2xl bg-[#F5F5F7]">
            {active ? (
              active.hoverImage ? (
                <>
                  <Image
                    src={active.hoverImage}
                    alt={active.longName}
                    fill
                    sizes="44vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 flex flex-col items-center p-10 pt-24 text-center text-white"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
                    }}
                  >
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] opacity-70">
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
                </>
              ) : (
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
              )
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <div className="umbreon-walker" />
                <p className="text-sm font-semibold text-[#8E8E93]">En attente…</p>
                <p className="text-xs text-[#B8B8BE]">Survole un projet</p>
              </div>
            )}
          </div>

          <div
            className="sticky-list-panel flex-1 overflow-hidden"
            ref={setListContainer}
            style={{ minHeight: 0 }}
          >
            <div ref={setListInner} style={{ willChange: "transform" }}>
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
        </div>
      </section>
    </div>
  );
}
