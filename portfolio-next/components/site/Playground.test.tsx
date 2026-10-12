import { render, screen } from "@testing-library/react";
import { Playground } from "./Playground";

describe("Playground", () => {
  it("renders the section heading and all six apps", async () => {
    render(await Playground());
    expect(screen.getByText("Petites apps à tester")).toBeInTheDocument();
    expect(screen.getByText("DocFlow")).toBeInTheDocument();
    expect(screen.getByText("SpeakIn")).toBeInTheDocument();
    expect(screen.getByText("Faire-part M & G")).toBeInTheDocument();
    expect(screen.getByText("Epic Rubic")).toBeInTheDocument();
    expect(screen.getByText("Chromapix")).toBeInTheDocument();
    expect(screen.getByText("Gogodoro")).toBeInTheDocument();
  });
});
