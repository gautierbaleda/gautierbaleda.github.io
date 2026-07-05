export type Project = {
  slug: string;
  name: string;
  longName: string;
  description: string;
  tags: string[];
  bg: string;
  textColor: string;
};

export const projects: Project[] = [
  {
    slug: "projet-un",
    name: "PROJET 1",
    longName: "Projet Un",
    description: "Description courte du projet, à préciser via le CMS.",
    tags: ["No-code"],
    bg: "#1A1A2E",
    textColor: "#FFFFFF",
  },
  {
    slug: "projet-deux",
    name: "PROJET 2",
    longName: "Projet Deux",
    description: "Description courte du projet, à préciser via le CMS.",
    tags: ["Automatisation"],
    bg: "#2E1A4E",
    textColor: "#FFFFFF",
  },
  {
    slug: "projet-trois",
    name: "PROJET 3",
    longName: "Projet Trois",
    description: "Description courte du projet, à préciser via le CMS.",
    tags: ["Produit"],
    bg: "#0D2B1A",
    textColor: "#FFFFFF",
  },
  {
    slug: "projet-quatre",
    name: "PROJET 4",
    longName: "Projet Quatre",
    description: "Description courte du projet, à préciser via le CMS.",
    tags: ["Design"],
    bg: "#2D0015",
    textColor: "#FFFFFF",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
