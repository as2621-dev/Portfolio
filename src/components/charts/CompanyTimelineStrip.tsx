"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { useChartReveal } from "./useChartReveal";

/**
 * Chart slot 2 of the flagship case study: an annotated 2022→2025 strip.
 * Company events run below the axis (blue); frontier-model releases run above
 * it (orange) — the visual argument is that the two lanes collide.
 *
 * Label rows and anchors are hand-placed and collision-checked at ~6.5px per
 * mono character on the 880px viewBox; a connector must not cross any label
 * span in the rows between the axis and its own row. Re-check before edits.
 * Dates verified 2026-08-02; the enterprise POC stays anonymized (firm rule).
 */
interface TimelineEvent {
  /** Position as a decimal year, e.g. Aug 2024 → 2024.58. */
  time_position: number;
  date_label: string;
  event_title: string;
  event_lane: "model" | "company";
  /** Stacked label row within the lane: 1 = nearest the axis. */
  label_row: 1 | 2 | 3 | 4;
  text_anchor?: "start" | "middle" | "end";
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    time_position: 2022.75,
    date_label: "Oct 2022",
    event_title: "QuicSnap launches — service era",
    event_lane: "company",
    label_row: 1,
    text_anchor: "start",
  },
  {
    time_position: 2024.42,
    date_label: "Jun 2024",
    event_title: "“AI alone is not possible”",
    event_lane: "company",
    label_row: 2,
  },
  { time_position: 2024.58, date_label: "Aug 1 2024", event_title: "Flux.1 ships", event_lane: "model", label_row: 1 },
  {
    time_position: 2024.67,
    date_label: "Sep 2024",
    event_title: "Cofounders join",
    event_lane: "company",
    label_row: 1,
  },
  {
    time_position: 2025.12,
    date_label: "Feb 2025",
    event_title: "Shutter Labs incorporated",
    event_lane: "company",
    label_row: 3,
    text_anchor: "end",
  },
  {
    time_position: 2025.35,
    date_label: "May 2025",
    event_title: "Furniture narrowing · YC app",
    event_lane: "company",
    label_row: 4,
  },
  {
    time_position: 2025.55,
    date_label: "Mid-2025",
    event_title: "Fortune 500 POC",
    event_lane: "company",
    label_row: 2,
    text_anchor: "start",
  },
  {
    time_position: 2025.65,
    date_label: "Aug 26 2025",
    event_title: "Nano Banana ships",
    event_lane: "model",
    label_row: 1,
  },
  {
    time_position: 2025.89,
    date_label: "Nov 20 2025",
    event_title: "Nano Banana Pro ships",
    event_lane: "model",
    label_row: 2,
    text_anchor: "end",
  },
  {
    time_position: 2025.93,
    date_label: "Nov 2025",
    event_title: "We stop",
    event_lane: "company",
    label_row: 1,
    text_anchor: "end",
  },
];

/* Two-series categorical pair, validated with the dataviz six-checks script. */
const LANE_COLORS = { model: "#E8551F", company: "#1B6FAE" } as const;

const STRIP = { width: 880, height: 300, left: 16, right: 16, axis_y: 140 };
const TIME_START = 2022.55;
const TIME_END = 2026.1;

/** Title-baseline y per lane and row (dates sit 12px above each title). */
const MODEL_ROW_Y: Record<number, number> = { 1: 98, 2: 56 };
const COMPANY_ROW_Y: Record<number, number> = { 1: 186, 2: 216, 3: 246, 4: 276 };

function xFor(time_position: number): number {
  const inner_width = STRIP.width - STRIP.left - STRIP.right;
  return STRIP.left + ((time_position - TIME_START) / (TIME_END - TIME_START)) * inner_width;
}

export function CompanyTimelineStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRevealed = useChartReveal(containerRef);

  return (
    /* Breakout: wider than the 680px article column so the right end of the
       strip (the punchline) is visible without horizontal scroll on desktop. */
    <div style={{ width: "min(92vw, 940px)", marginLeft: "calc(50% - min(46vw, 470px))" }}>
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
            2022 → 2025
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
            The company and the curve
          </div>

          {/* Legend — two series, identity never color-alone (labels ride every event) */}
          <div style={{ display: "flex", gap: 18, marginTop: 8, marginBottom: 4, flexWrap: "wrap" }}>
            {(
              [
                ["model", "model releases (above the line)"],
                ["company", "company events (below the line)"],
              ] as const
            ).map(([lane_key, lane_label]) => (
              <span
                key={lane_key}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--ink-2)",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 99,
                    background: LANE_COLORS[lane_key],
                    border: "2px solid var(--paper)",
                    boxShadow: "0 0 0 1px var(--border-soft)",
                  }}
                />
                {lane_label}
              </span>
            ))}
          </div>

          <div style={{ overflowX: "auto" }}>
            <svg
              viewBox={`0 0 ${STRIP.width} ${STRIP.height}`}
              style={{ width: "100%", minWidth: 860, height: "auto", display: "block" }}
              role="img"
              aria-label="Timeline from 2022 to 2025. Below the line: QuicSnap launches October 2022; the June 2024 executive summary states AI alone is not possible; technical cofounders join September 2024; Shutter Labs incorporates February 2025; furniture narrowing and YC application May 2025; a Fortune 500 retailer POC mid-2025; we stop November 2025. Above the line: Flux.1 ships August 1 2024, Nano Banana August 26 2025, Nano Banana Pro November 20 2025."
            >
              {/* Axis + year ticks */}
              <line
                x1={STRIP.left}
                x2={STRIP.width - STRIP.right}
                y1={STRIP.axis_y}
                y2={STRIP.axis_y}
                stroke="var(--ink)"
                strokeWidth={2}
              />
              {[2023, 2024, 2025].map((year) => (
                <g key={year}>
                  <line
                    x1={xFor(year)}
                    x2={xFor(year)}
                    y1={STRIP.axis_y - 5}
                    y2={STRIP.axis_y + 5}
                    stroke="var(--ink)"
                    strokeWidth={1.5}
                  />
                  <text
                    x={xFor(year)}
                    y={STRIP.axis_y + 20}
                    textAnchor="middle"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}
                    fill="var(--ink-3)"
                  >
                    {year}
                  </text>
                </g>
              ))}

              {TIMELINE_EVENTS.map((event, event_index) => {
                const x = xFor(event.time_position);
                const is_above = event.event_lane === "model";
                const title_y = is_above ? MODEL_ROW_Y[event.label_row] : COMPANY_ROW_Y[event.label_row];
                const date_y = title_y - 12;
                const connector_end = is_above ? title_y + 6 : date_y - 10;
                const color = LANE_COLORS[event.event_lane];
                return (
                  <g
                    key={event.event_title}
                    style={{
                      opacity: isRevealed ? 1 : 0,
                      transition: `opacity 0.5s var(--ease-out) ${120 + event_index * 70}ms`,
                    }}
                  >
                    <title>{`${event.date_label} — ${event.event_title}`}</title>
                    <line
                      x1={x}
                      x2={x}
                      y1={STRIP.axis_y}
                      y2={connector_end}
                      stroke={color}
                      strokeWidth={1.5}
                      opacity={0.45}
                    />
                    {/* Marker with a surface ring so overlaps stay legible */}
                    <circle cx={x} cy={STRIP.axis_y} r={6.5} fill="var(--paper)" />
                    <circle cx={x} cy={STRIP.axis_y} r={4.5} fill={color} />
                    <text
                      x={x}
                      y={date_y}
                      textAnchor={event.text_anchor ?? "middle"}
                      style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600 }}
                      fill="var(--ink-3)"
                    >
                      {event.date_label}
                    </text>
                    <text
                      x={x}
                      y={title_y}
                      textAnchor={event.text_anchor ?? "middle"}
                      style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600 }}
                      fill="var(--ink)"
                    >
                      {event.event_title}
                    </text>
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
