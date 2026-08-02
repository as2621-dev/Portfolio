import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { SkillChip } from "@/components/portfolio/SkillChip";
import { site } from "@/content/site";

/**
 * Skill pills with 1–3 proficiency dots. Reads `site.skills`.
 */
export function SkillsSection() {
  return (
    <section id="skills" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeader eyebrow="TOOLKIT" title="What I work with" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {site.skills.map((skill) => (
          <SkillChip key={skill.skill_label} label={skill.skill_label} level={skill.skill_level} />
        ))}
      </div>
    </section>
  );
}
