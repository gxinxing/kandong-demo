"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { BangBangAvatar } from "@/components/bangbang/BangBangAvatar";
import { Bubble } from "@/components/bubble/Bubble";
import { AutoSpeech } from "@/components/voice/AutoSpeech";
import { SCAN_VOICE_SCRIPT } from "@/components/voice/useVoiceScript";
import type { DemoCaseId } from "@/lib/demo-data";

const VALID_IDS: readonly DemoCaseId[] = [
  "demo-black",
  "demo-gray",
  "demo-white",
];

const SCAN_MS = 2500;
const RING_SIZE = 200;
const RING_RADIUS = 88;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

function isDemoCaseId(value: string | null): value is DemoCaseId {
  return value !== null && (VALID_IDS as readonly string[]).includes(value);
}

function fallbackDemoId(): DemoCaseId {
  const idx = Math.floor(Date.now() / 60000) % VALID_IDS.length;
  return VALID_IDS[idx];
}

export function ScanView() {
  const router = useRouter();
  const params = useSearchParams();
  const [progress, setProgress] = useState(0);
  const navigatedRef = useRef(false);

  const demoId = useMemo<DemoCaseId>(() => {
    const raw = params.get("demo");
    return isDemoCaseId(raw) ? raw : fallbackDemoId();
  }, [params]);

  const scene = params.get("scene") ?? "";

  useEffect(() => {
    if (navigatedRef.current) return;
    const startedAt = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(100, Math.round((elapsed / SCAN_MS) * 100)));
    }, 60);
    const done = window.setTimeout(() => {
      navigatedRef.current = true;
      const sceneQs = scene ? `?scene=${encodeURIComponent(scene)}` : "";
      router.replace(`/result/${demoId}${sceneQs}`);
    }, SCAN_MS);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [demoId, scene, router]);

  const dashOffset = RING_CIRC * (1 - progress / 100);

  const ringWrapStyle: CSSProperties = {
    position: "relative",
    width: RING_SIZE,
    height: RING_SIZE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const avatarCenterStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <PageShell title="正在帮您看" hideBack>
      <section
        aria-label="正在分析"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-5)",
          paddingTop: "var(--space-4)",
        }}
      >
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="扫描进度"
          style={ringWrapStyle}
        >
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            aria-hidden="true"
          >
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke="var(--color-line)"
              strokeWidth={8}
              fill="none"
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke="var(--color-brand)"
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
              style={{ transition: "stroke-dashoffset 80ms linear" }}
            />
          </svg>
          <span style={avatarCenterStyle}>
            <BangBangAvatar size="lg" mood="thinking" />
          </span>
        </div>

        <div style={{ width: "100%", maxWidth: 400 }}>
          <Bubble tone="emphasis" avatar speak={SCAN_VOICE_SCRIPT}>
            正在帮您看…大概 2 秒就好
          </Bubble>
        </div>

        <p
          aria-hidden="true"
          style={{
            margin: 0,
            fontSize: "var(--text-caption)",
            color: "var(--color-ink-soft)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {progress}%
        </p>
      </section>

      <AutoSpeech script={SCAN_VOICE_SCRIPT} />
    </PageShell>
  );
}

export default ScanView;
