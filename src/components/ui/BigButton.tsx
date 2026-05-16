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
  },
  secondary: {
    background: "var(--color-surface)",
    color: "var(--color-fg)",
    boxShadow:
      "inset 0 0 0 3px var(--color-fg), var(--shadow-button)",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-fg)",
    boxShadow: "inset 0 0 0 2px var(--color-border)",
  },
};

const baseClass = [
  "kd-bigbutton",
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-3",
  "rounded-[var(--radius-button)]",
  "select-none",
  "cursor-pointer",
  "transition-transform",
  "duration-[var(--duration-fast)]",
  "ease-[cubic-bezier(0.16,1,0.3,1)]",
  "active:scale-[0.97]",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
  "disabled:active:scale-100",
].join(" ");

const inlineSizing: CSSProperties = {
  minHeight: 96,
  minWidth: 88,
  padding: "var(--space-3) var(--space-4)",
  fontSize: "var(--text-button)",
  fontWeight: 700,
  lineHeight: 1.2,
  textDecoration: "none",
  letterSpacing: "0.02em",
};

export function BigButton(props: BigButtonProps) {
  const {
    children,
    variant = "primary",
    className,
    fullWidth,
    leading,
  } = props;

  const composedStyle: CSSProperties = {
    ...inlineSizing,
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
      <span>{children}</span>
    </>
  );

  if (props.as === "a") {
    const { as: _as, variant: _v, className: _c, fullWidth: _fw, leading: _l, children: _ch, ...rest } =
      props;
    return (
      <a {...rest} className={composedClass} style={composedStyle}>
        {content}
      </a>
    );
  }

  const { as: _as, variant: _v, className: _c, fullWidth: _fw, leading: _l, children: _ch, type, ...rest } =
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
