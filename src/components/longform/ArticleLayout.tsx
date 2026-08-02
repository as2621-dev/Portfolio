import Link from "next/link";
import type React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { LongformArticle } from "@/content/longform-types";
import { BlockRenderer } from "./BlockRenderer";
import { InlineText } from "./InlineText";

export interface ArticleLayoutProps {
  article: LongformArticle;
}

/** Load-time entrance stagger for the article header rows. */
function riseStyle(order: number): React.CSSProperties {
  return { animationDelay: `${order * 90}ms` };
}

/**
 * Shared shell for every long-form page: back link, staggered header (eyebrow,
 * title, dek, tags), scannable overview card, stat band, body blocks, and a
 * footer CTA row. Every page built on this is standalone-readable — the
 * expected reader arrived from a single forwarded URL.
 */
export function ArticleLayout({ article }: ArticleLayoutProps) {
  return (
    <main
      style={{
        maxWidth: "var(--container-narrow)",
        margin: "0 auto",
        padding: "48px 24px 96px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      <div className="fp-rise" style={riseStyle(0)}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--ink-3)",
            textDecoration: "none",
          }}
        >
          ← home
        </Link>
      </div>

      <header style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <span
          className="fp-rise"
          style={{
            ...riseStyle(1),
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.08em",
            fontWeight: 600,
            color: "var(--orange-600)",
            textTransform: "uppercase",
          }}
        >
          {article.article_eyebrow}
        </span>

        <h1 className="fp-rise" style={{ ...riseStyle(2), fontSize: "clamp(32px, 5vw, 46px)", fontWeight: 800 }}>
          <InlineText text={article.article_title} />
        </h1>

        {article.article_subtitle && (
          <p
            className="fp-rise"
            style={{
              ...riseStyle(3),
              fontSize: 18,
              fontStyle: "italic",
              color: "var(--ink-2)",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            <InlineText text={article.article_subtitle} />
          </p>
        )}

        {article.article_tags && article.article_tags.length > 0 && (
          <div className="fp-rise" style={{ ...riseStyle(4), display: "flex", gap: 8, flexWrap: "wrap" }}>
            {article.article_tags.map((tag) => (
              <Badge key={tag} tone="blue">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {article.article_meta && (
        <div className="fp-rise" style={riseStyle(5)}>
          <Card tint="blue" padding={24}>
            <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {article.article_meta.map((entry) => (
                <div key={entry.meta_label} style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                  <dt
                    style={{
                      flex: "none",
                      width: 92,
                      fontFamily: "var(--font-mono)",
                      fontSize: 11.5,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--blue-800)",
                    }}
                  >
                    {entry.meta_label}
                  </dt>
                  <dd style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)" }}>
                    <InlineText text={entry.meta_value} />
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      )}

      {article.article_stats && (
        <div className="fp-rise" style={riseStyle(6)}>
          <Card padding={22}>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "space-between" }}>
              {article.article_stats.map((stat) => (
                <div key={stat.stat_label} style={{ minWidth: 130, flex: "1 1 130px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 23, color: "var(--ink)" }}>
                    <InlineText text={stat.stat_value} />
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
                    <InlineText text={stat.stat_label} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <BlockRenderer blocks={article.blocks} />

      {article.article_footer_links && (
        <footer
          style={{
            borderTop: "2px dashed var(--border-soft)",
            paddingTop: 28,
            marginTop: 12,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {article.article_footer_links.map((cta) => (
            <Button key={cta.cta_label} href={cta.href} variant={cta.cta_variant ?? "outline"} size="md">
              {cta.cta_label}
            </Button>
          ))}
        </footer>
      )}
    </main>
  );
}
