import { render, screen } from "@testing-library/react";
import Page from "./page";
import { projects } from "@/content/projects";
import { notFound } from "next/navigation";

vi.mock("next/navigation", () => ({ notFound: vi.fn(), usePathname: () => "/projets/test" }));

describe("Project detail page", () => {
  it("renders the project's long name and description", async () => {
    render(await Page({ params: Promise.resolve({ slug: projects[0].slug }) }));
    expect(screen.getByText(projects[0].longName)).toBeInTheDocument();
    expect(screen.getByText(projects[0].description)).toBeInTheDocument();
  });

  it("calls notFound for an unknown slug", async () => {
    await Page({ params: Promise.resolve({ slug: "unknown" }) });
    expect(notFound).toHaveBeenCalled();
  });
});
