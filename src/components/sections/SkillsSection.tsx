import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { SkillPill } from "@/components/portfolio/SkillPill";
import { PM_SKILLS } from "@/content/journey";

/**
 * Home skills overview: the PM skill registry as colored pills. The same
 * pills are pinned to the venture blocks and product tiles in the journey
 * below, tying each skill to the work that earned it.
 */
export function SkillsSection() {
  return (
    <section id="skills" style={{ display: "flex", flexDirection: "column", gap: 18, scrollMarginTop: 96 }}>
      <SectionHeader eyebrow="SKILLS" title="The toolkit" />
      <p style={{ fontSize: 15, color: "var(--ink-3)", margin: 0, fontStyle: "italic" }}>
        A few of many — each one tagged on the ventures and products below, where it was earned.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {PM_SKILLS.map((skill) => (
          <SkillPill key={skill.skill_id} skill_id={skill.skill_id} />
        ))}
      </div>
    </section>
  );
}
