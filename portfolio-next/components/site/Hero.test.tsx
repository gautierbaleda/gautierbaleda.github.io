import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the name, role, and subtitle", () => {
    render(<Hero />);
    expect(screen.getByText("Gautier Baleda")).toBeInTheDocument();
    expect(screen.getByText("Product Builder")).toBeInTheDocument();
    expect(screen.getByText("Je construis des outils sur mesure")).toBeInTheDocument();
  });
});
