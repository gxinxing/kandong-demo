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
  bg: string;
  ink: string;
  text: string;
}

const RISK_CONFIG: Record<RiskLevel, RiskBadgeConfig> = {
  red: {
    glyph: "红",
    label: "高风险",
    shout: "STOP",
    ariaLabel: "高风险警告，这是骗局",
    bg: "var(--color-red)",
    ink: "var(--color-red-ink)",
    text: "#fff5f0",
  },
  yellow: {
    glyph: "黄",
    label: "要警惕",
    shout: "WAIT",
    ariaLabel: "要警惕，可能有风险",
    bg: "var(--color-yellow)",
    ink: "var(--color-yellow-ink)",
    text: "#1a1000",
  },
  green: {
    glyph: "绿",
    label: "安全",
    shout: "OK",
    ariaLabel: "安全，未发现风险",
    bg: "var(--color-green)",
    ink: "var(--color-green-ink)",
    text: "#f0fff5",
  },
};

const SIZE_MAP = {
  lg: { box: 200, glyph: "120px", label: "var(--text-button)" },
  xl: { box: 260, glyph: "168px", label: "var(--text-title)" },
  poster: { box: 0, glyph: "0", label: "0" },
} as const;

export function RiskBadge({
  level,
  size = "lg",
  className,
}: RiskBadgeProps) {
  const config = RISK_CONFIG[level];

  // Poster variant — full-bleed editorial color block with hanging label.
  if (size === "poster") {
    const blockStyle: CSSProperties = {
      background: config.bg,
      color: config.text,
      padding: "var(--space-4) var(--space-3)",
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      alignItems: "stretch",
      gap: "var(--space-3)",
      boxShadow: `0 1px 0 var(--color-rule), 6px 6px 0 var(--color-rule)`,
      borderRadius: 0,
      position: "relative",
    };
    return (
      <div
        role="img"
        aria-label={config.ariaLabel}
        className={className}
        style={blockStyle}
      >
        <div
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(6rem, 4rem + 12vw, 11rem)",
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            color: config.text,
            paddingRight: "var(--space-2)",
            borderRight: `var(--rule-medium) solid ${config.text}`,
          }}
        >
          {config.glyph}
        </div>
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingLeft: "var(--space-1)",
            gap: "var(--space-2)",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-eyebrow)",
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            {config.shout}
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 1.8rem + 3vw, 4rem)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            {config.label}
          </span>
        </div>
      </div>
    );
  }

  const dims = SIZE_MAP[size];

  const wrapperStyle: CSSProperties = {
    width: dims.box,
    height: dims.box,
    background: config.bg,
    color: config.text,
    boxShadow: `inset 0 0 0 0px transparent, 6px 6px 0 var(--color-rule)`,
    borderRadius: 0,
    fontFamily: "var(--font-display)",
  };

  return (
    <div
      role="img"
      aria-label={config.ariaLabel}
      className={`flex flex-col items-center justify-center select-none ${
        className ?? ""
      }`}
      style={wrapperStyle}
    >
      <span
        aria-hidden="true"
        style={{
          fontSize: dims.glyph,
          fontWeight: 900,
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
        }}
      >
        {config.glyph}
      </span>
      <span
        aria-hidden="true"
        style={{
          fontSize: dims.label,
          fontWeight: 900,
          marginTop: "0.15em",
          letterSpacing: "-0.01em",
          fontFamily: "var(--font-display)",
        }}
      >
        {config.label}
      </span>
    </div>
  );
}

export default RiskBadge;
