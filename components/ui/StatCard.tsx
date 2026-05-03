"use client";

import * as React from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { Kpi } from "@/lib/mock/kpis";

interface StatCardProps {
  kpi: Kpi;
  icon?: React.ReactNode;
  className?: string;
  emphasize?: boolean;
}

export function StatCard({ kpi, icon, className, emphasize }: StatCardProps) {
  const intentTone =
    kpi.intent === "positive"
      ? "text-status-success"
      : kpi.intent === "negative"
      ? "text-status-danger"
      : kpi.intent === "warning"
      ? "text-status-warning"
      : "text-text-tertiary";

  const TrendIcon =
    kpi.trend === "up" ? ArrowUp : kpi.trend === "down" ? ArrowDown : Minus;

  return (
    <Card
      variant={emphasize ? "raised" : "default"}
      padding="md"
      className={cn(
        "relative overflow-hidden flex flex-col gap-3 min-w-0",
        emphasize && "shadow-md",
        className
      )}
    >
      {emphasize && (
        <div
          aria-hidden
          className="absolute -top-12 -left-12 w-32 h-32 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--brand-primary)" }}
        />
      )}

      <div className="relative flex items-start justify-between gap-3 z-10">
        <p className="text-xs text-text-tertiary tracking-tight leading-tight min-w-0">
          {kpi.label}
        </p>
        {icon && (
          <div className="shrink-0 w-8 h-8 rounded-md bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div className="relative flex items-baseline gap-1.5 z-10 min-w-0">
        <span className="text-2xl sm:text-3xl font-bold tabular tracking-tight truncate">
          {kpi.value}
        </span>
        {kpi.unit && (
          <span className="text-sm text-text-tertiary font-medium">
            {kpi.unit}
          </span>
        )}
      </div>

      <div className="relative flex items-center justify-between gap-2 z-10 min-w-0">
        {typeof kpi.delta === "number" && (
          <div
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium tabular shrink-0",
              intentTone
            )}
          >
            <TrendIcon className="w-3 h-3" strokeWidth={2.5} />
            <span>
              {kpi.delta > 0 ? "+" : ""}
              {kpi.delta}%
            </span>
          </div>
        )}
        {kpi.hint && (
          <p className="text-[11px] text-text-tertiary truncate">{kpi.hint}</p>
        )}
      </div>
    </Card>
  );
}
