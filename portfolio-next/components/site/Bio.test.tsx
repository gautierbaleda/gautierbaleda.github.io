import { render, screen } from "@testing-library/react";
import { Bio } from "./Bio";

describe("Bio", () => {
  it("renders the qui-suis-je heading and body copy", () => {
    render(<Bio />);
    expect(
      screen.getByText("Un Product Builder passionné par l'impact")
    ).toBeInTheDocument();
    expect(screen.getByText(/approche hybride/)).toBeInTheDocument();
  });
});
