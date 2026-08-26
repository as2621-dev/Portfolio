"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

export interface ProofFrameProps {
  embed_src: string;
  embed_title: string;
  /** Visible frame height in px (the on-page height never changes with scaling). */
  frame_height: number;
  /**
   * Narrowest width (px) at which the captured page still lays out correctly.
   * Below it the iframe renders at this width and is CSS-scaled down to fit —
   * a zoomed-out view of the real desktop render — instead of letting the
   * capture's fixed layout collapse. Omit for captures that are responsive.
   */
  min_content_width?: number;
}

/**
 * Sandboxed iframe for verbatim product captures (`/public/proof/`). Proof
 * files are pipeline output and must never be edited for presentation, so
 * responsive behavior lives here: on containers narrower than
 * `min_content_width` the capture keeps its designed layout and shrinks
 * uniformly, like a zoomed-out newspaper page. Scroll inside still works.
 *
 * @example
 * <ProofFrame embed_src="/proof/orbit/today.html" embed_title="orbit digest"
 *             frame_height={720} min_content_width={860} />
 */
export function ProofFrame({ embed_src, embed_title, frame_height, min_content_width }: ProofFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [container_width, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!min_content_width) return;
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [min_content_width]);

  const scale_factor =
    min_content_width && container_width && container_width < min_content_width
      ? container_width / min_content_width
      : 1;

  const iframe_style: React.CSSProperties =
    scale_factor < 1 && min_content_width
      ? {
          display: "block",
          width: min_content_width,
          height: frame_height / scale_factor,
          transform: `scale(${scale_factor})`,
          transformOrigin: "top left",
          border: "none",
          background: "#ffffff",
        }
      : { display: "block", width: "100%", height: frame_height, border: "none", background: "#ffffff" };

  return (
    <div ref={containerRef} style={{ height: frame_height, overflow: "hidden", background: "#ffffff" }}>
      {/* Captured product HTML is static and self-contained; scripts stay
          sandboxed with no same-origin access to the portfolio itself. */}
      <iframe
        src={embed_src}
        title={embed_title}
        loading="lazy"
        sandbox="allow-scripts allow-popups"
        style={iframe_style}
      />
    </div>
  );
}
