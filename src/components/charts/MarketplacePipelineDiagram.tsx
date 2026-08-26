"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { useChartReveal } from "./useChartReveal";

/**
 * Chart for the marketplace-automation case study: the dropshipping loop as an
 * animated workflow diagram. Two flows share one canvas — the listing pipeline
 * (blue, ran continuously on cron: Amazon catalog → platform → Walmart) and the
 * order loop (orange, fired per order: customer → Walmart → platform → Amazon →
 * customer, tracking written back). Flow direction is animated as a marching
 * dash overlay; prefers-reduced-motion freezes it.
 *
 * Geometry is hand-placed on a 4px grid over an 880×544 viewBox and
 * collision-checked: connectors are straight or single-elbow orthogonals, no
 * two share a path, and attach points on any box edge sit ≥40px apart.
 * Re-check before moving boxes.
 */

/* Same validated categorical pair as CompanyTimelineStrip. */
const FLOW_COLORS = { listing: "#1B6FAE", order: "#E8551F" } as const;
const FLOW_LABEL_COLORS = { listing: "var(--blue-700)", order: "var(--orange-700)" } as const;

type FlowKind = keyof typeof FLOW_COLORS;

interface ActorBox {
  actor_key: string;
  box_x: number;
  box_y: number;
  box_w: number;
  box_h: number;
  box_fill: string;
  tag_text: string;
  actor_name: string;
  actor_lines: string[];
  actor_aside?: string;
}

interface StepChip {
  chip_key: string;
  chip_x: number;
  chip_y: number;
  chip_w: number;
  chip_name: string;
  chip_lines: string[];
}

interface FlowArrow {
  arrow_key: string;
  arrow_path: string;
  flow_kind: FlowKind;
  is_dashed?: boolean;
  arrow_label?: string;
  /** Label mask rect: centered on label_x, top at label_y (14px tall). */
  label_x?: number;
  label_y?: number;
  label_w?: number;
  /** Stagger position for the draw-in reveal, in flow order. */
  reveal_order: number;
  arrow_title: string;
}

const ACTOR_BOXES: ActorBox[] = [
  {
    actor_key: "amazon",
    box_x: 32,
    box_y: 88,
    box_w: 160,
    box_h: 336,
    box_fill: "var(--blue-50)",
    tag_text: "SUPPLY",
    actor_name: "Amazon.com",
    actor_lines: ["product catalog", "MWS API"],
    actor_aside: "every order ships from here",
  },
  {
    actor_key: "walmart",
    box_x: 688,
    box_y: 88,
    box_w: 160,
    box_h: 336,
    box_fill: "var(--blue-50)",
    tag_text: "STOREFRONTS",
    actor_name: "Walmart.com",
    actor_lines: ["77 client stores", "204,559 live listings"],
    actor_aside: "where the customers were",
  },
  {
    actor_key: "customer",
    box_x: 344,
    box_y: 440,
    box_w: 192,
    box_h: 80,
    box_fill: "var(--sun-100)",
    tag_text: "BUYER",
    actor_name: "US customer",
    actor_lines: ["orders on Walmart · parcel arrives from Amazon"],
  },
];

/* Chips 1–3 are the listing lane (y=104); chip 4 is the order lane (y=248). */
const STEP_CHIPS: StepChip[] = [
  {
    chip_key: "ingest",
    chip_x: 224,
    chip_y: 104,
    chip_w: 128,
    chip_name: "Ingest & resolve",
    chip_lines: ["pull Amazon catalog", "ASIN→UPC via two", "vendors in series"],
  },
  {
    chip_key: "enrich",
    chip_x: 376,
    chip_y: 104,
    chip_w: 128,
    chip_name: "Enrich",
    chip_lines: ["full product data", "via Amazon MWS API"],
  },
  {
    chip_key: "list",
    chip_x: 528,
    chip_y: 104,
    chip_w: 128,
    chip_name: "List & sync",
    chip_lines: ["push listing feeds", "reprice at +30–40%", "sync inventory"],
  },
  {
    chip_key: "orders",
    chip_x: 440,
    chip_y: 248,
    chip_w: 176,
    chip_name: "Orders & tracking",
    chip_lines: ["pull confirmed orders", "place each on Amazon", "inject tracking back"],
  },
];

const CHIP_H = 96;

const FLOW_ARROWS: FlowArrow[] = [
  {
    arrow_key: "catalog",
    arrow_path: "M192,136 H224",
    flow_kind: "listing",
    reveal_order: 0,
    arrow_title: "Amazon catalog pulled into the platform",
  },
  {
    arrow_key: "ingest-enrich",
    arrow_path: "M352,152 H376",
    flow_kind: "listing",
    reveal_order: 1,
    arrow_title: "Resolved items move to enrichment",
  },
  {
    arrow_key: "enrich-list",
    arrow_path: "M504,152 H528",
    flow_kind: "listing",
    reveal_order: 2,
    arrow_title: "Enriched items move to listing",
  },
  {
    arrow_key: "feeds",
    arrow_path: "M656,136 H688",
    flow_kind: "listing",
    reveal_order: 3,
    arrow_title: "Listing, price, and inventory feeds pushed to Walmart",
  },
  {
    arrow_key: "orders-in",
    arrow_path: "M536,480 H760 Q768,480 768,472 V424",
    flow_kind: "order",
    arrow_label: "ORDERS",
    label_x: 648,
    label_y: 458,
    label_w: 44,
    reveal_order: 4,
    arrow_title: "Customer places an order on a Walmart storefront",
  },
  {
    arrow_key: "order-pull",
    arrow_path: "M688,272 H616",
    flow_kind: "order",
    arrow_label: "ORDER PULL",
    label_x: 652,
    label_y: 252,
    label_w: 60,
    reveal_order: 5,
    arrow_title: "Cron pulls confirmed Walmart orders every minute",
  },
  {
    arrow_key: "place-order",
    arrow_path: "M440,296 H192",
    flow_kind: "order",
    arrow_label: "PLACE ORDER",
    label_x: 316,
    label_y: 276,
    label_w: 68,
    reveal_order: 6,
    arrow_title: "The platform places the same order on Amazon",
  },
  {
    arrow_key: "ships-direct",
    arrow_path: "M112,424 V472 Q112,480 120,480 H344",
    flow_kind: "order",
    arrow_label: "SHIPS DIRECT",
    label_x: 232,
    label_y: 458,
    label_w: 68,
    reveal_order: 7,
    arrow_title: "Amazon ships the parcel straight to the customer",
  },
  {
    arrow_key: "tracking",
    arrow_path: "M616,316 H688",
    flow_kind: "order",
    is_dashed: true,
    arrow_label: "TRACKING",
    label_x: 652,
    label_y: 296,
    label_w: 52,
    reveal_order: 8,
    arrow_title: "Tracking number injected back into Walmart",
  },
];

const LEGEND_ITEMS: { flow_kind: FlowKind; is_dashed?: boolean; legend_label: string }[] = [
  { flow_kind: "listing", legend_label: "listing pipeline — ran continuously on cron" },
  { flow_kind: "order", legend_label: "order loop — fired per order" },
  { flow_kind: "order", is_dashed: true, legend_label: "write-back" },
];

export function MarketplacePipelineDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRevealed = useChartReveal(containerRef);

  return (
    /* Fits the article column (owner request 2026-08-09; was a 940px breakout).
       The SVG scales down to the column width with a 560px floor — below that
       (phones) it pans horizontally instead of shrinking further. Same
       treatment as CanvasArchitectureDiagram. */
    <div style={{ width: "100%" }}>
      <Card padding={24}>
        <div ref={containerRef}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
              fontWeight: 600,
              color: "var(--orange-600)",
              textTransform: "uppercase",
            }}
          >
            Amazon → platform → Walmart
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 20,
              color: "var(--ink)",
              marginTop: 4,
            }}
          >
            The dropshipping loop, end to end
          </div>

          {/* Legend — flow identity is color + label, never color alone. */}
          <div style={{ display: "flex", gap: 18, marginTop: 8, marginBottom: 4, flexWrap: "wrap" }}>
            {LEGEND_ITEMS.map((legend_item) => (
              <span
                key={legend_item.legend_label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--ink-2)",
                }}
              >
                <svg width="22" height="6" aria-hidden="true">
                  <line
                    x1="1"
                    y1="3"
                    x2="21"
                    y2="3"
                    stroke={FLOW_COLORS[legend_item.flow_kind]}
                    strokeWidth={2.5}
                    strokeDasharray={legend_item.is_dashed ? "5,4" : undefined}
                    strokeLinecap="round"
                  />
                </svg>
                {legend_item.legend_label}
              </span>
            ))}
          </div>

          <div style={{ overflowX: "auto" }}>
            <svg
              viewBox="0 0 880 544"
              style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}
              role="img"
              aria-label="Workflow diagram of the dropshipping loop. Listing pipeline, running continuously on cron: the platform pulls the Amazon catalog, resolves ASINs to UPCs through two vendors in series, enriches products via the Amazon MWS API, then pushes listing feeds to 77 Walmart stores repriced 30 to 40 percent higher, with inventory kept in sync. Order loop, fired per order: a US customer orders on Walmart, the platform pulls the confirmed order every minute, places the same order on Amazon, Amazon ships directly to the customer, and the tracking number is injected back into Walmart."
            >
              <style>{`
                .mpd-pulse {
                  stroke-dasharray: 3 13;
                  animation: mpd-march 1.1s linear infinite;
                }
                .mpd-dash-flow {
                  animation: mpd-march-dash 1.1s linear infinite;
                }
                @keyframes mpd-march { to { stroke-dashoffset: -32; } }
                @keyframes mpd-march-dash { to { stroke-dashoffset: -22; } }
                @media (prefers-reduced-motion: reduce) {
                  .mpd-pulse { animation: none; opacity: 0; }
                  .mpd-dash-flow { animation: none; }
                }
              `}</style>
              <defs>
                <marker id="mpd-arrow-listing" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <polygon points="0 0, 9 3.5, 0 7" fill={FLOW_COLORS.listing} />
                </marker>
                <marker id="mpd-arrow-order" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <polygon points="0 0, 9 3.5, 0 7" fill={FLOW_COLORS.order} />
                </marker>
              </defs>

              {/* The platform region — drawn first so arrows and chips sit on top. */}
              <rect
                x={208}
                y={56}
                width={464}
                height={304}
                rx={14}
                fill="var(--orange-50)"
                stroke="var(--orange-500)"
                strokeWidth={2}
              />
              <text
                x={224}
                y={84}
                style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800 }}
                fill="var(--orange-700)"
              >
                The platform
              </text>
              <text
                x={656}
                y={84}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em" }}
                fill="var(--ink-3)"
              >
                CUSTOM PHP · 14 CRON JOBS · 4 EVERY MINUTE
              </text>

              {/* Arrows — before boxes, so strokes tuck under box borders. */}
              {FLOW_ARROWS.map((arrow) => {
                const stroke_color = FLOW_COLORS[arrow.flow_kind];
                return (
                  <g
                    key={arrow.arrow_key}
                    style={{
                      opacity: isRevealed ? 1 : 0,
                      transition: `opacity 0.5s var(--ease-out) ${200 + arrow.reveal_order * 110}ms`,
                    }}
                  >
                    <title>{arrow.arrow_title}</title>
                    <path
                      d={arrow.arrow_path}
                      fill="none"
                      stroke={stroke_color}
                      strokeWidth={2.25}
                      strokeDasharray={arrow.is_dashed ? "6,5" : undefined}
                      className={arrow.is_dashed ? "mpd-dash-flow" : undefined}
                      markerEnd={`url(#mpd-arrow-${arrow.flow_kind})`}
                    />
                    {/* Marching light dashes over the solid stroke = visible flow direction. */}
                    {!arrow.is_dashed && (
                      <path
                        d={arrow.arrow_path}
                        fill="none"
                        stroke="var(--paper)"
                        strokeWidth={2.25}
                        strokeLinecap="round"
                        opacity={0.85}
                        className="mpd-pulse"
                      />
                    )}
                    {arrow.arrow_label && arrow.label_x !== undefined && (
                      <>
                        {/* Opaque mask so the label never bleeds into a stroke. */}
                        <rect
                          x={arrow.label_x - (arrow.label_w ?? 48) / 2}
                          y={arrow.label_y}
                          width={arrow.label_w ?? 48}
                          height={14}
                          rx={2}
                          fill="var(--paper)"
                        />
                        <text
                          x={arrow.label_x}
                          y={(arrow.label_y ?? 0) + 10}
                          textAnchor="middle"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            fontWeight: 600,
                            letterSpacing: "0.05em",
                          }}
                          fill={FLOW_LABEL_COLORS[arrow.flow_kind]}
                        >
                          {arrow.arrow_label}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}

              {/* Actor boxes. */}
              {ACTOR_BOXES.map((actor) => {
                const center_x = actor.box_x + actor.box_w / 2;
                return (
                  <g
                    key={actor.actor_key}
                    style={{ opacity: isRevealed ? 1 : 0, transition: "opacity 0.5s var(--ease-out) 80ms" }}
                  >
                    <title>{`${actor.actor_name} — ${actor.actor_lines.join(" · ")}`}</title>
                    <rect
                      x={actor.box_x}
                      y={actor.box_y}
                      width={actor.box_w}
                      height={actor.box_h}
                      rx={12}
                      fill={actor.box_fill}
                      stroke="var(--ink)"
                      strokeWidth={2}
                    />
                    <text
                      x={center_x}
                      y={actor.box_y + 28}
                      textAnchor="middle"
                      style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.12em" }}
                      fill="var(--ink-3)"
                    >
                      {actor.tag_text}
                    </text>
                    <text
                      x={center_x}
                      y={actor.box_y + 56}
                      textAnchor="middle"
                      style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800 }}
                      fill="var(--ink)"
                    >
                      {actor.actor_name}
                    </text>
                    {actor.actor_lines.map((actor_line, line_index) => (
                      <text
                        key={actor_line}
                        x={center_x}
                        y={actor.box_y + 80 + line_index * 16}
                        textAnchor="middle"
                        style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                        fill="var(--ink-2)"
                      >
                        {actor_line}
                      </text>
                    ))}
                    {actor.actor_aside && (
                      <text
                        x={center_x}
                        y={actor.box_y + actor.box_h - 28}
                        textAnchor="middle"
                        style={{ fontFamily: "var(--font-body)", fontSize: 11.5, fontStyle: "italic" }}
                        fill="var(--ink-3)"
                      >
                        {actor.actor_aside}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Platform step chips. */}
              {STEP_CHIPS.map((chip, chip_index) => {
                const center_x = chip.chip_x + chip.chip_w / 2;
                return (
                  <g
                    key={chip.chip_key}
                    style={{
                      opacity: isRevealed ? 1 : 0,
                      transition: `opacity 0.5s var(--ease-out) ${120 + chip_index * 90}ms`,
                    }}
                  >
                    <title>{`${chip.chip_name} — ${chip.chip_lines.join(", ")}`}</title>
                    <rect
                      x={chip.chip_x}
                      y={chip.chip_y}
                      width={chip.chip_w}
                      height={CHIP_H}
                      rx={8}
                      fill="var(--paper)"
                      stroke="var(--ink)"
                      strokeWidth={1.5}
                    />
                    <text
                      x={center_x}
                      y={chip.chip_y + 26}
                      textAnchor="middle"
                      style={{ fontFamily: "var(--font-display)", fontSize: 12.5, fontWeight: 800 }}
                      fill="var(--ink)"
                    >
                      {chip.chip_name}
                    </text>
                    {chip.chip_lines.map((chip_line, line_index) => (
                      <text
                        key={chip_line}
                        x={center_x}
                        y={chip.chip_y + 46 + line_index * 14}
                        textAnchor="middle"
                        style={{ fontFamily: "var(--font-mono)", fontSize: 9 }}
                        fill="var(--ink-2)"
                      >
                        {chip_line}
                      </text>
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </Card>
    </div>
  );
}
