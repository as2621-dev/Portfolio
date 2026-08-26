/**
 * Pure karaoke selector — a faithful port of the app's `captionStateAtTime`
 * (News20 `src/lib/captions/captionState.ts`), trimmed to what the demo renders.
 *
 * Given the caption track and the sampled audio clock, decide the current
 * sentence and each of its words' visual state. Invariants preserved from the
 * app (its tests encode them):
 *  - the word whose `[start_ms, end_ms)` contains `t` is `active`;
 *  - words ended at/before `t` are `spoken`, words not yet started are `dim`
 *    (inter-word gaps resolve to `spoken`, never `active`);
 *  - at/after `speech_end_ms` no word is `active` (trailing-ambience tail);
 *  - in gaps between sentences the last started sentence stays current, so the
 *    speaker label persists through silences.
 */
import type { BlipAnchorSpeaker, BlipDemoCaptionSentence } from "./blipDemoData";

/** Karaoke progress state for a single word (orthogonal to the highlight keyword). */
export type BlipWordTimingState = "dim" | "spoken" | "active";

/** The resolved visual state of one rendered word. */
export interface BlipWordVisualState {
  word_text: string;
  /**
   * Space-joined CSS classes, byte-compatible with the app's caption markup:
   * `"w"` plus `"spoken"`/`"active"`, plus `"hl"` for the sentence's one keyword.
   */
  css_class_names: string;
}

/** The full karaoke state at one instant of the audio clock. */
export interface BlipCaptionStateAtTime {
  current_sentence_index: number;
  current_speaker: BlipAnchorSpeaker | null;
  /** The current sentence, announced once to screen readers by the renderer. */
  current_sentence_text: string;
  words: BlipWordVisualState[];
}

/** Build the CSS class string for a word from its timing state + highlight flag. */
function buildCssClassNames(timing: BlipWordTimingState, isHighlight: boolean): string {
  const classNames = ["w"];
  if (timing === "spoken") {
    classNames.push("spoken");
  } else if (timing === "active") {
    classNames.push("active");
  }
  if (isHighlight) {
    classNames.push("hl");
  }
  return classNames.join(" ");
}

/**
 * Resolve the karaoke state at a given moment of the audio clock.
 *
 * @param captionSentences - The story's caption track, ordered by sentence_index.
 * @param currentTimeMs - Sampled audio position (`audio.currentTime * 1000`).
 * @param speechEndMs - When narration ends (can be earlier than the audio's end).
 * @returns The current sentence's speaker + per-word visual states, or an empty
 *   state (`current_speaker: null`) before the first sentence starts.
 */
export function blipCaptionStateAtTime(
  captionSentences: BlipDemoCaptionSentence[],
  currentTimeMs: number,
  speechEndMs: number,
): BlipCaptionStateAtTime {
  if (captionSentences.length === 0 || currentTimeMs < captionSentences[0].sentence_start_ms) {
    return { current_sentence_index: -1, current_speaker: null, current_sentence_text: "", words: [] };
  }

  // Reason: linear scan is fine (≤ ~11 sentences); the last sentence whose start
  // is at or before t is both the half-open owner and the right "sticky" answer
  // for inter-sentence gaps and the post-speech tail.
  let currentSentenceIndex = 0;
  for (let index = 0; index < captionSentences.length; index += 1) {
    if (captionSentences[index].sentence_start_ms <= currentTimeMs) {
      currentSentenceIndex = index;
    } else {
      break;
    }
  }

  const currentSentence = captionSentences[currentSentenceIndex];
  const isFullySpoken = currentTimeMs >= speechEndMs;

  const words: BlipWordVisualState[] = currentSentence.word_tokens.map((token) => {
    let timing: BlipWordTimingState;
    if (isFullySpoken) {
      timing = "spoken";
    } else if (currentTimeMs < token.start_ms) {
      timing = "dim";
    } else if (currentTimeMs < token.end_ms) {
      timing = "active";
    } else {
      timing = "spoken";
    }
    return { word_text: token.word_text, css_class_names: buildCssClassNames(timing, token.is_highlight) };
  });

  return {
    current_sentence_index: currentSentenceIndex,
    current_speaker: currentSentence.anchor_speaker,
    current_sentence_text: currentSentence.word_tokens.map((token) => token.word_text).join(" "),
    words,
  };
}
