"use client";

import { Calendar, FileText, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  IconButton,
  Input,
  LinkTile,
  ProjectCard,
  SectionHeader,
  SkillChip,
  Tabs,
  TimelineItem,
} from "@/components";
import { MascotLogo } from "@/components/brand/MascotLogo";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/icons/BrandIcons";

/** A labelled block in the styleguide. */
function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeader eyebrow={eyebrow} title={title} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>{children}</div>
    </section>
  );
}

const COLOR_SWATCHES: { name: string; token: string }[] = [
  { name: "cream", token: "--cream" },
  { name: "paper", token: "--paper" },
  { name: "ink", token: "--ink" },
  { name: "ink-2", token: "--ink-2" },
  { name: "ink-3", token: "--ink-3" },
  { name: "orange-500", token: "--orange-500" },
  { name: "orange-600", token: "--orange-600" },
  { name: "blue-700", token: "--blue-700" },
  { name: "blue-500", token: "--blue-500" },
  { name: "sun-400", token: "--sun-400" },
  { name: "mint-500", token: "--mint-500" },
  { name: "coral-100", token: "--coral-100" },
];

const TYPE_SPECIMENS: { label: string; size: string; weight: number; family: string }[] = [
  { label: "Hero — Bricolage 800", size: "var(--text-hero)", weight: 800, family: "var(--font-display)" },
  { label: "H1 — Bricolage 800", size: "40px", weight: 800, family: "var(--font-display)" },
  { label: "H2 — Bricolage 700", size: "28px", weight: 700, family: "var(--font-display)" },
  { label: "Body — Instrument Sans", size: "16px", weight: 400, family: "var(--font-body)" },
  { label: "Mono — IBM Plex Mono", size: "14px", weight: 500, family: "var(--font-mono)" },
];

const MASCOT_TILES: { file: string; label: string }[] = [
  { file: "mascot-coding.png", label: "coding · hero" },
  { file: "mascot-map.png", label: "map · projects" },
  { file: "mascot-inspect.png", label: "inspect · research" },
  { file: "mascot-radio.png", label: "radio · contact" },
  { file: "mascot-dig.png", label: "dig · deep work" },
  { file: "mascot-measure.png", label: "measure · metrics" },
  { file: "mascot-reading.png", label: "reading · now" },
  { file: "mascot-reading-recline.png", label: "reading · about" },
  { file: "mascot-campfire.png", label: "campfire · community" },
];

export default function StyleguidePage() {
  const [tab, setTab] = useState("All");
  const cardStyle = useMemo<React.CSSProperties>(() => ({ width: 300 }), []);

  return (
    <main
      style={{
        maxWidth: "var(--container-wide)",
        margin: "0 auto",
        padding: "64px 24px 120px",
        display: "flex",
        flexDirection: "column",
        gap: 64,
      }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h1 style={{ fontSize: "var(--text-hero)", fontWeight: 800 }}>Design system styleguide</h1>
        <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: "60ch" }}>
          Every token and component wired into the Next.js scaffold. If it renders here, section-building can compose it
          freely.
        </p>
      </header>

      {/* Brand / mascot */}
      <Section eyebrow="BRAND" title="Mascot logo & assets">
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", width: "100%" }}>
          <MascotLogo size={96} />
          <MascotLogo size={64} />
          <MascotLogo size={44} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-3)" }}>
            animated logo — webm + hevc, black-bg badge, reduced-motion aware
          </span>
        </div>
        {MASCOT_TILES.map((tile) => (
          <figure key={tile.file} style={{ margin: 0, width: 150, display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                border: "2px solid var(--ink)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                background: "var(--cream)",
                boxShadow: "var(--shadow-pop-sm)",
              }}
            >
              <img
                src={`/mascot/${tile.file}`}
                alt={tile.label}
                width={351}
                height={336}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </div>
            <figcaption style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)" }}>
              {tile.label}
            </figcaption>
          </figure>
        ))}
      </Section>

      {/* Colors */}
      <Section eyebrow="TOKENS" title="Color">
        {COLOR_SWATCHES.map((swatch) => (
          <div key={swatch.token} style={{ width: 120, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                height: 64,
                borderRadius: "var(--radius-md)",
                border: "2px solid var(--ink)",
                background: `var(${swatch.token})`,
                boxShadow: "var(--shadow-pop-sm)",
              }}
            />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)" }}>{swatch.name}</span>
          </div>
        ))}
      </Section>

      {/* Type */}
      <Section eyebrow="TOKENS" title="Type">
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          {TYPE_SPECIMENS.map((specimen) => (
            <div key={specimen.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
                {specimen.label}
              </span>
              <span style={{ fontFamily: specimen.family, fontSize: specimen.size, fontWeight: specimen.weight }}>
                I ship AI products.
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Buttons */}
      <Section eyebrow="ACTIONS" title="Buttons">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button disabled>Disabled</Button>
        <Button href="#">As link →</Button>
      </Section>

      {/* Icon buttons */}
      <Section eyebrow="ACTIONS" title="Icon buttons">
        <IconButton label="GitHub" variant="outline">
          <GithubIcon size={20} />
        </IconButton>
        <IconButton label="LinkedIn" variant="primary">
          <LinkedinIcon size={20} />
        </IconButton>
        <IconButton label="X" variant="secondary">
          <XIcon size={18} />
        </IconButton>
        <IconButton label="Email" variant="outline" size="lg">
          <Mail size={22} strokeWidth={2} />
        </IconButton>
      </Section>

      {/* Inputs */}
      <Section eyebrow="FORMS" title="Inputs">
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 340 }}>
          <Input label="Name" placeholder="Ada Lovelace" />
          <Input label="Email" placeholder="you@studio.com" hint="I reply within a day." />
          <Input label="Budget" placeholder="Ballpark" error="Please enter a number." />
          <Input label="Message" placeholder="What are you building?" multiline />
        </div>
      </Section>

      {/* Badges */}
      <Section eyebrow="DISPLAY" title="Badges">
        <Badge tone="orange">Orange</Badge>
        <Badge tone="blue">Blue</Badge>
        <Badge tone="sun">Sun</Badge>
        <Badge tone="mint">Mint</Badge>
        <Badge tone="ink">Ink</Badge>
      </Section>

      {/* Tabs */}
      <Section eyebrow="DISPLAY" title="Tabs">
        <Tabs items={["All", "AI", "Product", "Tools"]} active={tab} onChange={setTab} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-3)", alignSelf: "center" }}>
          selected: {tab}
        </span>
      </Section>

      {/* Cards */}
      <Section eyebrow="DISPLAY" title="Cards">
        <Card style={cardStyle}>
          <strong style={{ fontFamily: "var(--font-display)" }}>Default</strong>
          <p style={{ margin: "8px 0 0", fontSize: 14 }}>White paper with the hard pop shadow.</p>
        </Card>
        <Card tint="orange" style={cardStyle}>
          <strong style={{ fontFamily: "var(--font-display)" }}>Orange tint</strong>
          <p style={{ margin: "8px 0 0", fontSize: 14 }}>Tinted surface to band a section.</p>
        </Card>
        <Card tint="blue" style={cardStyle}>
          <strong style={{ fontFamily: "var(--font-display)" }}>Blue tint</strong>
          <p style={{ margin: "8px 0 0", fontSize: 14 }}>Cool accent panel.</p>
        </Card>
        <Card pop={false} style={cardStyle}>
          <strong style={{ fontFamily: "var(--font-display)" }}>Soft shadow</strong>
          <p style={{ margin: "8px 0 0", fontSize: 14 }}>For large passive surfaces.</p>
        </Card>
      </Section>

      {/* Link tiles */}
      <Section eyebrow="PORTFOLIO" title="Link tiles">
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "min(100%, var(--container-narrow))" }}>
          <LinkTile
            title="Read the case study"
            meta="How we cut eval time 6×"
            tint="orange"
            href="#"
            icon={<FileText size={20} strokeWidth={2} />}
          />
          <LinkTile
            title="Book 15 min with me"
            meta="Calendar"
            tint="blue"
            href="#"
            icon={<Calendar size={20} strokeWidth={2} />}
          />
          <LinkTile title="Download résumé" emoji="📄" href="#" />
        </div>
      </Section>

      {/* Project cards */}
      <Section eyebrow="PORTFOLIO" title="Project cards">
        <ProjectCard
          title="Eval harness"
          description="A test-driven loop that cut model-review time and caught regressions before ship."
          tags={["LLM", "Evals", "TypeScript"]}
          stat="6×"
          statLabel="faster"
          href="#"
          style={{ width: 340 }}
        />
        <ProjectCard
          title="Agent playground"
          description="Interactive sandbox for prompt + tool design with shareable runs."
          tags={["Agents", "Python"]}
          href="#"
          style={{ width: 340 }}
        />
      </Section>

      {/* Skills */}
      <Section eyebrow="PORTFOLIO" title="Skill chips">
        <SkillChip label="Product strategy" level={3} />
        <SkillChip label="LLM evals" level={3} />
        <SkillChip label="TypeScript" level={2} />
        <SkillChip label="Figma" level={1} />
        <SkillChip label="Roadmapping" />
      </Section>

      {/* Timeline */}
      <Section eyebrow="PORTFOLIO" title="Experience timeline">
        <div style={{ width: "min(100%, var(--container-narrow))" }}>
          <TimelineItem
            period="2023 — now"
            roleTitle="AI Product Manager"
            org="Acme AI"
            summary="Own the eval + agent roadmap; ship model-facing product with a small forward-deployed team."
            current
          />
          <TimelineItem
            period="2021 — 2023"
            roleTitle="Forward-Deployed Engineer"
            org="Northwind"
            summary="Embedded with customers to turn fuzzy AI asks into shipped integrations."
          />
          <TimelineItem
            period="2019 — 2021"
            roleTitle="Software Engineer"
            org="Studio"
            summary="Full-stack product work."
            last
          />
        </div>
      </Section>
    </main>
  );
}
