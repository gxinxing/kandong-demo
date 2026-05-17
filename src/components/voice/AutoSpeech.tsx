"use client";

import { useEffect, useRef } from "react";
import { SpeechButton } from "@/components/ui/SpeechButton";

interface AutoSpeechProps {
  /** Resolved TTS script (zh-CN). */
  script: string;
  /** Label for the manual replay button. */
  replayLabel?: string;
  className?: string;
  /** Headless mode — auto-speak on mount but render no visible replay button.
   * Use when the surrounding UI already exposes a replay affordance (e.g. a
   * Bubble with inline `speak`). */
  silent?: boolean;
}

/**
 * Speak `script` once on mount via the Web Speech API, then render a
 * <SpeechButton> so the user can replay. PRD §7/§8 — every page enters with
 * voice, and offers a visible 再听一遍 control for users who missed it.
 *
 * Audio playback is intentionally *not* gated by prefers-reduced-motion —
 * reduced motion governs visual animation, not assistive sound for elderly
 * users. The visual pulse styling lives in SpeechButton, which already honors
 * the global reduced-motion override in globals.css.
 */
export function AutoSpeech({
  script,
  replayLabel = "再听一遍",
  className,
  silent = false,
}: AutoSpeechProps) {
  const hasSpokenRef = useRef(false);

  useEffect(() => {
    if (hasSpokenRef.current) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    const synth = window.speechSynthesis;
    if (!synth || !script) {
      return;
    }
    hasSpokenRef.current = true;
    try {
      // Cancel any queued utterance — PRD §13 + browser quirk: speak() queues
      // by default, which causes audio overlap across page transitions.
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(script);
      utter.lang = "zh-CN";
      utter.rate = 0.9;
      utter.pitch = 1;
      utter.volume = 1;
      synth.speak(utter);
    } catch (err: unknown) {
      console.error("AutoSpeech: failed to start TTS", err);
    }

    return () => {
      // Stop ongoing speech when leaving the page so it doesn't bleed into the
      // next route's auto-speak.
      try {
        synth.cancel();
      } catch (err: unknown) {
        console.error("AutoSpeech: failed to cancel TTS on unmount", err);
      }
    };
  }, [script]);

  return silent ? null : (
    <SpeechButton text={script} label={replayLabel} className={className} />
  );
}

export default AutoSpeech;
