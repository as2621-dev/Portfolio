import type React from "react";

export type BadgeTone = "orange" | "blue" | "sun" | "mint" | "ink";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

/** [background, text] color pairs per tone. */
const TONES: Record<BadgeTone, [string, string]> = {
  orange: ["var(--orange-100)", "var(--orange-700)"],
  blue: ["var(--blue-100)", "var(--blue-800)"],
  sun: ["var(--sun-100)", "#8a5e00"],
  mint: ["var(--mint-100)", "#116b4c"],
  ink: ["var(--ink)", "#fff"],
};

/**
 * Small mono pill label with a 2px ink border. Great for tags, status, and
 * the "NOW" marker on the timeline.
 *
 * @example
 * <Badge tone="mint">Shipped</Badge>
 */
export function Badge({ tone = "orange", children, style, ...rest }: BadgeProps) {
  const [background, color] = TONES[tone];
  return (
    <span
      style={{
        background,
        color,
        border: "2px solid var(--ink)",
        borderRadius: "var(--radius-pill)",
        padding: "3px 12px",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        lineHeight: 1.6,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
