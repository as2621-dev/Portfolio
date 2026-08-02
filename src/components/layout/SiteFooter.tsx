import Link from "next/link";
import { site } from "@/content/site";

const FOOTER_LINKS = [
  { footer_label: "work", href: "/#work" },
  { footer_label: "projects", href: "/projects" },
  { footer_label: "library", href: "/library" },
  { footer_label: "about", href: "/about" },
];

/**
 * Shared site footer (mounted in the root layout): © line + compact mono nav,
 * over a 2px dashed rule — every page stays standalone-navigable.
 */
export function SiteFooter() {
  return (
    <footer
      style={{
        maxWidth: "var(--container-wide)",
        margin: "0 auto",
        padding: "24px 24px 40px",
        borderTop: "2px dashed var(--border-soft)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--ink-3)",
        lineHeight: 1.6,
      }}
    >
      <span>© 2026 {site.owner_name} · Built with the Folio Pop design system</span>
      <nav style={{ display: "flex", gap: 16 }}>
        {FOOTER_LINKS.map((footer_link) => (
          <Link
            key={footer_link.href}
            href={footer_link.href}
            style={{ color: "var(--ink-3)", textDecoration: "none" }}
          >
            {footer_link.footer_label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
