"use client";

import { useState } from "react";
import { InlineText } from "@/components/longform/InlineText";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { site } from "@/content/site";

/**
 * Home competency strip: every claim links to its receipt — the row's whole
 * surface is the link. Proof lines may carry inline editorial tags (e.g. the
 * [FOUNDER] marker on the outbound-machine claim), rendered via InlineText.
 */
export function CompetencyStripSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeader eyebrow="PROVEN WHERE" title="What I do, and where it's proven" />
      <p style={{ fontSize: 15, color: "var(--ink-3)", margin: 0, fontStyle: "italic" }}>
        Every claim links to the receipt.
      </p>
      <div
        style={{
          border: "2px solid var(--ink)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-pop)",
        }}
      >
        {site.competency_rows.map((row, row_index) => (
          <a
            key={row.competency_label}
            href={row.href}
            onMouseEnter={() => setHoveredIndex(row_index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              display: "flex",
              gap: 16,
              alignItems: "baseline",
              flexWrap: "wrap",
              padding: "14px 20px",
              textDecoration: "none",
              color: "var(--ink)",
              background: hoveredIndex === row_index ? "var(--orange-50)" : "var(--paper)",
              borderBottom: row_index === site.competency_rows.length - 1 ? "none" : "1px solid var(--border-soft)",
              transition: "background var(--dur-fast)",
            }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15.5, flex: "0 0 210px" }}>
              {row.competency_label}
            </span>
            <span style={{ flex: "1 1 260px", fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
              <InlineText text={row.competency_proof} />
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 600,
                color: hoveredIndex === row_index ? "var(--orange-600)" : "var(--blue-700)",
                whiteSpace: "nowrap",
              }}
            >
              {row.link_label} →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
