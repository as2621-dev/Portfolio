"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useChartReveal } from "./useChartReveal";

/**
 * Monthly self-serve revenue, computed from the verified transaction export
 * (`all customer data.xlsx`, pulled 2024-09-27 — research/quicsnap.md §A).
 * Shown through Apr 2024 — where the service chapter of the story ends and
 * the Shutter Labs pivot takes over.
 */
interface MonthlyRevenueEntry {
  month_label: string;
  revenue_usd: number;
  transaction_count: number;
}

const MONTHLY_REVENUE: MonthlyRevenueEntry[] = [
  { month_label: "May '23", revenue_usd: 3561.0, transaction_count: 8 },
  { month_label: "Jun '23", revenue_usd: 2999.7, transaction_count: 11 },
  { month_label: "Jul '23", revenue_usd: 5253.0, transaction_count: 24 },
  { month_label: "Aug '23", revenue_usd: 4044.8, transaction_count: 17 },
  { month_label: "Sep '23", revenue_usd: 1673.4, transaction_count: 15 },
  { month_label: "Oct '23", revenue_usd: 3444.01, transaction_count: 21 },
  { month_label: "Nov '23", revenue_usd: 3102.6, transaction_count: 19 },
  { month_label: "Dec '23", revenue_usd: 2926.7, transaction_count: 11 },
  { month_label: "Jan '24", revenue_usd: 3691.2, transaction_count: 27 },
  { month_label: "Feb '24", revenue_usd: 6263.8, transaction_count: 34 },
  { month_label: "Mar '24", revenue_usd: 4117.5, transaction_count: 22 },
  { month_label: "Apr '24", revenue_usd: 3432.02, transaction_count: 14 },
];

/* Palette validated with the dataviz six-checks script (single series → one hue). */
const BAR_COLOR = "#1B6FAE";

const PLOT = { width: 640, height: 280, top: 26, right: 12, bottom: 34, left: 46 };
const Y_MAX = 7000;
const FLAT_BAND = { low_usd: 2500, high_usd: 6300 };
/** Direct labels only on the extremes; the tooltip and table carry the rest. */
const DIRECT_LABEL_MONTHS = new Set(["Feb '24", "Sep '23"]);

function yFor(value_usd: number): number {
  const inner_height = PLOT.height - PLOT.top - PLOT.bottom;
  return PLOT.top + inner_height * (1 - value_usd / Y_MAX);
}

const USD_FORMAT = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/**
 * Chart slot 1 of the flagship case study: twelve months of self-serve
 * revenue in a flat $2.5K–$6.3K band — the demand-signal-and-margin-trap
 * picture in one figure. Column chart, single hue, band annotated.
 */
export function QuicsnapRevenueChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRevealed = useChartReveal(containerRef);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const inner_width = PLOT.width - PLOT.left - PLOT.right;
  const slot_width = inner_width / MONTHLY_REVENUE.length;
  const bar_width = Math.min(24, slot_width - 8);
  const baseline_y = yFor(0);
  const hovered = hoveredIndex === null ? null : MONTHLY_REVENUE[hoveredIndex];

  return (
    <Card padding={24}>
      <div ref={containerRef} style={{ position: "relative" }}>
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
          The service, month by month
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
          Twelve flat months
        </div>
        <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 2, marginBottom: 12 }}>
          Self-serve revenue by month, May 2023 – Apr 2024 (USD)
        </div>

        <svg
          viewBox={`0 0 ${PLOT.width} ${PLOT.height}`}
          style={{ width: "100%", height: "auto", display: "block" }}
          role="img"
          aria-label="Column chart of QuicSnap monthly self-serve revenue, May 2023 to April 2024. Revenue stays inside a flat band between $2,500 and $6,300 for twelve months, peaking at $6,264 in February 2024."
        >
          {/* Flat-band annotation behind everything */}
          <rect
            x={PLOT.left}
            y={yFor(FLAT_BAND.high_usd)}
            width={inner_width}
            height={yFor(FLAT_BAND.low_usd) - yFor(FLAT_BAND.high_usd)}
            fill={BAR_COLOR}
            opacity={0.08}
          />
          <text
            x={PLOT.left + 8}
            y={yFor(FLAT_BAND.high_usd) - 6}
            style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600 }}
            fill="var(--ink-3)"
          >
            the flat band — $2.5K–$6.3K, no breakout month
          </text>

          {/* Gridlines + y ticks (recessive) */}
          {[0, 2000, 4000, 6000].map((tick_usd) => (
            <g key={tick_usd}>
              <line
                x1={PLOT.left}
                x2={PLOT.width - PLOT.right}
                y1={yFor(tick_usd)}
                y2={yFor(tick_usd)}
                stroke="var(--border-soft)"
                strokeWidth={1}
              />
              <text
                x={PLOT.left - 8}
                y={yFor(tick_usd) + 3.5}
                textAnchor="end"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                fill="var(--ink-3)"
              >
                {tick_usd === 0 ? "0" : `$${tick_usd / 1000}K`}
              </text>
            </g>
          ))}

          {/* Columns — grow from the baseline on reveal */}
          {MONTHLY_REVENUE.map((entry, entry_index) => {
            const x = PLOT.left + slot_width * entry_index + (slot_width - bar_width) / 2;
            const bar_top = yFor(entry.revenue_usd);
            const is_hovered = hoveredIndex === entry_index;
            return (
              <g
                key={entry.month_label}
                onMouseEnter={() => setHoveredIndex(entry_index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Oversized invisible hit target (wider than the mark) */}
                <rect
                  x={PLOT.left + slot_width * entry_index}
                  y={PLOT.top}
                  width={slot_width}
                  height={baseline_y - PLOT.top}
                  fill="transparent"
                />
                <path
                  d={`M ${x} ${baseline_y}
                      L ${x} ${bar_top + 4}
                      Q ${x} ${bar_top} ${x + 4} ${bar_top}
                      L ${x + bar_width - 4} ${bar_top}
                      Q ${x + bar_width} ${bar_top} ${x + bar_width} ${bar_top + 4}
                      L ${x + bar_width} ${baseline_y} Z`}
                  fill={BAR_COLOR}
                  opacity={is_hovered ? 1 : 0.92}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "bottom",
                    transform: isRevealed ? "scaleY(1)" : "scaleY(0)",
                    transition: `transform 0.6s var(--ease-out) ${entry_index * 30}ms`,
                  }}
                />
                {DIRECT_LABEL_MONTHS.has(entry.month_label) && (
                  <text
                    x={x + bar_width / 2}
                    y={bar_top - 6}
                    textAnchor="middle"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600 }}
                    fill="var(--ink)"
                  >
                    {USD_FORMAT.format(entry.revenue_usd)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Baseline + sparse x ticks */}
          <line
            x1={PLOT.left}
            x2={PLOT.width - PLOT.right}
            y1={baseline_y}
            y2={baseline_y}
            stroke="var(--ink)"
            strokeWidth={1.5}
          />
          {MONTHLY_REVENUE.map((entry, entry_index) =>
            entry_index % 3 === 0 ? (
              <text
                key={`tick-${entry.month_label}`}
                x={PLOT.left + slot_width * entry_index + slot_width / 2}
                y={baseline_y + 16}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                fill="var(--ink-3)"
              >
                {entry.month_label}
              </text>
            ) : null,
          )}
        </svg>

        {/* Hover tooltip */}
        {hovered && hoveredIndex !== null && (
          <div
            style={{
              position: "absolute",
              left: `${((PLOT.left + slot_width * hoveredIndex + slot_width / 2) / PLOT.width) * 100}%`,
              bottom: 56,
              transform: "translateX(-50%)",
              background: "var(--ink)",
              color: "var(--cream)",
              borderRadius: 10,
              padding: "8px 12px",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              lineHeight: 1.5,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              boxShadow: "var(--shadow-soft)",
              zIndex: 2,
            }}
          >
            <strong>{hovered.month_label}</strong> · {USD_FORMAT.format(hovered.revenue_usd)} ·{" "}
            {hovered.transaction_count} txns
          </div>
        )}
      </div>
    </Card>
  );
}
