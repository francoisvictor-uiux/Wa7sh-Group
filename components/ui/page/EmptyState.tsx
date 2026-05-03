"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon:        LucideIcon;
  title:       string;
  description?: string;
  action?:     React.ReactNode;
  size?:       "sm" | "md" | "lg";
  className?:  string;
}

/**
 * EmptyState — single source of truth for empty/no-data screens.
 *
 * Always include: (1) reassuring title, (2) what to do next.
 * Never just "no data".
 */
export function EmptyState({
  icon: Icon, title, description, action, size = "md", className,
}: Props) {
  const sizes = {
    sm: { icon: "w-8 h-8",  iconWrap: "w-12 h-12", title: "text-sm",  desc: "text-xs"  },
    md: { icon: "w-9 h-9",  iconWrap: "w-14 h-14", title: "text-base", desc: "text-xs" },
    lg: { icon: "w-10 h-10", iconWrap: "w-16 h-16", title: "text-lg",  desc: "text-sm" },
  };
  const s = sizes[size];

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      "py-12 px-6 gap-2",
      className
    )}>
      <div className={cn(
        "rounded-2xl bg-bg-surface-raised flex items-center justify-center mb-2",
        s.iconWrap
      )}>
        <Icon className={cn("text-text-tertiary", s.icon)} strokeWidth={1.25} />
      </div>
      <p className={cn("font-semibold text-text-secondary tracking-tight", s.title)}>
        {title}
      </p>
      {description && (
        <p className={cn("text-text-tertiary leading-relaxed max-w-xs", s.desc)}>
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
