/**
 * Folio Pop — single source of truth for all shared portfolio content.
 *
 * Positioning (owner-confirmed 2026-08-02): AI PM first, founder prologue —
 * lead with AI product work; the ecommerce operating years appear as
 * founder-market-fit backstory. Copy source: ~/"Portfolio "/copy/ (11 files,
 * 00-copy-guide.md is the entry point). Long-form case-study/project copy
 * lives in per-page content modules (case-*.ts / project-*.ts).
 *
 * Numbers policy: every figure here traces to the research corpus
 * (~/"Portfolio "/research/) or is owner-supplied; fields marked `TODO`
 * still await confirmation. Do not invent or round numbers beyond what the
 * source supports. Revenue is stated only as ~$85K total (founder-confirmed);
 * never break out the self-serve figure in copy.
 *
 * Voice reminder (from the design system): playful, punchy, first person,
 * sentence case. Numbers concrete. Emoji sparing.
 */

/** A social/contact icon link (rendered in the hero row). */
export interface SocialLink {
  /** Human label, e.g. "GitHub". */
  platform_label: string;
  /** Icon key, e.g. "Github" | "Linkedin" | "Twitter" | "Mail" (mapped in the hero). */
  lucide_icon_name: string;
  /** Destination URL (or mailto:). */
  href: string;
}

/** A Linktree-style row in the primary link stack. */
export interface LinkTileEntry {
  /** 2–5 words, sentence case. */
  tile_title: string;
  /** Optional muted sub-label. */
  tile_meta?: string;
  /** Optional leading emoji. */
  tile_emoji?: string;
  href: string;
  tile_tint?: "orange" | "blue" | "sun";
}

/** A project shown in the tabbed project grid on /projects. */
export interface ProjectEntry {
  project_title: string;
  project_description: string;
  project_tags: string[];
  /** Optional headline stat, e.g. "804". */
  project_stat?: string;
  /** Label after the stat, e.g. "of items surfaced". */
  project_stat_label?: string;
  /** Which tab this project belongs to (must match a project_categories entry). */
  project_category: string;
  /** Optional media image for the card's 16:9 slot (public/ path). */
  project_media_image?: string;
  href: string;
}

/** A skill pill with optional 1–3 proficiency. */
export interface SkillEntry {
  skill_label: string;
  skill_level?: 1 | 2 | 3;
}

/** One row of the experience timeline (rendered top-down, newest first). */
export interface ExperienceEntry {
  /** Mono period label, e.g. "2023 — now". */
  experience_period: string;
  experience_role: string;
  experience_org: string;
  experience_summary?: string;
  is_current?: boolean;
}

/** A concrete hero stat (mono, specific numbers). */
export interface HeroStat {
  stat_value: string;
  stat_label: string;
}

/** A large featured-work card on the home page. */
export interface FeaturedWorkCard {
  card_title: string;
  card_description: string;
  card_tags: string[];
  card_stat?: string;
  card_stat_label?: string;
  href: string;
  card_tint?: "orange" | "blue" | "sun";
}

/** One row of the home competency strip — every claim links to its receipt. */
export interface CompetencyRow {
  competency_label: string;
  /** One-line proof; may carry inline editorial tags (rendered via InlineText). */
  competency_proof: string;
  /** Where the receipt lives, e.g. "/work/quicsnap-shutter-labs#act-2". */
  href: string;
  /** Short destination label, e.g. "Flagship, Act 2". */
  link_label: string;
}

/** The two case-study cross-links shown as a banner on /projects. */
export interface CaseStudyLink {
  link_title: string;
  link_meta: string;
  href: string;
}

/** The full content model consumed by every page. */
export interface SiteContent {
  owner_name: string;
  wordmark_text: string;
  role_line: string;
  hero_headline: string;
  hero_subline: string;
  /** TODO: confirm location + "open to" wording — undefined renders a CONFIRM chip in staging. */
  home_location_chip?: string;
  location_text?: string;
  primary_email: string;
  /** Public path of the résumé PDF (served from /public). */
  resume_pdf_href: string;
  hero_stats: HeroStat[];
  social_links: SocialLink[];
  link_tiles: LinkTileEntry[];
  featured_cards: FeaturedWorkCard[];
  competency_rows: CompetencyRow[];
  closing_cta: { closing_header: string; closing_body: string };
  skills: SkillEntry[];
  /** Tab labels for the project grid; keep "All" first. */
  project_categories: string[];
  projects: ProjectEntry[];
  case_study_links: CaseStudyLink[];
  experience: ExperienceEntry[];
}

const RESUME_PDF_HREF = "/Ashesh_Srivastava_Resume_PM.pdf";

export const site: SiteContent = {
  owner_name: "Ashesh Srivastava",
  wordmark_text: "Ashesh Srivastava",
  primary_email: "ashesh.srivastava1234@gmail.com", // TODO: confirm this is the address to expose publicly
  resume_pdf_href: RESUME_PDF_HREF,

  role_line: "Builder · Tinkerer · Manager",
  hero_headline: "I would like to devote my life to working on something that feels like a sport.",
  hero_subline:
    "Two-time founder — ecommerce operator turned AI tinkerer. I live at the capability overhang: figuring out interesting use cases, discovering what just became possible, learning as I go — and having fun along the way.",
  home_location_chip: undefined, // TODO: confirm location + "open to" statement
  location_text: undefined,

  // Verified: ~$85K total revenue (founder-confirmed); $593,653 peak
  // monthly GMV (Aug 2021, production DB); 7 = QuicSnap platform, Shutter Labs app,
  // Canvas, Orbit, blip, Astrape, JobFairy.
  hero_stats: [
    { stat_value: "~$85K", stat_label: "bootstrapped AI revenue" },
    { stat_value: "$593K", stat_label: "peak monthly GMV operated" },
    { stat_value: "7", stat_label: "AI products shipped end to end" },
  ],

  // TODO: confirm handles / URLs — placeholders until then.
  social_links: [
    { platform_label: "GitHub", lucide_icon_name: "Github", href: "#" },
    { platform_label: "LinkedIn", lucide_icon_name: "Linkedin", href: "#" },
    { platform_label: "X", lucide_icon_name: "Twitter", href: "#" },
    { platform_label: "Email", lucide_icon_name: "Mail", href: "mailto:ashesh.srivastava1234@gmail.com" },
  ],

  link_tiles: [
    {
      tile_title: "Read the flagship case study",
      tile_meta: "QuicSnap → Shutter Labs — betting against model progress",
      tile_emoji: "🔦",
      href: "/work/quicsnap-shutter-labs",
      tile_tint: "orange",
    },
    {
      tile_title: "Email me",
      tile_meta: "ashesh.srivastava1234@gmail.com",
      tile_emoji: "✉️",
      href: "mailto:ashesh.srivastava1234@gmail.com",
      tile_tint: "blue",
    },
    {
      tile_title: "Download résumé",
      tile_emoji: "📄",
      href: RESUME_PDF_HREF,
    },
  ],

  featured_cards: [
    {
      card_title: "Betting against the models — and losing well",
      card_description:
        "I built an AI product-photography company twice: a service with real revenue, then a platform — until one Google model release absorbed the category. The full story, numbers and all.",
      card_tags: ["AI imaging", "Pivot", "Post-mortem"],
      card_stat: "~$85K",
      card_stat_label: "bootstrapped revenue",
      href: "/work/quicsnap-shutter-labs",
      card_tint: "orange",
    },
    {
      card_title: "Building on the model that killed my startup",
      card_description:
        "The image workspace I built after Shutter Labs — positioned on top of frontier models instead of against them. Nano Banana Pro is a line item in its pricing table.",
      card_tags: ["0→1", "Multi-model routing", "Solo build"],
      card_stat: "½",
      card_stat_label: "the batch lane's price vs instant",
      href: "/work/canvas",
      card_tint: "blue",
    },
  ],

  competency_rows: [
    {
      competency_label: "Product strategy",
      competency_proof: "Called the moat-melt two years early; wrong about the speed — the full bet documented",
      href: "/work/quicsnap-shutter-labs#act-2",
      link_label: "Flagship, Act 2",
    },
    {
      competency_label: "Prioritization & decisions",
      competency_proof: "A 1,528-line PRD with 59 numbered decisions and six documented reversals",
      href: "/projects/jobfairy",
      link_label: "JobFairy",
    },
    {
      competency_label: "Evals & model quality",
      competency_proof: "Tuned a caption pipeline from 58% to 92% usable output, measured not vibed",
      href: "/projects/blip#eval",
      link_label: "blip",
    },
    {
      competency_label: "0→1 execution",
      competency_proof: "Spec → design system → shipped app, solo",
      href: "/work/canvas",
      link_label: "Canvas",
    },
    {
      competency_label: "Go-to-market",
      competency_proof: "An outbound machine: Apollo → personalized at scale → 50+ warmed domains [FOUNDER]",
      href: "/work/quicsnap-shutter-labs#gtm",
      link_label: "Flagship, Act 1",
    },
    {
      competency_label: "Data-driven problem solving",
      competency_proof: "A utility-bill model validated to within $0.17 of the real bill",
      href: "/projects/astrape",
      link_label: "Astrape",
    },
    {
      competency_label: "Teams & stakeholders",
      competency_proof: "Hired and ran the teams behind a real service business; negotiated a Fortune-500 POC",
      href: "/work/quicsnap-shutter-labs#fortune-500",
      link_label: "Flagship",
    },
    {
      competency_label: "Learning in public",
      competency_proof: "Every project page ends with what I got wrong and what it cost",
      href: "/projects",
      link_label: "everywhere",
    },
  ],

  closing_cta: {
    closing_header: "The 30-second version",
    closing_body:
      "I've operated ecommerce at scale, built an AI company to real revenue, pivoted it, and watched a frontier model absorb it — then kept shipping. If you want a PM who has actually carried a product P&L, made the calls, and written down what went wrong, the case studies are the interview prep.",
  },

  // TODO: confirm levels (1–3) — current values are a working judgment call.
  skills: [
    { skill_label: "Product strategy", skill_level: 3 },
    { skill_label: "AI product design", skill_level: 3 },
    { skill_label: "Image-gen pipelines (3D · LoRA)", skill_level: 3 },
    { skill_label: "Outbound GTM & growth", skill_level: 3 },
    { skill_label: "Evals & model selection", skill_level: 2 },
    { skill_label: "Data analysis & SQL", skill_level: 2 },
    { skill_label: "TypeScript", skill_level: 2 },
    { skill_label: "Python", skill_level: 2 },
  ],

  project_categories: ["All", "AI products", "Agents & tools", "Founder era"],

  // Ranked order is deliberate — strongest evals/decision stories first.
  projects: [
    {
      project_title: "Orbit",
      project_description:
        "Personal feed ranker that ingests 800+ sources I actually follow and turns each morning into one ranked 7am digest — X noise dropped, videos demoted but never deleted, and one tap away from a Claude voice conversation. Dogfooded daily for 42 days.",
      project_tags: ["Agentic architecture", "Claude agents", "Ranking", "RAG", "Python", "SQLite"],
      project_stat: "804",
      project_stat_label: "sources → one daily digest",
      project_category: "Agents & tools",
      project_media_image: "/mascot/mascot-radio.png",
      href: "/projects/orbit",
    },
    {
      project_title: "blip",
      project_description:
        "News as vertical reels: an iOS app with karaoke captions over generated narration. Tuned the caption pipeline from 58% to 92% usable output.",
      project_tags: ["iOS", "LLM pipeline"],
      project_stat: "92%",
      project_stat_label: "usable output (from 58%)",
      project_category: "AI products",
      project_media_image: "/mascot/mascot-reading.png",
      href: "/projects/blip",
    },
    {
      project_title: "JobFairy",
      project_description:
        "A job-search copilot for any candidate — verified H-1B sponsor filter, agent research on every role, tailored resumes, agent-filled applications, and outreach that lands in inboxes.",
      project_tags: ["Browser agents", "Next.js"],
      project_stat: "$0.02",
      project_stat_label: "vs $1.14 per task",
      project_category: "Agents & tools",
      project_media_image: "/mascot/mascot-map.png",
      href: "/projects/jobfairy",
    },
    {
      project_title: "Astrape",
      project_description:
        "A usage model for a Texas bill-credit electricity plan, validated to within $0.17 of the real bill — and a 999 vs 1,000 kWh paradox worth the read.",
      project_tags: ["Modeling", "Energy"],
      project_stat: "$0.17",
      project_stat_label: "model vs real bill",
      project_category: "Agents & tools",
      project_media_image: "/mascot/mascot-measure.png",
      href: "/projects/astrape",
    },
    {
      project_title: "Marketplace automation",
      project_description:
        "Built the custom platform and ~35-person ops team behind 77 US marketplace stores (QEG Automation).",
      project_tags: ["Ecommerce", "Ops at scale"],
      project_stat: "$593K",
      project_stat_label: "peak monthly GMV",
      project_category: "Founder era",
      project_media_image: "/mascot/mascot-dig.png",
      href: "/work/marketplace-automation",
    },
    {
      project_title: "Ecommerce consumer brands",
      project_description:
        "Built two private-label consumer brands — A Baby Cherry® and Decor & More® — sourced from factories in China, Vietnam, and India, sold on Amazon.",
      project_tags: ["DTC", "Amazon", "Private Label"],
      project_category: "Founder era",
      project_media_image: "/mascot/mascot-inspect.png",
      href: "/work/ecommerce-brands",
    },
  ],

  // The big two live in Work — banner row on /projects.
  case_study_links: [
    {
      link_title: "Betting against the models — and losing well",
      link_meta: "QuicSnap → Shutter Labs — the flagship case study",
      href: "/work/quicsnap-shutter-labs",
    },
    {
      link_title: "Building on the model that killed my startup",
      link_meta: "Canvas — the image workspace built after",
      href: "/work/canvas",
    },
  ],

  experience: [
    {
      experience_period: "2026 — now",
      experience_role: "Independent AI product builder",
      experience_org: "Canvas · Orbit · blip · more",
      experience_summary: "Shipping AI products end to end — design, model choice, evals, and go-to-market.",
      is_current: true,
    },
    {
      experience_period: "2022 — 2025",
      experience_role: "Founder → Co-founder",
      experience_org: "QuicSnap → Shutter Labs",
      experience_summary:
        "AI product photography, built twice: a bootstrapped service (15-SKU catalog, offshore 3D production pipeline, clients across the US, EU, and Middle East), then the platform pivot — 2D→3D capture plus per-product LoRAs for exact label fidelity, enterprise POC with a Fortune-500 retailer.",
    },
    {
      // TODO: confirm start/end years — no dated records on disk yet.
      experience_period: "20xx — 20xx",
      experience_role: "Founder — consumer brands",
      experience_org: "A Baby Cherry · Decor & More",
      experience_summary:
        "Two private-label consumer brands on Amazon, sourced from factories in China, Vietnam, and India, run with an 8-person team.",
    },
    {
      // Founder-supplied years (2026-08-02); file artifacts date Aug 2021 – Feb 2022.
      experience_period: "2022 — 2023",
      experience_role: "Founder — marketplace automation",
      experience_org: "QEG Automation",
      experience_summary:
        "US marketplace automation at scale: 77 client stores, a custom platform, ~35-person ops team.",
    },
  ],
};
