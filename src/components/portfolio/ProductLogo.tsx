import type React from "react";

export type ProductLogoId = "canvas" | "orbit" | "blip" | "jobfairy" | "electricitybillsaved";

export interface ProductLogoProps {
  logo_id: ProductLogoId;
  /** Badge edge length in px. */
  size?: number;
}

/**
 * Simple, unique logo marks for the solo-built products — drawn in the Folio
 * Pop language (ink outlines, palette fills) so the set reads as one family:
 * Canvas = stacked frames · Orbit = planet + ring · blip = reel + play ·
 * JobFairy = sparkle · ElectricityBillSaved = bolt. Rendered as a bordered
 * badge, same footprint as the LinkTile icon box. Decorative — the tile title
 * carries the name, so the badge is aria-hidden.
 */
const LOGO_MARKS: Record<ProductLogoId, React.ReactNode> = {
  canvas: (
    <g>
      <rect x="8" y="4" width="12" height="12" rx="2.5" fill="var(--blue-100)" stroke="var(--ink)" strokeWidth="1.8" />
      <rect
        x="4"
        y="8"
        width="12"
        height="12"
        rx="2.5"
        fill="var(--orange-500)"
        stroke="var(--ink)"
        strokeWidth="1.8"
      />
    </g>
  ),
  orbit: (
    <g>
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4.2"
        transform="rotate(-24 12 12)"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4.6" fill="var(--orange-500)" stroke="var(--ink)" strokeWidth="1.8" />
      <circle cx="20.2" cy="7.4" r="2" fill="var(--blue-700)" stroke="var(--ink)" strokeWidth="1.4" />
    </g>
  ),
  blip: (
    <g>
      <rect x="7" y="3" width="10" height="18" rx="3" fill="var(--mint-100)" stroke="var(--ink)" strokeWidth="1.8" />
      <path
        d="M10.5 9 L15.5 12 L10.5 15 Z"
        fill="var(--orange-500)"
        stroke="var(--ink)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </g>
  ),
  jobfairy: (
    <g>
      <path
        d="M12 3 L13.8 10.2 L21 12 L13.8 13.8 L12 21 L10.2 13.8 L3 12 L10.2 10.2 Z"
        fill="var(--coral-100)"
        stroke="var(--ink)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="18.8" cy="5.2" r="1.7" fill="var(--orange-500)" stroke="var(--ink)" strokeWidth="1.3" />
    </g>
  ),
  electricitybillsaved: (
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
