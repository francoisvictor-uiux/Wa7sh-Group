"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger" | "brand";

interface Props {
  tone:    StatusTone;
  icon?:   LucideIcon;
  label:   string;
  size?:   "sm" | "md";
  className?: string;
}

const tones: Record<StatusTone, string> = {
  neutral: "text-text-tertiary  bg-bg-surface-raised   border-border-subtle",
  info:    "text-status-info    bg-status-info/10      border-status-info/30",
  success: "text-status-success bg-status-success/10   border-status-success/30",
  warning: "text-status-warning bg-status-warning/10   border-status-warning/30",
  danger:  "text-status-danger  bg-status-danger/10    border-status-danger/30",
  brand:   "text-brand-primary  bg-brand-primary/10    border-brand-primary/30",
};

const sizes = {
  sm: "text-[10px] px-2   py-0.5 gap-1   [&_svg]:w-2.5 [&_svg]:h-2.5",
  md: "text-[11px] px-2.5 py-1   gap-1.5 [&_svg]:w-3 [&_svg]:h-3",
};

/**
 * StatusPill — single source of truth for status display.
 * Consistent: bordered, color-coded, optional icon, font-medium.
 */
export function StatusPill({ tone, icon: Icon, label, size = "md", className }: Props) {
  return (
    <span className={cn(
      "inline-flex items-center font-medium rounded-full border whitespace-nowrap",
      tones[tone],
      sizes[size],
      className
    )}>
      {Icon && <Icon strokeWidth={2} />}
      {label}
    </span>
  );
}
