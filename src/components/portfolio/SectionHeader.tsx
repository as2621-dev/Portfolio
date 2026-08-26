import type React from "react";

export interface SectionHeaderProps {
  /**
   * Ash (2026-08-12): orange eyebrow kickers are retired site-wide. The prop is
   * still accepted so call sites keep their labels in source, but it never renders.
   */
  eyebrow?: string;
  title: string;
  /** Optional trailing node, e.g. a "View all →" button. */
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Section title block: a chunky display heading and an optional right-aligned
 * action.
 *
 * @example
 * <SectionHeader title="Things I've shipped" action={<Button size="sm">All</Button>} />
 */
export function SectionHeader({ title, action, style }: SectionHeaderProps) {
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
