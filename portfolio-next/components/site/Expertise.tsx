"use client";
import { useState, type CSSProperties } from "react";
import { ExpertiseScene } from "./ExpertiseScenes";

export type ExpertiseKey = "automatisation" | "applications" | "ia";

const EXPERTISES: {
  key: ExpertiseKey;
  title: string;
  quote: string;
  items: string[];
  bg: string;
  fg: string;
}[] = [
  {
    key: "automatisation",
    title: "Automatisation",
    quote: "Je relie vos outils, et les ressaisies disparaissent.",
    items: [
      "Connecter vos applications entre elles et avec vos partenaires",
      "Générer vos documents en un clic : devis, rapports, slides, courriers, contrats",
      "Relances et rappels automatiques",
      "Vérification automatique de pièces justificatives",
    ],
    bg: "#D9D4C8",
    fg: "#1D1D1F",
  },
  {
    key: "applications",
    title: "Applications web",
    quote: "Des outils taillés pour votre métier, pas des tableurs bricolés.",
    items: [
      "Outil interne de gestion : tickets, formations, dossiers, réservations",
      "Dashboard de suivi et d’indicateurs",
      "Portail client ou espace adhérent",
      "Site vitrine et landing page",
    ],
    bg: "#FFC800",
    fg: "#1D1D1F",
  },
  {
    key: "ia",
    title: "Agents IA",
    quote: "Un assistant qui répond avec vos données, et vous gardez la main.",
    items: [
      "Assistant interne dans Slack ou Teams, nourri de votre documentation",
      "Agent qui agit dans vos outils : mise à jour de statuts, création de tâches",
      "Aide à l’analyse : synthèse, tri et extraction d’informations",
      "Recherche intelligente dans vos documents",
    ],
    bg: "#1D1D1F",
    fg: "#FFFFFF",
  },
];

const GEAR_TEETH = [0, 45, 90, 135, 180, 225, 270, 315];

function ExpertiseIcon({ variant, color, hole, active }: { variant: ExpertiseKey; color: string; hole: string; active: boolean }) {
  if (variant === "automatisation") {
    return (
      <svg viewBox="0 0 48 48" className="h-full w-full" fill={color}>
        <g transform="translate(19,28)">
          {GEAR_TEETH.map((deg) => (
            <rect key={deg} x={-2} y={-12} width={4} height={4} rx={1} transform={`rotate(${deg})`} />
          ))}
          <circle r={9} />
          <circle r={3.5} fill={hole} />
        </g>
        <g transform="translate(33,17)">
          {GEAR_TEETH.map((deg) => (
            <rect key={deg} x={-1.5} y={-8.5} width={3} height={3} rx={0.8} transform={`rotate(${deg})`} />
          ))}
          <circle r={6} />
          <circle r={2.3} fill={hole} />
        </g>
      </svg>
    );
  }
  if (variant === "applications") {
    return (
      <svg viewBox="0 0 48 48" className="h-full w-full" fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x={7} y={10} width={34} height={28} rx={4} />
        <path d="M7 18h34" />
        <path d="M20 25l-4 4 4 4M28 25l4 4-4 4" strokeWidth={3} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" fill="none">
      <path
        d="M10 12h22a5 5 0 0 1 5 5v11a5 5 0 0 1-5 5H20l-7 6v-6h-3a5 5 0 0 1-5-5V17a5 5 0 0 1 5-5z"
        stroke={color}
        strokeWidth={3.2}
        strokeLinejoin="round"
      />
      <path
        d="M38 3c.7 4.3 1.9 5.5 6 6-4.1.5-5.3 1.7-6 6-.7-4.3-1.9-5.5-6-6 4.1-.5 5.3-1.7 6-6z"
        fill="#FFC800"
        className={active ? "xp-twinkle" : undefined}
      />
    </svg>
  );
}

export function Expertise() {
  const [active, setActive] = useState(0);

  return (
    <section id="expertise" className="rounded-[20px] px-0 py-10 md:px-10">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-accent">EXPERTISE</p>
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          Ce que je peux construire pour vous
        </h2>
      </div>

      <div className="flex flex-col gap-3 lg:h-[580px] lg:flex-row">
        {EXPERTISES.map((e, i) => {
          const open = i === active;
          return (
            <article
              key={e.key}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`relative cursor-pointer overflow-hidden rounded-[20px] p-7 transition-[flex-grow,box-shadow] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] lg:min-w-0 ${
                open ? "lg:flex-[2.6] shadow-[0_22px_50px_rgba(0,0,0,0.14)]" : "lg:flex-1"
              }`}
              style={{ background: e.bg, color: e.fg }}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="h-12 w-12 shrink-0">
                    <ExpertiseIcon variant={e.key} color={e.fg} hole={e.bg} active={open} />
                  </div>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`expertise-${e.key}`}
                    aria-label={`Afficher le détail : ${e.title}`}
                    onFocus={() => setActive(i)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg leading-none transition-transform duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      open ? "rotate-45" : ""
                    }`}
                    style={{ borderColor: `${e.fg}33`, outlineColor: e.fg }}
                  >
                    +
                  </button>
                </div>

                {open && (
                  <div className="mt-4 flex justify-center lg:mt-0 lg:min-h-0 lg:flex-1 lg:items-center" aria-hidden>
                    <div className="aspect-[320/170] w-full max-w-[360px] lg:h-full lg:max-h-[200px] lg:w-auto">
                      <ExpertiseScene variant={e.key} />
                    </div>
                  </div>
                )}

                <div className="mt-6 lg:mt-auto">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.1em] opacity-60">{e.title}</h3>
                  <p
                    className={`font-extrabold leading-snug tracking-tight transition-[font-size] duration-500 ${
                      open ? "text-xl lg:text-[28px]" : "text-xl"
                    }`}
                  >
                    « {e.quote} »
                  </p>

                  <div
                    id={`expertise-${e.key}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ${
                      open ? "grid-rows-[1fr] opacity-100 lg:delay-150" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="mt-6 space-y-2.5 border-t pt-5 lg:min-w-[440px]" style={{ borderColor: `${e.fg}26` }}>
                        {e.items.map((item, j) => (
                          <li
                            key={item}
                            className={`flex gap-2.5 text-sm leading-relaxed opacity-80 ${open ? "xp-item" : ""}`}
                            style={{ "--d": `${0.45 + j * 0.08}s` } as CSSProperties}
                          >
                            <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: e.fg }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
