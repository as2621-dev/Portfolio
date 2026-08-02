"use client";

import type React from "react";
import { useState } from "react";

export interface TabsProps {
  /** Tab labels; the first is selected by default when uncontrolled. */
  items: string[];
  /** Controlled active tab. Omit to let the component manage its own state. */
  active?: string;
  /** Fired with the newly selected tab label. */
  onChange?: (item: string) => void;
  style?: React.CSSProperties;
}

/**
 * Pill tab switcher inside a bordered track. Works controlled (`active` +
 * `onChange`) or uncontrolled. Used to filter the project grid.
 *
 * @example
 * <Tabs items={["All", "AI", "Product"]} active={tab} onChange={setTab} />
 */
export function Tabs({ items, active, onChange, style }: TabsProps) {
  const [internal, setInternal] = useState<string>(items[0]);
  const current = active ?? internal;

  const select = (item: string) => {
    setInternal(item);
    onChange?.(item);
  };

  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        gap: 6,
        background: "var(--paper)",
        border: "2px solid var(--ink)",
        borderRadius: "var(--radius-pill)",
        padding: 4,
        boxShadow: "var(--shadow-pop-sm)",
        ...style,
      }}
    >
      {items.map((item) => {
        const isActive = item === current;
        return (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => select(item)}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 14,
              padding: "8px 18px",
              borderRadius: "var(--radius-pill)",
              border: "none",
              cursor: "pointer",
              background: isActive ? "var(--ink)" : "transparent",
              color: isActive ? "#fff" : "var(--ink-2)",
              transition: "background var(--dur-fast),color var(--dur-fast)",
            }}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
