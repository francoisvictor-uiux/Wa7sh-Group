"use client";

import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

export type KpiTone = "neutral" | "info" | "success" | "warning" | "danger" | "brand";

interface Props {
  label:    string;
  value:    number | string;
  unit?:    string;
  hint?:    string;
  icon?:    LucideIcon;
  tone?:    KpiTone;
  /** Stronger visual weight: tinted background + accent border. */
  emphasis?: boolean;
  className?: string;
}

const toneText: Record<KpiTone, string> = {
  neutral: "text-text-primary",
  info:    "text-status-info",
  success: "text-status-success",
  warning: "text-status-warning",
  danger:  "text-status-danger",
  brand:   "text-brand-primary",
};

const toneEmphasis: Record<KpiTone, string> = {
  neutral: "",
  info:    "border-status-info/40    bg-status-info/5",
  success: "border-status-success/40 bg-status-success/5",
  warning: "border-status-warning/40 bg-status-warning/6",
  danger:  "border-status-danger/40  bg-status-danger/5",
  brand:   "border-brand-primary/30  bg-brand-primary/5",
};

/**
 * KpiTile — single source of truth for at-a-glance metrics.
 * Replaces the duplicated KpiTile sub-components in Inventory, Suppliers,
 * Logistics, Finance.
 */
export function KpiTile({
  label, value, unit, hint, icon: Icon, tone = "neutral", emphasis, className,
}: Props) {
  return (
    <Card
      padding="md"
      className={cn(
        "min-w-0 transition-colors duration-fast",
        emphasis && toneEmphasis[tone],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[10px] text-text-tertiary tracking-[0.18em] uppercase font-semibold truncate">
          {label}
        </p>
        {Icon && <Icon className={cn("w-3.5 h-3.5 shrink-0", toneText[tone])} strokeWidth={1.75} />}
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className={cn("text-2xl sm:text-3xl font-bold tabular tracking-tight leading-none", toneText[tone])}>
          {value}
        </p>
        {unit && <span className="text-xs text-text-tertiary font-medium">{unit}</span>}
      </div>
      {hint && (
        <p className="text-[11px] text-text-tertiary mt-1.5 truncate">{hint}</p>
      )}
    </Card>
  );
}
