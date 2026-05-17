"use client";

import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";

interface HoldToTalkBarProps {
  hint?: string;
  /** Fallback navigation when user releases — MVP voice isn't wired yet. */
  fallbackHref?: string;
}

const barStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--space-3)",
  background: "var(--color-card)",
  borderRadius: "var(--radius-pill)",
  padding: "var(--space-2) var(--space-3)",
  paddingLeft: "var(--space-6)",
  minHeight: 88,
  boxShadow: "var(--shadow-cta)",
  pointerEvents: "auto",
  position: "relative",
};

const dotStyle: CSSProperties = {
  position: "absolute",
  left: "var(--space-4)",
  top: "50%",
  transform: "translateY(-50%)",
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "var(--color-brand)",
  boxShadow: "0 0 0 4px rgba(31, 138, 60, 0.18)",
};

const hintStyle: CSSProperties = {
  fontSize: "var(--text-button)",
  color: "var(--color-ink)",
  fontWeight: 700,
  lineHeight: 1.2,
  flex: 1,
  minWidth: 0,
  paddingLeft: "var(--space-3)",
};

const buttonBaseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 72,
  height: 72,
  borderRadius: "50%",
  background: "var(--color-brand)",
  color: "#FFFFFF",
  border: "none",
  cursor: "pointer",
  flexShrink: 0,
  boxShadow: "0 4px 0 var(--color-brand-ink), 0 0 0 6px rgba(31, 138, 60, 0.12)",
  transition: "transform var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out)",
};

export function HoldToTalkBar({
  hint = "长按跟帮帮说",
  fallbackHref = "/scan?demo=demo-gray&scene=语音",
}: HoldToTalkBarProps) {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);

  function handleStart() {
    setPressed(true);
  }

  function handleEnd() {
    if (!pressed) return;
    setPressed(false);
    router.push(fallbackHref);
  }

  function handleCancel() {
    setPressed(false);
  }

  const buttonStyle: CSSProperties = {
    ...buttonBaseStyle,
    transform: pressed ? "translateY(2px) scale(0.96)" : undefined,
    boxShadow: pressed
      ? "0 1px 0 var(--color-brand-ink), 0 0 0 8px rgba(31, 138, 60, 0.22)"
      : buttonBaseStyle.boxShadow,
  };

  return (
    <div style={barStyle}>
      <span style={dotStyle} aria-hidden="true" />
      <span style={hintStyle}>{hint}</span>
      <button
        type="button"
        aria-label={hint}
        onPointerDown={handleStart}
        onPointerUp={handleEnd}
        onPointerCancel={handleCancel}
        onPointerLeave={handleCancel}
        style={buttonStyle}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      </button>
    </div>
  );
}

export default HoldToTalkBar;
