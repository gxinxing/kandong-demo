import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

interface MastheadConfig {
  /** Issue numeral, e.g. "No.001". */
  issue?: string;
  /** Dateline, e.g. "2026·05·16". */
  date?: string;
  /** Kicker / publication name, e.g. "反诈助手". */
  kicker?: string;
}

interface PageShellProps {
  /** Optional header title — renders as compact dateline header with back arrow. */
  title?: string;
  /** Where the back arrow points. Defaults to «/». */
  backHref?: string;
  /** Hide the back arrow even when a title is provided. */
  hideBack?: boolean;
  /** Override the back button accessible label. */
  backLabel?: string;
  /** Optional masthead config — renders editorial dateline strip across top. */
  masthead?: MastheadConfig;
  children: ReactNode;
}

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: "var(--max-width)",
  marginInline: "auto",
  paddingTop: "calc(env(safe-area-inset-top) + var(--space-3))",
  paddingBottom: "calc(env(safe-area-inset-bottom) + var(--space-5))",
  paddingLeft: "calc(env(safe-area-inset-left) + var(--space-3))",
  paddingRight: "calc(env(safe-area-inset-right) + var(--space-3))",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-4)",
  minHeight: "100dvh",
};

const backStyle: CSSProperties = {
  minWidth: 88,
  minHeight: 88,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "var(--radius-button)",
  background: "var(--color-fg)",
  color: "var(--color-bg)",
  textDecoration: "none",
  boxShadow: "var(--shadow-button)",
  flexShrink: 0,
};

const titleStyle: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-title)",
  fontWeight: 900,
  letterSpacing: "-0.02em",
  lineHeight: 1,
  margin: 0,
  flex: 1,
  minWidth: 0,
  wordBreak: "break-word",
};

const datelineStripStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  fontSize: "var(--text-eyebrow)",
  fontWeight: 800,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "var(--color-fg)",
  paddingBottom: "var(--space-1)",
  borderBottom: "var(--rule-hair) solid var(--color-rule)",
  gap: "var(--space-2)",
};

const BackArrow = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="20" y1="12" x2="4" y2="12" />
    <polyline points="10 18 4 12 10 6" />
  </svg>
);

export function PageShell({
  title,
  backHref = "/",
  hideBack,
  backLabel,
  masthead,
  children,
}: PageShellProps) {
  const hasHeader = Boolean(title);
  const hasMasthead = Boolean(masthead);
  return (
    <div style={shellStyle}>
      {hasMasthead ? (
        <div style={datelineStripStyle} aria-hidden="true">
          <span>{masthead?.kicker ?? "KANDONG"}</span>
          <span style={{ flex: 1, textAlign: "center", opacity: 0.7 }}>
            {masthead?.issue ?? ""}
          </span>
          <span>{masthead?.date ?? ""}</span>
        </div>
      ) : null}
      {hasHeader ? (
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            paddingBottom: "var(--space-2)",
            borderBottom: "var(--rule-heavy) solid var(--color-rule)",
          }}
        >
          {!hideBack ? (
            <Link
              href={backHref}
              aria-label={backLabel ?? "返回上一页"}
              style={backStyle}
            >
              {BackArrow}
            </Link>
          ) : null}
          <h1 style={titleStyle}>{title}</h1>
        </header>
      ) : null}
      <main
        id="main"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          flex: 1,
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default PageShell;
