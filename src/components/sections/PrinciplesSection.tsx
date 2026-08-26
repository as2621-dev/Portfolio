import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { BUILDING_PRINCIPLES, PRINCIPLES_INTRO } from "@/content/principles";

/**
 * Home "Principles of building" section: the five gates every build runs
 * through, in order, as one bordered card of numbered rows. Content lives in
 * src/content/principles.ts; linked from the Canvas case study as /#principles.
 */
export function PrinciplesSection() {
  return (
    <section id="principles" style={{ display: "flex", flexDirection: "column", gap: 18, scrollMarginTop: 96 }}>
      <SectionHeader eyebrow="HOW I BUILD" title="Principles of building" />
      <p style={{ fontSize: 15, color: "var(--ink-3)", margin: 0, fontStyle: "italic" }}>{PRINCIPLES_INTRO}</p>
      <Reveal>
        <ol
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            background: "var(--paper)",
            border: "2px solid var(--ink)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-pop)",
            overflow: "hidden",
          }}
        >
          {BUILDING_PRINCIPLES.map((principle, index) => (
            <li
              key={principle.principle_number}
              style={{
                display: "flex",
                gap: 18,
                alignItems: "baseline",
                padding: "18px 22px",
                borderTop: index === 0 ? "none" : "1px solid var(--ink)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "var(--orange-600)",
                  flexShrink: 0,
                }}
              >
                {String(principle.principle_number).padStart(2, "0")}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 17,
                    letterSpacing: "-0.01em",
                    color: "var(--ink)",
                    margin: 0,
                  }}
                >
                  {principle.principle_title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)", margin: 0 }}>
                  {principle.principle_body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
