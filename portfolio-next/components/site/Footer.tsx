export function Footer() {
  return (
    <section id="contact" className="rounded-[20px] bg-ink px-10 py-16 text-center">
      <div className="mx-auto max-w-[600px]">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-accent">
          CONTACT
        </p>
        <h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white"><span>Un projet en tête ?</span><br />Parlons-en.</h2>
        <p className="mb-10 text-[15px] leading-relaxed text-muted-2">
          Je réponds généralement sous 24h. Dites-moi ce que vous cherchez à
          construire, et on voit ensemble comment y arriver vite !
        </p>
        <div className="flex flex-col items-center gap-3">
          <a
            href="mailto:gautier.baleda@gmail.com"
            className="w-full max-w-[340px] rounded-2xl bg-accent px-8 py-4 text-[15px] font-bold text-ink"
          >
            Envoyer un email
          </a>
          <div className="flex w-full max-w-[340px] gap-3">
            <a
              href="#"
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white"
            >
              GitHub
            </a>
          </div>
        </div>
        <p className="mt-12 text-xs text-[#48484A]">
          © 2025 Gautier Baleda. Tous droits réservés.
        </p>
      </div>
    </section>
  );
}
