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
  accentInk: string;
  tint: string;
  tintInk: string;
  glyph: string;
  label: string;
  shout: string;
}

const LEVEL_PALETTE: Record<DemoLevel, LevelPalette> = {
  red: {
    accent: "#c0162a",
    accentInk: "#fff5f0",
    tint: "#fbe6e4",
    tintInk: "#5a0a16",
    glyph: "红",
    label: "高风险",
    shout: "STOP",
  },
  yellow: {
    accent: "#d68b00",
    accentInk: "#1a1000",
    tint: "#fbf2e1",
    tintInk: "#4a3000",
    glyph: "黄",
    label: "要警惕",
    shout: "WAIT",
  },
  green: {
    accent: "#1e6a32",
    accentInk: "#f0fff5",
    tint: "#e6f2e9",
    tintInk: "#0e3a1a",
    glyph: "绿",
    label: "安全",
    shout: "OK",
  },
};

const CANVAS_BG = "#f5f2f0";
const SURFACE = "#ffffff";
const INK = "#000000";
const FG = "#333333";
const MUTED = "#7b7b7b";
const BORDER = "#d6d6d6";
const AMETHYST = "#f1ccff";
const AMETHYST_INK = "#4a1166";
const SKY = "#91e0ff";
const SKY_INK = "#0a4a66";

const DISPLAY_STACK =
  '"Fraunces", "Songti SC", "Source Han Serif SC", "Noto Serif CJK SC", "STSong", "SimSun", "PingFang SC", serif';
const SANS_STACK =
  '"Switzer", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans CJK SC", system-ui, sans-serif';

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

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawTrackedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  track = 4,
): void {
  let cursor = x;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + track;
  }
}

function drawCard(canvas: HTMLCanvasElement, caseData: DemoCase): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const palette = LEVEL_PALETTE[caseData.level];

  // Background — cream cloud canvas
  ctx.fillStyle = CANVAS_BG;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Porcelain card with soft drop shadow
  const cardMargin = 50;
  const cardX = cardMargin;
  const cardY = cardMargin;
  const cardW = CANVAS_WIDTH - cardMargin * 2;
  const cardH = CANVAS_HEIGHT - cardMargin * 2;
  const cardRadius = 42;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.06)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = SURFACE;
  roundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();
  ctx.restore();

  const pad = 70;
  const innerX = cardX + pad;
  const innerW = cardW - pad * 2;
  const innerRight = innerX + innerW;

  // Masthead eyebrow row
  ctx.textBaseline = "alphabetic";
  ctx.font = `600 26px ${SANS_STACK}`;
  ctx.fillStyle = MUTED;
  ctx.textAlign = "left";
  drawTrackedText(ctx, "KANDONG · 反诈助手", innerX, cardY + 110, 3.5);

  ctx.textAlign = "right";
  ctx.fillText(formatTodayLong(), innerRight, cardY + 110);

  // Hair rule
  ctx.fillStyle = BORDER;
  ctx.fillRect(innerX, cardY + 140, innerW, 1);

  // Section eyebrow
  ctx.textAlign = "left";
  ctx.font = `600 28px ${SANS_STACK}`;
  ctx.fillStyle = MUTED;
  drawTrackedText(ctx, "给家人的提醒 · A NOTE FOR FAMILY", innerX, cardY + 210, 3.5);

  // Kicker — level shout in accent color
  ctx.font = `600 32px ${SANS_STACK}`;
  ctx.fillStyle = palette.accent;
  drawTrackedText(
    ctx,
    `${palette.shout} · ${palette.label}`,
    innerX,
    cardY + 270,
    4,
  );

  // Risk poster — rounded swatch + serif title
  const swatchSize = 220;
  const swatchY = cardY + 310;
  ctx.fillStyle = palette.accent;
  roundedRect(ctx, innerX, swatchY, swatchSize, swatchSize, 32);
  ctx.fill();

  // Glyph on swatch — serif
  ctx.fillStyle = palette.accentInk;
  ctx.font = `400 170px ${DISPLAY_STACK}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(palette.glyph, innerX + swatchSize / 2, swatchY + swatchSize / 2 + 6);

  // Right of swatch — case title (serif) wraps to 2 lines
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  const titleX = innerX + swatchSize + 40;
  const titleMaxW = innerRight - titleX;

  // small eyebrow above title
  ctx.font = `600 22px ${SANS_STACK}`;
  ctx.fillStyle = MUTED;
  drawTrackedText(ctx, "CASE", titleX, swatchY + 18, 4);

  ctx.font = `400 58px ${DISPLAY_STACK}`;
  ctx.fillStyle = INK;
  const titleLines = wrapText(ctx, caseData.title, titleMaxW).slice(0, 3);
  let ty = swatchY + 60;
  for (const line of titleLines) {
    ctx.fillText(line, titleX, ty);
    ty += 68;
  }

  let cursorY = swatchY + swatchSize + 60;

  // Verdict — large serif headline
  ctx.fillStyle = INK;
  ctx.font = `400 72px ${DISPLAY_STACK}`;
  ctx.textBaseline = "top";
  const summaryLines = wrapText(ctx, caseData.summary, innerW);
  for (const line of summaryLines) {
    ctx.fillText(line, innerX, cursorY);
    cursorY += 84;
  }
  cursorY += 20;

  // Why callout — tinted soft card
  const whyLines = wrapText(ctx, caseData.why, innerW - 60);
  const whyBodyH = whyLines.length * 50 + 20;
  const whyH = whyBodyH + 90;
  ctx.fillStyle = palette.tint;
  roundedRect(ctx, innerX, cursorY, innerW, whyH, 28);
  ctx.fill();

  ctx.font = `600 24px ${SANS_STACK}`;
  ctx.fillStyle = palette.tintInk;
  ctx.textBaseline = "alphabetic";
  drawTrackedText(ctx, "为什么 · WHY", innerX + 30, cursorY + 48, 3);

  ctx.font = `400 34px ${SANS_STACK}`;
  ctx.fillStyle = FG;
  ctx.textBaseline = "top";
  let wy = cursorY + 70;
  for (const line of whyLines) {
    ctx.fillText(line, innerX + 30, wy);
    wy += 50;
  }
  cursorY += whyH + 50;

  // Three rules section header
  ctx.font = `600 26px ${SANS_STACK}`;
  ctx.fillStyle = MUTED;
  ctx.textBaseline = "alphabetic";
  drawTrackedText(ctx, "记住三件事 · REMEMBER", innerX, cursorY, 3.5);
  cursorY += 24;

  // Points — porcelain mini-cards with amethyst serif numerals
  for (let i = 0; i < caseData.points.length; i += 1) {
    const point = caseData.points[i];
    const numeral = HANGING_NUMERAL[i] ?? String(i + 1);

    ctx.font = `400 36px ${SANS_STACK}`;
    const ptX = innerX + 130;
    const ptMaxW = innerW - 150;
    const ptLines = wrapText(ctx, point, ptMaxW);
    const blockH = Math.max(120, ptLines.length * 52 + 40);

    // Card background — soft canvas tint with subtle border
    ctx.fillStyle = CANVAS_BG;
    roundedRect(ctx, innerX, cursorY, innerW, blockH, 24);
    ctx.fill();
    ctx.strokeStyle = BORDER;
    ctx.lineWidth = 1;
    roundedRect(ctx, innerX, cursorY, innerW, blockH, 24);
    ctx.stroke();

    // Hanging serif numeral
    ctx.font = `400 90px ${DISPLAY_STACK}`;
    ctx.fillStyle = AMETHYST_INK;
    ctx.textBaseline = "top";
    ctx.fillText(numeral, innerX + 30, cursorY + 16);

    // Point body
    ctx.font = `400 34px ${SANS_STACK}`;
    ctx.fillStyle = FG;
    let py = cursorY + 24;
    for (const line of ptLines) {
      ctx.fillText(line, ptX, py);
      py += 52;
    }

    cursorY += blockH + 18;
  }
  cursorY += 16;

  // Action band — sky-blue rounded card
  const actionLines = wrapText(ctx, caseData.action, innerW - 100);
  const actionH = 100 + actionLines.length * 60 + 40;
  ctx.fillStyle = SKY;
  roundedRect(ctx, innerX, cursorY, innerW, actionH, 36);
  ctx.fill();

  ctx.fillStyle = SKY_INK;
  ctx.font = `600 24px ${SANS_STACK}`;
  ctx.textBaseline = "alphabetic";
  drawTrackedText(ctx, "现在该怎么办 · NEXT STEP", innerX + 50, cursorY + 60, 3.5);

  ctx.font = `400 46px ${DISPLAY_STACK}`;
  ctx.textBaseline = "top";
  let ay = cursorY + 90;
  for (const line of actionLines) {
    ctx.fillText(line, innerX + 50, ay);
    ay += 60;
  }
  cursorY += actionH + 60;

  // Footer — brand + url + rounded QR
  const footerY = cardY + cardH - 240;

  // Hair rule
  ctx.fillStyle = BORDER;
  ctx.fillRect(innerX, footerY, innerW, 1);

  // Brand serif
  ctx.font = `400 52px ${DISPLAY_STACK}`;
  ctx.fillStyle = INK;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText("看懂一下", innerX, footerY + 80);

  ctx.font = `600 24px ${SANS_STACK}`;
  ctx.fillStyle = MUTED;
  drawTrackedText(ctx, "给爸妈的反诈助手", innerX, footerY + 122, 2);

  ctx.font = `500 22px ${SANS_STACK}`;
  ctx.fillStyle = MUTED;
  ctx.fillText(
    `${DEPLOY_BASE_URL}/result/${caseData.id}`,
    innerX,
    footerY + 168,
  );

  // QR placeholder — rounded amethyst block
  const qrSize = 150;
  const qrX = innerRight - qrSize;
  const qrY = footerY + 50;
  ctx.fillStyle = AMETHYST;
  roundedRect(ctx, qrX, qrY, qrSize, qrSize, 20);
  ctx.fill();

  ctx.fillStyle = AMETHYST_INK;
  ctx.font = `600 22px ${SANS_STACK}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText("扫码", qrX + qrSize / 2, qrY + qrSize / 2 - 14);
  ctx.fillText("看详情", qrX + qrSize / 2, qrY + qrSize / 2 + 18);
}

const canvasStyle: CSSProperties = {
  display: "block",
  width: "100%",
  maxWidth: 380,
  height: "auto",
  aspectRatio: "1080 / 1920",
  margin: "0 auto",
  background: "var(--color-canvas)",
  borderRadius: "var(--radius-2xl)",
  boxShadow: "var(--shadow-card)",
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
            fontWeight: 600,
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
