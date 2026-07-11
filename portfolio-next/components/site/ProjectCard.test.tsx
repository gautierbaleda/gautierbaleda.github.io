import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/content/projects";

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

describe("ProjectCard", () => {
  it("links to the project's detail page", () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", `/projets/${project.slug}`);
    expect(screen.getByText(project.longName)).toBeInTheDocument();
  });
});
