import type { CSSProperties } from "react";
import Link from "next/link";
import { BangBangAvatar } from "@/components/bangbang/BangBangAvatar";

interface AppHeaderProps {
  title?: string;
  /** Show a back arrow on the left (standard mobile UX). */
  backHref?: string;
  /** Accessible label for the back link. Defaults to «返回». */
  backLabel?: string;
  /** Hide 帮帮 avatar (e.g. dense pages). Default false. */
  hideAvatar?: boolean;
}

const wrapperStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-3)",
  height: "var(--app-header-height)",
  paddingBlock: "var(--space-2)",
  width: "100%",
};

const titleStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "var(--text-title)",
  fontWeight: 700,
  letterSpacing: 0,
  color: "var(--color-ink)",
  flex: 1,
  minWidth: 0,
  margin: 0,
};

const backStyle: CSSProperties = {
  minWidth: 64,
  minHeight: 64,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "var(--radius-pill)",
  background: "transparent",
  border: "1.5px solid var(--color-ink)",
  color: "var(--color-ink)",
  textDecoration: "none",
  flexShrink: 0,
};

const BackArrow = (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="20" y1="12" x2="4" y2="12" />
    <polyline points="10 18 4 12 10 6" />
  </svg>
);

export function AppHeader({
  title = "看懂一下",
  backHref,
  backLabel = "返回",
  hideAvatar = false,
}: AppHeaderProps) {
  return (
    <header style={wrapperStyle}>
      {backHref ? (
        <Link href={backHref} aria-label={backLabel} style={backStyle}>
          {BackArrow}
        </Link>
      ) : null}
      {!hideAvatar ? <BangBangAvatar size="sm" mood="idle" /> : null}
      <h1 style={titleStyle}>{title}</h1>
    </header>
  );
}

export default AppHeader;
