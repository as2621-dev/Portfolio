import type { Metadata } from "next";
import Link from "next/link";
import { InlineText } from "@/components/longform/InlineText";
import { PendingChip } from "@/components/longform/PendingChip";
import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/Card";
import { libraryArtifacts, libraryIntro } from "@/content/library-page";

export const metadata: Metadata = {
  title: "The library — real PRDs, briefs, and strategy work · Ashesh Srivastava",
  description:
    "Real documents from real products — PRDs, briefs, and strategy decks I wrote and then had to live with, each with the context of what it decided and how the decision aged.",
};

/**
 * The library: six self-authored artifacts, each wrapped in context — never a
 * bare file list. Document exports render as SLOT chips until the PDFs land.
 */
export default function LibraryPage() {
  return (
    <main
      style={{
        maxWidth: "var(--container-narrow)",
        margin: "0 auto",
        padding: "48px 24px 96px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      <header className="fp-rise" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
          Docs & writing
        </span>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 800 }}>The library</h1>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--ink-2)", margin: 0 }}>{libraryIntro}</p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {libraryArtifacts.map((artifact, artifact_index) => (
          <Reveal key={artifact.artifact_title} delay_ms={Math.min(artifact_index * 50, 150)}>
            <Card padding={28}>
              <h2 style={{ fontSize: 21, fontWeight: 700, margin: 0 }}>
                <InlineText text={artifact.artifact_title} />
              </h2>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--ink-3)",
                  marginTop: 6,
                }}
              >
                {artifact.artifact_meta_line}
              </div>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "var(--ink-2)", margin: "12px 0 0" }}>
                <InlineText text={artifact.artifact_wrapper} />
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", marginTop: 16 }}>
                {artifact.artifact_links.map((artifact_link) =>
                  artifact_link.is_pending_slot ? (
                    <span
                      key={artifact_link.link_label}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 14.5,
                        color: "var(--ink-3)",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {artifact_link.link_label}
                      <PendingChip chip_kind="SLOT" chip_note={artifact_link.pending_note} />
                    </span>
                  ) : (
                    <Link
                      key={artifact_link.link_label}
                      href={artifact_link.href ?? "#"}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 14.5,
                        color: "var(--blue-700)",
                        textDecorationThickness: 2,
                      }}
                    >
                      {artifact_link.link_label}
                    </Link>
                  ),
                )}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
