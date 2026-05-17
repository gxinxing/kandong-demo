"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { BangBangAvatar } from "@/components/bangbang/BangBangAvatar";

export type BubbleTone = "default" | "emphasis" | "strong" | "warn" | "danger";
export type BubbleTail = "left" | "right" | "none";

interface BubbleProps {
  children: ReactNode;
  tone?: BubbleTone;
  /** When provided, renders an inline 🔊 button that speaks this text via Web Speech. */
  speak?: string;
  /** Show a small 帮帮 avatar before the bubble. */
  avatar?: boolean;
  /** Speech-bubble tail direction. Default: "left" when avatar shown, else "none". */
  tail?: BubbleTail;
  className?: string;
}

const TONE_STYLE: Record<BubbleTone, CSSProperties> = {
  default: {
    background: "var(--color-bubble)",
    color: "var(--color-ink)",
    fontSize: "var(--text-body)",
    fontWeight: 500,
    boxShadow:
      "var(--shadow-bubble), inset 0 0 0 1.5px rgba(184, 153, 104, 0.32)",
  },
  emphasis: {
    background: "var(--color-bubble-2)",
    color: "var(--color-ink)",
    fontSize: "var(--text-emphasis)",
    fontWeight: 700,
    boxShadow:
      "var(--shadow-bubble), inset 0 0 0 1.5px rgba(184, 153, 104, 0.42)",
  },
  strong: {
    background: "var(--color-ink)",
    color: "var(--color-surface)",
    fontSize: "var(--text-emphasis)",
    fontWeight: 700,
    boxShadow:
      "var(--shadow-bubble), inset 0 0 0 1.5px rgba(255, 253, 247, 0.10)",
  },
  warn: {
    background: "var(--color-risk-yellow-soft)",
    color: "var(--color-ink)",
    fontSize: "var(--text-body)",
    fontWeight: 600,
    boxShadow:
      "var(--shadow-bubble), inset 0 0 0 1.5px rgba(232, 144, 0, 0.36)",
  },
  danger: {
    background: "var(--color-risk-red-soft)",
    color: "var(--color-ink)",
    fontSize: "var(--text-body)",
    fontWeight: 600,
    boxShadow:
      "var(--shadow-bubble), inset 0 0 0 1.5px rgba(212, 0, 0, 0.32)",
  },
};

function getSynthesis(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

function InlineSpeakButton({ text }: { text: string }) {
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSupported(getSynthesis() !== null);
  }, []);

  function speak() {
    const synth = getSynthesis();
    if (!synth || !text) return;
    try {
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "zh-CN";
      utter.rate = 0.9;
      utter.onstart = () => setIsPlaying(true);
      utter.onend = () => setIsPlaying(false);
      utter.onerror = () => setIsPlaying(false);
      synth.speak(utter);
    } catch {
      setIsPlaying(false);
    }
  }

  if (!mounted || !supported) return null;

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={isPlaying ? "正在朗读" : "朗读这段"}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        width: 44,
        height: 44,
        minWidth: 44,
        minHeight: 44,
        borderRadius: "var(--radius-pill)",
        border: "1.5px solid currentColor",
        background: "rgba(255, 253, 247, 0.55)",
        color: "inherit",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        cursor: "pointer",
        fontSize: 18,
        lineHeight: 1,
        opacity: 0.7,
      }}
    >
      <span aria-hidden="true">{isPlaying ? "🔈" : "🔊"}</span>
    </button>
  );
}

export function Bubble({
  children,
  tone = "default",
  speak,
  avatar = false,
  tail,
  className,
}: BubbleProps) {
  const toneStyle = TONE_STYLE[tone];
  const resolvedTail: BubbleTail = tail ?? (avatar ? "left" : "none");
  const tailClass =
    resolvedTail === "left"
      ? "kd-bubble-tail-l"
      : resolvedTail === "right"
        ? "kd-bubble-tail-r"
        : "";

  const bubbleStyle: CSSProperties = {
    ...toneStyle,
    padding: "var(--space-5) var(--space-5)",
    borderRadius: "var(--radius-bubble)",
    lineHeight: 1.5,
    letterSpacing: 0,
    display: "flex",
    alignItems: "center",
    gap: "var(--space-4)",
    flex: 1,
    minWidth: 0,
    position: "relative",
    marginBottom: resolvedTail === "none" ? 0 : "var(--space-2)",
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "var(--space-3)",
        width: "100%",
      }}
    >
      {avatar ? <BangBangAvatar size="sm" mood="idle" /> : null}
      <div className={tailClass} style={bubbleStyle}>
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
        {speak ? <InlineSpeakButton text={speak} /> : null}
      </div>
    </div>
  );
}

export default Bubble;
