import { render, screen } from "@testing-library/react";
import Page from "./page";
import { projects } from "@/content/projects";

describe("Projets page", () => {
  it("renders a card for every project", () => {
    render(<Page />);
    for (const p of projects) {
      expect(screen.getByText(p.longName)).toBeInTheDocument();
    }
  });
});
