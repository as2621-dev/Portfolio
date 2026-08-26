"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { useChartReveal } from "./useChartReveal";

/**
 * Chart for the Orbit project page: the daily pipeline run as an animated
 * workflow diagram. Two flows share one canvas — the judge flow (blue:
 * delta-fetch → classify → cluster/trend, verified in scripts/orbit.py stages
 * 0–5) and the ship flow (orange: rank/tier → render → 7am email, stages 6–7
 * plus lib/deliver.py). Dashed strokes are the injected boundaries the code
 * fails soft around: the `claude -p` CLI (lib/llm.py), the keyless stdlib web
 * search (lib/web_search_keyless.py), the single SQLite state file (store.py),
 * and the gh-CLI archive push (lib/archive.py). Flow direction is animated as
 * a marching dash overlay; prefers-reduced-motion freezes it.
 *
 * Geometry is hand-placed on a 4px grid over an 880×600 viewBox and
 * collision-checked: connectors are straight or single-elbow orthogonals, no
 * two share a path, and attach points on any box edge sit ≥40px apart.
 * Re-check before moving boxes.
 */

/* Same validated categorical pair as MarketplacePipelineDiagram. */
const FLOW_COLORS = { judge: "#1B6FAE", ship: "#E8551F" } as const;
const FLOW_LABEL_COLORS = { judge: "var(--blue-700)", ship: "var(--orange-700)" } as const;

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
    actor_key: "youtube",
    box_x: 32,
    box_y: 88,
    box_w: 150,
    box_h: 128,
    box_fill: "var(--blue-50)",
    tag_text: "SOURCES",
    actor_name: "YouTube",
    actor_lines: ["590 subscriptions", "yt-dlp · cookies", "from the browser"],
  },
  {
    actor_key: "x",
    box_x: 32,
    box_y: 240,
    box_w: 150,
    box_h: 128,
    box_fill: "var(--blue-50)",
    tag_text: "SOURCES",
    actor_name: "X",
    actor_lines: ["214 following", "vendored GraphQL", "cookie-auth client"],
  },
  {
    actor_key: "sqlite",
    box_x: 32,
    box_y: 400,
    box_w: 150,
    box_h: 140,
    box_fill: "var(--paper)",
    tag_text: "STATE",
    actor_name: "SQLite",
    actor_lines: ["orbit.db · only state", "sources · seen", "classifications", "carryforward"],
  },
  {
    actor_key: "claude",
    box_x: 688,
    box_y: 72,
    box_w: 160,
    box_h: 124,
    box_fill: "var(--sun-100)",
    tag_text: "MODEL",
    actor_name: "Claude",
    actor_lines: ["Sonnet 4.6 · claude -p", "classify · chapters", "sections · summaries"],
  },
  {
    actor_key: "websearch",
    box_x: 688,
    box_y: 220,
    box_w: 160,
    box_h: 100,
    box_fill: "var(--paper)",
    tag_text: "CROSS-CHECK",
    actor_name: "Keyless search",
    actor_lines: ["stdlib urllib · no key", "result count only"],
  },
  {
    actor_key: "archive",
    box_x: 688,
    box_y: 396,
    box_w: 160,
    box_h: 100,
    box_fill: "var(--paper)",
    tag_text: "ARCHIVE",
    actor_name: "Private GitHub",
    actor_lines: ["gh CLI · 1 commit/run", "verified private first"],
  },
  {
    actor_key: "inbox",
    box_x: 312,
    box_y: 456,
    box_w: 192,
    box_h: 124,
    box_fill: "var(--sun-100)",
    tag_text: "DELIVERY",
    actor_name: "Your inbox, 7 am",
    actor_lines: ["Gmail SMTP · app password", "ledger as the body,", "chat link → claude.ai"],
  },
];

/* Chips 1–3 are the judge lane (y=104); chips 4–5 are the ship lane (y=248). */
const STEP_CHIPS: StepChip[] = [
  {
    chip_key: "delta-fetch",
    chip_x: 224,
    chip_y: 104,
    chip_w: 128,
    chip_name: "Delta fetch",
    chip_lines: ["new items only (seen)", "shorts <10 min dropped", "transcripts + chapters"],
  },
  {
    chip_key: "classify",
    chip_x: 376,
    chip_y: 104,
    chip_w: 128,
    chip_name: "Classify",
    chip_lines: ["signal vs noise", "on- vs off-topic", "+ category, per item"],
  },
  {
    chip_key: "cluster-trend",
    chip_x: 528,
    chip_y: 104,
    chip_w: 128,
    chip_name: "Cluster & trend",
    chip_lines: ["short↔long overlap", "internal trending", "scoop detection"],
  },
  {
    chip_key: "render",
    chip_x: 376,
    chip_y: 248,
    chip_w: 128,
    chip_name: "Render & note",
    chip_lines: ["Tiles + Final ledger", "email-safe body", "transcripts.md notes"],
  },
  {
    chip_key: "rank-tier",
    chip_x: 528,
    chip_y: 248,
    chip_w: 128,
    chip_name: "Rank & tier",
    chip_lines: ["creator-own baseline", "X capped at 8", "tiers — none dropped"],
  },
];

const CHIP_H = 96;

const FLOW_ARROWS: FlowArrow[] = [
  {
    arrow_key: "youtube-delta",
    arrow_path: "M182,148 H224",
    flow_kind: "judge",
    reveal_order: 0,
    arrow_title: "New uploads pulled per channel via yt-dlp, authenticated with browser cookies",
  },
  {
    arrow_key: "x-delta",
    arrow_path: "M182,264 H240 Q248,264 248,256 V200",
    flow_kind: "judge",
    reveal_order: 0,
    arrow_title: "Per-handle timelines pulled via the vendored cookie-auth GraphQL client",
  },
  {
    arrow_key: "delta-classify",
    arrow_path: "M352,152 H376",
    flow_kind: "judge",
    reveal_order: 1,
    arrow_title: "Only unseen items move on — the seen table is the delta",
  },
  {
    arrow_key: "classify-claude",
    arrow_path: "M440,104 V88 Q440,80 448,80 H688",
    flow_kind: "judge",
    is_dashed: true,
    reveal_order: 2,
    arrow_title:
      "Classify, chapterize, sections, and transcript summaries all ride one boundary: claude -p (Sonnet 4.6) on the Claude Code subscription — no API key on disk, fail-soft per batch",
  },
  {
    arrow_key: "classify-cluster",
    arrow_path: "M504,152 H528",
    flow_kind: "judge",
    reveal_order: 2,
    arrow_title: "Classified items move to overlap clustering and trending",
  },
  {
    arrow_key: "cluster-websearch",
    arrow_path: "M632,200 V228 Q632,236 640,236 H688",
    flow_kind: "judge",
    is_dashed: true,
    reveal_order: 3,
    arrow_title:
      "Internal-trending topics are cross-checked with a keyless stdlib web search — only the result count comes back, tagging corroborated vs scoop",
  },
  {
    arrow_key: "cluster-rank",
    arrow_path: "M592,200 V248",
    flow_kind: "judge",
    reveal_order: 3,
    arrow_title: "Clusters and trending multipliers feed the ranker",
  },
  {
    arrow_key: "rank-render",
    arrow_path: "M528,296 H504",
    flow_kind: "ship",
    reveal_order: 4,
    arrow_title: "Tiered items — hero to index band, nothing dropped — go to the renderer",
  },
  {
    arrow_key: "state-sqlite",
    arrow_path: "M240,384 V420 Q240,428 232,428 H182",
    flow_kind: "judge",
    is_dashed: true,
    reveal_order: 4,
    arrow_title:
      "Every stage reads and writes one local SQLite file — sources, seen-item deltas, classifications, carryforward. No server anywhere.",
  },
  {
    arrow_key: "render-inbox",
    arrow_path: "M408,344 V456",
    flow_kind: "ship",
    arrow_label: "07:00 EMAIL",
    label_x: 408,
    label_y: 393,
    label_w: 68,
    reveal_order: 5,
    arrow_title:
      "The ledger rendered email-safe is the body; the web ledger page and transcripts.md ride as attachments — a failed render degrades to plain text, the email still ships",
  },
  {
    arrow_key: "render-archive",
    arrow_path: "M472,344 V430 Q472,438 480,438 H688",
    flow_kind: "ship",
    is_dashed: true,
    arrow_label: "FAIL-SOFT",
    label_x: 584,
    label_y: 431,
    label_w: 56,
    reveal_order: 6,
    arrow_title:
      "After the email, the day's pages and notes are pushed to a private GitHub archive via the gh CLI — visibility verified before every push, and a failed push never costs the email",
  },
];

const LEGEND_ITEMS: { flow_kind: FlowKind; is_dashed?: boolean; legend_label: string }[] = [
  { flow_kind: "judge", legend_label: "judge — delta fetch → classify → trend" },
  { flow_kind: "ship", legend_label: "ship — rank → render → 7am email" },
  { flow_kind: "judge", is_dashed: true, legend_label: "injected boundary — fails soft" },
];

export function OrbitPipelineDiagram() {
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
            804 sources → one email
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
            The 7am run, end to end
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
              viewBox="0 0 880 600"
              style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}
              role="img"
              aria-label="Workflow diagram of Orbit's daily run. Judge flow: new uploads from 590 YouTube subscriptions arrive via yt-dlp with browser cookies, and posts from 214 X accounts via a vendored cookie-auth GraphQL client. A delta fetch keeps only unseen items and drops videos under ten minutes, capturing transcripts and chapters. Each item is classified on signal versus noise and on- versus off-topic plus a category, through the claude -p CLI running Claude Sonnet 4.6 on the local subscription. Items are clustered for short-versus-long overlap and internal trending, cross-checked by a keyless web search that returns only a result count to tag corroborated versus scoop. Ship flow: items are ranked against each creator's own baseline with X capped at eight, tiered from hero to an index band with nothing dropped, then rendered as Tiles pages, the Final ledger, an email-safe body, and transcripts point md notes. At 7am the digest is emailed over Gmail SMTP with the ledger as the body and a chat link to claude.ai; afterwards the pages are pushed fail-soft to a private GitHub archive via the gh CLI. The only state is a local SQLite file holding sources, seen items, classifications, and carryforward. The run is scheduled by a wake-proof launchd agent at 07:00."
            >
              <style>{`
                .opd-pulse {
                  stroke-dasharray: 3 13;
                  animation: opd-march 1.1s linear infinite;
                }
                .opd-dash-flow {
                  animation: opd-march-dash 1.1s linear infinite;
                }
                @keyframes opd-march { to { stroke-dashoffset: -32; } }
                @keyframes opd-march-dash { to { stroke-dashoffset: -22; } }
                @media (prefers-reduced-motion: reduce) {
                  .opd-pulse { animation: none; opacity: 0; }
                  .opd-dash-flow { animation: none; }
                }
              `}</style>
              <defs>
                <marker id="opd-arrow-judge" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <polygon points="0 0, 9 3.5, 0 7" fill={FLOW_COLORS.judge} />
                </marker>
                <marker id="opd-arrow-ship" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <polygon points="0 0, 9 3.5, 0 7" fill={FLOW_COLORS.ship} />
                </marker>
              </defs>

              {/* The run region — drawn first so arrows and chips sit on top. */}
              <rect
                x={208}
                y={56}
                width={464}
                height={328}
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
                The 7am run
              </text>
              <text
                x={224}
                y={374}
                style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em" }}
                fill="var(--ink-3)"
              >
                PYTHON CLI · LOCAL-FIRST
              </text>
              <text
                x={656}
                y={374}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em" }}
                fill="var(--ink-3)"
              >
                LAUNCHD 07:00 · WAKE-PROOF
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
                      className={arrow.is_dashed ? "opd-dash-flow" : undefined}
                      markerEnd={`url(#opd-arrow-${arrow.flow_kind})`}
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
                        className="opd-pulse"
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
                  </g>
                );
              })}

              {/* Run-region step chips. */}
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
