type Variant = "bricks" | "code" | "gears" | "rocket";

const CARD_STYLE: Record<Variant, { bg: string; rotate: string; shadow: string }> = {
  bricks: { bg: "#EDE9E0", rotate: "rotate(-7deg)", shadow: "0 22px 50px rgba(0,0,0,0.18)" },
  code:   { bg: "#FFC800", rotate: "rotate(5deg) translateY(-10px)", shadow: "0 22px 50px rgba(255,200,0,0.32)" },
  gears:  { bg: "#D9D4C8", rotate: "rotate(-4deg) translateY(6px)", shadow: "0 22px 50px rgba(0,0,0,0.18)" },
  rocket: { bg: "#1D1D1F", rotate: "rotate(8deg) translateY(-4px)", shadow: "0 22px 50px rgba(0,0,0,0.4)" },
};

function CardIcon({ variant }: { variant: Variant }) {
  if (variant === "bricks") {
    return (
      <svg className="icon-bricks h-[65%] w-[65%]" viewBox="0 0 100 100" fill="none">
        <g className="brick brick-a">
          <path d="M38,44 L51.9,52 L38,60 L24.1,52 Z" fill="#1D1D1F" />
          <path d="M51.9,52 L51.9,68 L38,76 L38,60 Z" fill="#1D1D1F" opacity="0.72" />
          <path d="M24.1,52 L38,60 L38,76 L24.1,68 Z" fill="#1D1D1F" opacity="0.5" />
        </g>
        <g className="brick brick-b">
          <path d="M62,44 L75.9,52 L62,60 L48.1,52 Z" fill="#1D1D1F" />
          <path d="M75.9,52 L75.9,68 L62,76 L62,60 Z" fill="#1D1D1F" opacity="0.72" />
          <path d="M48.1,52 L62,60 L62,76 L48.1,68 Z" fill="#1D1D1F" opacity="0.5" />
        </g>
        <g className="brick brick-c">
          <path d="M50,24 L63.9,32 L50,40 L36.1,32 Z" fill="#1D1D1F" />
          <path d="M63.9,32 L63.9,48 L50,56 L50,40 Z" fill="#1D1D1F" opacity="0.72" />
          <path d="M36.1,32 L50,40 L50,56 L36.1,48 Z" fill="#1D1D1F" opacity="0.5" />
          <circle cx="50" cy="32" r="2.6" fill="#FFC800" />
        </g>
      </svg>
    );
  }
  if (variant === "code") {
    return (
      <svg
        className="icon-code h-[65%] w-[65%]"
        viewBox="0 0 100 100"
        overflow="visible"
        fill="none"
        stroke="#1D1D1F"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path className="code-left" d="M42,34 L28,50 L42,66" />
        <path className="code-right" d="M58,34 L72,50 L58,66" />
        <g className="code-inner" stroke="none" fill="#1D1D1F">
          <text x="50" y="53" textAnchor="middle" dominantBaseline="central" fontFamily="Inter,system-ui,sans-serif" fontSize={36} fontWeight={800} letterSpacing={-1}>
            /hey
          </text>
        </g>
      </svg>
    );
  }
  if (variant === "gears") {
    return (
      <svg className="icon-gears h-[65%] w-[65%]" viewBox="0 0 100 100" fill="none">
        <g transform="translate(40,56)">
          <g className="gear-spin-1" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <g fill="#1D1D1F">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <rect key={deg} x={-3.5} y={-21} width={7} height={7} rx={1.5} transform={`rotate(${deg})`} />
              ))}
              <circle cx={0} cy={0} r={16} />
            </g>
            <circle cx={0} cy={0} r={6} fill="#D9D4C8" />
          </g>
        </g>
        <g transform="translate(66,38)">
          <g className="gear-spin-2" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <g fill="#1D1D1F">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <rect key={deg} x={-2.6} y={-15} width={5.2} height={5.5} rx={1.2} transform={`rotate(${deg})`} />
              ))}
              <circle cx={0} cy={0} r={11} />
            </g>
            <circle cx={0} cy={0} r={4} fill="#D9D4C8" />
          </g>
        </g>
      </svg>
    );
  }
  return (
    <svg className="icon-rocket h-[65%] w-[65%]" viewBox="0 0 100 100" fill="none">
      <g transform="translate(0,10)">
        <g className="rocket-float">
          <g className="rocket-smoke">
            <circle className="smoke-puff" cx={44} cy={88} r={5} fill="#FFFFFF" opacity="0.2" />
            <circle className="smoke-puff" cx={50} cy={90} r={6} fill="#FFFFFF" opacity="0.14" />
            <circle className="smoke-puff" cx={56} cy={88} r={4.5} fill="#FFFFFF" opacity="0.16" />
          </g>
          <g className="rocket-flame">
            <path d="M44,63 L50,84 L56,63 Z" fill="#FF8A3D" />
            <path d="M47,63 L50,76 L53,63 Z" fill="#FFFFFF" />
          </g>
          <g className="rocket-streaks" stroke="#FFC800" strokeWidth={3} strokeLinecap="round">
            <path d="M33,70 L29,84" />
            <path d="M67,70 L71,84" />
          </g>
          <g className="rocket-body">
            <path d="M41,53 L31,68 L41,63 Z" fill="#FFC800" />
            <path d="M59,53 L69,68 L59,63 Z" fill="#FFC800" />
            <path d="M50,14 C57,23 59,37 59,50 L59,63 L41,63 L41,50 C41,37 43,23 50,14 Z" fill="#FFC800" />
            <circle cx={50} cy={38} r={6.5} fill="#1D1D1F" />
          </g>
        </g>
      </g>
    </svg>
  );
}

export function HeroCard({ variant, label }: { variant: Variant; label: string }) {
  const { bg, rotate, shadow } = CARD_STYLE[variant];
  return (
    <div className="hero-card-wrap">
      <div
        className={`hero-card card-${variant} relative flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] border-4 border-white sm:h-[150px] sm:w-[150px] sm:rounded-[22px] xl:h-[230px] xl:w-[230px] xl:rounded-[28px] xl:border-[6px]`}
        style={{ background: bg, transform: rotate, boxShadow: shadow }}
      >
        <CardIcon variant={variant} />
        <span className="card-label">{label}</span>
      </div>
    </div>
  );
}
