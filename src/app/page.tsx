import type React from "react";
import { MascotLogo } from "@/components/brand/MascotLogo";
import { Reveal } from "@/components/motion/Reveal";
import { JourneySection } from "@/components/sections/JourneySection";
import { PrinciplesSection } from "@/components/sections/PrinciplesSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { SocialLinksRow } from "@/components/sections/SocialLinksRow";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

/** Load-time entrance stagger for the hero rows. */
function riseStyle(order: number): React.CSSProperties {
  return { animationDelay: `${order * 90}ms` };
}

/**
 * Home: survive the 7-second scan, then walk the reader through the journey.
 * Hero → credibility band → skills overview → journey blocks (venture blocks
 * with skill tags, then the own-products tiles) → principles of building →
 * sign-off GIF. Journey content: src/content/journey.ts; principles content:
 * src/content/principles.ts.
 */
export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: "var(--container-narrow)",
        margin: "0 auto",
        padding: "64px 24px 96px",
        display: "flex",
        flexDirection: "column",
        gap: 72,
      }}
    >
      {/* ── Hero ── */}
      <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="fp-rise" style={riseStyle(0)}>
          <MascotLogo size={160} variant="cutout" />
        </div>

        <h1 className="fp-rise" style={{ ...riseStyle(2), fontSize: "var(--text-hero)", fontWeight: 800 }}>
          {site.wordmark_text}
        </h1>

        <p
          className="fp-rise"
          style={{
            ...riseStyle(3),
            fontSize: 22,
            color: "var(--ink-2)",
            maxWidth: "32ch",
            lineHeight: 1.35,
            margin: 0,
          }}
        >
          {site.hero_headline}
        </p>

        <p
          className="fp-rise"
          style={{ ...riseStyle(4), fontSize: 16, color: "var(--ink-3)", maxWidth: "52ch", margin: 0 }}
        >
          {site.hero_subline}
        </p>

        {site.home_location_chip && (
          <div
            className="fp-rise"
            style={{ ...riseStyle(5), display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}
          >
            <Badge tone="mint">{site.home_location_chip}</Badge>
          </div>
        )}

        {/* Credibility band */}
        <div className="fp-rise" style={{ ...riseStyle(6), display: "flex", gap: 24, flexWrap: "wrap", marginTop: 4 }}>
          {site.hero_stats.map((stat) => (
            <div key={stat.stat_label}>
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 24, color: "var(--ink)" }}>
                {stat.stat_value}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" }}>
                {stat.stat_label}
              </div>
            </div>
          ))}
        </div>

        <div
          className="fp-rise"
          style={{ ...riseStyle(7), display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}
        >
          <Button href={`mailto:${site.primary_email}`}>Email me →</Button>
          <Button variant="outline" href={site.resume_pdf_href} target="_blank" rel="noopener">
            Download résumé
          </Button>
        </div>

        <div className="fp-rise" style={riseStyle(8)}>
          <SocialLinksRow />
        </div>
      </section>

      <SkillsSection />
      <JourneySection />
      <PrinciplesSection />

      {/* ── Sign-off ── */}
      <Reveal>
        {/* Animated GIF, kept out of the next/image optimizer on purpose. */}
        <img
          src="/step-in.gif"
          alt="Pixel-art adventurer holding a torch beside a treasure chest in a rune-lit cave"
          style={{
            width: "100%",
            display: "block",
            border: "2px solid var(--ink)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-pop)",
          }}
        />
      </Reveal>
    </main>
  );
}
