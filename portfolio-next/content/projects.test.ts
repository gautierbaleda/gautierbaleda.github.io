import { projects, getProjectBySlug } from "./projects";

describe("projects content", () => {
  it("has at least one project with the required fields", () => {
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(p.slug).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.tags.length).toBeGreaterThan(0);
    }
  });

  it("looks up a project by slug", () => {
    const first = projects[0];
    expect(getProjectBySlug(first.slug)).toEqual(first);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });
});
