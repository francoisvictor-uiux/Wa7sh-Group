"use client";

import {
  Clock,
  Check,
  ChefHat,
  Package,
  Truck,
  CheckCircle2,
  Archive,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RequestStatus, RequestRecord } from "@/lib/mock/requests";

interface TimelineStep {
  key: RequestStatus;
  label: string;
  owner: string;
  icon: LucideIcon;
}

const STEPS: TimelineStep[] = [
  { key: "requested", label: "تم الطلب", owner: "مدير الفرع", icon: Clock },
  { key: "approved", label: "تمت الموافقة", owner: "مدير المصنع", icon: Check },
  { key: "preparing", label: "جاري التحضير", owner: "رئيس المخزن", icon: ChefHat },
  { key: "in-transit", label: "في الطريق", owner: "السائق", icon: Truck },
  { key: "delivered", label: "تم التسليم", owner: "السائق + GPS", icon: CheckCircle2 },
  { key: "confirmed", label: "تم التأكيد", owner: "مدير الفرع", icon: CheckCircle2 },
  { key: "closed", label: "مغلق", owner: "النظام", icon: Archive },
];

function statusToStep(status: RequestStatus): number {
  const found = STEPS.findIndex((s) => s.key === status);
  return found < 0 ? 0 : found;
}

/**
 * RequestTimeline — RTL horizontal flow.
 * Reading right-to-left: rightmost = step 1 (oldest), leftmost = step 8 (newest).
 * Completed steps on the right, current pulses, pending steps to the left.
 */
export function RequestTimeline({
  request,
  orientation = "horizontal",
  className,
}: {
  request: RequestRecord;
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  const currentIdx = statusToStep(request.status);
  const isEdgeState = ["disputed", "rejected", "cancelled", "on-hold"].includes(
    request.status
  );

  if (orientation === "vertical") {
    return (
      <ol className={cn("flex flex-col gap-1", className)}>
        {STEPS.map((step, i) => {
          const state =
            isEdgeState && i > 1
              ? "blocked"
              : i < currentIdx
              ? "complete"
              : i === currentIdx
              ? "current"
              : "pending";
          return (
            <VerticalStep key={step.key} step={step} state={state} index={i} />
          );
        })}
      </ol>
    );
  }

  return (
    <ol
      className={cn(
        "flex items-stretch w-full overflow-x-auto pt-3 pb-2",
        className
      )}
      role="list"
    >
      {STEPS.map((step, i) => {
        const state =
          isEdgeState && i > 1
            ? "blocked"
            : i < currentIdx
            ? "complete"
            : i === currentIdx
            ? "current"
            : "pending";
        return (
          <HorizontalStep
            key={step.key}
            step={step}
            state={state}
            isFirst={i === 0}
            isLast={i === STEPS.length - 1}
          />
        );
      })}
    </ol>
  );
}

/* ---------- Horizontal step ---------- */

function HorizontalStep({
  step,
  state,
  isFirst,
  isLast,
}: {
  step: TimelineStep;
  state: "complete" | "current" | "pending" | "blocked";
  isFirst: boolean;
  isLast: boolean;
}) {
  const Icon = step.icon;

  const dotClass =
    state === "complete"
      ? "bg-status-success text-white border-status-success"
      : state === "current"
      ? "bg-brand-primary text-text-on-brand border-brand-primary"
      : state === "blocked"
      ? "bg-bg-surface text-text-tertiary border-border"
      : "bg-bg-surface text-text-tertiary border-border";

  const labelClass =
    state === "complete"
      ? "text-text-primary"
      : state === "current"
      ? "text-brand-primary font-medium"
      : "text-text-tertiary";

  const connectorClass =
    state === "complete"
      ? "bg-status-success/60"
      : state === "current"
      ? "bg-brand-primary/40"
      : "bg-border";

  return (
    <li className="flex-1 min-w-[88px] relative">
      {/* In RTL (no flex-row-reverse): item 0 is rightmost.
          !isFirst = has a neighbour to the RIGHT (previous/completed step) */}
      {!isFirst && (
        <div
          className={cn(
            "absolute top-5 left-1/2 right-0 h-0.5 transition-colors duration-fast",
            connectorClass
          )}
        />
      )}
      {/* !isLast = has a neighbour to the LEFT (next/pending step) */}
      {!isLast && (
        <div
          className={cn(
            "absolute top-5 right-1/2 left-0 h-0.5 transition-colors duration-fast",
            state === "current" || state === "complete"
              ? state === "complete"
                ? "bg-status-success/60"
                : "bg-border"
              : "bg-border"
          )}
        />
      )}
      <div className="relative flex flex-col items-center gap-2 px-2">
        <div
          className={cn(
            "relative w-10 h-10 rounded-full border-2 flex items-center justify-center",
            "transition-all duration-fast ease-out-expo",
            dotClass,
            state === "current" && "ring-4 ring-brand-primary/20"
          )}
        >
          {state === "current" && (
            <span
              aria-hidden
              className="absolute -inset-1 rounded-full border-2 border-brand-primary/30 animate-pulse-dot"
            />
          )}
          <Icon className="w-4 h-4" strokeWidth={2.25} />
        </div>
        <div className="text-center min-w-0">
          <p className={cn("text-[11px] tracking-tight leading-tight", labelClass)}>
            {step.label}
          </p>
          <p className="text-[10px] text-text-tertiary mt-0.5 leading-tight truncate">
            {step.owner}
          </p>
        </div>
      </div>
    </li>
  );
}

/* ---------- Vertical step ---------- */

function VerticalStep({
  step,
  state,
  index,
}: {
  step: TimelineStep;
  state: "complete" | "current" | "pending" | "blocked";
  index: number;
}) {
  const Icon = step.icon;

  const dotClass =
    state === "complete"
      ? "bg-status-success text-white border-status-success"
      : state === "current"
      ? "bg-brand-primary text-text-on-brand border-brand-primary"
      : "bg-bg-surface text-text-tertiary border-border";

  return (
    <li className="flex items-stretch gap-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "relative w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0",
            "transition-all duration-fast",
            dotClass,
            state === "current" && "ring-4 ring-brand-primary/20"
          )}
        >
          {state === "current" && (
            <span
              aria-hidden
              className="absolute -inset-1 rounded-full border border-brand-primary/30 animate-pulse-dot"
            />
          )}
          <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
        </div>
        {index < STEPS.length - 1 && (
          <span
            className={cn(
              "flex-1 w-0.5 my-1 min-h-[16px]",
              state === "complete" ? "bg-status-success/60" : "bg-border"
            )}
          />
        )}
      </div>
      <div className={cn("flex-1 pb-2", state === "pending" && "opacity-60")}>
        <p
          className={cn(
            "text-sm tracking-tight leading-tight",
            state === "current" ? "text-brand-primary font-medium" : ""
          )}
        >
          {step.label}
        </p>
        <p className="text-[11px] text-text-tertiary mt-0.5">{step.owner}</p>
      </div>
    </li>
  );
}
