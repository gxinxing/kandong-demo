import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

interface PageShellProps {
  /** Optional header title. When provided a back-arrow is rendered. */
  title?: string;
  /** Where the back arrow points. Defaults to «/». */
  backHref?: string;
  /** Hide the back arrow even when a title is provided. */
  hideBack?: boolean;
  /** Override the back button accessible label. */
  backLabel?: string;
  children: ReactNode;
}

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: "var(--max-width)",
  marginInline: "auto",
  paddingTop: "calc(env(safe-area-inset-top) + var(--space-3))",
  paddingBottom: "calc(env(safe-area-inset-bottom) + var(--space-4))",
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
  borderRadius: "var(--radius-pill)",
  background: "var(--color-surface)",
  color: "var(--color-fg)",
  textDecoration: "none",
  boxShadow: "var(--shadow-button)",
  flexShrink: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "var(--text-title)",
  fontWeight: 800,
  letterSpacing: "-0.01em",
  margin: 0,
  flex: 1,
  minWidth: 0,
  wordBreak: "break-word",
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
  children,
}: PageShellProps) {
  const hasHeader = Boolean(title);
  return (
    <div style={shellStyle}>
      {hasHeader ? (
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
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
