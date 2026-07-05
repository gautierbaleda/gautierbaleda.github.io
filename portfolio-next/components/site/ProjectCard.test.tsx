import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import { projects } from "@/content/projects";

describe("ProjectCard", () => {
  it("links to the project's detail page", () => {
    render(<ProjectCard project={projects[0]} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", `/projets/${projects[0].slug}`);
    expect(screen.getByText(projects[0].longName)).toBeInTheDocument();
  });
});
