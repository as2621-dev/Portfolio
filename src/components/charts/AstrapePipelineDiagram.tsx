"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { useChartReveal } from "./useChartReveal";

/**
 * Chart for the Astrape project page: the shipped pipeline as an
 * animated workflow diagram, drawn from the actual source. Two flows share one
 * canvas — the data path (blue: Smart Meter Texas's daily CSV email → Gmail →
 * Apps Script pipeline → Google Sheet → Chart.js dashboard, plus Open-Meteo
 * weather) and the money check (orange: 4Change's bill-ready email → the Python
 * reconcile CLI → validates the same bill math the dashboard uses). The
 * Aprilaire thermostat leg renders as a dashed island because that is the
 * truth: read + write verified, never wired into the loop.
 *
 * Every box maps to real code: Gmail.gs / Weather.gs / Projection.gs /
 * Index.html in appsscript/, reconcile_4change_bill.py + bill/ and
 * thermostat/cloud_client.py in the repo. No LLM appears because none exists.
 *
 * Geometry is hand-placed on a 4px grid over an 880×656 viewBox and
 * collision-checked: connectors are straight or elbowed orthogonals, no two
 * share a path, attach points on any edge sit ≥40px apart. Re-check before
 * moving boxes.
 */

/* Same validated categorical pair as MarketplacePipelineDiagram. */
const FLOW_COLORS = { data: "#1B6FAE", verify: "#E8551F" } as const;

type FlowKind = keyof typeof FLOW_COLORS;

interface ActorBox {
  actor_key: string;
  box_x: number;
  box_y: number;
  box_w: number;
  box_h: number;
  box_fill: string;
  /** Dashed border = built and verified but not connected to anything. */
  is_dashed_border?: boolean;
  tag_text: string;
  actor_name: string;
  actor_lines: string[];
  actor_aside?: string;
  actor_title: string;
}

interface StepChip {
  chip_key: string;
  chip_y: number;
  chip_name: string;
  chip_lines: string[];
  chip_title: string;
}

interface FlowArrow {
  arrow_key: string;
  arrow_path: string;
  flow_kind: FlowKind;
  is_dashed?: boolean;
  /** Stagger position for the draw-in reveal, in flow order. */
  reveal_order: number;
  arrow_title: string;
}

/** Freestanding mono annotations beside arrows (not centered on a stroke). */
interface FlowAnnotation {
  note_key: string;
  note_x: number;
  note_y: number;
  note_text: string;
  flow_kind: FlowKind;
}

const ACTOR_BOXES: ActorBox[] = [
  {
    actor_key: "smt",
    box_x: 24,
    box_y: 64,
    box_w: 152,
    box_h: 112,
    box_fill: "var(--blue-50)",
    tag_text: "GRID DATA",
    actor_name: "Smart Meter Texas",
    actor_lines: ["15-min interval CSV", "emailed daily"],
    actor_title: "Smart Meter Texas — daily email with a 15-minute interval CSV attachment (96 rows = one service day)",
  },
  {
    actor_key: "fourchange",
    box_x: 24,
    box_y: 200,
    box_w: 152,
    box_h: 112,
    box_fill: "var(--blue-50)",
    tag_text: "RETAIL PROVIDER",
    actor_name: "4Change Energy",
    actor_lines: ["“bill’s ready” email:", "amount due + period"],
    actor_title:
      "4Change Energy — the transactional bill-ready email carries the charged amount and billing period; the portal is never scraped",
  },
  {
    actor_key: "gmail",
    box_x: 208,
    box_y: 64,
    box_w: 112,
    box_h: 248,
    box_fill: "var(--sun-100)",
    tag_text: "ONE INBOX",
    actor_name: "Gmail",
    actor_lines: ["both feeds", "arrive as", "plain email"],
    actor_title:
      "Gmail — the only ingestion surface: SMT CSVs and 4Change notices are read from the inbox, nothing is scraped",
  },
  {
    actor_key: "dashboard",
    box_x: 712,
    box_y: 96,
    box_w: 144,
    box_h: 152,
    box_fill: "var(--blue-50)",
    tag_text: "SHARED LINK",
    actor_name: "The dashboard",
    actor_lines: ["doGet → Index.html", "Chart.js line chart", "picker + ↻ refresh"],
    actor_title:
      "Index.html — Chart.js dashboard served by doGet to anyone with the link; a cycle picker per billing month, and a refresh button that runs the whole pipeline on demand",
  },
  {
    actor_key: "openmeteo",
    box_x: 712,
    box_y: 280,
    box_w: 144,
    box_h: 112,
    box_fill: "var(--blue-50)",
    tag_text: "WEATHER API",
    actor_name: "Open-Meteo",
    actor_lines: ["forecast + ERA5 archive", "free · no API key"],
    actor_title:
      "Open-Meteo — near-term daily forecast (≤16 days) plus ERA5 climatology normals beyond the horizon; ZIP resolved to coordinates via zippopotam.us; no API key anywhere",
  },
  {
    actor_key: "aprilaire",
    box_x: 712,
    box_y: 424,
    box_w: 144,
    box_h: 152,
    box_fill: "var(--paper)",
    is_dashed_border: true,
    tag_text: "SIDE QUEST",
    actor_name: "Aprilaire cloud",
    actor_lines: ["AWS Cognito auth", "REST + WebSocket", "read + write verified"],
    actor_aside: "never wired into the loop",
    actor_title:
      "thermostat/cloud_client.py — Aprilaire's aprilaire.io cloud via Cognito + REST + WebSocket; reading temps and writing the cool setpoint both verified live, but the automation was never connected to the projection",
  },
];

/* The Apps Script pipeline chips, top to bottom in runDailyUpdate() order. */
const CHIP_X = 376;
const CHIP_W = 280;
const CHIP_H = 88;

const STEP_CHIPS: StepChip[] = [
  {
    chip_key: "ingest",
    chip_y: 96,
    chip_name: "1 · Ingest — Gmail.gs",
    chip_lines: ["pull SMT CSVs from the inbox", "sum 96 intervals → daily kWh", "→ DailyUsage tab"],
    chip_title:
      "importUsageFromGmail — searches from:smartmetertexas.com, parses CSV attachments, keeps the latest revision per day, upserts daily totals",
  },
  {
    chip_key: "weather",
    chip_y: 216,
    chip_name: "2 · Weather — Weather.gs",
    chip_lines: ["Open-Meteo forecast ahead", "ERA5 climatology past 16 d", "→ Weather tab"],
    chip_title:
      "refreshWeather — stitches observed + forecast days from Open-Meteo, fills beyond the 16-day horizon with 5-year calendar-day climatology",
  },
  {
    chip_key: "project",
    chip_y: 336,
    chip_name: "3 · Project — Projection.gs",
    chip_lines: ["OLS kWh ≈ baseload + β·CDD65", "verdict vs the 1,000 kWh cliff", "→ Projection + Summary tabs"],
    chip_title:
      "computeProjection — OLS fit on days with both usage and weather (port of project_usage.py), trailing-7-day fallback when the fit is unreliable, verdict LIKELY CLEAR / CLOSE / AT RISK / MISS plus a projected bill in dollars",
  },
];

const FLOW_ARROWS: FlowArrow[] = [
  {
    arrow_key: "smt-gmail",
    arrow_path: "M176,120 H208",
    flow_kind: "data",
    reveal_order: 0,
    arrow_title: "SMT's daily interval CSV lands in the inbox",
  },
  {
    arrow_key: "gmail-ingest",
    arrow_path: "M320,140 H376",
    flow_kind: "data",
    reveal_order: 1,
    arrow_title: "Gmail.gs reads the CSV attachments on every pipeline run",
  },
  {
    arrow_key: "ingest-weather",
    arrow_path: "M516,184 V216",
    flow_kind: "data",
    reveal_order: 2,
    arrow_title: "runDailyUpdate: import, then weather",
  },
  {
    arrow_key: "openmeteo-weather",
    arrow_path: "M712,300 H656",
    flow_kind: "data",
    reveal_order: 3,
    arrow_title: "Weather.gs fetches forecast + climatology from Open-Meteo",
  },
  {
    arrow_key: "weather-project",
    arrow_path: "M516,304 V336",
    flow_kind: "data",
    reveal_order: 4,
    arrow_title: "runDailyUpdate: weather, then projection",
  },
  {
    arrow_key: "serve-dashboard",
    arrow_path: "M680,172 H712",
    flow_kind: "data",
    reveal_order: 5,
    arrow_title: "doGet serves Index.html; getDashboardData shapes any billing month's series on demand",
  },
  {
    arrow_key: "fourchange-gmail",
    arrow_path: "M176,256 H208",
    flow_kind: "verify",
    reveal_order: 6,
    arrow_title: "4Change's bill-ready notice lands in the same inbox",
  },
  {
    arrow_key: "gmail-reconcile",
    arrow_path: "M264,312 V584 H352",
    flow_kind: "verify",
    reveal_order: 7,
    arrow_title:
      "Both feeds leave Gmail over IMAP: reconcile_4change_bill.py pulls the bill notices; the SMT CSVs land in data/smt via fetch_smt_csv.py and are read from there",
  },
  {
    arrow_key: "reconcile-validates",
    arrow_path: "M516,548 V472",
    flow_kind: "verify",
    is_dashed: true,
    reveal_order: 8,
    arrow_title:
      "A 'match' validates the same bill math Projection.gs uses — $91.82 computed vs $91.65 billed on the 2026-05-13 bill",
  },
];

const FLOW_ANNOTATIONS: FlowAnnotation[] = [
  { note_key: "imap", note_x: 274, note_y: 504, note_text: "BILL + CSVS · IMAP", flow_kind: "verify" },
  { note_key: "match", note_x: 528, note_y: 504, note_text: "MATCHED TO $0.17", flow_kind: "verify" },
];

const LEGEND_ITEMS: { flow_kind: FlowKind | "island"; is_dashed?: boolean; legend_label: string }[] = [
  { flow_kind: "data", legend_label: "data path — time trigger every 4 h" },
  { flow_kind: "verify", legend_label: "money check — recompute vs the charged bill" },
  { flow_kind: "island", is_dashed: true, legend_label: "built + verified, never wired in" },
];

export function AstrapePipelineDiagram() {
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
            SMT email → Google Sheet → dashboard
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
            The pipeline, plus the money check
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
                    stroke={legend_item.flow_kind === "island" ? "var(--ink-3)" : FLOW_COLORS[legend_item.flow_kind]}
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
              viewBox="0 0 880 656"
              style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}
              role="img"
              aria-label="Workflow diagram of the Astrape pipeline. Data path, run by a time trigger every 4 hours: Smart Meter Texas emails a daily 15-minute interval CSV into Gmail; an Apps Script pipeline ingests it to daily kilowatt-hours, fetches Open-Meteo forecast plus ERA5 climatology, fits an ordinary-least-squares model of kilowatt-hours as baseload plus beta times cooling-degree-days, and writes a verdict against the 1,000 kilowatt-hour credit cliff into a Google Sheet; a Chart.js dashboard is served to anyone with the link. Money check, in Python: 4Change Energy's bill-ready email is pulled over IMAP, the bill is recomputed from metered usage and plan terms with a completeness gate, and a match within tolerance validates the same bill math — 17 cents off on a real bill. The Aprilaire thermostat cloud client, with read and write verified, sits disconnected: it was never wired into the loop."
            >
              <style>{`
                .ebs-pulse {
                  stroke-dasharray: 3 13;
                  animation: ebs-march 1.1s linear infinite;
                }
                .ebs-dash-flow {
                  animation: ebs-march-dash 1.1s linear infinite;
                }
                @keyframes ebs-march { to { stroke-dashoffset: -32; } }
                @keyframes ebs-march-dash { to { stroke-dashoffset: -22; } }
                @media (prefers-reduced-motion: reduce) {
                  .ebs-pulse { animation: none; opacity: 0; }
                  .ebs-dash-flow { animation: none; }
                }
              `}</style>
              <defs>
                <marker id="ebs-arrow-data" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <polygon points="0 0, 9 3.5, 0 7" fill={FLOW_COLORS.data} />
                </marker>
                <marker id="ebs-arrow-verify" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
                  <polygon points="0 0, 9 3.5, 0 7" fill={FLOW_COLORS.verify} />
                </marker>
              </defs>

              {/* Region 1: the shipped Apps Script product — drawn first so
                  arrows and chips sit on top. */}
              <rect
                x={352}
                y={32}
                width={328}
                height={440}
                rx={14}
                fill="var(--orange-50)"
                stroke="var(--orange-500)"
                strokeWidth={2}
              />
              <text
                x={368}
                y={60}
                style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800 }}
                fill="var(--orange-700)"
              >
                The shipped product
              </text>
              <text
                x={664}
                y={60}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em" }}
                fill="var(--ink-3)"
              >
                SHEET + APPS SCRIPT
              </text>
              <text
                x={368}
                y={78}
                style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.05em" }}
                fill="var(--ink-3)"
              >
                TIME TRIGGER EVERY 4 H · OR THE DASHBOARD ↻
              </text>
              <text
                x={516}
                y={444}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.06em" }}
                fill="var(--ink-3)"
              >
                STATE: ONE GOOGLE SHEET
              </text>
              <text
                x={516}
                y={458}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.02em" }}
                fill="var(--ink-3)"
              >
                CONFIG · CYCLES · DAILYUSAGE · WEATHER · PROJECTION · SUMMARY
              </text>

              {/* Region 2: the Python money check. */}
              <rect
                x={352}
                y={548}
                width={328}
                height={84}
                rx={14}
                fill="var(--blue-50)"
                stroke="var(--blue-700)"
                strokeWidth={2}
              />
              <text
                x={368}
                y={572}
                style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 800 }}
                fill="var(--blue-800)"
              >
                The money check — Python CLI
              </text>
              <text x={368} y={590} style={{ fontFamily: "var(--font-mono)", fontSize: 9 }} fill="var(--ink-2)">
                reconcile_4change_bill.py — recompute the bill from
              </text>
              <text x={368} y={604} style={{ fontFamily: "var(--font-mono)", fontSize: 9 }} fill="var(--ink-2)">
                metered kWh + plan terms, vs the emailed amount
              </text>
              <text x={368} y={618} style={{ fontFamily: "var(--font-mono)", fontSize: 9 }} fill="var(--ink-2)">
                tolerance max($1, 1.5%) · incomplete-usage gate
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
                      className={arrow.is_dashed ? "ebs-dash-flow" : undefined}
                      markerEnd={`url(#ebs-arrow-${arrow.flow_kind})`}
                    />
                    {/* Marching light dashes over the solid stroke = flow direction. */}
                    {!arrow.is_dashed && (
                      <path
                        d={arrow.arrow_path}
                        fill="none"
                        stroke="var(--paper)"
                        strokeWidth={2.25}
                        strokeLinecap="round"
                        opacity={0.85}
                        className="ebs-pulse"
                      />
                    )}
                  </g>
                );
              })}

              {/* Freestanding arrow annotations (offset, so no mask needed). */}
              {FLOW_ANNOTATIONS.map((note) => (
                <text
                  key={note.note_key}
                  x={note.note_x}
                  y={note.note_y}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    opacity: isRevealed ? 1 : 0,
                    transition: "opacity 0.5s var(--ease-out) 1000ms",
                  }}
                  fill={note.flow_kind === "verify" ? "var(--orange-700)" : "var(--blue-700)"}
                >
                  {note.note_text}
                </text>
              ))}

              {/* Actor boxes. */}
              {ACTOR_BOXES.map((actor) => {
                const center_x = actor.box_x + actor.box_w / 2;
                return (
                  <g
                    key={actor.actor_key}
                    style={{ opacity: isRevealed ? 1 : 0, transition: "opacity 0.5s var(--ease-out) 80ms" }}
                  >
                    <title>{actor.actor_title}</title>
                    <rect
                      x={actor.box_x}
                      y={actor.box_y}
                      width={actor.box_w}
                      height={actor.box_h}
                      rx={12}
                      fill={actor.box_fill}
                      stroke={actor.is_dashed_border ? "var(--ink-3)" : "var(--ink)"}
                      strokeWidth={2}
                      strokeDasharray={actor.is_dashed_border ? "7,5" : undefined}
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
                      style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800 }}
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
                        style={{ fontFamily: "var(--font-mono)", fontSize: 9.5 }}
                        fill="var(--ink-2)"
                      >
                        {actor_line}
                      </text>
                    ))}
                    {actor.actor_aside && (
                      <text
                        x={center_x}
                        y={actor.box_y + actor.box_h - 20}
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

              {/* Pipeline step chips inside region 1. */}
              {STEP_CHIPS.map((chip, chip_index) => {
                const center_x = CHIP_X + CHIP_W / 2;
                return (
                  <g
                    key={chip.chip_key}
                    style={{
                      opacity: isRevealed ? 1 : 0,
                      transition: `opacity 0.5s var(--ease-out) ${120 + chip_index * 90}ms`,
                    }}
                  >
                    <title>{chip.chip_title}</title>
                    <rect
                      x={CHIP_X}
                      y={chip.chip_y}
                      width={CHIP_W}
                      height={CHIP_H}
                      rx={8}
                      fill="var(--paper)"
                      stroke="var(--ink)"
                      strokeWidth={1.5}
                    />
                    <text
                      x={center_x}
                      y={chip.chip_y + 24}
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
                        y={chip.chip_y + 44 + line_index * 14}
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
