"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { useChartReveal } from "./useChartReveal";

/**
 * Chart for the Canvas case study: one generation, end to end, drawn from the
 * shipped source. Two flows share one canvas — the generation lane (orange:
 * browser → POST /api/generate → Trigger.dev tasks → Gemini / fal.ai, output
 * written to Supabase Storage) and the planning & search lane (blue: plan-chat,
 * enhance, and search route handlers calling Gemini and Serper/Firecrawl
 * inline). Dashed orange is the job lifecycle: row reservation, status polling,
 * and the cron sweeper. Flow direction is animated as a marching dash overlay;
 * prefers-reduced-motion freezes it.
 *
 * Every box, chip, and arrow is verified against the Canvas repo:
 * route files under canvas/src/app/api/, task ids in canvas/src/trigger/
 * (generate-image, generate-image-batch, generate-image-fal, generate-video,
 * sweep-stale-generations with cron star-slash-5), model ids in
 * canvas/src/lib/services/ (gemini-service, fal-image/video-service,
 * search-service), pricing in canvas/src/lib/pricing.ts, and the plan-mode
 * eval → repair → retry loop in canvas/src/lib/planning/eval.ts.
 *
 * Geometry is hand-placed on a 4px grid over an 880×748 viewBox and
 * collision-checked: connectors are straight or elbowed orthogonals, no two
 * share a path, and attach points on any box edge sit ≥40px apart.
 * Re-check before moving boxes.
 */

/* Same validated categorical pair as MarketplacePipelineDiagram. */
const FLOW_COLORS = { generation: "#E8551F", planning: "#1B6FAE" } as const;
const FLOW_LABEL_COLORS = { generation: "var(--orange-700)", planning: "var(--blue-700)" } as const;

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
  chip_h: number;
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
    actor_key: "browser",
    box_x: 32,
    box_y: 104,
    box_w: 148,
    box_h: 372,
    box_fill: "var(--sun-100)",
    tag_text: "CLIENT",
    actor_name: "The browser",
    actor_lines: ["project tree", "3 parallel workspaces", "planning panel"],
    actor_aside: "price on the button",
  },
  {
    actor_key: "serper",
    box_x: 716,
    box_y: 96,
    box_w: 136,
    box_h: 112,
    box_fill: "var(--blue-50)",
    tag_text: "SEARCH APIS",
    actor_name: "Serper.dev",
    actor_lines: ["google images API", "+ Firecrawl scrape"],
  },
  {
    actor_key: "gemini",
    box_x: 716,
    box_y: 248,
    box_w: 136,
    box_h: 168,
    box_fill: "var(--blue-50)",
    tag_text: "PROVIDER",
    actor_name: "Gemini API",
    actor_lines: ["nano banana 2 / pro", "text · 2.5 pro / flash"],
    actor_aside: "your key, billed direct",
  },
  {
    actor_key: "fal",
    box_x: 716,
    box_y: 456,
    box_w: 136,
    box_h: 120,
    box_fill: "var(--blue-50)",
    tag_text: "PROVIDER",
    actor_name: "fal.ai",
    actor_lines: ["gpt-image-2 (image)", "seedance · kling 3", "grok imagine (video)"],
  },
  {
    actor_key: "supabase",
    box_x: 212,
    box_y: 644,
    box_w: 480,
    box_h: 88,
    box_fill: "var(--blue-50)",
    tag_text: "DATA",
    actor_name: "Supabase",
    actor_lines: ["Postgres · Auth · Storage (generated- / uploaded- / reference-images)"],
  },
];

const STEP_CHIPS: StepChip[] = [
  {
    chip_key: "search-route",
    chip_x: 228,
    chip_y: 104,
    chip_w: 220,
    chip_h: 96,
    chip_name: "/api/search",
    chip_lines: ["Serper images query", "agentic: Firecrawl scrape", "LRU cache · 5 min TTL"],
  },
  {
    chip_key: "plan-route",
    chip_x: 228,
    chip_y: 244,
    chip_w: 220,
    chip_h: 96,
    chip_name: "/api/plan-chat · /api/enhance",
    chip_lines: ["plan & ask · gemini-2.5-pro", "enhance · gemini-2.5-flash", "eval → repair → retry"],
  },
  {
    chip_key: "generate-route",
    chip_x: 228,
    chip_y: 380,
    chip_w: 220,
    chip_h: 96,
    chip_name: "POST /api/generate",
    chip_lines: ["price via lib/pricing.ts", "reserve row as queued", "fire task · client polls"],
  },
  {
    chip_key: "generation-tasks",
    chip_x: 512,
    chip_y: 388,
    chip_w: 164,
    chip_h: 112,
    chip_name: "4 generation tasks",
    chip_lines: ["generate-image / -batch", "-fal / -video", "output → generated-images"],
  },
  {
    chip_key: "sweeper-task",
    chip_x: 540,
    chip_y: 524,
    chip_w: 136,
    chip_h: 64,
    chip_name: "stale-row sweeper",
    chip_lines: ["cron */5 · fails zombies"],
  },
];

const FLOW_ARROWS: FlowArrow[] = [
  {
    arrow_key: "prompt-submit",
    arrow_path: "M180,412 H228",
    flow_kind: "generation",
    reveal_order: 0,
    arrow_title: "Cmd+Enter — the workspace submits the prompt to POST /api/generate",
  },
  {
    arrow_key: "reserve-row",
    arrow_path: "M300,476 V644",
    flow_kind: "generation",
    is_dashed: true,
    arrow_label: "RESERVE ROW",
    label_x: 300,
    label_y: 552,
    label_w: 76,
    reveal_order: 1,
    arrow_title: "The route reserves a queued generation row in Postgres before any provider call",
  },
  {
    arrow_key: "fire-task",
    arrow_path: "M448,412 H512",
    flow_kind: "generation",
    reveal_order: 2,
    arrow_title: "The route fires a Trigger.dev task and returns — generation is a background job",
  },
  {
    arrow_key: "task-gemini",
    arrow_path: "M676,404 H696 Q704,404 704,396 V388 Q704,380 712,380 H716",
    flow_kind: "generation",
    reveal_order: 3,
    arrow_title:
      "generate-image and generate-image-batch call Gemini (gemini-3.1-flash-image-preview / gemini-3-pro-image-preview)",
  },
  {
    arrow_key: "task-fal",
    arrow_path: "M676,452 H700 Q708,452 708,460 V494 Q708,502 716,502",
    flow_kind: "generation",
    reveal_order: 4,
    arrow_title: "generate-image-fal and generate-video call fal.ai (gpt-image-2, seedance, kling 3, grok imagine)",
  },
  {
    arrow_key: "task-upload",
    arrow_path: "M524,500 V644",
    flow_kind: "generation",
    arrow_label: "UPLOAD",
    label_x: 500,
    label_y: 620,
    label_w: 48,
    reveal_order: 5,
    arrow_title: "The task uploads the output to the generated-images bucket and finalises the row",
  },
  {
    arrow_key: "status-poll",
    arrow_path: "M228,456 H180",
    flow_kind: "generation",
    is_dashed: true,
    arrow_label: "POLL",
    label_x: 204,
    label_y: 464,
    label_w: 36,
    reveal_order: 6,
    arrow_title: "The client polls GET /api/generate/[generation_id]/status — it never holds job state itself",
  },
  {
    arrow_key: "cron-sweep",
    arrow_path: "M608,588 V644",
    flow_kind: "generation",
    is_dashed: true,
    arrow_label: "CRON */5",
    label_x: 608,
    label_y: 616,
    label_w: 56,
    reveal_order: 7,
    arrow_title: "sweep-stale-generations runs every 5 minutes and fails rows whose job died hard",
  },
  {
    arrow_key: "plan-submit",
    arrow_path: "M180,280 H228",
    flow_kind: "planning",
    reveal_order: 8,
    arrow_title: "Plan, Ask, and prompt-enhance requests from the planning panel and composer",
  },
  {
    arrow_key: "plan-gemini",
    arrow_path: "M448,280 H716",
    flow_kind: "planning",
    reveal_order: 9,
    arrow_title: "Plan-chat and enhance call Gemini text models inline; plan replies pass an eval and repair loop",
  },
  {
    arrow_key: "search-submit",
    arrow_path: "M180,144 H228",
    flow_kind: "planning",
    reveal_order: 10,
    arrow_title: "Search mode queries from the planning panel",
  },
  {
    arrow_key: "search-serper",
    arrow_path: "M448,144 H716",
    flow_kind: "planning",
    reveal_order: 11,
    arrow_title: "The search route calls Serper.dev Google Images, plus Firecrawl scraping in agentic mode",
  },
];

const LEGEND_ITEMS: { flow_kind: FlowKind; is_dashed?: boolean; legend_label: string }[] = [
  { flow_kind: "generation", legend_label: "generation lane — queued in Postgres, run by Trigger.dev" },
  { flow_kind: "planning", legend_label: "planning & search lane — inline from route handlers" },
  { flow_kind: "generation", is_dashed: true, legend_label: "job lifecycle — reserve · poll · sweep" },
];

export function CanvasArchitectureDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRevealed = useChartReveal(containerRef);

  return (
    /* Sits inside the article column like every other block; the SVG scales
       down to the column width. */
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
            Browser → Next.js → Trigger.dev → providers
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
            One generation, end to end
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
            {/* Below ~560px the 9–10px SVG labels stop being legible, so
                narrower screens scroll instead of shrinking further. */}
            <svg
              viewBox="0 0 880 748"
              style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}
              role="img"
              aria-label="Workflow diagram of one Canvas generation, end to end. Generation lane: the browser submits a prompt to POST /api/generate, which prices the run from lib/pricing.ts, reserves a queued row in Supabase Postgres, and fires one of four Trigger.dev tasks — generate-image, generate-image-batch, generate-image-fal, or generate-video. Image tasks call the Gemini API, fal tasks call fal.ai, and the finished output is uploaded to the generated-images bucket in Supabase Storage while the client polls the status route. A scheduled sweeper task runs every five minutes and fails rows whose job died without reporting. Planning and search lane: the planning panel calls /api/plan-chat and /api/enhance, which run Gemini text models inline with an eval-and-repair loop on plan replies, and /api/search, which calls Serper.dev Google Images with Firecrawl scraping in agentic mode, cached in an LRU."
            >
              <style>{`
                .cad-pulse {
                  stroke-dasharray: 3 13;
                  animation: cad-march 1.1s linear infinite;
                }
                .cad-dash-flow {
                  animation: cad-march-dash 1.1s linear infinite;
                }
                @keyframes cad-march { to { stroke-dashoffset: -32; } }
                @keyframes cad-march-dash { to { stroke-dashoffset: -22; } }
                @media (prefers-reduced-motion: reduce) {
                  .cad-pulse { animation: none; opacity: 0; }
                  .cad-dash-flow { animation: none; }
                }
              `}</style>
              <defs>
                <marker id="cad-arrow-generation" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <polygon points="0 0, 9 3.5, 0 7" fill={FLOW_COLORS.generation} />
                </marker>
                <marker id="cad-arrow-planning" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <polygon points="0 0, 9 3.5, 0 7" fill={FLOW_COLORS.planning} />
                </marker>
              </defs>

              {/* Regions — drawn first so arrows and chips sit on top. */}
              <rect
                x={212}
                y={56}
                width={252}
                height={452}
                rx={14}
                fill="var(--orange-50)"
                stroke="var(--orange-500)"
                strokeWidth={2}
              />
              <text
                x={228}
                y={84}
                style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800 }}
                fill="var(--orange-700)"
              >
                Next.js route handlers
              </text>
              <text
                x={448}
                y={498}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.06em" }}
                fill="var(--ink-3)"
              >
                SRC/APP/API
              </text>

              <rect
                x={496}
                y={340}
                width={196}
                height={272}
                rx={14}
                fill="var(--blue-50)"
                stroke="var(--blue-500)"
                strokeWidth={2}
              />
              <text
                x={512}
                y={368}
                style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800 }}
                fill="var(--blue-800)"
              >
                Trigger.dev worker
              </text>
              <text
                x={676}
                y={604}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.06em" }}
                fill="var(--ink-3)"
              >
                SRC/TRIGGER · NPM RUN TRIGGER:DEV
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
                      className={arrow.is_dashed ? "cad-dash-flow" : undefined}
                      markerEnd={`url(#cad-arrow-${arrow.flow_kind})`}
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
                        className="cad-pulse"
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

              {/* Route and task chips. */}
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
                      height={chip.chip_h}
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
