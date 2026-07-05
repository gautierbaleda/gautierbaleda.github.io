import { render, screen, fireEvent } from "@testing-library/react";
import { Realisations } from "./Realisations";
import { projects } from "@/content/projects";

describe("Realisations", () => {
  it("shows the waiting state by default and swaps to a project on hover", () => {
    render(<Realisations />);
    expect(screen.getByText("Survole un projet")).toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByTestId(`project-row-${projects[0].slug}`));
    expect(screen.getAllByText(projects[0].longName).length).toBeGreaterThan(0);
  });
});
