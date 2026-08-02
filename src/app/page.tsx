import type React from "react";
import { MascotLogo } from "@/components/brand/MascotLogo";
import { PendingChip } from "@/components/longform/PendingChip";
import { Reveal } from "@/components/motion/Reveal";
import { CompetencyStripSection } from "@/components/sections/CompetencyStripSection";
import { FeaturedWorkSection } from "@/components/sections/FeaturedWorkSection";
import { SocialLinksRow } from "@/components/sections/SocialLinksRow";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { site } from "@/content/site";

/** Load-time entrance stagger for the hero rows. */
function riseStyle(order: number): React.CSSProperties {
  return { animationDelay: `${order * 90}ms` };
}

/**
 * Home: survive the 7-second scan, then route the reader to the flagship.
 * Hero → credibility band → featured work → competency strip → closing CTA.
 * Copy source: ~/"Portfolio "/copy/01-home.md; all copy reads from site.ts.
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

        <span
          className="fp-rise"
          style={{
            ...riseStyle(1),
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.08em",
            fontWeight: 600,
            color: "var(--orange-600)",
            textTransform: "uppercase",
          }}
        >
          {site.role_line}
        </span>

        <h1 className="fp-rise" style={{ ...riseStyle(2), fontSize: "var(--text-hero)", fontWeight: 800 }}>
          {site.wordmark_text}
        </h1>

        <p
          className="fp-rise"
          style={{
            ...riseStyle(3),
            fontSize: 22,
            color: "var(--ink-2)",
            maxWidth: "26ch",
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

        {/* The deliberate-choice line — the heaviest strategic lifting on the page */}
        <div className="fp-rise" style={riseStyle(5)}>
          <Card tint="sun" padding={20} pop={false} style={{ borderRadius: "var(--radius-md)" }}>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: "var(--ink)", fontWeight: 500 }}>
              {site.home_deliberate_line}
            </p>
          </Card>
        </div>

        <div
          className="fp-rise"
          style={{ ...riseStyle(6), display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}
        >
          {site.home_location_chip ? (
            <Badge tone="mint">{site.home_location_chip}</Badge>
          ) : (
            <PendingChip
              chip_kind="CONFIRM"
              chip_note="location + open-to statement, e.g. “Remote / relocating · Open to senior AI PM roles”"
            />
          )}
        </div>

        {/* Credibility band */}
        <div className="fp-rise" style={{ ...riseStyle(7), display: "flex", gap: 24, flexWrap: "wrap", marginTop: 4 }}>
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
          style={{ ...riseStyle(8), display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}
        >
          <Button href={`mailto:${site.primary_email}`}>Email me →</Button>
          <Button variant="outline" href="#">
            Download résumé
          </Button>
          <PendingChip chip_kind="SLOT" chip_note="résumé PDF — to be produced from the copy set" />
        </div>

        <div className="fp-rise" style={riseStyle(9)}>
          <SocialLinksRow />
        </div>
      </section>

      <FeaturedWorkSection />
      <CompetencyStripSection />

      {/* ── Closing CTA ── */}
      <Reveal>
        <Card tint="orange" padding={32}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{site.closing_cta.closing_header}</h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink-2)", margin: "12px 0 20px" }}>
            {site.closing_cta.closing_body}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Button href="/work/quicsnap-shutter-labs">Read the flagship story →</Button>
            <Button variant="outline" href={`mailto:${site.primary_email}`}>
              Email me
            </Button>
            <Button variant="outline" href="#">
              Résumé
            </Button>
            <PendingChip chip_kind="SLOT" chip_note="résumé PDF" />
          </div>
        </Card>
      </Reveal>
    </main>
  );
}
