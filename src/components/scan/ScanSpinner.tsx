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
  neutral: "var(--color-amethyst)",
};

/**
 * Editorial dot-grid scanner. 4×4 amethyst dots pulse in a staggered rhythm
 * directly on the page atmosphere — no porcelain frame, no shadow. Static
 * fallback on prefers-reduced-motion.
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
    width: 200,
    height: 200,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(4, 1fr)",
    gap: 18,
  };

  const blocks = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div role="progressbar" aria-label="正在看懂截图,请稍等" style={wrapStyle}>
      {blocks.map((i) => {
        const delay = ((i * 79) % 1400) / 1400;
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              background: color,
              borderRadius: "var(--radius-full)",
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
          0%, 100% { opacity: 0.18; transform: scale(0.72); }
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
