/**
 * Home-page journey content: the PM + FDE skill registry + the first-to-last
 * venture story told as clickable blocks, with connector lines between eras.
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
  tile_logo_id: "canvas" | "orbit" | "blip" | "jobfairy" | "astrape";
  href: string;
  skill_ids: string[];
}

/**
 * The PM + FDE skill registry — an overview, each with its own color.
 *
 * Tag set derived from hiring-market research (2026-08): the four core PM
 * competency buckets everyone screens for (Reforge/Ravi Mehta — strategy,
 * execution, customer insight, influencing people) plus the AI-builder skills
 * named verbatim in Anthropic/OpenAI/Glean/Sierra forward-deployed-engineer
 * postings ("prompt engineering, agent development, evaluation frameworks,
 * deployment at scale"). Business-operator tags (pricing, P&L) deliberately
 * excluded. Every tag must be pinnable to at least one venture/tile below —
 * "MCP & tool integration" was cut for lack of an on-site receipt.
 */
export const PM_SKILLS: PmSkillDefinition[] = [
  // — Core PM (the four consensus competency buckets) —
  {
    skill_id: "product-strategy",
    skill_label: "Product strategy",
    skill_background: "var(--blue-100)",
    skill_text: "var(--blue-800)",
  },
  {
    skill_id: "product-execution",
    skill_label: "Product execution",
    skill_background: "var(--orange-100)",
    skill_text: "var(--orange-700)",
  },
  {
    skill_id: "customer-discovery",
    skill_label: "Customer discovery",
    skill_background: "var(--blue-700)",
    skill_text: "#ffffff",
  },
  {
    skill_id: "stakeholder-alignment",
    skill_label: "Stakeholder alignment",
    skill_background: "var(--mint-500)",
    skill_text: "var(--ink)",
  },
  // — AI builder / FDE —
  {
    skill_id: "llm-evals",
    skill_label: "LLM evals",
    skill_background: "var(--mint-100)",
    skill_text: "#116b4c",
  },
  {
    skill_id: "agent-architecture",
    skill_label: "Agent architecture",
    skill_background: "var(--blue-800)",
    skill_text: "#ffffff",
  },
  {
    skill_id: "prompt-engineering",
    skill_label: "Prompt engineering",
    skill_background: "var(--orange-500)",
    skill_text: "#ffffff",
  },
  {
    skill_id: "rag-retrieval",
    skill_label: "RAG & retrieval",
    skill_background: "var(--coral-100)",
    skill_text: "#ad2f4e",
  },
  {
    skill_id: "rapid-prototyping",
    skill_label: "Rapid prototyping",
    skill_background: "var(--sun-400)",
    skill_text: "var(--ink)",
  },
  {
    skill_id: "production-deployment",
    skill_label: "Production deployment",
    skill_background: "var(--ink)",
    skill_text: "#ffffff",
  },
  {
    skill_id: "full-stack-development",
    skill_label: "Full-stack development",
    skill_background: "var(--blue-50)",
    skill_text: "var(--blue-700)",
  },
  {
    skill_id: "python-typescript",
    skill_label: "Python & TypeScript",
    skill_background: "var(--paper)",
    skill_text: "var(--ink)",
  },
  {
    skill_id: "zero-to-one",
    skill_label: "0→1 ownership",
    skill_background: "var(--sun-100)",
    skill_text: "#8a5e00",
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
    skill_ids: ["customer-discovery", "product-execution", "zero-to-one"],
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
    skill_ids: ["zero-to-one", "production-deployment", "product-execution", "stakeholder-alignment"],
  },
  {
    step_kind: "connector",
    connector_text:
      "I sold the business because I saw the rise of AI — and I wanted to make a meaningful contribution to it. Inside ecommerce the signal was unmissable: everything was getting easier except product imagery. Image generation was the bottleneck, and Stable Diffusion had just landed.",
  },
  {
    step_kind: "venture",
    journey_period: "2022 — 2025",
    journey_title: "QuicSnap → Shutter Labs — one problem, solved twice",
    journey_summary:
      "Photorealistic product imagery that keeps the fine print exact. First as **QuicSnap**, an AI-plus-humans service — 3D-model the product, generate the scene around it — sold through an outbound machine to clients across the US, EU, and Middle East. Then Flux.1 shipped, the fine-print moat got an expiry date, and the service became **Shutter Labs**: a self-serve platform (2D→3D capture plus per-product LoRAs), technical cofounders, a Fortune 500 retailer POC — until Nano Banana Pro absorbed the differentiator and we made the trajectory call to stop. The full story, numbers and all, is the flagship case study.",
    journey_stat: "~$85K",
    journey_stat_label: "bootstrapped revenue",
    href: "/work/quicsnap-shutter-labs",
    journey_tint: "orange",
    skill_ids: [
      "product-strategy",
      "customer-discovery",
      "zero-to-one",
      "production-deployment",
      "stakeholder-alignment",
    ],
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
    skill_ids: ["product-strategy", "full-stack-development", "prompt-engineering", "zero-to-one"],
  },
  {
    tile_title: "Orbit",
    tile_summary:
      "Personal feed ranker over 800+ sources I actually follow; everything new, ranked into one 7am digest.",
    tile_logo_id: "orbit",
    href: "/projects/orbit",
    skill_ids: ["rag-retrieval", "llm-evals", "python-typescript"],
  },
  {
    tile_title: "blip",
    tile_summary: "News as vertical reels — caption pipeline tuned from 58% to 92% usable output, measured not vibed.",
    tile_logo_id: "blip",
    href: "/projects/blip",
    skill_ids: ["llm-evals", "prompt-engineering", "rag-retrieval"],
  },
  {
    tile_title: "JobFairy",
    tile_summary:
      "Job-search copilot over 31,926 sponsor companies — with a browser-agent bake-off and real cost data.",
    tile_logo_id: "jobfairy",
    href: "/projects/jobfairy",
    skill_ids: ["agent-architecture", "llm-evals", "product-execution", "full-stack-development"],
  },
  {
    tile_title: "Astrape",
    tile_summary: "A utility-bill model validated to within $0.17 of the real bill.",
    tile_logo_id: "astrape",
    href: "/projects/astrape",
    skill_ids: ["rapid-prototyping", "customer-discovery"],
  },
];
