"use client";

import { type RefObject, useEffect, useState } from "react";

/**
 * One-shot "chart entered the viewport" flag used to trigger draw-in motion
 * (bars growing from the baseline). Mirrors <Reveal>'s behavior, including the
 * prefers-reduced-motion escape hatch.
 */
export function useChartReveal(containerRef: RefObject<HTMLElement | null>): boolean {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [containerRef]);

  return isRevealed;
}
