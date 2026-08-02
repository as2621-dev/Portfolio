/**
 * Staging/publish switch for editorial markers.
 *
 * While true, inline [CONFIRM]/[SLOT]/[VERIFY]/[FOUNDER] tags render as small
 * chips and asset placeholders ([SCREENSHOT SLOT]s) render as dashed frames —
 * so unresolved items are impossible to miss in review (per the copy guide).
 * Flip to false at publish; unresolved claims must be resolved or cut first,
 * never silently hidden.
 */
export const SHOW_PENDING_MARKERS = true;
