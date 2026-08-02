"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { useChartReveal } from "./useChartReveal";

/**
 * JobFairy's browser-agent bake-off: one live Greenhouse application, one run
 * per provider, every cost input persisted to the database. Numbers verbatim
 * from the verification doc; the caption discipline ("this run vs this run,
 * not a rate") lives in the article copy beside this chart.
 */
interface ProviderRun {
  provider_name: string;
  cost_usd: number;
  cost_display: string;
  duration_seconds: number;
  duration_display: string;
  run_outcome: "succeeded" | "failed";
  outcome_detail: string;
  provider_color: string;
}

/* Two-series categorical pair, validated with the dataviz six-checks script. */
const PROVIDER_RUNS: ProviderRun[] = [
  {
    provider_name: "Browser Use",
    cost_usd: 1.1356,
    cost_display: "$1.1356",
    duration_seconds: 284.4,
    duration_display: "4m 44s",
    run_outcome: "failed",
    outcome_detail: "hit the 60-step cap · resume never attached",
    provider_color: "#E8551F",
  },
  {
    provider_name: "Browserbase + Stagehand",
    cost_usd: 0.0196,
    cost_display: "$0.0196",
    duration_seconds: 9.3,
    duration_display: "9.3s",
    run_outcome: "succeeded",
    outcome_detail: "resume attached in 1 tool call",
    provider_color: "#1B6FAE",
  },
];

interface MetricRow {
  metric_label: string;
  value_of: (run: ProviderRun) => number;
  display_of: (run: ProviderRun) => string;
}

/** Each metric row carries its own scale — never a shared or dual axis. */
const METRIC_ROWS: MetricRow[] = [
  { metric_label: "Cost per task (USD)", value_of: (run) => run.cost_usd, display_of: (run) => run.cost_display },
  { metric_label: "Duration", value_of: (run) => run.duration_seconds, display_of: (run) => run.duration_display },
];

export function BakeoffComparisonChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRevealed = useChartReveal(containerRef);

  return (
    <Card padding={24}>
      <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
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
            One live ATS application · one run per provider
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
            The bake-off, as billed
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {PROVIDER_RUNS.map((run) => (
            <span
              key={run.provider_name}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--ink-2)",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 3, background: run.provider_color }} />
              {run.provider_name}
            </span>
          ))}
        </div>

        {METRIC_ROWS.map((metric) => {
          const row_max = Math.max(...PROVIDER_RUNS.map(metric.value_of));
          return (
            <div key={metric.metric_label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11.5,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                }}
              >
                {metric.metric_label}
              </div>
              {PROVIDER_RUNS.map((run) => {
                const share = metric.value_of(run) / row_max;
                return (
                  <div
                    key={run.provider_name}
                    title={`${run.provider_name} — ${metric.display_of(run)}`}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div style={{ flex: 1, position: "relative", height: 18 }}>
                      <div
                        style={{
                          position: "absolute",
                          inset: "0 0 0 0",
                          width: isRevealed ? `${Math.max(share * 100, 0.8)}%` : "0%",
                          minWidth: isRevealed ? 4 : 0,
                          background: run.provider_color,
                          borderRadius: "0 4px 4px 0",
                          transition: "width 0.7s var(--ease-out) 150ms, min-width 0.7s var(--ease-out) 150ms",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        flex: "none",
                        width: 76,
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--ink)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {metric.display_of(run)}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Outcome — status is never color-alone: icon + words */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            Outcome
          </div>
          {PROVIDER_RUNS.map((run) => (
            <div key={run.provider_name} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-2)", minWidth: 180 }}>
                {run.provider_name}
              </span>
              <span
                style={{
                  background: run.run_outcome === "succeeded" ? "var(--mint-100)" : "var(--coral-100)",
                  color: run.run_outcome === "succeeded" ? "#116b4c" : "var(--error)",
                  border: "1.5px solid var(--ink)",
                  borderRadius: "var(--radius-pill)",
                  padding: "2px 10px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11.5,
                  fontWeight: 600,
                }}
              >
                {run.run_outcome === "succeeded" ? "✓ succeeded" : "✕ failed"}
              </span>
              <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{run.outcome_detail}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
