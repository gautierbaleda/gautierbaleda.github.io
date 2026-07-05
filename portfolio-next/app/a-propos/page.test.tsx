import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("À propos page", () => {
  it("renders the name, role, and each work experience", () => {
    render(<Page />);
    expect(screen.getByText("Designer & Développeur")).toBeInTheDocument();
    expect(screen.getByText("Dorêka · Paris")).toBeInTheDocument();
    expect(screen.getByText("Carrefour · Massy")).toBeInTheDocument();
    expect(screen.getAllByText("Enedis · Lyon").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Casino · Saint-Étienne")).toBeInTheDocument();
    expect(screen.getByText("Musique")).toBeInTheDocument();
    expect(screen.getByText("Gaming & Mangas")).toBeInTheDocument();
    expect(screen.getByText("Associations")).toBeInTheDocument();
  });
});
