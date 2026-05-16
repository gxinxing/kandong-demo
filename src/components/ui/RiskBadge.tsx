import type { CSSProperties } from "react";

export type RiskLevel = "red" | "yellow" | "green";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "lg" | "xl" | "poster";
  className?: string;
}

interface RiskBadgeConfig {
  glyph: string;
  label: string;
  shout: string;
  ariaLabel: string;
  swatchBg: string;
  swatchInk: string;
  cardTint: string;
  posterInk: string;
}

const RISK_CONFIG: Record<RiskLevel, RiskBadgeConfig> = {
  red: {
    glyph: "红",
    label: "高风险",
    shout: "STOP",
    ariaLabel: "高风险警告,这是骗局",
    swatchBg: "var(--color-red)",
    swatchInk: "#fff5f0",
    cardTint: "var(--color-red-soft)",
    posterInk: "var(--color-red)",
  },
  yellow: {
    glyph: "黄",
    label: "要警惕",
    shout: "WAIT",
    ariaLabel: "要警惕,可能有风险",
    swatchBg: "var(--color-yellow)",
    swatchInk: "#1a1000",
    cardTint: "var(--color-yellow-soft)",
    posterInk: "#8a5a00",
  },
  green: {
    glyph: "绿",
    label: "安全",
    shout: "OK",
    ariaLabel: "安全,未发现风险",
    swatchBg: "var(--color-green)",
    swatchInk: "#f0fff5",
    cardTint: "var(--color-green-soft)",
    posterInk: "var(--color-green)",
  },
};

export function RiskBadge({
  level,
  size = "lg",
  className,
}: RiskBadgeProps) {
  const config = RISK_CONFIG[level];

  // Poster — editorial risk-poster: oversized Fraunces glyph stamped behind
  // the verdict label, with hairline rules framing the metadata. No plastic
  // rounded square, no shadow soup.
  if (size === "poster") {
    const cardStyle: CSSProperties = {
      position: "relative",
      borderTop: "2px solid var(--color-ink)",
      borderBottom: "1px solid var(--color-border)",
      paddingTop: "var(--space-4)",
      paddingBottom: "var(--space-6)",
      overflow: "hidden",
      isolation: "isolate",
    };
    const watermarkStyle: CSSProperties = {
      position: "absolute",
      right: "-3vw",
      bottom: "-2vw",
      fontFamily: "var(--font-display)",
      fontSize: "clamp(260px, 75vw, 360px)",
      fontWeight: 400,
      lineHeight: 0.78,
      letterSpacing: "-0.04em",
      color: config.posterInk,
      opacity: 0.95,
      zIndex: 0,
      pointerEvents: "none",
      userSelect: "none",
    };
    const labelStackStyle: CSSProperties = {
      position: "relative",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      minHeight: "min(72vw, 320px)",
      justifyContent: "space-between",
    };
    const shoutStyle: CSSProperties = {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: "var(--color-muted)",
    };
    const labelStyle: CSSProperties = {
      fontFamily: "var(--font-display)",
      fontSize: "clamp(56px, 18vw, 84px)",
      fontWeight: 400,
      lineHeight: 0.95,
      letterSpacing: "-0.03em",
      color: "var(--color-ink)",
      margin: 0,
    };
    const verdictStyle: CSSProperties = {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: config.posterInk,
      mixBlendMode: "multiply",
    };
    return (
      <div
        role="img"
        aria-label={config.ariaLabel}
        className={className}
        style={cardStyle}
      >
        <span aria-hidden="true" style={watermarkStyle}>
          {config.glyph}
        </span>
        <div style={labelStackStyle}>
          <div style={shoutStyle}>
            <span>RISK · 风险</span>
            <span>{config.shout}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            <span style={verdictStyle}>VERDICT</span>
            <span style={labelStyle}>{config.label}</span>
          </div>
        </div>
      </div>
    );
  }

  // Standard rounded swatch (lg/xl) — kept for smaller surfaces (cards, lists).
  const dims =
    size === "xl"
      ? { box: 220, glyph: 156, labelSize: "var(--text-title)" }
      : { box: 168, glyph: 116, labelSize: "var(--text-button)" };

  const wrapperStyle: CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--space-3)",
  };
  const swatchStyle: CSSProperties = {
    width: dims.box,
    height: dims.box,
    background: config.swatchBg,
    color: config.swatchInk,
    borderRadius: "var(--radius-3xl)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontSize: dims.glyph,
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: "-0.02em",
  };

  return (
    <div
      role="img"
      aria-label={config.ariaLabel}
      className={`select-none ${className ?? ""}`}
      style={wrapperStyle}
    >
      <div aria-hidden="true" style={swatchStyle}>
        {config.glyph}
      </div>
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: dims.labelSize,
          fontWeight: 400,
          letterSpacing: "-0.01em",
          color: "var(--color-ink)",
        }}
      >
        {config.label}
      </span>
    </div>
  );
}

export default RiskBadge;
