import { FileText, Mic, Heart, Swords, Palette, Timer, Grid3x3, type LucideIcon } from "lucide-react";
import { PlaygroundCard } from "./PlaygroundCard";
import { getPlaygroundApps } from "@/content/playground";

function IconFront({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/5">
      <Icon className="h-9 w-9 text-ink" strokeWidth={1.75} />
    </div>
  );
}

const PRESENTATION: Record<string, { front: React.ReactNode }> = {
  docflow: {
    front: <IconFront icon={FileText} />,
  },
  speakin: {
    front: <IconFront icon={Mic} />,
  },
  "faire-part-m-et-g": {
    front: <IconFront icon={Heart} />,
  },
  "epic-rubic": {
    front: <IconFront icon={Swords} />,
  },
  chromapix: {
    front: <IconFront icon={Palette} />,
  },
  gogodoro: {
    front: <IconFront icon={Timer} />,
  },
  "morpion-multijoueur": {
    front: <IconFront icon={Grid3x3} />,
  },
};

export async function Playground() {
  const apps = await getPlaygroundApps();

  return (
    <section id="play" className="rounded-[20px] px-10 py-10">
      <div className="mb-7">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-accent">
          PLAYGROUND
        </p>
        <h2 className="mb-1 text-2xl font-bold text-ink">Petites apps à tester</h2>
        <p className="text-sm text-muted">Des projets rapides, curieux, souvent utiles.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {await Promise.all(
          apps.map(async (app) => {
            const presentation = PRESENTATION[app.slug];
            if (!presentation) return null;
            const descriptionLongue = await app.descriptionLongue();
            return (
              <PlaygroundCard
                key={app.slug}
                tool={app.tools.join(", ")}
                tools={app.tools}
                title={app.title}
                description={app.description}
                descriptionLongue={descriptionLongue}
                image={app.image}
                video={app.video}
                screenshots={app.screenshots}
                githubUrl={app.githubUrl}
                externalUrl={app.externalUrl}
                bg={app.bg}
                front={presentation.front}
              />
            );
          })
        )}
        <div className="relative col-span-3 flex h-[200px] items-center overflow-hidden rounded-2xl px-12">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(45deg, rgba(255,200,0,0.10), rgba(255,200,0,0.10) 1px, transparent 1px, transparent 24px)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4">
            <div className="pharamp-walker" />
          </div>
        </div>
      </div>
    </section>
  );
}
