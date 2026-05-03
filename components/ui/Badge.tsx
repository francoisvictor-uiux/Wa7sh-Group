import * as React from "react";
import { cn } from "@/lib/utils";

type Intent =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brand";
type Size = "sm" | "md";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  intent?: Intent;
  size?: Size;
  dot?: boolean;
  pulse?: boolean;
}

const intents: Record<Intent, string> = {
  neutral: "bg-bg-surface-raised text-text-secondary border-border",
  success: "bg-status-success/12 text-status-success border-status-success/30",
  warning: "bg-status-warning/12 text-status-warning border-status-warning/30",
  danger: "bg-status-danger/12 text-status-danger border-status-danger/30",
  info: "bg-status-info/12 text-status-info border-status-info/30",
  brand: "bg-brand-primary/12 text-brand-primary border-brand-primary/30",
};

const sizes: Record<Size, string> = {
  sm: "h-6 px-2.5 text-xs gap-1.5",
  md: "h-7 px-3 text-sm gap-2",
};

export function Badge({
  intent = "neutral",
  size = "sm",
  dot,
  pulse,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium tracking-tight whitespace-nowrap",
        intents[intent],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden
          className={cn(
            "w-1.5 h-1.5 rounded-full bg-current shrink-0",
            pulse && "animate-pulse-dot"
          )}
        />
      )}
      {children}
    </span>
  );
}
