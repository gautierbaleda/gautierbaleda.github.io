import {
  siAirtable,
  siClaude,
  siFillout,
  siGsap,
  siGooglegemini,
  siMake,
  siN8n,
  siNextdotjs,
  siNotion,
  siPwa,
  siReact,
  siSpotify,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVite,
  siWordpress,
} from "simple-icons";

const TAG_ICONS: Record<string, { path: string }> = {
  Airtable: siAirtable,
  "Claude Design": siClaude,
  Fillout: siFillout,
  GSAP: siGsap,
  Gemini: siGooglegemini,
  Make: siMake,
  n8n: siN8n,
  "Next.js": siNextdotjs,
  "Notion API": siNotion,
  PWA: siPwa,
  React: siReact,
  "Spotify API": siSpotify,
  Supabase: siSupabase,
  "Tailwind CSS": siTailwindcss,
  TypeScript: siTypescript,
  Vite: siVite,
  WordPress: siWordpress,
};

export function TechTag({ tag }: { tag: string }) {
  const icon = TAG_ICONS[tag];

  return (
    <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
      {icon ? (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 shrink-0"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={icon.path} />
        </svg>
      ) : null}
      {tag}
    </span>
  );
}
