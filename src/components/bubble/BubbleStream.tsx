"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Bubble, type BubbleTone } from "./Bubble";

export interface BubbleItem {
  /** Stable key. */
  key: string;
  tone?: BubbleTone;
  speak?: string;
  avatar?: boolean;
  content: React.ReactNode;
}

interface BubbleStreamProps {
  items: BubbleItem[];
  /** Stagger between bubble reveals in ms. Defaults to 240. */
  stagger?: number;
  className?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function BubbleStream({ items, stagger = 240, className }: BubbleStreamProps) {
  const [revealed, setRevealed] = useState<number>(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setRevealed(items.length);
      return;
    }
    setRevealed(1);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 2; i <= items.length; i += 1) {
      const t = setTimeout(() => setRevealed((r) => Math.max(r, i)), stagger * (i - 1));
      timers.push(t);
    }
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [items.length, stagger]);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        width: "100%",
      }}
    >
      {items.map((item, idx) => {
        const shown = idx < revealed;
        const style: CSSProperties = {
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : "translateY(8px)",
          transition: `opacity var(--motion-base) var(--ease-out), transform var(--motion-base) var(--ease-out)`,
        };
        return (
          <div key={item.key} style={style}>
            <Bubble tone={item.tone} speak={item.speak} avatar={item.avatar}>
              {item.content}
            </Bubble>
          </div>
        );
      })}
    </div>
  );
}

export default BubbleStream;
