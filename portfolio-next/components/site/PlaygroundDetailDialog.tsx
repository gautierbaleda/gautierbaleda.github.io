import { DocumentRenderer } from "@keystatic/core/renderer";
import type { DocumentElement } from "@keystatic/core";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.53-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.43-2.7 5.41-5.28 5.69.42.36.79 1.07.79 2.17 0 1.57-.01 2.83-.01 3.22 0 .31.21.67.8.56C20.21 21.38 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

const richTextRenderers = {
  block: {
    heading: ({ level, children }: { level: 1 | 2 | 3 | 4 | 5 | 6; children: React.ReactNode }) => {
      const Tag = `h${level}` as const;
      return <Tag className="mb-2 mt-4 font-extrabold tracking-tight text-ink first:mt-0">{children}</Tag>;
    },
    paragraph: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-3 text-[14px] leading-relaxed text-muted-2 last:mb-0">{children}</p>
    ),
  },
};

export function PlaygroundDetailDialog({
  open,
  onOpenChange,
  title,
  tools,
  image,
  bg,
  descriptionLongue,
  githubUrl,
  externalUrl,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  tools: string[];
  image: string | null;
  bg: string;
  descriptionLongue: DocumentElement[];
  githubUrl: string;
  externalUrl: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="flex items-center justify-center rounded-l-2xl p-8 sm:min-h-[420px]" style={{ background: bg }}>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={title} className="max-h-full w-full rounded-xl object-contain" />
            ) : (
              <div className="aspect-[3/4] w-full max-w-[220px] rounded-xl bg-white/10" />
            )}
          </div>

          <div className="flex flex-col p-8">
            <DialogTitle>{title}</DialogTitle>

            <div className="mb-4 mt-3 flex flex-wrap gap-2">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-ink/70"
                >
                  {tool}
                </span>
              ))}
            </div>

            <div className="flex-1">
              <DocumentRenderer document={descriptionLongue} renderers={richTextRenderers} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-accent px-6 py-3 text-sm font-bold text-ink"
                >
                  Tester le projet →
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-black/10 px-4 py-3 text-sm font-bold text-ink"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
