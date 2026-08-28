import Image from "next/image";
import Link from "next/link";
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

const HOBBIES = [
  {
    title: "Musique",
    description:
      "Guitariste passionné depuis mes 15 ans, je trouve dans la musique un véritable terrain d'évasion et un langage commun à partager.",
    tag: "Jam session 🎸",
    image: "/images/about/music.jpg",
    rotate: "rotate-[2deg]",
    imageSide: "right",
  },
  {
    title: "Gaming & Mangas",
    description:
      "Des univers de jeux vidéo aux pages de mangas, je suis un amoureux d'histoires et d'aventures. Une culture geek revendiquée qui m'accompagne depuis toujours et qui stimule ma créativité.",
    tag: "Gaming & Mangas 🎮",
    image: "/images/about/gaming.jpg",
    rotate: "-rotate-[2.5deg]",
    imageSide: "left",
  },
  {
    title: "Associations",
    description:
      "Fort d'une expérience de responsable auprès de jeunes chrétiens malgaches, j'ai développé un goût prononcé pour l'animation de communauté, l'écoute et l'organisation d'événements. Un engagement humain et bénévole qui a forgé mon sens des responsabilités.",
    tag: "Assemblée générale 🙌",
    image: "/images/about/associations.jpg",
    rotate: "rotate-[1.5deg]",
    imageSide: "right",
  },
] as const;

function HobbyPolaroid({ hobby }: { hobby: (typeof HOBBIES)[number] }) {
  return (
    <div
      className={`w-[280px] rotate-0 rounded-sm bg-white p-3 pb-12 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.10)] transition-transform duration-300 will-change-transform hover:scale-[1.03] ${hobby.rotate}`}
    >
      <div className="aspect-square overflow-hidden rounded-sm bg-[#F5F5F7]">
        {hobby.image ? (
          <Image
            src={hobby.image}
            alt={hobby.tag}
            width={280}
            height={280}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-2">
            {hobby.tag}
          </div>
        )}
      </div>
      <p className="mt-3.5 text-center font-mono text-[13px] text-muted-2">{hobby.tag}</p>
    </div>
  );
}

export default function Page() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-8 py-6 md:px-[120px]">
      <Nav />

      <section className="flex flex-col items-center gap-12 rounded-[24px] bg-white px-8 py-14 md:flex-row md:gap-16 md:px-16 md:py-14">
        <div className="h-[280px] w-full shrink-0 overflow-hidden rounded-[20px] md:h-[380px] md:w-[320px]">
          <Image
            src="/images/about/portrait.jpg"
            alt="Portrait de Gautier Baleda"
            width={320}
            height={380}
            priority
            className="h-full w-full object-cover object-top"
          />
        </div>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.1em] text-muted-2">
            À propos
          </p>
          <h1 className="mb-2 text-5xl font-extrabold leading-none tracking-tight text-ink md:text-[56px]">
            Gautier
            <br />
            <span className="text-accent">Baleda</span>
          </h1>
          <p className="mb-8 text-base font-medium text-muted-2">Product Builder</p>
          <p className="mb-5 text-[17px] leading-relaxed text-[#3A3A3C]">
            J&apos;aime construire ce qui a du sens, des applications comme des
            liens. Curieux de tout ce qui est possible, je peux passer
            d&apos;explorateur à enquêteur pour résoudre des énigmes tech
            et proposer des solutions sur mesure.
          </p>
          <p className="text-[17px] leading-relaxed text-[#3A3A3C]">
            Toujours curieux, toujours en mouvement, que ce soit sur un projet
            perso, dans une asso, ou sur les sentiers.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href="mailto:gautier.baleda@gmail.com"
              className="flex h-11 items-center rounded-full bg-accent px-6 text-sm font-semibold text-ink no-underline"
            >
              Me contacter
            </a>
            <Link
              href="/#projets"
              className="flex h-11 items-center rounded-full bg-page px-6 text-sm font-semibold text-ink no-underline"
            >
              Voir mes projets
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] bg-white px-8 py-14 md:px-16">
        <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.1em] text-muted-2">
          Parcours
        </p>
        <h2 className="mb-14 text-3xl font-extrabold tracking-tight text-ink md:text-[40px]">
          Expériences pro
        </h2>

        <div className="relative">
          <div className="absolute bottom-0 left-[148px] top-0 hidden w-px bg-hairline md:block" />
          <div className="flex flex-col">
            {EXPERIENCES.map((exp, i) => (
              <div
                key={exp.title}
                className={`group flex items-start gap-0 ${i < EXPERIENCES.length - 1 ? "pb-12" : ""
                  }`}
              >
                <div className="hidden w-[120px] shrink-0 pr-7 pt-1 text-right md:block">
                  <span className="font-mono text-[13px] font-medium text-muted-2">
                    {exp.period}
                  </span>
                </div>
                <div className="flex w-14 shrink-0 flex-col items-center pt-1">
                  <div className="h-3 w-3 shrink-0 rounded-full bg-[#FFE680] transition-all duration-200 group-hover:scale-125 group-hover:bg-accent" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2.5">
                    <span className="text-lg font-bold tracking-tight text-ink transition-colors duration-200 group-hover:text-accent">
                      {exp.title}
                    </span>
                    {exp.tag && (
                      <span className="rounded-full bg-[#FFF8E1] px-2.5 py-0.5 text-[13px] font-medium text-[#B8860B]">
                        {exp.tag}
                      </span>
                    )}
                  </div>
                  <p className="mb-2.5 text-sm font-semibold text-muted-2">{exp.place}</p>
                  <p className="text-sm leading-relaxed text-[#3A3A3C]">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[24px] bg-white px-8 py-14 md:px-16">
        <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.1em] text-muted-2">
          En dehors du boulot
        </p>
        <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-ink md:text-[40px]">
          Ce qui m&apos;anime
        </h2>

        <div className="flex flex-col gap-16">
          {HOBBIES.map((hobby) => (
            <div
              key={hobby.title}
              className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16"
            >
              <div
                className={`flex justify-center ${hobby.imageSide === "right"
                  ? "md:order-2 md:justify-end"
                  : "md:order-1 md:justify-start"
                  }`}
              >
                <HobbyPolaroid hobby={hobby} />
              </div>
              <div className={hobby.imageSide === "right" ? "md:order-1" : "md:order-2"}>
                <h3 className="mb-4 text-xl font-bold tracking-tight text-accent">
                  {hobby.title}
                </h3>
                <p className="mb-5 text-[17px] leading-relaxed text-[#3A3A3C]">
                  {hobby.description}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-[7px] w-[7px] rounded-full bg-accent" />
                  <span className="h-[7px] w-[7px] rounded-full bg-accent" />
                  <span className="h-[7px] w-[7px] rounded-full bg-accent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
