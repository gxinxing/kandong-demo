import type { CSSProperties } from "react";

export type RiskLevel = "red" | "yellow" | "green";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "lg" | "xl";
  className?: string;
}

interface RiskBadgeConfig {
  emoji: string;
  label: string;
  ariaLabel: string;
  bg: string;
  ring: string;
  text: string;
}

const RISK_CONFIG: Record<RiskLevel, RiskBadgeConfig> = {
  red: {
    emoji: "🔴",
    label: "高风险",
    ariaLabel: "高风险警告，这是骗局",
    bg: "var(--color-red-soft)",
    ring: "var(--color-red)",
    text: "var(--color-red)",
  },
  yellow: {
    emoji: "🟡",
    label: "要警惕",
    ariaLabel: "要警惕，可能有风险",
    bg: "var(--color-yellow-soft)",
    ring: "var(--color-yellow)",
    text: "#7a4d00",
  },
  green: {
    emoji: "🟢",
    label: "安全",
    ariaLabel: "安全，未发现风险",
    bg: "var(--color-green-soft)",
    ring: "var(--color-green)",
    text: "var(--color-green)",
  },
};

const SIZE_MAP = {
  lg: { box: 200, emoji: "92px", label: "var(--text-button)" },
  xl: { box: 240, emoji: "112px", label: "var(--text-title)" },
} as const;

export function RiskBadge({
  level,
  size = "lg",
  className,
}: RiskBadgeProps) {
  const config = RISK_CONFIG[level];
  const dims = SIZE_MAP[size];

  const wrapperStyle: CSSProperties = {
    width: dims.box,
    height: dims.box,
    background: config.bg,
    boxShadow: `inset 0 0 0 6px ${config.ring}, var(--shadow-card)`,
    color: config.text,
  };

  return (
    <div
      role="img"
      aria-label={config.ariaLabel}
      className={`flex flex-col items-center justify-center rounded-full select-none ${
        className ?? ""
      }`}
      style={wrapperStyle}
    >
      <span aria-hidden="true" style={{ fontSize: dims.emoji, lineHeight: 1 }}>
        {config.emoji}
      </span>
      <span
        aria-hidden="true"
        style={{
          fontSize: dims.label,
          fontWeight: 800,
          marginTop: "0.25em",
          letterSpacing: "0.04em",
        }}
      >
        {config.label}
      </span>
    </div>
  );
}

export default RiskBadge;
