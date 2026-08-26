"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { useChartReveal } from "./useChartReveal";

/**
 * Chart for the Orbit project page: what happens to ONE item after the delta
 * fetch — the triage companion to OrbitPipelineDiagram's whole-run view.
 *
 * The flow it draws is verified against the pipeline source: the pre-classify
 * Shorts gate (scripts/orbit.py drop_short_form_uploads), the two-axis
 * classifier (lib/classify.py — axis A signal/noise, axis B on/off-topic, plus
 * a taxonomy category), the three outcomes (pass both → ranker; fail an axis on
 * YouTube → forced into the "they also posted" index tier, lib/density.py; X
 * noise and category "other" → dropped, scripts/orbit.py), the own-baseline
 * ranking constants (lib/rerank.py), and the proportional tier stack
 * (lib/density.py HERO/STANDARD/COMPACT_FRACTION).
 *
 * Color is outcome identity, never rank: orange = ships full-slot, blue =
 * demoted but kept, gray dashed = dropped. Identity is never color alone —
 * every path carries a label or terminates in a labeled box, and the dropped
 * path is additionally dashed. The blue/orange pair is the same validated
 * categorical pair as OrbitPipelineDiagram.
 *
 * Geometry is hand-placed on a 4px grid over an 880×620 viewBox and
 * collision-checked: connectors are straight or single-elbow orthogonals, no
 * two share a path, and attach points on any box edge sit ≥40px apart.
 * Re-check before moving boxes.
 */

const OUTCOME_COLORS = { ships: "#E8551F", demoted: "#1B6FAE", dropped: "#6B7F91", pending: "#3D5468" } as const;

type OutcomeKind = keyof typeof OUTCOME_COLORS;

interface TriageBox {
  box_key: string;
  box_x: number;
  box_y: number;
  box_w: number;
  box_h: number;
  box_fill: string;
  is_dashed_border?: boolean;
  tag_text: string;
  box_name: string;
  box_lines: string[];
  box_title: string;
}

interface TriageArrow {
  arrow_key: string;
  arrow_path: string;
  outcome_kind: OutcomeKind;
  is_dashed?: boolean;
  /** Horizontal label masked onto a vertical run (pipeline-diagram style). */
  arrow_label?: string;
  label_x?: number;
  label_y?: number;
  label_w?: number;
  reveal_order: number;
  arrow_title: string;
}

interface TierBand {
  band_key: string;
  band_y: number;
  band_h: number;
  band_fill: string;
  band_label: string;
  band_sub?: string;
  band_title: string;
}

const TRIAGE_BOXES: TriageBox[] = [
  {
    box_key: "entry",
    box_x: 32,
    box_y: 140,
    box_w: 148,
    box_h: 132,
    box_fill: "var(--blue-50)",
    tag_text: "INPUT",
    box_name: "Every new item",
    box_lines: ["2,028 judged · 42 days", "a YouTube upload", "or an X post"],
    box_title:
      "Everything the delta fetch found that I haven't seen before — 2,028 items reached the classifier in the first 42 days",
  },
  {
    box_key: "shorts-gate",
    box_x: 210,
    box_y: 156,
    box_w: 112,
    box_h: 104,
    box_fill: "var(--paper)",
    tag_text: "GATE",
    box_name: "Length gate",
    box_lines: ["YouTube only:", "Shorts dropped", "before classify"],
    box_title:
      "The one pre-classify gate: known-short YouTube clips are dropped before any model call — unknown durations are kept, fail-open",
  },
  {
    box_key: "dropped-bin",
    box_x: 210,
    box_y: 500,
    box_w: 342,
    box_h: 96,
    box_fill: "var(--cream)",
    is_dashed_border: true,
    tag_text: "THE ONLY DELETIONS",
    box_name: "Dropped, never ranked",
    box_lines: ["Shorts · off-taxonomy (“other”) · X noise", "a chosen channel’s video never lands here"],
    box_title:
      "The full list of what gets deleted: YouTube Shorts, items outside the fixed topic taxonomy (both platforms), and X posts judged noise — 65% of X. A full-length video from a subscribed channel can never end up here.",
  },
];

/* The classifier is drawn bespoke (inner axis rows + disagreement strip). */
const CLASSIFIER = { box_x: 352, box_y: 96, box_w: 200, box_h: 240 } as const;

const RANKER = { box_x: 600, box_y: 96, box_w: 168, box_h: 150 } as const;

const RANKER_LINES = [
  "engagement vs the",
  "creator’s own norm ×1.0",
  "uniqueness floor ×1.0",
  "quote tweet ×0.5",
  "X only: top 8 kept",
];

/* Band heights ∝ the real fractions in lib/density.py: 10 / 25 / 35 / rest. */
const TIER_STACK = { stack_x: 608, stack_w: 224 } as const;

const TIER_BANDS: TierBand[] = [
  {
    band_key: "hero",
    band_y: 300,
    band_h: 22,
    band_fill: "var(--orange-500)",
    band_label: "HERO — top 10% · full card",
    band_title: "The top 10% of passing items by rank position: a full card with summary and chapters",
  },
  {
    band_key: "standard",
    band_y: 324,
    band_h: 52,
    band_fill: "var(--orange-100)",
    band_label: "STANDARD — next 25%",
    band_sub: "medium card",
    band_title: "The next 25% by rank position: a medium card",
  },
  {
    band_key: "compact",
    band_y: 378,
    band_h: 72,
    band_fill: "var(--orange-50)",
    band_label: "COMPACT — next 35%",
    band_sub: "title + one line",
    band_title: "The next 35% by rank position: title plus one line",
  },
  {
    band_key: "index",
    band_y: 452,
    band_h: 64,
    band_fill: "var(--cream)",
    band_label: "INDEX — the rest + demoted",
    band_sub: "the “they also posted” strip",
    band_title:
      "The remainder of scored items, plus every demoted item — forced here regardless of score. Still in the digest, one line each.",
  },
];

const TRIAGE_ARROWS: TriageArrow[] = [
  {
    arrow_key: "entry-gate",
    arrow_path: "M180,206 H210",
    outcome_kind: "pending",
    reveal_order: 0,
    arrow_title: "Every unseen item enters triage; the seen table is the delta",
  },
  {
    arrow_key: "gate-classifier",
    arrow_path: "M322,206 H352",
    outcome_kind: "pending",
    reveal_order: 1,
    arrow_title: "Full-length items go on to classification — one claude -p call per item",
  },
  {
    arrow_key: "gate-drop",
    arrow_path: "M266,260 V500",
    outcome_kind: "dropped",
    is_dashed: true,
    arrow_label: "YT SHORTS",
    label_x: 266,
    label_y: 360,
    label_w: 70,
    reveal_order: 1,
    arrow_title: "Known-short clips are dropped before the classifier ever sees them — no model call spent",
  },
  {
    arrow_key: "classifier-ranker",
    arrow_path: "M552,150 H600",
    outcome_kind: "ships",
    reveal_order: 2,
    arrow_title: "Passes both axes — signal AND on-topic — so it goes to the ranker for a full slot",
  },
  {
    arrow_key: "classifier-demote",
    arrow_path: "M552,260 H572 Q580,260 580,268 V476 Q580,484 588,484 H608",
    outcome_kind: "demoted",
    reveal_order: 3,
    arrow_title:
      "Fails an axis on YouTube — noise, or off-topic: demoted straight into the index band (“they also posted”), regardless of score. Never deleted.",
  },
  {
    arrow_key: "classifier-drop-noise",
    arrow_path: "M420,336 V500",
    outcome_kind: "dropped",
    is_dashed: true,
    arrow_label: "X NOISE · 65%",
    label_x: 420,
    label_y: 396,
    label_w: 88,
    reveal_order: 3,
    arrow_title:
      "X-only gate: a post judged noise (gm, platitudes, engagement bait) is deleted outright — 65% of X posts go this way. A tweet costs nothing to lose.",
  },
  {
    arrow_key: "classifier-drop-taxonomy",
    arrow_path: "M500,336 V500",
    outcome_kind: "dropped",
    is_dashed: true,
    arrow_label: "OFF-TAXONOMY",
    label_x: 500,
    label_y: 440,
    label_w: 88,
    reveal_order: 3,
    arrow_title:
      "Both platforms: an item whose category falls outside the fixed topic taxonomy (“other”) is dropped — a garbled category defaults to keep, so a prompt regression can’t empty the digest",
  },
  {
    arrow_key: "ranker-tiers",
    arrow_path: "M684,246 V300",
    outcome_kind: "ships",
    arrow_label: "TIERED BY RANK",
    label_x: 684,
    label_y: 264,
    label_w: 96,
    reveal_order: 4,
    arrow_title: "Scored items are tiered by rank position over the passing distribution — the ranker drops nothing",
  },
];

const LEGEND_ITEMS: { outcome_kind: OutcomeKind; is_dashed?: boolean; legend_label: string }[] = [
  { outcome_kind: "ships", legend_label: "ships full-slot — passed both axes" },
  { outcome_kind: "demoted", legend_label: "demoted, not deleted — “they also posted”" },
  { outcome_kind: "dropped", is_dashed: true, legend_label: "dropped — the only deletions" },
];

export function OrbitTriageDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRevealed = useChartReveal(containerRef);

  return (
    /* Fits the article column (owner request 2026-08-09; was a 940px breakout).
       The SVG scales down to the column width with a 560px floor — below that
       (phones) it pans horizontally instead of shrinking further. Firm rule:
       every diagram fits the text column; never reintroduce a breakout. */
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
            classify → rank → tier
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
            What happens to one item
          </div>

          {/* Legend — outcome identity is color + label, never color alone. */}
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
                    stroke={OUTCOME_COLORS[legend_item.outcome_kind]}
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
              viewBox="0 0 880 620"
              style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}
              role="img"
              aria-label="Triage diagram of one item's path through Orbit. Every new item — 2,028 judged over 42 days, a YouTube upload or an X post — first hits a length gate where YouTube Shorts are dropped before classification. Everything else gets one claude -p call answering two independent questions: axis A, is it signal or noise — shorts bait, promo, platitudes, hot takes with no claim; and axis B, is it on-topic — what I follow this source for. The classifier also assigns a topic category from a fixed taxonomy. The axes disagree on 333 of 2,028 items, 16.4 percent, which is why one relevance score can't work. Three outcomes: an item passing both axes goes to the ranker, which scores it against the creator's own baseline — relative engagement weight 1.0, uniqueness floor 1.0, quote tweet multiplier 0.5, and for X only the top 8 are kept. Ranked items are tiered by rank position: the top 10 percent become hero full cards, the next 25 percent standard, the next 35 percent compact, the rest an index band. A YouTube video that fails either axis is demoted straight into that index band — the “they also posted” strip — regardless of score, never deleted. The only deletions are the gray gates: YouTube Shorts, items outside the topic taxonomy on either platform, and X posts judged noise, which is 65 percent of X. A chosen channel's full-length video can never be deleted, and a test enforces that the ranker's output length equals its input length — rank controls density, never inclusion."
            >
              <style>{`
                .otd-pulse {
                  stroke-dasharray: 3 13;
                  animation: otd-march 1.1s linear infinite;
                }
                .otd-dash-flow {
                  animation: otd-march-dash 1.1s linear infinite;
                }
                @keyframes otd-march { to { stroke-dashoffset: -32; } }
                @keyframes otd-march-dash { to { stroke-dashoffset: -22; } }
                @media (prefers-reduced-motion: reduce) {
                  .otd-pulse { animation: none; opacity: 0; }
                  .otd-dash-flow { animation: none; }
                }
              `}</style>
              <defs>
                {(Object.keys(OUTCOME_COLORS) as OutcomeKind[]).map((outcome_kind) => (
                  <marker
                    key={outcome_kind}
                    id={`otd-arrow-${outcome_kind}`}
                    markerWidth="9"
                    markerHeight="7"
                    refX="7"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 9 3.5, 0 7" fill={OUTCOME_COLORS[outcome_kind]} />
                  </marker>
                ))}
              </defs>

              {/* Arrows — before boxes, so strokes tuck under box borders. */}
              {TRIAGE_ARROWS.map((arrow) => {
                const stroke_color = OUTCOME_COLORS[arrow.outcome_kind];
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
                      className={arrow.is_dashed ? "otd-dash-flow" : undefined}
                      markerEnd={`url(#otd-arrow-${arrow.outcome_kind})`}
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
                        className="otd-pulse"
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
                          fill={arrow.outcome_kind === "ships" ? "var(--orange-700)" : "var(--ink-3)"}
                        >
                          {arrow.arrow_label}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}

              {/* Demote-path label — beside the long vertical, clear of the drops. */}
              <g style={{ opacity: isRevealed ? 1 : 0, transition: "opacity 0.5s var(--ease-out) 530ms" }}>
                <text
                  x={568}
                  y={386}
                  textAnchor="end"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, letterSpacing: "0.05em" }}
                  fill="var(--blue-700)"
                >
                  KEPT —
                </text>
                <text
                  x={568}
                  y={398}
                  textAnchor="end"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, letterSpacing: "0.05em" }}
                  fill="var(--blue-700)"
                >
                  DEMOTED
                </text>
              </g>

              {/* Plain boxes: entry, shorts gate, dropped bin. */}
              {TRIAGE_BOXES.map((triage_box) => {
                const center_x = triage_box.box_x + triage_box.box_w / 2;
                return (
                  <g
                    key={triage_box.box_key}
                    style={{ opacity: isRevealed ? 1 : 0, transition: "opacity 0.5s var(--ease-out) 80ms" }}
                  >
                    <title>{triage_box.box_title}</title>
                    <rect
                      x={triage_box.box_x}
                      y={triage_box.box_y}
                      width={triage_box.box_w}
                      height={triage_box.box_h}
                      rx={12}
                      fill={triage_box.box_fill}
                      stroke={triage_box.is_dashed_border ? "var(--ink-3)" : "var(--ink)"}
                      strokeWidth={2}
                      strokeDasharray={triage_box.is_dashed_border ? "7,5" : undefined}
                    />
                    <text
                      x={center_x}
                      y={triage_box.box_y + 22}
                      textAnchor="middle"
                      style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.12em" }}
                      fill="var(--ink-3)"
                    >
                      {triage_box.tag_text}
                    </text>
                    <text
                      x={center_x}
                      y={triage_box.box_y + 44}
                      textAnchor="middle"
                      style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800 }}
                      fill="var(--ink)"
                    >
                      {triage_box.box_name}
                    </text>
                    {triage_box.box_lines.map((box_line, line_index) => (
                      <text
                        key={box_line}
                        x={center_x}
                        y={triage_box.box_y + 64 + line_index * 15}
                        textAnchor="middle"
                        style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
                        fill="var(--ink-2)"
                      >
                        {box_line}
                      </text>
                    ))}
                  </g>
                );
              })}

              {/* The classifier — bespoke: two axis rows + the disagreement strip. */}
              <g style={{ opacity: isRevealed ? 1 : 0, transition: "opacity 0.5s var(--ease-out) 160ms" }}>
                <title>
                  One claude -p call per item returns two independent verdicts plus a topic category. Keeping the axes
                  separate is empirical: they disagree on 333 of 2,028 items (16.4%) — any single relevance score would
                  misfile a sixth of the feed.
                </title>
                <rect
                  x={CLASSIFIER.box_x}
                  y={CLASSIFIER.box_y}
                  width={CLASSIFIER.box_w}
                  height={CLASSIFIER.box_h}
                  rx={12}
                  fill="var(--blue-50)"
                  stroke="var(--ink)"
                  strokeWidth={2}
                />
                <text
                  x={452}
                  y={CLASSIFIER.box_y + 20}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.12em" }}
                  fill="var(--ink-3)"
                >
                  ONE CLAUDE -P CALL PER ITEM
                </text>
                <text
                  x={452}
                  y={CLASSIFIER.box_y + 42}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800 }}
                  fill="var(--ink)"
                >
                  The two-axis judge
                </text>
                {/* Axis A row */}
                <rect
                  x={364}
                  y={148}
                  width={176}
                  height={52}
                  rx={8}
                  fill="var(--paper)"
                  stroke="var(--ink)"
                  strokeWidth={1.5}
                />
                <text
                  x={452}
                  y={166}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-display)", fontSize: 10.5, fontWeight: 800 }}
                  fill="var(--ink)"
                >
                  AXIS A — signal or noise?
                </text>
                <text
                  x={452}
                  y={180}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 8.5 }}
                  fill="var(--ink-2)"
                >
                  shorts bait · promo · platitudes
                </text>
                <text
                  x={452}
                  y={192}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 8.5 }}
                  fill="var(--ink-2)"
                >
                  hot takes with no claim
                </text>
                {/* Axis B row */}
                <rect
                  x={364}
                  y={206}
                  width={176}
                  height={52}
                  rx={8}
                  fill="var(--paper)"
                  stroke="var(--ink)"
                  strokeWidth={1.5}
                />
                <text
                  x={452}
                  y={224}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-display)", fontSize: 10.5, fontWeight: 800 }}
                  fill="var(--ink)"
                >
                  AXIS B — on-topic or off?
                </text>
                <text
                  x={452}
                  y={238}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 8.5 }}
                  fill="var(--ink-2)"
                >
                  off-topic ≠ bad — just not
                </text>
                <text
                  x={452}
                  y={250}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 8.5 }}
                  fill="var(--ink-2)"
                >
                  what I follow them for
                </text>
                <text
                  x={452}
                  y={274}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
                  fill="var(--ink-2)"
                >
                  + a topic category
                </text>
                {/* Why-two-axes strip */}
                <rect
                  x={364}
                  y={282}
                  width={176}
                  height={44}
                  rx={8}
                  fill="var(--sun-100)"
                  stroke="var(--ink)"
                  strokeWidth={1}
                />
                <text
                  x={452}
                  y={300}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-display)", fontSize: 10.5, fontWeight: 800 }}
                  fill="var(--ink)"
                >
                  AXES DISAGREE: 333 / 2,028
                </text>
                <text
                  x={452}
                  y={316}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 8.5 }}
                  fill="var(--ink-2)"
                >
                  16.4% — why one score fails
                </text>
              </g>

              {/* The ranker. */}
              <g style={{ opacity: isRevealed ? 1 : 0, transition: "opacity 0.5s var(--ease-out) 240ms" }}>
                <title>
                  Passing items are scored against each creator's own baseline (lib/rerank.py) — a small channel's
                  breakout beats a big channel's routine upload. The one drop at this stage is scoped: X only, top 8
                  kept, because an unbounded X feed drowns a digest in a way YouTube doesn't.
                </title>
                <rect
                  x={RANKER.box_x}
                  y={RANKER.box_y}
                  width={RANKER.box_w}
                  height={RANKER.box_h}
                  rx={12}
                  fill="var(--paper)"
                  stroke="var(--ink)"
                  strokeWidth={2}
                />
                <text
                  x={684}
                  y={118}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.12em" }}
                  fill="var(--ink-3)"
                >
                  RANK &amp; SCORE
                </text>
                <text
                  x={684}
                  y={140}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800 }}
                  fill="var(--ink)"
                >
                  Own-baseline rank
                </text>
                {RANKER_LINES.map((ranker_line, line_index) => (
                  <text
                    key={ranker_line}
                    x={684}
                    y={160 + line_index * 16}
                    textAnchor="middle"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
                    fill="var(--ink-2)"
                  >
                    {ranker_line}
                  </text>
                ))}
              </g>

              {/* The tier stack — band height ∝ share of items; nothing is dropped. */}
              <g style={{ opacity: isRevealed ? 1 : 0, transition: "opacity 0.5s var(--ease-out) 320ms" }}>
                <text
                  x={832}
                  y={292}
                  textAnchor="end"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.1em" }}
                  fill="var(--ink-3)"
                >
                  THE DIGEST
                </text>
                {TIER_BANDS.map((tier_band) => {
                  const band_center_y = tier_band.band_y + tier_band.band_h / 2;
                  return (
                    <g key={tier_band.band_key}>
                      <title>{tier_band.band_title}</title>
                      <rect
                        x={TIER_STACK.stack_x}
                        y={tier_band.band_y}
                        width={TIER_STACK.stack_w}
                        height={tier_band.band_h}
                        rx={6}
                        fill={tier_band.band_fill}
                        stroke="var(--ink)"
                        strokeWidth={1.5}
                      />
                      <text
                        x={720}
                        y={tier_band.band_sub ? band_center_y - 3 : band_center_y + 3.5}
                        textAnchor="middle"
                        style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, fontWeight: 700 }}
                        fill="var(--ink)"
                      >
                        {tier_band.band_label}
                      </text>
                      {tier_band.band_sub && (
                        <text
                          x={720}
                          y={band_center_y + 11}
                          textAnchor="middle"
                          style={{ fontFamily: "var(--font-mono)", fontSize: 8.5 }}
                          fill="var(--ink-2)"
                        >
                          {tier_band.band_sub}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* The invariant, stated where the diagram proves it. */}
              <g style={{ opacity: isRevealed ? 1 : 0, transition: "opacity 0.5s var(--ease-out) 400ms" }}>
                <title>
                  Enforced as a test in lib/density.py: len(assign_density_tiers(scored)) == len(scored). Things shrink,
                  they don't disappear.
                </title>
                <rect
                  x={608}
                  y={536}
                  width={224}
                  height={60}
                  rx={8}
                  fill="var(--sun-100)"
                  stroke="var(--ink)"
                  strokeWidth={1.5}
                />
                <text
                  x={720}
                  y={556}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-display)", fontSize: 10.5, fontWeight: 800 }}
                  fill="var(--ink)"
                >
                  RANK CONTROLS DENSITY,
                </text>
                <text
                  x={720}
                  y={570}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-display)", fontSize: 10.5, fontWeight: 800 }}
                  fill="var(--ink)"
                >
                  NEVER INCLUSION
                </text>
                <text
                  x={720}
                  y={586}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 8.5 }}
                  fill="var(--ink-2)"
                >
                  a test: output length = input length
                </text>
              </g>
            </svg>
          </div>
        </div>
      </Card>
    </div>
  );
}
