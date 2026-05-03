"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  X,
  ClipboardList,
  Clock,
  Sparkles,
  ChefHat,
  Truck,
  PackageCheck,
  AlertTriangle,
  Zap,
  ChevronLeft,
  RotateCw,
  ArrowLeft,
  Calendar,
  ArrowUp,
  ArrowDown,
  type LucideIcon,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { useAuth } from "@/hooks/useAuth";
import { useTemplates } from "@/hooks/useTemplates";
import { TemplatesPanel } from "./TemplatesPanel";
import { type FactoryRequest } from "@/lib/mock/factoryRequests";
import { useRequestsDB } from "@/lib/db/requests";
import type { RequestStatus } from "@/lib/mock/requests";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type StatusGroup = "all" | "pending" | "preparing" | "in-transit" | "delivered" | "issues";

const STATUS_GROUPS: { key: StatusGroup; label: string; statuses: RequestStatus[]; tone: "neutral" | "info" | "warning" | "success" | "danger"; Icon: LucideIcon }[] = [
  { key: "all",        label: "الكل",         statuses: [],                                               tone: "neutral", Icon: ClipboardList },
  { key: "pending",    label: "بانتظار",      statuses: ["requested"],                                    tone: "warning", Icon: Clock },
  { key: "preparing",  label: "قيد التحضير", statuses: ["approved", "preparing"],                        tone: "info",    Icon: ChefHat },
  { key: "in-transit", label: "في الطريق",    statuses: ["loaded", "in-transit"],                        tone: "info",    Icon: Truck },
  { key: "delivered",  label: "تم التسليم",  statuses: ["delivered", "confirmed", "closed"],             tone: "success", Icon: PackageCheck },
  { key: "issues",     label: "نزاعات",       statuses: ["disputed", "rejected", "on-hold", "cancelled"], tone: "danger",  Icon: AlertTriangle },
];

const statusMeta: Record<RequestStatus, { label: string; intent: "neutral" | "info" | "success" | "warning" | "danger" | "brand" }> = {
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

export function BranchRequests() {
  const device = useDevice();
  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";
  const { user } = useAuth();

  const branchId = user?.branchId ?? "";
  const { templates, addTemplate, replaceTemplate, removeTemplate } = useTemplates();

  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [statusGroup, setStatusGroup] = useState<StatusGroup>("all");
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [sortDir, setSortDir] = useState<"newest" | "oldest">("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 240);
    return () => clearTimeout(t);
  }, []);

  const branchRequests = useRequestsDB().getByBranch(branchId);

  const filtered = useMemo(() => {
    let list = branchRequests;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((r) =>
        r.requestNumber.toLowerCase().includes(q) ||
        r.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }
    if (statusGroup !== "all") {
      const grp = STATUS_GROUPS.find((g) => g.key === statusGroup);
      if (grp) list = list.filter((r) => grp.statuses.includes(r.status));
    }
    // Date range filter
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      list = list.filter((r) => new Date(r.createdAtDate ?? 0).getTime() >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86_400_000; // include the whole "to" day
      list = list.filter((r) => new Date(r.createdAtDate ?? 0).getTime() <= to);
    }
    // Sort by created date
    list = [...list].sort((a, b) => {
      const aT = new Date(a.createdAtDate ?? 0).getTime();
      const bT = new Date(b.createdAtDate ?? 0).getTime();
      return sortDir === "newest" ? bT - aT : aT - bT;
    });
    return list;
  }, [branchRequests, search, statusGroup, dateFrom, dateTo, sortDir]);

  const counts = useMemo(() => {
    const c: Record<StatusGroup, number> = {
      all: branchRequests.length, pending: 0, preparing: 0, "in-transit": 0, delivered: 0, issues: 0,
    };
    branchRequests.forEach((r) => {
      STATUS_GROUPS.forEach((g) => {
        if (g.key !== "all" && g.statuses.includes(r.status)) c[g.key]++;
      });
    });
    return c;
  }, [branchRequests]);

  const hasFilters = statusGroup !== "all" || !!search.trim() || !!dateFrom || !!dateTo;
  const clearAll = () => { setStatusGroup("all"); setSearch(""); setDateFrom(""); setDateTo(""); };

  return (
    <div className={cn(
      "mx-auto",
      isMobile ? "px-4 pt-4 pb-20 space-y-4" : isDesktop ? "px-8 py-7 max-w-[1600px] space-y-6" : "px-6 py-6 max-w-[1280px] space-y-5"
    )}>
      {/* HEADER */}
      <header className="flex items-end gap-4 flex-wrap justify-between">
        <div>
          <p className={cn("text-text-tertiary tracking-[0.18em] uppercase mb-1", isMobile ? "text-[10px]" : "text-xs")}>
            REQUESTS · طلباتي من المصنع
          </p>
          <h1 className={cn("font-bold tracking-tight", isDesktop ? "text-3xl" : isMobile ? "text-xl" : "text-2xl")}>
            طلبات الفرع
          </h1>
          <p className={cn("text-text-tertiary mt-1", isMobile ? "text-xs" : "text-sm")}>
            {branchRequests.length} طلب · {counts.pending} بانتظار موافقة · {counts["in-transit"]} في الطريق
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTemplatesOpen(true)}
            className="inline-flex items-center gap-2 h-11 px-4 rounded-sm border border-border-subtle bg-bg-surface text-text-secondary text-sm font-medium tracking-tight hover:border-border-strong hover:text-text-primary active:scale-[0.985] transition-all duration-fast"
          >
            <Sparkles className="w-4 h-4" strokeWidth={1.75} />
            القوالب
            {templates.length > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-primary/15 text-brand-primary text-[10px] font-bold tabular">
                {templates.length}
              </span>
            )}
          </button>
          <Link
            href="/requests/new"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-sm bg-brand-primary text-text-on-brand text-sm font-medium tracking-tight hover:bg-brand-primary-hover active:scale-[0.985] transition-all duration-fast"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            طلب جديد من المصنع
          </Link>
        </div>
      </header>

      <div className="gold-hairline" />

      {/* KPI TABS */}
      {!isMobile && (
        <section className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {STATUS_GROUPS.map((g) => (
            <KpiTile
              key={g.key}
              icon={g.Icon}
              label={g.label}
              value={counts[g.key]}
              tone={g.tone}
              active={statusGroup === g.key}
              onClick={() => setStatusGroup(statusGroup === g.key ? "all" : g.key)}
            />
          ))}
        </section>
      )}

      {/* TOOLBAR */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex items-center h-11 flex-1 min-w-[220px] rounded-sm bg-bg-surface border border-border focus-within:border-border-focus focus-within:shadow-glow-brand transition-all duration-fast">
          <Search className="absolute right-3.5 w-4 h-4 text-text-tertiary pointer-events-none" strokeWidth={1.75} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم الطلب أو الصنف..."
            className="w-full h-full bg-transparent outline-none px-10 text-sm text-text-primary placeholder:text-text-tertiary"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute left-3 inline-flex items-center justify-center w-5 h-5 rounded-full text-text-tertiary hover:text-text-primary transition-colors duration-fast" aria-label="مسح">
              <X className="w-3 h-3" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Sort toggle */}
        <button
          type="button"
          onClick={() => setSortDir(sortDir === "newest" ? "oldest" : "newest")}
          className="inline-flex items-center gap-2 h-11 px-3.5 rounded-sm border border-border bg-bg-surface text-text-secondary text-xs font-medium tracking-tight hover:border-border-strong hover:text-text-primary transition-all duration-fast"
          title={sortDir === "newest" ? "الأحدث أولاً" : "الأقدم أولاً"}
        >
          {sortDir === "newest" ? (
            <ArrowDown className="w-3.5 h-3.5" strokeWidth={2} />
          ) : (
            <ArrowUp className="w-3.5 h-3.5" strokeWidth={2} />
          )}
          {sortDir === "newest" ? "الأحدث أولاً" : "الأقدم أولاً"}
        </button>
      </div>

      {/* DATE RANGE FILTER */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="inline-flex items-center gap-2 text-[11px] text-text-tertiary tracking-[0.14em] uppercase">
          <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
          الفترة:
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="inline-flex items-center gap-1.5 text-[11px] text-text-tertiary">
            من
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 px-2.5 rounded-sm bg-bg-surface border border-border focus:border-brand-primary outline-none text-xs tracking-tight tabular transition-all"
            />
          </label>
          <label className="inline-flex items-center gap-1.5 text-[11px] text-text-tertiary">
            إلى
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 px-2.5 rounded-sm bg-bg-surface border border-border focus:border-brand-primary outline-none text-xs tracking-tight tabular transition-all"
            />
          </label>
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => { setDateFrom(""); setDateTo(""); }}
              className="inline-flex items-center gap-1 h-9 px-2.5 rounded-sm border border-border-subtle text-text-tertiary hover:text-status-danger hover:border-status-danger/40 text-[11px] transition-all"
            >
              <X className="w-3 h-3" strokeWidth={2} />
              مسح التاريخ
            </button>
          )}
        </div>
      </div>

      {/* QUICK CHIPS */}
      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="flex items-center gap-2 min-w-max px-1">
          {STATUS_GROUPS.map((g) => (
            <Chip key={g.key} active={statusGroup === g.key} tone={g.tone} onClick={() => setStatusGroup(g.key)}>
              <g.Icon className="w-3 h-3" strokeWidth={2} />
              {g.label} ({counts[g.key]})
            </Chip>
          ))}
        </div>
      </div>

      {/* BODY */}
      {!ready ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState onClear={clearAll} hasFilters={hasFilters} />
      ) : (
        <div className="animate-fade-in space-y-3">
          {filtered.map((r) => (
            <RequestRow key={r.id} request={r} />
          ))}
        </div>
      )}

      {/* Templates panel */}
      {templatesOpen && (
        <TemplatesPanel
          templates={templates}
          onClose={() => setTemplatesOpen(false)}
          onAdd={addTemplate}
          onReplace={replaceTemplate}
          onDelete={removeTemplate}
        />
      )}
    </div>
  );
}

/* ── KPI tile ──────────────────────────────────────────────────────────────── */

function KpiTile({ icon: Icon, label, value, tone, active, onClick }: {
  icon: LucideIcon; label: string; value: number;
  tone: "neutral" | "info" | "success" | "warning" | "danger";
  active: boolean; onClick: () => void;
}) {
  const toneText = { neutral: "text-text-primary", info: "text-status-info", success: "text-status-success", warning: "text-status-warning", danger: "text-status-danger" }[tone];
  const toneBg   = { neutral: "bg-bg-surface-raised text-text-secondary", info: "bg-status-info/15 text-status-info", success: "bg-status-success/15 text-status-success", warning: "bg-status-warning/15 text-status-warning", danger: "bg-status-danger/15 text-status-danger" }[tone];
  return (
    <button type="button" onClick={onClick} className="text-right">
      <Card padding="md" className={cn("min-w-0 transition-all duration-fast ease-out-expo hover:border-border-strong hover:-translate-y-0.5", active && "border-brand-primary/60")}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-[10px] text-text-tertiary tracking-[0.18em] uppercase font-semibold truncate">{label}</p>
          <div className={cn("w-8 h-8 rounded-sm flex items-center justify-center", toneBg)}>
            <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
          </div>
        </div>
        <p className={cn("text-3xl font-bold tabular tracking-tight leading-none", toneText)}>{value}</p>
      </Card>
    </button>
  );
}

/* ── Request row card ──────────────────────────────────────────────────────── */

function RequestRow({ request }: { request: FactoryRequest }) {
  const status = statusMeta[request.status];
  const urgent = request.priority === "urgent";
  const isInTransit = request.status === "in-transit";

  return (
    <div className="group">
      <Card
        padding="md"
        className={cn(
          "transition-all duration-fast ease-out-expo",
          isInTransit
            ? "border-status-info/50 bg-status-info/5"
            : "group-hover:border-border-strong group-hover:-translate-y-0.5"
        )}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-base font-bold tabular tracking-tight">{request.requestNumber}</p>
              {urgent && (
                <Badge intent="danger" size="sm" dot pulse>
                  <Zap className="w-3 h-3 fill-current" strokeWidth={2} />
                  عاجل
                </Badge>
              )}
              <Badge intent={status.intent} size="sm">{status.label}</Badge>
              {isInTransit && request.driverName && (
                <span className="text-[11px] text-status-info">السائق: {request.driverName}</span>
              )}
            </div>
            <p className="text-[11px] text-text-tertiary tabular mt-1">
              {request.createdAt} · التسليم المطلوب: {request.requestedDeliveryDate}
            </p>
          </div>
          <Link
            href={`/requests/${request.id}`}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-[11px] text-text-tertiary hover:text-brand-primary transition-colors mt-0.5"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        {/* Items */}
        <div className="mt-3 pt-3 border-t border-border-subtle">
          <p className="text-[10px] text-text-tertiary tracking-[0.14em] uppercase mb-2">الأصناف ({request.items.length})</p>
          <ul className="space-y-1">
            {request.items.slice(0, 3).map((it) => (
              <li key={it.catalogId} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-text-secondary truncate">{it.name}</span>
                <span className="shrink-0 tabular text-text-tertiary">{it.requestedQty} {it.unit}</span>
              </li>
            ))}
            {request.items.length > 3 && (
              <li className="text-[11px] text-text-tertiary">+ {request.items.length - 3} أصناف أخرى</li>
            )}
          </ul>
        </div>

        {/* Receive CTA — only for in-transit */}
        {isInTransit && (
          <div className="mt-3 pt-3 border-t border-status-info/30">
            <Link
              href="/requests/receive"
              className="flex items-center justify-between gap-3 w-full h-11 px-4 rounded-md bg-status-info text-white text-sm font-medium tracking-tight hover:bg-status-info/85 active:scale-[0.98] transition-all duration-fast"
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" strokeWidth={2} />
                استلام الطلب الآن
              </div>
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ── Chip ──────────────────────────────────────────────────────────────────── */

function Chip({ active, tone, onClick, children }: {
  active: boolean; tone: "neutral" | "info" | "success" | "warning" | "danger";
  onClick: () => void; children: React.ReactNode;
}) {
  const activeBg: Record<string, string> = {
    neutral: "bg-text-primary text-text-inverse border-text-primary",
    info:    "bg-status-info text-white border-status-info",
    success: "bg-status-success text-white border-status-success",
    warning: "bg-status-warning text-white border-status-warning",
    danger:  "bg-status-danger text-white border-status-danger",
  };
  return (
    <button type="button" onClick={onClick} className={cn("shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-medium tracking-tight border transition-all duration-fast ease-out-expo active:scale-[1.05]", active ? activeBg[tone] : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary")}>
      {children}
    </button>
  );
}

/* ── Loading + empty ───────────────────────────────────────────────────────── */

function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} padding="md" className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded-full bg-bg-muted animate-pulse" />
              <div className="h-3 w-1/2 rounded-full bg-bg-muted/60 animate-pulse" />
            </div>
            <div className="w-14 h-6 rounded-full bg-bg-muted animate-pulse" />
          </div>
          <div className="h-12 w-full rounded bg-bg-muted/40 animate-pulse" />
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6 animate-fade-in">
      <div className="relative w-28 h-28 mb-6">
        <div className="absolute inset-0 rounded-full bg-brand-primary/8 animate-pulse-dot" />
        <div className="absolute inset-4 rounded-full border border-brand-primary/30 flex items-center justify-center">
          <ClipboardList className="w-9 h-9 text-brand-primary" strokeWidth={1.25} />
        </div>
      </div>
      <h3 className="text-lg font-bold tracking-tight mb-1">
        {hasFilters ? "لا توجد طلبات تطابق الفلتر" : "لا توجد طلبات حتى الآن"}
      </h3>
      <p className="text-sm text-text-tertiary max-w-sm mb-6">
        {hasFilters ? "جرّب تخفيف معايير البحث أو ابدأ من جديد." : "أنشئ أول طلب من المصنع لتبدأ."}
      </p>
      {hasFilters ? (
        <button onClick={onClear} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-sm text-sm font-medium tracking-tight bg-bg-surface border border-border hover:border-border-strong text-text-secondary transition-all duration-fast">
          <RotateCw className="w-3.5 h-3.5" strokeWidth={2} />
          مسح الفلاتر
        </button>
      ) : (
        <Link href="/requests/new" className="inline-flex items-center gap-1.5 h-10 px-5 rounded-sm text-sm font-medium bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover transition-all duration-fast">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          طلب جديد من المصنع
        </Link>
      )}
    </div>
  );
}
