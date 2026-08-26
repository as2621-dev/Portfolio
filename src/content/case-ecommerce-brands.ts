import type { LongformArticle } from "./longform-types";

/**
 * Founder-era page #1 — the consumer brands (A Baby Cherry® & Decor & More®).
 * Rewritten 2026-08-02 from Ash's dictated copy: origin story (FBA as the
 * scaling unlock), the review-mining playbook, the five learnings, and the
 * product-photography struggle that became the QuicSnap pivot. Proof asset:
 * store sales dashboard screenshot in /public/proof/.
 * Firm rules honored: products and brands only, never corporate structure.
 */
export const ecommerceBrandsArticle: LongformArticle = {
  article_eyebrow: "Founder era",
  article_title: "A Baby Cherry® & Decor & More® — two consumer brands built on Amazon",
  article_subtitle:
    "My first products came in a kraft box — sourced from factories in China, Vietnam, and India, trademarked, listed, priced, reviewed, and returned. The full physical-product loop.",
  article_tags: ["Founder", "P&L owner", "Brand building", "A/B testing"],
  article_meta: [
    { meta_label: "Role", meta_value: "Founder — sourcing, listings, pricing, growth, and the P&L." },
    { meta_label: "Timeline", meta_value: "2018 — 2023 (documented activity; latest confirmed sale Nov 2023)." },
    {
      meta_label: "Status",
      meta_value: "Wound down — the product-photography struggle became [QuicSnap](/work/quicsnap-shutter-labs).",
    },
    { meta_label: "Team", meta_value: "8 people." },
    {
      meta_label: "Tech",
      meta_value:
        "Amazon FBA · private-label sourcing · PPC campaign design · listing A/B testing · inventory planning.",
    },
  ],
  article_stats: [
    { stat_value: "2", stat_label: "brands built, both trademarked" },
    { stat_value: "72+", stat_label: "SKUs live at the peak" },
    { stat_value: "4.3★+", stat_label: "where most product ratings landed" },
  ],
  blocks: [
    {
      block_kind: "paragraph",
      is_lede: true,
      paragraph_text:
        "Before I ever touched an AI model, my products were silicone bibs and shower curtains. Two brands — **A Baby Cherry**® for baby essentials, **Decor & More**® for home decor — built as private labels and sold on Amazon. Everything a product needs to exist in the physical world, I did at least once: negotiated the factory, filed the trademark, wrote the listing copy, set the price, designed the packaging insert, and ate the returns.",
    },
    {
      block_kind: "image",
      image_src: "/proof/store-sales-dashboard.png",
      image_alt:
        "Seller dashboard showing $2.9M USD in sales over the last 12 months, up 28% on the previous period, with a monthly bar chart climbing from roughly $100k to over $300k.",
      image_caption:
        "The store dashboard — $2.9M in trailing-12-month sales, up 28% on the previous period (Aug 2023).",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "The starting point" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "This was where it all began. I had always been entrepreneurial, but FBA was the first model I saw that let a brand like mine scale rapidly — the warehousing, the logistics, and the customer trust already built, available to anyone willing to learn the craft. So I learned it. I studied the model, opened a seller account, and started selling.",
    },
    {
      block_kind: "paragraph",
      paragraph_text: "What followed was an insightful journey over a couple of years. Along the way I learned:",
    },
    {
      block_kind: "bullet_list",
      list_items: [
        "Product discovery — finding the products worth competing on",
        "Sourcing — and negotiating with the factories behind them",
        "Recognizing gaps the incumbents were leaving open",
        "How to differentiate from everyone else on the shelf",
        "Pricing strategies",
        "Managing my own inventory",
        "Designing and running ad campaigns",
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "The biggest realization: the long-term moat is how differentiated you are from everyone else — and differentiation comes from empathizing with your users better than the next seller does.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "The playbook" },
    {
      block_kind: "paragraph",
      paragraph_text: "Our strategy was really simple:",
    },
    {
      block_kind: "numbered_list",
      list_items: [
        "Pick a product in the niche.",
        "Read each and every customer review.",
        "Figure out what's missing.",
        "Talk to suppliers in China, India, and Vietnam — work out how to improve the product, get it made, and verify those pain points have actually been addressed.",
        "Once they have, launch it under our private label.",
      ],
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Then the cycle repeats: keep improving until the product holds at least 4.5 stars in reviews. In the end, most of our products sat at 4.3 stars or above — and at the peak, that loop had more than 72 SKUs live across the two brands.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "The two brands" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**A Baby Cherry** was the flagship: bibs, organic-cotton pillows, cloth books, playmats, bathtubs, swaddles — a full newborn-to-toddler line, trademark filed in 2019 and registered. It also had a mission baked into the brand: every purchase funded donated meals for a child in India through the Akshaya Patra Foundation, and that promise sat in the listing bullets, not in a CSR page nobody reads.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "**Decor & More**® was the range experiment: shower curtains, ceramic ware, side tables, solar garden lights, artificial flowers, lamps — a broad home-and-garden assortment used to learn which categories rewarded a new brand and which punished it.",
    },

    { block_kind: "heading", heading_level: 2, heading_text: "What the loop taught me" },
    {
      block_kind: "bullet_list",
      list_items: [
        "**The power of a brand.** A trademark is paper; the brand is the accumulated trust — the reviews, the ratings, the repeat buyers. Once A Baby Cherry meant something to parents, every new SKU launched warmer than a generic listing ever could.",
        "**Price is never the moat.** Anyone can undercut you tomorrow. The durable edge is a product that is genuinely differentiated — built from what the reviews say is missing — and the user empathy to keep it that way.",
        "**How the global supply chain works.** Molds, MOQs, freight, customs, and lead times, negotiated directly with factories in China, Vietnam, and India — and learning which conversations lower your unit cost and which just delay your launch.",
        "**Product pricing economics and PPC campaign design.** Marketplace fees, margins, and ad spend are one system: price a product without modeling the campaign that has to sell it, and the P&L will correct you.",
        "**A/B testing.** Titles, images, price points, coupons — everything on a listing is testable, and the listing that wins is the one that got tested.",
      ],
    },

    { block_kind: "heading", heading_level: 2, heading_text: "The struggle that became QuicSnap" },
    {
      block_kind: "paragraph",
      paragraph_text:
        "I wouldn't call it a mistake — but the thing I genuinely struggled with was product photography. To launch a product successfully on marketplaces this competitive, you need very high-quality photography and videography from day one; that's what makes a listing stand out from the get-go. And back in 2021–2022, getting that meant paying photographers and videographers a crazy amount — for every SKU, every variant, every season.",
    },
    {
      block_kind: "paragraph",
      paragraph_text:
        "Then Stable Diffusion launched, and it was an aha moment: all of this could be solved. AI could create images at scale, A/B test them to find the ones that convert, and give you great-quality infographics and images without spending tons of money. That lightbulb is why I pivoted to [QuicSnap](/work/quicsnap-shutter-labs) — and, eventually, why this whole portfolio exists.",
    },

    {
      block_kind: "cta_row",
      cta_links: [{ cta_label: "Next: marketplace automation →", href: "/work/marketplace-automation" }],
    },
  ],
  article_footer_links: [
    {
      cta_label: "The flagship story: QuicSnap → Shutter Labs",
      href: "/work/quicsnap-shutter-labs",
      cta_variant: "primary",
    },
    { cta_label: "Back home", href: "/", cta_variant: "outline" },
  ],
};
