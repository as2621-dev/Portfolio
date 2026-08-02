import { LinkTile } from "@/components/portfolio/LinkTile";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { site } from "@/content/site";

/**
 * The Linktree-style primary link stack — the product's core object per the
 * design system. Reads `site.link_tiles`.
 */
export function LinkStackSection() {
  return (
    <section id="links" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeader eyebrow="START HERE" title="The short path" />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {site.link_tiles.map((tile) => (
          <LinkTile
            key={tile.tile_title}
            title={tile.tile_title}
            meta={tile.tile_meta}
            emoji={tile.tile_emoji}
            href={tile.href}
            tint={tile.tile_tint}
          />
        ))}
      </div>
    </section>
  );
}
