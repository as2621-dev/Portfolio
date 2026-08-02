import type React from "react";
import { BakeoffComparisonChart } from "@/components/charts/BakeoffComparisonChart";
import { CompanyTimelineStrip } from "@/components/charts/CompanyTimelineStrip";
import { QuicsnapRevenueChart } from "@/components/charts/QuicsnapRevenueChart";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { LongformBlock, LongformChartId } from "@/content/longform-types";
import { SHOW_PENDING_MARKERS } from "@/content/publish-state";
import { InlineText } from "./InlineText";

export interface BlockRendererProps {
  blocks: LongformBlock[];
}

const PARAGRAPH_STYLE: React.CSSProperties = {
  fontSize: 17,
  lineHeight: 1.7,
  color: "var(--ink-2)",
  margin: 0,
};

const CHARTS: Record<LongformChartId, React.ComponentType> = {
  "quicsnap-monthly-revenue": QuicsnapRevenueChart,
  "company-timeline": CompanyTimelineStrip,
  "bakeoff-comparison": BakeoffComparisonChart,
};

/** Heavier visual blocks get a scroll reveal; plain prose renders statically. */
function withReveal(node: React.ReactNode, key: string) {
  return <Reveal key={key}>{node}</Reveal>;
}

/**
 * Renders a long-form article body from its typed block list. Every string
 * field passes through <InlineText>, so bold/links/editorial chips work in
 * paragraphs, list items, table cells, and quotes alike.
 */
export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {blocks.map((block, block_index) => {
        const key = `block-${block_index}`;

        switch (block.block_kind) {
          case "heading": {
            const HeadingTag = block.heading_level === 2 ? "h2" : "h3";
            return (
              <HeadingTag
                key={key}
                id={block.anchor_id}
                style={{
                  fontSize: block.heading_level === 2 ? 26 : 20,
                  fontWeight: block.heading_level === 2 ? 800 : 700,
                  marginTop: block.heading_level === 2 ? 24 : 8,
                  scrollMarginTop: 96,
                }}
              >
                <InlineText text={block.heading_text} />
              </HeadingTag>
            );
          }

          case "paragraph":
            return (
              <p
                key={key}
                style={{
                  ...PARAGRAPH_STYLE,
                  ...(block.is_lede ? { fontSize: 19, color: "var(--ink)", fontWeight: 500 } : {}),
                }}
              >
                <InlineText text={block.paragraph_text} />
              </p>
            );

          case "bullet_list":
          case "numbered_list": {
            const ListTag = block.block_kind === "bullet_list" ? "ul" : "ol";
            return (
              <ListTag
                key={key}
                style={{ margin: 0, paddingLeft: 26, display: "flex", flexDirection: "column", gap: 10 }}
              >
                {block.list_items.map((item, item_index) => (
                  <li key={`${key}-i${item_index}`} style={{ ...PARAGRAPH_STYLE, fontSize: 16.5 }}>
                    <InlineText text={item} />
                  </li>
                ))}
              </ListTag>
            );
          }

          case "pull_quote":
            return withReveal(
              <Card tint="sun" padding={28} style={{ position: "relative" }}>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 4,
                    left: 16,
                    fontFamily: "var(--font-display)",
                    fontSize: 64,
                    fontWeight: 800,
                    color: "var(--orange-500)",
                    lineHeight: 1,
                  }}
                >
                  “
                </span>
                <blockquote
                  style={{
                    margin: "20px 0 0",
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 600,
                    lineHeight: 1.45,
                    color: "var(--ink)",
                  }}
                >
                  <InlineText text={block.quote_text} />
                </blockquote>
                {block.quote_attribution && (
                  <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-3)" }}>
                    — <InlineText text={block.quote_attribution} />
                  </div>
                )}
              </Card>,
              key,
            );

          case "stat_band":
            return withReveal(
              <Card padding={22}>
                <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "space-between" }}>
                  {block.band_stats.map((stat) => (
                    <div key={stat.stat_label} style={{ minWidth: 130, flex: "1 1 130px" }}>
                      <div
                        style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 23, color: "var(--ink)" }}
                      >
                        <InlineText text={stat.stat_value} />
                      </div>
                      <div
                        style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}
                      >
                        <InlineText text={stat.stat_label} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>,
              key,
            );

          case "table":
            return withReveal(
              <figure style={{ margin: 0 }}>
                <div
                  style={{
                    overflowX: "auto",
                    border: "2px solid var(--ink)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-pop-sm)",
                    background: "var(--paper)",
                  }}
                >
                  <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 480 }}>
                    <thead>
                      <tr>
                        {block.table_header.map((header_cell, cell_index) => (
                          <th
                            key={`${key}-h${cell_index}`}
                            style={{
                              textAlign: "left",
                              fontFamily: "var(--font-display)",
                              fontSize: 14,
                              fontWeight: 700,
                              color: "var(--ink)",
                              background: "var(--blue-50)",
                              padding: "10px 14px",
                              borderBottom: "2px solid var(--ink)",
                            }}
                          >
                            <InlineText text={header_cell} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.table_rows.map((row, row_index) => (
                        <tr key={`${key}-r${row_index}`}>
                          {row.map((cell, cell_index) => (
                            <td
                              key={`${key}-r${row_index}c${cell_index}`}
                              style={{
                                fontSize: 14.5,
                                lineHeight: 1.55,
                                color: "var(--ink-2)",
                                padding: "10px 14px",
                                borderBottom:
                                  row_index === block.table_rows.length - 1 ? "none" : "1px solid var(--border-soft)",
                                verticalAlign: "top",
                              }}
                            >
                              <InlineText text={cell} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.table_caption && (
                  <figcaption
                    style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", marginTop: 8 }}
                  >
                    <InlineText text={block.table_caption} />
                  </figcaption>
                )}
              </figure>,
              key,
            );

          case "callout":
            return withReveal(
              <Card tint={block.callout_tint} padding={24}>
                {block.callout_title && (
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--orange-600)",
                      marginBottom: 8,
                    }}
                  >
                    <InlineText text={block.callout_title} />
                  </div>
                )}
                <div style={{ ...PARAGRAPH_STYLE, fontSize: 16.5, color: "var(--ink)" }}>
                  <InlineText text={block.callout_text} />
                </div>
              </Card>,
              key,
            );

          case "chart": {
            const ChartComponent = CHARTS[block.chart_id];
            return withReveal(
              <figure style={{ margin: 0 }}>
                <ChartComponent />
                {block.chart_caption && (
                  <figcaption
                    style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", marginTop: 8 }}
                  >
                    <InlineText text={block.chart_caption} />
                  </figcaption>
                )}
              </figure>,
              key,
            );
          }

          case "act_divider":
            return (
              <div
                key={key}
                id={block.anchor_id}
                style={{ borderTop: "2px solid var(--ink)", paddingTop: 28, marginTop: 32, scrollMarginTop: 96 }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                    color: "var(--orange-600)",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  {block.act_eyebrow}
                </div>
                <h2 style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>
                  <InlineText text={block.act_title} />
                </h2>
              </div>
            );

          case "media_slot":
            if (!SHOW_PENDING_MARKERS) return null;
            return (
              <div
                key={key}
                style={{
                  aspectRatio: "16/9",
                  border: "2px dashed var(--border-soft)",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--paper)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 24,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12.5,
                    color: "var(--ink-3)",
                    textAlign: "center",
                    maxWidth: "44ch",
                    lineHeight: 1.6,
                  }}
                >
                  📷 asset slot — {block.slot_description}
                </span>
              </div>
            );

          case "code":
            return (
              <pre
                key={key}
                style={{
                  margin: 0,
                  padding: "16px 20px",
                  background: "var(--paper)",
                  border: "2px solid var(--ink)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-pop-sm)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: "var(--ink)",
                  overflowX: "auto",
                }}
              >
                {block.code_text}
              </pre>
            );

          case "cta_row":
            return (
              <div key={key} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
                {block.cta_links.map((cta) => (
                  <Button key={cta.cta_label} href={cta.href} variant={cta.cta_variant ?? "primary"} size="md">
                    {cta.cta_label}
                  </Button>
                ))}
              </div>
            );

          case "divider":
            return (
              <hr key={key} style={{ border: "none", borderTop: "2px dashed var(--border-soft)", margin: "16px 0" }} />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
