import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

interface MastheadConfig {
  /** Issue numeral, e.g. "No.001". */
  issue?: string;
  /** Dateline, e.g. "2026·05·16". */
  date?: string;
  /** Kicker / publication name, e.g. "反诈助手". */
  kicker?: string;
  /** Show the giant 看懂 wordmark as the masthead anchor. Defaults true. */
  showWordmark?: boolean;
  /** Optional tagline below the wordmark. */
  tagline?: string;
}

interface PageShellProps {
  /** Optional header title — renders as compact header with back arrow. */
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
  paddingBottom: "calc(env(safe-area-inset-bottom) + var(--space-9))",
  paddingLeft: "calc(env(safe-area-inset-left) + var(--space-5))",
  paddingRight: "calc(env(safe-area-inset-right) + var(--space-5))",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-7)",
  minHeight: "100dvh",
  position: "relative",
};

const backStyle: CSSProperties = {
  minWidth: 64,
  minHeight: 64,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "var(--radius-full)",
  background: "transparent",
  border: "1.5px solid var(--color-ink)",
  color: "var(--color-ink)",
  textDecoration: "none",
  flexShrink: 0,
};

const titleStyle: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(28px, 9vw, 40px)",
  fontWeight: 400,
  letterSpacing: "-0.02em",
  lineHeight: 1.05,
  margin: 0,
  flex: 1,
  minWidth: 0,
  wordBreak: "break-word",
  color: "var(--color-ink)",
};

const BackArrow = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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
  const showWordmark = masthead?.showWordmark ?? false;
  return (
    <div style={shellStyle}>
      {hasMasthead ? (
        <header className="kd-masthead" aria-hidden="true">
          <div className="kd-masthead-row">
            <span>{masthead?.kicker ?? "KANDONG"}</span>
            <span>{masthead?.issue ?? ""}</span>
            <span style={{ textAlign: "right" }}>{masthead?.date ?? ""}</span>
          </div>
          {showWordmark ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
                marginTop: "var(--space-3)",
              }}
            >
              <span className="kd-wordmark">看懂一下</span>
              {masthead?.tagline ? (
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                  }}
                >
                  {masthead.tagline}
                </span>
              ) : null}
            </div>
          ) : null}
        </header>
      ) : null}
      {hasHeader ? (
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
            paddingBottom: "var(--space-3)",
            borderBottom: "1px solid var(--color-border)",
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
          gap: "var(--space-7)",
          flex: 1,
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default PageShell;
