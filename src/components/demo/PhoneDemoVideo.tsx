"use client";

/**
 * PhoneDemoVideo — a pre-rendered product demo video presented in a phone
 * bezel, played on tap WITH sound (a user gesture, so autoplay policy allows
 * audio). Pausing and replaying both happen on the same tap target; a center
 * play glyph and a small hint line show while paused.
 *
 * The bezel ring mirrors the app's own device frame (blip-flow.css `.device`)
 * and the site's BlipReelPhoneDemo styling so the video sits visually beside
 * the interactive reel demo above it on the page.
 */
import { useCallback, useRef, useState } from "react";

export interface PhoneDemoVideoProps {
  /** Site-relative MP4 src. */
  video_src: string;
  /** Poster frame shown before first play. */
  video_poster_src: string;
  /** Accessible name for the video. */
  video_aria_label: string;
}

/** Display width cap (px) — matches the phone demo's logical device width. */
const PHONE_MAX_WIDTH_PX = 360;

export function PhoneDemoVideo({ video_src, video_poster_src, video_aria_label }: PhoneDemoVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const togglePlayback = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }
    if (videoElement.paused || videoElement.ended) {
      if (videoElement.ended) {
        videoElement.currentTime = 0;
      }
      setHasStarted(true);
      void videoElement.play().catch(() => setIsPlaying(false));
    } else {
      videoElement.pause();
    }
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: PHONE_MAX_WIDTH_PX,
          borderRadius: 48,
          background: "#000",
          // The app's device frame rings (blip-flow .device), softened for the page.
          boxShadow:
            "0 0 0 10px #1c1d22, 0 0 0 11px #2a2b31, 0 30px 70px -20px rgba(0,0,0,.55), 0 10px 26px -12px rgba(0,0,0,.4)",
          overflow: "hidden",
          margin: "12px 0",
        }}
      >
        {/* No <track>: the demo's speech is mirrored on-screen by the app UI
            itself (karaoke captions, chat transcript). */}
        <video
          ref={videoRef}
          src={video_src}
          poster={video_poster_src}
          preload="metadata"
          playsInline
          aria-label={video_aria_label}
          style={{ display: "block", width: "100%", height: "auto", borderRadius: 48 }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
        <button
          type="button"
          aria-label={isPlaying ? "Pause the demo video" : "Play the demo video with sound"}
          onClick={togglePlayback}
          style={{
            position: "absolute",
            inset: 0,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          {!isPlaying && (
            <span
              style={{
                width: 74,
                height: 74,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "rgba(0,0,0,.45)",
                border: "1px solid rgba(255,255,255,.28)",
                backdropFilter: "blur(6px)",
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.87l10.5-6.5a1 1 0 0 0 0-1.74L9.5 4.63A1 1 0 0 0 8 5.5Z" fill="#fff" />
              </svg>
            </span>
          )}
        </button>
        {!isPlaying && !hasStarted && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 26,
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,.75)",
              pointerEvents: "none",
            }}
          >
            TAP TO PLAY · WITH SOUND
          </div>
        )}
      </div>
    </div>
  );
}
