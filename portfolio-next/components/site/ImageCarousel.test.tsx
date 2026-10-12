import { render, screen, fireEvent } from "@testing-library/react";
import { ImageCarousel } from "./ImageCarousel";

describe("ImageCarousel", () => {
  it("shows the counter and navigates with next/prev and dots", () => {
    render(
      <ImageCarousel
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

  it("shows videos before screenshots", () => {
    const { container } = render(
      <ImageCarousel
        videos={["/videos/projects/demo/videos/0.mp4"]}
        screenshots={["/images/projects/screenshots/one.png"]}
      />
    );

    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(container.querySelector("video")).toHaveAttribute("src", "/videos/projects/demo/videos/0.mp4");
    expect(screen.getByRole("button", { name: "Vidéo 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Capture 2" })).toBeInTheDocument();
  });
});
