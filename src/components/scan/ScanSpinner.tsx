"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

interface ScanSpinnerProps {
  /** Optional level — colors the ring. Defaults to a neutral ink color. */
  accent?: "red" | "yellow" | "green" | "neutral";
}

const ACCENT_COLOR: Record<NonNullable<ScanSpinnerProps["accent"]>, string> = {
  red: "var(--color-red)",
  yellow: "var(--color-yellow)",
  green: "var(--color-green)",
  neutral: "var(--color-fg)",
};

/**
 * 240px circular progress ring used on /scan. CSS-only — a conic-gradient that
 * rotates via `@keyframes`. Honors prefers-reduced-motion: when the user has
 * opted out of motion we render a static ring with «看一下…» text instead.
 */
export function ScanSpinner({ accent = "neutral" }: ScanSpinnerProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const color = ACCENT_COLOR[accent];

  const outerStyle: CSSProperties = {
    width: 240,
    height: 240,
    borderRadius: "50%",
    position: "relative",
    background: `conic-gradient(${color} 0deg, ${color} 270deg, transparent 270deg, transparent 360deg)`,
    animation: reducedMotion
      ? undefined
      : "kd-spin 1.4s linear infinite",
    margin: "0 auto",
    boxShadow: "var(--shadow-card)",
  };

  const innerStyle: CSSProperties = {
    position: "absolute",
    inset: 16,
    borderRadius: "50%",
    background: "var(--color-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "var(--text-button)",
    fontWeight: 700,
    color: "var(--color-fg)",
    letterSpacing: "0.04em",
  };

  return (
    <div
      role="progressbar"
      aria-label="正在看懂截图,请稍等"
      style={outerStyle}
    >
      <span style={innerStyle}>看一下…</span>
      <style>{`
        @keyframes kd-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="progressbar"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default ScanSpinner;
