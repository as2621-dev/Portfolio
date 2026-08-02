import type { LongformArticle } from "./longform-types";

/**
 * Flagship case study — QuicSnap → Shutter Labs.
 * Source of truth: ~/"Portfolio "/copy/02-case-study-quicsnap-shutter.md (v2.1).
 * Numbers policy: $61,187 self-serve is the only file-verified revenue figure
 * and is always labeled as such; ~$85K total is founder-confirmed. Firm rule:
 * the enterprise POC retailer is never named — "a Fortune 500 retailer".
 */
export const quicsnapShutterArticle: LongformArticle = {
  article_eyebrow: "Case study · Flagship",
  article_title: "Betting against the models — and losing well",
  article_subtitle:
    "QuicSnap → Shutter Labs, 2022–2025. A services-to-platform pivot, a frontier-model extinction event, and what I'd do differently.",
  article_tags: ["AI imaging", "Pivot", "Post-mortem"],
  article_meta: [
    {
      meta_label: "My role",
      meta_value:
        "Founder → CEO. I owned strategy, pricing, GTM, fundraising, and the product decisions. My cofounders owned the research and engineering (more below).",
    },
    { meta_label: "Timeline", meta_value: "Oct 2022 – Nov 2025" },
    {
      meta_label: "Team",
      meta_value:
        "Built from zero — production artists, art directors, an offshore 3D vendor, later two technical cofounders and a GTM team [CONFIRM: headcount summary]",
    },
    {
      meta_label: "Numbers",
      meta_value:
        "~$85K total revenue — $61,187 of it through the self-serve channel, verifiable to the transaction · 41% of customers reordered · 25 sec / $0.16 per generated image vs ~$180 and weeks for a photoshoot",
    },
    {
      meta_label: "The arc",
      meta_value:
        "Revenue with people and designers → pivot to a platform → a frontier-model release destroys the differentiator → what I learned.",
    },
  ],
  blocks: [
    {
      block_kind: "paragraph",
      is_lede: true,
      paragraph_text:
        "I spent three years solving one problem — photorealistic product imagery that preserves the exact fine print on the product — first with people, then with a platform. The service made real revenue: roughly $85K all-in, $61,187 of it through the self-serve channel alone, verifiable transaction by transaction. The platform bet was that base models would eventually solve fine-print fidelity, so we should own the workflow before that happened. We were right about the direction and wrong about the speed: on November 20, 2025, Google’s Nano Banana Pro shipped text preservation as a default capability, and the differentiator we’d built a company around became an API call. This is the story of both bets — the one that paid, and the one that got outrun.",
    },

    /* ── Act 1 ── */
    {
      block_kind: "act_divider",
      act_eyebrow: "Act 1 · 2022–2024",
      act_title: "Selling pixels made by people",
      anchor_id: "act-1",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "The problem I couldn’t stop having" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "I came to this problem as a customer before I was a founder. Running my own ecommerce businesses, I sat through more than 80 product photoshoots. The pattern never changed: book a studio, ship the product, wait weeks, get images back that didn’t match the brief, enter revision purgatory. For a product listing that might live three months before the next seasonal refresh.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "QuicSnap was the productized fix: send us your product — physically ship it to us — and our team produces photorealistic listing imagery without a studio. Fixed prices per image type, an art director per order, unlimited revisions.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Why humans were load-bearing: the fine-print problem" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The obvious question even in 2023 was: why not just use AI? We were an AI company from day one — the answer is more specific than “AI wasn’t good enough.”",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Our clients were overwhelmingly FMCG and personal-care brands — perfumes, cosmetics, supplements, beverages. (The production folders read like a beauty-aisle shelf.) These are products where **the label is the product**. Ingredient lists, dosage text, regulatory fine print, embossed logos. And fine text was precisely what image models hallucinated. A generated image with mangled label text isn’t 90% right — it’s 100% unusable, and in some categories it’s a compliance problem.",
    },
    { block_kind: "paragraph", paragraph_text: "So we built the pipeline around that constraint:" },
    {
      block_kind: "numbered_list",
      list_items: [
        "**Model the product in 3D** (Blender) — geometry, label art, materials, exactly right, because a human put them there.",
        "**Generate everything around it with AI** — scenes, backgrounds, lighting contexts, indoor and outdoor environments, humans in the frame.",
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The hallucination-prone part of the image (the product) was handled deterministically; the expensive part of traditional photography (the set, the location, the props, the models) was handled generatively. That split *was* the company.",
    },
    {
      block_kind: "pull_quote",
      quote_text:
        "Generating product ready images just by using AI alone is not possible with current tech, so we plan train and perfect our workflow using manual intervention.",
      quote_attribution:
        "our June 2024 Executive Summary, verbatim — dated evidence of the founding assumption [SLOT: image of the actual document]",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "The go-to-market machine", anchor_id: "gtm" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Demand didn’t walk in the door; we built an outbound engine that I’m still proud of as a system [FOUNDER — first-person recollection; Apollo & Waalaxy corroborated by the May 2025 task board]:",
    },
    {
      block_kind: "bullet_list",
      list_items: [
        "**Apollo** for prospecting — pulling verified emails for ecommerce brand operators.",
        "**Perplexity** in the personalization loop — researching each brand so that every email opened with something true and specific about *their* products, not a mail-merge token.",
        "**Instantly.ai and Waalaxy** for sequencing and delivery.",
        "**50+ sending domains, three inboxes per domain** [FOUNDER], warmed and rotated, with deliverability tracked as a first-class metric. Cold email dies in the spam folder; we treated inbox placement as an engineering problem — and deliverability was our guardrail metric long before anyone asked us for one.",
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Alongside it: a scripted personalized-video motion (screen-recording a prospect’s own listings next to competitors’), localized invoicing in German and French for EU clients, and an Instagram presence. The machine worked — it filled a production pipeline that served clients across the US, EU, and Middle East.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "The team behind the service" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "“Full-service” means people. I hired and ran the production side — 3D artists, art directors, client-facing staff — plus an offshore production vendor on monthly invoicing, and later a CMO recruited on an equity package because cash was tight and I said so openly [CONFIRM: how much of the team story to tell; offer-letter archive exists but letters ≠ headcount]. Managing creative throughput against an unlimited-revisions promise taught me more about operational leverage than any book: every difficult client converts a marketing promise into an uncapped cost.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "What the numbers said", anchor_id: "numbers" },
    { block_kind: "paragraph", paragraph_text: "This is where the story stops being a highlight reel." },
    {
      block_kind: "bullet_list",
      list_items: [
        "Self-serve revenue over 17 months: **$61,187** across 320 transactions and 153 customers — the number I can prove to the transaction. Enterprise/ACH contracts took the total to roughly **$85K**.",
        "**41% of customers reordered, and repeat customers were 70% of revenue.** The service genuinely solved the problem for the people who used it.",
        "Monthly revenue lived in a **flat $2.5K–$6.3K band the entire time**. No breakout month, ever.",
        "The unit economics had a structural ceiling: August 2023’s offshore production bill was **$5,600** against **$4,045** of self-serve revenue that month. Enterprise contracts (at roughly 10x self-serve per-product rates) carried the margin [CONFIRM: was the business profitable in any period? “Profitable from day one” appears in the exec summary but the files don’t support it — resolve or cut].",
        "Growth was purchased with labor: every new order consumed 3D-artist hours. Revenue scaled linearly with headcount, and the entry-level $19 SKU was *designed* to lose money as a loss-leader (our own pre-launch model computed it at negative margin — deliberately).",
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "On attribution, to be precise about what I owned: the self-serve revenue line, pricing, and the repeat-rate were mine — I set the catalog, the prices, and the service promises that drove them. Enterprise closes were relationship wins I led but landed with the production team’s output carrying the pitch.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Seventeen flat months is a demand signal and a margin trap at the same time. The clients loved it; the model couldn’t compound.",
    },
    {
      block_kind: "chart",
      chart_id: "quicsnap-monthly-revenue",
      chart_caption:
        "Monthly self-serve revenue from the verified transaction export (research corpus, Metrics §A). Sep 2024 is partial — the export ends Sep 12.",
    },

    /* ── Act 2 ── */
    {
      block_kind: "act_divider",
      act_eyebrow: "Act 2 · mid-2024 → mid-2025",
      act_title: "The bet flips",
      anchor_id: "act-2",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "Watching the moat melt" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "On August 1, 2024, Black Forest Labs shipped Flux.1. I remember the specific feeling of testing it: text rendering was still imperfect — but it was *dramatically* better than the generation before, which had been dramatically better than the one before that. [FOUNDER]",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The founding assumption of QuicSnap was “models hallucinate fine print, and that’s why our humans-plus-Blender pipeline exists.” Flux didn’t disprove that assumption. It did something worse: it put an expiry date on it. Extrapolate the curve and the conclusion was uncomfortable — **fine-print fidelity was going to be solved by the base models. The question was when, not whether.**",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "If the thing you charge for is a workaround for a model limitation, model progress is a countdown clock. We decided to stop selling the workaround and start selling the workflow: pivot from a service where *we* do everything to a platform where **the customer does everything themselves** — and get there before the capability became a commodity.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Two months earlier I had written “AI alone is not possible with current tech” in our own executive summary. Changing your mind in public, with your team’s paychecks attached to the old position, is harder than any pitch deck makes it look.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "The people I had to convince" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "A pivot is only a strategy after other people bet on it. The two people who mattered most were my technical cofounders: Astitva — a childhood friend, then finishing a PhD in 3D computer vision — and Pranav, a generative-deep-learning engineer. Neither reported to me; both had better-paying alternatives to joining a founder whose service business had just printed seventeen flat months. What I had was the evidence: the revenue export I’d pulled two weeks after the last recorded transaction, the reorder data proving demand, and the Flux trajectory argument. They joined in September 2024 on the strength of that case, and we formalized it in February 2025 — with engineering and research decisions theirs, not mine. [CONFIRM: framing — this is the influence-without-authority beat; adjust to how it actually felt]",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "What we built (Shutter Labs)" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The platform had two technical pillars, both aimed at the same fidelity problem we’d previously solved with people:",
    },
    {
      block_kind: "numbered_list",
      list_items: [
        "**2D→3D product capture.** Upload a couple of photos of your product; we reconstruct a 3D asset from them. What our Blender artists used to build by hand, automated at intake. The user gets full 3D control — rotate the product, position it anywhere in the scene, set the camera.",
        "**Product-specific LoRAs.** For each product (in production: a new fine-tune per ~20 SKUs), we trained a LoRA whose job was to lock the fine print — label text, logos, materials — while the base model generated everything else: backgrounds, environments, lighting, human models.",
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Traditional photoshoot: ~$180 per image, weeks of lead time. Our pipeline: ~25 seconds and $0.16 of compute per generation. The economics weren’t an improvement; they were a different category of thing.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "We ran the company like the countdown was real. In seven months we went from incorporation to: a live web app (create/edit flows, credit system), a managed-service portal for enterprise (batch upload → per-SKU review → annotate-and-revise), an API integration spec, a YC application, an investor memo, a financial model, five GTM hires — and three deliberate strategy narrowings, each visible in the deck diffs:",
    },
    {
      block_kind: "bullet_list",
      list_items: [
        "**Three AI agents collapsed into one pipeline.** The launch framing was an Art Director, a Stylist, and a Photographer agent. Within weeks the deck had retreated to the single capability that actually worked — feature-preserving generation with camera control. We cut the story to fit the product, not the product to fit the story.",
        "**All-of-ecommerce narrowed to furniture brands.** Furniture is where traditional photography hurts most: the products are bulky and expensive to ship to a studio, and staging a single shoot runs $5K–$20K a day before anyone presses a shutter. Our per-image economics were most violently better exactly there — and the 2025 tariff squeeze on furniture importers’ margins added urgency (our own marketing plan says it plainly: “with tariffs involved, furniture companies are most impacted”).",
        "**Self-serve SaaS subordinated to an enterprise managed service** when a Fortune 500 retailer engaged us for a paid POC.",
      ],
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
        "The enterprise motion is where I learned what influence without authority actually costs. You don’t win a Fortune 500 POC by asserting your roadmap; you win it by out-arguing the customer’s own alternatives with their numbers. Our POC deck priced *their* build-in-house option — $2M in startup cost and $87 per image at their design-team throughput — against our managed service at $29. When procurement pushed, we restructured rather than discounted blindly: a volume ladder, a de-risked $47K entry (setup + 1,000 images in one category), perpetual image ownership conceded, responsibilities split line-by-line — they owned brand guidelines and approvals, we owned model training and generation. Earlier, chasing a different enterprise anchor, I’d cut price 64% in a concession chain ($39 → $25.20 → $14) that bought a logo at near-zero margin. The Fortune 500 negotiation was me applying that lesson: restructure the deal’s shape, don’t just lower its number.",
    },
    {
      block_kind: "chart",
      chart_id: "company-timeline",
      chart_caption: "Model release dates verified against the public record, 2026-08-02.",
    },
    { block_kind: "heading", heading_level: 3, heading_text: "The risk we named and misjudged" },
    {
      block_kind: "paragraph",
      paragraph_text: "Our March 2025 investor memo has a Risks section. It says, verbatim:",
    },
    {
      block_kind: "pull_quote",
      quote_text:
        "Competition – While major players like OpenAI or Meta could release text-preserving image models, our fine-tuned diffusion models will deliver superior results for our niche.",
      quote_attribution: "our investor memo, March 2025",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Read that again. We identified the exact mechanism that would kill the company, in writing, in our own memo — and dismissed it with the standard startup incantation: *big labs optimize for broad markets; we’ll stay ahead in our niche.*",
    },
    { block_kind: "paragraph", paragraph_text: "We even got the lab wrong. It wasn’t OpenAI or Meta." },

    /* ── Act 3 ── */
    {
      block_kind: "act_divider",
      act_eyebrow: "Act 3 · late 2025",
      act_title: "Nano Banana Pro",
      anchor_id: "act-3",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "On August 26, 2025, Google shipped Nano Banana (Gemini 2.5 Flash Image) — image editing with character and product consistency good enough to go viral. We were mid-flight on the enterprise motion, iterating the Fortune 500 POC.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Then, on November 20, 2025, Nano Banana Pro arrived, and the countdown hit zero. Legible, accurate, *reliable* fine text — ingredient lists, logos, label typography — generated directly by a general-purpose model, no 3D reconstruction, no per-product LoRA, no pipeline. The capability we trained a fine-tune per 20 SKUs to deliver was now the default behavior of a model anyone could call for cents.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Our pitch had been “we preserve what the models get wrong.” The models stopped getting it wrong. There is no version of that pitch that survives.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "What made it stark was the asymmetry: it didn’t matter how well we’d executed — the differentiator was structural, and it evaporated for every company positioned on it simultaneously. We weren’t out-competed. The category was **absorbed**.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The ending wasn’t an announcement; it was a trajectory call — the same extrapolation that had triggered the pivot fourteen months earlier, except this time the curve had already arrived. I tested the release against our own demo set, saw the answer, and stopped. Not a fire sale, not a dramatic all-hands: the in-flight conversations — fundraising, enterprise deals — simply stopped mattering, and we let them wind down. When the premise dies, the respectable move is to say so out loud and stop spending other people’s money and time on it. [CONFIRM: final wording — written from your “basically, stopped” account; adjust the texture if it reads differently from how it felt]",
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
      heading_text: "1. “Never” is a forecast with an expiry date, not a fact.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Our founding assumption — models will always hallucinate fine print — was true for every model that existed when we wrote it, and it had a shelf life of roughly two years. When a business premise depends on a capability *not* arriving, write down the date you’d expect it to arrive if you’re wrong, and re-underwrite the company every time a major model ships.",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "2. Distinguish “hard for today’s models” from “structurally hard.”",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Fine-print fidelity had no data moat, no integration moat, no network effect protecting it. It was a pure capability gap — exactly the kind of gap that scaling laws and lab roadmaps close. The durable value was never the fidelity trick; it was workflow, distribution, and customer relationships. We knew that in the abstract and still let fidelity carry the pitch.",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text:
        "3. A services phase is a great demand instrument and a terrible growth engine — know which mode you’re in.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Seventeen flat months told us two things at once: the problem was real (41% reorder rate, 70% of revenue from repeat customers) and the model couldn’t compound (revenue tracked artist-hours linearly). The mistake isn’t running a service; it’s not pre-deciding the metric and the date on which you stop.",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text:
        "4. When your risk register names the thing that can kill you, don’t answer it with an incantation.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "“Big labs optimize for broad markets” was doing an enormous amount of unexamined work in our memo. The honest mitigations were: position on top of frontier models instead of against them, or hold an asset (proprietary data, distribution, workflow lock-in) that survives the capability becoming free. We had the second option available — we had enterprise workflow and relationships — and under-weighted it. [CONFIRM: agree with this framing? It’s the most self-critical line in the piece]",
    },
    {
      block_kind: "heading",
      heading_level: 3,
      heading_text: "5. Losing to the curve doesn’t mean the read was wrong.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The pivot thesis — customers will self-serve once fidelity is solved — was *correct*. That’s exactly what customers do now; they just don’t need us to do it.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "And the honest counterfactual: if we had never pivoted, the service would have died the same death a year later, with less learned and more spent — the pivot didn’t cause the ending, it compressed it. What the pivot *bought* was the platform skills, the enterprise playbook, and the model-curve scar tissue that everything I’ve built since runs on. Being early on the right trajectory and getting outrun by its speed is still a loss — but it’s a loss you can carry into the next product. Every image tool I’ve built since [Canvas](/work/canvas) is built *on* frontier models, not against them. The pricing table of my current image workspace includes Nano Banana Pro — at ₹11 a generation, the model that ended Shutter Labs is now a line item in my product.",
    },
  ],
  article_footer_links: [
    { cta_label: "What I built after — Canvas →", href: "/work/canvas", cta_variant: "primary" },
    { cta_label: "All projects", href: "/projects", cta_variant: "outline" },
    { cta_label: "Email me", href: "mailto:ashesh.srivastava1234@gmail.com", cta_variant: "outline" },
  ],
};
