import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { LinkTile } from "@/components/portfolio/LinkTile";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { ProjectsIndexGrid } from "@/components/sections/ProjectsIndexGrid";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Things I've shipped · Ash Sri",
  description:
    "Every product here was designed, built, and shipped solo — with the decisions, agent architectures, evals, and what each one cost to learn.",
};

/**
 * Projects index: intro → case-study banner (the big two live in Work) →
 * ranked tabbed grid. Copy source: ~/"Portfolio "/copy/04-projects-index.md.
 */
export default function ProjectsIndexPage() {
  return (
    <main
      style={{
        maxWidth: "var(--container-wide)",
        margin: "0 auto",
        padding: "48px 24px 96px",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <header className="fp-rise" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 800 }}>Things I've shipped</h1>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--ink-2)", maxWidth: "68ch", margin: 0 }}>
          Every product here was designed, built, and shipped by me — solo. Each page tells you what I built, who it's
          for, what I decided and rejected, how the AI agents work, how I measured quality, and what it cost me to
          learn. GitHub links included, because "trust me" isn't a source.
        </p>
      </header>

      <Reveal>
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionHeader eyebrow="THE BIG TWO LIVE IN WORK" title="Start with the case studies" />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {site.case_study_links.map((case_study, link_index) => (
              <LinkTile
                key={case_study.href}
                title={case_study.link_title}
                meta={case_study.link_meta}
                emoji={link_index === 0 ? "🔦" : "🎨"}
                href={case_study.href}
                tint={link_index === 0 ? "orange" : "blue"}
              />
            ))}
          </div>
        </section>
      </Reveal>

      <ProjectsIndexGrid />
    </main>
  );
}
