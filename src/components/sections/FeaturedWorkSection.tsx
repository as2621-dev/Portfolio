"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { LinkTile } from "@/components/portfolio/LinkTile";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { type FeaturedWorkCard, site } from "@/content/site";

const CARD_TINTS = {
  orange: "var(--surface-tint-orange)",
  blue: "var(--surface-tint-blue)",
  sun: "var(--surface-tint-sun)",
} as const;

/** One large featured case-study card — lifts on hover like every Folio Pop surface. */
function FeaturedCard({ card }: { card: FeaturedWorkCard }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={card.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        background: card.card_tint ? CARD_TINTS[card.card_tint] : "var(--paper)",
        border: "2px solid var(--ink)",
        borderRadius: "var(--radius-lg)",
        padding: "26px 28px",
        textDecoration: "none",
        color: "var(--ink)",
        boxShadow: hovered ? "var(--shadow-pop-lg)" : "var(--shadow-pop)",
        transform: hovered ? "var(--lift)" : "none",
        transition: "transform var(--dur-fast) var(--ease-pop),box-shadow var(--dur-fast) var(--ease-pop)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 23, lineHeight: 1.25 }}>
          {card.card_title}
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
      <span style={{ fontSize: 15.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{card.card_description}</span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {card.card_tags.map((tag) => (
          <Badge key={tag} tone="blue">
            {tag}
          </Badge>
        ))}
        {card.card_stat && (
          <span
            style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--orange-600)" }}
          >
            {card.card_stat}
            <span style={{ fontSize: 11, color: "var(--ink-3)", marginLeft: 5 }}>{card.card_stat_label}</span>
          </span>
        )}
      </div>
    </a>
  );
}

/**
 * Home "The work" section: the two big case-study cards, then a compact row
 * routing to the four project deep-dives. Copy source: 01-home.md.
 */
export function FeaturedWorkSection() {
  return (
    <section id="work" style={{ display: "flex", flexDirection: "column", gap: 20, scrollMarginTop: 96 }}>
      <SectionHeader eyebrow="FEATURED" title="The work" />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {site.featured_cards.map((card, card_index) => (
          <Reveal key={card.href} delay_ms={card_index * 80}>
            <FeaturedCard card={card} />
          </Reveal>
        ))}
        <Reveal delay_ms={160}>
          <LinkTile
            title="Four more shipped products"
            meta="Orbit · blip · JobFairy · Astrape — each designed, built, and shipped solo, with the agent architectures and evals documented."
            emoji="🛠️"
            href="/projects"
          />
        </Reveal>
      </div>
    </section>
  );
}
