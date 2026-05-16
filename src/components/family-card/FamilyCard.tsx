"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { BigButton } from "@/components/ui/BigButton";
import type { DemoCase, DemoLevel } from "@/lib/demo-data";

interface FamilyCardProps {
  caseData: DemoCase;
}

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

interface LevelPalette {
  accent: string;
  onAccent: string;
  glyph: string;
  label: string;
  shout: string;
}

const LEVEL_PALETTE: Record<DemoLevel, LevelPalette> = {
  red: {
    accent: "#c0162a",
    onAccent: "#fff5f0",
    glyph: "红",
    label: "高风险",
    shout: "STOP",
  },
  yellow: {
    accent: "#d68b00",
    onAccent: "#1a1000",
    glyph: "黄",
    label: "要警惕",
    shout: "WAIT",
  },
  green: {
    accent: "#1e6a32",
    onAccent: "#f0fff5",
    glyph: "绿",
    label: "安全",
    shout: "OK",
  },
};

const PAPER = "#f5f0e6";
const INK = "#161616";
const RULE = "#161616";
const MUTED = "#5a5045";

const DISPLAY_STACK =
  '"Songti SC", "Source Han Serif SC", "Noto Serif CJK SC", "STSong", "SimSun", "PingFang SC", serif';
const SANS_STACK =
  '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans CJK SC", "Heiti SC", system-ui, sans-serif';

const DEPLOY_BASE_URL = "https://kandong.ai.syt.huickathon.cn";

const HANGING_NUMERAL = ["一", "二", "三", "四", "五"] as const;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  let current = "";
  for (const char of text) {
    const candidate = current + char;
    if (ctx.measureText(candidate).width > maxWidth && current.length > 0) {
      lines.push(current);
      current = char;
    } else {
      current = candidate;
    }
  }
  if (current.length > 0) lines.push(current);
  return lines;
}

function formatTodayLong(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}·${m}·${day}`;
}

function drawCard(canvas: HTMLCanvasElement, caseData: DemoCase): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const palette = LEVEL_PALETTE[caseData.level];

  // ===== Background: warm newsprint =====
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Subtle dot grain
  ctx.fillStyle = "rgba(22, 22, 22, 0.04)";
  for (let y = 8; y < CANVAS_HEIGHT; y += 18) {
    for (let x = 8; x < CANVAS_WIDTH; x += 18) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  const margin = 70;
  const innerW = CANVAS_WIDTH - margin * 2;

  // ===== MASTHEAD STRIP =====
  ctx.textBaseline = "alphabetic";
  ctx.font = `800 30px ${SANS_STACK}`;
  ctx.fillStyle = INK;
  ctx.textAlign = "left";
  // Letter-spaced eyebrow
  const drawTrackedText = (text: string, x: number, y: number, track = 6) => {
    let cursor = x;
    for (const ch of text) {
      ctx.fillText(ch, cursor, y);
      cursor += ctx.measureText(ch).width + track;
    }
  };
  drawTrackedText("KANDONG · 反诈助手", margin, 110, 4);
  ctx.textAlign = "right";
  ctx.font = `800 28px ${SANS_STACK}`;
  ctx.fillText(formatTodayLong(), CANVAS_WIDTH - margin, 110);

  // Heavy rule under masthead
  ctx.fillStyle = RULE;
  ctx.fillRect(margin, 140, innerW, 6);

  // Hair rule
  ctx.fillRect(margin, 156, innerW, 2);

  // Section eyebrow
  ctx.textAlign = "left";
  ctx.font = `800 32px ${SANS_STACK}`;
  ctx.fillStyle = MUTED;
  drawTrackedText("给家人的提醒 · A NOTE FOR FAMILY", margin, 220, 4);

  // ===== KICKER (level shout) =====
  ctx.font = `800 36px ${SANS_STACK}`;
  ctx.fillStyle = palette.accent;
  ctx.textAlign = "left";
  drawTrackedText(`${palette.shout} · ${palette.label}`, margin, 290, 6);

  // ===== POSTER BLOCK: huge glyph + label =====
  const posterY = 320;
  const posterH = 280;
  ctx.fillStyle = palette.accent;
  ctx.fillRect(margin, posterY, innerW, posterH);
  // Hard offset shadow effect — black slab behind, achieved by drawing a black
  // rect at margin+8 first and the color block on top. We already drew the
  // color block, so add a thin black border + offset shadow stripe.
  ctx.fillStyle = RULE;
  ctx.fillRect(margin + 14, posterY + posterH, innerW, 14); // bottom slab
  ctx.fillRect(margin + innerW, posterY + 14, 14, posterH); // right slab
  // Outline
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 4;
  ctx.strokeRect(margin, posterY, innerW, posterH);

  // Glyph
  ctx.fillStyle = palette.onAccent;
  ctx.font = `900 240px ${DISPLAY_STACK}`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText(palette.glyph, margin + 40, posterY + posterH - 50);

  // Divider line inside poster
  ctx.fillStyle = palette.onAccent;
  ctx.fillRect(margin + 290, posterY + 40, 4, posterH - 80);

  // Inside-poster headline (case title)
  ctx.font = `900 64px ${DISPLAY_STACK}`;
  ctx.textBaseline = "top";
  const titleX = margin + 320;
  const titleMaxW = innerW - 320 - 40;
  const titleLines = wrapText(ctx, caseData.title, titleMaxW).slice(0, 2);
  let ty = posterY + 60;
  for (const line of titleLines) {
    ctx.fillText(line, titleX, ty);
    ty += 72;
  }

  // Inside-poster small label
  ctx.font = `800 26px ${SANS_STACK}`;
  ctx.textBaseline = "alphabetic";
  drawTrackedText(
    palette.label.toUpperCase(),
    titleX,
    posterY + posterH - 40,
    6,
  );

  let cursorY = posterY + posterH + 60;

  // ===== HEADLINE: one-line verdict =====
  ctx.fillStyle = INK;
  ctx.font = `900 84px ${DISPLAY_STACK}`;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  const summaryLines = wrapText(ctx, caseData.summary, innerW);
  for (const line of summaryLines) {
    ctx.fillText(line, margin, cursorY);
    cursorY += 100;
  }
  cursorY += 12;

  // Hair rule
  ctx.fillStyle = RULE;
  ctx.fillRect(margin, cursorY, innerW, 2);
  cursorY += 30;

  // ===== WHY callout — paper card with colored left bar =====
  ctx.font = `800 28px ${SANS_STACK}`;
  ctx.fillStyle = palette.accent;
  ctx.textBaseline = "alphabetic";
  drawTrackedText("为什么 · WHY", margin, cursorY + 30, 4);
  cursorY += 60;

  // Colored bar
  const whyLines = wrapText(ctx, caseData.why, innerW - 50);
  const whyH = whyLines.length * 56 + 40;
  ctx.fillStyle = palette.accent;
  ctx.fillRect(margin, cursorY, 12, whyH);
  ctx.fillStyle = INK;
  ctx.font = `600 40px ${SANS_STACK}`;
  ctx.textBaseline = "top";
  let wy = cursorY + 14;
  for (const line of whyLines) {
    ctx.fillText(line, margin + 36, wy);
    wy += 56;
  }
  cursorY += whyH + 50;

  // ===== POINTS — hanging numerals 一 二 三 =====
  ctx.font = `800 30px ${SANS_STACK}`;
  ctx.fillStyle = MUTED;
  ctx.textBaseline = "alphabetic";
  drawTrackedText("记住三件事 · REMEMBER", margin, cursorY, 4);
  cursorY += 24;
  ctx.fillStyle = RULE;
  ctx.fillRect(margin, cursorY, innerW, 4);
  cursorY += 24;

  for (let i = 0; i < caseData.points.length; i += 1) {
    const point = caseData.points[i];
    const numeral = HANGING_NUMERAL[i] ?? String(i + 1);

    // Hanging display numeral
    ctx.font = `900 120px ${DISPLAY_STACK}`;
    ctx.fillStyle = palette.accent;
    ctx.textBaseline = "top";
    ctx.fillText(numeral, margin, cursorY);

    // Point text
    ctx.font = `600 44px ${SANS_STACK}`;
    ctx.fillStyle = INK;
    const ptX = margin + 150;
    const ptMaxW = innerW - 150;
    const ptLines = wrapText(ctx, point, ptMaxW);
    let py = cursorY + 18;
    for (const line of ptLines) {
      ctx.fillText(line, ptX, py);
      py += 62;
    }
    const blockH = Math.max(120, ptLines.length * 62 + 18);
    cursorY += blockH + 16;

    // Hair rule between points
    if (i < caseData.points.length - 1) {
      ctx.fillStyle = "#c8bea8";
      ctx.fillRect(margin, cursorY, innerW, 1);
      cursorY += 20;
    }
  }
  cursorY += 24;

  // ===== ACTION BAND — black slab =====
  const actionLines = wrapText(ctx, caseData.action, innerW - 80);
  const actionH = 80 + actionLines.length * 70 + 40;
  ctx.fillStyle = INK;
  ctx.fillRect(margin, cursorY, innerW, actionH);
  // Offset slab
  ctx.fillStyle = palette.accent;
  ctx.fillRect(margin + 14, cursorY + actionH, innerW, 14);
  ctx.fillRect(margin + innerW, cursorY + 14, 14, actionH);

  ctx.fillStyle = palette.accent;
  ctx.font = `800 28px ${SANS_STACK}`;
  ctx.textBaseline = "alphabetic";
  drawTrackedText("现在该怎么办 · NEXT STEP", margin + 40, cursorY + 60, 4);

  ctx.fillStyle = palette.onAccent;
  ctx.font = `900 54px ${DISPLAY_STACK}`;
  ctx.textBaseline = "top";
  let ay = cursorY + 90;
  for (const line of actionLines) {
    ctx.fillText(line, margin + 40, ay);
    ay += 70;
  }
  cursorY += actionH + 60;

  // ===== FOOTER =====
  // Hair rule
  ctx.fillStyle = RULE;
  ctx.fillRect(margin, CANVAS_HEIGHT - 240, innerW, 4);

  // Brand block
  ctx.font = `900 56px ${DISPLAY_STACK}`;
  ctx.fillStyle = INK;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText("看·懂·一·下", margin, CANVAS_HEIGHT - 160);

  ctx.font = `700 28px ${SANS_STACK}`;
  ctx.fillStyle = MUTED;
  drawTrackedText("给爸妈的反诈助手", margin, CANVAS_HEIGHT - 110, 2);

  ctx.font = `500 24px ${SANS_STACK}`;
  ctx.fillStyle = MUTED;
  ctx.fillText(
    `${DEPLOY_BASE_URL}/result/${caseData.id}`,
    margin,
    CANVAS_HEIGHT - 70,
  );

  // QR placeholder — black ink block
  const qrSize = 160;
  const qrX = CANVAS_WIDTH - qrSize - margin;
  const qrY = CANVAS_HEIGHT - qrSize - 70;
  ctx.fillStyle = INK;
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.fillStyle = PAPER;
  ctx.font = `800 24px ${SANS_STACK}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText("扫码", qrX + qrSize / 2, qrY + qrSize / 2 - 16);
  ctx.fillText("看详情", qrX + qrSize / 2, qrY + qrSize / 2 + 20);
}

const canvasStyle: CSSProperties = {
  display: "block",
  width: "100%",
  maxWidth: 380,
  height: "auto",
  aspectRatio: "1080 / 1920",
  margin: "0 auto",
  background: "var(--color-paper)",
  border: "var(--rule-medium) solid var(--color-rule)",
  boxShadow: "0 1px 0 var(--color-rule), 6px 6px 0 var(--color-rule)",
};

export function FamilyCard({ caseData }: FamilyCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      drawCard(canvas, caseData);
      setImgUrl(canvas.toDataURL("image/png"));
    } catch (err: unknown) {
      console.error("FamilyCard: failed to render canvas", err);
      setError("生成图片失败,请刷新页面再试一次");
    }
  }, [caseData]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `看懂一下-${caseData.title}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    } catch (err: unknown) {
      console.error("FamilyCard: failed to start download", err);
      setError("下载失败,请长按上方图片选「保存」");
    }
  }, [caseData.title]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        aria-hidden="true"
        style={{ display: "none" }}
      />

      {imgUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgUrl}
          alt={`给家人的提醒卡片:${caseData.title}`}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={canvasStyle}
          draggable={false}
        />
      ) : (
        <div
          style={{
            ...canvasStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-muted)",
            fontSize: "var(--text-body)",
            minHeight: 480,
          }}
        >
          正在生成图片…
        </div>
      )}

      {error ? (
        <p
          role="alert"
          style={{
            color: "var(--color-red)",
            fontSize: "var(--text-body)",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {error}
        </p>
      ) : null}

      <BigButton onClick={handleDownload}>保存图片</BigButton>
    </div>
  );
}

export default FamilyCard;
