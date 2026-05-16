"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { BigButton } from "@/components/ui/BigButton";
import { AutoSpeech } from "@/components/voice/AutoSpeech";
import { HOME_VOICE_SCRIPT } from "@/components/voice/useVoiceScript";
import { loadDemoData } from "@/lib/demo-data";
import type { DemoCase, DemoCaseId } from "@/lib/demo-data";

/**
 * Picks one of the three demo cases deterministically per page load.
 * Used for the «拍照» / «从相册选» entry buttons which are stubs in v1.
 */
function pickDemoIdFromSource(): DemoCaseId {
  const ids: readonly DemoCaseId[] = ["demo-black", "demo-gray", "demo-white"];
  const idx = Math.floor(Math.random() * ids.length);
  return ids[idx];
}

interface DemoOption {
  id: DemoCaseId;
  level: DemoCase["level"];
  title: string;
  summary: string;
}

const LEVEL_LABEL: Record<DemoCase["level"], string> = {
  red: "红 · 高风险",
  yellow: "黄 · 要警惕",
  green: "绿 · 安全",
};

const LEVEL_ACCENT: Record<DemoCase["level"], string> = {
  red: "var(--color-red)",
  yellow: "var(--color-yellow)",
  green: "var(--color-green)",
};

const LEVEL_SOFT: Record<DemoCase["level"], string> = {
  red: "var(--color-red-soft)",
  yellow: "var(--color-yellow-soft)",
  green: "var(--color-green-soft)",
};

export function HomeView() {
  const router = useRouter();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [options, setOptions] = useState<readonly DemoOption[] | null>(null);
  const [navigating, setNavigating] = useState<null | "camera" | "album">(null);
  const navTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (navTimerRef.current !== null) {
        window.clearTimeout(navTimerRef.current);
        navTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadDemoData()
      .then((data) => {
        if (cancelled) {
          return;
        }
        setOptions(
          data.cases.map((c) => ({
            id: c.id,
            level: c.level,
            title: c.title,
            summary: c.summary,
          })),
        );
      })
      .catch((err: unknown) => {
        console.error("HomeView: failed to load demo data", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const startStubbedScan = useCallback(
    (source: "camera" | "album") => {
      if (navigating) {
        return;
      }
      setNavigating(source);
      const demoId = pickDemoIdFromSource();
      navTimerRef.current = window.setTimeout(() => {
        navTimerRef.current = null;
        router.push(`/scan?source=${source}&demo=${demoId}`);
      }, 1200);
    },
    [navigating, router],
  );

  const captionStyle: CSSProperties = {
    fontSize: "var(--text-caption)",
    color: "var(--color-muted)",
    fontWeight: 700,
    letterSpacing: "0.08em",
  };

  const heroStyle: CSSProperties = {
    fontSize: "var(--text-hero)",
    marginTop: "var(--space-2)",
  };

  const subheadStyle: CSSProperties = {
    marginTop: "var(--space-3)",
    fontSize: "var(--text-body)",
    color: "var(--color-muted)",
  };

  const pickerWrapStyle: CSSProperties = {
    marginTop: "var(--space-3)",
    background: "var(--color-surface)",
    border: "2px solid var(--color-border)",
    borderRadius: "var(--radius-card)",
    padding: "var(--space-3)",
    boxShadow: "var(--shadow-card)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  };

  return (
    <PageShell>
      <section style={{ paddingTop: "var(--space-4)" }}>
        <p style={captionStyle}>给爸妈的反诈助手</p>
        <h1 style={heroStyle}>看懂一下</h1>
        <p style={subheadStyle}>
          上传截图,AI 用大字加语音告诉您「是不是骗子」。
        </p>
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <BigButton
          onClick={() => startStubbedScan("camera")}
          disabled={navigating !== null}
          fullWidth
        >
          {navigating === "camera" ? "打开相机…" : "拍照看一下"}
        </BigButton>
        <BigButton
          variant="secondary"
          onClick={() => startStubbedScan("album")}
          disabled={navigating !== null}
          fullWidth
        >
          {navigating === "album" ? "打开相册…" : "从相册选"}
        </BigButton>
        <BigButton
          variant="ghost"
          onClick={() => setPickerOpen((v) => !v)}
          disabled={navigating !== null}
          aria-expanded={pickerOpen}
          aria-controls="kd-demo-picker"
          fullWidth
        >
          {pickerOpen ? "收起例子" : "先试一下"}
        </BigButton>
      </section>

      {pickerOpen ? (
        <section
          id="kd-demo-picker"
          aria-label="演示案例选择"
          style={pickerWrapStyle}
        >
          <h2
            style={{
              fontSize: "var(--text-title)",
              fontWeight: 800,
              marginBottom: "var(--space-2)",
            }}
          >
            点一个看看
          </h2>
          {options === null ? (
            <p
              style={{
                fontSize: "var(--text-body)",
                color: "var(--color-muted)",
              }}
            >
              正在加载例子…
            </p>
          ) : (
            options.map((opt) => (
              <BigButton
                key={opt.id}
                as="a"
                href={`/scan?demo=${opt.id}`}
                variant="secondary"
                fullWidth
                leading={
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 64,
                      height: 48,
                      padding: "0 16px",
                      borderRadius: 999,
                      background: LEVEL_SOFT[opt.level],
                      color: LEVEL_ACCENT[opt.level],
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {LEVEL_LABEL[opt.level]}
                  </span>
                }
              >
                {opt.title}
              </BigButton>
            ))
          )}
        </section>
      ) : null}

      <section style={{ marginTop: "var(--space-2)" }}>
        <AutoSpeech script={HOME_VOICE_SCRIPT} />
      </section>
    </PageShell>
  );
}

export default HomeView;
