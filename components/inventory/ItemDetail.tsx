"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowLeftRight,
  Trash2,
  Plus,
  Calendar,
  ClipboardCheck,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import {
  getStockItem, branchStock, movementMeta, stockHealthMeta,
  type Movement,
} from "@/lib/mock/inventory";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/page";
import { ExpiryBadge } from "./ExpiryBadge";
import { cn } from "@/lib/utils";

const movementIcon: Record<Movement["type"], LucideIcon> = {
  receive: TrendingUp,
  dispatch: TrendingDown,
  "transfer-in": ArrowLeftRight,
  "transfer-out": ArrowLeftRight,
  waste: Trash2,
  "count-adjust": ClipboardCheck,
  "sale-deplete": TrendingDown,
};

export function ItemDetail({ itemId }: { itemId: string }) {
  const device = useDevice();
  const item = getStockItem(itemId) ?? branchStock[0];
  const Icon = item.catalog.icon;
  const stockPct = Math.min(100, (item.currentQty / item.maxQty) * 100);
  const isCritical = item.health === "critical" || item.health === "out";
  const earliestBatch = item.expiryBatches.reduce<{ daysLeft: number } | null>(
    (min, b) => (!min || b.daysLeft < min.daysLeft ? b : min),
    null
  );

  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";

  return (
    <div
      className={cn(
        "mx-auto",
        isMobile
          ? "px-4 pt-4 pb-20 space-y-4"
          : isDesktop
          ? "px-8 py-7 max-w-[1400px] space-y-6"
          : "px-6 py-6 max-w-[1200px] space-y-5"
      )}
    >
      <Link
        href="/inventory"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        المخزون
      </Link>

      {/* Header */}
      <header className={cn("flex items-start gap-4 flex-wrap", isMobile && "flex-col items-stretch")}>
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={cn(
              "rounded-lg flex items-center justify-center shrink-0",
              isCritical
                ? "bg-status-danger/10 text-status-danger"
                : "bg-brand-primary/12 text-brand-primary",
              isDesktop ? "w-20 h-20" : isMobile ? "w-14 h-14" : "w-16 h-16"
            )}
          >
            <Icon
              className={cn(isDesktop ? "w-10 h-10" : isMobile ? "w-7 h-7" : "w-8 h-8")}
              strokeWidth={1.5}
            />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-1">
              {item.catalog.sku}
            </p>
            <h1
              className={cn(
                "font-bold tracking-tight leading-tight",
                isDesktop ? "text-3xl" : isMobile ? "text-xl" : "text-2xl"
              )}
            >
              {item.catalog.name}
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <StatusPill
                tone={stockHealthMeta[item.health].intent}
                label={stockHealthMeta[item.health].label}
                size="md"
              />
              {earliestBatch && earliestBatch.daysLeft <= 14 && (
                <ExpiryBadge daysLeft={earliestBatch.daysLeft} />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div
        className={cn(
          "grid gap-5",
          isDesktop
            ? "grid-cols-[1fr_360px]"
            : isMobile
            ? "grid-cols-1 gap-4"
            : "grid-cols-1 lg:grid-cols-[1fr_320px]"
        )}
      >
        <div className={cn("space-y-5 min-w-0", isMobile && "space-y-4")}>
          {/* Stock card */}
          <Card padding="lg">
            <div className="mb-4">
              <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-1">
                الكمية الحالية
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "text-5xl font-bold tabular tracking-tight",
                    isCritical && "text-status-danger"
                  )}
                >
                  {item.currentQty}
                </span>
                <span className="text-base text-text-tertiary font-medium">
                  {item.catalog.unit}
                </span>
              </div>
            </div>

            {/* Stock bar with min/max markers */}
            <div className="relative">
              <div className="h-3 rounded-full bg-bg-surface-raised overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    isCritical
                      ? "bg-status-danger"
                      : item.health === "low" || item.health === "expiring"
                      ? "bg-status-warning"
                      : "bg-status-success"
                  )}
                  style={{ width: `${Math.max(stockPct, 4)}%` }}
                />
              </div>
              {/* Min marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-status-warning"
                style={{ left: `${(item.minQty / item.maxQty) * 100}%` }}
              >
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] tabular text-status-warning whitespace-nowrap">
                  حد أدنى
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-border-subtle">
              <Stat label="الحد الأدنى" value={`${item.minQty} ${item.catalog.unit}`} />
              <Stat label="السعة القصوى" value={`${item.maxQty} ${item.catalog.unit}`} />
            </div>
          </Card>

          {/* Expiry batches */}
          {item.expiryBatches.length > 0 && (
            <Card padding="none">
              <div className="px-5 pt-5 pb-3 border-b border-border-subtle">
                <h2 className="text-base font-medium tracking-tight">
                  دفعات الصلاحية
                </h2>
                <p className="text-xs text-text-tertiary mt-0.5">
                  {item.expiryBatches.length} دفعات في المخزون
                </p>
              </div>
              <ul>
                {item.expiryBatches.map((batch) => (
                  <li
                    key={batch.id}
                    className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border-subtle last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "shrink-0 w-9 h-9 rounded-md flex items-center justify-center",
                          batch.daysLeft <= 3
                            ? "bg-status-danger/15 text-status-danger"
                            : batch.daysLeft <= 7
                            ? "bg-status-warning/15 text-status-warning"
                            : "bg-status-success/12 text-status-success"
                        )}
                      >
                        <Calendar className="w-4 h-4" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium tabular tracking-tight">
                          {batch.qty} {item.catalog.unit}
                        </p>
                        <p className="text-[11px] text-text-tertiary tabular">
                          ينتهي {batch.expiryDate}
                        </p>
                      </div>
                    </div>
                    <ExpiryBadge daysLeft={batch.daysLeft} />
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Movements */}
          <Card padding="none">
            <div className="px-5 pt-5 pb-3 border-b border-border-subtle">
              <h2 className="text-base font-medium tracking-tight">
                آخر الحركات
              </h2>
              <p className="text-xs text-text-tertiary mt-0.5">
                سجل العمليات على هذا الصنف
              </p>
            </div>
            <ul>
              {item.movements.map((m) => {
                const MIcon = movementIcon[m.type];
                const meta = movementMeta[m.type];
                const isPositive = m.qty > 0;
                return (
                  <li
                    key={m.id}
                    className="flex items-start gap-3 px-5 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised/40 transition-colors"
                  >
                    <div
                      className={cn(
                        "shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5",
                        isPositive
                          ? "bg-status-success/15 text-status-success"
                          : meta.intent === "danger"
                          ? "bg-status-danger/15 text-status-danger"
                          : "bg-bg-surface-raised text-text-secondary"
                      )}
                    >
                      <MIcon className="w-3.5 h-3.5" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-sm font-medium tracking-tight">
                          {meta.label}
                        </p>
                        <p
                          className={cn(
                            "text-sm font-bold tabular tracking-tight shrink-0",
                            isPositive ? "text-status-success" : ""
                          )}
                        >
                          {isPositive ? "+" : ""}
                          {m.qty} {item.catalog.unit}
                        </p>
                      </div>
                      <p className="text-[11px] text-text-tertiary leading-relaxed">
                        {m.actor} · {m.timestamp}
                        {m.reference && (
                          <span className="text-brand-primary"> · {m.reference}</span>
                        )}
                      </p>
                      {m.note && (
                        <p className="text-[11px] text-text-secondary mt-1">
                          {m.note}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        {/* Right rail */}
        <aside className="space-y-5 min-w-0">
          {/* Location + meta */}
          <Card padding="md">
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">
              معلومات الصنف
            </p>
            <ul className="space-y-3">
              <MetaRow icon={<ClipboardCheck className="w-3.5 h-3.5" strokeWidth={1.75} />} label="آخر جرد" value={item.lastCountedAt} />
              <MetaRow
                icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />}
                label="نقطة إعادة الطلب"
                value={`${item.minQty} ${item.catalog.unit}`}
              />
            </ul>
          </Card>

          {/* Actions */}
          <Card padding="md">
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">
              إجراءات
            </p>
            <div className="space-y-2">
              {(item.health === "low" || item.health === "critical" || item.health === "out") && (
                <Link href="/requests/new" className="block">
                  <Button size="md" fullWidth>
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                    اطلب من المصنع
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="md" fullWidth>
                <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                سجّل هدر
              </Button>
              <Button variant="ghost" size="md" fullWidth>
                <ClipboardCheck className="w-4 h-4" strokeWidth={1.75} />
                جرد سريع
              </Button>
            </div>
          </Card>

          {/* Reorder hint */}
          {(item.health === "low" || item.health === "critical" || item.health === "out") && (
            <Card padding="md" className="bg-status-warning/8 border-status-warning/40">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-status-warning shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-sm font-medium tracking-tight mb-1">
                    {item.health === "out" ? "الصنف نفد" : "وصلت تحت الحد الأدنى"}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    اطلب{" "}
                    <span className="font-medium text-status-warning tabular">
                      {Math.max(item.maxQty - item.currentQty, item.minQty * 2)} {item.catalog.unit}
                    </span>{" "}
                    لتعود لمستوى آمن.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "danger";
}) {
  return (
    <div>
      <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-1">
        {label}
      </p>
      <p
        className={cn(
          "text-sm font-medium tabular tracking-tight",
          accent === "danger" && "text-status-danger"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 min-w-0">
      <div className="flex items-center gap-2 text-[11px] text-text-tertiary tracking-tight shrink-0">
        <span>{icon}</span>
        {label}
      </div>
      <span className="text-xs font-medium tracking-tight tabular truncate text-left">
        {value}
      </span>
    </li>
  );
}
