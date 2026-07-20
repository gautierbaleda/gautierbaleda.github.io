import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Home page", () => {
  it("renders every section in order", async () => {
    render(await Page());
    expect(screen.getByText("Gautier Baleda")).toBeInTheDocument();
    expect(screen.getByText("Un Product Builder passionné par l'impact")).toBeInTheDocument();
    expect(screen.getByText("Projets & Use case")).toBeInTheDocument();
    expect(screen.getByText("Petites apps à tester")).toBeInTheDocument();
    expect(screen.getByText("Un projet en tête ?")).toBeInTheDocument();
  });
});
