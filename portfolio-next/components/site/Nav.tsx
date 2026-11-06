"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Accueil", sectionId: null as string | null },
  { href: "/#expertise", label: "Expertise", sectionId: "expertise" },
  { href: "/#projets", label: "Projets", sectionId: "projets" },
  { href: "/#play", label: "Playground", sectionId: "play" },
  { href: "/a-propos", label: "À Propos", sectionId: null as string | null },
];

const SCROLL_SPY_SECTION_IDS = ["expertise", "projets", "play"];

export function Nav() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const isActive = (l: (typeof LINKS)[number]) =>
    pathname === "/"
      ? l.sectionId
        ? activeSection === l.sectionId
        : activeSection === null && l.href === "/"
      : pathname === l.href;

  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-center md:h-[100px] md:px-12">
      <nav className="relative flex h-14 w-full max-w-[1100px] items-center justify-between rounded-full bg-white pl-5 pr-2 shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:h-[60px] md:pl-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap no-underline" onClick={() => setMenuOpen(false)}>
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="text-sm font-semibold lowercase tracking-[-0.01em] text-accent">
            gautier baleda
          </span>
        </Link>
        <div className="hidden items-center gap-1 xl:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex h-10 items-center whitespace-nowrap rounded-full px-5 text-sm font-medium no-underline ${
                isActive(l) ? "bg-accent text-ink" : "text-accent"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/#contact"
            className="hidden h-10 items-center whitespace-nowrap rounded-full bg-accent px-6 text-sm font-semibold text-ink no-underline xl:flex"
          >
            Contact
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink xl:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute inset-x-0 top-[calc(100%+8px)] flex flex-col gap-1 rounded-3xl bg-white p-2 shadow-[0_4px_24px_rgba(0,0,0,0.08)] xl:hidden">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`flex h-12 items-center rounded-full px-5 text-[15px] font-medium no-underline ${
                  isActive(l) ? "bg-accent text-ink" : "text-accent"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 items-center rounded-full px-5 text-[15px] font-medium text-accent no-underline"
            >
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
