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
  soft: string;
  bandText: string;
  emojiLabel: string;
}

const LEVEL_PALETTE: Record<DemoLevel, LevelPalette> = {
  red: {
    accent: "#d7263d",
    soft: "#fdecef",
    bandText: "#ffffff",
    emojiLabel: "高风险",
  },
  yellow: {
    accent: "#f4a300",
    soft: "#fff4dd",
    bandText: "#1a1a1a",
    emojiLabel: "要警惕",
  },
  green: {
    accent: "#2e7d32",
    soft: "#e6f3e7",
    bandText: "#ffffff",
    emojiLabel: "可以放心",
  },
};

const FONT_STACK =
  '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans CJK SC", "Heiti SC", system-ui, sans-serif';

const DEPLOY_BASE_URL = "https://kandong.ai.syt.huickathon.cn";

/** Draws a rounded-rectangle path on the given canvas context. */
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

/**
 * Wrap text into lines that fit a max width. Returns the line strings.
 * Greedy character-by-character wrap — works for Chinese where every glyph is
 * its own word boundary.
 */
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
  if (current.length > 0) {
    lines.push(current);
  }
  return lines;
}

/**
 * Renders the family-share card onto a 1080x1920 canvas per PRD §9.
 * Layout regions are computed top-down so additions don't accidentally
 * collide with the QR placeholder at the bottom.
 */
function drawCard(canvas: HTMLCanvasElement, caseData: DemoCase): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  const palette = LEVEL_PALETTE[caseData.level];

  // Background
  ctx.fillStyle = "#fafafa";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Soft tinted radial in top-left, level-keyed
  const radial = ctx.createRadialGradient(180, 200, 40, 180, 200, 900);
  radial.addColorStop(0, palette.soft);
  radial.addColorStop(1, "rgba(250, 250, 250, 0)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // ===== Top band (480px): emoji badge + greeting =====
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Emoji badge: a soft circle behind a giant emoji
  const badgeCx = CANVAS_WIDTH / 2;
  const badgeCy = 250;
  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.arc(badgeCx, badgeCy, 160, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.font = `240px ${FONT_STACK}`;
  ctx.fillStyle = palette.accent;
  ctx.fillText(caseData.emoji, badgeCx, badgeCy + 12);

  // 「家人你好」
  ctx.font = `800 96px ${FONT_STACK}`;
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText("家人你好", CANVAS_WIDTH / 2, 460);

  // ===== Risk band — pill with the level label + title =====
  const bandY = 530;
  const bandH = 100;
  const bandPad = 60;
  ctx.fillStyle = palette.accent;
  roundedRect(
    ctx,
    bandPad,
    bandY,
    CANVAS_WIDTH - bandPad * 2,
    bandH,
    bandH / 2,
  );
  ctx.fill();
  ctx.font = `800 56px ${FONT_STACK}`;
  ctx.fillStyle = palette.bandText;
  ctx.fillText(
    `${palette.emojiLabel} · ${caseData.title}`,
    CANVAS_WIDTH / 2,
    bandY + bandH / 2 + 2,
  );

  // ===== Summary 一句话 (72px) =====
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = `800 72px ${FONT_STACK}`;
  ctx.fillStyle = "#1a1a1a";
  const summaryX = 80;
  let cursorY = 700;
  const summaryLines = wrapText(ctx, caseData.summary, CANVAS_WIDTH - 160);
  for (const line of summaryLines) {
    ctx.fillText(line, summaryX, cursorY);
    cursorY += 96;
  }
  cursorY += 24;

  // ===== Three points, each in its own rounded rectangle =====
  ctx.font = `700 60px ${FONT_STACK}`;
  const pointMaxWidth = CANVAS_WIDTH - 240;
  for (let i = 0; i < caseData.points.length; i += 1) {
    const point = caseData.points[i];
    const lines = wrapText(ctx, point, pointMaxWidth);
    const lineHeight = 84;
    const cardHeight = lines.length * lineHeight + 56;
    // Card body
    ctx.fillStyle = "#ffffff";
    roundedRect(ctx, 80, cursorY, CANVAS_WIDTH - 160, cardHeight, 28);
    ctx.fill();
    // Level-tinted left border
    ctx.fillStyle = palette.accent;
    roundedRect(ctx, 80, cursorY, 14, cardHeight, 7);
    ctx.fill();
    // Number badge
    ctx.fillStyle = palette.accent;
    ctx.beginPath();
    ctx.arc(160, cursorY + 56, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = `800 44px ${FONT_STACK}`;
    ctx.fillStyle = palette.bandText;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(i + 1), 160, cursorY + 58);
    // Point text
    ctx.font = `700 60px ${FONT_STACK}`;
    ctx.fillStyle = "#1a1a1a";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    let textY = cursorY + 28;
    for (const line of lines) {
      ctx.fillText(line, 220, textY);
      textY += lineHeight;
    }
    cursorY += cardHeight + 24;
  }
  cursorY += 24;

  // ===== Action callout =====
  const actionLines = wrapText(ctx, caseData.action, CANVAS_WIDTH - 240);
  const actionHeight = actionLines.length * 82 + 130;
  ctx.fillStyle = palette.soft;
  roundedRect(ctx, 80, cursorY, CANVAS_WIDTH - 160, actionHeight, 28);
  ctx.fill();
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.font = `800 44px ${FONT_STACK}`;
  ctx.fillStyle = palette.accent;
  ctx.fillText("现在该怎么办", 120, cursorY + 28);

  ctx.font = `700 60px ${FONT_STACK}`;
  ctx.fillStyle = "#1a1a1a";
  let actionY = cursorY + 96;
  for (const line of actionLines) {
    ctx.fillText(line, 120, actionY);
    actionY += 82;
  }

  // ===== Footer: QR placeholder + brand =====
  // NOTE: This is a placeholder rect, NOT a real QR code. A real QR
  // generator (e.g. qrcode-svg) is P1 — see PRD §4.
  const qrSize = 200;
  const qrX = CANVAS_WIDTH - qrSize - 80;
  const qrY = CANVAS_HEIGHT - qrSize - 100;
  ctx.fillStyle = "#1a1a1a";
  roundedRect(ctx, qrX, qrY, qrSize, qrSize, 16);
  ctx.fill();
  ctx.font = `700 28px ${FONT_STACK}`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("扫码", qrX + qrSize / 2, qrY + qrSize / 2 - 18);
  ctx.fillText("看详情", qrX + qrSize / 2, qrY + qrSize / 2 + 22);

  // Brand + URL
  ctx.font = `700 36px ${FONT_STACK}`;
  ctx.fillStyle = "#5a5a5a";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(
    "看懂一下 · 给爸妈的反诈助手",
    80,
    CANVAS_HEIGHT - 160,
  );
  ctx.font = `28px ${FONT_STACK}`;
  ctx.fillStyle = "#5a5a5a";
  ctx.fillText(
    `${DEPLOY_BASE_URL}/result/${caseData.id}`,
    80,
    CANVAS_HEIGHT - 110,
  );
}

const canvasStyle: CSSProperties = {
  display: "block",
  width: "100%",
  maxWidth: 360,
  height: "auto",
  aspectRatio: "1080 / 1920",
  borderRadius: 24,
  boxShadow: "var(--shadow-card)",
  margin: "0 auto",
  background: "var(--color-surface)",
};

export function FamilyCard({ caseData }: FamilyCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
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
    if (!canvas) {
      return;
    }
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `看懂一下-${caseData.title}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        // Give the browser a moment to start the download before revoking
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
        gap: "var(--space-4)",
      }}
    >
      {/* Hidden full-resolution canvas drives the data URL */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        aria-hidden="true"
        style={{ display: "none" }}
      />

      {/* Visible image — users long-press to save on mobile */}
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

      <BigButton onClick={handleDownload} fullWidth>
        保存图片
      </BigButton>
    </div>
  );
}

export default FamilyCard;
