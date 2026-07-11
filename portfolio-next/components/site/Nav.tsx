"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/#projets", label: "Projets" },
  { href: "/#play", label: "Playground" },
  { href: "/a-propos", label: "À Propos" },
];

export function Nav() {
  const pathname = usePathname();

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
            const active = l.href === "/" ? pathname === "/" : pathname === l.href;
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
