export function Bio() {
  return (
    <section className="rounded-[20px] px-10 py-10">
      <div className="flex items-center gap-16">
        <div className="flex-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-accent">
            QUI SUIS-JE
          </p>
          <h2 className="mb-4 text-2xl font-bold text-ink">
            Un Product Builder passionné par l&apos;impact
          </h2>
          <p className="mb-6 text-base leading-relaxed text-muted">
            Issu du monde du management digital, j&apos;ai développé une
            approche hybride qui combine vision produit, design UX et
            développement no-code. Je construis des solutions qui résolvent
            de vrais problèmes pour de vraies personnes.
          </p>
          <a href="#" className="text-sm font-semibold text-accent">
            En savoir plus →
          </a>
        </div>
        <div className="flex h-[260px] w-[380px] shrink-0 items-center justify-center rounded-2xl bg-[#F5F5F7]">
          <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="#FFC800" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
      </div>
    </section>
  );
}
