import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from "react";

export type BigButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

interface BaseProps {
  children: ReactNode;
  variant?: BigButtonVariant;
  className?: string;
  fullWidth?: boolean;
  /** Optional leading icon/emoji shown before the label. */
  leading?: ReactNode;
  /** Optional trailing affordance (icon or text). Defaults to none. */
  trailing?: ReactNode;
  /** @deprecated Removed in v3.0 — accepted for backward compat, ignored. */
  trailingArrow?: boolean;
  /** Bump size: "md" default 88, "lg" 104, "xl" 132 (round CTA). */
  size?: "md" | "lg" | "xl";
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
    background: "var(--color-ink)",
    color: "var(--color-surface)",
    border: "1.5px solid var(--color-ink)",
    boxShadow: "var(--shadow-cta)",
  },
  secondary: {
    background: "var(--color-bubble)",
    color: "var(--color-ink)",
    border: "1.5px solid var(--color-ink)",
    boxShadow: "var(--shadow-bubble)",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-ink)",
    border: "1.5px solid var(--color-line-strong)",
    boxShadow: "none",
  },
  danger: {
    background: "var(--color-risk-red)",
    color: "var(--color-surface)",
    border: "1.5px solid var(--color-risk-red)",
    boxShadow: "var(--shadow-cta)",
  },
};

const SIZE_MIN: Record<NonNullable<BaseProps["size"]>, number> = {
  md: 88,
  lg: 104,
  xl: 132,
};

const baseClass = [
  "kd-bigbutton",
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-3",
  "select-none",
  "cursor-pointer",
  "active:scale-[0.98]",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
  "disabled:active:scale-100",
].join(" ");

function sizingStyle(size: NonNullable<BaseProps["size"]>): CSSProperties {
  const min = SIZE_MIN[size];
  return {
    minHeight: min,
    minWidth: min,
    padding: "var(--space-4) var(--space-3)",
    fontSize: "var(--text-button)",
    fontFamily: "var(--font-sans)",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: 0,
    textDecoration: "none",
    borderRadius: "var(--radius-button)",
    transition: "transform var(--motion-fast) var(--ease-out)",
  };
}

export function BigButton(props: BigButtonProps) {
  const {
    children,
    variant = "primary",
    className,
    fullWidth = true,
    leading,
    trailing,
    size = "md",
  } = props;

  const composedStyle: CSSProperties = {
    ...sizingStyle(size),
    ...VARIANT_STYLE[variant],
    width: fullWidth ? "100%" : undefined,
  };

  const composedClass = [baseClass, className ?? ""].filter(Boolean).join(" ");

  const content = (
    <>
      {leading != null ? (
        <span aria-hidden="true" className="inline-flex items-center">
          {leading}
        </span>
      ) : null}
      <span style={{ flex: fullWidth ? 1 : undefined, textAlign: "center" }}>
        {children}
      </span>
      {trailing != null ? (
        <span aria-hidden="true" className="inline-flex items-center">
          {trailing}
        </span>
      ) : null}
    </>
  );

  if (props.as === "a") {
    const {
      as: _as,
      variant: _v,
      className: _c,
      fullWidth: _fw,
      leading: _l,
      trailing: _t,
      trailingArrow: _ta,
      size: _s,
      children: _ch,
      ...rest
    } = props;
    return (
      <a {...rest} className={composedClass} style={composedStyle}>
        {content}
      </a>
    );
  }

  const {
    as: _as,
    variant: _v,
    className: _c,
    fullWidth: _fw,
    leading: _l,
    trailing: _t,
    trailingArrow: _ta,
    size: _s,
    children: _ch,
    type,
    ...rest
  } = props;
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
