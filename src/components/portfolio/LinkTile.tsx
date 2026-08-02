"use client";

import type React from "react";
import { useState } from "react";

export type LinkTileTint = "orange" | "blue" | "sun";

export interface LinkTileProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Primary label (2–5 words, sentence case). */
  title: string;
  /** Optional muted sub-label. */
  meta?: string;
  /** Optional leading emoji (used when no `icon` node is supplied). */
  emoji?: string;
  /** Optional leading icon node (e.g. a lucide-react icon). Wins over `emoji`. */
  icon?: React.ReactNode;
  /** Optional tinted surface. */
  tint?: LinkTileTint;
}

type InteractionState = "idle" | "hover" | "active";

const TINTS: Record<LinkTileTint, string> = {
  orange: "var(--surface-tint-orange)",
  blue: "var(--surface-tint-blue)",
  sun: "var(--surface-tint-sun)",
};

/**
 * The core Linktree-style row: a tappable bordered tile that lifts on hover and
 * nudges its trailing arrow. This is the product's primary object.
 *
 * @example
 * <LinkTile title="Read the case study" meta="6× faster evals" href="/case" tint="orange" />
 */
export function LinkTile({ title, meta, emoji, icon, href = "#", tint, style, ...rest }: LinkTileProps) {
  const [state, setState] = useState<InteractionState>("idle");
  const background = tint ? TINTS[tint] : "var(--paper)";

  return (
    <a
      href={href}
      onMouseEnter={() => setState("hover")}
      onMouseLeave={() => setState("idle")}
      onMouseDown={() => setState("active")}
      onMouseUp={() => setState("hover")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background,
        border: "2px solid var(--ink)",
        borderRadius: "var(--radius-lg)",
        padding: "16px 20px",
        textDecoration: "none",
        color: "var(--ink)",
        boxShadow:
          state === "hover"
            ? "var(--shadow-pop-lg)"
            : state === "active"
              ? "var(--shadow-pop-sm)"
              : "var(--shadow-pop)",
        transform: state === "hover" ? "var(--lift)" : state === "active" ? "var(--press)" : "none",
        transition: "transform var(--dur-fast) var(--ease-pop),box-shadow var(--dur-fast) var(--ease-pop)",
        ...style,
      }}
      {...rest}
    >
      {(icon || emoji) && (
        <span
          style={{
            width: 40,
            height: 40,
            flex: "none",
            borderRadius: 12,
            border: "2px solid var(--ink)",
            background: "var(--paper)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          {icon || emoji}
        </span>
      )}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>
          {title}
        </span>
        {meta && <span style={{ display: "block", fontSize: 13, color: "var(--ink-3)" }}>{meta}</span>}
      </span>
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 18,
          transform: state === "hover" ? "translateX(3px)" : "none",
          transition: "transform var(--dur-fast) var(--ease-pop)",
        }}
      >
        →
      </span>
    </a>
  );
}
