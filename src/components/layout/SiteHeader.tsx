import Link from "next/link";
import { MascotLogo } from "@/components/brand/MascotLogo";
import { site } from "@/content/site";

/**
 * Sticky site header shown on every page (mounted in the root layout). Solid
 * cream with a 2px ink bottom border — no blur/transparency, per the design
 * system. Carries the animated mascot logo + wordmark.
 */
export function SiteHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--cream)",
        borderBottom: "2px solid var(--ink)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "var(--ink)" }}
        >
          <MascotLogo size={44} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
            {site.wordmark_text}
          </span>
        </Link>
        <nav
          style={{
            display: "flex",
            gap: 18,
            alignItems: "center",
            flexWrap: "wrap",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Link href="/#work" style={{ color: "var(--ink-2)", textDecoration: "none" }}>
            work
          </Link>
          <Link href="/projects" style={{ color: "var(--ink-2)", textDecoration: "none" }}>
            projects
          </Link>
          <Link href="/library" style={{ color: "var(--ink-2)", textDecoration: "none" }}>
            library
          </Link>
          <Link href="/about" style={{ color: "var(--ink-2)", textDecoration: "none" }}>
            about
          </Link>
          <a href={`mailto:${site.primary_email}`} style={{ color: "var(--ink-2)", textDecoration: "none" }}>
            contact
          </a>
        </nav>
      </div>
    </header>
  );
}
