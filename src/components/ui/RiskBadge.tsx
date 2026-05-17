import type { CSSProperties } from "react";

export type RiskLevel = "red" | "yellow" | "green";

interface RiskBadgeProps {
  level: RiskLevel;
  /** Visual size: chip (inline 56px), lg (88px touch chip), xl (banner full-width). */
  size?: "chip" | "lg" | "xl";
  /** @deprecated v3.0 removed editorial poster mode. Falls back to xl banner. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  legacyPoster?: never;
  className?: string;
}

interface RiskBadgeConfig {
  label: string;
  hint: string;
  ariaLabel: string;
  dot: string;
  tint: string;
  ink: string;
}

const RISK_CONFIG: Record<RiskLevel, RiskBadgeConfig> = {
  red: {
    label: "高风险",
    hint: "可能是骗子，请立刻停下",
    ariaLabel: "高风险警告，这很可能是骗子",
    dot: "var(--color-risk-red)",
    tint: "var(--color-risk-red-soft)",
    ink: "var(--color-risk-red)",
  },
  yellow: {
    label: "要警惕",
    hint: "灰区，要多看一眼",
    ariaLabel: "要警惕，存在风险",
    dot: "var(--color-risk-yellow)",
    tint: "var(--color-risk-yellow-soft)",
    ink: "var(--color-ink)",
  },
  green: {
    label: "安全",
    hint: "看上去没问题",
    ariaLabel: "安全，未发现风险",
    dot: "var(--color-risk-green)",
    tint: "var(--color-risk-green-soft)",
    ink: "var(--color-risk-green)",
  },
};

export function RiskBadge({ level, size = "lg", className }: RiskBadgeProps) {
  const config = RISK_CONFIG[level];

  if (size === "chip") {
    return (
      <span
        role="img"
        aria-label={config.ariaLabel}
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          padding: "var(--space-2) var(--space-4)",
          borderRadius: "var(--radius-pill)",
          background: config.tint,
          color: config.ink,
          fontSize: "var(--text-caption)",
          fontWeight: 700,
          letterSpacing: 0,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: config.dot,
            display: "inline-block",
          }}
        />
        {config.label}
      </span>
    );
  }

  // Banner: lg = inline panel, xl = full-width hero banner.
  const isXl = size === "xl";
  const dotSize = isXl ? 28 : 22;

  const wrapperStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-4)",
    width: "100%",
    padding: "var(--space-5)",
    borderRadius: "var(--radius-bubble)",
    background: config.tint,
    boxShadow: "var(--shadow-bubble)",
  };
  const labelStyle: CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize: isXl ? "var(--text-headline)" : "var(--text-title)",
    fontWeight: 800,
    color: config.ink,
    lineHeight: 1.15,
    margin: 0,
  };
  const hintStyle: CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-body)",
    fontWeight: 500,
    color: "var(--color-ink)",
    marginTop: "var(--space-2)",
  };

  return (
    <div role="img" aria-label={config.ariaLabel} className={className} style={wrapperStyle}>
      <span
        aria-hidden="true"
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: config.dot,
          flexShrink: 0,
          boxShadow: "0 0 0 4px rgba(255,255,255,0.6)",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={labelStyle}>{config.label}</h2>
        <p style={hintStyle}>{config.hint}</p>
      </div>
    </div>
  );
}

export default RiskBadge;
