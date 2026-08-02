"use client";

import type React from "react";
import { useState } from "react";

export interface SkillChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  /** Optional proficiency 1–3, shown as filled dots. */
  level?: 1 | 2 | 3;
}

/**
 * A bordered skill pill that warms to sun-yellow on hover, with an optional
 * three-dot proficiency meter.
 *
 * @example
 * <SkillChip label="LLM evals" level={3} />
 */
export function SkillChip({ label, level, style, ...rest }: SkillChipProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: hovered ? "var(--sun-100)" : "var(--paper)",
        border: "2px solid var(--ink)",
        borderRadius: "var(--radius-pill)",
        padding: "8px 16px",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: 14,
        color: "var(--ink)",
        boxShadow: "var(--shadow-pop-sm)",
        transition: "background var(--dur-fast)",
        cursor: "default",
        ...style,
      }}
      {...rest}
    >
      {label}
      {level && (
        <span style={{ display: "inline-flex", gap: 3 }}>
          {[1, 2, 3].map((dot) => (
            <span
              key={dot}
              style={{
                width: 6,
                height: 6,
                borderRadius: 99,
                background: dot <= level ? "var(--orange-500)" : "var(--border-soft)",
              }}
            />
          ))}
        </span>
      )}
    </span>
  );
}
