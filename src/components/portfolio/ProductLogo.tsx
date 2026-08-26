import type React from "react";

export type ProductLogoId = "canvas" | "orbit" | "blip" | "jobfairy" | "astrape";

export interface ProductLogoProps {
  logo_id: ProductLogoId;
  /** Badge edge length in px. */
  size?: number;
}

/**
 * Logo marks for the solo-built products, redrawn in the Folio Pop language
 * (ink outlines, palette fills) so the set reads as one family. Canvas, blip
 * and JobFairy are the ACTUAL product marks ported from their repos:
 * Canvas = canvas frame + brush stroke (`canvas/src/components/brand/logo.tsx`,
 * emerald accent → mint-500) · blip = the wordmark's radar-signal tittle, dot
 * + 3 arcs at the verbatim 46° geometry (`News20/src/components/BlipLogo.tsx`,
 * brand yellow → sun-400) · JobFairy = the four-point spark, exact app-nav
 * path (`JobFairy/src/components/nav.tsx`, ember-500 → orange-500). Orbit has
 * no product mark, so it gets a drawn-here orbit system (core + two ranked
 * source dots); Astrape keeps its bolt. Rendered as a bordered
 * badge, same footprint as the LinkTile icon box. Decorative — the tile title
 * carries the name, so the badge is aria-hidden.
 */
const LOGO_MARKS: Record<ProductLogoId, React.ReactNode> = {
  canvas: (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="var(--ink)" strokeWidth="1.8" />
      <path d="M7 15 L11 9 L14 13 L17 8" stroke="var(--mint-500)" strokeWidth="2" />
    </g>
  ),
  orbit: (
    <g>
      <circle cx="12" cy="12" r="9" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5.6" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.6" fill="var(--orange-500)" stroke="var(--ink)" strokeWidth="1.6" />
      <circle cx="18.1" cy="5.4" r="1.8" fill="var(--blue-700)" stroke="var(--ink)" strokeWidth="1.4" />
      <circle cx="7.2" cy="14.8" r="1.5" fill="var(--sun-400)" stroke="var(--ink)" strokeWidth="1.3" />
    </g>
  ),
  blip: (
    <g fill="none" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round">
      <path d="M10.72 8.98 A4.2 4.2 0 0 1 10.72 15.02" />
      <path d="M13.5 6.1 A8.2 8.2 0 0 1 13.5 17.9" opacity="0.85" />
      <path d="M16.28 3.23 A12.2 12.2 0 0 1 16.28 20.77" opacity="0.7" />
      <circle cx="7.8" cy="12" r="2.6" fill="var(--sun-400)" />
    </g>
  ),
  jobfairy: (
    <path
      d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4Z"
      fill="var(--orange-500)"
      stroke="var(--ink)"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  ),
  astrape: (
    <path
      d="M13.5 2 L5 13.5 L10.8 13.5 L9.5 22 L19 10 L12.8 10 Z"
      fill="var(--sun-400)"
      stroke="var(--ink)"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  ),
};

export function ProductLogo({ logo_id, size = 40 }: ProductLogoProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        flex: "none",
        borderRadius: 12,
        border: "2px solid var(--ink)",
        background: "var(--paper)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg viewBox="0 0 24 24" width={Math.round(size * 0.62)} height={Math.round(size * 0.62)} aria-hidden="true">
        {LOGO_MARKS[logo_id]}
      </svg>
    </span>
  );
}
