"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { useChartReveal } from "./useChartReveal";

/**
 * Chart for the JobFairy project page: the real pipeline as an animated
 * workflow diagram, verified against the JobFairy source tree. Two flows share
 * one canvas — the data pipeline (blue: DOL LCA ingest via `src/lib/sourcing/`,
 * TheirStack job ingest via `src/lib/job-ingest/`, both persisting to Supabase)
 * and the per-job pipeline (orange: research agents in `src/lib/research/`,
 * DOCX tailoring in `src/lib/resume/` + `src/trigger/tailor-resume-docx-task.ts`,
 * the fill run in `src/lib/fill-runs/`, and Gmail confirmation matching in
 * `src/lib/apply/` + `src/trigger/confirmation-matching-task.ts`).
 * The fill run lands on a generic ATS box (owner request 2026-08-12: JobFairy
 * applies across many ATS vendors, so no single vendor is named and the
 * provider-level browser-agent detail stays out of the diagram).
 * The dashed arrow is the corroboration rule: a fill run's success writes only
 * `awaiting`; a matched confirmation email promotes to `applied`.
 *
 * Geometry is hand-placed on a 4px grid over an 880×836 viewBox and
 * collision-checked: connectors are straight or single-elbow orthogonals,
 * no two share a path, and attach points on any box edge sit ≥40px apart.
 * Re-check before moving boxes.
 */

/* Same validated categorical pair as MarketplacePipelineDiagram. */
const FLOW_COLORS = { data: "#1B6FAE", perjob: "#E8551F" } as const;
const FLOW_LABEL_COLORS = { data: "var(--blue-700)", perjob: "var(--orange-700)" } as const;

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
    actor_key: "dol",
    box_x: 32,
    box_y: 88,
    box_w: 160,
    box_h: 136,
    box_fill: "var(--blue-50)",
    tag_text: "GOVT FILINGS",
    actor_name: "US DOL · OFLC",
    actor_lines: ["LCA disclosure files", "bulk .xlsx downloads", "2,630,454 filings"],
  },
  {
    actor_key: "theirstack",
    box_x: 32,
    box_y: 240,
    box_w: 160,
    box_h: 112,
    box_fill: "var(--blue-50)",
    tag_text: "JOBS API",
    actor_name: "TheirStack",
    actor_lines: ["POST /v1/jobs/search", "28,723-domain roster"],
  },
  {
    actor_key: "supabase",
    box_x: 688,
    box_y: 88,
    box_w: 160,
    box_h: 296,
    box_fill: "var(--blue-50)",
    tag_text: "DATA · AUTH · FILES",
    actor_name: "Supabase",
    actor_lines: ["Postgres · Auth · Storage", "companies · postings", "research bullets", "fill runs · artifacts"],
    actor_aside: "every stage persists here",
  },
  {
    actor_key: "gmail",
    box_x: 224,
    box_y: 656,
    box_w: 160,
    box_h: 144,
    box_fill: "var(--blue-50)",
    tag_text: "CORROBORATION",
    actor_name: "Gmail API",
    actor_lines: ["OAuth inbox read", "poll every 15 min"],
  },
  {
    actor_key: "ats",
    box_x: 456,
    box_y: 656,
    box_w: 200,
    box_h: 144,
    box_fill: "var(--sun-100)",
    tag_text: "LIVE ATS",
    actor_name: "ATS",
    actor_lines: ["Workday · Greenhouse ·", "Lever · more vendors"],
    actor_aside: "the real application form",
  },
];

/* Rows 1–2 are the data lane; rows 3–4 snake the per-job lane L→R then R→L. */
const STEP_CHIPS: StepChip[] = [
  {
    chip_key: "ingest",
    chip_x: 224,
    chip_y: 104,
    chip_w: 200,
    chip_name: "Ingest & qualify",
    chip_lines: ["FY files → SAX parse", "≥5 filings across 3 FYs", "tech SOC codes (15-12xx)"],
  },
  {
    chip_key: "pull",
    chip_x: 224,
    chip_y: 224,
    chip_w: 200,
    chip_name: "Pull jobs",
    chip_lines: ["daily 06:00 cron + button", "paced blurred queries", "dedupe + upsert postings"],
  },
  {
    chip_key: "research",
    chip_x: 224,
    chip_y: 368,
    chip_w: 200,
    chip_name: "Research — 3 agents",
    chip_lines: ["ideal → gemini-3.5-flash", "company + interview → sonar-pro", "verifier gates every bullet"],
  },
  {
    chip_key: "tailor",
    chip_x: 456,
    chip_y: 368,
    chip_w: 200,
    chip_name: "Tailor resume",
    chip_lines: ["reword set + fabrication guard", "python-docx run-level edits", "tailored .docx artifact"],
  },
  {
    chip_key: "fill",
    chip_x: 456,
    chip_y: 504,
    chip_w: 200,
    chip_name: "Fill run",
    chip_lines: ["startFillRun(posting, provider)", "Trigger.dev fill task", "cost + replay persisted"],
  },
  {
    chip_key: "confirm",
    chip_x: 224,
    chip_y: 504,
    chip_w: 200,
    chip_name: "Confirm",
    chip_lines: ["fill success ⇒ awaiting only", "matched email ⇒ applied", "agent never self-certifies"],
  },
];

const CHIP_H = 96;

const FLOW_ARROWS: FlowArrow[] = [
  {
    arrow_key: "dol-ingest",
    arrow_path: "M192,152 H224",
    flow_kind: "data",
    reveal_order: 0,
    arrow_title: "DOL LCA disclosure files pulled into the sourcing ingest",
  },
  {
    arrow_key: "ingest-supabase",
    arrow_path: "M424,152 H688",
    flow_kind: "data",
    arrow_label: "31,926 COMPANIES",
    label_x: 556,
    label_y: 130,
    label_w: 100,
    reveal_order: 1,
    arrow_title: "Qualified sponsor companies written to Supabase",
  },
  {
    arrow_key: "theirstack-pull",
    arrow_path: "M192,272 H224",
    flow_kind: "data",
    reveal_order: 2,
    arrow_title: "TheirStack job search results pulled by the ingest task",
  },
  {
    arrow_key: "pull-supabase",
    arrow_path: "M424,272 H688",
    flow_kind: "data",
    arrow_label: "LIVE POSTINGS",
    label_x: 556,
    label_y: 250,
    label_w: 84,
    reveal_order: 3,
    arrow_title: "Deduped postings upserted to Supabase",
  },
  {
    arrow_key: "posting-research",
    arrow_path: "M688,352 H324 V368",
    flow_kind: "perjob",
    arrow_label: "NEXT PENDING JOB",
    label_x: 520,
    label_y: 332,
    label_w: 108,
    reveal_order: 4,
    arrow_title: "A pending posting enters the per-job pipeline",
  },
  {
    arrow_key: "research-tailor",
    arrow_path: "M424,416 H456",
    flow_kind: "perjob",
    reveal_order: 5,
    arrow_title: "Verified research feeds the resume tailoring pane",
  },
  {
    arrow_key: "tailor-fill",
    arrow_path: "M556,464 V504",
    flow_kind: "perjob",
    reveal_order: 6,
    arrow_title: "The tailored DOCX artifact is what the fill run attaches",
  },
  {
    arrow_key: "fill-confirm",
    arrow_path: "M456,552 H424",
    flow_kind: "perjob",
    reveal_order: 7,
    arrow_title: "A succeeded fill run moves the application to awaiting",
  },
  {
    arrow_key: "fill-ats",
    arrow_path: "M556,600 V656",
    flow_kind: "perjob",
    arrow_label: "FILLS THE LIVE FORM",
    label_x: 556,
    label_y: 620,
    label_w: 120,
    reveal_order: 8,
    arrow_title: "The fill run's browser agent fills the live ATS application form",
  },
  {
    arrow_key: "gmail-confirm",
    arrow_path: "M304,656 V600",
    flow_kind: "perjob",
    is_dashed: true,
    reveal_order: 9,
    arrow_title: "A matched confirmation email promotes awaiting to applied",
  },
];

const LEGEND_ITEMS: { flow_kind: FlowKind; is_dashed?: boolean; legend_label: string }[] = [
  { flow_kind: "data", legend_label: "data pipeline — builds the sponsor-company + job asset" },
  { flow_kind: "perjob", legend_label: "per-job pipeline — one run per application" },
  { flow_kind: "perjob", is_dashed: true, legend_label: "email corroboration — no agent self-certification" },
];

export function JobFairyPipelineDiagram() {
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
            DOL filings → 31,926 companies → one run per job
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
            How JobFairy runs, end to end
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
              viewBox="0 0 880 836"
              style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}
              role="img"
              aria-label="Workflow diagram of the JobFairy pipeline. Data pipeline: the sourcing ingest downloads US Department of Labor LCA disclosure files, parses 2,630,454 filings, qualifies companies on at least five filings across three fiscal years in tech SOC codes, and writes 31,926 sponsor companies to Supabase; a daily TheirStack ingest sweeps a 28,723-domain roster and upserts deduped live postings. Per-job pipeline, one run per application: three research agents run in parallel — an ideal-candidate profiler plus company and interview intel — with a verifier agent gating every bullet before it persists; resume tailoring generates a fact-anchored reword set and applies it with python-docx run-level edits; the fill run launches a Trigger.dev task whose browser agent fills the live ATS application form — Workday, Greenhouse, Lever, and other vendors — persisting cost and replay; a succeeded fill only moves the application to awaiting — a Gmail poll every 15 minutes must match a confirmation email to promote it to applied."
            >
              <style>{`
                .jfp-pulse {
                  stroke-dasharray: 3 13;
                  animation: jfp-march 1.1s linear infinite;
                }
                .jfp-dash-flow {
                  animation: jfp-march-dash 1.1s linear infinite;
                }
                @keyframes jfp-march { to { stroke-dashoffset: -32; } }
                @keyframes jfp-march-dash { to { stroke-dashoffset: -22; } }
                @media (prefers-reduced-motion: reduce) {
                  .jfp-pulse { animation: none; opacity: 0; }
                  .jfp-dash-flow { animation: none; }
                }
              `}</style>
              <defs>
                <marker id="jfp-arrow-data" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <polygon points="0 0, 9 3.5, 0 7" fill={FLOW_COLORS.data} />
                </marker>
                <marker id="jfp-arrow-perjob" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <polygon points="0 0, 9 3.5, 0 7" fill={FLOW_COLORS.perjob} />
                </marker>
              </defs>

              {/* The platform region — drawn first so arrows and chips sit on top. */}
              <rect
                x={208}
                y={56}
                width={464}
                height={568}
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
                JobFairy
              </text>
              <text
                x={656}
                y={84}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em" }}
                fill="var(--ink-3)"
              >
                NEXT.JS 15 · TS STRICT · RAILWAY · TRIGGER.DEV
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
                      className={arrow.is_dashed ? "jfp-dash-flow" : undefined}
                      markerEnd={`url(#jfp-arrow-${arrow.flow_kind})`}
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
                        className="jfp-pulse"
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
                        y={actor.box_y + actor.box_h - 24}
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
