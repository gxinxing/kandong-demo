"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ScanSpinner } from "@/components/scan/ScanSpinner";
import { AutoSpeech } from "@/components/voice/AutoSpeech";
import { SCAN_VOICE_SCRIPT } from "@/components/voice/useVoiceScript";
import type { DemoCaseId } from "@/lib/demo-data";

const VALID_IDS: readonly DemoCaseId[] = [
  "demo-black",
  "demo-gray",
  "demo-white",
];

function isDemoCaseId(value: string | null): value is DemoCaseId {
  return value !== null && (VALID_IDS as readonly string[]).includes(value);
}

function fallbackDemoId(): DemoCaseId {
  const idx = Math.floor(Date.now() / 60000) % VALID_IDS.length;
  return VALID_IDS[idx];
}

function formatToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}·${m}·${day}`;
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

  useEffect(() => {
    if (navigatedRef.current) return;
    const startedAt = Date.now();
    const totalMs = 2500;
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(100, Math.round((elapsed / totalMs) * 100)));
    }, 80);
    const done = window.setTimeout(() => {
      navigatedRef.current = true;
      router.replace(`/result/${demoId}`);
    }, totalMs);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [demoId, router]);

  // Editorial scan — typographic. Big Fraunces percentage acts as the visual
  // anchor; dot grid sits on page atmosphere; thin amethyst rule progresses
  // beneath everything as a hair-rule readout.
  const headlineStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(72px, 22vw, 108px)",
    fontWeight: 400,
    lineHeight: 0.92,
    letterSpacing: "-0.04em",
    color: "var(--color-ink)",
    margin: 0,
  };

  const subStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontStyle: "italic",
    fontSize: "clamp(20px, 5.5vw, 26px)",
    fontWeight: 400,
    lineHeight: 1.3,
    color: "var(--color-fg)",
    margin: 0,
  };

  const percentStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(140px, 40vw, 200px)",
    fontWeight: 400,
    lineHeight: 0.85,
    letterSpacing: "-0.05em",
    color: "var(--color-ink)",
    margin: 0,
    textAlign: "right",
  };

  const percentSubStyle: CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "var(--color-muted)",
    display: "block",
    textAlign: "right",
    marginTop: "var(--space-2)",
  };

  const progressTrackStyle: CSSProperties = {
    position: "relative",
    height: 2,
    width: "100%",
    background: "var(--color-border)",
  };

  const progressFillStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: `${progress}%`,
    background: "var(--color-ink)",
    transition: "width 80ms linear",
  };

  return (
    <PageShell
      masthead={{ kicker: "KANDONG · 看一下", issue: "DECODING", date: formatToday() }}
    >
      <section
        aria-label="正在分析"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)",
        }}
      >
        <span className="kd-section-eyebrow">Analyzing · 正在看懂</span>
        <h1 style={headlineStyle}>
          正在
          <br />
          看…
        </h1>
        <p style={subStyle}>稍等几秒,<br />我帮您看懂这张图。</p>
      </section>

      <section
        aria-hidden="true"
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBlock: "var(--space-5)",
        }}
      >
        <ScanSpinner accent="neutral" />
      </section>

      <section
        aria-label="进度"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="分析进度"
          style={progressTrackStyle}
        >
          <div style={progressFillStyle} />
        </div>
        <p style={percentStyle} aria-hidden="true">
          {String(progress).padStart(2, "0")}
          <span
            style={{
              fontSize: "0.32em",
              letterSpacing: "0",
              verticalAlign: "0.6em",
              marginLeft: "0.05em",
              color: "var(--color-muted)",
            }}
          >
            %
          </span>
        </p>
        <span style={percentSubStyle}>Progress · 进度</span>
      </section>

      <section style={{ marginTop: "var(--space-2)" }}>
        <AutoSpeech script={SCAN_VOICE_SCRIPT} />
      </section>
    </PageShell>
  );
}

export default ScanView;
