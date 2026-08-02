"use client";

import type React from "react";
import { useState } from "react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "style"> {
  /** Mono uppercase eyebrow label above the field. */
  label?: string;
  /** Muted helper text shown below the field. */
  hint?: string;
  /** Error text — overrides hint and paints the border red. */
  error?: string;
  /** Render a multi-line `<textarea>` instead of an `<input>`. */
  multiline?: boolean;
  style?: React.CSSProperties;
}

/**
 * Folio Pop text field: 14px-radius box with a 2px ink border that grows a
 * small pop shadow on focus. Errors repaint the border and helper text red.
 *
 * @example
 * <Input label="Email" placeholder="you@studio.com" />
 * <Input label="Message" multiline hint="Two lines is plenty." />
 */
export function Input({ label, hint, error, multiline = false, style, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  const field: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: 16,
    color: "var(--ink)",
    background: "var(--paper)",
    border: `2px solid ${error ? "var(--error)" : "var(--ink)"}`,
    borderRadius: "var(--radius-md)",
    padding: "12px 16px",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    boxShadow: focused ? "var(--shadow-pop-sm)" : "none",
    transition: "box-shadow var(--dur-fast)",
    resize: "vertical",
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-body)", ...style }}>
      {label && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.08em",
            fontWeight: 600,
            color: "var(--ink-2)",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      )}
      {multiline ? (
        <textarea
          style={field}
          rows={4}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...(rest as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input style={field} onFocus={handleFocus} onBlur={handleBlur} {...rest} />
      )}
      {(error || hint) && (
        <span style={{ fontSize: 13, color: error ? "var(--error)" : "var(--text-muted)" }}>{error || hint}</span>
      )}
    </label>
  );
}
