import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the email link and copyright", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /envoyer un email/i })).toHaveAttribute(
      "href",
      "mailto:gautier.baleda@gmail.com"
    );
    expect(screen.getByText(/© 2025 Gautier Baleda/)).toBeInTheDocument();
  });
});
