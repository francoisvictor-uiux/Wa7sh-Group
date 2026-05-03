"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Package,
  ClipboardList,
  History,
  Building2,
  Search,
  ArrowDownUp,
  X,
  Check,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Truck,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { brandMeta, type BrandId } from "@/lib/mock/branches";
import {
  branchConsumption,
  monthLabels,
} from "@/lib/mock/branchConsumption";
import {
  getBrandOrders,
  type BrandOrder,
  type BrandOrderStatus,
  type OrderTimelineEvent,
} from "@/lib/mock/brandOrders";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type SortDir = "desc" | "asc";

const CURRENT_MONTH = "2026-04" as const;

const statusMeta: Record<BrandOrderStatus, {
  label: string;
  icon: LucideIcon;
  intent: "neutral" | "info" | "warning" | "success" | "danger" | "brand";
}> = {
  requested:    { label: "تم الطلب",        icon: ClipboardList, intent: "info"    },
  approved:     { label: "تمت الموافقة",     icon: Check,         intent: "info"    },
  preparing:    { label: "جاري التحضير",     icon: Clock,         intent: "brand"   },
  loaded:       { label: "تم التحميل",       icon: PackageCheck,  intent: "brand"   },
  "in-transit": { label: "في الطريق",        icon: Truck,         intent: "warning" },
  delivered:    { label: "تم التسليم",       icon: PackageCheck,  intent: "success" },
  confirmed:    { label: "تم التأكيد",       icon: CheckCircle2,  intent: "success" },
  cancelled:    { label: "ملغى",             icon: XCircle,       intent: "danger"  },
  disputed:     { label: "متنازع عليه",      icon: AlertTriangle, intent: "danger"  },
};

export function BrandDetail({ brandId }: { brandId: BrandId }) {
  const device = useDevice();
  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";

  const meta = brandMeta[brandId];
  const branches = useMemo(
    () => branchConsumption.filter((b) => b.brandId === brandId),
    [brandId],
  );
  const orders = useMemo(() => getBrandOrders(brandId), [brandId]);

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const monthOrderCount = branches.reduce(
    (s, b) => s + b.monthly[CURRENT_MONTH].orderCount,
    0,
  );

  return (
    <div
      className={cn(
        "mx-auto",
        isMobile ? "px-4 pt-4 pb-20 space-y-5" :
        isDesktop ? "px-8 py-7 max-w-[1500px] space-y-6" :
                    "px-6 py-6 max-w-[1200px] space-y-5"
      )}
    >
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        لوحة التحكم
      </Link>

      {/* Brand header */}
      <header className="flex items-start gap-4 flex-wrap justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="shrink-0 w-12 h-12 rounded-md flex items-center justify-center text-text-on-brand"
            style={{ background: meta.accent }}
            aria-hidden
          >
            <Building2 className="w-6 h-6" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] text-text-tertiary tracking-[0.18em] uppercase mb-1">
              BRAND · {meta.nameEn}
            </p>
            <h1 className={cn("font-bold tracking-tight leading-tight", isDesktop ? "text-3xl" : isMobile ? "text-xl" : "text-2xl")}>
              {meta.name}
            </h1>
            <p className="text-xs text-text-tertiary mt-1">
              {meta.branchCount} فرع · {orders.length} طلب خلال 5 شهور
            </p>
          </div>
        </div>
      </header>

      <div className="gold-hairline" />

      {/* KPI strip — 3 cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiTile
          label="طلبات الشهر الحالي"
          value={monthOrderCount.toLocaleString("en-US")}
          unit="طلب"
          icon={ClipboardList}
        />
        <KpiTile
          label="فروع نشطة"
          value={branches.length.toString()}
          unit="فرع"
          icon={Building2}
        />
        <KpiTile
          label="إجمالي الطلبات (5 شهور)"
          value={orders.length.toLocaleString("en-US")}
          unit="طلب"
          icon={History}
        />
      </section>

      {selectedBranchId === null ? (
        <BranchGrid
          branches={branches}
          orders={orders}
          accent={meta.accent}
          onPick={setSelectedBranchId}
        />
      ) : (
        <BranchOrders
          branchId={selectedBranchId}
          branchName={branches.find((b) => b.branchId === selectedBranchId)?.branchName ?? ""}
          orders={orders.filter((o) => o.branchId === selectedBranchId)}
          accent={meta.accent}
          onBack={() => setSelectedBranchId(null)}
        />
      )}
    </div>
  );
}

/* ======================================================================
 * Branch grid — list of branch cards with search + sort
 * ==================================================================== */

function BranchGrid({
  branches,
  orders,
  accent,
  onPick,
}: {
  branches: typeof branchConsumption;
  orders: BrandOrder[];
  accent: string;
  onPick: (branchId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Counts per branch for the current month + total over 5 months
  const stats = useMemo(() => {
    const map: Record<string, { monthOrders: number; totalOrders: number; latestStatus: BrandOrderStatus | null }> = {};
    branches.forEach((b) => {
      map[b.branchId] = {
        monthOrders: b.monthly[CURRENT_MONTH].orderCount,
        totalOrders: orders.filter((o) => o.branchId === b.branchId).length,
        latestStatus: orders.find((o) => o.branchId === b.branchId)?.status ?? null,
      };
    });
    return map;
  }, [branches, orders]);

  const list = useMemo(() => {
    const q = search.trim();
    const filtered = q
      ? branches.filter((b) => b.branchName.includes(q))
      : branches;
    return [...filtered].sort((a, b) => {
      const av = stats[a.branchId]?.totalOrders ?? 0;
      const bv = stats[b.branchId]?.totalOrders ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }, [branches, search, sortDir, stats]);

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <SectionLabel>الفروع</SectionLabel>
          <p className="text-xs text-text-tertiary mt-1">
            {list.length.toLocaleString("en-US")} فرع — اختر فرع لعرض طلباته
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SearchBar value={search} onChange={setSearch} />
          <SortToggle dir={sortDir} onChange={setSortDir} />
        </div>
      </div>

      {list.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-sm text-text-tertiary">لا يوجد فرع يطابق البحث.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {list.map((b) => {
            const s = stats[b.branchId];
            return (
              <button
                key={b.branchId}
                type="button"
                onClick={() => onPick(b.branchId)}
                className="text-right group focus-visible:outline-none"
              >
                <Card
                  padding="md"
                  className="h-full transition-colors duration-fast group-hover:border-border-strong"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="shrink-0 w-2.5 h-2.5 rounded-full"
                        style={{ background: accent }}
                        aria-hidden
                      />
                      <p className="text-sm font-medium tracking-tight truncate">
                        {b.branchName}
                      </p>
                    </div>
                    <span
                      className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-sm border border-border-subtle text-text-tertiary group-hover:border-border-strong group-hover:text-text-primary transition-colors duration-fast"
                      aria-hidden
                    >
                      <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <p className="text-3xl font-bold tabular tracking-tight leading-none">
                      {s.monthOrders.toLocaleString("en-US")}
                    </p>
                    <span className="text-xs text-text-tertiary font-medium">طلب الشهر</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-[11px] text-text-tertiary tracking-[0.14em] uppercase">إجمالي 5 شهور</span>
                    <span className="text-sm font-bold tabular tracking-tight">
                      {s.totalOrders.toLocaleString("en-US")}
                      <span className="text-[10px] font-normal text-text-tertiary mr-1">طلب</span>
                    </span>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ======================================================================
 * Branch orders — drilldown with timeline
 * ==================================================================== */

function BranchOrders({
  branchId,
  branchName,
  orders,
  accent,
  onBack,
}: {
  branchId: string;
  branchName: string;
  orders: BrandOrder[];
  accent: string;
  onBack: () => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BrandOrderStatus | "all">("all");
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (q && !o.number.includes(q) && !o.items.some((it) => it.name.includes(q))) return false;
      return true;
    });
  }, [orders, search, statusFilter]);

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-sm border border-border-subtle text-xs text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors duration-fast"
          >
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" strokeWidth={2} />
            كل الفروع
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: accent }} aria-hidden />
              <p className="text-base font-semibold tracking-tight">{branchName}</p>
            </div>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              {filtered.length.toLocaleString("en-US")} طلب
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SearchBar value={search} onChange={setSearch} placeholder="ابحث برقم الطلب أو الصنف..." />
        </div>
      </div>

      <StatusFilterRow value={statusFilter} onChange={setStatusFilter} orders={orders} />

      {filtered.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-sm text-text-tertiary">لا توجد طلبات تطابق هذا الفلتر.</p>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <ul>
            {filtered.slice(0, 60).map((order) => {
              const isOpen = openOrderId === order.id;
              const statusInfo = statusMeta[order.status];
              return (
                <li key={order.id} className="border-b border-border-subtle last:border-0">
                  <button
                    type="button"
                    onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-5 py-3.5 text-right transition-colors duration-fast",
                      isOpen ? "bg-bg-surface-raised" : "hover:bg-bg-surface-raised/50"
                    )}
                  >
                    <div className="shrink-0 text-[11px] text-text-tertiary tabular w-20">
                      {order.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium tracking-tight truncate">
                          {monthLabels[order.month]} · {order.date.split("·").pop()?.trim()}
                        </p>
                      </div>
                      <p className="text-[10px] text-text-tertiary tabular mt-0.5">
                        {order.itemCount} صنف · {order.totalKg.toLocaleString("en-US")} كجم
                      </p>
                    </div>
                    <Badge intent={statusInfo.intent} size="sm">
                      {statusInfo.label}
                    </Badge>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-text-tertiary shrink-0 transition-transform duration-fast",
                        isOpen && "rotate-180"
                      )}
                      strokeWidth={2}
                    />
                  </button>
                  {isOpen && <OrderDetail order={order} />}
                </li>
              );
            })}
          </ul>
          {filtered.length > 60 && (
            <div className="px-5 py-3 border-t border-border-subtle text-center text-xs text-text-tertiary">
              عرض أحدث 60 طلب من إجمالي {filtered.length}
            </div>
          )}
        </Card>
      )}
    </section>
  );
}

/* ======================================================================
 * Order detail — items + timeline
 * ==================================================================== */

function OrderDetail({ order }: { order: BrandOrder }) {
  return (
    <div className="px-5 pb-4 pt-1 animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3">
        {/* Items */}
        <div className="rounded-md border border-border-subtle bg-bg-surface-raised/40">
          <div className="px-4 py-2 border-b border-border-subtle text-[10px] tracking-[0.14em] uppercase text-text-tertiary font-semibold">
            الأصناف · {order.itemCount} صنف
          </div>
          <ul>
            {order.items.map((it, i) => (
              <li
                key={`${it.catalogId}-${i}`}
                className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border-subtle last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-sm bg-bg-muted flex items-center justify-center text-text-tertiary">
                    <Package className="w-3 h-3" strokeWidth={1.75} />
                  </span>
                  <span className="text-sm tracking-tight truncate">{it.name}</span>
                </div>
                <span className="shrink-0 text-sm font-bold tabular tracking-tight">
                  {it.qty.toLocaleString("en-US")}
                  <span className="text-[10px] font-normal text-text-tertiary mr-1">{it.unit}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Timeline */}
        <div className="rounded-md border border-border-subtle bg-bg-surface-raised/40 p-4">
          <p className="text-[10px] tracking-[0.14em] uppercase text-text-tertiary font-semibold mb-3">
            مسار الطلب
          </p>
          <Timeline events={order.timeline} />
        </div>
      </div>
    </div>
  );
}

function Timeline({ events }: { events: OrderTimelineEvent[] }) {
  return (
    <ol className="relative space-y-4">
      {/* Vertical rail */}
      <span aria-hidden className="absolute top-1 bottom-1 right-2.5 w-px bg-border-subtle" />
      {events.map((ev, i) => {
        const info = statusMeta[ev.status];
        const Icon = info.icon;
        const isLast = i === events.length - 1;
        const intentBg =
          info.intent === "success" ? "bg-status-success/15 text-status-success" :
          info.intent === "warning" ? "bg-status-warning/15 text-status-warning" :
          info.intent === "danger"  ? "bg-status-danger/15 text-status-danger"   :
          info.intent === "brand"   ? "bg-brand-primary/15 text-brand-primary"   :
          info.intent === "info"    ? "bg-status-info/15 text-status-info"       :
                                       "bg-bg-surface-raised text-text-secondary";
        return (
          <li key={i} className="relative flex items-start gap-3 pr-0">
            <span
              className={cn(
                "relative z-[1] shrink-0 w-5 h-5 rounded-full flex items-center justify-center border border-border-default",
                isLast ? "ring-2 ring-offset-1 ring-offset-bg-surface" : "",
                intentBg,
              )}
              style={isLast ? { boxShadow: `0 0 0 2px var(--bg-surface)` } : undefined}
            >
              <Icon className="w-2.5 h-2.5" strokeWidth={2} />
            </span>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-sm font-medium tracking-tight">{info.label}</p>
                <span className="text-[10px] text-text-tertiary tabular shrink-0">
                  {ev.timestamp}
                </span>
              </div>
              {ev.actor && (
                <p className="text-[11px] text-text-secondary">{ev.actor}</p>
              )}
              {ev.note && (
                <p className="text-[11px] text-text-tertiary mt-0.5">{ev.note}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ======================================================================
 * Sub-components
 * ==================================================================== */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] tracking-[0.18em] uppercase text-text-tertiary font-semibold">
      {children}
    </p>
  );
}

function KpiTile({
  label,
  value,
  unit,
  icon: Icon,
}: {
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
}) {
  return (
    <Card padding="md" className="min-w-0">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[10px] text-text-tertiary tracking-[0.18em] uppercase font-semibold truncate">
          {label}
        </p>
        <Icon className="w-3.5 h-3.5 text-text-tertiary shrink-0" strokeWidth={1.75} />
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className="text-2xl sm:text-3xl font-bold tabular tracking-tight leading-none">
          {value}
        </p>
        <span className="text-xs text-text-tertiary font-medium">{unit}</span>
      </div>
    </Card>
  );
}

function SearchBar({
  value,
  onChange,
  placeholder = "ابحث باسم الفرع...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search
        className="absolute top-1/2 -translate-y-1/2 right-3 w-3.5 h-3.5 text-text-tertiary pointer-events-none"
        strokeWidth={1.75}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-60 max-w-full pr-9 pl-8 rounded-sm border border-border-subtle bg-bg-surface text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-border-strong transition-colors duration-fast"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-1/2 -translate-y-1/2 left-2 w-5 h-5 rounded-full inline-flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors duration-fast"
          aria-label="مسح البحث"
        >
          <X className="w-3 h-3" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

function SortToggle({
  dir,
  onChange,
}: {
  dir: SortDir;
  onChange: (d: SortDir) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(dir === "desc" ? "asc" : "desc")}
      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-sm border border-border-subtle text-xs text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors duration-fast"
      aria-label="تبديل الترتيب"
    >
      <ArrowDownUp className="w-3.5 h-3.5" strokeWidth={1.75} />
      {dir === "desc" ? "الأكثر طلباً" : "الأقل طلباً"}
    </button>
  );
}

function StatusFilterRow({
  value,
  onChange,
  orders,
}: {
  value: BrandOrderStatus | "all";
  onChange: (v: BrandOrderStatus | "all") => void;
  orders: BrandOrder[];
}) {
  const counts: Partial<Record<BrandOrderStatus, number>> = {};
  orders.forEach((o) => { counts[o.status] = (counts[o.status] ?? 0) + 1; });

  const presented: Array<BrandOrderStatus | "all"> = [
    "all", "confirmed", "delivered", "in-transit", "cancelled", "disputed",
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {presented.map((s) => {
        const active = value === s;
        const label = s === "all" ? "الكل" : statusMeta[s].label;
        const count = s === "all" ? orders.length : (counts[s] ?? 0);
        if (s !== "all" && count === 0) return null;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={cn(
              "inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium transition-colors duration-fast border",
              active
                ? "bg-text-primary text-bg-surface border-text-primary"
                : "border-border-subtle text-text-secondary hover:border-border-strong hover:text-text-primary"
            )}
          >
            <span>{label}</span>
            <span className={cn("text-[10px] tabular", active ? "text-bg-surface/70" : "text-text-tertiary")}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
