import { render, screen, fireEvent } from "@testing-library/react";
import { Realisations } from "./Realisations";
import type { ProjectSummary } from "@/content/projects";

const projects: ProjectSummary[] = [
  {
    slug: "projet-un",
    visible: true,
    ordre: 1,
    name: "PROJET 1",
    longName: "Projet Un",
    description: "Description courte.",
    hoverImage: null,
    pageImage: null,
    tags: ["No-code"],
    bg: "#1A1A2E",
    textColor: "#FFFFFF",
    year: "2025",
    features: [],
    screenshots: [],
    videos: [],
    externalUrl: "",
  },
];

describe("Realisations", () => {
  it("selects the first project by default", () => {
    render(<Realisations projects={projects} />);
    expect(screen.getByLabelText(`Voir le projet ${projects[0].longName}`)).toBeInTheDocument();
    expect(screen.queryByText("Sélectionne un projet")).not.toBeInTheDocument();
  });

  it("shows the waiting state when clicking elsewhere, and reselects on click", () => {
    render(<Realisations projects={projects} />);
    fireEvent.pointerDown(document.body);
    expect(screen.getByText("Sélectionne un projet")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(`project-row-${projects[0].slug}`));
    expect(screen.getByLabelText(`Voir le projet ${projects[0].longName}`)).toBeInTheDocument();
  });

  it("does not change selection on hover", () => {
    render(<Realisations projects={projects} />);
    fireEvent.pointerDown(document.body);
    fireEvent.mouseEnter(screen.getByTestId(`project-row-${projects[0].slug}`));
    expect(screen.getByText("Sélectionne un projet")).toBeInTheDocument();
  });

  it("selects projects one by one as the page scrolls", () => {
    const two = [projects[0], { ...projects[0], slug: "projet-deux", longName: "Projet Deux" }];
    render(<Realisations projects={two} />);
    Object.defineProperty(window, "scrollY", { value: 10_000, configurable: true });
    fireEvent.scroll(window);
    expect(screen.getByLabelText("Voir le projet Projet Deux")).toBeInTheDocument();
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    fireEvent.scroll(window);
    expect(screen.getByLabelText(`Voir le projet ${projects[0].longName}`)).toBeInTheDocument();
  });
});
