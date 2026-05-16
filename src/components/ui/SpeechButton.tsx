"use client";

import { useEffect, useState } from "react";
import { BigButton } from "./BigButton";

interface SpeechButtonProps {
  /** Text the screen reader and TTS engine should speak (zh-CN). */
  text: string;
  /** Optional label override. Defaults to «再听一遍». */
  label?: string;
  /** Auto-speak once on mount. Defaults to false. */
  autoPlay?: boolean;
  className?: string;
}

const SPEAKER_ICON = (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11 5L6 9H2v6h4l5 4z" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

function getSynthesis(): SpeechSynthesis | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.speechSynthesis ?? null;
}

export function SpeechButton({
  text,
  label = "再听一遍",
  autoPlay = false,
  className,
}: SpeechButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSupported(getSynthesis() !== null);
  }, []);

  useEffect(() => {
    if (!mounted || !autoPlay || !supported || !text) {
      return;
    }
    speak();
    // We deliberately only auto-speak once after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, autoPlay, supported]);

  useEffect(() => {
    return () => {
      const synth = getSynthesis();
      if (synth && isPlaying) {
        synth.cancel();
      }
    };
  }, [isPlaying]);

  function speak() {
    const synth = getSynthesis();
    if (!synth || !text) {
      return;
    }
    try {
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "zh-CN";
      utter.rate = 0.9;
      utter.pitch = 1;
      utter.volume = 1;
      utter.onstart = () => setIsPlaying(true);
      utter.onend = () => setIsPlaying(false);
      utter.onerror = () => setIsPlaying(false);
      synth.speak(utter);
    } catch {
      setIsPlaying(false);
    }
  }

  if (!mounted) {
    return null;
  }

  if (!supported) {
    return null;
  }

  return (
    <BigButton
      variant="secondary"
      onClick={speak}
      className={className}
      leading={SPEAKER_ICON}
      aria-label={isPlaying ? "正在朗读，点击重新朗读" : `${label}，朗读这段文字`}
      aria-live="polite"
    >
      {isPlaying ? "正在朗读…" : label}
    </BigButton>
  );
}

export default SpeechButton;
