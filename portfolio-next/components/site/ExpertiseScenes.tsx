import type { CSSProperties } from "react";
import type { ExpertiseKey } from "./Expertise";

// Small looping "motion graphics" scenes shown in the open accordion panel.
// They are mounted only while the panel is open, so every opening replays
// the intro. Timings start after ~0.35s to let the panel finish expanding.
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const INK = "#1D1D1F";
const ACCENT = "#FFC800";

function AutomationScene() {
  const links = ["M64 85 H136", "M184 85 C222 85 218 40 256 40", "M184 85 C222 85 218 130 256 130"];
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full" fill="none">
      {links.map((p, i) => (
        <g key={p}>
          <path d={p} pathLength={1} stroke={INK} strokeOpacity={0.3} strokeWidth={2} className="xp-draw" style={d(0.55 + i * 0.15)} />
          <path
            d={p}
            pathLength={1}
            stroke={INK}
            strokeWidth={5}
            strokeLinecap="round"
            className="xp-flow"
            style={{ ...d(1.3 + (i ? 0.8 : 0)) }}
          />
        </g>
      ))}

      {/* Source: a document */}
      <g className="xp-pop" style={d(0.35)}>
        <rect x={16} y={61} width={48} height={48} rx={12} fill="#fff" />
        <rect x={29} y={72} width={22} height={27} rx={3} stroke={INK} strokeWidth={2} />
        {[79, 85, 91].map((y) => (
          <path key={y} d={`M33 ${y} H47`} stroke={INK} strokeWidth={2} strokeLinecap="round" />
        ))}
      </g>

      {/* Hub: spinning gear */}
      <g className="xp-pop" style={d(0.45)}>
        <rect x={136} y={61} width={48} height={48} rx={12} fill={INK} />
        <g transform="translate(160,85)">
          <g className="xp-spin">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <rect key={deg} x={-2} y={-13} width={4} height={5} rx={1} fill={ACCENT} transform={`rotate(${deg})`} />
            ))}
            <circle r={9.5} fill={ACCENT} />
            <circle r={3.5} fill={INK} />
          </g>
        </g>
      </g>

      {/* Outputs: verified + reminder */}
      <g className="xp-pop" style={d(0.75)}>
        <rect x={256} y={16} width={48} height={48} rx={12} fill="#fff" />
        <path d="M269 40 l7 7 l14 -14" pathLength={1} stroke={INK} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="xp-draw" style={d(2.2)} />
      </g>
      <g className="xp-pop" style={d(0.9)}>
        <rect x={256} y={106} width={48} height={48} rx={12} fill="#fff" />
        <g className="xp-ring" style={d(2.4)}>
          <path d="M271 136 h18 l-2.5 -3.5 v-6 a6.5 6.5 0 0 0 -13 0 v6 z" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
          <path d="M277.5 139.5 a2.5 2.5 0 0 0 5 0" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
        </g>
        <circle cx={296} cy={114} r={5} fill={ACCENT} stroke="#fff" strokeWidth={2} className="xp-pop" style={d(2.4)} />
      </g>
    </svg>
  );
}

function AppScene() {
  const bars = [38, 56, 44, 70, 52, 82];
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full" fill="none">
      <g className="xp-rise-svg" style={d(0.35)}>
        <rect x={10} y={6} width={300} height={158} rx={12} fill="#fff" />
        <rect x={10} y={6} width={300} height={22} rx={12} fill={INK} fillOpacity={0.05} />
        {[24, 34, 44].map((cx) => (
          <circle key={cx} cx={cx} cy={17} r={3} fill={INK} fillOpacity={0.25} />
        ))}
        <rect x={10} y={28} width={58} height={136} fill={INK} fillOpacity={0.04} />
      </g>

      {[44, 60, 76, 92].map((y, i) => (
        <rect key={y} x={20} y={y} width={i === 0 ? 38 : 30} height={6} rx={3} fill={i === 0 ? ACCENT : INK} fillOpacity={i === 0 ? 1 : 0.18} className="xp-grow-x" style={d(0.6 + i * 0.08)} />
      ))}

      {[80, 156, 232].map((x, i) => (
        <g key={x} className="xp-pop" style={d(0.8 + i * 0.12)}>
          <rect x={x} y={38} width={66} height={34} rx={7} fill="#F7F5F0" />
          <rect x={x + 9} y={46} width={22} height={4} rx={2} fill={INK} fillOpacity={0.25} />
          <rect x={x + 9} y={55} width={i === 1 ? 34 : 28} height={9} rx={2} fill={INK} />
        </g>
      ))}

      {bars.map((h, i) => (
        <rect
          key={i}
          x={84 + i * 22}
          y={154 - h * 0.85}
          width={14}
          height={h * 0.85}
          rx={3}
          fill={i === bars.length - 1 ? ACCENT : INK}
          fillOpacity={i === bars.length - 1 ? 1 : 0.85}
          className="xp-grow-y"
          style={d(1.2 + i * 0.07)}
        />
      ))}

      <path
        d="M226 140 L244 122 L258 130 L276 104 L298 92"
        pathLength={1}
        stroke={INK}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="xp-draw"
        style={d(1.6)}
      />
      <circle cx={298} cy={92} r={4} fill={ACCENT} stroke={INK} strokeWidth={2} className="xp-pop" style={d(2.3)} />
    </svg>
  );
}

function AgentScene() {
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full" fill="none" fontFamily="inherit">
      {/* Question */}
      <g className="xp-pop xp-origin-right" style={d(0.35)}>
        <rect x={148} y={6} width={162} height={34} rx={14} fill="#fff" fillOpacity={0.12} />
        <rect x={162} y={16} width={120} height={5} rx={2.5} fill="#fff" fillOpacity={0.7} />
        <rect x={162} y={26} width={80} height={5} rx={2.5} fill="#fff" fillOpacity={0.45} />
      </g>

      {/* Typing indicator, then the answer */}
      <g className="xp-typing" style={d(0.8)}>
        <rect x={10} y={52} width={58} height={30} rx={14} fill="#fff" fillOpacity={0.12} />
        {[27, 39, 51].map((cx, i) => (
          <circle key={cx} cx={cx} cy={67} r={3} fill="#fff" className="xp-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </g>
      <g className="xp-pop xp-origin-left" style={d(2.05)}>
        <rect x={10} y={52} width={214} height={60} rx={14} fill={ACCENT} />
        {[64, 76, 88, 100].map((y, i) => (
          <rect key={y} x={24} y={y} width={[176, 160, 184, 96][i]} height={5} rx={2.5} fill={INK} fillOpacity={i === 3 ? 0.45 : 0.8} className="xp-grow-x" style={d(2.25 + i * 0.12)} />
        ))}
      </g>

      {/* The agent acts + cites its source */}
      <g className="xp-pop xp-origin-left" style={d(2.9)}>
        <rect x={10} y={124} width={132} height={26} rx={13} stroke={ACCENT} strokeWidth={1.5} />
        <path d="M23 137 l4 4 l8 -8" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <text x={42} y={141} fontSize={11} fontWeight={600} fill={ACCENT}>Ticket mis à jour</text>
      </g>
      <g className="xp-pop xp-origin-left" style={d(3.1)}>
        <rect x={150} y={124} width={104} height={26} rx={13} fill="#fff" fillOpacity={0.1} />
        <text x={164} y={141} fontSize={11} fill="#fff" fillOpacity={0.7}>Source : wiki</text>
      </g>

      <path
        d="M288 92c.9 5.6 2.5 7.2 8 8-5.5.8-7.1 2.4-8 8-.9-5.6-2.5-7.2-8-8 5.5-.8 7.1-2.4 8-8z"
        fill={ACCENT}
        className="xp-twinkle"
        style={d(1)}
      />
      <path
        d="M268 62c.5 3.2 1.4 4.1 4.6 4.6-3.2.5-4.1 1.4-4.6 4.6-.5-3.2-1.4-4.1-4.6-4.6 3.2-.5 4.1-1.4 4.6-4.6z"
        fill="#fff"
        className="xp-twinkle"
        style={d(1.6)}
      />
    </svg>
  );
}

export function ExpertiseScene({ variant }: { variant: ExpertiseKey }) {
  if (variant === "automatisation") return <AutomationScene />;
  if (variant === "applications") return <AppScene />;
  return <AgentScene />;
}
