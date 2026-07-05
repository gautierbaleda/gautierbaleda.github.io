# Migration Next.js Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Gautier Baleda portfolio (currently a bundled Claude Design HTML export) as a Next.js + Tailwind + shadcn/ui site with hard-coded content, visually and behaviorally identical to the current bundle, as groundwork for a future Keystatic CMS integration.

**Architecture:** Next.js App Router project in `./portfolio-next`. Each visual section of the current bundle becomes an isolated component under `components/site/`. Project data lives in a typed array (`content/projects.ts`) shaped like a future Keystatic collection. Framer Motion handles scroll-entrance animation; everything else (hover/tilt/flip/sprite effects) is plain CSS (`@keyframes` + Tailwind) ported verbatim from the current bundle's `<style>` block, since the exact keyframes and timings were recovered from the source.

**Tech Stack:** Next.js (App Router, TypeScript), Tailwind CSS, shadcn/ui, Framer Motion, Vitest + React Testing Library, npm.

## Global Constraints

- Reproduce the current design **identically** — colors, layout, typography, and animations must match the bundle at `../Gautier Baleda - Portfolio.html` and `../About Gautier Baleda.html` (paths relative to `portfolio-next/`). Do not add visual "improvements".
- Reuse copy from the bundle verbatim for Accueil, À Propos, Playground, Contact. Project entries in `content/projects.ts` are **generic/minimal** (title, slug, one-line summary, 1-2 tags, cover color) — do not try to faithfully reproduce the original project preview copy, since it will be replaced via Keystatic later.
- No Keystatic in this project. No backend/API routes. No `.dc.html` files are migrated.
- Package manager: npm. Language: TypeScript.
- Color tokens (verified from bundle source): accent `#FFC800`, page background `#F7F5F0`, card background `#FFFFFF`, ink (primary text) `#1D1D1F`, muted text `#6E6E73` / `#86868B`, hairline `#F0F0F2`, dark section background `#1D1D1F`.
- Fonts: `Inter` (weights 400/500/600/700/800) for body/headings, `JetBrains Mono` for the hero typing line.

---

## File Structure

```
portfolio-next/
  app/
    layout.tsx
    globals.css
    page.tsx                     # Accueil
    projets/
      page.tsx
      [slug]/page.tsx
    a-propos/
      page.tsx
  components/
    site/
      Nav.tsx
      Footer.tsx
      Hero.tsx
      HeroCard.tsx
      Bio.tsx
      Realisations.tsx
      Playground.tsx
      PlaygroundCard.tsx
      Contact.tsx
      ProjectCard.tsx
      ProjectGrid.tsx
    ui/                            # shadcn components (generated)
  content/
    projects.ts
  lib/
    useTypingEffect.ts
    useTiltHover.ts
    utils.ts
  public/
    images/
      sprites/
        umbreon.png
        pharamp.png
  tailwind.config.ts
  vitest.config.ts
  vitest.setup.ts
```

---

### Task 1: Scaffold Next.js project with Tailwind and shadcn/ui

**Files:**
- Create: `portfolio-next/` (via `create-next-app`)
- Modify: `portfolio-next/tailwind.config.ts`
- Modify: `portfolio-next/app/globals.css`
- Create: `portfolio-next/vitest.config.ts`
- Create: `portfolio-next/vitest.setup.ts`
- Modify: `portfolio-next/package.json` (test script)

**Interfaces:**
- Produces: a runnable Next.js app (`npm run dev`) with Tailwind, shadcn/ui, and Vitest wired up. Later tasks assume `@/` path alias resolves to `portfolio-next/`.

- [ ] **Step 1: Scaffold the app**

Run from `/Users/gautier/Documents/projets/Portfolio interface edit`:

```bash
npx create-next-app@latest portfolio-next --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm
```

When prompted, accept defaults (App Router: yes, Turbopack: default).

- [ ] **Step 2: Initialize shadcn/ui**

```bash
cd portfolio-next
npx shadcn@latest init -d
```

Accept the defaults (this creates `components.json`, `lib/utils.ts`, and base Tailwind CSS variables in `app/globals.css`).

- [ ] **Step 3: Add the shadcn components this migration needs**

```bash
npx shadcn@latest add button card badge
```

- [ ] **Step 4: Extend the Tailwind theme with the site's color tokens**

Edit `portfolio-next/tailwind.config.ts` — add inside `theme.extend`:

```ts
colors: {
  accent: "#FFC800",
  page: "#F7F5F0",
  ink: "#1D1D1F",
  muted: "#6E6E73",
  "muted-2": "#86868B",
  hairline: "#F0F0F2",
},
fontFamily: {
  sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
  mono: ["JetBrains Mono", "ui-monospace", "monospace"],
},
```

- [ ] **Step 5: Set the page background and base font in globals.css**

Add near the top of `portfolio-next/app/globals.css` (after the Tailwind `@import`/`@tailwind` directives):

```css
body {
  background: #F7F5F0;
  color: #1D1D1F;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}
```

- [ ] **Step 6: Install test tooling**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

Create `portfolio-next/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

Create `portfolio-next/vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Add to `portfolio-next/package.json` `"scripts"`:

```json
"test": "vitest run"
```

- [ ] **Step 7: Verify the app boots and tests run**

```bash
npm run dev -- --port 3100 &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100
kill %1
npm test
```

Expected: HTTP status `200`, and `npm test` reports "No test files found" (no failure) — that's fine, no tests exist yet.

- [ ] **Step 8: Commit**

```bash
git add portfolio-next
git commit -m "Scaffold Next.js + Tailwind + shadcn/ui project"
```

---

### Task 2: Global fonts, keyframes, and shared hooks (typing effect, tilt hover)

**Files:**
- Modify: `portfolio-next/app/layout.tsx`
- Modify: `portfolio-next/app/globals.css`
- Create: `portfolio-next/lib/useTypingEffect.ts`
- Test: `portfolio-next/lib/useTypingEffect.test.ts`
- Create: `portfolio-next/lib/useTiltHover.ts`
- Test: `portfolio-next/lib/useTiltHover.test.ts`

**Interfaces:**
- Produces: `useTypingEffect(words: string[], opts?: { typeSpeedMs?: number; pauseMs?: number }): string` — returns the currently-typed substring, cycling through `words` forever.
- Produces: `useTiltHover(maxDeg?: number): { ref: React.RefObject<HTMLDivElement>; style: React.CSSProperties; onMouseMove: (e: React.MouseEvent) => void; onMouseLeave: () => void }` — tracks pointer position over the bound element and returns a `transform: perspective(...) rotateX(...) rotateY(...)` style for a 3D tilt effect, resetting to flat on mouse leave.
- Consumes: nothing from other tasks.

- [ ] **Step 1: Write the failing test for the typing hook**

```ts
// portfolio-next/lib/useTypingEffect.test.ts
import { renderHook, act } from "@testing-library/react";
import { useTypingEffect } from "./useTypingEffect";

describe("useTypingEffect", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("types out the first word one character at a time", () => {
    const { result } = renderHook(() => useTypingEffect(["Hey"], { typeSpeedMs: 10 }));
    expect(result.current).toBe("");
    act(() => vi.advanceTimersByTime(10));
    expect(result.current).toBe("H");
    act(() => vi.advanceTimersByTime(20));
    expect(result.current).toBe("Hey");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
cd portfolio-next && npm test -- useTypingEffect
```

Expected: FAIL — `useTypingEffect` module not found.

- [ ] **Step 3: Implement the hook**

```ts
// portfolio-next/lib/useTypingEffect.ts
"use client";
import { useEffect, useState } from "react";

export function useTypingEffect(
  words: string[],
  opts: { typeSpeedMs?: number; pauseMs?: number } = {}
): string {
  const { typeSpeedMs = 70, pauseMs = 1400 } = opts;
  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const word = words[wordIndex % words.length];
    if (charCount < word.length) {
      const t = setTimeout(() => setCharCount((c) => c + 1), typeSpeedMs);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCharCount(0);
      setWordIndex((i) => i + 1);
    }, pauseMs);
    return () => clearTimeout(t);
  }, [charCount, wordIndex, words, typeSpeedMs, pauseMs]);

  return words[wordIndex % words.length].slice(0, charCount);
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- useTypingEffect
```

Expected: PASS.

- [ ] **Step 5: Write the failing test for the tilt hook**

```ts
// portfolio-next/lib/useTiltHover.test.ts
import { renderHook, act } from "@testing-library/react";
import { useTiltHover } from "./useTiltHover";

describe("useTiltHover", () => {
  it("resets to a flat transform on mouse leave", () => {
    const { result } = renderHook(() => useTiltHover(12));
    act(() => result.current.onMouseLeave());
    expect(result.current.style.transform).toBe(
      "perspective(800px) rotateX(0deg) rotateY(0deg)"
    );
  });

  it("computes a tilt from a mouse move within the element bounds", () => {
    const { result } = renderHook(() => useTiltHover(12));
    const target = {
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 100 }),
    } as unknown as HTMLDivElement;
    act(() =>
      result.current.onMouseMove({
        clientX: 200,
        clientY: 0,
        currentTarget: target,
      } as unknown as React.MouseEvent)
    );
    // pointer at top-right corner -> full positive rotateY, full negative rotateX
    expect(result.current.style.transform).toBe(
      "perspective(800px) rotateX(12deg) rotateY(12deg)"
    );
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

```bash
npm test -- useTiltHover
```

Expected: FAIL — module not found.

- [ ] **Step 7: Implement the hook**

```ts
// portfolio-next/lib/useTiltHover.ts
"use client";
import { useRef, useState } from "react";

export function useTiltHover(maxDeg = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    `perspective(800px) rotateX(0deg) rotateY(0deg)`
  );

  function onMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rotateY = (px - 0.5) * 2 * maxDeg;
    const rotateX = -(py - 0.5) * 2 * maxDeg;
    setTransform(
      `perspective(800px) rotateX(${rotateX.toFixed(0)}deg) rotateY(${rotateY.toFixed(0)}deg)`
    );
  }

  function onMouseLeave() {
    setTransform(`perspective(800px) rotateX(0deg) rotateY(0deg)`);
  }

  return { ref, style: { transform }, onMouseMove, onMouseLeave };
}
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- useTiltHover
```

Expected: PASS.

- [ ] **Step 9: Load fonts and port the bundle's shared keyframes into globals.css**

Edit `portfolio-next/app/layout.tsx` to load the fonts via `next/font/google`:

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400","500","600","700","800"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbmono", weight: ["400","500"] });

export const metadata: Metadata = {
  title: "Gautier Baleda — Product Builder",
  description: "Product Builder — je construis des outils sur mesure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Append to `portfolio-next/app/globals.css` (verbatim keyframes recovered from the bundle):

```css
@keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

@keyframes gearCW  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes gearCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
.card-gears:hover .gear-spin-1 { animation: gearCW 3s linear infinite; }
.card-gears:hover .gear-spin-2 { animation: gearCCW 2.1s linear infinite; }

@keyframes rocketFloat  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes flameFlicker { 0%,100% { transform: scaleY(1); opacity: 1; } 50% { transform: scaleY(1.18); opacity: 0.82; } }
@keyframes smokeRise1   { 0% { transform: translateY(0) scale(1); opacity: 0.7; } 100% { transform: translateY(-14px) scale(1.6); opacity: 0; } }
@keyframes smokeRise2   { 0% { transform: translateY(0) scale(1); opacity: 0.6; } 100% { transform: translateY(-12px) scale(1.5); opacity: 0; } }
.card-rocket .rocket-flame   { opacity: 0; transform-box: fill-box; transform-origin: bottom center; transition: opacity 0.35s ease; }
.card-rocket .rocket-streaks { opacity: 0; transition: opacity 0.35s ease 0.1s; }
.card-rocket .smoke-puff     { opacity: 0; transition: opacity 0.3s ease; }
.card-rocket:hover .rocket-flame   { opacity: 1; animation: flameFlicker 0.55s ease-in-out infinite; }
.card-rocket:hover .rocket-streaks { opacity: 1; }
.card-rocket:hover .smoke-puff     { animation: smokeRise1 1.1s ease-out infinite; }
.card-rocket:hover .smoke-puff:nth-child(2) { animation: smokeRise2 1.1s ease-out 0.37s infinite; }
.card-rocket:hover .smoke-puff:nth-child(3) { animation: smokeRise1 1.1s ease-out 0.7s infinite; }
.card-rocket:hover .rocket-float   { animation: rocketFloat 1.9s ease-in-out infinite; }

.card-code .code-left,
.card-code .code-right { transition: transform 0.45s cubic-bezier(0.22,0.9,0.25,1); }
.card-code .code-inner { opacity: 0; transform: scale(0.85); transform-box: fill-box; transform-origin: center; transition: opacity 0.1s ease, transform 0.12s ease; }
.card-code:hover .code-left  { transform: translateX(-34px); }
.card-code:hover .code-right { transform: translateX(34px); }
.card-code:hover .code-inner { opacity: 1; transform: scale(1); transition: opacity 0.35s ease 0.1s, transform 0.4s cubic-bezier(0.22,0.9,0.25,1) 0.1s; }

.card-bricks .brick { transition: transform 0.55s cubic-bezier(0.22,0.9,0.25,1); }
.card-bricks:hover .brick-a { transform: translate(12px, -28px); }
.card-bricks:hover .brick-b { transform: translate(-12px, -10px); }
.card-bricks:hover .brick-c { transform: translate(0, 28px); }

.card-label {
  position: absolute; left: 0; right: 0; bottom: 0;
  padding: 16px; text-align: center;
  font-size: 19px; font-weight: 700; letter-spacing: -0.01em; color: #1D1D1F;
  transform: translateY(110%); opacity: 0;
  transition: transform 0.45s cubic-bezier(0.22,0.9,0.25,1), opacity 0.45s ease;
  pointer-events: none;
}
.hero-card:hover .card-label { transform: translateY(0); opacity: 1; }
.card-rocket .card-label { color: #FFC800; }

@keyframes heroCardFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-9px); } }
.hero-card-wrap { display: inline-flex; position: relative; flex-shrink: 0; cursor: pointer; }
.hero-card-wrap:nth-child(1) { animation: heroCardFloat 3.4s ease-in-out infinite 0.0s; z-index: 1; margin-right: -28px; }
.hero-card-wrap:nth-child(2) { animation: heroCardFloat 2.9s ease-in-out infinite 0.65s; z-index: 2; margin-right: -28px; }
.hero-card-wrap:nth-child(3) { animation: heroCardFloat 3.7s ease-in-out infinite 1.3s; z-index: 3; margin-right: -28px; }
.hero-card-wrap:nth-child(4) { animation: heroCardFloat 3.1s ease-in-out infinite 0.45s; z-index: 4; }
.hero-card-wrap:hover { animation-play-state: paused; }

@keyframes umbreonSprite { from { background-position-x: 0px; } to { background-position-x: -480px; } }
.umbreon-walker {
  width: 120px; height: 130px;
  background-image: url("/images/sprites/umbreon.png");
  background-size: 480px 130px;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  animation: umbreonSprite 0.6s steps(4) infinite;
  flex-shrink: 0;
}

@keyframes pharampSprite { from { background-position-x: 0px; } to { background-position-x: -480px; } }
.pharamp-walker {
  width: 120px; height: 153px;
  background-image: url("/images/sprites/pharamp.png");
  background-size: 480px 153px;
  background-repeat: no-repeat;
  animation: pharampSprite 0.8s steps(4) infinite;
  flex-shrink: 0;
}
```

- [ ] **Step 10: Copy the sprite sheets into `public/`**

```bash
mkdir -p portfolio-next/public/images/sprites
cp "../uploads/umbreon_sprite.png" portfolio-next/public/images/sprites/umbreon.png
cp "../uploads/pharamp_sprite.png" portfolio-next/public/images/sprites/pharamp.png
```

(Run from inside `portfolio-next/`, so `../uploads/` resolves to the sibling Claude Design export folder.)

- [ ] **Step 11: Commit**

```bash
git add portfolio-next
git commit -m "Add shared fonts, keyframes, typing and tilt hooks"
```

---

### Task 3: Nav and Footer components

**Files:**
- Create: `portfolio-next/components/site/Nav.tsx`
- Test: `portfolio-next/components/site/Nav.test.tsx`
- Create: `portfolio-next/components/site/Footer.tsx`
- Test: `portfolio-next/components/site/Footer.test.tsx`

**Interfaces:**
- Produces: `<Nav />` — no props, renders the fixed top navigation with links to `/` (Accueil), `/#play` (Playground), `/projets` (Projets), `/a-propos` (À Propos), and a `Contact` button linking to `/#contact`.
- Produces: `<Footer />` — no props, renders the social links and the copyright line.

- [ ] **Step 1: Write the failing test for Nav**

```tsx
// portfolio-next/components/site/Nav.test.tsx
import { render, screen } from "@testing-library/react";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders all nav links and the brand", () => {
    render(<Nav />);
    expect(screen.getByText("gautier baleda")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Projets" })).toHaveAttribute("href", "/projets");
    expect(screen.getByRole("link", { name: "Playground" })).toHaveAttribute("href", "/#play");
    expect(screen.getByRole("link", { name: "À Propos" })).toHaveAttribute("href", "/a-propos");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/#contact");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- Nav.test
```

Expected: FAIL — `./Nav` not found.

- [ ] **Step 3: Implement Nav**

```tsx
// portfolio-next/components/site/Nav.tsx
import Link from "next/link";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/projets", label: "Projets" },
  { href: "/#play", label: "Playground" },
  { href: "/a-propos", label: "À Propos" },
];

export function Nav() {
  return (
    <nav className="sticky top-4 z-50 mx-auto flex max-w-[1200px] items-center justify-between rounded-2xl bg-white/90 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <span className="h-2 w-2 rounded-full bg-accent" />
        gautier baleda
      </div>
      <div className="hidden items-center gap-2 md:flex">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-xl px-4 py-2 text-sm font-medium text-ink hover:bg-black/5"
          >
            {l.label}
          </Link>
        ))}
      </div>
      <Link
        href="/#contact"
        className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-ink"
      >
        Contact
      </Link>
    </nav>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- Nav.test
```

Expected: PASS.

- [ ] **Step 5: Write the failing test for Footer**

```tsx
// portfolio-next/components/site/Footer.test.tsx
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the email link and copyright", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /envoyer un email/i })).toHaveAttribute(
      "href",
      "mailto:gautier.baleda@gmail.com"
    );
    expect(screen.getByText(/© 2025 Gautier Baleda/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

```bash
npm test -- Footer.test
```

Expected: FAIL — `./Footer` not found.

- [ ] **Step 7: Implement Footer**

```tsx
// portfolio-next/components/site/Footer.tsx
export function Footer() {
  return (
    <section id="contact" className="rounded-[20px] bg-ink px-10 py-16 text-center">
      <div className="mx-auto max-w-[600px]">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-accent">
          CONTACT
        </p>
        <h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white">
          Un projet en tête ?
          <br />
          Parlons-en.
        </h2>
        <p className="mb-10 text-[15px] leading-relaxed text-muted-2">
          Je réponds généralement sous 24h. Dites-moi ce que vous cherchez à
          construire, et on voit ensemble comment y arriver vite !
        </p>
        <div className="flex flex-col items-center gap-3">
          <a
            href="mailto:gautier.baleda@gmail.com"
            className="w-full max-w-[340px] rounded-2xl bg-accent px-8 py-4 text-[15px] font-bold text-ink"
          >
            Envoyer un email
          </a>
          <div className="flex w-full max-w-[340px] gap-3">
            <a
              href="#"
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white"
            >
              GitHub
            </a>
          </div>
        </div>
        <p className="mt-12 text-xs text-[#48484A]">
          © 2025 Gautier Baleda. Tous droits réservés.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- Footer.test
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add portfolio-next
git commit -m "Add Nav and Footer components"
```

---

### Task 4: Hero section with the 4 animated SVG cards

**Files:**
- Create: `portfolio-next/components/site/HeroCard.tsx`
- Test: `portfolio-next/components/site/HeroCard.test.tsx`
- Create: `portfolio-next/components/site/Hero.tsx`
- Test: `portfolio-next/components/site/Hero.test.tsx`

**Interfaces:**
- Consumes: `useTypingEffect` from `@/lib/useTypingEffect` (Task 2).
- Produces: `<HeroCard variant="bricks" | "code" | "gears" | "rocket" label={string} />` — renders one of the 4 hero cards with its SVG icon and hover animation classes.
- Produces: `<Hero />` — no props, renders the full hero section.

- [ ] **Step 1: Write the failing test for HeroCard**

```tsx
// portfolio-next/components/site/HeroCard.test.tsx
import { render, screen } from "@testing-library/react";
import { HeroCard } from "./HeroCard";

describe("HeroCard", () => {
  it("renders the label for a given variant", () => {
    render(<HeroCard variant="bricks" label="Concevoir" />);
    expect(screen.getByText("Concevoir")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- HeroCard.test
```

Expected: FAIL.

- [ ] **Step 3: Implement HeroCard**

```tsx
// portfolio-next/components/site/HeroCard.tsx
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
      <svg className="icon-bricks" width={150} height={150} viewBox="0 0 100 100" fill="none">
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
        className="icon-code"
        width={150}
        height={150}
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
      <svg className="icon-gears" width={150} height={150} viewBox="0 0 100 100" fill="none">
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
    <svg className="icon-rocket" width={150} height={150} viewBox="0 0 100 100" fill="none">
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
        className={`hero-card card-${variant} relative flex h-[230px] w-[230px] shrink-0 items-center justify-center overflow-hidden rounded-[28px] border-[6px] border-white`}
        style={{ background: bg, transform: rotate, boxShadow: shadow }}
      >
        <CardIcon variant={variant} />
        <span className="card-label">{label}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- HeroCard.test
```

Expected: PASS.

- [ ] **Step 5: Write the failing test for Hero**

```tsx
// portfolio-next/components/site/Hero.test.tsx
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the name, role, and subtitle", () => {
    render(<Hero />);
    expect(screen.getByText("Gautier Baleda")).toBeInTheDocument();
    expect(screen.getByText("Product Builder")).toBeInTheDocument();
    expect(screen.getByText("Je construis des outils sur mesure")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

```bash
npm test -- Hero.test
```

Expected: FAIL.

- [ ] **Step 7: Implement Hero**

```tsx
// portfolio-next/components/site/Hero.tsx
"use client";
import { useTypingEffect } from "@/lib/useTypingEffect";
import { HeroCard } from "./HeroCard";

const CARDS: { variant: "bricks" | "code" | "gears" | "rocket"; label: string }[] = [
  { variant: "bricks", label: "Concevoir" },
  { variant: "code", label: "Développer" },
  { variant: "gears", label: "Automatiser" },
  { variant: "rocket", label: "Déployer" },
];

export function Hero() {
  const typed = useTypingEffect(["Hello world 👋"], { typeSpeedMs: 60, pauseMs: 4000 });

  return (
    <section className="flex min-h-[calc(100vh-148px)] flex-col items-center justify-center rounded-[20px] px-16 py-10 pb-[72px] text-center">
      <p className="mb-4 min-h-[1.6em] font-mono text-lg font-medium uppercase tracking-[0.07em] text-muted-2">
        {typed}
        <span className="animate-[cursorBlink_1s_step-start_infinite]">|</span>
      </p>

      <h1 className="mb-16 text-[116px] font-extrabold leading-[0.95] tracking-tight text-accent">
        Gautier Baleda
      </h1>

      <div className="mb-[72px] flex items-center justify-center py-[30px]">
        {CARDS.map((c) => (
          <HeroCard key={c.variant} variant={c.variant} label={c.label} />
        ))}
      </div>

      <h2 className="mb-[22px] text-[90px] font-extrabold leading-none tracking-tight text-ink">
        Product Builder
      </h2>
      <p className="mb-10 text-[19px] text-muted-2">Je construis des outils sur mesure</p>
    </section>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- Hero.test
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add portfolio-next
git commit -m "Add Hero section with animated SVG cards"
```

---

### Task 5: Bio ("Qui suis-je") section

**Files:**
- Create: `portfolio-next/components/site/Bio.tsx`
- Test: `portfolio-next/components/site/Bio.test.tsx`

**Interfaces:**
- Produces: `<Bio />` — no props.

- [ ] **Step 1: Write the failing test**

```tsx
// portfolio-next/components/site/Bio.test.tsx
import { render, screen } from "@testing-library/react";
import { Bio } from "./Bio";

describe("Bio", () => {
  it("renders the qui-suis-je heading and body copy", () => {
    render(<Bio />);
    expect(
      screen.getByText("Un Product Builder passionné par l'impact")
    ).toBeInTheDocument();
    expect(screen.getByText(/approche hybride/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- Bio.test
```

Expected: FAIL.

- [ ] **Step 3: Implement Bio**

```tsx
// portfolio-next/components/site/Bio.tsx
export function Bio() {
  return (
    <section className="rounded-[20px] px-10 py-10">
      <div className="flex items-center gap-16">
        <div className="flex-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-accent">
            QUI SUIS-JE
          </p>
          <h2 className="mb-4 text-2xl font-bold text-ink">
            Un Product Builder passionné par l&apos;impact
          </h2>
          <p className="mb-6 text-base leading-relaxed text-muted">
            Issu du monde du management digital, j&apos;ai développé une
            approche hybride qui combine vision produit, design UX et
            développement no-code. Je construis des solutions qui résolvent
            de vrais problèmes pour de vraies personnes.
          </p>
          <a href="#" className="text-sm font-semibold text-accent">
            En savoir plus →
          </a>
        </div>
        <div className="flex h-[260px] w-[380px] shrink-0 items-center justify-center rounded-2xl bg-[#F5F5F7]">
          <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="#FFC800" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- Bio.test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add portfolio-next
git commit -m "Add Bio section"
```

---

### Task 6: Project data model + Réalisations section (hover preview)

**Files:**
- Create: `portfolio-next/content/projects.ts`
- Test: `portfolio-next/content/projects.test.ts`
- Create: `portfolio-next/components/site/Realisations.tsx`
- Test: `portfolio-next/components/site/Realisations.test.tsx`

**Interfaces:**
- Produces: `type Project = { slug: string; name: string; longName: string; description: string; tags: string[]; bg: string; textColor: string }` and `export const projects: Project[]` (4 generic placeholder entries) and `export function getProjectBySlug(slug: string): Project | undefined`.
- Produces: `<Realisations />` — no props, consumes `projects` from `content/projects.ts` directly. Renders a two-column layout: a preview panel on the left that shows the hovered project's name/tags on a colored background, and a list of project rows on the right. Hover swaps the preview via React state (no scroll-jacking — see note below).
- **Scope decision:** the original bundle drives this panel with imperative scroll+hover listeners tied to page scroll position (`sc-for`/`ref` bundler primitives). That machinery is specific to the Claude Design runtime and isn't portable. This task reproduces the *visible behavior that matters* — hovering a project row swaps the left preview panel's background/name/tags — using plain React `useState`, without replicating scroll-linked activation. This was a scope call made during planning, not a silent cut: flag it to the user when this task is reviewed.

- [ ] **Step 1: Write the failing test for the project data helpers**

```ts
// portfolio-next/content/projects.test.ts
import { projects, getProjectBySlug } from "./projects";

describe("projects content", () => {
  it("has at least one project with the required fields", () => {
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(p.slug).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.tags.length).toBeGreaterThan(0);
    }
  });

  it("looks up a project by slug", () => {
    const first = projects[0];
    expect(getProjectBySlug(first.slug)).toEqual(first);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- content/projects.test
```

Expected: FAIL — `./projects` not found.

- [ ] **Step 3: Implement the project data**

```ts
// portfolio-next/content/projects.ts
export type Project = {
  slug: string;
  name: string;
  longName: string;
  description: string;
  tags: string[];
  bg: string;
  textColor: string;
};

export const projects: Project[] = [
  {
    slug: "projet-un",
    name: "PROJET 1",
    longName: "Projet Un",
    description: "Description courte du projet, à préciser via le CMS.",
    tags: ["No-code"],
    bg: "#1A1A2E",
    textColor: "#FFFFFF",
  },
  {
    slug: "projet-deux",
    name: "PROJET 2",
    longName: "Projet Deux",
    description: "Description courte du projet, à préciser via le CMS.",
    tags: ["Automatisation"],
    bg: "#2E1A4E",
    textColor: "#FFFFFF",
  },
  {
    slug: "projet-trois",
    name: "PROJET 3",
    longName: "Projet Trois",
    description: "Description courte du projet, à préciser via le CMS.",
    tags: ["Produit"],
    bg: "#0D2B1A",
    textColor: "#FFFFFF",
  },
  {
    slug: "projet-quatre",
    name: "PROJET 4",
    longName: "Projet Quatre",
    description: "Description courte du projet, à préciser via le CMS.",
    tags: ["Design"],
    bg: "#2D0015",
    textColor: "#FFFFFF",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- content/projects.test
```

Expected: PASS.

- [ ] **Step 5: Write the failing test for Realisations**

```tsx
// portfolio-next/components/site/Realisations.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Realisations } from "./Realisations";
import { projects } from "@/content/projects";

describe("Realisations", () => {
  it("shows the waiting state by default and swaps to a project on hover", () => {
    render(<Realisations />);
    expect(screen.getByText("Survole un projet")).toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByTestId(`project-row-${projects[0].slug}`));
    expect(screen.getAllByText(projects[0].longName).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

```bash
npm test -- Realisations.test
```

Expected: FAIL.

- [ ] **Step 7: Implement Realisations**

```tsx
// portfolio-next/components/site/Realisations.tsx
"use client";
import { useState } from "react";
import { projects, type Project } from "@/content/projects";

export function Realisations() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section className="rounded-[20px] px-12 py-10">
      <div className="mb-10">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-accent">
          MES RÉALISATIONS
        </p>
        <h2 className="text-2xl font-bold text-ink">Projets &amp; Use case</h2>
      </div>

      <div className="flex items-stretch gap-14">
        <div className="relative flex-[0_0_44%] overflow-hidden rounded-2xl bg-[#F5F5F7]">
          {active ? (
            <div
              className="flex h-full flex-col items-center justify-center p-10 text-center"
              style={{ background: active.bg, color: active.textColor }}
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] opacity-45">
                {active.name}
              </p>
              <p className="text-2xl font-extrabold leading-tight tracking-tight">
                {active.longName}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {active.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <p className="text-sm font-semibold text-[#8E8E93]">En attente…</p>
              <p className="text-xs text-[#B8B8BE]">Survole un projet</p>
            </div>
          )}
        </div>

        <div className="flex-1">
          {projects.map((p) => (
            <div key={p.slug}>
              <a
                href={`/projets/${p.slug}`}
                data-testid={`project-row-${p.slug}`}
                onMouseEnter={() => setActive(p)}
                onMouseLeave={() => setActive(null)}
                className="flex items-center gap-5 rounded-2xl px-4 py-[22px] hover:bg-black/[0.03]"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1.5 text-[17px] font-bold text-ink">{p.longName}</h3>
                  <p className="text-[13px] leading-relaxed text-muted-2">{p.description}</p>
                </div>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFC800" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
              <div className="mx-4 h-px bg-hairline" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- Realisations.test
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add portfolio-next
git commit -m "Add project data model and Realisations hover section"
```

---

### Task 7: Playground section (flip + tilt cards, sprite walker)

**Files:**
- Create: `portfolio-next/components/site/PlaygroundCard.tsx`
- Test: `portfolio-next/components/site/PlaygroundCard.test.tsx`
- Create: `portfolio-next/components/site/Playground.tsx`
- Test: `portfolio-next/components/site/Playground.test.tsx`

**Interfaces:**
- Consumes: `useTiltHover` from `@/lib/useTiltHover` (Task 2).
- Produces: `<PlaygroundCard tool={string} title={string} description={string} front={React.ReactNode} span={1 | 2} dark?={boolean} />` — a card that tilts toward the pointer and flips from `front` to a back face (tool/title/description/CTA) on hover.
- Produces: `<Playground />` — no props, renders the section heading plus the 4 `PlaygroundCard`s and the idle "Pharamp" walker strip.

- [ ] **Step 1: Write the failing test for PlaygroundCard**

```tsx
// portfolio-next/components/site/PlaygroundCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { PlaygroundCard } from "./PlaygroundCard";

describe("PlaygroundCard", () => {
  it("shows the front content and reveals the back on hover", () => {
    render(
      <PlaygroundCard
        tool="Weweb"
        title="Tickly"
        description="Minuteur Pomodoro."
        front={<p>25:00</p>}
        span={2}
      />
    );
    expect(screen.getByText("25:00")).toBeInTheDocument();
    expect(screen.getByText("Tickly")).toBeInTheDocument();

    fireEvent.mouseMove(screen.getByTestId("playground-card-Tickly"), {
      clientX: 10,
      clientY: 10,
    });
    expect(screen.getByTestId("playground-card-Tickly")).toHaveStyle({
      cursor: "pointer",
    });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- PlaygroundCard.test
```

Expected: FAIL.

- [ ] **Step 3: Implement PlaygroundCard**

```tsx
// portfolio-next/components/site/PlaygroundCard.tsx
"use client";
import { useState } from "react";
import { useTiltHover } from "@/lib/useTiltHover";

export function PlaygroundCard({
  tool,
  title,
  description,
  front,
  span,
  dark = false,
}: {
  tool: string;
  title: string;
  description: string;
  front: React.ReactNode;
  span: 1 | 2;
  dark?: boolean;
}) {
  const { style, onMouseMove, onMouseLeave } = useTiltHover(8);
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      data-testid={`playground-card-${title}`}
      className={`relative h-[300px] cursor-pointer rounded-2xl ${span === 2 ? "col-span-2" : ""}`}
      style={{ ...style, transition: "transform 0.1s ease" }}
      onMouseMove={(e) => {
        onMouseMove(e);
        setFlipped(true);
      }}
      onMouseLeave={() => {
        onMouseLeave();
        setFlipped(false);
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl transition-transform duration-500"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {!flipped && <div className="absolute inset-0 flex items-center justify-center">{front}</div>}
        {flipped && (
          <div
            className="absolute inset-0 flex flex-col justify-end p-6"
            style={{ transform: "rotateY(180deg)", background: dark ? "#1D1D1F" : undefined }}
          >
            <span className={`mb-2 text-[11px] font-bold uppercase tracking-[0.12em] ${dark ? "text-white/45" : "text-black/40"}`}>
              {tool}
            </span>
            <h3 className={`mb-2 text-2xl font-extrabold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
              {title}
            </h3>
            <p className={`mb-5 text-sm leading-relaxed ${dark ? "text-white/70" : "text-black/60"}`}>
              {description}
            </p>
            <div className={`inline-flex items-center gap-1.5 text-sm font-bold ${dark ? "text-white" : "text-ink"}`}>
              Tester l&apos;app →
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- PlaygroundCard.test
```

Expected: PASS.

- [ ] **Step 5: Write the failing test for Playground**

```tsx
// portfolio-next/components/site/Playground.test.tsx
import { render, screen } from "@testing-library/react";
import { Playground } from "./Playground";

describe("Playground", () => {
  it("renders the section heading and all four apps", () => {
    render(<Playground />);
    expect(screen.getByText("Petites apps à tester")).toBeInTheDocument();
    expect(screen.getByText("Tickly")).toBeInTheDocument();
    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByText("CoolFit")).toBeInTheDocument();
    expect(screen.getByText("Kumai")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

```bash
npm test -- Playground.test
```

Expected: FAIL.

- [ ] **Step 7: Implement Playground**

```tsx
// portfolio-next/components/site/Playground.tsx
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
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- Playground.test
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add portfolio-next
git commit -m "Add Playground section with flip-tilt cards"
```

---

### Task 8: Assemble the Accueil page

**Files:**
- Modify: `portfolio-next/app/page.tsx`
- Test: `portfolio-next/app/page.test.tsx`

**Interfaces:**
- Consumes: `Nav`, `Hero`, `Bio`, `Realisations`, `Playground`, `Footer` from `@/components/site/*`.

- [ ] **Step 1: Write the failing test**

```tsx
// portfolio-next/app/page.test.tsx
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Home page", () => {
  it("renders every section in order", () => {
    render(<Page />);
    expect(screen.getByText("Gautier Baleda")).toBeInTheDocument();
    expect(screen.getByText("Un Product Builder passionné par l'impact")).toBeInTheDocument();
    expect(screen.getByText("Projets & Use case")).toBeInTheDocument();
    expect(screen.getByText("Petites apps à tester")).toBeInTheDocument();
    expect(screen.getByText("Un projet en tête ?")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- app/page.test
```

Expected: FAIL (current scaffold `page.tsx` is the default Next.js starter).

- [ ] **Step 3: Implement the page**

```tsx
// portfolio-next/app/page.tsx
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Bio } from "@/components/site/Bio";
import { Realisations } from "@/components/site/Realisations";
import { Playground } from "@/components/site/Playground";
import { Footer } from "@/components/site/Footer";

export default function Page() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-8 py-6 md:px-[120px]">
      <Nav />
      <Hero />
      <Bio />
      <Realisations />
      <Playground />
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- app/page.test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add portfolio-next
git commit -m "Assemble Accueil page from site sections"
```

---

### Task 9: À Propos page

**Files:**
- Create: `portfolio-next/app/a-propos/page.tsx`
- Test: `portfolio-next/app/a-propos/page.test.tsx`

**Interfaces:**
- Consumes: `Nav`, `Footer` from `@/components/site/*`.

- [ ] **Step 1: Write the failing test**

```tsx
// portfolio-next/app/a-propos/page.test.tsx
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("À propos page", () => {
  it("renders the name, role, and each work experience", () => {
    render(<Page />);
    expect(screen.getByText("Designer & Développeur")).toBeInTheDocument();
    expect(screen.getByText("Dorêka · Paris")).toBeInTheDocument();
    expect(screen.getByText("Carrefour · Massy")).toBeInTheDocument();
    expect(screen.getByText("Enedis · Lyon").length ?? 1).toBeTruthy();
    expect(screen.getByText("Casino · Saint-Étienne")).toBeInTheDocument();
    expect(screen.getByText("Musique")).toBeInTheDocument();
    expect(screen.getByText("Gaming & Mangas")).toBeInTheDocument();
    expect(screen.getByText("Associations")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- a-propos/page.test
```

Expected: FAIL — route doesn't exist yet.

- [ ] **Step 3: Implement the page**

```tsx
// portfolio-next/app/a-propos/page.tsx
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const EXPERIENCES = [
  {
    period: "2025 →",
    title: "Product Builder",
    tag: "Poste actuel",
    place: "Dorêka · Paris",
    description:
      "Développement SaaS sur Bubble, implémentation d'outils no-code et IA pour les équipes, et automatisation de process métier de bout en bout.",
  },
  {
    period: "2025",
    title: "Chef de projet réseau",
    tag: null,
    place: "Carrefour · Massy",
    description:
      "Planification du déploiement d'équipements réseau, mise en place de KPI, coordination des remises en conformité des baies informatiques en magasin, et suivi budgétaire.",
  },
  {
    period: "2023–2024",
    title: "Chargé d'Affaires IT",
    tag: null,
    place: "Enedis · Lyon",
    description:
      "Accompagnement de projets DSI, migration d'applications vers AWS et On Premise, pilotage de projet en méthode Agile, installation et supervision de serveurs, et amélioration continue via KPI.",
  },
  {
    period: "2021–2023",
    title: "Expert Habilitation",
    tag: null,
    place: "Enedis · Lyon",
    description:
      "Gestion des accès applicatifs, pilotage de la création de formulaires web, automatisation de process de reporting via UIPath (RPA), et développement de formulaires en VBA.",
  },
  {
    period: "2019–2021",
    title: "Expert Sécurité Informatique",
    tag: null,
    place: "Casino · Saint-Étienne",
    description:
      "Support N3 sur les incidents de sécurité (JIRA, Ivanti), analyse de logs, gestion des droits via Active Directory, et support du VPN Citrix pendant la crise COVID.",
  },
];

const INTERESTS = [
  {
    title: "Musique",
    description:
      "Guitariste passionné depuis mes 15 ans, je trouve dans la musique un véritable terrain d'évasion et un langage commun à partager.",
    tag: "Jam session 🎸",
  },
  {
    title: "Gaming & Mangas",
    description:
      "Des univers de jeux vidéo aux pages de mangas, je suis un amoureux d'histoires et d'aventures. Une culture geek revendiquée qui m'accompagne depuis toujours et qui stimule ma créativité.",
    tag: "Gaming & Mangas 🎮",
  },
  {
    title: "Associations",
    description:
      "Fort d'une expérience de responsable auprès de jeunes chrétiens malgaches, j'ai développé un goût prononcé pour l'animation de communauté, l'écoute et l'organisation d'événements. Un engagement humain et bénévole qui a forgé mon sens des responsabilités.",
    tag: "Assemblée générale 🙌",
  },
];

export default function Page() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-8 py-6 md:px-[120px]">
      <Nav />

      <section className="rounded-[20px] px-10 py-16 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-accent">
          À propos
        </p>
        <h1 className="text-6xl font-extrabold leading-none tracking-tight text-ink">
          Gautier
          <br />
          Baleda
        </h1>
        <p className="mt-4 text-xl font-semibold text-muted">Designer &amp; Développeur</p>
        <p className="mx-auto mt-6 max-w-[560px] text-base leading-relaxed text-muted">
          Passionné par les interfaces qui ont du sens et le code qui va avec.
          Je travaille à l&apos;intersection du design et du développement —
          concevoir des expériences soignées, les prototyper rapidement, et
          les pousser en prod.
        </p>
        <p className="mx-auto mt-2 max-w-[560px] text-base leading-relaxed text-muted">
          Toujours curieux, toujours en mouvement — que ce soit sur un projet
          perso, dans une asso, ou sur les sentiers.
        </p>
      </section>

      <section className="rounded-[20px] px-10 py-10">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-accent">
          Parcours
        </p>
        <h2 className="mb-8 text-2xl font-bold text-ink">Expériences pro</h2>
        <div className="flex flex-col gap-8">
          {EXPERIENCES.map((exp) => (
            <div key={exp.title} className="flex gap-8 border-b border-hairline pb-8">
              <div className="w-24 shrink-0 text-sm font-semibold text-muted-2">
                {exp.period}
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">
                  {exp.title}
                  {exp.tag && (
                    <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-ink">
                      {exp.tag}
                    </span>
                  )}
                </h3>
                <p className="mb-2 text-sm font-medium text-muted-2">{exp.place}</p>
                <p className="text-sm leading-relaxed text-muted">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[20px] px-10 py-10">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-accent">
          En dehors du boulot
        </p>
        <h2 className="mb-8 text-2xl font-bold text-ink">Ce qui m&apos;anime</h2>
        <div className="grid grid-cols-3 gap-6">
          {INTERESTS.map((i) => (
            <div key={i.title} className="rounded-2xl bg-[#F5F5F7] p-6">
              <h3 className="mb-2 text-lg font-bold text-ink">{i.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted">{i.description}</p>
              <span className="text-sm font-medium text-muted-2">{i.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- a-propos/page.test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add portfolio-next
git commit -m "Add A Propos page"
```

---

### Task 10: Projets list page and project detail page

**Files:**
- Create: `portfolio-next/components/site/ProjectCard.tsx`
- Test: `portfolio-next/components/site/ProjectCard.test.tsx`
- Create: `portfolio-next/app/projets/page.tsx`
- Test: `portfolio-next/app/projets/page.test.tsx`
- Create: `portfolio-next/app/projets/[slug]/page.tsx`
- Test: `portfolio-next/app/projets/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `projects`, `getProjectBySlug`, `type Project` from `@/content/projects` (Task 6).
- Produces: `<ProjectCard project={Project} />` — a card linking to `/projets/[slug]`.

- [ ] **Step 1: Write the failing test for ProjectCard**

```tsx
// portfolio-next/components/site/ProjectCard.test.tsx
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import { projects } from "@/content/projects";

describe("ProjectCard", () => {
  it("links to the project's detail page", () => {
    render(<ProjectCard project={projects[0]} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", `/projets/${projects[0].slug}`);
    expect(screen.getByText(projects[0].longName)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- ProjectCard.test
```

Expected: FAIL.

- [ ] **Step 3: Implement ProjectCard**

```tsx
// portfolio-next/components/site/ProjectCard.tsx
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
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- ProjectCard.test
```

Expected: PASS.

- [ ] **Step 5: Write the failing test for the Projets list page**

```tsx
// portfolio-next/app/projets/page.test.tsx
import { render, screen } from "@testing-library/react";
import Page from "./page";
import { projects } from "@/content/projects";

describe("Projets page", () => {
  it("renders a card for every project", () => {
    render(<Page />);
    for (const p of projects) {
      expect(screen.getByText(p.longName)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 6: Run it to verify it fails**

```bash
npm test -- projets/page.test
```

Expected: FAIL — route doesn't exist.

- [ ] **Step 7: Implement the Projets list page**

```tsx
// portfolio-next/app/projets/page.tsx
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ProjectCard } from "@/components/site/ProjectCard";
import { projects } from "@/content/projects";

export default function Page() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-8 py-6 md:px-[120px]">
      <Nav />
      <section className="rounded-[20px] px-10 py-16">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-accent">
          MES RÉALISATIONS
        </p>
        <h1 className="mb-10 text-4xl font-extrabold tracking-tight text-ink">
          Projets &amp; Use case
        </h1>
        <div className="grid grid-cols-2 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npm test -- projets/page.test
```

Expected: PASS.

- [ ] **Step 9: Write the failing test for the project detail page**

```tsx
// portfolio-next/app/projets/[slug]/page.test.tsx
import { render, screen } from "@testing-library/react";
import Page from "./page";
import { projects } from "@/content/projects";
import { notFound } from "next/navigation";

vi.mock("next/navigation", () => ({ notFound: vi.fn() }));

describe("Project detail page", () => {
  it("renders the project's long name and description", () => {
    render(<Page params={{ slug: projects[0].slug }} />);
    expect(screen.getByText(projects[0].longName)).toBeInTheDocument();
    expect(screen.getByText(projects[0].description)).toBeInTheDocument();
  });

  it("calls notFound for an unknown slug", () => {
    render(<Page params={{ slug: "unknown" }} />);
    expect(notFound).toHaveBeenCalled();
  });
});
```

- [ ] **Step 10: Run it to verify it fails**

```bash
npm test -- "projets/\[slug\]/page.test"
```

Expected: FAIL — route doesn't exist.

- [ ] **Step 11: Implement the project detail page**

```tsx
// portfolio-next/app/projets/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getProjectBySlug } from "@/content/projects";

export default function Page({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
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
```

- [ ] **Step 12: Run the test to verify it passes**

```bash
npm test -- "projets/\[slug\]/page.test"
```

Expected: PASS.

- [ ] **Step 13: Commit**

```bash
git add portfolio-next
git commit -m "Add Projets list and project detail pages"
```

---

### Task 11: Visual QA against the current bundle

**Files:**
- None created — this is a manual verification pass.

**Interfaces:**
- Consumes: the running Next.js dev server and the two reference bundle files.

- [ ] **Step 1: Run the full test suite**

```bash
cd portfolio-next && npm test
```

Expected: all tests PASS.

- [ ] **Step 2: Start the dev server**

```bash
npm run dev -- --port 3100 &
sleep 3
```

- [ ] **Step 3: Open the reference bundle and the new site side by side**

```bash
open "http://localhost:3100"
open "../Gautier Baleda - Portfolio.html"
open "http://localhost:3100/a-propos"
open "../About Gautier Baleda.html"
```

- [ ] **Step 4: Manually compare, section by section**

Check against the reference bundle:
- Nav: links, spacing, accent Contact button.
- Hero: typing line, name size/color, 4 hero cards (hover each: bricks re-align, code brackets open + "/hey" text appears, gears spin, rocket flame/smoke/float), role heading, subtitle.
- Bio: copy matches, layout matches.
- Réalisations: hovering a project row swaps the left preview panel's color/name/tags (documented simplification: no scroll-jacking).
- Playground: hover each card, confirm tilt + flip-to-back reveal; confirm Pharamp walker animates.
- Contact/Footer: email link, LinkedIn/GitHub buttons, copyright.
- À Propos: hero name/role, all 5 experience entries, all 3 interest cards.
- Projets: grid renders, clicking a card opens its detail page.

Fix any visual discrepancy found by editing the relevant component from Tasks 3–10, then re-run that component's test file before moving on.

- [ ] **Step 5: Stop the dev server**

```bash
kill %1
```

- [ ] **Step 6: Commit any fixes made during QA**

```bash
git add portfolio-next
git commit -m "Visual QA fixes against reference bundle"
```

(Skip this step if no fixes were needed.)

---

## Self-Review Notes

- **Spec coverage:** Accueil (Hero/Bio/Réalisations/Playground/Contact — Tasks 4–8), Projets grille + détail (Task 10), À Propos (Task 9), design tokens (Task 1/2), animations (Tasks 2/4/6/7), content extraction reused verbatim for non-project copy (Tasks 4/5/7/9), generic project content (Task 6) — all spec sections have a task.
- **Flagged scope decision:** Task 6 documents that the Réalisations panel uses hover-driven React state instead of the original scroll-jacked imperative behavior. This is a deliberate simplification of one specific interaction, not a silent cut — raise it explicitly when reviewing Task 6/11.
- **Type consistency:** `Project` type (Task 6) is used identically in `Realisations.tsx` (Task 6), `ProjectCard.tsx`, and both `app/projets/*` pages (Task 10) — same field names (`slug`, `name`, `longName`, `description`, `tags`, `bg`, `textColor`) throughout.
