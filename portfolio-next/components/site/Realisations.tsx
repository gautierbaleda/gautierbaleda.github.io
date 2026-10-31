"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { type ProjectSummary } from "@/content/projects";
import { TechTag } from "@/components/site/TechTag";

const DESKTOP_QUERY = "(min-width: 1024px)";

function ProjectPreview({ project }: { project: ProjectSummary }) {
  if (project.hoverImage) {
    return (
      <>
        <Image
          src={project.hoverImage}
          alt={project.longName}
          fill
          sizes="(min-width: 1024px) 44vw, 100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center p-5 pt-12 text-center text-white lg:p-10 lg:pt-24"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
          }}
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] opacity-70 lg:mb-4">
            {project.name}
          </p>
          <p className="text-lg font-extrabold leading-tight tracking-tight lg:text-2xl">
            {project.longName}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 lg:mt-5">
            {project.tags.map((tag) => (
              <TechTag key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className="flex h-full flex-col items-center justify-center p-5 text-center lg:p-10"
      style={{ background: project.bg, color: project.textColor }}
    >
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] opacity-45 lg:mb-4">
        {project.name}
      </p>
      <p className="text-lg font-extrabold leading-tight tracking-tight lg:text-2xl">
        {project.longName}
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2 lg:mt-5">
        {project.tags.map((tag) => (
          <TechTag key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}

export function Realisations({ projects }: { projects: ProjectSummary[] }) {
  const [active, setActive] = useState<ProjectSummary | null>(null);

  const [wrapperEl, setStickyWrapper] = useState<HTMLDivElement | null>(null);
  const [sectionEl, setSection] = useState<HTMLElement | null>(null);
  const [listContainerEl, setListContainer] = useState<HTMLDivElement | null>(null);
  const [listInnerEl, setListInner] = useState<HTMLDivElement | null>(null);

  const overflowRef = useRef(0);
  const wrapperAbsTopRef = useRef(0);
  const stickyTopRef = useRef(0);

  const updateStickyLayout = useCallback(() => {
    if (!wrapperEl || !sectionEl || !listContainerEl || !listInnerEl) return;
    const innerH = listInnerEl.scrollHeight;
    const containerH = listContainerEl.clientHeight;
    const overflow = Math.max(0, innerH - containerH);
    overflowRef.current = overflow;
    // La hauteur et l'offset « collant » dépendent du breakpoint (nav plus
    // basse en mobile) : on les relit depuis la section elle-même.
    wrapperEl.style.height = `${sectionEl.offsetHeight + overflow}px`;
    stickyTopRef.current = parseFloat(getComputedStyle(sectionEl).top) || 0;
    wrapperAbsTopRef.current = wrapperEl.getBoundingClientRect().top + window.scrollY;
  }, [wrapperEl, sectionEl, listContainerEl, listInnerEl]);

  const updateListScroll = useCallback(() => {
    if (!overflowRef.current || !listInnerEl) return;
    const progress = Math.min(
      overflowRef.current,
      Math.max(0, window.scrollY - (wrapperAbsTopRef.current - stickyTopRef.current))
    );
    listInnerEl.style.transform = `translateY(-${progress}px)`;
  }, [listInnerEl]);

  useEffect(() => {
    if (!wrapperEl || !sectionEl || !listContainerEl || !listInnerEl) return;

    updateStickyLayout();
    updateListScroll();
    const timeout = setTimeout(updateStickyLayout, 200);

    window.addEventListener("resize", updateStickyLayout);
    window.addEventListener("scroll", updateListScroll, { passive: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateStickyLayout);
      window.removeEventListener("scroll", updateListScroll);
    };
  }, [wrapperEl, sectionEl, listContainerEl, listInnerEl, updateStickyLayout, updateListScroll]);

  const isDesktop = () => window.matchMedia(DESKTOP_QUERY).matches;

  return (
    <div id="projets" ref={setStickyWrapper}>
      <section
        ref={setSection}
        className="sticky-section sticky top-20 flex h-[calc(100svh-96px)] flex-col overflow-hidden rounded-[20px] py-6 sm:px-12 lg:top-[100px] lg:h-[calc(100vh-116px)] lg:py-10"
      >
        <div className="mb-4 lg:mb-10">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-accent">
            MES RÉALISATIONS
          </p>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-ink">Projets &amp; Use case</h2>
        </div>

        <div className="flex flex-1 flex-col items-stretch gap-4 lg:flex-row lg:gap-14" style={{ minHeight: 0 }}>
          <div className="relative shrink-0 basis-[42%] overflow-hidden rounded-2xl bg-[#F5F5F7] lg:flex-[0_0_44%]">
            {active ? (
              <a
                href={`/projets/${active.slug}`}
                aria-label={`Voir le projet ${active.longName}`}
                className="absolute inset-0"
              >
                <ProjectPreview project={active} />
              </a>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 lg:gap-4">
                <div className="umbreon-walker max-lg:scale-75" />
                <p className="text-sm font-semibold text-[#8E8E93]">En attente…</p>
                <p className="text-xs text-[#B8B8BE]">
                  <span className="lg:hidden">Touche un projet</span>
                  <span className="hidden lg:inline">Survole un projet</span>
                </p>
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
                    onMouseEnter={() => {
                      if (isDesktop()) setActive(p);
                    }}
                    onMouseLeave={() => {
                      if (isDesktop()) setActive(null);
                    }}
                    onClick={(e) => {
                      // En mobile, le premier tap affiche la prévisualisation ;
                      // un second tap sur le même projet ouvre sa page.
                      if (isDesktop() || active?.slug === p.slug) return;
                      e.preventDefault();
                      setActive(p);
                    }}
                    className={`flex items-center gap-4 rounded-2xl px-2 py-4 hover:bg-black/[0.03] sm:gap-5 sm:px-4 lg:py-[22px] ${
                      active?.slug === p.slug ? "max-lg:bg-black/[0.04]" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1.5 text-base font-bold leading-snug text-ink sm:text-[17px]">{p.longName}</h3>
                      <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-2 lg:line-clamp-none">{p.description}</p>
                    </div>
                    <svg width={18} height={18} className="shrink-0" viewBox="0 0 24 24" fill="none" stroke="#FFC800" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </a>
                  <div className="mx-2 h-px bg-hairline sm:mx-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
