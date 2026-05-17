import type { CSSProperties, ReactNode } from "react";
import { AppHeader } from "./AppHeader";

interface PageShellProps {
  /** Optional header title. Defaults to «看懂一下». Pass `null` to hide the AppHeader entirely. */
  title?: string | null;
  /** Where the back arrow points. Omit to hide back arrow. */
  backHref?: string;
  /** Hide the back arrow even when backHref is provided. */
  hideBack?: boolean;
  /** Override the back button accessible label. */
  backLabel?: string;
  /** Hide 帮帮 small avatar in the header. */
  hideAvatar?: boolean;
  /** Sticky footer slot (e.g. HoldToTalkBar). */
  footer?: ReactNode;
  children: ReactNode;
  /** @deprecated Newspaper masthead removed in v3.0; this prop is ignored. */
  masthead?: unknown;
}

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: "var(--max-width)",
  marginInline: "auto",
  paddingTop: "calc(env(safe-area-inset-top) + var(--space-3))",
  paddingBottom: "calc(env(safe-area-inset-bottom) + var(--space-6))",
  paddingLeft: "calc(env(safe-area-inset-left) + var(--space-5))",
  paddingRight: "calc(env(safe-area-inset-right) + var(--space-5))",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-5)",
  minHeight: "100dvh",
  position: "relative",
};

const footerSlotStyle: CSSProperties = {
  position: "sticky",
  bottom: 0,
  left: 0,
  right: 0,
  marginInline: "calc(var(--space-5) * -1)",
  paddingInline: "var(--space-5)",
  paddingBottom: "calc(env(safe-area-inset-bottom) + var(--space-3))",
  paddingTop: "var(--space-6)",
  background:
    "linear-gradient(to top, var(--color-canvas) 55%, rgba(245, 239, 224, 0.92) 80%, rgba(245, 239, 224, 0))",
  pointerEvents: "none",
};

export function PageShell({
  title,
  backHref,
  hideBack,
  backLabel,
  hideAvatar,
  footer,
  children,
}: PageShellProps) {
  const showHeader = title !== null;
  const resolvedBackHref = backHref && !hideBack ? backHref : undefined;

  return (
    <div style={shellStyle}>
      {showHeader ? (
        <AppHeader
          title={title ?? "看懂一下"}
          backHref={resolvedBackHref}
          backLabel={backLabel}
          hideAvatar={hideAvatar}
        />
      ) : null}
      <main
        id="main"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)",
          flex: 1,
          paddingBottom: footer
            ? "calc(var(--hold-bar-height) + var(--space-5))"
            : undefined,
        }}
      >
        {children}
      </main>
      {footer ? <div style={footerSlotStyle}>{footer}</div> : null}
    </div>
  );
}

export default PageShell;
