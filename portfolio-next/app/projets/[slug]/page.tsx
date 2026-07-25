import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Code, Layers, Rocket, Shield, Users, Zap, type LucideIcon } from "lucide-react";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ProjectDetailReveal } from "@/components/site/ProjectDetailReveal";
import { ImageCarousel } from "@/components/site/ImageCarousel";
import { getProjectBySlug } from "@/content/projects";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  layers: Layers,
  shield: Shield,
  rocket: Rocket,
  code: Code,
  users: Users,
};

const richTextRenderers = {
  block: {
    heading: ({ level, children }: { level: 1 | 2 | 3 | 4 | 5 | 6; children: React.ReactNode }) => {
      const Tag = `h${level}` as const;
      return <Tag className="mb-3 mt-6 font-extrabold tracking-tight text-ink first:mt-0">{children}</Tag>;
    },
    paragraph: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-4 text-[15px] leading-relaxed text-muted-2 last:mb-0">{children}</p>
    ),
    image: ({ src, alt }: { src: string; alt: string }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="mb-4 w-full rounded-2xl" />
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    notFound();
    return null;
  }

  const [problematique, approche, descriptionLongue] = await Promise.all([
    project.problematique(),
    project.approche(),
    project.descriptionLongue(),
  ]);

  return (
    <ProjectDetailReveal>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-8 py-6 md:px-[120px]">
        <Nav />
        <div className="mx-auto w-full max-w-[820px]">
          <div
            className="sticky top-[100px] z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            style={{ backdropFilter: "blur(12px)", background: "rgba(247,245,240,0.75)" }}
          >
            <Link href="/#projets" className="text-accent">
              Projets
            </Link>
            <span className="text-muted-2">/</span>
            <span className="text-ink">{project.name}</span>
          </div>

          <section
            className="rounded-[20px] px-16 py-20 text-center"
            style={{ background: project.bg, color: project.textColor }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] opacity-45">
              {project.name}
            </p>
            <h1 className="mb-2 text-5xl font-extrabold tracking-tight">{project.longName}</h1>
            <p className="mb-6 text-sm opacity-60">{project.year}</p>
            <p className="mx-auto max-w-[560px] text-base opacity-80">{project.description}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
            {project.hoverImage ? (
              <div className="relative mx-auto mt-10 aspect-[2/3] w-full max-w-[320px] overflow-hidden rounded-2xl">
                <Image
                  src={project.hoverImage}
                  alt={project.longName}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className="mx-auto mt-10 h-[260px] max-w-[680px] rounded-2xl"
                style={{ background: "rgba(255,255,255,0.12)" }}
              />
            )}
          </section>

          <div className="px-2 py-12">
            <div className="mb-8">
              <DocumentRenderer document={descriptionLongue} renderers={richTextRenderers} />
            </div>

            <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-ink">Problématique</h2>
            <DocumentRenderer document={problematique} renderers={richTextRenderers} />

            <h2 className="mb-3 mt-10 text-2xl font-extrabold tracking-tight text-ink">
              Approche et solution
            </h2>
            <DocumentRenderer document={approche} renderers={richTextRenderers} />

            <h2 className="mb-4 mt-10 text-2xl font-extrabold tracking-tight text-ink">
              Fonctionnalités clés
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {project.features.map((feature) => {
                const Icon = FEATURE_ICONS[feature.icon] ?? Zap;
                return (
                  <div key={feature.title} className="rounded-2xl bg-card p-6">
                    <Icon size={36} className="mb-3 text-accent" />
                    <h3 className="mb-1 font-bold text-ink">{feature.title}</h3>
                    <p className="text-sm text-muted-2">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            {project.screenshots.length > 0 && (
              <div className="mt-10">
                <ImageCarousel screenshots={project.screenshots} />
              </div>
            )}

            <div className="mt-12 flex flex-wrap gap-3">
              {project.externalUrl && (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-accent px-8 py-4 text-[15px] font-bold text-ink"
                >
                  Voir le projet →
                </a>
              )}
              <Link
                href="/#contact"
                className="rounded-2xl bg-card px-8 py-4 text-[15px] font-bold text-ink"
              >
                Me contacter
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProjectDetailReveal>
  );
}
