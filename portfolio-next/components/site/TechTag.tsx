import {
  siAirtable,
  siFillout,
  siMake,
  siN8n,
  siNotion,
  siPwa,
  siReact,
  siSpotify,
  siSupabase,
  siTypescript,
  siVite,
} from "simple-icons";

const TAG_ICONS: Record<string, { path: string }> = {
  Airtable: siAirtable,
  Fillout: siFillout,
  Make: siMake,
  n8n: siN8n,
  "Notion API": siNotion,
  PWA: siPwa,
  React: siReact,
  "Spotify API": siSpotify,
  Supabase: siSupabase,
  TypeScript: siTypescript,
  Vite: siVite,
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
