"use client";

import type React from "react";
import { useState } from "react";
import { getPmSkill } from "@/content/journey";

export interface SkillPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Registry id from PM_SKILLS in src/content/journey.ts. */
  skill_id: string;
  /** "md" = the legend buttons in the skills section; "sm" = tags on blocks. */
  pill_size?: "md" | "sm";
}

/**
 * A colored skill pill tied to the PM skill registry — the same color follows
 * a skill everywhere it appears, from the skills legend down to the venture
 * blocks and product tiles that earned it.
 *
 * @example
 * <SkillPill skill_id="evals" />
 * <SkillPill skill_id="gtm" pill_size="sm" />
 */
export function SkillPill({ skill_id, pill_size = "md", style, ...rest }: SkillPillProps) {
  const [hovered, setHovered] = useState(false);
  const skill = getPmSkill(skill_id);
  const is_small = pill_size === "sm";

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: skill.skill_background,
        color: skill.skill_text,
        border: is_small ? "1.5px solid var(--ink)" : "2px solid var(--ink)",
        borderRadius: "var(--radius-pill)",
        padding: is_small ? "2px 10px" : "5px 13px",
        fontFamily: is_small ? "var(--font-mono)" : "var(--font-display)",
        fontWeight: is_small ? 600 : 700,
        fontSize: is_small ? 11 : 13.5,
        letterSpacing: is_small ? "0.02em" : undefined,
        lineHeight: 1.6,
        whiteSpace: "nowrap",
        boxShadow: is_small ? "none" : hovered ? "var(--shadow-pop)" : "var(--shadow-pop-sm)",
        transform: !is_small && hovered ? "var(--lift)" : "none",
        transition: "transform var(--dur-fast) var(--ease-pop),box-shadow var(--dur-fast) var(--ease-pop)",
        cursor: "default",
        ...style,
      }}
      {...rest}
    >
      {skill.skill_label}
    </span>
  );
}
