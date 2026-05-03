import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ExpiryBadge — color-coded by days left.
 *  ≤ 1 day  → red (urgent)
 *  ≤ 3 days → orange (warning)
 *  ≤ 7 days → yellow-ish (heads-up)
 *  > 7 days → muted green
 */
export function ExpiryBadge({
  daysLeft,
  showIcon = true,
  className,
}: {
  daysLeft: number;
  showIcon?: boolean;
  className?: string;
}) {
  const tone =
    daysLeft <= 1
      ? "bg-status-danger/15 text-status-danger border-status-danger/30"
      : daysLeft <= 3
      ? "bg-status-warning/15 text-status-warning border-status-warning/30"
      : daysLeft <= 7
      ? "bg-brand-warm/15 text-brand-warm border-brand-warm/30"
      : "bg-status-success/12 text-status-success border-status-success/30";

  const label =
    daysLeft <= 0
      ? "منتهي"
      : daysLeft === 1
      ? "ينتهي غدًا"
      : daysLeft < 7
      ? `${daysLeft} أيام`
      : daysLeft < 30
      ? `${daysLeft} يوم`
      : `${Math.round(daysLeft / 30)} شهر`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-medium tabular tracking-tight whitespace-nowrap border",
        tone,
        className
      )}
    >
      {showIcon && <Clock className="w-3 h-3" strokeWidth={2.25} />}
      {label}
    </span>
  );
}
