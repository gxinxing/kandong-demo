"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

interface ScanSpinnerProps {
  accent?: "red" | "yellow" | "green" | "neutral";
}

const ACCENT_COLOR: Record<NonNullable<ScanSpinnerProps["accent"]>, string> = {
  red: "var(--color-red)",
  yellow: "var(--color-yellow)",
  green: "var(--color-green)",
  neutral: "var(--color-fg)",
};

/**
 * Editorial dot-grid scanner. A 4×4 grid of square ink blocks pulses in a
 * type-setter rhythm. Static fallback on prefers-reduced-motion.
 */
export function ScanSpinner({ accent = "neutral" }: ScanSpinnerProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const color = ACCENT_COLOR[accent];

  const wrapStyle: CSSProperties = {
    width: 240,
    height: 240,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(4, 1fr)",
    gap: 12,
    margin: "0 auto",
    padding: 16,
    background: "var(--color-paper)",
    border: "var(--rule-medium) solid var(--color-rule)",
    boxShadow: "0 1px 0 var(--color-rule), 6px 6px 0 var(--color-rule)",
  };

  const blocks = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div
      role="progressbar"
      aria-label="正在看懂截图,请稍等"
      style={wrapStyle}
    >
      {blocks.map((i) => {
        const delay = ((i * 79) % 1400) / 1400;
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              background: color,
              animation: reducedMotion
                ? undefined
                : `kd-pulse 1.4s ${delay}s ease-in-out infinite`,
              opacity: reducedMotion ? 1 : 0.2,
            }}
          />
        );
      })}
      <style>{`
        @keyframes kd-pulse {
          0%, 100% { opacity: 0.18; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="progressbar"] span { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}

export default ScanSpinner;
