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

/**
 * Deterministic fallback if the URL didn't carry a ?demo=... param. We map by
 * minute of day so the demo cycles across the three risk levels during a live
 * presentation rather than always rendering the same case.
 */
function fallbackDemoId(): DemoCaseId {
  const idx = Math.floor(Date.now() / 60000) % VALID_IDS.length;
  return VALID_IDS[idx];
}

/**
 * Client view for /scan. Must live in its own component because it calls
 * `useSearchParams()`, which Next 16 requires to be inside a <Suspense>
 * boundary so the rest of the route can prerender as static HTML.
 */
export function ScanView() {
  const router = useRouter();
  const params = useSearchParams();
  const [progress, setProgress] = useState(0);
  const navigatedRef = useRef(false);

  // Resolve demo id once on mount. PRD §13 — the spinner stays for 2.5s,
  // long enough to feel like an analysis, short enough that elderly users
  // don't think the app is stuck.
  const demoId = useMemo<DemoCaseId>(() => {
    const raw = params.get("demo");
    return isDemoCaseId(raw) ? raw : fallbackDemoId();
  }, [params]);

  useEffect(() => {
    if (navigatedRef.current) {
      return;
    }
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

  const heroStyle: CSSProperties = {
    fontSize: "var(--text-hero)",
    textAlign: "center",
    marginTop: "var(--space-4)",
  };

  const subStyle: CSSProperties = {
    fontSize: "var(--text-body)",
    color: "var(--color-muted)",
    textAlign: "center",
    marginTop: "var(--space-2)",
  };

  const progressTrackStyle: CSSProperties = {
    marginTop: "var(--space-4)",
    height: 16,
    width: "100%",
    background: "var(--color-surface)",
    borderRadius: 999,
    overflow: "hidden",
    boxShadow: "inset 0 0 0 2px var(--color-border)",
  };

  const progressFillStyle: CSSProperties = {
    height: "100%",
    width: `${progress}%`,
    background: "var(--color-fg)",
    transition: "width 80ms linear",
  };

  return (
    <PageShell>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "var(--space-5)",
        }}
      >
        <ScanSpinner accent="neutral" />
        <h1 style={heroStyle}>正在看…</h1>
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
      </section>

      <section style={{ marginTop: "var(--space-3)" }}>
        <AutoSpeech script={SCAN_VOICE_SCRIPT} />
      </section>
    </PageShell>
  );
}

export default ScanView;
