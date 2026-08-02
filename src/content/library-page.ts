/**
 * Library page content — real, self-authored PM artifacts with wrappers.
 * Source of truth: ~/"Portfolio "/copy/09-library.md.
 * Research rule: never a bare file list — every document gets context, the
 * decision it drove, and how it aged. The planned teardown ships only when it
 * has a non-obvious argument (deliberately not rendered here).
 */

export interface LibraryArtifactLink {
  link_label: string;
  /** Real destination when it exists. */
  href?: string;
  /** True while the export/PDF is still pending — renders a SLOT chip. */
  is_pending_slot?: boolean;
  pending_note?: string;
}

export interface LibraryArtifact {
  artifact_title: string;
  /** Context wrapper — why it exists, what it decided, how it aged. */
  artifact_wrapper: string;
  /** Mono meta line, e.g. "714 lines · 8 user stories". */
  artifact_meta_line: string;
  artifact_links: LibraryArtifactLink[];
}

export const libraryIntro =
  "Real documents from real products — PRDs, briefs, and strategy work I wrote and then had to live with. No templates, no samples written for a portfolio. Each one comes with the context: why it exists, what it decided, and how the decision aged.";

export const libraryArtifacts: LibraryArtifact[] = [
  {
    artifact_title: "The PRD that became Canvas",
    artifact_wrapper:
      "After Shutter Labs, I spec'd the product I wished existed for studio-grade image work: Pigment. 714 lines — eight user stories with worked examples, a risk register, and an API spec. It drove the decision to build what shipped as Canvas, including the workspace model and the instant-vs-batch pricing split. Reading it against the shipped product is a live diff of plan vs reality — some of it held, some of it didn't, and the case study says which.",
    artifact_meta_line: "714 lines · 8 user stories · risk register · API spec",
    artifact_links: [
      {
        link_label: "Read the PRD",
        is_pending_slot: true,
        pending_note: "embedded viewer/PDF — needs export + PII scrub",
      },
      { link_label: "The Canvas case study →", href: "/work/canvas" },
    ],
  },
  {
    artifact_title: "59 decisions, six reversals, in writing",
    artifact_wrapper:
      "A 1,528-line PRD whose spine is a numbered decision log: 59 decisions, each with the alternatives considered, six of them later reversed — with the reversal documented, not buried. I write PRDs this way because the decisions, not the feature list, are what the next person needs. This one drove a real build and a real experiment (the browser-agent bake-off on the project page).",
    artifact_meta_line: "1,528 lines · 59 numbered decisions · 88+ user stories",
    artifact_links: [
      {
        link_label: "Read the PRD",
        is_pending_slot: true,
        pending_note: "embedded viewer/PDF — needs export + PII scrub",
      },
      { link_label: "The JobFairy page →", href: "/projects/jobfairy" },
    ],
  },
  {
    artifact_title: "“Rules out:” — a PRD convention I now use everywhere",
    artifact_wrapper:
      "Orbit's PRD holds 20 user stories and module contracts, but the part I'd defend in any interview is the convention: every scoping decision states what it *rules out*, so future-me can't quietly un-decide it. It's the cheapest prioritization tool I know — a decision isn't real until it forecloses something.",
    artifact_meta_line: "20 user stories · module contracts · explicit exclusions",
    artifact_links: [
      { link_label: "Read the PRD", is_pending_slot: true, pending_note: "embedded viewer/PDF — needs export" },
      { link_label: "The Orbit page →", href: "/projects/orbit" },
    ],
  },
  {
    artifact_title: "Four rules, not fifteen",
    artifact_wrapper:
      "A 278-line product brief for a seller-ops copilot, written before any code. The signature call: ship 4 monitoring rules instead of 15 — not to save effort (the engine costs the same either way) but to keep day-one alert volume in the readable band while the real trip rate gets measured — backed by a sensitivity table running 1% (“read properly”) to 10% (“abandoned in week one”). De-risking rule: before building UI, backtest the rules against 30 days of real data. [CONFIRM: was the 30-day backtest run? The trip rate would be the best number on this page]",
    artifact_meta_line: "278 lines · trip-rate sensitivity table · backtest-before-UI",
    artifact_links: [
      { link_label: "Read the brief", is_pending_slot: true, pending_note: "embedded viewer/PDF — needs export" },
    ],
  },
  {
    artifact_title: "The strategy deck, with its scars",
    artifact_wrapper:
      "The deck that carried Shutter Labs through eight generations and three deliberate narrowings — three agents to one pipeline, all-of-ecommerce to furniture, SaaS to enterprise managed service. The portfolio version is annotated: where the strategy shifted and why, deck to deck. Strategy isn't the slide; it's the diff.",
    artifact_meta_line: "8 generations · 3 documented strategy shifts · enterprise unit-economics model",
    artifact_links: [
      {
        link_label: "View the deck",
        is_pending_slot: true,
        pending_note: "BLOCKED — needs the number-reconciliation pass and a chosen canonical generation",
      },
      { link_label: "The flagship story →", href: "/work/quicsnap-shutter-labs" },
    ],
  },
  {
    artifact_title: "An eval with a budget",
    artifact_wrapper:
      "The head-to-head experiment behind JobFairy's provider decision: two browser-agent stacks, same task, measured on cost, latency, and success — $1.14/task/failed vs $0.02/task/succeeded. Included here as a methodology sample: hypothesis, method, results, decision, and the discipline to not oversell the headline multiplier.",
    artifact_meta_line: "2 providers · cost/latency/success measured · decision documented",
    artifact_links: [
      {
        link_label: "Read the write-up",
        is_pending_slot: true,
        pending_note: "needs reformatting from docs/verification/",
      },
      { link_label: "The bake-off, on the JobFairy page →", href: "/projects/jobfairy#bakeoff" },
    ],
  },
];
