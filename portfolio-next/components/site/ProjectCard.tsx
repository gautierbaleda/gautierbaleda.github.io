import Link from "next/link";
import type { Project } from "@/content/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projets/${project.slug}`}
      className="block rounded-2xl p-8 transition-transform hover:-translate-y-1"
      style={{ background: project.bg, color: project.textColor }}
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] opacity-45">
        {project.name}
      </p>
      <h3 className="mb-3 text-2xl font-extrabold tracking-tight">{project.longName}</h3>
      <p className="mb-5 text-sm opacity-70">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
