"use client";

import type React from "react";
import { useState } from "react";
import { Badge } from "../ui/Badge";

export interface ProjectCardProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "media"> {
  title: string;
  description?: string;
  /** Rendered as blue badges in the footer. */
  tags?: string[];
  /** Optional headline stat, e.g. "6×". */
  stat?: string;
  /** Small label after the stat, e.g. "faster evals". */
  statLabel?: string;
  /** Optional media node for the 16:9 slot (image / GIF / demo). */
  media?: React.ReactNode;
}

/**
 * A project tile with a 16:9 media slot, description, tag badges, and an
 * optional highlighted stat. Lifts on hover like every Folio Pop surface.
 *
 * @example
 * <ProjectCard title="Eval harness" description="Cut review time." tags={["LLM"]} stat="6×" statLabel="faster" href="/work/evals" />
 */
export function ProjectCard({
  title,
  description,
  tags = [],
  stat,
  statLabel,
  media,
  href = "#",
  style,
  ...rest
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--paper)",
        border: "2px solid var(--ink)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        textDecoration: "none",
        color: "var(--ink)",
        boxShadow: hovered ? "var(--shadow-pop-lg)" : "var(--shadow-pop)",
        transform: hovered ? "var(--lift)" : "none",
        transition: "transform var(--dur-fast) var(--ease-pop),box-shadow var(--dur-fast) var(--ease-pop)",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          aspectRatio: "16/9",
          background: "var(--blue-100)",
          borderBottom: "2px solid var(--ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {media || (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" }}>
            media slot — GIF / image / demo
          </span>
        )}
      </div>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20 }}>{title}</div>
        {description && (
          <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5, flex: 1 }}>{description}</div>
        )}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {tags.map((tag) => (
            <Badge key={tag} tone="blue">
              {tag}
            </Badge>
          ))}
          {stat && (
            <span
              style={{
                marginLeft: "auto",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                color: "var(--orange-600)",
              }}
            >
              {stat}
              <span style={{ fontSize: 11, color: "var(--ink-3)", marginLeft: 4 }}>{statLabel}</span>
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
