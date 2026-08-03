import type { LongformArticle } from "./longform-types";

/**
 * Founder-era page #2 — the US marketplace automation / dropshipping business.
 * Source of truth: ~/"Portfolio "/research/walmart-dropship-deep-dive.md
 * (every figure below is computed or file-evidenced there unless chipped).
 * Firm rules honored: service brand only (QEG Automation), never
 * corporate structure; $593K is always labeled GMV, never revenue; no fee
 * income is invented; employee and client names stay out.
 *
 * Visuals: /proof/qeg-system-map.png and /proof/qeg-operations-console.png are
 * full-page captures of mockups/qeg-system-map.html and mockups/qeg-dashboard.html
 * (console captured with the helper bar hidden). Re-capture if the mockups change.
 */
export const marketplaceAutomationArticle: LongformArticle = {
  article_eyebrow: "Founder era",
  article_title: "The machine that ran 77 storefronts",
  article_subtitle:
    "QEG Automation — a managed-service business running US Walmart marketplace stores for client owners, fulfilled from Amazon, on a custom platform I had built and a ~35-person ops team hired in eight weeks.",
  article_tags: ["Ecommerce", "Ops at scale", "Automation"],
  article_meta: [
    { meta_label: "Role", meta_value: "Founder — platform, team, operations, client economics." },
    {
      meta_label: "Timeline",
      meta_value:
        "2022 — 2023 [FOUNDER — founder-supplied years; file artifacts (production DB, client invoices) date Aug 2021 – Feb 2022. Reconcile before publish.]",
    },
    { meta_label: "Scale", meta_value: "77 client stores · 204,559 live listings · ~35-person ops team." },
    {
      meta_label: "Ending",
      meta_value: "Sold [FOUNDER — the sale is founder-recalled; the files record the wind-down].",
    },
  ],
  article_stats: [
    { stat_value: "$593K", stat_label: "peak monthly GMV (Aug 2021) — GMV, not revenue" },
    { stat_value: "17,583", stat_label: "orders processed in that month" },
    { stat_value: "204,559", stat_label: "live listings under management" },
  ],
  blocks: [
    {
      block_kind: "paragraph",
      is_lede: true,
      paragraph_text:
        "The business model was dropshipping. We created stores on Walmart.com and listed products priced 30–40% higher than the same items on Amazon.com. Whenever a confirmed order came in on Walmart, we placed that order on Amazon and had it shipped directly to the customer — the spread between the two prices was the margin. A typical dropshipping model; our innovation was the software we built to run it.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "The platform" },
    {
      block_kind: "image",
      image_src: "/proof/qeg-system-map.png",
      image_alt:
        "System map of the custom PHP automation platform: eight pipeline stages — catalog ingestion, ASIN to UPC resolution through two vendors in series, product enrichment via Amazon MWS, listing feed builder, competitive repricer, inventory sync, order pull, and tracking injection — flowing between Amazon's supply side and Walmart's marketplace APIs, backed by a 200k-row MySQL listing table and a 481,310-pair ASIN-UPC dataset.",
      image_caption:
        "The full pipeline, catalog to cash — eight stages between Amazon and Walmart, fourteen cron jobs, four firing every single minute.",
    },
    {
      block_kind: "callout",
      callout_tint: "blue",
      callout_title: "The numbers, labeled honestly",
      callout_text:
        "Peak observable month: August 2021 — **$593,653 in Walmart GMV** on 17,583 orders, with a $48,637 peak day. Behind that volume was a team of 35 managing every one of those orders day to day, with supervisors tiered above them overseeing the operation.",
    },
    {
      block_kind: "image",
      image_src: "/proof/qeg-operations-console.png",
      image_alt:
        "Dark-themed QEG Automation operations console for August 2021: $593,653 month-to-date GMV, 17,583 orders, 204,559 live listings, 75 of 77 stores active, 98.4% tracking injected, a daily GMV chart with the $48,637 August 8 peak, top stores by 30-day GMV, the cron-job pipeline table, a 77-cell store fleet grid, and the latest orders with per-order spread.",
      image_caption:
        "The operations console, reconstructed — August 2021 at peak, every number from the production database.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "The learnings" },
    {
      block_kind: "numbered_list",
      list_items: [
        '**Complex systems are built in the long tail.** The core pipeline worked early; the long-tail edge cases took the longest by far — that last stretch is most of what "production-ready" actually means.',
        "**A business that relies 100% on one platform is susceptible to collapse.** Every listing, order, and dollar routed through Walmart's marketplace; when the channel turned, the whole machine stopped with it.",
        "**Build redundancy for every API you depend on.** External calls fail — the ASIN→UPC step ran two vendors in series because neither alone had coverage, and every critical dependency needs that kind of fallback.",
      ],
    },

    {
      block_kind: "cta_row",
      cta_links: [{ cta_label: "Next: QuicSnap → Shutter Labs →", href: "/work/quicsnap-shutter-labs" }],
    },
  ],
  article_footer_links: [
    { cta_label: "The first venture: two consumer brands", href: "/work/ecommerce-brands", cta_variant: "primary" },
    { cta_label: "Back home", href: "/", cta_variant: "outline" },
  ],
};
