"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Accueil", sectionId: null as string | null },
  { href: "/#projets", label: "Projets", sectionId: "projets" },
  { href: "/#play", label: "Playground", sectionId: "play" },
  { href: "/a-propos", label: "À Propos", sectionId: null as string | null },
];

const SCROLL_SPY_SECTION_IDS = ["projets", "play"];

export function Nav() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = SCROLL_SPY_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveSection(visible.length > 0 ? visible[0].target.id : null);
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 flex h-[100px] w-full items-center justify-center px-12">
      <nav className="flex h-[60px] w-full max-w-[1100px] items-center justify-between rounded-full bg-white pl-8 pr-2 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="text-sm font-semibold lowercase tracking-[-0.01em] text-accent">
            gautier baleda
          </span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active =
              pathname === "/"
                ? l.sectionId
                  ? activeSection === l.sectionId
                  : activeSection === null && l.href === "/"
                : pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex h-10 items-center rounded-full px-5 text-sm font-medium no-underline ${
                  active ? "bg-accent text-ink" : "text-accent"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <Link
          href="/#contact"
          className="flex h-10 items-center rounded-full bg-accent px-6 text-sm font-semibold text-ink no-underline"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
