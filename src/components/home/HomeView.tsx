"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { BangBangAvatar } from "@/components/bangbang/BangBangAvatar";
import { Bubble } from "@/components/bubble/Bubble";
import { PageShell } from "@/components/layout/PageShell";
import { SceneShortcuts } from "@/components/scene/SceneShortcuts";
import { BigButton } from "@/components/ui/BigButton";
import { AutoSpeech } from "@/components/voice/AutoSpeech";
import { HoldToTalkBar } from "@/components/voice/HoldToTalkBar";
import { HOME_VOICE_SCRIPT } from "@/components/voice/useVoiceScript";

const introCardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "var(--space-3)",
  padding: "var(--space-5) var(--space-4) var(--space-4)",
  borderRadius: "var(--radius-lg)",
  position: "relative",
};

const ctaStackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: "var(--space-3)",
};

const cameraCardStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--space-4)",
  width: "100%",
  padding: "var(--space-5)",
  background: "var(--color-ink)",
  color: "var(--color-surface)",
  border: "none",
  borderRadius: "var(--radius-lg)",
  cursor: "pointer",
  textAlign: "left",
  boxShadow:
    "0 14px 32px -12px rgba(42, 31, 18, 0.42), 0 4px 10px -2px rgba(255, 152, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  transition: "transform var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out)",
};

const cameraLeftStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  flex: 1,
  minWidth: 0,
};

const cameraTitleStyle: CSSProperties = {
  fontSize: "var(--text-emphasis)",
  fontWeight: 800,
  lineHeight: 1.2,
  letterSpacing: "-0.01em",
};

const cameraTitleAccentStyle: CSSProperties = {
  fontFamily: "var(--font-serif-stack)",
  fontStyle: "italic",
  fontWeight: 500,
  background: "var(--gradient-amber)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "#FFB74D",
  marginRight: 4,
};

const cameraHintStyle: CSSProperties = {
  fontSize: "var(--text-caption)",
  fontWeight: 500,
  color: "rgba(255, 253, 247, 0.78)",
  lineHeight: 1.3,
};

const cameraIconWrapStyle: CSSProperties = {
  width: 76,
  height: 76,
  borderRadius: "50%",
  background: "var(--gradient-amber)",
  color: "#1A1410",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  fontSize: 36,
  lineHeight: 1,
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.55), 0 6px 14px -4px rgba(255, 152, 0, 0.55), 0 2px 0 rgba(110,80,40,0.18)",
};

const secondaryRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "var(--space-3)",
};

const dividerWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-3)",
  marginTop: "var(--space-2)",
};

const dividerLineStyle: CSSProperties = {
  flex: 1,
  height: 1,
  background:
    "repeating-linear-gradient(to right, var(--color-line-strong) 0 6px, transparent 6px 12px)",
  border: 0,
  opacity: 0.55,
};

const dividerCaptionStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: "var(--text-caption)",
  color: "var(--color-ink-soft)",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const ornamentStyle: CSSProperties = {
  color: "var(--color-line-strong)",
  fontSize: 14,
  lineHeight: 1,
};

export function HomeView() {
  const router = useRouter();

  function goScanCamera() {
    router.push("/scan?demo=demo-gray&scene=拍照");
  }

  function goScanAlbum() {
    router.push("/scan?demo=demo-gray&scene=相册");
  }

  function goExample() {
    router.push("/result/demo-white");
  }

  return (
    <PageShell title="看懂一下" hideBack footer={<HoldToTalkBar />}>
      <AutoSpeech script={HOME_VOICE_SCRIPT} silent />

      <section
        aria-label="帮帮欢迎"
        className="kd-tilt-l kd-card-soft"
        style={introCardStyle}
      >
        <BangBangAvatar size="lg" mood="reassure" />
        <Bubble tone="emphasis" speak={HOME_VOICE_SCRIPT} tail="none">
          <span className="kd-serif">帮帮</span>在这儿。<br />
          看不懂、看不清，<br />
          都让<span className="kd-serif">帮帮</span>先看看。
        </Bubble>
      </section>

      <section aria-label="开始扫描" style={ctaStackStyle}>
        <button
          type="button"
          onClick={goScanCamera}
          aria-label="拍照看一看"
          style={cameraCardStyle}
          className="active:scale-[0.98]"
        >
          <span style={cameraLeftStyle}>
            <span style={cameraTitleStyle}>
              <span style={cameraTitleAccentStyle}>拍一张</span>看看
            </span>
            <span style={cameraHintStyle}>对着想看懂的东西按一下</span>
          </span>
          <span style={cameraIconWrapStyle} aria-hidden="true">
            📷
          </span>
        </button>

        <div style={secondaryRowStyle}>
          <BigButton variant="secondary" size="md" onClick={goScanAlbum}>
            从相册选
          </BigButton>
          <BigButton variant="ghost" size="md" onClick={goExample}>
            看个例子
          </BigButton>
        </div>
      </section>

      <div style={dividerWrapStyle} aria-hidden="true">
        <span style={dividerLineStyle} />
        <span style={dividerCaptionStyle}>
          <span style={ornamentStyle}>✦</span>
          或者从下面挑一个看
          <span style={ornamentStyle}>✦</span>
        </span>
        <span style={dividerLineStyle} />
      </div>

      <SceneShortcuts />
    </PageShell>
  );
}

export default HomeView;
