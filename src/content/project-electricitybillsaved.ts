import type { LongformArticle } from "./longform-types";

/**
 * Project page — ElectricityBillSaved, the Texas bill-credit usage model.
 * Source of truth: ~/"Portfolio "/copy/08-project-electricitybillsaved.md.
 * Repo stays unlinked until the PII scrub (ESI ID, account/invoice numbers,
 * device MACs, Cognito IDs) is done.
 */
export const electricityBillSavedArticle: LongformArticle = {
  article_eyebrow: "Project · Agents & tools",
  article_title: "Modeling a $129 pricing cliff to within 17 cents",
  article_subtitle:
    "On my Texas electricity plan, 999 kWh costs $207 and 1,000 kWh costs $78 — a $125 credit sits on the far side of a one-kWh cliff. I built a tool that forecasts which side the cycle lands on, and checked its math against a real bill to seventeen cents.",
  article_tags: ["Modeling", "Energy", "n=1"],
  article_meta: [
    {
      meta_label: "Role",
      meta_value:
        "Designed, built, and shipped solo. [SLOT: GitHub link — repo private, blocked on a PII scrub before it can go public]",
    },
  ],
  article_stats: [
    { stat_value: "$0.17", stat_label: "model vs actual on a 1,066 kWh cycle — $91.82 computed, $91.65 billed" },
    { stat_value: "$129", stat_label: "the swing between 999 kWh and 1,000 kWh" },
    { stat_value: "$125", stat_label: "flat credit on the table, every cycle" },
  ],
  blocks: [
    { block_kind: "act_divider", act_eyebrow: "Act 1", act_title: "The product decision", anchor_id: "act-1" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**What I built.** A projection tool for one house. It pulls Smart Meter Texas’s 15-minute interval data from a daily email, pairs each day with free Open-Meteo weather, fits a cooling-degree-day regression, and answers one question: will this cycle clear 1,000 kWh?",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Who it’s for.** Me. N-of-1 — my meter, my plan, one cooling season in Houston. I sized the market anyway: ~11M Texas households → ~1.9M with a smart thermostat → ~1.33M on Smart Meter Texas → ~530K on a bill-credit plan → ~250–350K near enough to a threshold to matter. The ~530K is the weakest link, at low-medium confidence and ±15 points on meter counts I flagged unverified — directionally a real market, not a number I’d put in a deck. And Texas mandates the tiered rate display that makes these plans marketable; no other state does, so geography doesn’t expand it. [CONFIRM: market funnel treatment — publish with confidence grading visible, or cut]",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Why this problem.** Every “save energy” product optimizes the wrong direction. Near the cliff my marginal kWh costs about $5 and captures about $100, so the right advice at 970 kWh is *turn the AC down*. And a flat average can’t tell you which side you land on: my first five metered days ran 23.4 to 39.1 kWh, a 1.67× swing on weather.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The decisions I wrote down.** A 14-item log where each entry names what it rules out. Three that mattered:",
    },
    {
      block_kind: "bullet_list",
      list_items: [
        "**No LLM in the core loop.** It’s a regression and a threshold comparison. *Rules out: opaque “AI recommendation,” nondeterministic outputs, agent frameworks.*",
        "**No portal scraping**, filed under “settled — do not relitigate.” Rejected on terms of service, credential custody, 2FA, and fragility. *Replaced by:* compute the bill from usage, compare to the amount in the billing email.",
        "**Cut the EV module, and named the cost.** EV-heavy days inflate residuals and lower R², but the temperature coefficients stay unbiased. *Rules out: a vehicle module, charge-signature detection.*",
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "One I got wrong: “no web frontend in MVP.” Three weeks later I shipped a dashboard, because a second user appeared — someone in the house who needed the number without me. The LAN-only constraint behind that call didn’t apply to a read-only view. Reopening it was right; not writing the reversal down was sloppy.",
    },

    { block_kind: "act_divider", act_eyebrow: "Act 2", act_title: "How it’s built", anchor_id: "act-2" },
    {
      block_kind: "paragraph",
      paragraph_text: "**The model.** Ordinary least squares, hand-rolled in about 24 lines, no numpy:",
    },
    {
      block_kind: "code",
      code_text: "kWh/day ≈ baseload + β · CDD65      where CDD65 = max(0, daily mean °F − 65)",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "This much per day with the AC off, plus β per degree above 65. It fits only on days with both metered usage *and* observed weather; the rest of the cycle is forecast ahead, reanalysis behind.",
    },
    {
      block_kind: "callout",
      callout_tint: "orange",
      callout_text:
        "**The fit is weak and I won’t bury it: R² = 0.31, on five days of data.** Five points, an EV charging into the baseload, a fixed 65°F balance point I never tuned. I shipped anyway, with a pre-registered fallback for small-sample noise — right at day five, wrong to still be quoting at day sixty. The fixes aren’t exotic: refit on the ~60 days now on disk, add a heating-degree term, auto-tune the balance point, store every fit. [CONFIRM: refit R² — page states 0.31 only until the refit runs]",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**How I validated it — against money, not against itself.** The bill module recomputes the bill from metered usage plus the plan’s published terms, then reconciles that against the amount in the billing email inside a $1 tolerance. A completeness gate returns “incomplete” on a usage gap, so a missing day can’t manufacture a false pass. On the 2026-05-13 bill — 1,066 kWh, billed $91.65 — the model computed $91.82.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**The dashboard.** Dark, mobile-first, one screen, no scrolling: cumulative kWh in solid green, projection dotted, a dashed red line at 1,000.",
    },
    {
      block_kind: "media_slot",
      slot_description: "dashboard — needs an Apps Script redeploy, then desktop and mobile capture",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "What I learned" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**A stopping rule without instrumentation is just stopping.** I decided not to automate the thermostat until the projection had been accurate for a few cycles, then never built the thing that would tell me when that bar was cleared. Both halves worked — validated projection, verified thermostat read *and* write — and stayed disconnected.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**I built for the wrong objective for about a week.** The brief said “help me use less.” The research said the money is in using *enough*. Reframing was the highest-leverage thing I did here.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "Honest status: the outcome is unrecorded" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Everything here is a projection. The model said June would land at 1,440 kWh. I never recorded where it actually landed, or whether the $125 credit was banked — last commit is 2026-06-14, the cycle closed in early July, and I didn’t go back.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "A model without its outcome recorded is an unfinished experiment — the projection could have been off by 400 kWh and I wouldn’t know. Resolving it is cheap: pull the June statement, reconcile it, write down the number either way. [CONFIRM: June 2026 bill outcome]",
    },
  ],
  article_footer_links: [
    { cta_label: "All projects →", href: "/projects", cta_variant: "primary" },
    { cta_label: "The flagship story", href: "/work/quicsnap-shutter-labs", cta_variant: "outline" },
    { cta_label: "Email me", href: "mailto:ashesh.srivastava1234@gmail.com", cta_variant: "outline" },
  ],
};
