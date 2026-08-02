import { SHOW_PENDING_MARKERS } from "@/content/publish-state";

export type PendingChipKind = "CONFIRM" | "SLOT" | "VERIFY" | "FOUNDER";

export interface PendingChipProps {
  chip_kind: PendingChipKind;
  /** The note after the tag, e.g. "location + availability wording". */
  chip_note?: string;
}

/** [label, background, text] per tag kind. */
const CHIP_STYLES: Record<PendingChipKind, [string, string, string]> = {
  CONFIRM: ["confirm", "var(--sun-100)", "#8a5e00"],
  SLOT: ["asset slot", "var(--blue-100)", "var(--blue-800)"],
  VERIFY: ["verify", "var(--mint-100)", "#116b4c"],
  FOUNDER: ["founder memory", "var(--paper)", "var(--ink-3)"],
};

/**
 * Small inline editorial chip for [CONFIRM]/[SLOT]/[VERIFY]/[FOUNDER] tags in
 * copy. Visible only while `SHOW_PENDING_MARKERS` is true (staging); renders
 * nothing at publish. The full note is kept in the title attribute so review
 * doesn't require opening the source.
 */
export function PendingChip({ chip_kind, chip_note }: PendingChipProps) {
  if (!SHOW_PENDING_MARKERS) return null;
  const [chip_label, background, color] = CHIP_STYLES[chip_kind];
  return (
    <span
      title={chip_note || chip_label}
      style={{
        background,
        color,
        border: "1.5px solid var(--ink)",
        borderRadius: "var(--radius-pill)",
        padding: "1px 8px",
        margin: "0 3px",
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        verticalAlign: "middle",
        cursor: chip_note ? "help" : undefined,
      }}
    >
      {chip_label}
    </span>
  );
}
