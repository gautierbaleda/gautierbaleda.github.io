import { render, screen } from "@testing-library/react";
import { Playground } from "./Playground";

describe("Playground", () => {
  it("renders the section heading and all four apps", () => {
    render(<Playground />);
    expect(screen.getByText("Petites apps à tester")).toBeInTheDocument();
    expect(screen.getByText("Tickly")).toBeInTheDocument();
    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByText("CoolFit")).toBeInTheDocument();
    expect(screen.getByText("Kumai")).toBeInTheDocument();
  });
});
