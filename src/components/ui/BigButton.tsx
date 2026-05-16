import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from "react";

export type BigButtonVariant = "primary" | "secondary" | "ghost";

interface BaseProps {
  children: ReactNode;
  variant?: BigButtonVariant;
  className?: string;
  fullWidth?: boolean;
  /** Optional emoji or icon node rendered before the label. */
  leading?: ReactNode;
  /** Show a hanging arrow affordance on the right. Defaults to true for primary/secondary. */
  trailingArrow?: boolean;
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: "button";
    href?: never;
  };

type ButtonAsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: "a";
    href: string;
  };

export type BigButtonProps = ButtonAsButton | ButtonAsAnchor;

const VARIANT_STYLE: Record<BigButtonVariant, CSSProperties> = {
  primary: {
    background: "var(--color-fg)",
    color: "var(--color-bg)",
    boxShadow: "var(--shadow-button)",
    border: "var(--rule-medium) solid var(--color-rule)",
  },
  secondary: {
    background: "var(--color-surface)",
    color: "var(--color-fg)",
    boxShadow: "var(--shadow-button)",
    border: "var(--rule-medium) solid var(--color-rule)",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-fg)",
    border: "var(--rule-hair) solid var(--color-rule)",
  },
};

const baseClass = [
  "kd-bigbutton",
  "inline-flex",
  "items-center",
  "gap-3",
  "select-none",
  "cursor-pointer",
  "transition-transform",
  "duration-[var(--duration-fast)]",
  "ease-[cubic-bezier(0.16,1,0.3,1)]",
  "active:translate-x-[2px]",
  "active:translate-y-[2px]",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
  "disabled:active:translate-x-0",
  "disabled:active:translate-y-0",
].join(" ");

const inlineSizing: CSSProperties = {
  minHeight: 96,
  minWidth: 88,
  padding: "var(--space-2) var(--space-3)",
  fontSize: "var(--text-button)",
  fontFamily: "var(--font-display)",
  fontWeight: 900,
  lineHeight: 1.1,
  letterSpacing: "-0.01em",
  textDecoration: "none",
  borderRadius: "var(--radius-button)",
  width: "100%",
  justifyContent: "space-between",
  textAlign: "left",
};

const Arrow = (
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
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="14 6 20 12 14 18" />
  </svg>
);

export function BigButton(props: BigButtonProps) {
  const {
    children,
    variant = "primary",
    className,
    fullWidth = true,
    leading,
    trailingArrow,
  } = props;

  const showArrow =
    trailingArrow ?? (variant === "primary" || variant === "secondary");

  const composedStyle: CSSProperties = {
    ...inlineSizing,
    ...VARIANT_STYLE[variant],
    width: fullWidth ? "100%" : undefined,
  };

  const composedClass = [baseClass, className ?? ""].filter(Boolean).join(" ");

  const content = (
    <>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          flex: 1,
          minWidth: 0,
        }}
      >
        {leading != null ? (
          <span aria-hidden="true" className="inline-flex items-center">
            {leading}
          </span>
        ) : null}
        <span style={{ flex: 1, minWidth: 0 }}>{children}</span>
      </span>
      {showArrow ? (
        <span
          aria-hidden="true"
          className="inline-flex items-center"
          style={{ flexShrink: 0 }}
        >
          {Arrow}
        </span>
      ) : null}
    </>
  );

  if (props.as === "a") {
    const { as: _as, variant: _v, className: _c, fullWidth: _fw, leading: _l, trailingArrow: _ta, children: _ch, ...rest } =
      props;
    return (
      <a {...rest} className={composedClass} style={composedStyle}>
        {content}
      </a>
    );
  }

  const { as: _as, variant: _v, className: _c, fullWidth: _fw, leading: _l, trailingArrow: _ta, children: _ch, type, ...rest } =
    props;
  return (
    <button
      {...rest}
      type={type ?? "button"}
      className={composedClass}
      style={composedStyle}
    >
      {content}
    </button>
  );
}

export default BigButton;
