# Project Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/projets/[slug]` into a full editorial project detail page (breadcrumb, cover, problématique/approche rich text, features grid, screenshot carousel, CTAs) backed by an extended Keystatic content model, with a slide-in-from-right entrance animation.

**Architecture:** `/projets/[slug]` stays a normal server-rendered Next.js route (no SPA overlay, no View Transitions). The Keystatic `projects` collection gains new fields (`year`, `problematique`/`approche` as rich text `fields.document`, `features`, `screenshotsCount`, `externalUrl`), all still stored inline in the existing flat `content/projects/<slug>.json` files (no `contentField`/directory restructuring). Two new client components (`ProjectDetailReveal`, `ProjectCarousel`) handle the entrance animation and the screenshot carousel; everything else renders in the existing server component `page.tsx`.

**Tech Stack:** Next.js App Router, Keystatic (`@keystatic/core`, `fields.document` + `DocumentRenderer` from `@keystatic/core/renderer`), Tailwind CSS v4, `lucide-react` (feature icons), Vitest + Testing Library.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-11-project-detail-page-design.md`.
- Route stays `/projets/[slug]` (no overlay, no View Transitions) — see spec "Décision d'architecture".
- Breadcrumb ("Projets" link + `/` + `project.name`) is sticky for the entire page (`position: sticky; top: 0`), not just the hero band.
- Cover image and carousel slides are colored placeholder blocks (derived from `project.bg`), not real images — no image asset field yet.
- Carousel is manual-only (arrows + dots), no auto-play.
- "Voir le projet →" CTA is hidden entirely when `project.externalUrl` is an empty string.
- "Me contacter" CTA links to `/#contact` (the existing `Footer` section, which already has `id="contact"`).
- Entrance animation reuses the exact pattern already used in `components/site/Hero.tsx:20-35` (double `requestAnimationFrame` before flipping a `visible` boolean, CSS transition driven by a toggled class) — no animation library.
- All new Keystatic fields are inline in the existing single JSON file per project (`format: { data: "json" }`, no `contentField`), matching the current `path: "content/projects/*"` collection layout.

---

### Task 1: Extend the Keystatic content model (schema, reader, placeholder content)

**Files:**
- Modify: `portfolio-next/keystatic.config.ts`
- Modify: `portfolio-next/content/projects.ts`
- Modify: `portfolio-next/content/projects.test.ts`
- Modify: `portfolio-next/components/site/ProjectCard.test.tsx`
- Modify: `portfolio-next/components/site/Realisations.test.tsx`
- Modify: `portfolio-next/content/projects/projet-un.json`
- Modify: `portfolio-next/content/projects/projet-deux.json`
- Modify: `portfolio-next/content/projects/projet-trois.json`
- Modify: `portfolio-next/content/projects/projet-quatre.json`
- Modify: `portfolio-next/content/projects/projet5.json`
- Modify: `portfolio-next/content/projects/projet6.json`
- Modify: `portfolio-next/content/projects/projet-six-copy.json`

**Interfaces:**
- Produces: `Project` type (`content/projects.ts`) gains `year: string`, `problematique: () => Promise<DocumentElement[]>`, `approche: () => Promise<DocumentElement[]>`, `features: ProjectFeature[]`, `screenshotsCount: number`, `externalUrl: string`. `ProjectFeature = { icon: string; title: string; description: string }`. Later tasks (2, 3, 4) consume these exact names.

- [ ] **Step 1: Write the failing test for the extended reader**

Replace the full contents of `portfolio-next/content/projects.test.ts` with:

```ts
import { getProjects, getProjectBySlug } from "./projects";

describe("projects content", () => {
  it("has at least one project with the required fields", async () => {
    const projects = await getProjects();
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(p.slug).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.tags.length).toBeGreaterThan(0);
      expect(p.year).toBeTruthy();
      expect(p.screenshotsCount).toBeGreaterThanOrEqual(1);
      expect(p.screenshotsCount).toBeLessThanOrEqual(3);
      expect(Array.isArray(p.features)).toBe(true);
      expect(p.features.length).toBeGreaterThan(0);
      for (const feature of p.features) {
        expect(feature.icon).toBeTruthy();
        expect(feature.title).toBeTruthy();
        expect(feature.description).toBeTruthy();
      }
      const problematique = await p.problematique();
      const approche = await p.approche();
      expect(problematique.length).toBeGreaterThan(0);
      expect(approche.length).toBeGreaterThan(0);
      expect(typeof p.externalUrl).toBe("string");
    }
  });

  it("looks up a project by slug and resolves matching rich text", async () => {
    const projects = await getProjects();
    const first = projects[0];
    const bySlug = await getProjectBySlug(first.slug);
    expect(bySlug).toBeDefined();
    expect(bySlug).toMatchObject({
      slug: first.slug,
      name: first.name,
      longName: first.longName,
      description: first.description,
      tags: first.tags,
      bg: first.bg,
      textColor: first.textColor,
      year: first.year,
      features: first.features,
      screenshotsCount: first.screenshotsCount,
      externalUrl: first.externalUrl,
    });
    expect(await bySlug!.problematique()).toEqual(await first.problematique());
    expect(await bySlug!.approche()).toEqual(await first.approche());
  });

  it("returns undefined for an unknown slug", async () => {
    expect(await getProjectBySlug("does-not-exist")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd portfolio-next && npx vitest run content/projects.test.ts`
Expected: FAIL — `p.year`/`p.screenshotsCount`/`p.features`/`p.problematique` are `undefined` (TypeError calling `.problematique()` as a function, or assertion failures), since the current `Project` type and content files don't have these fields yet.

- [ ] **Step 3: Extend the Keystatic schema**

Replace the `projects` collection's `schema` block in `portfolio-next/keystatic.config.ts` (keep the `playground` collection untouched):

```ts
import { config, collection, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    projects: collection({
      label: "Projets",
      slugField: "slug",
      path: "content/projects/*",
      format: { data: "json" },
      schema: {
        slug: fields.slug({ name: { label: "Slug" } }),
        name: fields.text({ label: "Nom court" }),
        longName: fields.text({ label: "Nom long" }),
        description: fields.text({ label: "Description", multiline: true }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        bg: fields.text({ label: "Couleur de fond (hex)" }),
        textColor: fields.text({ label: "Couleur du texte (hex)" }),
        year: fields.text({ label: "Année" }),
        problematique: fields.document({
          label: "Problématique",
          formatting: true,
          images: {
            directory: "public/images/projects",
            publicPath: "/images/projects/",
          },
        }),
        approche: fields.document({
          label: "Approche et solution",
          formatting: true,
          images: {
            directory: "public/images/projects",
            publicPath: "/images/projects/",
          },
        }),
        features: fields.array(
          fields.object({
            icon: fields.select({
              label: "Icône",
              options: [
                { label: "Éclair", value: "zap" },
                { label: "Couches", value: "layers" },
                { label: "Bouclier", value: "shield" },
                { label: "Fusée", value: "rocket" },
                { label: "Code", value: "code" },
                { label: "Utilisateurs", value: "users" },
              ],
              defaultValue: "zap",
            }),
            title: fields.text({ label: "Titre" }),
            description: fields.text({ label: "Description", multiline: true }),
          }),
          {
            label: "Fonctionnalités clés",
            itemLabel: (props) => props.fields.title.value,
          }
        ),
        screenshotsCount: fields.integer({
          label: "Nombre de captures d'écran",
          defaultValue: 1,
          validation: { isRequired: true, min: 1, max: 3 },
        }),
        externalUrl: fields.text({
          label: "Lien externe (bouton \"Voir le projet\")",
          description: "Laisser vide pour masquer le bouton.",
        }),
      },
    }),
    playground: collection({
      label: "Playground",
      slugField: "title",
      path: "content/playground/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Titre" } }),
        tool: fields.text({ label: "Outil" }),
        description: fields.text({ label: "Description", multiline: true }),
        bg: fields.text({ label: "Couleur de fond (hex)" }),
      },
    }),
  },
});
```

- [ ] **Step 4: Extend the `Project` type and reader mapping**

Replace the full contents of `portfolio-next/content/projects.ts`:

```ts
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
  name: string;
  longName: string;
  description: string;
  tags: string[];
  bg: string;
  textColor: string;
  year: string;
  problematique: () => Promise<DocumentElement[]>;
  approche: () => Promise<DocumentElement[]>;
  features: ProjectFeature[];
  screenshotsCount: number;
  externalUrl: string;
};

const reader = createReader(process.cwd(), keystaticConfig);

function toProject(slug: string, entry: Awaited<ReturnType<typeof reader.collections.projects.read>>): Project {
  return {
    slug,
    name: entry!.name,
    longName: entry!.longName,
    description: entry!.description,
    tags: [...entry!.tags],
    bg: entry!.bg,
    textColor: entry!.textColor,
    year: entry!.year,
    problematique: entry!.problematique,
    approche: entry!.approche,
    features: entry!.features.map((f) => ({ icon: f.icon, title: f.title, description: f.description })),
    screenshotsCount: entry!.screenshotsCount,
    externalUrl: entry!.externalUrl,
  };
}

export async function getProjects(): Promise<Project[]> {
  const entries = await reader.collections.projects.all();
  return entries.map(({ slug, entry }) => toProject(slug, entry));
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const entry = await reader.collections.projects.read(slug);
  if (!entry) return undefined;
  return toProject(slug, entry);
}
```

- [ ] **Step 5: Add placeholder content to every project file**

Add the following keys to each of the 7 files in `portfolio-next/content/projects/` (keep all existing keys as-is; this shows the full resulting file for one of them, `projet-un.json` — apply the same new keys, adapted only in wording, to the other 6 files):

```json
{
  "slug": "projet-un",
  "name": "PROJET 1",
  "longName": "Projet Un",
  "description": "Description courte du projet, à préciser via le CMS.",
  "tags": ["No-code"],
  "bg": "#1A1A2E",
  "textColor": "#FFFFFF",
  "year": "2025",
  "problematique": [
    { "type": "paragraph", "children": [{ "text": "Problématique à préciser via le CMS." }] }
  ],
  "approche": [
    { "type": "paragraph", "children": [{ "text": "Approche et solution à préciser via le CMS." }] }
  ],
  "features": [
    { "icon": "zap", "title": "Fonctionnalité 1", "description": "Description à préciser via le CMS." },
    { "icon": "layers", "title": "Fonctionnalité 2", "description": "Description à préciser via le CMS." }
  ],
  "screenshotsCount": 2,
  "externalUrl": ""
}
```

Apply the same 6 new keys (`year`, `problematique`, `approche`, `features`, `screenshotsCount`, `externalUrl`) to `projet-deux.json`, `projet-trois.json`, `projet-quatre.json`, `projet5.json`, `projet6.json`, and `projet-six-copy.json`, keeping their existing `slug`/`name`/`longName`/`description`/`tags`/`bg`/`textColor` untouched. Give **`projet-deux.json`** a non-empty `externalUrl` (e.g. `"https://example.com/projet-deux"`) so a later task can test the CTA actually rendering; leave the other 6 files with `"externalUrl": ""` so the CTA-hidden case is also covered by real content.

- [ ] **Step 6: Fix the fixture literals in dependent component tests**

In `portfolio-next/components/site/ProjectCard.test.tsx`, update the `project` fixture to satisfy the extended `Project` type:

```ts
const project: Project = {
  slug: "projet-un",
  name: "PROJET 1",
  longName: "Projet Un",
  description: "Description courte.",
  tags: ["No-code"],
  bg: "#1A1A2E",
  textColor: "#FFFFFF",
  year: "2025",
  problematique: async () => [],
  approche: async () => [],
  features: [],
  screenshotsCount: 1,
  externalUrl: "",
};
```

In `portfolio-next/components/site/Realisations.test.tsx`, update the `projects` fixture the same way:

```ts
const projects: Project[] = [
  {
    slug: "projet-un",
    name: "PROJET 1",
    longName: "Projet Un",
    description: "Description courte.",
    tags: ["No-code"],
    bg: "#1A1A2E",
    textColor: "#FFFFFF",
    year: "2025",
    problematique: async () => [],
    approche: async () => [],
    features: [],
    screenshotsCount: 1,
    externalUrl: "",
  },
];
```

- [ ] **Step 7: Run the full test suite to verify everything passes**

Run: `cd portfolio-next && npx vitest run`
Expected: PASS for all test files, including `content/projects.test.ts`, `components/site/ProjectCard.test.tsx`, `components/site/Realisations.test.tsx`.

- [ ] **Step 8: Verify the Keystatic admin UI still accepts these fields**

Run: `cd portfolio-next && npm run dev`, then open `http://localhost:3000/keystatic/collection/projects/item/projet-un` in a browser. Confirm the form loads without error, shows the new "Année", "Problématique", "Approche et solution", "Fonctionnalités clés", "Nombre de captures d'écran", and "Lien externe" fields with the placeholder content, and that clicking into "Problématique" shows a working rich-text toolbar (bold, headings, image). Stop the dev server after checking (Ctrl+C). If the form fails to load or a field errors, fix the schema/content mismatch before continuing to Task 2.

- [ ] **Step 9: Commit**

```bash
cd "/Users/gautier/Documents/projets/Portfolio interface edit" && git add portfolio-next/keystatic.config.ts portfolio-next/content/projects.ts portfolio-next/content/projects.test.ts portfolio-next/components/site/ProjectCard.test.tsx portfolio-next/components/site/Realisations.test.tsx portfolio-next/content/projects/*.json && git commit -m "$(cat <<'EOF'
Extend project content model with rich text, features, and CTA fields

Adds year/problematique/approche (rich text)/features/screenshotsCount/
externalUrl to the Keystatic projects collection so the detail page
can render an editorial body, feature grid, and conditional CTA.
EOF
)"
```

---

### Task 2: Rebuild the page structure (breadcrumb, hero, editorial body, CTAs)

**Files:**
- Modify: `portfolio-next/app/projets/[slug]/page.tsx`
- Modify: `portfolio-next/app/projets/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `Project` (from Task 1) — all fields including `problematique()`/`approche()` async getters, `features: ProjectFeature[]`, `screenshotsCount: number`, `externalUrl: string`, `year: string`.
- Consumes (Task 3): `ProjectDetailReveal` from `@/components/site/ProjectDetailReveal` — wraps page content, no props besides `children`.
- Consumes (Task 4): `ProjectCarousel` from `@/components/site/ProjectCarousel` — prop `screenshotsCount: number`.
- Produces: nothing new consumed by later tasks (this is the top-level page).

This task writes `page.tsx` referencing `ProjectDetailReveal` and `ProjectCarousel`, which don't exist yet — so its test will fail until Tasks 3 and 4 land. Do Task 2's steps 1–3 (test + minimal stub components) first, then Tasks 3 and 4 replace the stubs, then Task 2's step 4 (final full test run) happens at the end of Task 4.

- [ ] **Step 1: Write the failing test for the new page content**

Replace the full contents of `portfolio-next/app/projets/[slug]/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import Page from "./page";
import { getProjects } from "@/content/projects";
import { notFound } from "next/navigation";

vi.mock("next/navigation", () => ({ notFound: vi.fn(), usePathname: () => "/projets/test" }));

describe("Project detail page", () => {
  it("renders the breadcrumb, hero, editorial body, features, and CTAs", async () => {
    const projects = await getProjects();
    const withLink = projects.find((p) => p.externalUrl)!;
    render(await Page({ params: Promise.resolve({ slug: withLink.slug }) }));

    expect(screen.getByRole("link", { name: "Projets" })).toHaveAttribute("href", "/projets");
    expect(screen.getByText(withLink.longName)).toBeInTheDocument();
    expect(screen.getByText(withLink.year)).toBeInTheDocument();
    // description is rendered twice (hero + editorial intro), hence getAllByText
    expect(screen.getAllByText(withLink.description).length).toBeGreaterThan(0);
    expect(screen.getByText("Problématique")).toBeInTheDocument();
    expect(screen.getByText("Approche et solution")).toBeInTheDocument();
    expect(screen.getByText("Fonctionnalités clés")).toBeInTheDocument();
    for (const feature of withLink.features) {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /Voir le projet/ })).toHaveAttribute(
      "href",
      withLink.externalUrl
    );
    expect(screen.getByRole("link", { name: "Me contacter" })).toHaveAttribute("href", "/#contact");
  });

  it("hides the external link CTA when externalUrl is empty", async () => {
    const projects = await getProjects();
    const withoutLink = projects.find((p) => !p.externalUrl)!;
    render(await Page({ params: Promise.resolve({ slug: withoutLink.slug }) }));

    expect(screen.queryByRole("link", { name: /Voir le projet/ })).not.toBeInTheDocument();
  });

  it("calls notFound for an unknown slug", async () => {
    await Page({ params: Promise.resolve({ slug: "unknown" }) });
    expect(notFound).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd portfolio-next && npx vitest run app/projets/[slug]/page.test.tsx`
Expected: FAIL — current `page.tsx` doesn't render a breadcrumb, editorial sections, features, or CTAs.

- [ ] **Step 3: Rebuild `page.tsx`**

Replace the full contents of `portfolio-next/app/projets/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Code, Layers, Rocket, Shield, Users, Zap, type LucideIcon } from "lucide-react";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ProjectDetailReveal } from "@/components/site/ProjectDetailReveal";
import { ProjectCarousel } from "@/components/site/ProjectCarousel";
import { getProjectBySlug } from "@/content/projects";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  layers: Layers,
  shield: Shield,
  rocket: Rocket,
  code: Code,
  users: Users,
};

const richTextRenderers = {
  block: {
    heading: ({ level, children }: { level: 1 | 2 | 3 | 4 | 5 | 6; children: React.ReactNode }) => {
      const Tag = `h${level}` as const;
      return <Tag className="mb-3 mt-6 font-extrabold tracking-tight text-ink first:mt-0">{children}</Tag>;
    },
    paragraph: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-4 text-[15px] leading-relaxed text-muted-2 last:mb-0">{children}</p>
    ),
    image: ({ src, alt }: { src: string; alt: string }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="mb-4 w-full rounded-2xl" />
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    notFound();
    return null;
  }

  const [problematique, approche] = await Promise.all([project.problematique(), project.approche()]);

  return (
    <ProjectDetailReveal>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-8 py-6 md:px-[120px]">
        <Nav />
        <div className="mx-auto w-full max-w-[820px]">
          <div
            className="sticky top-0 z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            style={{ backdropFilter: "blur(12px)", background: "rgba(247,245,240,0.75)" }}
          >
            <Link href="/projets" className="text-accent">
              Projets
            </Link>
            <span className="text-muted-2">/</span>
            <span className="text-ink">{project.name}</span>
          </div>

          <section
            className="rounded-[20px] px-16 py-20 text-center"
            style={{ background: project.bg, color: project.textColor }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] opacity-45">
              {project.name}
            </p>
            <h1 className="mb-2 text-5xl font-extrabold tracking-tight">{project.longName}</h1>
            <p className="mb-6 text-sm opacity-60">{project.year}</p>
            <p className="mx-auto max-w-[560px] text-base opacity-80">{project.description}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
            <div
              className="mx-auto mt-10 h-[260px] max-w-[680px] rounded-2xl"
              style={{ background: "rgba(255,255,255,0.12)" }}
            />
          </section>

          <div className="px-2 py-12">
            <p className="mb-8 text-[15px] leading-relaxed text-muted-2">{project.description}</p>

            <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-ink">Problématique</h2>
            <DocumentRenderer document={problematique} renderers={richTextRenderers} />

            <h2 className="mb-3 mt-10 text-2xl font-extrabold tracking-tight text-ink">
              Approche et solution
            </h2>
            <DocumentRenderer document={approche} renderers={richTextRenderers} />

            <h2 className="mb-4 mt-10 text-2xl font-extrabold tracking-tight text-ink">
              Fonctionnalités clés
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {project.features.map((feature) => {
                const Icon = FEATURE_ICONS[feature.icon] ?? Zap;
                return (
                  <div key={feature.title} className="rounded-2xl bg-page p-6">
                    <Icon size={36} className="mb-3 text-accent" />
                    <h3 className="mb-1 font-bold text-ink">{feature.title}</h3>
                    <p className="text-sm text-muted-2">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10">
              <ProjectCarousel screenshotsCount={project.screenshotsCount} bg={project.bg} />
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              {project.externalUrl && (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-accent px-8 py-4 text-[15px] font-bold text-ink"
                >
                  Voir le projet →
                </a>
              )}
              <Link
                href="/#contact"
                className="rounded-2xl bg-page px-8 py-4 text-[15px] font-bold text-ink"
              >
                Me contacter
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProjectDetailReveal>
  );
}
```

- [ ] **Step 4: Leave the test red for now**

This test will keep failing until `ProjectDetailReveal` (Task 3) and `ProjectCarousel` (Task 4) exist — do not attempt to fix or commit `page.tsx` alone. Proceed to Task 3.

---

### Task 3: `ProjectDetailReveal` — slide-in-from-right entrance animation

**Files:**
- Create: `portfolio-next/components/site/ProjectDetailReveal.tsx`
- Create: `portfolio-next/components/site/ProjectDetailReveal.test.tsx`
- Modify: `portfolio-next/app/globals.css`

**Interfaces:**
- Produces: `ProjectDetailReveal({ children }: { children: React.ReactNode })` — default export is a named export `ProjectDetailReveal`, consumed by `page.tsx` (Task 2) as `<ProjectDetailReveal>{...}</ProjectDetailReveal>`.

- [ ] **Step 1: Write the failing test**

Create `portfolio-next/components/site/ProjectDetailReveal.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { ProjectDetailReveal } from "./ProjectDetailReveal";

describe("ProjectDetailReveal", () => {
  it("renders its children", () => {
    render(
      <ProjectDetailReveal>
        <p>Contenu du projet</p>
      </ProjectDetailReveal>
    );
    expect(screen.getByText("Contenu du projet")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd portfolio-next && npx vitest run components/site/ProjectDetailReveal.test.tsx`
Expected: FAIL — `./ProjectDetailReveal` doesn't exist yet (module not found).

- [ ] **Step 3: Implement `ProjectDetailReveal`**

Create `portfolio-next/components/site/ProjectDetailReveal.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";

export function ProjectDetailReveal({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Double rAF: a single rAF can fire before the browser paints the
    // initial (off-screen) state, so the slide-in transition never renders.
    let innerId = 0;
    const outerId = requestAnimationFrame(() => {
      innerId = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(outerId);
      cancelAnimationFrame(innerId);
    };
  }, []);

  return (
    <div className={`project-detail-reveal ${visible ? "project-detail-reveal-visible" : ""}`}>
      {children}
    </div>
  );
}
```

Add these rules to `portfolio-next/app/globals.css` (near the existing `.hero-section` rules, e.g. after line 216):

```css
.project-detail-reveal {
  transform: translateX(100%);
  transition: transform 0.48s cubic-bezier(0.22, 0.9, 0.25, 1);
}
.project-detail-reveal.project-detail-reveal-visible {
  transform: translateX(0);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd portfolio-next && npx vitest run components/site/ProjectDetailReveal.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd "/Users/gautier/Documents/projets/Portfolio interface edit" && git add portfolio-next/components/site/ProjectDetailReveal.tsx portfolio-next/components/site/ProjectDetailReveal.test.tsx portfolio-next/app/globals.css && git commit -m "$(cat <<'EOF'
Add ProjectDetailReveal slide-in entrance animation

Mirrors the double-rAF reveal pattern from Hero.tsx so the project
detail page slides in from the right on mount.
EOF
)"
```

---

### Task 4: `ProjectCarousel` — screenshot carousel

**Files:**
- Create: `portfolio-next/components/site/ProjectCarousel.tsx`
- Create: `portfolio-next/components/site/ProjectCarousel.test.tsx`

**Interfaces:**
- Produces: `ProjectCarousel({ screenshotsCount, bg }: { screenshotsCount: number; bg: string })`, consumed by `page.tsx` (Task 2) as `<ProjectCarousel screenshotsCount={project.screenshotsCount} bg={project.bg} />`.

- [ ] **Step 1: Write the failing test**

Create `portfolio-next/components/site/ProjectCarousel.test.tsx`:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectCarousel } from "./ProjectCarousel";

describe("ProjectCarousel", () => {
  it("shows the counter and navigates with next/prev and dots", () => {
    render(<ProjectCarousel screenshotsCount={3} bg="#1A1A2E" />);

    expect(screen.getByText("1 / 3")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Suivant" }));
    expect(screen.getByText("2 / 3")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Précédent" }));
    expect(screen.getByText("1 / 3")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Capture 3" }));
    expect(screen.getByText("3 / 3")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Suivant" }));
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd portfolio-next && npx vitest run components/site/ProjectCarousel.test.tsx`
Expected: FAIL — `./ProjectCarousel` doesn't exist yet (module not found).

- [ ] **Step 3: Implement `ProjectCarousel`**

Create `portfolio-next/components/site/ProjectCarousel.tsx`:

```tsx
"use client";
import { useState } from "react";

export function ProjectCarousel({
  screenshotsCount,
  bg,
}: {
  screenshotsCount: number;
  bg: string;
}) {
  const [idx, setIdx] = useState(0);

  const goTo = (next: number) => {
    setIdx(((next % screenshotsCount) + screenshotsCount) % screenshotsCount);
  };

  return (
    <div className="relative h-[320px] overflow-hidden rounded-2xl" style={{ background: "#F7F5F0" }}>
      {Array.from({ length: screenshotsCount }, (_, i) => (
        <div
          key={i}
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-[400ms]"
          style={{ opacity: i === idx ? 1 : 0, pointerEvents: i === idx ? "auto" : "none", background: bg }}
        >
          <span className="text-sm font-semibold text-white/70">Capture {i + 1}</span>
        </div>
      ))}

      <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white">
        {idx + 1} / {screenshotsCount}
      </span>

      <button
        type="button"
        aria-label="Précédent"
        onClick={() => goTo(idx - 1)}
        className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg"
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Suivant"
        onClick={() => goTo(idx + 1)}
        className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg"
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {Array.from({ length: screenshotsCount }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Capture ${i + 1}`}
            onClick={() => goTo(i)}
            className="h-2 rounded-full transition-all"
            style={{
              width: i === idx ? 20 : 8,
              background: i === idx ? "#1D1D1F" : "rgba(29,29,31,0.25)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd portfolio-next && npx vitest run components/site/ProjectCarousel.test.tsx`
Expected: PASS.

- [ ] **Step 5: Run the full suite, including the page test from Task 2**

Run: `cd portfolio-next && npx vitest run`
Expected: PASS for every test file, including `app/projets/[slug]/page.test.tsx` (now that `ProjectDetailReveal` and `ProjectCarousel` both exist).

- [ ] **Step 6: Manual visual check**

Run: `cd portfolio-next && npm run dev`, open `http://localhost:3000/projets`, click into a project card, and confirm: the page slides in from the right, the breadcrumb stays pinned while scrolling to the footer, the features grid shows icons, the carousel arrows/dots/counter work, and the "Voir le projet" button only appears for `projet-deux`. Stop the dev server after checking (Ctrl+C).

- [ ] **Step 7: Commit**

```bash
cd "/Users/gautier/Documents/projets/Portfolio interface edit" && git add portfolio-next/components/site/ProjectCarousel.tsx portfolio-next/components/site/ProjectCarousel.test.tsx portfolio-next/app/projets/\[slug\]/page.tsx portfolio-next/app/projets/\[slug\]/page.test.tsx && git commit -m "$(cat <<'EOF'
Rebuild project detail page with editorial body and screenshot carousel

Adds the breadcrumb, problematique/approche rich text sections,
features grid, ProjectCarousel, and conditional CTAs, wired through
the extended project content model.
EOF
)"
```
