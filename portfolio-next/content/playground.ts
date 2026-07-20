import { createReader } from "@keystatic/core/reader";
import type { DocumentElement } from "@keystatic/core";
import keystaticConfig from "@/keystatic.config";

export type PlaygroundApp = {
  slug: string;
  visible: boolean;
  ordre: number;
  title: string;
  tools: string[];
  description: string;
  descriptionLongue: () => Promise<DocumentElement[]>;
  image: string | null;
  githubUrl: string;
  externalUrl: string;
  bg: string;
};

const reader = createReader(process.cwd(), keystaticConfig);

export async function getPlaygroundApps(): Promise<PlaygroundApp[]> {
  const entries = await reader.collections.playground.all();
  return entries
    .map(({ slug, entry }) => ({
      slug,
      visible: entry.visible,
      ordre: entry.ordre,
      title: entry.title,
      tools: [...entry.tools],
      description: entry.description,
      descriptionLongue: entry.descriptionLongue,
      image: entry.image,
      githubUrl: entry.githubUrl,
      externalUrl: entry.externalUrl,
      bg: entry.bg,
    }))
    .filter((app) => app.visible)
    .sort((a, b) => a.ordre - b.ordre);
}
