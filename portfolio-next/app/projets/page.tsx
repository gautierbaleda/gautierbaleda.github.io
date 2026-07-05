import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ProjectCard } from "@/components/site/ProjectCard";
import { projects } from "@/content/projects";

export default function Page() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-8 py-6 md:px-[120px]">
      <Nav />
      <section className="rounded-[20px] px-10 py-16">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-accent">
          MES RÉALISATIONS
        </p>
        <h1 className="mb-10 text-4xl font-extrabold tracking-tight text-ink">
          Projets &amp; Use case
        </h1>
        <div className="grid grid-cols-2 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
