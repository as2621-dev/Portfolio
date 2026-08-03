/**
 * Home-page journey content: the PM skill registry + the first-to-last venture
 * story told as clickable blocks, with connector lines between eras.
 *
 * Skills are the connective tissue of the home page: the overview renders the
 * registry as colored pills, and each venture block / product tile pins the
 * skill_ids it earned. Colors come from the Folio Pop token palette; every
 * [background, text] pair was chosen for contrast on the cream page.
 *
 * Numbers policy applies here exactly as in site.ts — unverified figures carry
 * inline [CONFIRM]/[FOUNDER] tags (rendered as staging chips via InlineText).
 */

/** One skill in the registry — referenced by id from ventures and tiles. */
export interface PmSkillDefinition {
  skill_id: string;
  skill_label: string;
  /** Pill surface color (token reference or hex). */
  skill_background: string;
  /** Text color that passes contrast on that surface. */
  skill_text: string;
}

/** A clickable venture block in the journey (opens its dedicated page). */
export interface JourneyVentureStep {
  step_kind: "venture";
  /** Mono period label, e.g. "2018 — 2023". */
  journey_period: string;
  journey_title: string;
  /** Supports InlineText markup, incl. [CONFIRM]/[FOUNDER] staging chips. */
  journey_summary: string;
  journey_stat?: string;
  journey_stat_label?: string;
  href: string;
  journey_tint?: "orange" | "blue" | "sun";
  skill_ids: string[];
}

/** A short narrative line between eras (the "why we moved on" beats). */
export interface JourneyConnectorStep {
  step_kind: "connector";
  /** Supports InlineText markup. */
  connector_text: string;
}

/** Renders the 2022→2025 company-vs-models timeline strip inline. */
export interface JourneyTimelineStep {
  step_kind: "timeline";
}

/** Renders the own-products tile grid (reads PRODUCT_TILES). */
export interface JourneyProductTilesStep {
  step_kind: "product_tiles";
}

export type JourneyStep = JourneyVentureStep | JourneyConnectorStep | JourneyTimelineStep | JourneyProductTilesStep;

/** A small clickable tile for a solo-built product. */
export interface ProductTileEntry {
  tile_title: string;
  tile_summary: string;
  /** Which mark ProductLogo renders for this tile. */
  tile_logo_id: "canvas" | "orbit" | "blip" | "jobfairy" | "electricitybillsaved";
  href: string;
  skill_ids: string[];
}

/** The PM skill registry — an overview, each with its own color. */
export const PM_SKILLS: PmSkillDefinition[] = [
  {
    skill_id: "product-strategy",
    skill_label: "Product strategy",
    skill_background: "var(--blue-100)",
    skill_text: "var(--blue-800)",
  },
  {
    skill_id: "prioritization",
    skill_label: "Prioritization",
    skill_background: "var(--orange-100)",
    skill_text: "var(--orange-700)",
  },
  {
    skill_id: "evals",
    skill_label: "Evals & model quality",
    skill_background: "var(--mint-100)",
    skill_text: "#116b4c",
  },
  {
    skill_id: "zero-to-one",
    skill_label: "0→1 execution",
    skill_background: "var(--sun-100)",
    skill_text: "#8a5e00",
  },
  {
    skill_id: "gtm",
    skill_label: "Go-to-market",
    skill_background: "var(--coral-100)",
    skill_text: "#ad2f4e",
  },
  {
    skill_id: "discovery",
    skill_label: "User & market discovery",
    skill_background: "var(--blue-700)",
    skill_text: "#ffffff",
  },
  {
    skill_id: "data",
    skill_label: "Data & unit economics",
    skill_background: "var(--ink)",
    skill_text: "#ffffff",
  },
  {
    skill_id: "teams",
    skill_label: "Teams & stakeholders",
    skill_background: "var(--mint-500)",
    skill_text: "var(--ink)",
  },
  {
    skill_id: "pricing",
    skill_label: "Pricing & packaging",
    skill_background: "var(--orange-500)",
    skill_text: "#ffffff",
  },
  {
    skill_id: "prds",
    skill_label: "PRDs & specs",
    skill_background: "var(--sun-400)",
    skill_text: "var(--ink)",
  },
  {
    skill_id: "agents",
    skill_label: "Agent architectures",
    skill_background: "var(--blue-800)",
    skill_text: "#ffffff",
  },
  {
    skill_id: "pnl",
    skill_label: "P&L ownership",
    skill_background: "var(--orange-50)",
    skill_text: "var(--orange-600)",
  },
  {
    skill_id: "ops-scale",
    skill_label: "Ops at scale",
    skill_background: "var(--blue-50)",
    skill_text: "var(--blue-700)",
  },
  {
    skill_id: "product-design",
    skill_label: "Product design",
    skill_background: "var(--paper)",
    skill_text: "var(--ink)",
  },
];

/** Registry lookup; throws loudly in dev if a block references a bad id. */
export function getPmSkill(skill_id: string): PmSkillDefinition {
  const skill = PM_SKILLS.find((entry) => entry.skill_id === skill_id);
  if (!skill) throw new Error(`Unknown skill_id "${skill_id}" — add it to PM_SKILLS in src/content/journey.ts`);
  return skill;
}

/** The journey, first venture to now — rendered top-down on the home page. */
export const JOURNEY_STEPS: JourneyStep[] = [
  {
    step_kind: "venture",
    journey_period: "2018 — 2023",
    journey_title: "Two consumer brands on Amazon",
    journey_summary:
      "My first products were physical: **A Baby Cherry**® (baby essentials) and **Decor & More**® (home decor) — sourced from factories in China, Vietnam, and India, sold on Amazon, run with a team of eight. Sourcing, listings, pricing, reviews, returns: the whole loop.",
    journey_stat: "2",
    journey_stat_label: "brands built & trademarked",
    href: "/work/ecommerce-brands",
    journey_tint: "sun",
    skill_ids: ["discovery", "gtm", "pnl", "data"],
  },
  {
    step_kind: "venture",
    journey_period: "2022 — 2023",
    journey_title: "Marketplace automation at scale",
    journey_summary:
      "A managed-service operation running US Walmart storefronts for client owners, fulfilled from Amazon — 77 client stores on a custom-built platform that automated listing, repricing, inventory sync, and tracking end to end, with a ~35-person ops team hired in about eight weeks.",
    journey_stat: "$593K",
    journey_stat_label: "peak monthly GMV",
    href: "/work/marketplace-automation",
    journey_tint: "blue",
    skill_ids: ["zero-to-one", "ops-scale", "teams", "pnl", "data"],
  },
  {
    step_kind: "connector",
    connector_text:
      "I sold the business because I saw the rise of AI — and I wanted to make a meaningful contribution to it. Inside ecommerce the signal was unmissable: everything was getting easier except product imagery. Image generation was the bottleneck, and Stable Diffusion had just landed.",
  },
  {
    step_kind: "venture",
    journey_period: "2022 — 2024",
    journey_title: "QuicSnap — AI product photography as a service",
    journey_summary:
      "AI-plus-humans photography for label-heavy ecommerce brands. Early models hallucinated fine print, so we built a 3D model of each product and generated the scene around it — and I built the outbound machine that brought in clients across the US, EU, and Middle East.",
    journey_stat: "$61K+",
    journey_stat_label: "bootstrapped revenue",
    href: "/work/quicsnap-shutter-labs",
    journey_tint: "orange",
    skill_ids: ["discovery", "gtm", "pricing", "zero-to-one", "teams"],
  },
  {
    step_kind: "connector",
    connector_text:
      "Then Flux.1 shipped, and my read changed: the fine-print problem was going to be solved by the base models — a matter of when, not if. A human-in-the-loop service couldn't scale into that future. The service became a platform.",
  },
  {
    step_kind: "venture",
    journey_period: "2025",
    journey_title: "Shutter Labs — the platform bet",
    journey_summary:
      "Self-serve product photography: 2D→3D capture plus per-product LoRAs for exact label fidelity. Technical cofounders joined, a Fortune 500 retailer signed a POC — then Nano Banana Pro shipped, absorbed the differentiator, and we made the trajectory call to stop. The full story, numbers and all, is the flagship case study.",
    journey_stat: "Fortune 500",
    journey_stat_label: "retailer POC",
    href: "/work/quicsnap-shutter-labs",
    skill_ids: ["product-strategy", "prioritization", "teams", "prds"],
  },
  {
    step_kind: "connector",
    connector_text:
      "Since then I've been building my own products — designed, shipped, and evaluated solo, to stay calibrated on what frontier models can actually do this quarter.",
  },
  { step_kind: "product_tiles" },
];

/** The own-products grid — small clickable tiles, newest thinking first. */
export const PRODUCT_TILES: ProductTileEntry[] = [
  {
    tile_title: "Canvas",
    tile_summary:
      "The image workspace built on the model that killed my startup — six models, three lanes, the price printed on the button.",
    tile_logo_id: "canvas",
    href: "/work/canvas",
    skill_ids: ["product-strategy", "zero-to-one", "pricing", "product-design"],
  },
  {
    tile_title: "Orbit",
    tile_summary: "Personal feed ranker over 800+ sources I actually follow; surfaces the ~3% worth reading.",
    tile_logo_id: "orbit",
    href: "/projects/orbit",
    skill_ids: ["data", "evals", "prioritization"],
  },
  {
    tile_title: "blip",
    tile_summary: "News as vertical reels — caption pipeline tuned from 58% to 92% usable output, measured not vibed.",
    tile_logo_id: "blip",
    href: "/projects/blip",
    skill_ids: ["evals", "zero-to-one", "product-design"],
  },
  {
    tile_title: "JobFairy",
    tile_summary:
      "Job-search copilot over 31,926 sponsor companies — with a browser-agent bake-off and real cost data.",
    tile_logo_id: "jobfairy",
    href: "/projects/jobfairy",
    skill_ids: ["prioritization", "evals", "agents", "prds"],
  },
  {
    tile_title: "ElectricityBillSaved",
    tile_summary: "A utility-bill model validated to within $0.17 of the real bill.",
    tile_logo_id: "electricitybillsaved",
    href: "/projects/electricitybillsaved",
    skill_ids: ["data", "discovery"],
  },
];
