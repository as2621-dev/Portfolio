"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { useChartReveal } from "./useChartReveal";

/**
 * Chart for the blip project page: the content pipeline as an animated workflow
 * diagram, drawn from the News20 repo itself. Two flows share one canvas — the
 * daily batch (blue, fired by a Trigger.dev cron at 00:00 ET: GDELT/BigQuery →
 * ingest/match → rank/select → script/verify → produce → Supabase → the reel)
 * and the ask loop (orange, fired per question: reel → grounded Q&A → reel,
 * plus the Gemini Live voice path that deliberately bypasses the worker).
 * Flow direction is animated as a marching dash overlay; prefers-reduced-motion
 * freezes it.
 *
 * Every box, chip, and arrow corresponds to a named module in the project:
 * agents/ingestion/adapters/gdelt_bigquery.py (BigQuery GKG, ~273K articles/day
 * ≈ $0.004), agents/ingestion/interest_lexical.py + interest_semantic.py (the
 * two-key relevance lock), agents/pipeline/stages/ranking.py (the 0.5/0.45/0.2
 * weights), agents/pipeline/production_selection.py (select 30 pre-produce),
 * agents/pipeline/run_flags.py (the halt-by-default spend ladder),
 * agents/pipeline/stages/scripting.py + verification.py (claims vs source,
 * unsupported = halt), agents/voice/gemini_tts.py + stages/acoustic_alignment.py
 * + agents/m0/generate_posters.py (produce), agents/pipeline/persist.py
 * (Supabase write), agents/qa/ (grounded Q&A + answer re-verification),
 * agents/voice/live_token.py (Gemini Live ephemeral token), trigger/
 * dailyPipeline.ts (the cron).
 *
 * Geometry is hand-placed on a 4px grid over an 880×720 viewBox and
 * collision-checked: connectors are straight or elbowed orthogonals, no two
 * share a path, and attach points on any box edge sit ≥40px apart. Re-check
 * before moving boxes.
 */

/* Same validated categorical pair as MarketplacePipelineDiagram. */
const FLOW_COLORS = { batch: "#1B6FAE", ask: "#E8551F" } as const;
const FLOW_LABEL_COLORS = { batch: "var(--blue-700)", ask: "var(--orange-700)" } as const;

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
    actor_key: "gemini",
    box_x: 344,
    box_y: 8,
    box_w: 192,
    box_h: 136,
    box_fill: "var(--blue-50)",
    tag_text: "MODELS",
    actor_name: "Gemini API",
    actor_lines: ["3.5-flash · script + verify", "embedding-001 · matching", "2.5-flash TTS · 3-pro image"],
  },
  {
    actor_key: "gdelt",
    box_x: 32,
    box_y: 216,
    box_w: 160,
    box_h: 256,
    box_fill: "var(--blue-50)",
    tag_text: "SOURCE",
    actor_name: "GDELT",
    actor_lines: ["global news firehose", "BigQuery public GKG", "~273K articles/day", "DOC 2.0 for bodies"],
    actor_aside: "one query ≈ $0.004/day",
  },
  {
    actor_key: "supabase",
    box_x: 688,
    box_y: 216,
    box_w: 160,
    box_h: 256,
    box_fill: "var(--blue-50)",
    tag_text: "STORE",
    actor_name: "Supabase",
    actor_lines: ["Postgres + RLS", "pgvector story clusters", "digest-audio bucket", "story-posters bucket"],
    actor_aside: "clients read, worker writes",
  },
  {
    actor_key: "app",
    box_x: 328,
    box_y: 584,
    box_w: 224,
    box_h: 104,
    box_fill: "var(--sun-100)",
    tag_text: "CLIENT",
    actor_name: "blip on iOS",
    actor_lines: ["Capacitor + Next.js reel", "TestFlight · signed IPA"],
  },
];

/* Chips 1–3 are the batch lane (y=232); chips 4–5 are the lower lane (y=376). */
const STEP_CHIPS: StepChip[] = [
  {
    chip_key: "ingest",
    chip_x: 224,
    chip_y: 232,
    chip_w: 128,
    chip_name: "Ingest & match",
    chip_lines: ["one BigQuery query", "lexical anchor +", "embedding similarity"],
  },
  {
    chip_key: "rank",
    chip_x: 376,
    chip_y: 232,
    chip_w: 128,
    chip_name: "Rank & select 30",
    chip_lines: ["(Aff×Depth)·.5 +", "Imp·.45 + Fresh·.2", "pick 30 pre-produce"],
  },
  {
    chip_key: "verify",
    chip_x: 528,
    chip_y: 232,
    chip_w: 128,
    chip_name: "Script & verify",
    chip_lines: ["3.5-flash dialogue", "claims vs source —", "unsupported = HALT"],
  },
  {
    chip_key: "qa",
    chip_x: 224,
    chip_y: 376,
    chip_w: 144,
    chip_name: "Grounded Q&A",
    chip_lines: ["≤ ~6K-token corpus", "in-context, no RAG", "answer re-verified"],
  },
  {
    chip_key: "produce",
    chip_x: 496,
    chip_y: 376,
    chip_w: 160,
    chip_name: "Produce & persist",
    chip_lines: ["TTS + karaoke align", "poster per reel", "write to Supabase"],
  },
];

const CHIP_H = 96;

const FLOW_ARROWS: FlowArrow[] = [
  {
    arrow_key: "firehose",
    arrow_path: "M192,264 H224",
    flow_kind: "batch",
    reveal_order: 0,
    arrow_title: "One BigQuery query over the GDELT GKG pulls the day's candidates",
  },
  {
    arrow_key: "ingest-rank",
    arrow_path: "M352,280 H376",
    flow_kind: "batch",
    reveal_order: 1,
    arrow_title: "Stories that clear both relevance keys move to ranking",
  },
  {
    arrow_key: "rank-verify",
    arrow_path: "M504,280 H528",
    flow_kind: "batch",
    reveal_order: 2,
    arrow_title: "Each user's selected 30 move to scripting and verification",
  },
  {
    arrow_key: "verify-produce",
    arrow_path: "M592,328 V376",
    flow_kind: "batch",
    reveal_order: 3,
    arrow_title: "Only grounded scripts reach the paid produce stage",
  },
  {
    arrow_key: "persist",
    arrow_path: "M656,424 H688",
    flow_kind: "batch",
    reveal_order: 4,
    arrow_title: "Audio, posters, captions, and rows written to Supabase",
  },
  {
    arrow_key: "llm-calls",
    arrow_path: "M440,184 V144",
    flow_kind: "batch",
    is_dashed: true,
    arrow_label: "LLM CALLS",
    label_x: 440,
    label_y: 156,
    label_w: 60,
    reveal_order: 5,
    arrow_title: "All model calls — scripts, verification, embeddings, TTS, posters — go to the Gemini API",
  },
  {
    arrow_key: "feed-read",
    arrow_path: "M768,472 V616 H552",
    flow_kind: "batch",
    arrow_label: "DAILY FEED",
    label_x: 640,
    label_y: 609,
    label_w: 64,
    reveal_order: 6,
    arrow_title: "The reel reads the user's 30 allocated slots from Supabase",
  },
  {
    arrow_key: "ask",
    arrow_path: "M328,616 H240 V472",
    flow_kind: "ask",
    arrow_label: "ASK ANYTHING",
    label_x: 240,
    label_y: 532,
    label_w: 76,
    reveal_order: 7,
    arrow_title: "A question about a reel goes to the worker's grounded Q&A endpoint",
  },
  {
    arrow_key: "answer",
    arrow_path: "M304,472 V656 H328",
    flow_kind: "ask",
    arrow_label: "GROUNDED OR REFUSAL",
    label_x: 304,
    label_y: 556,
    label_w: 110,
    reveal_order: 8,
    arrow_title: "The answer comes back grounded, or as the designed refusal card",
  },
  {
    arrow_key: "voice",
    arrow_path: "M552,656 H864 V72 H536",
    flow_kind: "ask",
    is_dashed: true,
    arrow_label: "GEMINI LIVE VOICE",
    label_x: 708,
    label_y: 649,
    label_w: 100,
    reveal_order: 9,
    arrow_title:
      "Live voice opens a Gemini Live WebSocket straight from the device on a worker-minted ephemeral token — skipping the second verification pass for latency",
  },
];

const LEGEND_ITEMS: { flow_kind: FlowKind; is_dashed?: boolean; legend_label: string }[] = [
  { flow_kind: "batch", legend_label: "daily batch — cron at 00:00 ET, halt by default" },
  { flow_kind: "batch", is_dashed: true, legend_label: "model calls" },
  { flow_kind: "ask", legend_label: "ask loop — fired per question" },
  { flow_kind: "ask", is_dashed: true, legend_label: "voice — bypasses the worker" },
];

export function BlipPipelineDiagram() {
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
            GDELT → worker → Supabase → the reel
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
            How a day of news becomes 30 reels
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
              viewBox="0 0 880 720"
              style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}
              role="img"
              aria-label="Workflow diagram of the blip content pipeline. Daily batch, fired by a Trigger.dev cron at midnight Eastern: one BigQuery query over the public GDELT knowledge graph pulls roughly 273 thousand articles a day for about four tenths of a cent; stories must clear both a lexical phrase anchor and embedding similarity; every user-story pair is scored as affinity times depth-match times 0.5 plus importance times 0.45 plus freshness times 0.2, and each user's 30 are selected before anything is produced; Gemini 3.5 Flash writes the two-anchor script and every claim is verified against the source, with unsupported claims halting publication; text-to-speech, karaoke caption alignment, and a poster are produced per reel and persisted to Supabase, which the iOS reel reads as the daily feed. A spend ladder — shortlist by default, then scripts, then reels — must be armed rung by rung. Ask loop, fired per question: the reel sends a question to the worker's grounded Q&A, which answers in-context from a roughly six-thousand-token story corpus with no RAG, re-verifies the answer, and returns it grounded or as a designed refusal. Live voice opens a Gemini Live WebSocket directly from the device using a worker-minted ephemeral token, bypassing the worker's second verification pass."
            >
              <style>{`
                .bpd-pulse {
                  stroke-dasharray: 3 13;
                  animation: bpd-march 1.1s linear infinite;
                }
                .bpd-dash-flow {
                  animation: bpd-march-dash 1.1s linear infinite;
                }
                @keyframes bpd-march { to { stroke-dashoffset: -32; } }
                @keyframes bpd-march-dash { to { stroke-dashoffset: -22; } }
                @media (prefers-reduced-motion: reduce) {
                  .bpd-pulse { animation: none; opacity: 0; }
                  .bpd-dash-flow { animation: none; }
                }
              `}</style>
              <defs>
                <marker id="bpd-arrow-batch" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <polygon points="0 0, 9 3.5, 0 7" fill={FLOW_COLORS.batch} />
                </marker>
                <marker id="bpd-arrow-ask" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <polygon points="0 0, 9 3.5, 0 7" fill={FLOW_COLORS.ask} />
                </marker>
              </defs>

              {/* The worker region — drawn first so arrows and chips sit on top. */}
              <rect
                x={208}
                y={184}
                width={464}
                height={320}
                rx={14}
                fill="var(--orange-50)"
                stroke="var(--orange-500)"
                strokeWidth={2}
              />
              <text
                x={224}
                y={212}
                style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800 }}
                fill="var(--orange-700)"
              >
                The pipeline
              </text>
              <text
                x={656}
                y={212}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em" }}
                fill="var(--ink-3)"
              >
                PYTHON AGENTS · RAILWAY · CRON 00:00 ET
              </text>
              <text
                x={656}
                y={492}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: "0.05em" }}
                fill="var(--ink-3)"
              >
                SPEND LADDER: SHORTLIST (DEFAULT HALT) → SCRIPTS → REELS
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
                      className={arrow.is_dashed ? "bpd-dash-flow" : undefined}
                      markerEnd={`url(#bpd-arrow-${arrow.flow_kind})`}
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
                        className="bpd-pulse"
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

              {/* Pipeline step chips. */}
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
