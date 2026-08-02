"use client";

import type React from "react";
import { useState } from "react";

export type IconButtonVariant = "primary" | "secondary" | "outline";
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label — applied as both aria-label and title. */
  label: string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
}

type InteractionState = "idle" | "hover" | "active";

const DIMENSIONS: Record<IconButtonSize, number> = { sm: 36, md: 44, lg: 52 };

/**
 * Circular icon button matching the Folio Pop border + pop-shadow system.
 * Pass a single icon node (e.g. a lucide-react icon) as children.
 *
 * @example
 * <IconButton label="GitHub" variant="outline"><Github size={20} /></IconButton>
 */
export function IconButton({
  label,
  size = "md",
  variant = "outline",
  disabled = false,
  children,
  style,
  ...rest
}: IconButtonProps) {
  const [state, setState] = useState<InteractionState>("idle");
  const dimension = DIMENSIONS[size];
  const background =
    variant === "primary"
      ? "var(--action-primary)"
      : variant === "secondary"
        ? "var(--action-secondary)"
        : "var(--paper)";
  const color = variant === "outline" ? "var(--ink)" : "#fff";

  const computed: React.CSSProperties = {
    width: dimension,
    height: dimension,
    borderRadius: "var(--radius-pill)",
    border: "2px solid var(--ink)",
    background,
    color,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "var(--shadow-pop-sm)",
    transition: "transform var(--dur-fast) var(--ease-pop),box-shadow var(--dur-fast) var(--ease-pop)",
    ...(state === "hover" && !disabled ? { transform: "var(--lift)", boxShadow: "var(--shadow-pop)" } : {}),
    ...(state === "active" && !disabled ? { transform: "var(--press)", boxShadow: "none" } : {}),
    ...(disabled ? { opacity: 0.45, cursor: "not-allowed" } : {}),
    ...style,
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      style={computed}
      onMouseEnter={() => setState("hover")}
      onMouseLeave={() => setState("idle")}
      onMouseDown={() => setState("active")}
      onMouseUp={() => setState("hover")}
      {...rest}
    >
      {children}
    </button>
  );
}
