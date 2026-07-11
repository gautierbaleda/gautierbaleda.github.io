import { render, screen, fireEvent } from "@testing-library/react";
import { Realisations } from "./Realisations";
import type { Project } from "@/content/projects";

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

describe("Realisations", () => {
  it("shows the waiting state by default and swaps to a project on hover", () => {
    render(<Realisations projects={projects} />);
    expect(screen.getByText("Survole un projet")).toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByTestId(`project-row-${projects[0].slug}`));
    expect(screen.getAllByText(projects[0].longName).length).toBeGreaterThan(0);
  });
});
