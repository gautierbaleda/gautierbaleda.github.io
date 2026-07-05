import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const EXPERIENCES = [
  {
    period: "2025 →",
    title: "Product Builder",
    tag: "Poste actuel",
    place: "Dorêka · Paris",
    description:
      "Développement SaaS sur Bubble, implémentation d'outils no-code et IA pour les équipes, et automatisation de process métier de bout en bout.",
  },
  {
    period: "2025",
    title: "Chef de projet réseau",
    tag: null,
    place: "Carrefour · Massy",
    description:
      "Planification du déploiement d'équipements réseau, mise en place de KPI, coordination des remises en conformité des baies informatiques en magasin, et suivi budgétaire.",
  },
  {
    period: "2023–2024",
    title: "Chargé d'Affaires IT",
    tag: null,
    place: "Enedis · Lyon",
    description:
      "Accompagnement de projets DSI, migration d'applications vers AWS et On Premise, pilotage de projet en méthode Agile, installation et supervision de serveurs, et amélioration continue via KPI.",
  },
  {
    period: "2021–2023",
    title: "Expert Habilitation",
    tag: null,
    place: "Enedis · Lyon",
    description:
      "Gestion des accès applicatifs, pilotage de la création de formulaires web, automatisation de process de reporting via UIPath (RPA), et développement de formulaires en VBA.",
  },
  {
    period: "2019–2021",
    title: "Expert Sécurité Informatique",
    tag: null,
    place: "Casino · Saint-Étienne",
    description:
      "Support N3 sur les incidents de sécurité (JIRA, Ivanti), analyse de logs, gestion des droits via Active Directory, et support du VPN Citrix pendant la crise COVID.",
  },
];

const INTERESTS = [
  {
    title: "Musique",
    description:
      "Guitariste passionné depuis mes 15 ans, je trouve dans la musique un véritable terrain d'évasion et un langage commun à partager.",
    tag: "Jam session 🎸",
  },
  {
    title: "Gaming & Mangas",
    description:
      "Des univers de jeux vidéo aux pages de mangas, je suis un amoureux d'histoires et d'aventures. Une culture geek revendiquée qui m'accompagne depuis toujours et qui stimule ma créativité.",
    tag: "Gaming & Mangas 🎮",
  },
  {
    title: "Associations",
    description:
      "Fort d'une expérience de responsable auprès de jeunes chrétiens malgaches, j'ai développé un goût prononcé pour l'animation de communauté, l'écoute et l'organisation d'événements. Un engagement humain et bénévole qui a forgé mon sens des responsabilités.",
    tag: "Assemblée générale 🙌",
  },
];

export default function Page() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-8 py-6 md:px-[120px]">
      <Nav />

      <section className="rounded-[20px] px-10 py-16 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-accent">
          À propos
        </p>
        <h1 className="text-6xl font-extrabold leading-none tracking-tight text-ink">
          Gautier
          <br />
          Baleda
        </h1>
        <p className="mt-4 text-xl font-semibold text-muted">Designer &amp; Développeur</p>
        <p className="mx-auto mt-6 max-w-[560px] text-base leading-relaxed text-muted">
          Passionné par les interfaces qui ont du sens et le code qui va avec.
          Je travaille à l&apos;intersection du design et du développement —
          concevoir des expériences soignées, les prototyper rapidement, et
          les pousser en prod.
        </p>
        <p className="mx-auto mt-2 max-w-[560px] text-base leading-relaxed text-muted">
          Toujours curieux, toujours en mouvement — que ce soit sur un projet
          perso, dans une asso, ou sur les sentiers.
        </p>
      </section>

      <section className="rounded-[20px] px-10 py-10">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-accent">
          Parcours
        </p>
        <h2 className="mb-8 text-2xl font-bold text-ink">Expériences pro</h2>
        <div className="flex flex-col gap-8">
          {EXPERIENCES.map((exp) => (
            <div key={exp.title} className="flex gap-8 border-b border-hairline pb-8">
              <div className="w-24 shrink-0 text-sm font-semibold text-muted-2">
                {exp.period}
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">
                  {exp.title}
                  {exp.tag && (
                    <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-ink">
                      {exp.tag}
                    </span>
                  )}
                </h3>
                <p className="mb-2 text-sm font-medium text-muted-2">{exp.place}</p>
                <p className="text-sm leading-relaxed text-muted">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[20px] px-10 py-10">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-accent">
          En dehors du boulot
        </p>
        <h2 className="mb-8 text-2xl font-bold text-ink">Ce qui m&apos;anime</h2>
        <div className="grid grid-cols-3 gap-6">
          {INTERESTS.map((i) => (
            <div key={i.title} className="rounded-2xl bg-[#F5F5F7] p-6">
              <h3 className="mb-2 text-lg font-bold text-ink">{i.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted">{i.description}</p>
              <span className="text-sm font-medium text-muted-2">{i.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
