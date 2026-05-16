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

  const eyebrowStyle: CSSProperties = {
    fontSize: "var(--text-eyebrow)",
    fontWeight: 800,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "var(--color-muted)",
    textAlign: "center",
  };

  const stackHeadlineStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-hero)",
    fontWeight: 900,
    lineHeight: 0.9,
    letterSpacing: "-0.03em",
    color: "var(--color-fg)",
    textAlign: "center",
    margin: 0,
    marginTop: "var(--space-3)",
  };

  const subStyle: CSSProperties = {
    fontSize: "var(--text-body)",
    color: "var(--color-muted)",
    textAlign: "center",
    marginTop: "var(--space-2)",
    fontWeight: 600,
  };

  const progressTrackStyle: CSSProperties = {
    marginTop: "var(--space-4)",
    height: 18,
    width: "100%",
    background: "var(--color-paper)",
    border: "var(--rule-medium) solid var(--color-rule)",
    overflow: "hidden",
  };

  const progressFillStyle: CSSProperties = {
    height: "100%",
    width: `${progress}%`,
    background: "var(--color-fg)",
    transition: "width 80ms linear",
  };

  const progressNumeralStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-title)",
    fontWeight: 900,
    letterSpacing: "-0.02em",
    color: "var(--color-fg)",
    textAlign: "center",
    marginTop: "var(--space-2)",
  };

  return (
    <PageShell
      masthead={{ kicker: "KANDONG · 看一下", issue: "DECODING", date: formatToday() }}
    >
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          paddingTop: "var(--space-3)",
        }}
      >
        <ScanSpinner accent="neutral" />
        <p style={{ ...eyebrowStyle, marginTop: "var(--space-3)" }}>
          ANALYZING · 正在看懂
        </p>
        <h1 style={stackHeadlineStyle}>
          正
          <br />
          在
          <br />
          看…
        </h1>
        <hr
          aria-hidden="true"
          style={{
            border: 0,
            height: "var(--rule-heavy)",
            background: "var(--color-rule)",
            margin: "var(--space-3) 0 var(--space-2)",
          }}
        />
        <p style={subStyle}>稍等几秒,我帮您看懂</p>
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
        <p style={progressNumeralStyle} aria-hidden="true">
          {String(progress).padStart(3, "0")}%
        </p>
      </section>

      <section style={{ marginTop: "var(--space-3)" }}>
        <AutoSpeech script={SCAN_VOICE_SCRIPT} />
      </section>
    </PageShell>
  );
}

export default ScanView;
