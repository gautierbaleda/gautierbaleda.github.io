import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Bio } from "@/components/site/Bio";
import { Realisations } from "@/components/site/Realisations";
import { Playground } from "@/components/site/Playground";
import { Footer } from "@/components/site/Footer";
import { getProjectSummaries } from "@/content/projects";

export default async function Page() {
  const projects = await getProjectSummaries();
  const playground = await Playground();

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-4 sm:px-8 sm:py-6 lg:px-[120px]">
      <Nav />
      <Hero />
      <Bio />
      <Realisations projects={projects} />
      {playground}
      <Footer />
    </div>
  );
}
