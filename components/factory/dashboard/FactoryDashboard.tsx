"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  ClipboardList,
  PackageSearch,
  Boxes,
  AlertTriangle,
  ClockAlert,
  PackageX,
  ChevronLeft,
  ArrowUpRight,
  Activity as ActivityIcon,
  Truck,
  ClipboardCheck,
  Package,
  PackageCheck,
  AlertCircle,
  Repeat,
  UserPlus,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { useAuth } from "@/hooks/useAuth";
import { factoryStock, factoryStockCounts, levelMeta, categories } from "@/lib/mock/factoryInventory";
import { recentActivity, type ActivityType } from "@/lib/mock/activity";
import {
  branchConsumption,
  monthLabels,
  allMonths,
  type Month,
} from "@/lib/mock/branchConsumption";
import { brandMeta, type BrandId } from "@/lib/mock/branches";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const CURRENT_MONTH: Month = "2026-04";

export function FactoryDashboard() {
  const device = useDevice();
  const { user } = useAuth();
  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";

  const [selectedMonth, setSelectedMonth] = useState<Month>(CURRENT_MONTH);

  return (
    <div
      className={cn(
        "mx-auto",
        isMobile ? "px-4 pt-4 pb-20 space-y-5" : isDesktop ? "px-8 py-7 max-w-[1600px] space-y-7" : "px-6 py-6 max-w-[1280px] space-y-6"
      )}
    >
      {/* HEADER */}
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className={cn("text-text-tertiary tracking-[0.18em] uppercase mb-1", isMobile ? "text-[10px]" : "text-xs")}>
            FACTORY · لوحة التحكم
          </p>
          <h1 className={cn("font-bold tracking-tight leading-tight", isDesktop ? "text-3xl" : isMobile ? "text-xl" : "text-2xl")}>
            صباح الخير، {user?.name?.split(" ")[0] ?? "مدير المصنع"}
          </h1>
        </div>
        <ShiftCountdown />
      </header>

      <div className="gold-hairline" />

      {/* QUICK ACTIONS */}
      <section>
        <SectionLabel>إجراءات سريعة</SectionLabel>
        <div className={cn("grid gap-3 mt-3", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3")}>
          <QuickActionCard
            href="/requests/new"
            icon={ClipboardList}
            label="طلب من مورد"
            description="أنشئ طلب شراء من مورد"
            tone="brand"
            shortcut="N"
          />
          <QuickActionCard
            href="/inventory/count"
            icon={PackageSearch}
            label="جرد مخزون"
            description="ابدأ جلسة جرد للمصنع"
            tone="warm"
            shortcut="I"
          />
          <QuickActionCard
            href="/requests/receive"
            icon={PackageCheck}
            label="استلام من مورد"
            description="سجل استلام بضاعة جديدة"
            tone="info"
            shortcut="R"
          />
        </div>
      </section>

      {/* KPI CARDS */}
      <section>
        <SectionLabel>مؤشرات المخزون الآن</SectionLabel>
        <div className={cn("grid gap-3 mt-3", isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4")}>
          <KpiCard
            icon={Boxes}
            label="إجمالي الأصناف"
            value={factoryStockCounts.total}
            unit="صنف"
            tone="neutral"
            href="/inventory"
            hint="في المخزن الرئيسي"
          />
          <KpiCard
            icon={AlertTriangle}
            label="مخزون منخفض"
            value={factoryStockCounts.low}
            unit="صنف"
            tone="warning"
            href="/inventory?level=low"
            hint="تحت الحد الأدنى"
          />
          <KpiCard
            icon={ClockAlert}
            label="قارب على الانتهاء"
            value={factoryStockCounts.expiring}
            unit="صنف"
            tone="warning"
            href="/inventory?expiring=1"
            hint="خلال ٥ أيام"
          />
          <KpiCard
            icon={PackageX}
            label="حرج / نفد"
            value={factoryStockCounts.critical + factoryStockCounts.out}
            unit="صنف"
            tone="danger"
            href="/inventory?level=critical"
            hint="إعادة طلب فوراً"
          />
        </div>
      </section>

      {/* BRANDS — directly under indicators */}
      <section>
        <div className="flex items-end justify-between gap-3 mb-3 flex-wrap">
          <div>
            <SectionLabel>البراندات</SectionLabel>
            <p className="text-xs text-text-tertiary mt-1">
              ما أخذه كل براند من المصنع شهرياً · {branchConsumption.length} فرع
            </p>
          </div>
          <MonthFilter value={selectedMonth} onChange={setSelectedMonth} />
        </div>
        <BrandTotalsRow month={selectedMonth} />
      </section>

      {/* MAIN: chart + activity */}
      <section className={cn("grid gap-5", isDesktop ? "grid-cols-[1.5fr_1fr]" : "grid-cols-1")}>
        <StockChart />
        <RecentActivity />
      </section>
    </div>
  );
}

/* ======================================================================
 * Section label
 * ==================================================================== */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] tracking-[0.18em] uppercase text-text-tertiary font-semibold">
      {children}
    </p>
  );
}

/* ======================================================================
 * Shift countdown — live ticker showing remaining time on the active
 * shift. Updates every 30s. Outside shift hours falls back to a "next
 * shift starts in…" copy.
 * ==================================================================== */

const SHIFT_START_HOUR = 6;
const SHIFT_END_HOUR = 14;

function ShiftCountdown() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const startMin = SHIFT_START_HOUR * 60;
  const endMin = SHIFT_END_HOUR * 60;

  let mainLine: string;
  let label: string;
  let inShift = false;
  if (minutesNow >= startMin && minutesNow < endMin) {
    inShift = true;
    const remainingMin = endMin - minutesNow;
    const h = Math.floor(remainingMin / 60);
    const m = remainingMin % 60;
    mainLine = `${h}س ${String(m).padStart(2, "0")}د`;
    label = "متبقي · وردية الصباح";
  } else if (minutesNow < startMin) {
    const untilStart = startMin - minutesNow;
    const h = Math.floor(untilStart / 60);
    const m = untilStart % 60;
    mainLine = `${h}س ${String(m).padStart(2, "0")}د`;
    label = "تبدأ وردية الصباح خلال";
  } else {
    const untilNextStart = (24 * 60) - minutesNow + startMin;
    const h = Math.floor(untilNextStart / 60);
    const m = untilNextStart % 60;
    mainLine = `${h}س ${String(m).padStart(2, "0")}د`;
    label = "وردية الصباح القادمة خلال";
  }

  const dateStr = new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  return (
    <Card padding="md" className="flex items-center gap-3 min-w-[260px]">
      <div className={cn(
        "w-12 h-12 rounded-md flex items-center justify-center shrink-0",
        inShift ? "bg-brand-primary/15 text-brand-primary" : "bg-bg-surface-raised text-text-tertiary"
      )}>
        <Clock className="w-5 h-5" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-0.5">{label}</p>
        <p className="text-base font-bold tabular tracking-tight leading-none">{mainLine}</p>
        <p className="text-[11px] text-text-tertiary mt-1.5">{dateStr}</p>
      </div>
    </Card>
  );
}

/* ======================================================================
 * Quick action card
 * ==================================================================== */

function QuickActionCard({
  href, icon: Icon, label, description, tone, shortcut,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
  tone: "brand" | "info" | "warm";
  shortcut: string;
}) {
  const toneStyle = {
    brand: { iconWrap: "bg-brand-primary text-text-on-brand", arrow: "text-brand-primary" },
    info:  { iconWrap: "bg-status-info text-white", arrow: "text-status-info" },
    warm:  { iconWrap: "bg-brand-warm text-white", arrow: "text-brand-warm" },
  }[tone];

  return (
    <Link href={href} className="block group">
      <Card
        padding="lg"
        className={cn(
          "h-full relative overflow-hidden transition-all duration-fast ease-out-expo",
          "group-hover:border-border-strong group-hover:-translate-y-0.5 group-hover:shadow-md"
        )}
      >
        {/* ambient glow */}
        <span
          aria-hidden
          className={cn(
            "absolute -top-12 -left-12 w-32 h-32 rounded-full opacity-0 blur-2xl",
            "transition-opacity duration-normal",
            "group-hover:opacity-30",
            tone === "brand" && "bg-brand-primary",
            tone === "info" && "bg-status-info",
            tone === "warm" && "bg-brand-warm",
          )}
        />
        <div className="relative flex items-start gap-4">
          <div
            className={cn(
              "shrink-0 w-12 h-12 rounded-md flex items-center justify-center",
              "transition-transform duration-normal ease-out-expo",
              "group-hover:scale-110 group-hover:rotate-[-4deg]",
              toneStyle.iconWrap
            )}
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold tracking-tight leading-tight">{label}</p>
            <p className="text-xs text-text-tertiary mt-1 leading-relaxed">{description}</p>
          </div>
          <span
            className={cn(
              "shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-sm border border-border-subtle",
              "transition-all duration-fast",
              "group-hover:border-current",
              toneStyle.arrow
            )}
          >
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-fast group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
          <span className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase">اضغط لبدء</span>
          <kbd className="inline-flex items-center justify-center px-1.5 h-5 rounded-[4px] bg-bg-surface-raised text-[10px] tabular text-text-secondary border border-border-subtle">
            {shortcut}
          </kbd>
        </div>
      </Card>
    </Link>
  );
}

/* ======================================================================
 * KPI card
 * ==================================================================== */

function KpiCard({
  icon: Icon, label, value, unit, tone, hint,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  unit?: string;
  tone: "neutral" | "warning" | "danger";
  href?: string;
  hint?: string;
}) {
  const toneStyle = {
    neutral: { text: "text-text-primary",   bg: "bg-bg-surface-raised text-text-secondary" },
    warning: { text: "text-status-warning", bg: "bg-status-warning/15 text-status-warning" },
    danger:  { text: "text-status-danger",  bg: "bg-status-danger/15 text-status-danger"   },
  }[tone];

  return (
    <Card padding="md" className="h-full">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className={cn("w-9 h-9 rounded-sm flex items-center justify-center", toneStyle.bg)}>
          <Icon className="w-4 h-4" strokeWidth={1.75} />
        </div>
      </div>
      <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase truncate">{label}</p>
      <div className="flex items-baseline gap-1.5 mt-1">
        <p className={cn("text-3xl font-bold tabular tracking-tight leading-none", toneStyle.text)}>
          {value}
        </p>
        {unit && <span className="text-xs text-text-tertiary font-medium">{unit}</span>}
      </div>
      {hint && (
        <p className="text-[11px] text-text-tertiary mt-2 truncate">{hint}</p>
      )}
    </Card>
  );
}

/* ======================================================================
 * Stock chart — horizontal bars by item
 * ==================================================================== */

function StockChart() {
  // Top 12 items by current quantity, with min/max overlay
  const top = useMemo(
    () =>
      [...factoryStock]
        .filter((i) => i.currentQty > 0 || i.level === "out")
        .sort((a, b) => b.currentQty / Math.max(b.maxQty, 1) - a.currentQty / Math.max(a.maxQty, 1))
        .slice(0, 12),
    []
  );
  const maxRef = Math.max(...top.map((i) => i.maxQty));

  return (
    <Card padding="lg">
      <header className="flex items-start justify-between gap-3 mb-5">
        <div>
          <SectionLabel>الأصناف بالمخزن</SectionLabel>
          <h2 className="text-base font-medium tracking-tight mt-1">أعلى ١٢ صنف · النسبة من السقف</h2>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-text-tertiary">
          <LegendDot color="bg-status-success" label="متوفر" />
          <LegendDot color="bg-status-warning" label="منخفض" />
          <LegendDot color="bg-status-danger" label="حرج / نفد" />
        </div>
      </header>
      <ul className="space-y-3">
        {top.map((item) => {
          const fillPct = Math.max(2, Math.min(100, (item.currentQty / maxRef) * 100));
          const minPct = (item.minQty / maxRef) * 100;
          const meta = levelMeta[item.level];
          const barColor =
            item.level === "good"     ? "bg-status-success/80" :
            item.level === "low"      ? "bg-status-warning/80" :
                                        "bg-status-danger/80";
          return (
            <li key={item.id}>
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="min-w-0 flex items-center gap-2">
                  <span className="text-sm font-medium tracking-tight truncate">{item.name}</span>
                  <span className={cn("inline-flex items-center h-5 px-2 rounded-full text-[10px] font-medium border", meta.bg)}>
                    {meta.label}
                  </span>
                </div>
                <div className="shrink-0 text-xs tabular text-text-secondary">
                  <span className={cn("font-bold", meta.color)}>{item.currentQty}</span>
                  <span className="text-text-tertiary"> / {item.maxQty} {item.unit}</span>
                </div>
              </div>
              <div className="relative h-2.5 rounded-full bg-bg-muted overflow-hidden">
                {/* min threshold marker */}
                <span
                  aria-hidden
                  className="absolute top-0 bottom-0 w-px bg-text-tertiary/40"
                  style={{ right: `${minPct}%` }}
                />
                {/* fill */}
                <span
                  className={cn("absolute top-0 bottom-0 right-0 rounded-full transition-all duration-slow ease-out-expo", barColor)}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 pt-4 border-t border-border-subtle flex items-center justify-between">
        <span className="text-[11px] text-text-tertiary">العمود الرفيع = الحد الأدنى للسقف</span>
        <Link href="/inventory" className="text-xs text-brand-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
          عرض كل الأصناف
          <ChevronLeft className="w-3 h-3" strokeWidth={2.5} />
        </Link>
      </div>
    </Card>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-full", color)} />
      <span>{label}</span>
    </span>
  );
}

/* ======================================================================
 * Recent activity
 * ==================================================================== */

const activityIcon: Record<ActivityType, LucideIcon> = {
  "shipment.dispatched": Truck,
  "shipment.delivered":  PackageCheck,
  "request.created":     ClipboardList,
  "request.approved":    ClipboardCheck,
  "receipt.confirmed":   PackageCheck,
  "receipt.disputed":    AlertCircle,
  "stock.transferred":   Repeat,
  "stock.counted":       PackageSearch,
  "employee.clocked-in": UserPlus,
};

const activityTone: Record<ActivityType, string> = {
  "shipment.dispatched": "bg-brand-primary/15 text-brand-primary",
  "shipment.delivered":  "bg-status-success/15 text-status-success",
  "request.created":     "bg-status-info/15 text-status-info",
  "request.approved":    "bg-status-success/15 text-status-success",
  "receipt.confirmed":   "bg-status-success/15 text-status-success",
  "receipt.disputed":    "bg-status-danger/15 text-status-danger",
  "stock.transferred":   "bg-brand-warm/15 text-brand-warm",
  "stock.counted":       "bg-bg-surface-raised text-text-secondary",
  "employee.clocked-in": "bg-bg-surface-raised text-text-secondary",
};

function RecentActivity() {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-border-subtle flex items-center justify-between gap-3">
        <div>
          <SectionLabel>النشاط الأخير</SectionLabel>
          <h2 className="text-base font-medium tracking-tight mt-1">حركات النظام</h2>
        </div>
        <ActivityIcon className="w-4 h-4 text-text-tertiary" strokeWidth={1.75} />
      </div>
      <ol className="relative px-5 py-4 max-h-[480px] overflow-y-auto">
        <span className="absolute right-[35px] top-6 bottom-6 w-px bg-border-subtle" aria-hidden />
        {recentActivity.slice(0, 10).map((a) => {
          const Icon = activityIcon[a.type];
          return (
            <li key={a.id} className="relative flex items-start gap-3 pb-4 last:pb-0">
              <span className={cn("relative z-10 inline-flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-bg-surface shrink-0", activityTone[a.type])}>
                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-xs leading-relaxed text-text-primary">{a.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-text-tertiary tabular">{a.timestamp}</span>
                  <span className="text-text-tertiary">·</span>
                  <span className="text-[10px] text-text-secondary">{a.actor}</span>
                  {a.branch && (
                    <>
                      <span className="text-text-tertiary">·</span>
                      <span className="text-[10px] text-text-tertiary">{a.branch}</span>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

/* ======================================================================
 * Month filter
 * ==================================================================== */

function MonthFilter({ value, onChange }: { value: Month; onChange: (m: Month) => void }) {
  return (
    <div className="inline-flex items-center h-10 p-0.5 rounded-sm bg-bg-surface border border-border-subtle">
      {allMonths.map((m) => {
        const active = m === value;
        return (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            className={cn(
              "h-9 px-3 rounded-[10px] text-xs font-medium tracking-tight transition-all duration-fast",
              active
                ? "bg-bg-surface-raised text-text-primary shadow-xs"
                : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            {monthLabels[m]}
          </button>
        );
      })}
    </div>
  );
}

/* ======================================================================
 * Brand totals row — one card per brand, click-through to brand detail
 * ==================================================================== */

function BrandTotalsRow({ month }: { month: Month }) {
  const allBrandIds: BrandId[] = ["wahsh", "kababgy", "forno"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {allBrandIds.map((brand) => {
        const meta = brandMeta[brand];
        const branchesOfBrand = branchConsumption.filter((b) => b.brandId === brand);
        const orderCount = branchesOfBrand.reduce(
          (s, b) => s + b.monthly[month].orderCount,
          0,
        );

        return (
          <Link
            key={brand}
            href={`/brand/${brand}`}
            className="group block focus-visible:outline-none"
          >
            <Card
              padding="md"
              className="h-full transition-colors duration-fast group-hover:border-border-strong"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="shrink-0 w-2.5 h-2.5 rounded-full"
                    style={{ background: meta.accent }}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium tracking-tight truncate">{meta.name}</p>
                    <p className="text-[10px] text-text-tertiary">{meta.branchCount} فرع</p>
                  </div>
                </div>
                <span
                  className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-sm border border-border-subtle text-text-tertiary group-hover:border-border-strong group-hover:text-text-primary transition-colors duration-fast"
                  aria-label={`فتح تفاصيل ${meta.name}`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <p className="text-3xl font-bold tabular tracking-tight leading-none">
                  {orderCount.toLocaleString("en-US")}
                </p>
                <span className="text-xs text-text-tertiary font-medium">طلب</span>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
