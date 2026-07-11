import { render, screen } from "@testing-library/react";
import Page from "./page";
import { getProjects } from "@/content/projects";
import { notFound } from "next/navigation";

vi.mock("next/navigation", () => ({ notFound: vi.fn(), usePathname: () => "/projets/test" }));

describe("Project detail page", () => {
  it("renders the breadcrumb, hero, editorial body, features, and CTAs", async () => {
    const projects = await getProjects();
    const withLink = projects.find((p) => p.externalUrl)!;
    render(await Page({ params: Promise.resolve({ slug: withLink.slug }) }));

    expect(
      screen.getAllByRole("link", { name: "Projets" }).find((el) => el.getAttribute("href") === "/#projets")
    ).toHaveAttribute("href", "/#projets");
    expect(screen.getByText(withLink.longName)).toBeInTheDocument();
    expect(screen.getByText(withLink.year)).toBeInTheDocument();
    // description is rendered twice (hero + editorial intro), hence getAllByText
    expect(screen.getAllByText(withLink.description).length).toBeGreaterThan(0);
    expect(screen.getByText("Problématique")).toBeInTheDocument();
    expect(screen.getByText("Approche et solution")).toBeInTheDocument();
    expect(screen.getByText("Fonctionnalités clés")).toBeInTheDocument();
    for (const feature of withLink.features) {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /Voir le projet/ })).toHaveAttribute(
      "href",
      withLink.externalUrl
    );
    expect(screen.getByRole("link", { name: "Me contacter" })).toHaveAttribute("href", "/#contact");
  });

  it("hides the external link CTA when externalUrl is empty", async () => {
    const projects = await getProjects();
    const withoutLink = projects.find((p) => !p.externalUrl)!;
    render(await Page({ params: Promise.resolve({ slug: withoutLink.slug }) }));

    expect(screen.queryByRole("link", { name: /Voir le projet/ })).not.toBeInTheDocument();
  });

  it("calls notFound for an unknown slug", async () => {
    await Page({ params: Promise.resolve({ slug: "unknown" }) });
    expect(notFound).toHaveBeenCalled();
  });
});
