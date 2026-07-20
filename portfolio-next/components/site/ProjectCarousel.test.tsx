import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectCarousel } from "./ProjectCarousel";

describe("ProjectCarousel", () => {
  it("shows the counter and navigates with next/prev and dots", () => {
    render(
      <ProjectCarousel
        screenshots={["/images/projects/screenshots/one.png", "/images/projects/screenshots/two.png", "/images/projects/screenshots/three.png"]}
      />
    );

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
