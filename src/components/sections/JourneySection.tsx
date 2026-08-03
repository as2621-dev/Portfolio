"use client";

import { useState } from "react";
import { CompanyTimelineStrip } from "@/components/charts/CompanyTimelineStrip";
import { InlineText } from "@/components/longform/InlineText";
import { Reveal } from "@/components/motion/Reveal";
import { ProductLogo } from "@/components/portfolio/ProductLogo";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { SkillPill } from "@/components/portfolio/SkillPill";
import {
  JOURNEY_STEPS,
  type JourneyConnectorStep,
  type JourneyVentureStep,
  PRODUCT_TILES,
  type ProductTileEntry,
} from "@/content/journey";

const BLOCK_TINTS = {
  orange: "var(--surface-tint-orange)",
  blue: "var(--surface-tint-blue)",
  sun: "var(--surface-tint-sun)",
} as const;

/** One clickable venture block — the whole surface links to its dedicated page. */
function VentureBlock({ step }: { step: JourneyVentureStep }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={step.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        background: step.journey_tint ? BLOCK_TINTS[step.journey_tint] : "var(--paper)",
        border: "2px solid var(--ink)",
        borderRadius: "var(--radius-lg)",
        padding: "24px 26px",
        textDecoration: "none",
        color: "var(--ink)",
        boxShadow: hovered ? "var(--shadow-pop-lg)" : "var(--shadow-pop)",
        transform: hovered ? "var(--lift)" : "none",
        transition: "transform var(--dur-fast) var(--ease-pop),box-shadow var(--dur-fast) var(--ease-pop)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.08em",
            fontWeight: 600,
            color: "var(--orange-600)",
            textTransform: "uppercase",
          }}
        >
          {step.journey_period}
        </span>
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 20,
            transform: hovered ? "translateX(3px)" : "none",
            transition: "transform var(--dur-fast) var(--ease-pop)",
          }}
        >
          →
        </span>
      </div>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, lineHeight: 1.25 }}>
        {step.journey_title}
      </span>
      <span style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6 }}>
        <InlineText text={step.journey_summary} />
      </span>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        {step.skill_ids.map((skill_id) => (
          <SkillPill key={skill_id} skill_id={skill_id} pill_size="sm" />
        ))}
        {step.journey_stat && (
          <span
            style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--orange-600)" }}
          >
            {step.journey_stat}
            <span style={{ fontSize: 11, color: "var(--ink-3)", marginLeft: 5 }}>{step.journey_stat_label}</span>
          </span>
        )}
      </div>
    </a>
  );
}

/** The between-eras narrative beat: a down-arrow gutter and an italic line. */
function ConnectorNote({ step }: { step: JourneyConnectorStep }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "2px 10px" }}>
      <span
        aria-hidden="true"
        style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--orange-500)" }}
      >
        ↓
      </span>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "var(--ink-2)", fontStyle: "italic" }}>
        <InlineText text={step.connector_text} />
      </p>
    </div>
  );
}

/** One small product tile in the own-products grid. */
function ProductTile({ tile }: { tile: ProductTileEntry }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={tile.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: "var(--paper)",
        border: "2px solid var(--ink)",
        borderRadius: "var(--radius-md)",
        padding: "16px 18px",
        textDecoration: "none",
        color: "var(--ink)",
        boxShadow: hovered ? "var(--shadow-pop)" : "var(--shadow-pop-sm)",
        transform: hovered ? "var(--lift)" : "none",
        transition: "transform var(--dur-fast) var(--ease-pop),box-shadow var(--dur-fast) var(--ease-pop)",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ProductLogo logo_id={tile.tile_logo_id} size={36} />
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, flex: 1 }}>
          {tile.tile_title}
        </span>
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 15,
            transform: hovered ? "translateX(3px)" : "none",
            transition: "transform var(--dur-fast) var(--ease-pop)",
          }}
        >
          →
        </span>
      </div>
      <span style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55, flex: 1 }}>{tile.tile_summary}</span>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {tile.skill_ids.map((skill_id) => (
          <SkillPill key={skill_id} skill_id={skill_id} pill_size="sm" />
        ))}
      </div>
    </a>
  );
}

/**
 * Home journey: the story first venture to now — clickable era blocks with
 * skill tags, connector beats between eras, the 2022→2025 timeline strip, and
 * the own-products tile grid at the end. Content: src/content/journey.ts.
 */
export function JourneySection() {
  return (
    <section id="journey" style={{ display: "flex", flexDirection: "column", gap: 22, scrollMarginTop: 96 }}>
      <SectionHeader eyebrow="THE JOURNEY" title="First venture to now" />
      {JOURNEY_STEPS.map((step, step_index) => {
        const step_key = `journey-step-${step_index}`;
        if (step.step_kind === "venture") {
          return (
            <Reveal key={step_key} delay_ms={60}>
              <VentureBlock step={step} />
            </Reveal>
          );
        }
        if (step.step_kind === "connector") {
          return (
            <Reveal key={step_key} delay_ms={60}>
              <ConnectorNote step={step} />
            </Reveal>
          );
        }
        if (step.step_kind === "timeline") {
          return (
            <Reveal key={step_key} delay_ms={60}>
              <CompanyTimelineStrip />
            </Reveal>
          );
        }
        return (
          <Reveal key={step_key} delay_ms={60}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: 16,
              }}
            >
              {PRODUCT_TILES.map((tile) => (
                <ProductTile key={tile.href} tile={tile} />
              ))}
            </div>
          </Reveal>
        );
      })}
    </section>
  );
}
