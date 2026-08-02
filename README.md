# Folio Pop portfolio

Personal portfolio for **Ashesh Srivastava** — an AI Product Manager / Forward-Deployed Engineer.
Built on the [Folio Pop design system](https://claude.ai/design/p/edc09950-a47b-4511-8dc9-a93584fe8851):
a Linktree-inspired, warm, punchy, link-first single-column page.

> **Status: full site built from the final copy set (staging).** All 10 routes are live: Home
> (hero → featured work → competency strip → closing CTA), two long-form case studies
> (`/work/quicsnap-shutter-labs` with two data-viz charts, `/work/canvas`), a tabbed Projects
> index + four project deep-dives, Library, and About. Unresolved editorial items render as
> yellow **CONFIRM/SLOT chips** (toggle in `src/content/publish-state.ts` — flip
> `SHOW_PENDING_MARKERS` to `false` at publish, after resolving or cutting each item).
> Positioning: AI PM first, founder prologue. Shared copy lives in
> [`src/content/site.ts`](src/content/site.ts); long-form copy in `src/content/case-*.ts` and
> `project-*.ts`. Remaining `TODO`s: social handles, résumé PDF, repo links, location chip,
> two timeline start-years.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** — design tokens bridged into `@theme` (utilities: `font-display`, `rounded-lg`, `shadow-pop`, `bg-cream`, …)
- **next/font** — Bricolage Grotesque (display) / Instrument Sans (body) / IBM Plex Mono (mono)
- **lucide-react** — icons (2px stroke, matches the border system)
- **Biome** — lint + format (120 cols, double quotes)

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Then open:

- `/` — home: hero, featured work, competency strip (every claim links to its receipt)
- `/work/quicsnap-shutter-labs` — the flagship case study (revenue chart + timeline strip)
- `/work/canvas` — case study #2
- `/projects` — tabbed index → `/projects/{orbit,blip,jobfairy,electricitybillsaved}`
- `/library` — six real PM artifacts with context wrappers
- `/about` — journey, timeline, fit, contact
- `/styleguide` — every token + component rendered for verification

## Scripts

```bash
npm run dev         # start the dev server
npm run build       # production build
npm run start       # serve the production build
npm run typecheck   # tsc --noEmit
npm run lint        # Biome check
npm run lint:fix    # Biome check --write (lint + format)
npm run format      # Biome format --write
```

## Project structure

```
src/
  app/
    layout.tsx          # fonts (next/font) + metadata, both from site.ts
    globals.css         # Tailwind + @theme token bridge + base element styles
    page.tsx            # landing hero
    styleguide/page.tsx # component + token showcase
  components/
    ui/                 # Button, IconButton, Input, Card, Badge, Tabs
    portfolio/          # LinkTile, ProjectCard, TimelineItem, SkillChip, SectionHeader
    longform/           # ArticleLayout, BlockRenderer, InlineText (mini-markup), PendingChip
    charts/             # QuicsnapRevenueChart, CompanyTimelineStrip, BakeoffComparisonChart
    motion/Reveal       # IntersectionObserver scroll-reveal (reduced-motion + no-JS safe)
    sections/           # home/projects page sections (FeaturedWork, CompetencyStrip, …)
    brand/MascotLogo    # animated mascot logo (video badge, reduced-motion aware)
    layout/             # SiteHeader (sticky nav) + SiteFooter (mounted on every page)
    icons/BrandIcons    # GitHub / LinkedIn / X inline SVGs (lucide v1 dropped brand icons)
    index.ts            # barrel export → import from "@/components" (DS primitives only)
  content/
    site.ts             # ← single source of truth for shared copy & links
    longform-types.ts   # typed block model for long-form pages
    publish-state.ts    # SHOW_PENDING_MARKERS — staging chips on/off
    case-*.ts           # case-study copy as typed blocks (quicsnap-shutter, canvas)
    project-*.ts        # project-page copy (orbit, blip, jobfairy, electricitybillsaved)
    library-page.ts     # library artifacts + wrappers
    about-page.ts       # about page copy
  styles/
    tokens.css          # design tokens on :root (colors, type scale, spacing, motion)
public/
  mascot/               # brand assets — see below
```

## Brand assets — the explorer mascot

`public/mascot/` holds a cartoon **explorer/adventurer** mascot (hat, green shirt, backpack — an on-theme "forward-deployed" builder):

- **Animated logo** — `logo-mascot.webm` (VP9) + `logo-mascot.mov` (HEVC) + `logo-poster.png`. A 4s loop of the explorer with a compass + torch. The source has a **solid black background (no alpha)**, so `<MascotLogo>` (default `variant="badge"`) frames it as a **dark rounded badge** (the black merges into the frame). Used site-wide via `SiteHeader`. Falls back to the poster under `prefers-reduced-motion`.
- **Transparent cutout** — `logo-mascot-alpha.webm` (VP9 alpha) + `logo-mascot-alpha.mov` (HEVC alpha, Safari) + `logo-poster-alpha.png`, chroma-keyed from the original (`colorkey 0x000000`, tolerance 0.05, no blend — blend washes out the dark linework) and square-cropped to 720×720. Rendered by `<MascotLogo variant="cutout">`, used for the hero avatar directly on cream.
- **Nine sprite tiles** — `mascot-{coding,map,inspect,radio,dig,measure,reading,reading-recline,campfire}.png`, sliced from a 3×3 sheet (`mascot-sheet.png`). Each pose maps to a likely section (coding → hero, map → projects, magnifier → research, radio → contact, …). Previewed in `/styleguide`.

## Editing content

Shared copy, links, projects, skills, and experience live in **`src/content/site.ts`** as typed
data. Long-form pages (case studies, project deep-dives) are typed block lists in
`src/content/case-*.ts` / `project-*.ts`, rendered by `components/longform/`. Inline strings
support a small markup subset — `**bold**`, `*italic*`, `` `code` ``, `[label](href)`, and
editorial tags `[CONFIRM: …]` / `[SLOT: …]` / `[VERIFY: …]` / `[FOUNDER — …]` that render as
staging chips while `SHOW_PENDING_MARKERS` is true. Search for `TODO` and the chips to find
everything still awaiting confirmation.

## Design system

Visual rules (palette, type, the 2px-border + hard-shadow "pop", voice) come from Folio Pop.
The tokens in `src/styles/tokens.css` and the `@theme` block in `globals.css` are ported directly from it —
keep them as the source of truth rather than hardcoding colors/spacing in components.

## Deployment

Optimized for **Vercel** (`npm run build`). Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`).
