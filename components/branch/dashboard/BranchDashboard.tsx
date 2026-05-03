"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  ClipboardList,
  PackageSearch,
  PackageCheck,
  Boxes,
  AlertTriangle,
  ClockAlert,
  Clock,
  ChevronLeft,
  ArrowUpRight,
  Truck,
  CheckCircle2,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { useAuth } from "@/hooks/useAuth";
import { factoryStock, factoryStockCounts, levelMeta } from "@/lib/mock/factoryInventory";
import { useRequestsDB } from "@/lib/db/requests";
import { branchMap } from "@/lib/mock/branches";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function BranchDashboard() {
  const device = useDevice();
  const { user } = useAuth();
  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";

  const branchId = user?.branchId ?? "";
  const branch = branchMap[branchId];

  const myRequests = useRequestsDB().getByBranch(branchId);

  const kpis = useMemo(() => ({
    pending:    myRequests.filter((r) => r.status === "requested").length,
    inTransit:  myRequests.filter((r) => r.status === "in-transit").length,
    delivered:  myRequests.filter((r) => ["delivered", "confirmed"].includes(r.status)).length,
    disputed:   myRequests.filter((r) => r.status === "disputed").length,
  }), [myRequests]);

  return (
    <div
      className={cn(
        "mx-auto",
        isMobile
          ? "px-4 pt-4 pb-20 space-y-5"
          : isDesktop
          ? "px-8 py-7 max-w-[1600px] space-y-7"
          : "px-6 py-6 max-w-[1280px] space-y-6"
      )}
    >
      {/* HEADER */}
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className={cn("text-text-tertiary tracking-[0.18em] uppercase mb-1", isMobile ? "text-[10px]" : "text-xs")}>
            {branch?.name ?? "الفرع"} · لوحة التحكم
          </p>
          <h1 className={cn("font-bold tracking-tight leading-tight", isDesktop ? "text-3xl" : isMobile ? "text-xl" : "text-2xl")}>
            صباح الخير، {user?.name?.split(" ")[0] ?? "مدير الفرع"}
          </h1>
        </div>
        <BranchClock />
      </header>

      <div className="gold-hairline" />

      {/* QUICK ACTIONS */}
      <section>
        <SectionLabel>إجراءات سريعة</SectionLabel>
        <div className={cn("grid gap-3 mt-3", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3")}>
          <QuickActionCard
            href="/requests/new"
            icon={ClipboardList}
            label="طلب من المصنع"
            description="أنشئ طلب مواد من المصنع"
            tone="brand"
            shortcut="N"
          />
          <QuickActionCard
            href="/inventory/count"
            icon={PackageSearch}
            label="جرد مخزون"
            description="ابدأ جلسة جرد للفرع"
            tone="warm"
            shortcut="I"
          />
          <QuickActionCard
            href="/requests/receive"
            icon={PackageCheck}
            label="استلام من المصنع"
            description="سجل استلام بضاعة من المصنع"
            tone="info"
            shortcut="R"
          />
        </div>
      </section>

      {/* KPI CARDS */}
      <section>
        <SectionLabel>حالة الطلبات</SectionLabel>
        <div className={cn("grid gap-3 mt-3", isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4")}>
          <KpiCard icon={ClipboardList} label="بانتظار موافقة" value={kpis.pending}    unit="طلب" tone={kpis.pending > 0 ? "warning" : "neutral"} hint="لم يُوافَق عليها بعد" />
          <KpiCard icon={Truck}         label="في الطريق"      value={kpis.inTransit}  unit="طلب" tone={kpis.inTransit > 0 ? "info" : "neutral"}                               hint="على الطريق إليك"        />
          <KpiCard icon={CheckCircle2}  label="تم التسليم"     value={kpis.delivered}  unit="طلب" tone="neutral"                                                               hint="تأكيد الاستلام"         />
          <KpiCard icon={AlertCircle}   label="نزاعات"         value={kpis.disputed}   unit="طلب" tone={kpis.disputed > 0 ? "danger" : "neutral"}                              hint="تحتاج مراجعة"           />
        </div>
      </section>

      {/* INVENTORY ALERT */}
      <section>
        <SectionLabel>تنبيهات المخزون</SectionLabel>
        <div className={cn("grid gap-3 mt-3", isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3")}>
          <KpiCard icon={AlertTriangle} label="مخزون منخفض"    value={factoryStockCounts.low}      unit="صنف" tone="warning" hint="تحت الحد الأدنى"  />
          <KpiCard icon={ClockAlert}    label="قارب على الانتهاء" value={factoryStockCounts.expiring} unit="صنف" tone="warning" hint="خلال ٥ أيام"      />
          <KpiCard icon={Boxes}         label="إجمالي الأصناف"  value={factoryStockCounts.total}    unit="صنف" tone="neutral" hint="في مخزن الفرع"    />
        </div>
      </section>

      {/* STOCK CHART + RECENT REQUESTS — side by side on desktop */}
      <section className={cn("grid gap-5", isDesktop ? "grid-cols-[1.5fr_1fr]" : "grid-cols-1")}>
        <BranchStockChart requests={myRequests} brandId={user?.brandId ?? "wahsh"} />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel>آخر الطلبات</SectionLabel>
            <Link href="/requests" className="text-xs text-brand-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
              عرض الكل
              <ChevronLeft className="w-3 h-3" strokeWidth={2.5} />
            </Link>
          </div>
          <RecentRequests requests={myRequests.slice(0, 5)} />
        </div>
      </section>
    </div>
  );
}

/* ── Section label ─────────────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] tracking-[0.18em] uppercase text-text-tertiary font-semibold">
      {children}
    </p>
  );
}

/* ── Branch clock ──────────────────────────────────────────────────────────── */

function BranchClock() {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
  const dateStr = new Intl.DateTimeFormat("ar-EG", { weekday: "long", day: "numeric", month: "long" }).format(now);

  return (
    <Card padding="md" className="flex items-center gap-3 min-w-[200px]">
      <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-brand-primary/15 text-brand-primary">
        <Clock className="w-4 h-4" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-bold tabular tracking-tight leading-none">{timeStr}</p>
        <p className="text-[11px] text-text-tertiary mt-1.5">{dateStr}</p>
      </div>
    </Card>
  );
}

/* ── Quick action card ─────────────────────────────────────────────────────── */

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
    info:  { iconWrap: "bg-status-info text-white",           arrow: "text-status-info"   },
    warm:  { iconWrap: "bg-brand-warm text-white",            arrow: "text-brand-warm"    },
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
        <span
          aria-hidden
          className={cn(
            "absolute -top-12 -left-12 w-32 h-32 rounded-full opacity-0 blur-2xl transition-opacity duration-normal group-hover:opacity-30",
            tone === "brand" && "bg-brand-primary",
            tone === "info"  && "bg-status-info",
            tone === "warm"  && "bg-brand-warm",
          )}
        />
        <div className="relative flex items-start gap-4">
          <div className={cn("shrink-0 w-12 h-12 rounded-md flex items-center justify-center transition-transform duration-normal ease-out-expo group-hover:scale-110 group-hover:rotate-[-4deg]", toneStyle.iconWrap)}>
            <Icon className="w-5 h-5" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold tracking-tight leading-tight">{label}</p>
            <p className="text-xs text-text-tertiary mt-1 leading-relaxed">{description}</p>
          </div>
          <span className={cn("shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-sm border border-border-subtle transition-all duration-fast group-hover:border-current", toneStyle.arrow)}>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-fast group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
          <span className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase">اضغط لبدء</span>
          <kbd className="inline-flex items-center justify-center px-1.5 h-5 rounded-[4px] bg-bg-surface-raised text-[10px] tabular text-text-secondary border border-border-subtle">{shortcut}</kbd>
        </div>
      </Card>
    </Link>
  );
}

/* ── KPI card ──────────────────────────────────────────────────────────────── */

function KpiCard({
  icon: Icon, label, value, unit, tone, hint,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  unit?: string;
  tone: "neutral" | "warning" | "danger" | "info";
  hint?: string;
}) {
  const toneStyle = {
    neutral: { text: "text-text-primary",   bg: "bg-bg-surface-raised text-text-secondary" },
    warning: { text: "text-status-warning", bg: "bg-status-warning/15 text-status-warning" },
    danger:  { text: "text-status-danger",  bg: "bg-status-danger/15 text-status-danger"   },
    info:    { text: "text-status-info",    bg: "bg-status-info/15 text-status-info"        },
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
        <p className={cn("text-3xl font-bold tabular tracking-tight leading-none", toneStyle.text)}>{value}</p>
        {unit && <span className="text-xs text-text-tertiary font-medium">{unit}</span>}
      </div>
      {hint && <p className="text-[11px] text-text-tertiary mt-2 truncate">{hint}</p>}
    </Card>
  );
}

/* ── Branch stock chart ────────────────────────────────────────────────────── */

function BranchStockChart({
  requests,
  brandId,
}: {
  requests: typeof factoryRequests;
  brandId: "wahsh" | "kababgy" | "forno";
}) {
  const top = useMemo(() => {
    // Only show items relevant to this brand (+ shared items)
    const brandStock = factoryStock.filter(
      (i) => i.brand === brandId || i.brand === "shared"
    );

    if (requests.length > 0) {
      const totals = new Map<string, number>();
      requests.forEach((req) =>
        req.items.forEach((item) => {
          totals.set(item.name, (totals.get(item.name) ?? 0) + item.requestedQty);
        })
      );
      return [...brandStock]
        .sort((a, b) => (totals.get(b.name) ?? 0) - (totals.get(a.name) ?? 0))
        .slice(0, 12);
    }
    // Fallback: most critical first
    return [...brandStock]
      .sort((a, b) => a.currentQty / Math.max(a.maxQty, 1) - b.currentQty / Math.max(b.maxQty, 1))
      .slice(0, 12);
  }, [requests, brandId]);

  const maxRef = Math.max(...top.map((i) => i.maxQty), 1);

  return (
    <Card padding="lg">
      <header className="flex items-start justify-between gap-3 mb-5">
        <div>
          <SectionLabel>أكثر الأصناف طلباً</SectionLabel>
          <h2 className="text-base font-medium tracking-tight mt-1">
            أعلى ١٢ صنف · الكمية الحالية في المخزن
          </h2>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-text-tertiary">
          <LegendDot color="bg-status-success" label="متوفر" />
          <LegendDot color="bg-status-warning" label="منخفض" />
          <LegendDot color="bg-status-danger"  label="حرج / نفد" />
        </div>
      </header>
      <ul className="space-y-3">
        {top.map((item) => {
          const fillPct = Math.max(2, Math.min(100, (item.currentQty / maxRef) * 100));
          const minPct  = (item.minQty / maxRef) * 100;
          const meta    = levelMeta[item.level];
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
                <span
                  aria-hidden
                  className="absolute top-0 bottom-0 w-px bg-text-tertiary/40"
                  style={{ right: `${minPct}%` }}
                />
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
        <span className="text-[11px] text-text-tertiary">العمود الرفيع = الحد الأدنى للمخزون</span>
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

/* ── Recent requests list ──────────────────────────────────────────────────── */

const reqStatusMeta: Record<string, { label: string; intent: "neutral" | "info" | "success" | "warning" | "danger" | "brand" }> = {
  requested:    { label: "بانتظار موافقة", intent: "warning" },
  approved:     { label: "تمت الموافقة",   intent: "info"    },
  preparing:    { label: "قيد التحضير",    intent: "info"    },
  loaded:       { label: "محمّل",            intent: "brand"   },
  "in-transit": { label: "في الطريق",       intent: "info"    },
  delivered:    { label: "تم التسليم",      intent: "success" },
  confirmed:    { label: "مُؤكَّد",            intent: "success" },
  closed:       { label: "مُغلَق",             intent: "neutral" },
  "on-hold":    { label: "متوقف مؤقتاً",     intent: "warning" },
  disputed:     { label: "متنازع عليه",     intent: "danger"  },
  rejected:     { label: "مرفوض",            intent: "danger"  },
  cancelled:    { label: "مُلغى",              intent: "neutral" },
};

function RecentRequests({ requests }: { requests: typeof factoryRequests }) {
  if (requests.length === 0) {
    return (
      <Card padding="lg" className="text-center">
        <ClipboardList className="w-8 h-8 text-text-tertiary mx-auto mb-3" strokeWidth={1.25} />
        <p className="text-sm text-text-secondary">لا توجد طلبات حتى الآن</p>
        <Link href="/requests/new" className="inline-flex items-center gap-1.5 mt-3 text-xs text-brand-primary hover:underline underline-offset-4">
          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
          أنشئ أول طلب
        </Link>
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden divide-y divide-border-subtle">
      {requests.map((r) => {
        const status = reqStatusMeta[r.status] ?? { label: r.status, intent: "neutral" as const };
        return (
          <Link
            key={r.id}
            href={`/requests/${r.id}`}
            className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-surface-raised transition-colors duration-fast group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium tabular tracking-tight">{r.requestNumber}</p>
              <p className="text-[11px] text-text-tertiary tabular mt-0.5">{r.createdAt} · التسليم: {r.requestedDeliveryDate}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-text-tertiary tabular">{r.items.length} صنف</span>
              <Badge intent={status.intent} size="sm">{status.label}</Badge>
              <ChevronLeft className="w-3.5 h-3.5 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-fast" strokeWidth={2} />
            </div>
          </Link>
        );
      })}
    </Card>
  );
}
