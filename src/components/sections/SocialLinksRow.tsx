"use client";

import { Mail } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/icons/BrandIcons";
import { site } from "@/content/site";

const ICONS: Record<string, React.ReactNode> = {
  Github: <GithubIcon size={20} />,
  Linkedin: <LinkedinIcon size={20} />,
  Twitter: <XIcon size={18} />,
  Mail: <Mail size={20} strokeWidth={2} />,
};

/**
 * Circular social icon links for the hero — anchor elements styled to match
 * the IconButton look (which is button-only), reading `site.social_links`.
 */
export function SocialLinksRow() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {site.social_links.map((link) => (
        <SocialIconLink key={link.platform_label} label={link.platform_label} href={link.href}>
          {ICONS[link.lucide_icon_name] ?? link.platform_label}
        </SocialIconLink>
      ))}
    </div>
  );
}

function SocialIconLink({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  const [state, setState] = useState<"idle" | "hover" | "active">("idle");

  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      onMouseEnter={() => setState("hover")}
      onMouseLeave={() => setState("idle")}
      onMouseDown={() => setState("active")}
      onMouseUp={() => setState("hover")}
      style={{
        width: 44,
        height: 44,
        borderRadius: "var(--radius-pill)",
        border: "2px solid var(--ink)",
        background: "var(--paper)",
        color: "var(--ink)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: state === "active" ? "none" : state === "hover" ? "var(--shadow-pop)" : "var(--shadow-pop-sm)",
        transform: state === "hover" ? "var(--lift)" : state === "active" ? "var(--press)" : "none",
        transition: "transform var(--dur-fast) var(--ease-pop),box-shadow var(--dur-fast) var(--ease-pop)",
      }}
    >
      {children}
    </a>
  );
}
