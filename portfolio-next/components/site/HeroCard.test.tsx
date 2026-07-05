import { render, screen } from "@testing-library/react";
import { HeroCard } from "./HeroCard";

describe("HeroCard", () => {
  it("renders the label for a given variant", () => {
    render(<HeroCard variant="bricks" label="Concevoir" />);
    expect(screen.getByText("Concevoir")).toBeInTheDocument();
  });
});
