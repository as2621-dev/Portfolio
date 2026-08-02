"use client";

import type React from "react";
import { useState } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual style. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  /** When set, the button renders as an anchor (`<a>`). */
  href?: string;
  /** Anchor-only: link target, e.g. "_blank". */
  target?: string;
  /** Anchor-only: rel attribute. */
  rel?: string;
  /** Button-only: native button type. */
  type?: "button" | "submit" | "reset";
}

const base: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  border: "2px solid var(--ink)",
  borderRadius: "var(--radius-pill)",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  transition:
    "transform var(--dur-fast) var(--ease-pop),box-shadow var(--dur-fast) var(--ease-pop),background var(--dur-fast)",
  boxShadow: "var(--shadow-pop)",
  textDecoration: "none",
  lineHeight: 1.2,
};

const variants: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: "var(--action-primary)", color: "var(--text-on-primary)" },
  secondary: { background: "var(--action-secondary)", color: "var(--text-on-primary)" },
  outline: { background: "var(--paper)", color: "var(--ink)" },
  ghost: { background: "transparent", color: "var(--ink)", border: "2px solid transparent", boxShadow: "none" },
};

const sizes: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "8px 16px", fontSize: 14 },
  md: { padding: "12px 22px", fontSize: 16 },
  lg: { padding: "16px 28px", fontSize: 18 },
};

type InteractionState = "idle" | "hover" | "active";

/**
 * Folio Pop pill button with the signature 2px ink border + hard-offset pop
 * shadow. Hover lifts and grows the shadow; press pushes it down. Renders an
 * `<a>` when `href` is provided, otherwise a `<button>`.
 *
 * @example
 * <Button variant="primary" size="lg" onClick={handleClick}>Say hi →</Button>
 * <Button variant="outline" href="/work">See the work</Button>
 */
export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  href,
  children,
  style,
  ...rest
}: ButtonProps) {
  const [state, setState] = useState<InteractionState>("idle");
  const isGhost = variant === "ghost";

  const computed: React.CSSProperties = {
    ...base,
    ...variants[variant],
    ...sizes[size],
    ...(state === "hover" && !disabled && !isGhost
      ? { transform: "var(--lift)", boxShadow: "var(--shadow-pop-lg)" }
      : {}),
    ...(state === "active" && !disabled && !isGhost
      ? { transform: "var(--press)", boxShadow: "var(--shadow-pop-sm)" }
      : {}),
    ...(state !== "idle" && isGhost ? { background: "var(--orange-50)" } : {}),
    ...(disabled ? { opacity: 0.45, cursor: "not-allowed", boxShadow: isGhost ? "none" : "var(--shadow-pop-sm)" } : {}),
    ...style,
  };

  const interaction = {
    onMouseEnter: () => setState("hover"),
    onMouseLeave: () => setState("idle"),
    onMouseDown: () => setState("active"),
    onMouseUp: () => setState("hover"),
  };

  const Tag = (href ? "a" : "button") as React.ElementType;

  return (
    <Tag href={href} disabled={href ? undefined : disabled} style={computed} {...rest} {...interaction}>
      {children}
    </Tag>
  );
}
