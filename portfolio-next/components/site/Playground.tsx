import { PlaygroundCard } from "./PlaygroundCard";

export function Playground() {
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
        <PlaygroundCard
          span={2}
          bg="linear-gradient(135deg, #F5E1A0, #EACB6E)"
          tool="Weweb"
          title="Tickly"
          description="Minuteur Pomodoro minimaliste avec sessions configurables et historique de productivité."
          front={
            <div className="rounded-2xl bg-white px-9 py-6 text-center shadow-lg">
              <p className="font-mono text-4xl font-bold text-ink">25:00</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.06em] text-muted-2">
                Pomodoro · En cours
              </p>
            </div>
          }
        />
        <PlaygroundCard
          span={1}
          dark
          bg="#CDDCF7"
          tool="Flutterflow"
          title="Tasks"
          description="To-do list mobile épurée, avec rappels et tri par priorité."
          front={
            <div className="flex w-full flex-col gap-2 px-7">
              <div className="flex items-center gap-2.5 rounded-lg bg-white px-3.5 py-2.5 shadow-sm">
                <span className="h-4 w-4 shrink-0 rounded bg-[#4A7EFF]" />
                <span className="text-[13px] font-medium text-ink">Préparer la démo</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg bg-white px-3.5 py-2.5 shadow-sm">
                <span className="h-4 w-4 shrink-0 rounded border border-[#D0D0D0]" />
                <span className="text-[13px] text-muted-2">Relire la doc</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg bg-white px-3.5 py-2.5 shadow-sm">
                <span className="h-4 w-4 shrink-0 rounded border border-[#D0D0D0]" />
                <span className="text-[13px] text-muted-2">Push sur GitHub</span>
              </div>
            </div>
          }
        />
        <PlaygroundCard
          span={1}
          dark
          bg="#BFEBD1"
          tool="Flutterflow"
          title="CoolFit"
          description="Suivi bien-être et activité physique au quotidien."
          front={
            <div className="flex h-[150px] w-full items-end justify-center gap-1.5 px-7">
              {[70, 105, 140, 88, 118, 96, 62].map((h, i) => (
                <div
                  key={i}
                  className="w-[30px] rounded-t"
                  style={{ height: h, background: i === 2 ? "#fff" : "rgba(255,255,255,0.55)" }}
                />
              ))}
            </div>
          }
        />
        <PlaygroundCard
          span={2}
          dark
          bg="linear-gradient(135deg, #241B3D, #1A1030)"
          tool="Bubble"
          title="Kumai"
          description="Guide de voyage intelligent qui recommande destinations et itinéraires selon ton profil et ton budget."
          front={
            <div className="flex gap-4 px-6">
              <div className="flex min-w-[180px] flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-[#9B6DFF] to-[#6B3FD4]" />
                  <span className="text-sm font-semibold text-white">Kyoto</span>
                </div>
                <p className="text-[11px] leading-tight text-white/50">
                  Meilleure période : mars–avril
                  <br />
                  Budget moyen : 1 200 €
                </p>
              </div>
              <div className="flex min-w-[160px] flex-col gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-4 opacity-65">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-[#FFB347] to-[#FF6B35]" />
                  <span className="text-sm font-semibold text-white">Marrakech</span>
                </div>
                <p className="text-[11px] leading-tight text-white/40">
                  Meilleure période : oct–nov
                  <br />
                  Budget moyen : 800 €
                </p>
              </div>
            </div>
          }
        />
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
