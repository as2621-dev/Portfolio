import type { Metadata } from "next";
import type React from "react";
import { InlineText } from "@/components/longform/InlineText";
import { PendingChip } from "@/components/longform/PendingChip";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { TimelineItem } from "@/components/portfolio/TimelineItem";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  aboutContactBody,
  aboutFitNotFor,
  aboutFitRightFor,
  aboutIntroLine,
  aboutJourneyParagraphs,
  aboutWhyProductParagraphs,
} from "@/content/about-page";
import { SHOW_PENDING_MARKERS } from "@/content/publish-state";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About · Ashesh Srivastava",
  description:
    "Customer, operator, founder, builder — the journey from ecommerce at scale to AI product management, and what I'm right for (and not).",
};

const PARAGRAPH_STYLE: React.CSSProperties = {
  fontSize: 17,
  lineHeight: 1.7,
  color: "var(--ink-2)",
  margin: 0,
};

/**
 * About: journey (#journey, prose + timeline) → why product (#why-product) →
 * fit (#fit) → beyond work (awaiting Ash) → say hello (#contact).
 * Copy source: ~/"Portfolio "/copy/10-about.md — late-funnel humanization.
 */
export default function AboutPage() {
  return (
    <main
      style={{
        maxWidth: "var(--container-narrow)",
        margin: "0 auto",
        padding: "48px 24px 96px",
        display: "flex",
        flexDirection: "column",
        gap: 48,
      }}
    >
      <header className="fp-rise" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 800 }}>Customer, operator, founder, builder</h1>
        <p style={{ ...PARAGRAPH_STYLE, fontSize: 18 }}>{aboutIntroLine}</p>
      </header>

      <section id="journey" style={{ display: "flex", flexDirection: "column", gap: 20, scrollMarginTop: 96 }}>
        <SectionHeader eyebrow="THE JOURNEY" title="Operator, founder, builder — one thread" />
        {aboutJourneyParagraphs.map((journey_paragraph) => (
          <p key={journey_paragraph.slice(0, 32)} style={PARAGRAPH_STYLE}>
            <InlineText text={journey_paragraph} />
          </p>
        ))}
        <Reveal>
          <div style={{ marginTop: 8 }}>
            {site.experience.map((entry, entry_index) => (
              <TimelineItem
                key={`${entry.experience_period}-${entry.experience_org}`}
                period={entry.experience_period}
                roleTitle={entry.experience_role}
                org={entry.experience_org}
                summary={entry.experience_summary}
                current={entry.is_current}
                last={entry_index === site.experience.length - 1}
              />
            ))}
          </div>
        </Reveal>
      </section>

      <section id="why-product" style={{ display: "flex", flexDirection: "column", gap: 20, scrollMarginTop: 96 }}>
        <SectionHeader eyebrow="THE MOVE" title="Why product, and why now" />
        {aboutWhyProductParagraphs.map((why_paragraph) => (
          <p key={why_paragraph.slice(0, 32)} style={PARAGRAPH_STYLE}>
            <InlineText text={why_paragraph} />
          </p>
        ))}
      </section>

      <section id="fit" style={{ display: "flex", flexDirection: "column", gap: 20, scrollMarginTop: 96 }}>
        <SectionHeader eyebrow="FIT" title="What I'm right for (and not)" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          <Reveal>
            <Card tint="blue" padding={24} style={{ height: "100%" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--blue-800)",
                  marginBottom: 8,
                }}
              >
                Right for
              </div>
              <p style={{ ...PARAGRAPH_STYLE, fontSize: 15.5 }}>{aboutFitRightFor}</p>
            </Card>
          </Reveal>
          <Reveal delay_ms={80}>
            <Card padding={24} style={{ height: "100%" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                  marginBottom: 8,
                }}
              >
                Not the best fit for
              </div>
              <p style={{ ...PARAGRAPH_STYLE, fontSize: 15.5 }}>{aboutFitNotFor}</p>
            </Card>
          </Reveal>
        </div>
      </section>

      {SHOW_PENDING_MARKERS && (
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionHeader eyebrow="BEYOND WORK" title="The human bit" />
          <Card tint="sun" padding={24}>
            <p style={{ ...PARAGRAPH_STYLE, fontSize: 15.5 }}>
              This block is reserved for 2–3 lines of genuine personality — hobbies, city, a strong opinion about
              something harmless. It's the only section that can't be researched.
              <PendingChip chip_kind="CONFIRM" chip_note="Ash: three sentences; specific beats impressive" />
            </p>
          </Card>
        </section>
      )}

      <section id="contact" style={{ display: "flex", flexDirection: "column", gap: 20, scrollMarginTop: 96 }}>
        <SectionHeader eyebrow="RÉSUMÉ + CONTACT" title="Say hello" />
        <p style={PARAGRAPH_STYLE}>{aboutContactBody}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <Button href={site.resume_pdf_href} variant="outline" size="md" target="_blank" rel="noopener">
            Download résumé
          </Button>
          <Button href={`mailto:${site.primary_email}`} variant="primary" size="md">
            {site.primary_email}
          </Button>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-3)" }}>
          LinkedIn <PendingChip chip_kind="CONFIRM" chip_note="LinkedIn URL" /> · GitHub{" "}
          <PendingChip chip_kind="CONFIRM" chip_note="GitHub URL" />
        </span>
      </section>
    </main>
  );
}
