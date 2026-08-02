import type React from "react";
import { Badge } from "../ui/Badge";

export interface TimelineItemProps {
  /** Mono period label, e.g. "2023 — now". */
  period: string;
  /** Job title / role (named `roleTitle` to avoid the ARIA `role` attribute). */
  roleTitle: string;
  org: string;
  summary?: string;
  /** Fills the node orange and shows a "NOW" badge. */
  current?: boolean;
  /** Hides the connecting line for the last item. */
  last?: boolean;
  style?: React.CSSProperties;
}

/**
 * One row of the experience timeline: a node + connecting line on the left,
 * period / role / org / summary on the right.
 *
 * @example
 * <TimelineItem period="2023 — now" roleTitle="AI PM" org="Acme" current />
 */
export function TimelineItem({
  period,
  roleTitle,
  org,
  summary,
  current = false,
  last = false,
  style,
}: TimelineItemProps) {
  return (
    <div style={{ display: "flex", gap: 16, ...style }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none" }}>
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 99,
            border: "2px solid var(--ink)",
            background: current ? "var(--orange-500)" : "var(--paper)",
            flex: "none",
            marginTop: 4,
          }}
        />
        {!last && <span style={{ width: 2, flex: 1, background: "var(--ink)", opacity: 0.25, marginTop: 4 }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : 28 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "var(--ink-3)",
            }}
          >
            {period}
          </span>
          {current && <Badge tone="orange">NOW</Badge>}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--ink)",
            marginTop: 2,
          }}
        >
          {roleTitle} <span style={{ color: "var(--blue-700)" }}>· {org}</span>
        </div>
        {summary && (
          <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5, marginTop: 4, maxWidth: "52ch" }}>
            {summary}
          </div>
        )}
      </div>
    </div>
  );
}
