"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { site } from "@/content/site";

/**
 * Tabbed project grid. Tabs come from `site.project_categories` ("All" first);
 * cards from `site.projects`. Card media uses the mascot sprite mapped per
 * project until real screenshots land.
 */
export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<string>(site.project_categories[0]);

  const visibleProjects =
    activeCategory === "All"
      ? site.projects
      : site.projects.filter((project) => project.project_category === activeCategory);

  return (
    <section id="projects" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeader eyebrow="SELECTED WORK" title="Things I've shipped" />
      <Tabs items={site.project_categories} active={activeCategory} onChange={setActiveCategory} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {visibleProjects.map((project) => (
          <ProjectCard
            key={project.project_title}
            title={project.project_title}
            description={project.project_description}
            tags={project.project_tags}
            stat={project.project_stat}
            statLabel={project.project_stat_label}
            href={project.href}
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
        ))}
      </div>
    </section>
  );
}
