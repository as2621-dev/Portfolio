import Link from "next/link";
import type React from "react";
import { PendingChip, type PendingChipKind } from "./PendingChip";

export interface InlineTextProps {
  text: string;
}

/**
 * One pass of the inline-markup tokenizer. Alternatives, in match order:
 *  1. editorial tags   [CONFIRM: …] [SLOT: …] [VERIFY: …] [FOUNDER — …]
 *  2. links            [label](href)
 *  3. bold             **text**
 *  4. italic           *text*
 *  5. code             `text`
 */
const INLINE_TOKEN_PATTERN =
  /\[(CONFIRM|SLOT|VERIFY|FOUNDER)\b\s*(?:[:—-]\s*)?([^\]]*)\]|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+?)\*\*|\*([^*\n]+?)\*|`([^`]+)`/g;

const CODE_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.88em",
  background: "var(--blue-50)",
  border: "1px solid var(--border-soft)",
  borderRadius: 6,
  padding: "1px 5px",
};

/** Parses one string into React nodes; recurses one level for bold/italic contents. */
function parseInlineMarkup(text: string, key_prefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = new RegExp(INLINE_TOKEN_PATTERN.source, "g");
  let cursor = 0;
  let match = pattern.exec(text);
  let token_index = 0;

  while (match !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const key = `${key_prefix}-${token_index}`;
    const [, tag_kind, tag_note, link_label, link_href, bold_text, italic_text, code_text] = match;

    if (tag_kind) {
      nodes.push(<PendingChip key={key} chip_kind={tag_kind as PendingChipKind} chip_note={tag_note || undefined} />);
    } else if (link_label && link_href) {
      const is_internal = link_href.startsWith("/") || link_href.startsWith("#") || link_href.startsWith("mailto:");
      nodes.push(
        is_internal ? (
          <Link key={key} href={link_href}>
            {parseInlineMarkup(link_label, key)}
          </Link>
        ) : (
          <a key={key} href={link_href} target="_blank" rel="noopener noreferrer">
            {parseInlineMarkup(link_label, key)}
          </a>
        ),
      );
    } else if (bold_text) {
      nodes.push(<strong key={key}>{parseInlineMarkup(bold_text, key)}</strong>);
    } else if (italic_text) {
      nodes.push(<em key={key}>{parseInlineMarkup(italic_text, key)}</em>);
    } else if (code_text) {
      nodes.push(
        <code key={key} style={CODE_STYLE}>
          {code_text}
        </code>,
      );
    }

    cursor = match.index + match[0].length;
    token_index += 1;
    match = pattern.exec(text);
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

/**
 * Renders a copy string with the long-form inline-markup subset (see
 * longform-types.ts). Editorial tags become <PendingChip>s, which disappear
 * at publish via SHOW_PENDING_MARKERS.
 *
 * @example
 * <InlineText text="Roughly **$85K** all-in [CONFIRM: wording]." />
 */
export function InlineText({ text }: InlineTextProps) {
  return <>{parseInlineMarkup(text, "t")}</>;
}
