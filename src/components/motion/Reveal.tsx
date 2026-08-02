"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

export interface RevealProps {
  children: React.ReactNode;
  /** Stagger offset applied via transition-delay. */
  delay_ms?: number;
  style?: React.CSSProperties;
}

/**
 * Scroll-reveal wrapper: fades + rises its children the first time they enter
 * the viewport (IntersectionObserver, one-shot). Honors prefers-reduced-motion
 * by showing content immediately. The transition itself lives in globals.css
 * (`.fp-reveal` / `.is-visible`) so timing stays a design-system concern.
 *
 * @example
 * <Reveal delay_ms={80}><Card>…</Card></Reveal>
 */
export function Reveal({ children, delay_ms = 0, style }: RevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fp-reveal${isVisible ? " is-visible" : ""}`}
      style={{ transitionDelay: delay_ms ? `${delay_ms}ms` : undefined, ...style }}
    >
      {children}
    </div>
  );
}
