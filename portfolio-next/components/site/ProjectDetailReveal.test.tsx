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
