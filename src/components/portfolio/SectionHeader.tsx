import type React from "react";

export interface SectionHeaderProps {
  /** Small mono eyebrow above the title (ALL-CAPS by convention). */
  eyebrow?: string;
  title: string;
  /** Optional trailing node, e.g. a "View all →" button. */
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Section title block: a mono orange eyebrow, a chunky display heading, and an
 * optional right-aligned action.
 *
 * @example
 * <SectionHeader eyebrow="SELECTED WORK" title="Things I've shipped" action={<Button size="sm">All</Button>} />
 */
export function SectionHeader({ eyebrow, title, action, style }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
        ...style,
      }}
    >
      <div>
        {eyebrow && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
              fontWeight: 600,
              color: "var(--orange-600)",
              marginBottom: 6,
            }}
          >
            {eyebrow}
          </div>
        )}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
