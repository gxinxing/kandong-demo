"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { BigButton } from "@/components/ui/BigButton";
import { AutoSpeech } from "@/components/voice/AutoSpeech";
import { HOME_VOICE_SCRIPT } from "@/components/voice/useVoiceScript";
import { loadDemoData } from "@/lib/demo-data";
import type { DemoCase, DemoCaseId } from "@/lib/demo-data";

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

const LEVEL_GLYPH: Record<DemoCase["level"], string> = {
  red: "红",
  yellow: "黄",
  green: "绿",
};

const LEVEL_BG: Record<DemoCase["level"], string> = {
  red: "var(--color-red)",
  yellow: "var(--color-yellow)",
  green: "var(--color-green)",
};

const LEVEL_INK: Record<DemoCase["level"], string> = {
  red: "#fff5f0",
  yellow: "#1a1000",
  green: "#f0fff5",
};

function formatToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}·${m}·${day}`;
}

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
        if (cancelled) return;
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
      if (navigating) return;
      setNavigating(source);
      const demoId = pickDemoIdFromSource();
      navTimerRef.current = window.setTimeout(() => {
        navTimerRef.current = null;
        router.push(`/scan?source=${source}&demo=${demoId}`);
      }, 1200);
    },
    [navigating, router],
  );

  const today = useMemo(() => formatToday(), []);

  // Hero — typographic stack, no rounded card. Asymmetric weight on left,
  // small metadata column on right.
  const heroStyle: CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-5)",
    paddingBottom: "var(--space-6)",
  };

  const heroDisplayStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(76px, 22vw, 108px)",
    fontWeight: 400,
    lineHeight: 0.88,
    letterSpacing: "-0.04em",
    color: "var(--color-ink)",
    margin: 0,
  };

  const heroSubStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(22px, 6.5vw, 30px)",
    fontWeight: 400,
    fontStyle: "italic",
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    color: "var(--color-fg)",
    margin: 0,
    maxWidth: "30ch",
  };

  return (
    <PageShell
      masthead={{
        kicker: "KANDONG · 反诈助手",
        issue: "VOL.1 · No.001",
        date: today,
      }}
    >
      {/* HERO — editorial spread */}
      <section style={heroStyle} aria-label="看懂一下">
        <span className="kd-section-eyebrow">为爸妈而做 · For Parents</span>
        <h1 style={heroDisplayStyle}>
          看懂
          <br />
          一下
        </h1>
        <p style={heroSubStyle}>
          上传一张可疑截图,<br />
          AI 用大字加语音<br />
          告诉您「是不是骗子」。
        </p>
        <hr className="kd-hair" />
      </section>

      {/* CTA STACK — hanging serif numerals over editorial label rows */}
      <section
        aria-label="开始扫描"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <span className="kd-section-eyebrow">开始 · Start Here</span>

        <BigButton
          onClick={() => startStubbedScan("camera")}
          disabled={navigating !== null}
          leading={
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 44,
                fontWeight: 400,
                lineHeight: 1,
                color: "var(--color-amethyst-ink)",
                minWidth: "1.4em",
              }}
            >
              一
            </span>
          }
        >
          {navigating === "camera" ? "打开相机…" : "拍照看一下"}
        </BigButton>

        <BigButton
          variant="secondary"
          onClick={() => startStubbedScan("album")}
          disabled={navigating !== null}
          leading={
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 44,
                fontWeight: 400,
                lineHeight: 1,
                color: "var(--color-ink)",
                minWidth: "1.4em",
              }}
            >
              二
            </span>
          }
        >
          {navigating === "album" ? "打开相册…" : "从相册选"}
        </BigButton>

        <BigButton
          variant="ghost"
          onClick={() => setPickerOpen((v) => !v)}
          disabled={navigating !== null}
          aria-expanded={pickerOpen}
          aria-controls="kd-demo-picker"
          trailingArrow={false}
          leading={
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 44,
                fontWeight: 400,
                lineHeight: 1,
                color: "var(--color-muted)",
                minWidth: "1.4em",
              }}
            >
              三
            </span>
          }
        >
          {pickerOpen ? "收起例子" : "先试一下"}
        </BigButton>
      </section>

      {pickerOpen ? (
        <section
          id="kd-demo-picker"
          aria-label="演示案例选择"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            paddingTop: "var(--space-5)",
            borderTop: "2px solid var(--color-ink)",
          }}
        >
          <span className="kd-section-eyebrow">样张目录 · Case Archive</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 9vw, 44px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              margin: 0,
              color: "var(--color-ink)",
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
            <ul className="kd-ruled-list" aria-label="演示案例">
              {options.map((opt) => (
                <li key={opt.id}>
                  <span aria-hidden="true">
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 56,
                        height: 56,
                        borderRadius: "var(--radius-lg)",
                        background: LEVEL_BG[opt.level],
                        color: LEVEL_INK[opt.level],
                        fontFamily: "var(--font-display)",
                        fontSize: 32,
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {LEVEL_GLYPH[opt.level]}
                    </span>
                  </span>
                  <a
                    href={`/scan?demo=${opt.id}`}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(22px, 6vw, 28px)",
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                      color: "var(--color-ink)",
                      textDecoration: "none",
                      borderBottom: "1px solid currentColor",
                      paddingBottom: 2,
                    }}
                  >
                    {opt.title}
                  </a>
                </li>
              ))}
            </ul>
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
