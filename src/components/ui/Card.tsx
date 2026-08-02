import type React from "react";

export type CardTint = "orange" | "blue" | "sun";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional tinted surface instead of white paper. */
  tint?: CardTint;
  /** Hard pop shadow (default) vs the soft passive shadow. */
  pop?: boolean;
  /** Inner padding in pixels. */
  padding?: number;
}

const TINTS: Record<CardTint, string> = {
  orange: "var(--surface-tint-orange)",
  blue: "var(--surface-tint-blue)",
  sun: "var(--surface-tint-sun)",
};

/**
 * The base surface: white (or tinted) panel with a 2px ink border and the
 * signature hard pop shadow. Set `pop={false}` for large passive surfaces.
 *
 * @example
 * <Card tint="orange" padding={32}>Selected work</Card>
 */
export function Card({ tint, pop = true, padding = 24, children, style, ...rest }: CardProps) {
  const background = tint ? TINTS[tint] : "var(--surface-card)";
  return (
    <div
      style={{
        background,
        border: "2px solid var(--ink)",
        borderRadius: "var(--radius-lg)",
        boxShadow: pop ? "var(--shadow-pop)" : "var(--shadow-soft)",
        padding,
        boxSizing: "border-box",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
