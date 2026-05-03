import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "raised" | "ghost" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
}

const variants = {
  default: "bg-bg-surface border border-border-subtle",
  raised: "bg-bg-surface-raised border border-border-subtle shadow-sm",
  ghost: "bg-transparent",
  outlined: "bg-transparent border border-border",
};

const paddings = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant = "default", padding = "md", children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg",
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 mb-4",
        className
      )}
    >
      <div className="min-w-0">
        <h3 className="text-base font-medium tracking-tight">{title}</h3>
        {subtitle && (
          <p className="text-xs text-text-tertiary mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
