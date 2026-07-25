import { render, screen, fireEvent } from "@testing-library/react";
import { PlaygroundCard } from "./PlaygroundCard";

const descriptionLongue = [
  { type: "paragraph", children: [{ text: "Description longue de Tickly." }] },
];

function renderCard(overrides: Partial<React.ComponentProps<typeof PlaygroundCard>> = {}) {
  return render(
    <PlaygroundCard
      tool="Weweb"
      tools={["Weweb"]}
      title="Tickly"
      description="Minuteur Pomodoro."
      descriptionLongue={descriptionLongue as never}
      image={null}
      screenshots={[]}
      githubUrl=""
      externalUrl=""
      bg="#F0CD6E"
      front={<p>25:00</p>}
      {...overrides}
    />
  );
}

describe("PlaygroundCard", () => {
  it("shows the front content and reveals the back on hover", () => {
    renderCard();
    expect(screen.getByText("25:00")).toBeInTheDocument();
    expect(screen.getByText("Tickly")).toBeInTheDocument();

    fireEvent.mouseMove(screen.getByTestId("playground-card-Tickly"), {
      clientX: 10,
      clientY: 10,
    });
    expect(screen.getByTestId("playground-card-Tickly")).toHaveStyle({
      cursor: "pointer",
    });
  });

  it("opens a detail dialog with tools, long description and links on click", () => {
    renderCard({ githubUrl: "https://github.com/example/tickly", externalUrl: "https://tickly.app" });

    fireEvent.click(screen.getByTestId("playground-card-Tickly"));

    expect(screen.getByText("Description longue de Tickly.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Tester le projet/i })).toHaveAttribute(
      "href",
      "https://tickly.app"
    );
    expect(screen.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/example/tickly"
    );
  });

  it("hides the external and GitHub links when their URLs are empty", () => {
    renderCard();

    fireEvent.click(screen.getByTestId("playground-card-Tickly"));

    expect(screen.queryByRole("link", { name: /Tester le projet/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /GitHub/i })).not.toBeInTheDocument();
  });
});
