/**
 * blip reel demo — typed story data for the embedded-phone demo.
 *
 * These are the four fully-produced stories of the 2026-06-09 briefing's global
 * feed (DB-truth snapshot: News20 repo `.agents/e2e/review-pack-2026-06-09/db-truth.json`).
 * Posters, narration audio, and word-timed caption tracks under
 * /public/proof/blip/demo/ are the pipeline's real artifacts (M0 set, seeded
 * 2026-05-30 as stories s1–s5 ↔ digest-1..5) — nothing here is re-authored.
 *
 * Segment accents and anchor identity colours are transcribed from the app
 * (`prototype/data.js` SEGMENTS + `seedM0Digests.ts` ANCHOR_ROWS).
 */

/** The two AI anchors. Speakers alternate per sentence, starting from `anchor_order[0]`. */
export type BlipAnchorSpeaker = "ALEX" | "JORDAN";

/** Fixed anchor identity colours (NOT segment accents) — from the app's anchors table. */
export const BLIP_ANCHOR_COLOR: Record<BlipAnchorSpeaker, string> = {
  ALEX: "#6C8CFF",
  JORDAN: "#C792EA",
};

/** One word of a caption sentence, timed against the narration audio (ms). */
export interface BlipDemoWordToken {
  word_text: string;
  is_highlight: boolean;
  start_ms: number;
  end_ms: number;
}

/** One karaoke sentence: speaker + ordered word tokens. */
export interface BlipDemoCaptionSentence {
  sentence_index: number;
  anchor_speaker: BlipAnchorSpeaker;
  sentence_start_ms: number;
  sentence_end_ms: number;
  word_tokens: BlipDemoWordToken[];
}

/** A story's full caption track (shape of /proof/blip/demo/captions-sN.json). */
export interface BlipDemoCaptionTrack {
  audio_duration_ms: number;
  /** Narration can end before the audio does (trailing ambience) — no word is active past this. */
  speech_end_ms: number;
  sentences: BlipDemoCaptionSentence[];
}

/** One demo story: metadata + paths to its real poster / audio / caption artifacts. */
export interface BlipDemoStory {
  story_id: string;
  story_headline: string;
  segment_label: string;
  segment_accent_hex: string;
  outlet_name: string;
  poster_src: string;
  audio_src: string;
  captions_src: string;
  /** Fallback duration until the caption track (or audio metadata) loads. */
  audio_duration_ms: number;
}

/**
 * The briefing is 30 stories; the four produced ones sit at the end so the
 * finite counter reads 27/30 → 30/30 and the "all caught up" finish line is
 * reachable in-demo (same trick as the app's own prototype data).
 */
export const BLIP_DEMO_FEED_TOTAL = 30;
export const BLIP_DEMO_FEED_START_INDEX = 26;

/** Feed order matches the DB snapshot's global feed (`stories ⋈ digests` by story_id). */
export const BLIP_DEMO_STORIES: BlipDemoStory[] = [
  {
    story_id: "s1",
    story_headline: "U.S. strikes Iran again as Trump says a deal is “close”",
    segment_label: "Geopolitics",
    segment_accent_hex: "#EF4444",
    outlet_name: "CNN",
    poster_src: "/proof/blip/demo/poster-s1.jpg",
    audio_src: "/proof/blip/demo/audio-s1.mp3",
    captions_src: "/proof/blip/demo/captions-s1.json",
    audio_duration_ms: 50611,
  },
  {
    story_id: "s2",
    story_headline: "Travis Kelce buys a minority stake in the Cleveland Guardians",
    segment_label: "Sport",
    segment_accent_hex: "#F59E0B",
    outlet_name: "ESPN",
    poster_src: "/proof/blip/demo/poster-s2.jpg",
    audio_src: "/proof/blip/demo/audio-s2.mp3",
    captions_src: "/proof/blip/demo/captions-s2.json",
    audio_duration_ms: 46000,
  },
  {
    story_id: "s3",
    story_headline: "Houston physicists break a 30-year superconductivity record",
    segment_label: "Tech & Science",
    segment_accent_hex: "#22D3EE",
    outlet_name: "ScienceDaily",
    poster_src: "/proof/blip/demo/poster-s3.jpg",
    audio_src: "/proof/blip/demo/audio-s3.mp3",
    captions_src: "/proof/blip/demo/captions-s3.json",
    audio_duration_ms: 55891,
  },
  {
    story_id: "s4",
    story_headline: "Nvidia’s blowout quarter — yet the stock slips",
    segment_label: "Markets",
    segment_accent_hex: "#22C55E",
    outlet_name: "CNBC",
    poster_src: "/proof/blip/demo/poster-s4.jpg",
    audio_src: "/proof/blip/demo/audio-s4.mp3",
    captions_src: "/proof/blip/demo/captions-s4.json",
    audio_duration_ms: 47492,
  },
];
