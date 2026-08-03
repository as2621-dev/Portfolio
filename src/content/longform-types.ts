/**
 * Folio Pop — typed content model for long-form pages (case studies, project
 * deep-dives). Extends the site.ts approach: copy lives in typed per-page
 * content modules; components only render.
 *
 * Inline strings support a small markup subset, parsed by
 * `src/components/longform/InlineText.tsx`:
 *   **bold** · *italic* · `code` · [label](href) ·
 *   [CONFIRM: …] / [SLOT: …] / [VERIFY: …] / [FOUNDER — …] editorial chips
 *   (chips render only while `SHOW_PENDING_MARKERS` is true — see publish-state.ts).
 */

/** One key–value row of an article's scannable overview block. */
export interface ArticleMetaEntry {
  meta_label: string;
  meta_value: string;
}

/** One mono stat in a stat band (mirrors HeroStat in site.ts). */
export interface ArticleStat {
  stat_value: string;
  stat_label: string;
}

/** A link rendered as a Folio Pop button in CTA rows. */
export interface CtaLinkEntry {
  cta_label: string;
  href: string;
  cta_variant?: "primary" | "secondary" | "outline";
}

/** Charts are first-class blocks; ids map to components in src/components/charts/. */
export type LongformChartId =
  | "quicsnap-monthly-revenue"
  | "company-timeline"
  | "bakeoff-comparison"
  | "marketplace-pipeline";

/** The discriminated union every long-form page is written in. */
export type LongformBlock =
  | { block_kind: "heading"; heading_level: 2 | 3; heading_text: string; anchor_id?: string }
  | { block_kind: "paragraph"; paragraph_text: string; is_lede?: boolean }
  | { block_kind: "bullet_list"; list_items: string[] }
  | { block_kind: "numbered_list"; list_items: string[] }
  | { block_kind: "pull_quote"; quote_text: string; quote_attribution?: string }
  | { block_kind: "stat_band"; band_stats: ArticleStat[] }
  | { block_kind: "table"; table_header: string[]; table_rows: string[][]; table_caption?: string }
  | { block_kind: "callout"; callout_tint: "orange" | "blue" | "sun"; callout_title?: string; callout_text: string }
  | { block_kind: "chart"; chart_id: LongformChartId; chart_caption?: string }
  | { block_kind: "image"; image_src: string; image_alt: string; image_caption?: string }
  | { block_kind: "act_divider"; act_eyebrow: string; act_title: string; anchor_id?: string }
  | { block_kind: "media_slot"; slot_description: string }
  | { block_kind: "code"; code_text: string }
  | { block_kind: "cta_row"; cta_links: CtaLinkEntry[] }
  | { block_kind: "divider" };

/** A complete long-form article: header fields + ordered blocks. */
export interface LongformArticle {
  /** Mono orange eyebrow, e.g. "CASE STUDY" or "PROJECT". */
  article_eyebrow: string;
  article_title: string;
  /** Italic dek under the title. */
  article_subtitle?: string;
  /** Scannable key–value overview (role, timeline, team, …). */
  article_meta?: ArticleMetaEntry[];
  /** Headline stat band rendered above the body. */
  article_stats?: ArticleStat[];
  article_tags?: string[];
  blocks: LongformBlock[];
  /** Buttons at the end of the article (cross-links, contact). */
  article_footer_links?: CtaLinkEntry[];
}
