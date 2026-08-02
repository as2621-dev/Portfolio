import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { TimelineItem } from "@/components/portfolio/TimelineItem";
import { site } from "@/content/site";

/**
 * The experience timeline, newest first. Reads `site.experience`; the final
 * row hides its connecting line.
 */
export function ExperienceSection() {
  return (
    <section id="experience" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionHeader eyebrow="THE JOURNEY" title="Where I've been" />
      <div>
        {site.experience.map((entry, index) => (
          <TimelineItem
            key={`${entry.experience_period}-${entry.experience_org}`}
            period={entry.experience_period}
            roleTitle={entry.experience_role}
            org={entry.experience_org}
            summary={entry.experience_summary}
            current={entry.is_current}
            last={index === site.experience.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
