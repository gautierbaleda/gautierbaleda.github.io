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
      expect(Array.isArray(p.screenshots)).toBe(true);
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
      screenshots: first.screenshots,
      externalUrl: first.externalUrl,
    });
    expect(await bySlug!.problematique()).toEqual(await first.problematique());
    expect(await bySlug!.approche()).toEqual(await first.approche());
  });

  it("returns undefined for an unknown slug", async () => {
    expect(await getProjectBySlug("does-not-exist")).toBeUndefined();
  });
});
