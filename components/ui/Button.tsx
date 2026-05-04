"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const base =
  "relative inline-flex items-center justify-center gap-2 font-medium tracking-tight " +
  "transition-all duration-fast ease-out-expo " +
  "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 " +
  "active:scale-[0.985]";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-primary text-text-on-brand " +
    "hover:bg-brand-primary-hover " +
    "active:bg-brand-primary-active " +
    "shadow-sm hover:shadow-md",
  secondary:
    "bg-transparent text-text-primary border border-border " +
    "hover:bg-bg-surface-raised hover:border-border-strong",
  ghost:
    "bg-transparent text-text-secondary " +
    "hover:bg-bg-surface-raised hover:text-text-primary",
  danger:
    "bg-status-danger text-white " +
    "hover:brightness-110 active:brightness-95",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm rounded-sm",
  md: "h-12 px-5 text-base rounded-md",
  lg: "h-14 px-7 text-md rounded-md",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      className,
      fullWidth,
      loading,
      leadingIcon,
      trailingIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {/* Icons always render on the leading (right in RTL) side, before
            the text label. `leadingIcon` and `trailingIcon` are both placed
            here so that any button with an icon + text follows the
            icon-on-right, text-on-left convention. */}
        {loading ? (
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-l-transparent"
          />
        ) : (
          <>
            {leadingIcon}
            {trailingIcon}
          </>
        )}
        {/* inline-flex so any icon passed inline alongside text inside
            children renders on the same line — without it, Tailwind's
            preflight makes SVGs `display: block` and they stack above
            the text in RTL. */}
        <span className="inline-flex items-center gap-2">{children}</span>
      </button>
    );
  }
);
