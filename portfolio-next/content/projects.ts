import { createReader } from "@keystatic/core/reader";
import type { DocumentElement } from "@keystatic/core";
import keystaticConfig from "@/keystatic.config";

export type ProjectFeature = {
  icon: string;
  title: string;
  description: string;
};

export type Project = {
  slug: string;
  visible: boolean;
  ordre: number;
  name: string;
  longName: string;
  description: string;
  hoverImage: string | null;
  descriptionLongue: () => Promise<DocumentElement[]>;
  tags: string[];
  bg: string;
  textColor: string;
  year: string;
  problematique: () => Promise<DocumentElement[]>;
  approche: () => Promise<DocumentElement[]>;
  features: ProjectFeature[];
  screenshots: string[];
  externalUrl: string;
};

const reader = createReader(process.cwd(), keystaticConfig);

function toProject(slug: string, entry: Awaited<ReturnType<typeof reader.collections.projects.read>>): Project {
  // Ensure problematique and approche are functions
  const problematique = typeof entry!.problematique === 'function'
    ? entry!.problematique
    : () => Promise.resolve(entry!.problematique as DocumentElement[]);

  const approche = typeof entry!.approche === 'function'
    ? entry!.approche
    : () => Promise.resolve(entry!.approche as DocumentElement[]);

  const descriptionLongue = typeof entry!.descriptionLongue === 'function'
    ? entry!.descriptionLongue
    : () => Promise.resolve(entry!.descriptionLongue as DocumentElement[]);

  return {
    slug,
    visible: entry!.visible,
    ordre: entry!.ordre,
    name: entry!.name,
    longName: entry!.longName,
    description: entry!.description,
    hoverImage: entry!.hoverImage ?? null,
    descriptionLongue,
    tags: [...entry!.tags],
    bg: entry!.bg,
    textColor: entry!.textColor,
    year: entry!.year,
    problematique,
    approche,
    features: entry!.features.map((f) => ({ icon: f.icon, title: f.title, description: f.description })),
    screenshots: entry!.screenshots.filter((s): s is string => Boolean(s)),
    externalUrl: entry!.externalUrl,
  };
}

export async function getProjects(): Promise<Project[]> {
  const entries = await reader.collections.projects.all();
  return entries
    .map(({ slug, entry }) => toProject(slug, entry))
    .filter((project) => project.visible)
    .sort((a, b) => a.ordre - b.ordre);
}

export type ProjectSummary = Omit<Project, "problematique" | "approche" | "descriptionLongue">;

export async function getProjectSummaries(): Promise<ProjectSummary[]> {
  const projects = await getProjects();
  return projects.map(({ problematique, approche, descriptionLongue, ...summary }) => summary);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const entry = await reader.collections.projects.read(slug);
  if (!entry) return undefined;
  return toProject(slug, entry);
}
