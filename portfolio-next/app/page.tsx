import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Bio } from "@/components/site/Bio";
import { Realisations } from "@/components/site/Realisations";
import { Playground } from "@/components/site/Playground";
import { Footer } from "@/components/site/Footer";

export default function Page() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-8 py-6 md:px-[120px]">
      <Nav />
      <Hero />
      <Bio />
      <Realisations />
      <Playground />
      <Footer />
    </div>
  );
}
