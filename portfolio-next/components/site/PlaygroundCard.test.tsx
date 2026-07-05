import { render, screen, fireEvent } from "@testing-library/react";
import { PlaygroundCard } from "./PlaygroundCard";

describe("PlaygroundCard", () => {
  it("shows the front content and reveals the back on hover", () => {
    render(
      <PlaygroundCard
        tool="Weweb"
        title="Tickly"
        description="Minuteur Pomodoro."
        front={<p>25:00</p>}
        span={2}
      />
    );
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
});
