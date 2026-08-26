"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { useChartReveal } from "./useChartReveal";

/**
 * Chart for the flagship case study's GTM section: the QuicSnap outbound
 * machine as a Z-flow pipeline — Apollo (prospecting) → Perplexity
 * (per-brand personalization) → Instantly.ai + Waalaxy (sequencing &
 * delivery) → the prospect's inbox — sitting on top of the deliverability
 * engine (50+ warmed domains, 3 inboxes each, warmup run through Instantly).
 * Numbers are founder-supplied; Apollo & Waalaxy are corroborated by the
 * May 2025 task board — the figure chips stay [FOUNDER]-tagged in the
 * article caption.
 *
 * Geometry is hand-placed over a 640×534 viewBox sized to sit inside the
 * 680px article column (no breakout) at full label size: two stage rows of
 * two boxes joined by an orthogonal Z-connector, engine region underneath.
 * Straight orthogonal connectors, marching-dash flow overlay,
 * prefers-reduced-motion freezes it.
 */

const FLOW_COLOR = "#E8551F";

interface StageBox {
  stage_key: string;
  box_x: number;
  box_y: number;
  box_fill: string;
  tag_text: string;
  stage_name: string;
  stage_lines: string[];
  stage_aside?: string;
}

const STAGE_W = 270;
const STAGE_H = 140;
const ROW_1_Y = 12;
const ROW_2_Y = 224;

const STAGE_BOXES: StageBox[] = [
  {
    stage_key: "apollo",
    box_x: 20,
    box_y: ROW_1_Y,
    box_fill: "var(--blue-50)",
    tag_text: "PROSPECTING",
    stage_name: "Apollo",
    stage_lines: ["verified emails of", "ecommerce brand operators"],
  },
  {
    stage_key: "perplexity",
    box_x: 350,
    box_y: ROW_1_Y,
    box_fill: "var(--paper)",
    tag_text: "PERSONALIZATION",
    stage_name: "Perplexity",
    stage_lines: ["research each brand; every", "email opens with something", "true about their products"],
  },
  {
    stage_key: "sequencing",
    box_x: 20,
    box_y: ROW_2_Y,
    box_fill: "var(--paper)",
    tag_text: "SEQUENCING",
    stage_name: "Instantly + Waalaxy",
    stage_lines: ["email sequences + LinkedIn", "touches, delivery & follow-ups"],
  },
  {
    stage_key: "inbox",
    box_x: 350,
    box_y: ROW_2_Y,
    box_fill: "var(--sun-100)",
    tag_text: "THE TARGET",
    stage_name: "Prospect's inbox",
    stage_lines: ["clients across the", "US, EU & Middle East"],
    stage_aside: "not the spam folder",
  },
];

const FLOW_ARROWS = [
  // Apollo → Perplexity, straight across row 1.
  { arrow_key: "apollo-perplexity", arrow_path: "M290,82 H350", reveal_order: 0 },
  // Perplexity → Instantly + Waalaxy: orthogonal Z-drop to row 2.
  { arrow_key: "perplexity-sequencing", arrow_path: "M485,152 V188 H155 V224", reveal_order: 1 },
  // Instantly + Waalaxy → inbox, straight across row 2.
  { arrow_key: "sequencing-inbox", arrow_path: "M290,294 H350", reveal_order: 2 },
] as const;

const INFRA_CHIPS: string[][] = [
  ["50+ sending domains"],
  ["3 inboxes per domain"],
  ["warmed & rotated,", "tracked daily"],
];

const ENGINE_Y = 404;
const CHIP_Y = 466;
const CHIP_W = 180;
const CHIP_H = 44;

export function GtmOutboundDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRevealed = useChartReveal(containerRef);

  return (
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
          Apollo → Perplexity → Instantly + Waalaxy
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
          The outbound machine, end to end
        </div>

        <div style={{ overflowX: "auto" }}>
          <svg
            viewBox="0 0 640 534"
            style={{ width: "100%", minWidth: 560, height: "auto", display: "block", marginTop: 8 }}
            role="img"
            aria-label="Pipeline diagram of the QuicSnap outbound machine. Apollo pulls verified emails of ecommerce brand operators. Perplexity researches each brand so every email opens with something true and specific about their products. Instantly.ai and Waalaxy run the email sequences and LinkedIn touches. The result lands in the prospect's inbox, not the spam folder. Underneath sits the deliverability engine: over fifty sending domains with three inboxes each, warmed and rotated through Instantly to keep the deliverability score high, tracked daily as the guardrail metric."
          >
            <style>{`
              .gtm-pulse {
                stroke-dasharray: 3 13;
                animation: gtm-march 1.1s linear infinite;
              }
              @keyframes gtm-march { to { stroke-dashoffset: -32; } }
              @media (prefers-reduced-motion: reduce) {
                .gtm-pulse { animation: none; opacity: 0; }
              }
            `}</style>
            <defs>
              <marker id="gtm-arrow" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
                <polygon points="0 0, 9 3.5, 0 7" fill={FLOW_COLOR} />
              </marker>
            </defs>

            {/* Deliverability engine region — drawn first so the riser tucks under. */}
            <g style={{ opacity: isRevealed ? 1 : 0, transition: "opacity 0.5s var(--ease-out) 600ms" }}>
              <title>The deliverability engine — inbox placement treated as an engineering problem</title>
              {/* Riser from the engine into the sequencing stage. */}
              <path
                d={`M155,${ENGINE_Y} V${ROW_2_Y + STAGE_H}`}
                fill="none"
                stroke={FLOW_COLOR}
                strokeWidth={2.25}
                strokeDasharray="6,5"
                markerEnd="url(#gtm-arrow)"
              />
              <rect
                x={20}
                y={ENGINE_Y}
                width={600}
                height={118}
                rx={14}
                fill="var(--orange-50)"
                stroke="var(--orange-500)"
                strokeWidth={2}
              />
              <text
                x={40}
                y={ENGINE_Y + 28}
                style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800 }}
                fill="var(--orange-700)"
              >
                The deliverability engine
              </text>
              <text
                x={40}
                y={ENGINE_Y + 48}
                style={{ fontFamily: "var(--font-body)", fontSize: 11.5, fontStyle: "italic" }}
                fill="var(--ink-3)"
              >
                inbox placement was the guardrail metric — run through Instantly to keep the score high
              </text>
              {INFRA_CHIPS.map((chip_lines, chip_index) => (
                <g key={chip_lines.join(" ")}>
                  <rect
                    x={35 + chip_index * (CHIP_W + 15)}
                    y={CHIP_Y}
                    width={CHIP_W}
                    height={CHIP_H}
                    rx={8}
                    fill="var(--paper)"
                    stroke="var(--ink)"
                    strokeWidth={1.5}
                  />
                  {chip_lines.map((chip_line, line_index) => (
                    <text
                      key={chip_line}
                      x={35 + chip_index * (CHIP_W + 15) + CHIP_W / 2}
                      y={chip_lines.length > 1 ? CHIP_Y + 19 + line_index * 14 : CHIP_Y + 26}
                      textAnchor="middle"
                      style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600 }}
                      fill="var(--ink)"
                    >
                      {chip_line}
                    </text>
                  ))}
                </g>
              ))}
            </g>

            {/* Flow arrows — before boxes, so strokes tuck under borders. */}
            {FLOW_ARROWS.map((arrow) => (
              <g
                key={arrow.arrow_key}
                style={{
                  opacity: isRevealed ? 1 : 0,
                  transition: `opacity 0.5s var(--ease-out) ${200 + arrow.reveal_order * 110}ms`,
                }}
              >
                <path
                  d={arrow.arrow_path}
                  fill="none"
                  stroke={FLOW_COLOR}
                  strokeWidth={2.25}
                  markerEnd="url(#gtm-arrow)"
                />
                <path
                  d={arrow.arrow_path}
                  fill="none"
                  stroke="var(--paper)"
                  strokeWidth={2.25}
                  strokeLinecap="round"
                  opacity={0.85}
                  className="gtm-pulse"
                />
              </g>
            ))}

            {/* Stage boxes. */}
            {STAGE_BOXES.map((stage, stage_index) => {
              const center_x = stage.box_x + STAGE_W / 2;
              return (
                <g
                  key={stage.stage_key}
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transition: `opacity 0.5s var(--ease-out) ${80 + stage_index * 90}ms`,
                  }}
                >
                  <title>{`${stage.stage_name} — ${stage.stage_lines.join(" ")}`}</title>
                  <rect
                    x={stage.box_x}
                    y={stage.box_y}
                    width={STAGE_W}
                    height={STAGE_H}
                    rx={12}
                    fill={stage.box_fill}
                    stroke="var(--ink)"
                    strokeWidth={2}
                  />
                  <text
                    x={center_x}
                    y={stage.box_y + 26}
                    textAnchor="middle"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.12em" }}
                    fill="var(--ink-3)"
                  >
                    {stage.tag_text}
                  </text>
                  <text
                    x={center_x}
                    y={stage.box_y + 52}
                    textAnchor="middle"
                    style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800 }}
                    fill="var(--ink)"
                  >
                    {stage.stage_name}
                  </text>
                  {stage.stage_lines.map((stage_line, line_index) => (
                    <text
                      key={stage_line}
                      x={center_x}
                      y={stage.box_y + 74 + line_index * 15}
                      textAnchor="middle"
                      style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                      fill="var(--ink-2)"
                    >
                      {stage_line}
                    </text>
                  ))}
                  {stage.stage_aside && (
                    <text
                      x={center_x}
                      y={stage.box_y + STAGE_H - 16}
                      textAnchor="middle"
                      style={{ fontFamily: "var(--font-body)", fontSize: 11.5, fontStyle: "italic" }}
                      fill="var(--ink-3)"
                    >
                      {stage.stage_aside}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </Card>
  );
}
