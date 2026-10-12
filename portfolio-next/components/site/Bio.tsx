import Image from "next/image";

export function Bio() {
  return (
    <section className="rounded-[20px] px-0 py-10 md:px-10">
      <div className="flex flex-col-reverse items-center gap-8 md:flex-row md:gap-16">
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
          <a href="/a-propos" className="text-sm font-semibold text-accent">
            En savoir plus →
          </a>
        </div>
        <div className="relative aspect-square w-full max-w-[280px] shrink-0 overflow-hidden rounded-2xl bg-[#F5F5F7] md:w-[280px]">
          <Image
            src="/images/home/photo.jpg"
            alt="Photo de Gautier Baleda"
            fill
            sizes="280px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
