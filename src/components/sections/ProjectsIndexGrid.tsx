"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Tabs } from "@/components/ui/Tabs";
import { site } from "@/content/site";

/**
 * The /projects tabbed grid. Tabs come from `site.project_categories` ("All"
 * first); cards from `site.projects` in ranked order — strongest evals and
 * decision stories first, founder-era context cards in their own tab. Card
 * media uses the mascot sprites until real screenshots land.
 */
export function ProjectsIndexGrid() {
  const [activeCategory, setActiveCategory] = useState<string>(site.project_categories[0]);

  const visibleProjects =
    activeCategory === "All"
      ? site.projects
      : site.projects.filter((project) => project.project_category === activeCategory);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Tabs items={site.project_categories} active={activeCategory} onChange={setActiveCategory} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {visibleProjects.map((project, project_index) => (
          <Reveal key={project.project_title} delay_ms={project_index * 60}>
            <ProjectCard
              title={project.project_title}
              description={project.project_description}
              tags={project.project_tags}
              stat={project.project_stat}
              statLabel={project.project_stat_label}
              href={project.href}
              style={{ height: "100%" }}
              media={
                project.project_media_image ? (
                  <img
                    src={project.project_media_image}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : undefined
              }
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
