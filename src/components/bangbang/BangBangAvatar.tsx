"use client";

import type { CSSProperties } from "react";

export type BangBangSize = "sm" | "md" | "lg" | "xl";
export type BangBangMood = "idle" | "listening" | "thinking" | "reassure";

interface BangBangAvatarProps {
  size?: BangBangSize;
  mood?: BangBangMood;
  className?: string;
  /** Optional title for screen readers; defaults to «帮帮». */
  label?: string;
}

const SIZE_PX: Record<BangBangSize, number> = {
  sm: 48,
  md: 80,
  lg: 112,
  xl: 144,
};

const STROKE = "var(--color-stroke)";
const FACE = "#FFD37A";
const FACE_LIGHT = "#FFE4A8";
const CHEEK = "#FF9FA8";

/**
 * 帮帮 — round, chubby, hand-drawn cartoon mascot.
 * mood drives mouth + brow + cheek variations.
 */
export function BangBangAvatar({
  size = "md",
  mood = "idle",
  className,
  label = "帮帮",
}: BangBangAvatarProps) {
  const px = SIZE_PX[size];

  const wrapperStyle: CSSProperties = {
    width: px,
    height: px,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    filter: "drop-shadow(0 4px 8px rgba(110, 80, 40, 0.18))",
  };

  return (
    <span
      role="img"
      aria-label={label}
      className={className}
      style={wrapperStyle}
    >
      <svg
        viewBox="0 0 120 120"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        {/* Soft warm halo */}
        <circle cx="60" cy="60" r="56" fill={FACE_LIGHT} opacity="0.5" />

        {/* Head — chubby off-center for hand-drawn feel */}
        <ellipse
          cx="60"
          cy="62"
          rx="42"
          ry="40"
          fill={FACE}
          stroke={STROKE}
          strokeWidth="3"
        />

        {/* Top tuft */}
        <path
          d="M52 24 Q56 16 60 22 Q64 14 68 24"
          fill="none"
          stroke={STROKE}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cheeks — always rosy on idle/reassure, brighter on reassure */}
        <ellipse
          cx="36"
          cy="70"
          rx="8"
          ry="5"
          fill={CHEEK}
          opacity={mood === "thinking" ? 0.25 : mood === "reassure" ? 0.85 : 0.55}
        />
        <ellipse
          cx="84"
          cy="70"
          rx="8"
          ry="5"
          fill={CHEEK}
          opacity={mood === "thinking" ? 0.25 : mood === "reassure" ? 0.85 : 0.55}
        />

        {/* Brows for thinking */}
        {mood === "thinking" && (
          <>
            <path d="M40 46 L52 44" stroke={STROKE} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M68 44 L80 46" stroke={STROKE} strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Brows for listening — perky up-curve */}
        {mood === "listening" && (
          <>
            <path d="M40 48 Q46 42 52 48" stroke={STROKE} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M68 48 Q74 42 80 48" stroke={STROKE} strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Eyes — round dots with shiny catchlight */}
        <circle cx="46" cy="58" r="5" fill={STROKE} />
        <circle cx="74" cy="58" r="5" fill={STROKE} />
        <circle cx="48" cy="56" r="1.6" fill="#FFFFFF" />
        <circle cx="76" cy="56" r="1.6" fill="#FFFFFF" />

        {/* Mouth */}
        {mood === "idle" && (
          <path
            d="M50 78 Q60 86 70 78"
            stroke={STROKE}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {mood === "reassure" && (
          <path
            d="M46 76 Q60 92 74 76"
            stroke={STROKE}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {mood === "listening" && (
          <ellipse cx="60" cy="82" rx="6" ry="5" fill={STROKE} />
        )}
        {mood === "thinking" && (
          <path
            d="M52 82 L68 82"
            stroke={STROKE}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    </span>
  );
}

export default BangBangAvatar;
