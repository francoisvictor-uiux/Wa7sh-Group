"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterTab<K extends string = string> {
  k:      K;
  label:  string;
  count?: number;
  icon?:  LucideIcon;
}

interface Props<K extends string> {
  options:  FilterTab<K>[];
  active:   K;
  onChange: (k: K) => void;
  size?:    "sm" | "md";
  scroll?:  boolean;
  className?: string;
}

/**
 * FilterTabs — single source of truth for the chip-tabs-with-counts pattern.
 * Use in PageHeader meta slot or above lists. Active = brand-primary fill.
 */
export function FilterTabs<K extends string>({
  options, active, onChange, size = "md", scroll = true, className,
}: Props<K>) {
  const heights = { sm: "h-7 px-2.5 text-[11px]", md: "h-8 px-3 text-xs" };

  return (
    <div className={cn(scroll && "overflow-x-auto", className)}>
      <div className={cn("flex items-center gap-1.5", scroll ? "min-w-max" : "flex-wrap")}>
        {options.map((opt) => {
          const isActive = opt.k === active;
          const Icon = opt.icon;
          return (
            <button
              key={opt.k}
              type="button"
              onClick={() => onChange(opt.k)}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 rounded-full border",
                "font-medium tracking-tight transition-colors duration-fast",
                heights[size],
                isActive
                  ? "bg-brand-primary text-text-on-brand border-brand-primary"
                  : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary",
              )}
            >
              {Icon && <Icon className="w-3 h-3" strokeWidth={2} />}
              <span>{opt.label}</span>
              {opt.count !== undefined && (
                <span className={cn(
                  "tabular text-[10px] font-bold",
                  isActive ? "opacity-90" : "text-text-tertiary",
                )}>
                  {opt.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
