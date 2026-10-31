import { fireEvent, render, screen } from "@testing-library/react";
import { Expertise } from "./Expertise";

describe("Expertise", () => {
  it("renders the three expertise panels with their taglines", () => {
    render(<Expertise />);
    expect(screen.getByText("Ce que je peux construire pour vous")).toBeInTheDocument();
    expect(screen.getByText("Automatisation")).toBeInTheDocument();
    expect(screen.getByText("Applications web")).toBeInTheDocument();
    expect(screen.getByText("Agents IA")).toBeInTheDocument();
    expect(screen.getByText(/Fini le copier-coller entre vos logiciels/)).toBeInTheDocument();
  });

  it("opens the first panel by default and switches on click", () => {
    render(<Expertise />);
    const automation = screen.getByRole("button", { name: /Automatisation/ });
    const agents = screen.getByRole("button", { name: /Agents IA/ });
    expect(automation).toHaveAttribute("aria-expanded", "true");
    expect(agents).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(agents);
    expect(agents).toHaveAttribute("aria-expanded", "true");
    expect(automation).toHaveAttribute("aria-expanded", "false");
  });
});
