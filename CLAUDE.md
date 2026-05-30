# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

JEAP (Jeen Eventz & Planners) — a luxury events-house marketing site with a dark
cinematic aesthetic: WebGL atmosphere, editorial typography, and scroll-choreographed
motion. Pure front-end; there is no backend, database, or test suite.

## Commands

```bash
npm run dev      # next dev — http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # next lint
```

Node `22.x` (see `package.json` engines / `.nvmrc`). There are no tests.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind 3 · GSAP +
ScrollTrigger · Framer Motion · Three.js / React Three Fiber · Lenis.

Path alias: `@/*` maps to the repo root (e.g. `@/lib/site`, `@/components/...`).

## The one shared clock — Lenis ⇄ GSAP ⇄ ScrollTrigger

`components/providers/SmoothScroll.tsx` is the scroll backbone and the most
load-bearing file. It wires Lenis and GSAP into a single RAF loop:
`lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker` drives `lenis.raf`, and
`gsap.ticker.lagSmoothing(0)`. **Do not add a second `requestAnimationFrame` loop
for Lenis** — everything must share this one clock or pinned sections desync. On
route change it scrolls to top and calls `ScrollTrigger.refresh()`. Reduced-motion
bails out of Lenis entirely.

Consequences that ripple through the codebase:

- **`app/template.tsx`** (the page-transition wrapper) fades with **opacity only** —
  no `transform`/`filter`. Either would create a containing block for
  `position: fixed` and break the services rail's pin.
- **`app/globals.css`** uses `overflow-x: clip` (not `hidden`) on `body`, because
  `hidden` turns the body into a scroll container and hijacks ScrollTrigger/Lenis.

## WebGL is always lazy and isolated

Every Three.js entry point is mounted via `next/dynamic({ ssr: false })` so the
three/fiber bundle never blocks first paint. `three` is deliberately **not** in
`transpilePackages` (see the comment in `next.config.mjs` — adding it OOM'd Vercel
builds). Canvas wrappers (`components/webgl/AtmosphereCanvas.tsx`,
`components/sections/home/HeroCanvas.tsx`) are thin; shaders/scene logic live
beside them. Atmosphere/grain ambience lives **only inside the hero canvas** — the
global `.atmosphere` + `<Grain>` layers were removed from `layout.tsx` because as
fixed full-viewport layers they bled haze across every section.

Service-card hover distortion (`components/webgl/DistortField.tsx`) mounts a canvas
**only on hover**, and `HorizontalRail` lifts active-card state so exactly one hover
canvas exists at a time. Shader uniforms are driven imperatively via refs in
`useFrame` (no React state, zero rerenders) — follow this pattern for new shaders.

## Layout & routing

- `app/layout.tsx` — root shell: fonts, `<SmoothScroll>`, `<Cursor>`,
  `<ScrollProgress>`, `<Navbar>`, `<main>`, `<Footer>`, `<Preloader>`. Metadata
  title template + OG live here.
- Routes are folders under `app/`: `/` `about` `services` `projects` `clients`
  `contact`, each a `page.tsx`.
- Inner pages compose the shared **`PageHero`** (`components/ui/PageHero.tsx`):
  index/kicker chapter row + oversized title that lifts line-by-line via a
  `line-mask` + Framer variant, plus scroll parallax.

## Code organization

- `components/ui/` — reusable primitives (`Reveal*`, `Magnetic`, `Marquee`,
  `Visual`, `PageHero`, `Cursor`, `Grain`, `ScrollProgress`).
- `components/sections/<page>/` — page-specific section components.
- `components/layout/`, `components/providers/`, `components/webgl/`.
- `lib/site.ts` — **single source of content**: `SITE`, `NAV`, `SERVICES`,
  `PROJECTS`. Edit copy/nav/case-studies here, not in components.
- `lib/fonts.ts` — `next/font/google`: `display` = **Fraunces** (`--font-display`,
  editorial serif), `inter` = body (`--font-inter`), `anton` = **Anton**
  (`--font-anton`, hero title only). To swap the display face, change this file
  and keep the CSS variable name; nothing else needs to change.
- `lib/utils.ts` — `cn` (clsx wrapper), `mapRange`, `splitChars`.

## Design system

Tokens in `tailwind.config.ts` + utility classes in `app/globals.css`:

- **Color** — `noir` (near-black), `gold` (`#c9a25a` + `light`/`deep`/`glow`),
  `navy`, plus `bone`/`ash`/`ink`.
- **Type** — `font-display` (Fraunces), `font-body` (Inter). CSS helpers:
  `.display`, `.kicker` (tracked gold caps), `.body-lg`, `.gilt` (gold shimmer
  gradient text).
- **Motion** — `ease-luxe` / `ease-cinematic` timing functions; the cubic
  `[0.16, 1, 0.3, 1]` (expo-out) recurs across GSAP and Framer transitions.
- **Helpers** — `.line-mask`/`.line-inner` (clip-and-lift text reveals),
  `.hairline`, `.link-underline`, `.no-scrollbar`, `.grain`, `.atmosphere`.

Imagery is procedural: `components/ui/Visual.tsx` renders art-directed gradient/
light plates standing in for photography. Swap in `next/image` sources inside that
one component without touching layouts.

## Conventions

- Interactive/animated components are `"use client"`; keep static content as
  Server Components where possible.
- Pinned/horizontal-scroll sections use `useGSAP` + `gsap.matchMedia()` with
  desktop pin and a mobile / reduced-motion fallback (see
  `components/sections/services/HorizontalRail.tsx`). Use function-valued `x`/`end`
  + `invalidateOnRefresh` so pins recompute on resize and font-swap.
- `prefers-reduced-motion` and `(pointer: coarse)` are honored throughout
  (Lenis, cursor, shimmer, parallax) — preserve these fallbacks.

> Note: `README.md` predates some changes — it cites Next 15 and "Playfair
> Display", but the code is on Next 16 with Fraunces (display) + Anton (hero).
> Trust `package.json` and `lib/fonts.ts`.
