import Link from "next/link";
import {
  CheckCircle2, AlertTriangle, AlertCircle, Clock, XCircle, type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/page";
import { ExpiryBadge } from "./ExpiryBadge";
import {
  type StockItem, type StockHealth, stockHealthMeta,
} from "@/lib/mock/inventory";
import { cn } from "@/lib/utils";

const healthIcon: Record<StockHealth, LucideIcon> = {
  good:     CheckCircle2,
  low:      AlertTriangle,
  critical: AlertCircle,
  expiring: Clock,
  out:      XCircle,
};

export function StockItemCard({
  item,
  density = "comfortable",
}: {
  item: StockItem;
  density?: "compact" | "comfortable";
}) {
  const Icon = item.catalog.icon;
  const earliest = item.expiryBatches.reduce<{ daysLeft: number } | null>(
    (min, b) => (!min || b.daysLeft < min.daysLeft ? b : min),
    null
  );
  const stockPct  = Math.min(100, (item.currentQty / item.maxQty) * 100);
  const isCritical = item.health === "critical" || item.health === "out";
  const isExpiring = item.health === "expiring";
  const meta       = stockHealthMeta[item.health];
  const HealthIcon = healthIcon[item.health];

  return (
    <Link href={`/inventory/${item.catalogId}`} className="group block">
      <Card
        padding={density === "compact" ? "sm" : "md"}
        className={cn(
          "h-full transition-all duration-fast ease-out-expo",
          "group-hover:border-border-strong group-hover:shadow-md group-hover:-translate-y-0.5",
          isCritical && "border-status-danger/30",
          isExpiring && "border-status-warning/30"
        )}
      >
        {/* Top: icon + name */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={cn(
              "shrink-0 w-10 h-10 rounded-md flex items-center justify-center",
              isCritical
                ? "bg-status-danger/10 text-status-danger"
                : isExpiring
                ? "bg-status-warning/10 text-status-warning"
                : "bg-brand-primary/10 text-brand-primary"
            )}
          >
            <Icon className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium tracking-tight leading-tight line-clamp-2 mb-1">
              {item.catalog.name}
            </p>
            <p className="text-[10px] text-text-tertiary tabular tracking-tight truncate">
              {item.catalog.sku} · {item.location}
            </p>
          </div>
        </div>

        {/* Quantity + bar */}
        <div className="mb-3">
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "text-2xl font-bold tabular tracking-tight",
                  isCritical
                    ? "text-status-danger"
                    : isExpiring
                    ? "text-status-warning"
                    : "text-text-primary"
                )}
              >
                {item.currentQty}
              </span>
              <span className="text-xs text-text-tertiary font-medium">
                {item.catalog.unit}
              </span>
            </div>
            <span className="text-[10px] text-text-tertiary tabular">
              من {item.maxQty}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-bg-surface-raised overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isCritical
                  ? "bg-status-danger"
                  : isExpiring || item.health === "low"
                  ? "bg-status-warning"
                  : "bg-status-success"
              )}
              style={{ width: `${Math.max(stockPct, 4)}%` }}
            />
          </div>
        </div>

        {/* Bottom — health pill + expiry */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-3 border-t border-border-subtle">
          <StatusPill tone={meta.intent} icon={HealthIcon} label={meta.label} size="sm" />
          {earliest && earliest.daysLeft <= 14 && (
            <ExpiryBadge daysLeft={earliest.daysLeft} />
          )}
        </div>
      </Card>
    </Link>
  );
}
