import { notFound } from "next/navigation";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getProjectBySlug } from "@/content/projects";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    notFound();
    return null;
  }

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-8 py-6 md:px-[120px]">
      <Nav />
      <section
        className="rounded-[20px] px-16 py-20 text-center"
        style={{ background: project.bg, color: project.textColor }}
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] opacity-45">
          {project.name}
        </p>
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight">{project.longName}</h1>
        <p className="mx-auto max-w-[560px] text-base opacity-80">{project.description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              {tag}
            </span>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
