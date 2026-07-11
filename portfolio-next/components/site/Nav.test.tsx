import { render, screen } from "@testing-library/react";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders all nav links and the brand", () => {
    render(<Nav />);
    expect(screen.getByText("gautier baleda")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Projets" })).toHaveAttribute("href", "/#projets");
    expect(screen.getByRole("link", { name: "Playground" })).toHaveAttribute("href", "/#play");
    expect(screen.getByRole("link", { name: "À Propos" })).toHaveAttribute("href", "/a-propos");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/#contact");
  });
});
