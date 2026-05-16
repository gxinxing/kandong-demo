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

const LEVEL_LABEL: Record<DemoCase["level"], string> = {
  red: "红",
  yellow: "黄",
  green: "绿",
};

const LEVEL_BG: Record<DemoCase["level"], string> = {
  red: "var(--color-red)",
  yellow: "var(--color-yellow)",
  green: "var(--color-green)",
};

const LEVEL_TEXT: Record<DemoCase["level"], string> = {
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

  const mastheadStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-masthead)",
    fontWeight: 900,
    lineHeight: 0.82,
    letterSpacing: "-0.04em",
    color: "var(--color-fg)",
    margin: 0,
  };

  const eyebrowStyle: CSSProperties = {
    fontSize: "var(--text-eyebrow)",
    fontWeight: 800,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "var(--color-fg)",
  };

  const subheadStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-title)",
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: "-0.01em",
    color: "var(--color-fg)",
    margin: 0,
    textWrap: "balance",
  };

  // Hero "risk灯 sample" — shows what the result looks like at a glance.
  const heroBlockStyle: CSSProperties = {
    background: "var(--color-red)",
    color: "#fff5f0",
    padding: "var(--space-3)",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "var(--space-3)",
    alignItems: "stretch",
    boxShadow: "0 1px 0 var(--color-rule), 6px 6px 0 var(--color-rule)",
    border: "var(--rule-medium) solid var(--color-rule)",
  };

  const heroGlyphStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(7rem, 5rem + 10vw, 11rem)",
    fontWeight: 900,
    lineHeight: 0.8,
    letterSpacing: "-0.04em",
    paddingRight: "var(--space-2)",
    borderRight: "var(--rule-medium) solid #fff5f0",
  };

  const heroLabelStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingLeft: "var(--space-1)",
    gap: "var(--space-2)",
  };

  return (
    <PageShell
      masthead={{ kicker: "KANDONG", issue: "反诈助手", date: today }}
    >
      {/* MASTHEAD */}
      <section style={{ paddingTop: "var(--space-2)" }}>
        <p style={eyebrowStyle}>给爸妈的反诈助手 · 第 001 期</p>
        <h1 style={{ ...mastheadStyle, marginTop: "var(--space-2)" }}>
          看
          <br />
          懂
          <br />
          一<br />
          下
        </h1>
        <hr
          aria-hidden="true"
          style={{
            border: 0,
            height: "var(--rule-heavy)",
            background: "var(--color-rule)",
            margin: "var(--space-3) 0",
          }}
        />
        <p style={subheadStyle}>
          上传一张<span style={{ background: "var(--color-yellow)", padding: "0 0.15em" }}>可疑截图</span>
          ，AI 用大字加语音
          告诉您「是不是骗子」。
        </p>
      </section>

      {/* HERO RISK灯 SAMPLE */}
      <section
        aria-label="风险灯示例"
        style={{ marginTop: "var(--space-2)" }}
      >
        <p
          style={{
            ...eyebrowStyle,
            marginBottom: "var(--space-2)",
            color: "var(--color-muted)",
          }}
        >
          看一眼就知道 · risk at a glance
        </p>
        <div style={heroBlockStyle}>
          <div aria-hidden="true" style={heroGlyphStyle}>
            红
          </div>
          <div style={heroLabelStyle}>
            <span
              style={{
                fontSize: "var(--text-eyebrow)",
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                opacity: 0.85,
              }}
            >
              STOP · 高风险
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 1.4rem + 2.6vw, 3rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              钱进去就回不来
            </span>
          </div>
        </div>
      </section>

      {/* CTA STACK */}
      <section
        aria-label="开始扫描"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          marginTop: "var(--space-2)",
        }}
      >
        <p style={eyebrowStyle}>开始 · start here</p>
        <BigButton
          onClick={() => startStubbedScan("camera")}
          disabled={navigating !== null}
          leading={
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-numeral)",
                fontWeight: 900,
                lineHeight: 0.8,
                color: "var(--color-bg)",
                opacity: 0.55,
                minWidth: "1.2em",
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
                fontSize: "var(--text-numeral)",
                fontWeight: 900,
                lineHeight: 0.8,
                color: "var(--color-fg)",
                opacity: 0.4,
                minWidth: "1.2em",
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
                fontSize: "var(--text-numeral)",
                fontWeight: 900,
                lineHeight: 0.8,
                color: "var(--color-fg)",
                opacity: 0.4,
                minWidth: "1.2em",
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
            marginTop: "var(--space-2)",
            borderTop: "var(--rule-heavy) solid var(--color-rule)",
            paddingTop: "var(--space-3)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          <p style={eyebrowStyle}>样张目录 · case archive</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-title)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              margin: 0,
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
                leading={
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 56,
                      height: 56,
                      padding: "0 var(--space-2)",
                      background: LEVEL_BG[opt.level],
                      color: LEVEL_TEXT[opt.level],
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-button)",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                      border: "var(--rule-medium) solid var(--color-rule)",
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
