"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

export interface SceneTile {
  key: string;
  emoji: string;
  label: string;
  demoId: "demo-white" | "demo-gray" | "demo-black";
  isScam: boolean;
  /** Soft tinted halo around emoji for hand-note feel. */
  halo: string;
}

export const SCENE_TILES: ReadonlyArray<SceneTile> = [
  { key: "medicine", emoji: "💊", label: "药品", demoId: "demo-white", isScam: false, halo: "#E8F3E0" },
  { key: "seasoning", emoji: "🧂", label: "调料", demoId: "demo-white", isScam: false, halo: "#FFEFD5" },
  { key: "ingredient", emoji: "🥬", label: "食材", demoId: "demo-white", isScam: false, halo: "#E0F0D9" },
  { key: "reading", emoji: "📖", label: "读数", demoId: "demo-white", isScam: false, halo: "#E5EBF7" },
  { key: "bill", emoji: "🧾", label: "缴费单", demoId: "demo-white", isScam: false, halo: "#FBE9D7" },
  { key: "laundry", emoji: "👕", label: "洗衣标签", demoId: "demo-white", isScam: false, halo: "#E8E2F4" },
  { key: "wechat-funnel", emoji: "💬", label: "微信引流", demoId: "demo-gray", isScam: true, halo: "#FDF2DD" },
  { key: "fake-authority", emoji: "⚠️", label: "假公检法", demoId: "demo-black", isScam: true, halo: "#FCE6E6" },
];

const sectionStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-4)",
};

const headingRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "var(--space-3)",
};

const headingStyle: CSSProperties = {
  fontSize: "var(--text-title)",
  fontWeight: 800,
  color: "var(--color-ink)",
  margin: 0,
  letterSpacing: "-0.01em",
  lineHeight: 1.2,
};

const headingHintStyle: CSSProperties = {
  fontSize: "var(--text-caption)",
  color: "var(--color-ink-soft)",
  fontWeight: 600,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "var(--space-3)",
};

const tileBaseStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "var(--space-2)",
  borderRadius: "var(--radius-lg)",
  minHeight: 104,
  minWidth: "var(--touch-min)",
  padding: "var(--space-3) var(--space-2)",
  textDecoration: "none",
  color: "var(--color-ink)",
};

const haloStyle = (color: string): CSSProperties => ({
  width: 52,
  height: 52,
  borderRadius: "50%",
  background: color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 2px rgba(110,80,40,0.06)",
});

const emojiStyle: CSSProperties = {
  fontSize: 30,
  lineHeight: 1,
};

const labelStyle: CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: "var(--color-ink)",
  textAlign: "center",
  lineHeight: 1.2,
  letterSpacing: 0,
};

const TILT_CLASSES = ["kd-tilt-l", "kd-tilt-r", "kd-tilt-rr", "kd-tilt-ll"] as const;

export function SceneShortcuts() {
  return (
    <section aria-label="生活场景快捷入口" style={sectionStyle}>
      <div style={headingRowStyle}>
        <h2 style={headingStyle}>挑一个看</h2>
        <span style={headingHintStyle} aria-hidden="true">点一下就行</span>
      </div>
      <div style={gridStyle}>
        {SCENE_TILES.map((tile, i) => (
          <Link
            key={tile.key}
            href={`/scan?demo=${tile.demoId}&scene=${encodeURIComponent(tile.label)}`}
            aria-label={`查看「${tile.label}」`}
            className={`kd-scene-tile kd-tile-premium active:scale-[0.94] ${TILT_CLASSES[i % TILT_CLASSES.length]}`}
            style={tileBaseStyle}
          >
            <span style={haloStyle(tile.halo)}>
              <span aria-hidden="true" style={emojiStyle}>
                {tile.emoji}
              </span>
            </span>
            <span style={labelStyle}>{tile.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SceneShortcuts;
