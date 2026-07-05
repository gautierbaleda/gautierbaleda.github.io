import Link from "next/link";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/projets", label: "Projets" },
  { href: "/#play", label: "Playground" },
  { href: "/a-propos", label: "À Propos" },
];

export function Nav() {
  return (
    <nav className="sticky top-4 z-50 mx-auto flex max-w-[1200px] items-center justify-between rounded-2xl bg-white/90 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <span className="h-2 w-2 rounded-full bg-accent" />
        gautier baleda
      </div>
      <div className="hidden items-center gap-2 md:flex">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-xl px-4 py-2 text-sm font-medium text-ink hover:bg-black/5"
          >
            {l.label}
          </Link>
        ))}
      </div>
      <Link
        href="/#contact"
        className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-ink"
      >
        Contact
      </Link>
    </nav>
  );
}
