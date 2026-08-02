"use client";

import type React from "react";
import { useEffect, useState } from "react";

export interface MascotLogoProps {
  /** Rendered pixel size of the square badge. */
  size?: number;
  /** Show the 2px ink border + pop shadow frame (default true). Badge variant only. */
  framed?: boolean;
  /**
   * "badge" (default) — the original opaque video inside a dark rounded frame.
   * "cutout" — the chroma-keyed alpha video (square-cropped) floating directly
   * on the page background, no frame. Falls back to the alpha poster under
   * `prefers-reduced-motion`.
   */
  variant?: "badge" | "cutout";
  style?: React.CSSProperties;
}

/**
 * The animated brand mark: the explorer mascot (compass + torch) looping in a
 * dark rounded badge, or as a transparent cutout. The badge uses the original
 * opaque source (solid black background, edges disappear into the frame); the
 * cutout uses the keyed alpha assets (`logo-mascot-alpha.*`). Respects
 * `prefers-reduced-motion` by falling back to a static poster.
 *
 * @example
 * <MascotLogo size={44} />                    // header mark (dark badge)
 * <MascotLogo size={160} variant="cutout" />  // hero avatar on cream
 */
export function MascotLogo({ size = 48, framed = true, variant = "badge", style }: MascotLogoProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);
    const handleChange = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const isCutout = variant === "cutout";

  const frame: React.CSSProperties = isCutout
    ? { width: size, height: size, display: "block", flex: "none", ...style }
    : {
        width: size,
        height: size,
        borderRadius: size >= 72 ? "var(--radius-lg)" : "var(--radius-md)",
        overflow: "hidden",
        background: "#000",
        border: framed ? "2px solid var(--ink)" : "none",
        boxShadow: framed ? "var(--shadow-pop-sm)" : "none",
        display: "block",
        flex: "none",
        ...style,
      };

  const media: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", display: "block" };
  const poster = isCutout ? "/mascot/logo-poster-alpha.png" : "/mascot/logo-poster.png";

  if (reduceMotion) {
    return (
      <span style={frame} role="img" aria-label="Explorer mascot logo">
        <img src={poster} alt="" style={media} />
      </span>
    );
  }

  return (
    <span style={frame} role="img" aria-label="Explorer mascot logo">
      <video autoPlay loop muted playsInline poster={poster} style={media}>
        {isCutout ? (
          <>
            {/* HEVC-alpha first: Safari picks it up; Chrome/Firefox fall through to VP9 alpha. */}
            <source src="/mascot/logo-mascot-alpha.mov" type="video/quicktime" />
            <source src="/mascot/logo-mascot-alpha.webm" type="video/webm" />
          </>
        ) : (
          <>
            <source src="/mascot/logo-mascot.webm" type="video/webm" />
            <source src="/mascot/logo-mascot.mov" type="video/quicktime" />
          </>
        )}
      </video>
    </span>
  );
}
