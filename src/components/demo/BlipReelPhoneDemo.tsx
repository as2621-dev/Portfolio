"use client";

/**
 * BlipReelPhoneDemo — the real blip reel screen, playable inside an iPhone
 * frame on the project page.
 *
 * Faithful to the 2026-06-09 build captured in
 * /proof/blip/reel-playback-2026-06-09.png: finite 30-segment bar, wordmark +
 * date + counter, right action rail, the karaoke caption hero, segment chip +
 * headline + tap hint, speaker label + play bar, and the mic + ask field. The
 * four stories are the fully-produced reels of that briefing's global feed —
 * their posters, narration audio, and word-timed captions are the pipeline's
 * actual artifacts (see blipDemoData.ts for provenance).
 *
 * Demo boundaries: playback, karaoke, story navigation, save/follow toggles,
 * and the finish line all work; the mic and the ask field are live UI but
 * deliberately answer nothing — Q&A runs only in the real app.
 *
 * The interior is laid out at the fixed logical size 393×852 and scaled to
 * fit its container (never cropped). Audio is preload="none" until played.
 */
import { JetBrains_Mono, Playfair_Display } from "next/font/google";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { blipCaptionStateAtTime } from "./blipCaptionState";
import {
  BLIP_ANCHOR_COLOR,
  BLIP_DEMO_FEED_START_INDEX,
  BLIP_DEMO_FEED_TOTAL,
  BLIP_DEMO_STORIES,
  type BlipDemoCaptionTrack,
} from "./blipDemoData";
import "./blip-reel-demo.css";

// The app's typefaces (Playfair serif captions, JetBrains Mono machine text) —
// self-hosted via next/font so the phone renders like the phone.
const demoSerif = Playfair_Display({ subsets: ["latin"], weight: "700", variable: "--bpd-serif" });
const demoMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--bpd-mono" });

/** Logical device size (iPhone 15 Pro points) — everything scales from this. */
const PHONE_WIDTH_PX = 393;
const PHONE_HEIGHT_PX = 852;
/** Horizontal breathing room for the bezel ring when scaling to fit. */
const FRAME_MARGIN_PX = 18;
/** Index of the "all caught up" page after the last story. */
const DONE_PAGE_INDEX = BLIP_DEMO_STORIES.length;

/** Format ms as `m:ss` for the play bar's time label. */
function formatClock(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function BlipReelPhoneDemo() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [frameScale, setFrameScale] = useState<number>(1);
  const [isMicPressed, setIsMicPressed] = useState<boolean>(false);
  const [captionTracks, setCaptionTracks] = useState<(BlipDemoCaptionTrack | null)[]>(() =>
    BLIP_DEMO_STORIES.map(() => null),
  );
  const [savedStoryIds, setSavedStoryIds] = useState<Set<string>>(() => new Set());
  const [checkedStoryIds, setCheckedStoryIds] = useState<Set<string>>(() => new Set());
  const [failedPosterIds, setFailedPosterIds] = useState<Set<string>>(() => new Set());

  const rootRef = useRef<HTMLDivElement>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const askInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number>(0);
  const swipeStartYRef = useRef<number | null>(null);
  const suppressTapRef = useRef<boolean>(false);

  // Scale the fixed 393×852 interior to the article column (never crop).
  useLayoutEffect(() => {
    const rootElement = rootRef.current;
    if (!rootElement) {
      return;
    }
    const applyScale = () => {
      const availableWidth = rootElement.clientWidth - FRAME_MARGIN_PX * 2;
      setFrameScale(Math.min(1, Math.max(0.3, availableWidth / PHONE_WIDTH_PX)));
    };
    applyScale();
    const resizeObserver = new ResizeObserver(applyScale);
    resizeObserver.observe(rootElement);
    return () => resizeObserver.disconnect();
  }, []);

  // Fetch the four word-timed caption tracks once (≈11 KB each).
  useEffect(() => {
    let isCancelled = false;
    Promise.all(
      BLIP_DEMO_STORIES.map(async (story) => {
        try {
          const response = await fetch(story.captions_src);
          if (!response.ok) {
            return null;
          }
          return (await response.json()) as BlipDemoCaptionTrack;
        } catch {
          return null; // captions simply stay empty — playback still works
        }
      }),
    ).then((loadedTracks) => {
      if (!isCancelled) {
        setCaptionTracks(loadedTracks);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  // Sample the active story's audio clock every animation frame while playing.
  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const sampleClock = () => {
      const audioElement = audioRefs.current[activeIndex];
      if (audioElement) {
        setCurrentTimeMs(audioElement.currentTime * 1000);
      }
      animationFrameRef.current = requestAnimationFrame(sampleClock);
    };
    animationFrameRef.current = requestAnimationFrame(sampleClock);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isPlaying, activeIndex]);

  // Pause everything on unmount.
  useEffect(() => {
    const audioElements = audioRefs.current;
    return () => {
      for (const audioElement of audioElements) {
        audioElement?.pause();
      }
    };
  }, []);

  const playStory = useCallback((storyIndex: number) => {
    const audioElement = audioRefs.current[storyIndex];
    if (!audioElement) {
      return;
    }
    setHasStarted(true);
    const attemptPlay = () =>
      audioElement
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    if (audioElement.readyState === HTMLMediaElement.HAVE_NOTHING) {
      // preload="none": kick the fetch, then play as soon as it can.
      audioElement.load();
      audioElement.addEventListener("canplay", attemptPlay, { once: true });
    } else {
      void attemptPlay();
    }
  }, []);

  const pauseStory = useCallback((storyIndex: number) => {
    audioRefs.current[storyIndex]?.pause();
    setIsPlaying(false);
  }, []);

  /** Snap to a page; rewinds the story being left, keeps playing if it was playing. */
  const goToPage = useCallback(
    (nextIndex: number, shouldAutoplay: boolean) => {
      const clampedIndex = Math.max(0, Math.min(DONE_PAGE_INDEX, nextIndex));
      if (clampedIndex === activeIndex) {
        return;
      }
      const leavingAudio = audioRefs.current[activeIndex];
      if (leavingAudio) {
        leavingAudio.pause();
        leavingAudio.currentTime = 0;
      }
      setCurrentTimeMs(0);
      setActiveIndex(clampedIndex);
      if (clampedIndex < DONE_PAGE_INDEX && shouldAutoplay && hasStarted) {
        playStory(clampedIndex);
      } else {
        setIsPlaying(false);
      }
    },
    [activeIndex, hasStarted, playStory],
  );

  const handleTapSurface = useCallback(() => {
    if (suppressTapRef.current) {
      suppressTapRef.current = false;
      return;
    }
    if (activeIndex >= DONE_PAGE_INDEX) {
      return;
    }
    if (isPlaying) {
      pauseStory(activeIndex);
    } else {
      playStory(activeIndex);
    }
  }, [activeIndex, isPlaying, pauseStory, playStory]);

  const handleAudioEnded = useCallback(() => {
    if (activeIndex < BLIP_DEMO_STORIES.length - 1) {
      goToPage(activeIndex + 1, true);
    } else {
      setIsPlaying(false);
      goToPage(DONE_PAGE_INDEX, false);
    }
  }, [activeIndex, goToPage]);

  const handleReplay = useCallback(() => {
    setActiveIndex(0);
    setCurrentTimeMs(0);
    playStory(0);
  }, [playStory]);

  // Mouse drag up/down flips stories. Touch is left to the page (touch-action:
  // pan-y) so the article keeps scrolling normally — chevrons + auto-advance
  // cover story navigation on touch devices.
  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    swipeStartYRef.current = event.pointerType === "mouse" ? event.clientY : null;
  }, []);
  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      const startY = swipeStartYRef.current;
      swipeStartYRef.current = null;
      if (startY === null) {
        return;
      }
      const deltaY = event.clientY - startY;
      if (Math.abs(deltaY) > 48) {
        suppressTapRef.current = true;
        goToPage(deltaY < 0 ? activeIndex + 1 : activeIndex - 1, isPlaying);
      }
    },
    [activeIndex, goToPage, isPlaying],
  );

  const activeTrack = activeIndex < DONE_PAGE_INDEX ? captionTracks[activeIndex] : null;
  const activeStory = activeIndex < DONE_PAGE_INDEX ? BLIP_DEMO_STORIES[activeIndex] : null;
  const captionState = activeTrack
    ? blipCaptionStateAtTime(activeTrack.sentences, currentTimeMs, activeTrack.speech_end_ms)
    : null;
  const activeDurationMs = activeTrack?.audio_duration_ms ?? activeStory?.audio_duration_ms ?? 0;
  const progressPercent = activeDurationMs > 0 ? Math.min(100, (currentTimeMs / activeDurationMs) * 100) : 0;

  return (
    <div ref={rootRef} className={`bpd ${demoSerif.variable} ${demoMono.variable}`}>
      <div style={{ width: PHONE_WIDTH_PX * frameScale, height: PHONE_HEIGHT_PX * frameScale }}>
        <section
          className="bpd-device"
          style={{ transform: `scale(${frameScale})`, transformOrigin: "top left" }}
          aria-label="Interactive demo of the blip iOS app — four reels from the 2026-06-09 briefing"
        >
          {/* pointer coords feed the mouse-drag story swipe; all real controls inside are buttons */}
          <div className="bpd-screen" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
            <div className="bpd-pages" style={{ transform: `translateY(${-activeIndex * PHONE_HEIGHT_PX}px)` }}>
              {BLIP_DEMO_STORIES.map((story, storyIndex) => {
                const isActive = storyIndex === activeIndex;
                const feedPosition = BLIP_DEMO_FEED_START_INDEX + storyIndex;
                const isSaved = savedStoryIds.has(story.story_id);
                const isChecked = checkedStoryIds.has(story.story_id);
                const storyCaptionState = isActive ? captionState : null;
                const speakerName = storyCaptionState?.current_speaker ?? null;
                const accentStyle = { "--accent": story.segment_accent_hex } as React.CSSProperties;
                return (
                  <div key={story.story_id} className="bpd-page" style={{ top: storyIndex * PHONE_HEIGHT_PX }}>
                    <div
                      className={`bpd-reel${isActive && isPlaying ? " playing" : ""}`}
                      style={accentStyle}
                      aria-hidden={!isActive}
                    >
                      {!failedPosterIds.has(story.story_id) && (
                        // Decorative full-bleed backdrop in a fixed-size frame; the
                        // next/image optimizer has nothing to add here.
                        <img
                          className="poster"
                          src={story.poster_src}
                          alt=""
                          loading={storyIndex === 0 ? "eager" : "lazy"}
                          onError={() => setFailedPosterIds((previous) => new Set(previous).add(story.story_id))}
                        />
                      )}
                      <div className="poster-dim" aria-hidden="true" />
                      <div className="scrim-top" aria-hidden="true" />
                      <div className="halo" aria-hidden="true" />
                      <div className="scrim" aria-hidden="true" />
                      <div className="edge-top" aria-hidden="true" />
                      <div className="edge-bottom" aria-hidden="true" />

                      <button
                        type="button"
                        className="tap"
                        aria-label={isActive && isPlaying ? "Pause the briefing" : "Play the briefing"}
                        onClick={handleTapSurface}
                        tabIndex={isActive ? 0 : -1}
                      />

                      {/* top chrome: finite bar + wordmark/date + counter + profile */}
                      <div className="bpd-top">
                        <div className="bpd-finite">
                          {Array.from({ length: BLIP_DEMO_FEED_TOTAL }, (_unused, segmentIndex) => {
                            const isDone = segmentIndex < feedPosition;
                            const isCurrent = segmentIndex === feedPosition;
                            return (
                              // fixed-length positional bar; the index IS the identity
                              <div key={segmentIndex} className={`bpd-fseg${isDone ? " done" : ""}`}>
                                {isCurrent && <i style={{ width: `${isActive ? progressPercent : 0}%` }} />}
                              </div>
                            );
                          })}
                        </div>
                        <div className="bpd-toprow">
                          <span className="bpd-brand">
                            <BlipWordmark />
                            <span className="bpd-date">THU · MAY 29</span>
                          </span>
                          <span className="bpd-topright">
                            <span className="bpd-counter">
                              {feedPosition + 1} / {BLIP_DEMO_FEED_TOTAL}
                            </span>
                            <button
                              type="button"
                              className="bpd-um"
                              aria-label="Profile (demo)"
                              tabIndex={isActive ? 0 : -1}
                            >
                              <ProfileIcon />
                            </button>
                          </span>
                        </div>
                      </div>

                      {/* right action rail */}
                      <div className="bpd-rail">
                        <button
                          type="button"
                          className={`bpd-um${isSaved ? " on" : ""}`}
                          aria-label="Save story"
                          aria-pressed={isSaved}
                          tabIndex={isActive ? 0 : -1}
                          onClick={() =>
                            setSavedStoryIds((previous) => {
                              const next = new Set(previous);
                              if (next.has(story.story_id)) {
                                next.delete(story.story_id);
                              } else {
                                next.add(story.story_id);
                              }
                              return next;
                            })
                          }
                        >
                          <BookmarkIcon />
                        </button>
                        <button type="button" className="bpd-um" aria-label="Share (demo)" tabIndex={isActive ? 0 : -1}>
                          <ShareIcon />
                        </button>
                        <button
                          type="button"
                          className={`bpd-um${isChecked ? " check-on" : ""}`}
                          aria-label="Mark as caught up"
                          aria-pressed={isChecked}
                          tabIndex={isActive ? 0 : -1}
                          onClick={() =>
                            setCheckedStoryIds((previous) => {
                              const next = new Set(previous);
                              if (next.has(story.story_id)) {
                                next.delete(story.story_id);
                              } else {
                                next.add(story.story_id);
                              }
                              return next;
                            })
                          }
                        >
                          <CheckIcon />
                        </button>
                      </div>

                      {/* karaoke caption hero */}
                      <div className="bpd-cap-wrap">
                        {storyCaptionState && storyCaptionState.current_speaker !== null ? (
                          <div className="caption">
                            <span className="sr-only">{storyCaptionState.current_sentence_text}</span>
                            <span aria-hidden="true">
                              {storyCaptionState.words.map((word, wordIndex) => (
                                // word order is stable within a sentence; index is the correct key
                                <span key={wordIndex}>
                                  <span className={word.css_class_names}>{word.word_text}</span>
                                  {wordIndex < storyCaptionState.words.length - 1 ? " " : null}
                                </span>
                              ))}
                            </span>
                          </div>
                        ) : (
                          <div className="caption" aria-hidden="true" />
                        )}
                      </div>

                      {/* headline zone */}
                      <div className="bpd-head">
                        <div className="bpd-seg-chip">
                          <span className="bpd-seg-dot" />
                          {story.segment_label}
                        </div>
                        <h3 className="bpd-headline">{story.story_headline}</h3>
                        <div className="bpd-taphint">
                          <ArrowRightIcon />
                          TAP THE HEADLINE FOR THE FULL ARTICLE
                        </div>
                      </div>

                      {/* speaker + play bar */}
                      <div className="bpd-playbar">
                        <div className="bpd-speaker-row">
                          <span className="bpd-speaker">
                            {speakerName !== null && (
                              <>
                                <span
                                  className="dot"
                                  style={{
                                    background: BLIP_ANCHOR_COLOR[speakerName],
                                    boxShadow: `0 0 12px ${BLIP_ANCHOR_COLOR[speakerName]}`,
                                  }}
                                />
                                {speakerName}
                              </>
                            )}
                          </span>
                          <span className="bpd-time">
                            {formatClock(isActive ? currentTimeMs : 0)} /{" "}
                            {formatClock(activeDurationMs > 0 && isActive ? activeDurationMs : story.audio_duration_ms)}
                          </span>
                        </div>
                        <div className="bpd-play-row">
                          <button
                            type="button"
                            className="bpd-play-btn"
                            aria-label={isActive && isPlaying ? "Pause" : "Play"}
                            tabIndex={isActive ? 0 : -1}
                            onClick={handleTapSurface}
                          >
                            {isActive && isPlaying ? <PauseIcon /> : <PlayIcon />}
                          </button>
                          <div className="bpd-progress">
                            <i style={{ width: `${isActive ? progressPercent : 0}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* ask bar — live UI, deliberately answers nothing (demo) */}
                      <div className="bpd-ask">
                        <div className="bpd-ask-row">
                          <button
                            type="button"
                            className={`bpd-sig-btn${isMicPressed && isActive ? " listening" : ""}`}
                            aria-label="Ask with your voice (demo — voice Q&A runs in the real app)"
                            tabIndex={isActive ? 0 : -1}
                            onPointerDown={() => setIsMicPressed(true)}
                            onPointerUp={() => setIsMicPressed(false)}
                            onPointerLeave={() => setIsMicPressed(false)}
                          >
                            <span className="ring" />
                            <span className="ring r2" />
                            <MicIcon />
                          </button>
                          <div className="bpd-qfield">
                            <input
                              ref={isActive ? askInputRef : undefined}
                              type="text"
                              placeholder="Ask anything about this story…"
                              aria-label="Type a question (demo — Q&A runs in the real app)"
                              tabIndex={isActive ? 0 : -1}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="bpd-kbd"
                              aria-label="Type a question"
                              tabIndex={isActive ? 0 : -1}
                              onClick={() => askInputRef.current?.focus()}
                            >
                              <KeyboardIcon />
                            </button>
                          </div>
                        </div>
                        <div className="bpd-ask-hint">PRESS TO TALK · OR TYPE YOUR OWN</div>
                      </div>

                      {/* centre play/pause indicator — visible while paused */}
                      <div className={`bpd-tap-indicator${isActive && !isPlaying ? " on" : ""}`} aria-hidden="true">
                        {isActive && isPlaying ? <PauseIcon /> : <PlayIcon />}
                      </div>
                      {!hasStarted && isActive && <div className="bpd-start-hint">TAP TO PLAY THE BRIEFING</div>}
                    </div>
                  </div>
                );
              })}

              {/* the finish line — the whole point of the product */}
              <div className="bpd-page" style={{ top: DONE_PAGE_INDEX * PHONE_HEIGHT_PX }}>
                <div className="bpd-done" aria-hidden={activeIndex !== DONE_PAGE_INDEX}>
                  <div className="wash" aria-hidden="true" />
                  <div className="done-counter">
                    {BLIP_DEMO_FEED_TOTAL} / {BLIP_DEMO_FEED_TOTAL} · DONE
                  </div>
                  <h2>
                    You’re all
                    <br />
                    caught up.
                  </h2>
                  <p>We’ll see you tomorrow with your 30 stories, 30 reels.</p>
                  <div className="rule" aria-hidden="true" />
                  <button
                    type="button"
                    className="replay"
                    onClick={handleReplay}
                    tabIndex={activeIndex === DONE_PAGE_INDEX ? 0 : -1}
                  >
                    ↻ REPLAY TODAY’S BRIEFING
                  </button>
                </div>
              </div>
            </div>

            {/* prev/next story chevrons */}
            <div className="bpd-nav">
              <button
                type="button"
                aria-label="Previous story"
                disabled={activeIndex === 0}
                onClick={() => goToPage(activeIndex - 1, isPlaying)}
              >
                <ChevronUpIcon />
              </button>
              <button
                type="button"
                aria-label="Next story"
                disabled={activeIndex === DONE_PAGE_INDEX}
                onClick={() => goToPage(activeIndex + 1, isPlaying)}
              >
                <ChevronDownIcon />
              </button>
            </div>

            {/* device chrome */}
            <div className="bpd-island" aria-hidden="true" />
            <div className="bpd-status" aria-hidden="true">
              <span className="time">7:18</span>
              <span className="glyphs">
                <SignalBarsIcon />
                <WifiIcon />
                <BatteryIcon />
              </span>
            </div>
            <div className="bpd-home-indicator" aria-hidden="true" />
          </div>
        </section>
      </div>

      {/* one audio element per story; only the active one ever plays */}
      {BLIP_DEMO_STORIES.map((story, storyIndex) => (
        <audio
          key={story.story_id}
          ref={(element) => {
            audioRefs.current[storyIndex] = element;
          }}
          src={story.audio_src}
          preload="none"
          playsInline
          onEnded={storyIndex === activeIndex ? handleAudioEnded : undefined}
        >
          <track kind="captions" />
        </audio>
      ))}
    </div>
  );
}

// --- the blip wordmark (arc geometry vendored verbatim from the app) ---------

const SIGNAL_ARC_RADII = [3.2, 6.2, 9.2] as const;
const SIGNAL_COS_46_DEG = 0.695;
const SIGNAL_SIN_46_DEG = 0.719;
const SIGNAL_CENTER_Y = 7;

function BlipWordmark() {
  return (
    <span className="bpd-blip">
      bl
      <span className="bi">
        {"ı"}
        <i className="tittle">
          <b className="bdot" />
          <svg className="sig" viewBox="0 0 11 14" fill="none" aria-hidden="true">
            {SIGNAL_ARC_RADII.map((radius, waveIndex) => {
              const x = (SIGNAL_COS_46_DEG * radius).toFixed(2);
              const yTop = (SIGNAL_CENTER_Y - SIGNAL_SIN_46_DEG * radius).toFixed(2);
              const yBottom = (SIGNAL_CENTER_Y + SIGNAL_SIN_46_DEG * radius).toFixed(2);
              return (
                <path
                  key={radius}
                  className={`bw${waveIndex + 1}`}
                  d={`M${x} ${yTop} A${radius} ${radius} 0 0 1 ${x} ${yBottom}`}
                />
              );
            })}
          </svg>
        </i>
      </span>
      p
    </span>
  );
}

// --- icons (paths vendored from the app's BlipIconDefs sprite) ---------------

interface IconProps {
  strokeWidth?: number;
}

function IconSvg({ children, strokeWidth = 1.8 }: React.PropsWithChildren<IconProps>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function ProfileIcon() {
  return (
    <IconSvg>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
    </IconSvg>
  );
}

function BookmarkIcon() {
  return (
    <IconSvg>
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
    </IconSvg>
  );
}

function ShareIcon() {
  return (
    <IconSvg>
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M7 8l5-5 5 5" />
    </IconSvg>
  );
}

function CheckIcon() {
  return (
    <IconSvg strokeWidth={2.2}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </IconSvg>
  );
}

function MicIcon() {
  return (
    <IconSvg>
      <path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3ZM6 11a6 6 0 0 0 12 0M12 17v4M8 21h8" />
    </IconSvg>
  );
}

function KeyboardIcon() {
  return (
    <IconSvg strokeWidth={1.6}>
      <rect x="3" y="6" width="18" height="12" rx="2.2" />
      <path d="M7 10h.01M11 10h.01M15 10h.01M8 14h8" strokeWidth={1.7} />
    </IconSvg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.87l10.5-6.5a1 1 0 0 0 0-1.74L9.5 4.63A1 1 0 0 0 8 5.5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6.5" y="5" width="4" height="14" rx="1.3" fill="currentColor" />
      <rect x="13.5" y="5" width="4" height="14" rx="1.3" fill="currentColor" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <IconSvg>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </IconSvg>
  );
}

function ChevronUpIcon() {
  return (
    <IconSvg strokeWidth={2}>
      <path d="M6 15l6-6 6 6" />
    </IconSvg>
  );
}

function ChevronDownIcon() {
  return (
    <IconSvg strokeWidth={2}>
      <path d="M6 9l6 6 6-6" />
    </IconSvg>
  );
}

function SignalBarsIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
      <rect x="0" y="7" width="3" height="4" rx="1" fill="#fff" />
      <rect x="4.5" y="5" width="3" height="6" rx="1" fill="#fff" />
      <rect x="9" y="2.5" width="3" height="8.5" rx="1" fill="#fff" />
      <rect x="13.5" y="0" width="3" height="11" rx="1" fill="#fff" opacity="0.4" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
      <path
        d="M8 10.5 L5.6 7.7 A3.8 3.8 0 0 1 10.4 7.7 Z M3.6 5.4 A6.8 6.8 0 0 1 12.4 5.4 M1.2 3 A10 10 0 0 1 14.8 3"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
      <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" fill="none" stroke="#fff" strokeOpacity="0.5" />
      <rect x="2" y="2" width="15" height="8" rx="2" fill="#fff" />
      <path d="M23 4v4a2.2 2.2 0 0 0 0-4Z" fill="#fff" fillOpacity="0.5" />
    </svg>
  );
}
