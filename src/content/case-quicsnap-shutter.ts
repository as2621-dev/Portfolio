import type { LongformArticle } from "./longform-types";

/**
 * Flagship case study — QuicSnap → Shutter Labs.
 * v9 (2026-08-09, owner-directed): headline pattern sitewide — project name
 * leads the title, descriptor follows; name prefix dropped from the dek.
 * v8 (2026-08-05, owner-directed): Act 3 collapsed to a single paragraph —
 * Nano Banana Pro named as the release that ended it (overrides v4's
 * no-model-names rule at owner request); investor-memo pull quote and the
 * two long "category got absorbed" paragraphs cut. Lost momentum → died →
 * straight into Act 4 learnings.
 * v7 (2026-08-05, owner-directed): Fortune 500 section reframed — inbound
 * approach off the strength of the work, paid POC, finalist, then project
 * shelved with no decision; deal-shaping tactics (their-numbers pricing,
 * volume ladder, de-risked entry, ownership conceded, responsibility split)
 * recast as the plays used to keep the shelved account alive. Honest ending:
 * it never closed.
 * v6 (2026-08-05, owner-directed): self-serve app shots (Create + Edit) cut;
 * technical pipeline slide (deck-pipeline-jack-daniels) inserted after the
 * two-pillar list — shows 3D placement of the product in a scene → generation.
 * v5 (2026-08-05, owner-directed): revenue chart truncated to May 2023 –
 * Apr 2024 (table toggle removed in the component); GTM outbound diagram
 * restored under #gtm; explicit pivot-to-Shutter-Labs bridge added after the
 * chart so Act 1 hands off to Act 2 by name.
 * v4 (2026-08-04, owner-directed rewrite): tighter, ~5–6 min read, reframed so
 * the smart move (reading the model curve and pivoting early) leads, not the
 * losing bet. Timeline compressed to the business's operating life, May 2023 –
 * Nov 2024: services with real revenue → shut down → platform pivot. The
 * models-caught-up ending stays as the closing lesson but drops specific model
 * names/dates so it reads human, not over-researched. Editorial chips and all
 * "verified / as pitched" caption language removed. App visuals are the
 * self-serve web app only (Create + Edit); the enterprise-portal shots and the
 * output galleries are cut. Assets in /public/proof/quicsnap-shutter/.
 *
 * Numbers policy: revenue is stated only as ~$85K total — never break out the
 * self-serve figure in copy. Firm rule: the enterprise POC retailer is never
 * named — "a Fortune 500 retailer".
 *
 * Anchor contract (linked from site.ts competency rows): #act-1, #act-2, #gtm,
 * #fortune-500, #act-3, #act-4 must keep their current meanings.
 */
export const quicsnapShutterArticle: LongformArticle = {
  article_eyebrow: "Case study",
  article_title: "QuicSnap → Shutter Labs — AI product photography, racing the model curve",
  article_subtitle:
    "I built an AI product-photography business to real revenue, then pivoted to a platform ahead of the frontier models — and learned exactly how fast the curve moves.",
  article_tags: ["Founder", "0→1 twice", "GTM & pricing", "Pivot decision"],
  article_meta: [
    {
      meta_label: "Role",
      meta_value:
        "Co-founder. I owned strategy, pricing, GTM, fundraising, and the product decisions. My cofounders owned the research and engineering.",
    },
    { meta_label: "Timeline", meta_value: "May 2023 – Nov 2024" },
    {
      meta_label: "Status",
      meta_value: "Wound down — the frontier models shipped the capability we sold.",
    },
    {
      meta_label: "Team",
      meta_value:
        "Built it twice — production artists and art directors for the service, then two technical cofounders and a small GTM team for the platform.",
    },
    {
      meta_label: "Numbers",
      meta_value: "~$85K revenue",
    },
    {
      meta_label: "Tech",
      meta_value: "Fine-tuned diffusion models · LoRAs · depth maps · NeRFs · the 3D-to-diffusion stack.",
    },
  ],
  blocks: [
    {
      block_kind: "paragraph",
      is_lede: true,
      paragraph_text:
        "For about eighteen months I chased one stubborn problem in ecommerce: photorealistic product imagery that keeps the exact fine print on the product — the label text, the logo, the regulatory small print. I solved it first with people, then with software. The service made real money, roughly $85K bootstrapped. The part I'm actually proud of, though, is the call I made next: I could see the frontier image models coming for the exact thing we charged for, so I pivoted the company to get ahead of them — before that capability turned into an API call.",
    },

    /* ── Act 1 ── */
    {
      block_kind: "act_divider",
      act_eyebrow: "Act 1 · 2023–2024",
      act_title: "Build the team, sell the pixels",
      anchor_id: "act-1",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "The idea" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "I came to this as a customer. Running my own ecommerce brands, I sat through 80+ product photoshoots — book a studio, ship the product, wait weeks, get images that miss the brief, then grind through revisions. QuicSnap was the productized fix: **send images of your product, and a team I built from scratch — production artists, art directors, an offshore 3D pipeline — delivers photorealistic listing imagery without a studio.** Fixed prices, an art director on every order, unlimited revisions.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Why humans were load-bearing" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "We were an AI company from day one, so why the people? Because most of our clients were FMCG and personal-care brands, and for them **the label *is* the product** — ingredient lists, dosage text, regulatory fine print. That was exactly what image models mangled, and an image with garbled label text isn't 90% right, it's unusable. So we split the job:",
    },
    {
      block_kind: "numbered_list",
      list_items: [
        "**Model the product in 3D by hand** (Blender) — geometry, label art, materials, exactly right.",
        "**Generate everything around it with AI** — scenes, lighting, indoor and outdoor sets, models in the frame.",
      ],
    },
    {
      block_kind: "image",
      image_src: "/proof/quicsnap-shutter/deck-showcase-jack-daniels.png",
      image_alt:
        "Generated lifestyle shot from the customer deck: a Jack Daniel's bottle on a wooden desk in a warm study set with a whiskey glass, cigar, books, and dice — every line of the label fine print crisp and legible.",
      image_caption:
        "The split in one frame, from the deck we showed customers: the product stays exactly right while the set, lighting, and props around it are generated. Zoom into the label — every line survives, down to the proof line.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The hallucination-prone part was handled deterministically; the expensive part of a real photoshoot — the set, the props, the talent — was handled generatively. That split *was* the company.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "How we found customers", anchor_id: "gtm" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Demand didn't walk in the door; I built the outbound engine. Vetted prospects from Apollo, a research step so every first email opened with something specific and true about that brand instead of a mail-merge token, and tooling to keep deliverability high across warmed domains. It's still the cleanest go-to-market system I've built.",
    },
    {
      block_kind: "chart",
      chart_id: "gtm-outbound",
      chart_caption:
        "Apollo for prospecting, a Perplexity research step for personalization, Instantly + Waalaxy for sequencing — all running on 50+ sending domains, three inboxes each, warmed and rotated through Instantly to keep the deliverability score high, tracked daily as the guardrail metric.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "What the money looked like" },
    {
      block_kind: "chart",
      chart_id: "quicsnap-monthly-revenue",
      chart_caption:
        "Most months looked the same. Real demand, strong repeat business — but flat, because revenue tracked artist-hours one-for-one. A service can prove a problem is real; it can't compound on its own.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The chart stops in April 2024 because that's where this chapter stops. Rather than grind out more flat months, I stopped selling artist-hours and pivoted the company to **Shutter Labs** — the same fidelity promise, rebuilt as a platform the customer drives. The rest of this story is that bet.",
    },

    /* ── Act 2 ── */
    {
      block_kind: "act_divider",
      act_eyebrow: "Act 2 · 2024",
      act_title: "The bet I updated in public",
      anchor_id: "act-2",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Then the image models started getting dramatically better, fast — each release rendered text noticeably cleaner than the one before. That didn't disprove our founding assumption — *models mangle fine print, so our humans-plus-3D pipeline exists.* It did something worse: it put an expiry date on it. If what you sell is a workaround for a model limitation, model progress is a countdown clock.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "So I made the call: stop selling the workaround, start selling the workflow. The service was still making money when I shut it down and pivoted from a model where *we* do everything to a platform where **the customer does it themselves** — and I wanted to be there before the capability became a commodity. Two months earlier I had written “AI alone isn't possible with today's tech” in our own executive summary. Changing your mind in public, with your team's paychecks riding on the old position, is harder than any deck makes it look.",
    },
    {
      block_kind: "image",
      image_src: "/proof/quicsnap-shutter/deck-team.png",
      image_alt:
        "Team slide: Ash (CEO), Astitva (CTO, PhD in 3D Vision & Graphics, Google PhD Fellowship, ex-Meta/Google/Stability AI), Pranav (Head of Engineering, 3D deep-learning researcher).",
      image_caption:
        "The pivot started with people. I brought on two technical cofounders — a 3D-vision PhD as CTO and a 3D deep-learning researcher leading engineering — the horsepower a platform needs that a services team doesn't.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "What we built" },
    {
      block_kind: "paragraph",
      paragraph_text: "Two pillars, both aimed at the fidelity problem we used to solve by hand:",
    },
    {
      block_kind: "numbered_list",
      list_items: [
        "**2D→3D product capture.** Upload a few photos and reconstruct a 3D asset — Gaussian splatting, monocular depth estimation, NeRFs, Open3D for geometry. What our Blender artists did by hand, automated at intake — and the user gets full 3D control: rotate the product, place it, set the camera.",
        "**Product-specific LoRAs.** A fine-tune per handful of SKUs whose only job was to lock the fine print — label text, logos, materials — while the base model generated everything else.",
      ],
    },
    {
      block_kind: "image",
      image_src: "/proof/quicsnap-shutter/deck-pipeline-jack-daniels.png",
      image_alt:
        "Pipeline slide: input photos of a whiskey bottle train a small per-product neural net while its features are extracted; the bottle's 3D model is posed on a wireframe grid for precise orientation and position control; final photorealistic outputs show the bottle in a snowy evening scene.",
      image_caption:
        "How a shot actually gets made: a few product photos train the per-product fine-tune and feed feature extraction, the product's 3D model is posed in the scene — orientation, position, camera — and the model renders the final image around it, fine print intact.",
    },
    {
      block_kind: "image",
      image_src: "/proof/quicsnap-shutter/deck-label-fidelity.png",
      image_alt:
        "Comparison of generated whiskey-bottle scenes with the label zoomed in: our output shows legible label text; the popular alternatives show garbled, illegible label text.",
      image_caption:
        "The whole thesis in one frame: same bottle, our pipeline versus the popular alternatives — zoom into the label. The fine print survives only on the left.",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "Selling to a Fortune 500 with no leverage",
      anchor_id: "fortune-500",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The strongest validation of the work arrived inbound: a Fortune 500 retailer, impressed by what we were shipping, approached *us* and engaged us for a paid POC. An account that size was far above our weight class. We delivered the POC anyway, presented the results, and finished as one of the finalists in their evaluation.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Then they shelved the project — no rejection, no green light, just a pause that never ended. I refused to let it die quietly and tried every play I knew to restart it. We priced *their* build-in-house option against our managed service, using their own numbers. When procurement pushed back, I restructured the deal instead of cutting the price: a volume ladder, a de-risked entry, image ownership conceded, responsibilities split line by line. An earlier deal had taught me that the hard way, after I'd chained discounts down to near-zero margin just to land a logo — this time I changed the deal's shape, not just its number. It still didn't close. Some deals die of no decision, and this one did — but I'd rather lose an account being flexible on structure than desperate on price.",
    },

    /* ── Act 3 ── */
    {
      block_kind: "act_divider",
      act_eyebrow: "Act 3",
      act_title: "The models caught up",
      anchor_id: "act-3",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "While we were still building, **Nano Banana Pro** launched — and it could simply generate and render all the text: ingredient lists, logos, label typography, directly out of the model, no 3D reconstruction, no per-product fine-tune. The exact capability we'd built the company to guarantee was now a default setting. That was it. We lost momentum, and the company died.",
    },

    /* ── Act 4 ── */
    {
      block_kind: "act_divider",
      act_eyebrow: "Act 4",
      act_title: "What I actually learned",
      anchor_id: "act-4",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "1. AI moves in bulk — be ready to catch the jumps.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The capability curve isn't smooth. It moves in bulk: a big leap, then a plateau where little changes, then another leap. The edge doesn't go to whoever predicts the exact date — it goes to whoever is set up to ship the moment the curve lurches. Build so that a sudden jump is a tailwind you can catch, not a wave that lands on you.",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "2. Build on the overhang — and own something the next model can't.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "There's an enormous overhang in these models — things they can *almost* do, rough edges nobody has smoothed yet. That's where the opportunity is: find the rough edges and build on top of them. But a capability edge alone is rented. To keep it, you have to accumulate something the next release can't hand out for free — memory and data of your own customers, aggregated over time. Without that, the next model eats your moat. So work on genuinely hard problems: if you win, you win big; if you lose, you learn big. I lost this one, and I learned a lot — image generation, denoising, LoRAs, depth maps, NeRFs, the whole 3D-to-diffusion stack. That knowledge keeps compounding even though the company didn't.",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "3. Losing to the curve doesn't mean the read was wrong.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The pivot thesis — customers will self-serve once fidelity is solved — was right. It's exactly what they do now; they just don't need us to do it. Everything I've built since [Canvas](/work/canvas) sits *on top* of frontier models instead of against them — and the model class that ended Shutter Labs is now a line item in its pricing table. Same read of the curve, opposite side of the trade.",
    },
  ],
  article_footer_links: [
    { cta_label: "What I built after — Canvas →", href: "/work/canvas", cta_variant: "primary" },
    { cta_label: "All projects", href: "/projects", cta_variant: "outline" },
    { cta_label: "Email me", href: "mailto:ashesh.srivastava1234@gmail.com", cta_variant: "outline" },
  ],
};
