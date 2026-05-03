"use client";

import { useState, useMemo, useEffect, useDeferredValue } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  LayoutGrid,
  Rows3,
  SlidersHorizontal,
  X,
  Star,
  Phone,
  Pencil,
  PackagePlus,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronLeft,
  Building2,
  RotateCw,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import {
  suppliers,
  supplierCounts,
  supplierStatusMeta,
  categoryMeta,
  performanceTagMeta,
  smartAlerts,
  healthBand,
  type Supplier,
  type SupplierStatus,
  type SupplierCategory,
  type PerformanceTag,
} from "@/lib/mock/suppliers";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HealthGauge } from "@/components/ui/HealthGauge";
import { useToastContext } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import { Highlight } from "./SupplierHighlight";
import { CategoryChip, SupplierTable, type SortKey, type SortDir } from "./SupplierTable";

type ViewMode = "grid" | "table";
type LastOrderWindow = "all" | "7d" | "30d" | "none";

const ALL_CATEGORIES: SupplierCategory[] = [
  "meat", "produce", "dairy", "dry-goods", "beverages", "packaging",
];
const ALL_STATUSES: SupplierStatus[] = ["preferred", "active", "review", "blocked"];
const ALL_PERF: PerformanceTag[] = ["high", "stable", "risky", "inactive"];

export function Suppliers() {
  const device = useDevice();
  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";

  /* ---------- state ---------- */
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [statusFilters, setStatusFilters] = useState<Set<SupplierStatus>>(new Set());
  const [categoryFilters, setCategoryFilters] = useState<Set<SupplierCategory>>(new Set());
  const [perfFilters, setPerfFilters] = useState<Set<PerformanceTag>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [lastOrderFilter, setLastOrderFilter] = useState<LastOrderWindow>("all");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);

  // Initial-load skeleton — short so the design state is visible without
  // adding noticeable wait time after the first mount.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 280);
    return () => clearTimeout(t);
  }, []);

  /* ---------- filtering ---------- */
  const filtered = useMemo(() => {
    let list = suppliers;

    const q = deferredSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        (s.phoneSecondary?.includes(q) ?? false) ||
        s.categories.some((c) => categoryMeta[c].label.toLowerCase().includes(q)) ||
        (s.notes?.toLowerCase().includes(q) ?? false) ||
        (s.address?.toLowerCase().includes(q) ?? false)
      );
    }
    if (statusFilters.size) list = list.filter((s) => statusFilters.has(s.status));
    if (categoryFilters.size) list = list.filter((s) => s.categories.some((c) => categoryFilters.has(c)));
    if (perfFilters.size) list = list.filter((s) => perfFilters.has(s.performanceTag));
    if (minRating > 0) list = list.filter((s) => s.rating >= minRating);
    if (lastOrderFilter === "7d") list = list.filter((s) => s.daysSinceLastOrder <= 7);
    else if (lastOrderFilter === "30d") list = list.filter((s) => s.daysSinceLastOrder <= 30);
    else if (lastOrderFilter === "none") list = list.filter((s) => s.daysSinceLastOrder > 30);

    return list;
  }, [deferredSearch, statusFilters, categoryFilters, perfFilters, minRating, lastOrderFilter]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      switch (sortKey) {
        case "rating": return (a.rating - b.rating) * dir;
        case "health": return (a.healthScore - b.healthScore) * dir;
        case "lastOrder": return (a.daysSinceLastOrder - b.daysSinceLastOrder) * dir;
        case "totalOrders": return (a.totalOrders - b.totalOrders) * dir;
        case "name":
        default:
          return a.name.localeCompare(b.name, "ar") * dir;
      }
    });
    return list;
  }, [filtered, sortKey, sortDir]);

  /* ---------- helpers ---------- */
  const activeCount =
    statusFilters.size + categoryFilters.size + perfFilters.size +
    (minRating > 0 ? 1 : 0) + (lastOrderFilter !== "all" ? 1 : 0);

  function toggleSet<T>(set: Set<T>, value: T): Set<T> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }

  function clearAll() {
    setStatusFilters(new Set());
    setCategoryFilters(new Set());
    setPerfFilters(new Set());
    setMinRating(0);
    setLastOrderFilter("all");
    setSearch("");
  }

  function setSort(key: SortKey) {
    if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  function changeView(next: ViewMode) {
    if (next === view) return;
    setView(next);
    // selections only matter in table; clear when leaving
    if (next === "grid") setSelected(new Set());
  }

  // Reset render-key on filter shifts so cards re-enter with fade-in.
  const renderKey = useMemo(
    () => `${deferredSearch}|${[...statusFilters].join(",")}|${[...categoryFilters].join(",")}|${[...perfFilters].join(",")}|${minRating}|${lastOrderFilter}|${view}`,
    [deferredSearch, statusFilters, categoryFilters, perfFilters, minRating, lastOrderFilter, view]
  );

  /* ---------- render ---------- */

  return (
    <div
      className={cn(
        "mx-auto",
        isMobile ? "px-4 pt-4 pb-20 space-y-4" : isDesktop ? "px-8 py-7 max-w-[1600px] space-y-6" : "px-6 py-6 max-w-[1280px] space-y-5"
      )}
    >
      {/* ------- HEADER ------- */}
      <header className={cn("flex items-end gap-4 flex-wrap", !isMobile && "justify-between")}>
        <div>
          <p className={cn("text-text-tertiary tracking-[0.18em] uppercase mb-1", isMobile ? "text-[10px]" : "text-xs")}>
            Suppliers
          </p>
          <h1 className={cn("font-bold tracking-tight", isDesktop ? "text-3xl" : isMobile ? "text-xl" : "text-2xl")}>
            الموردون
          </h1>
          <p className={cn("text-text-tertiary mt-1", isMobile ? "text-xs" : "text-sm")}>
            {supplierCounts.total} مورد · {supplierCounts.openIssues} بلاغات مفتوحة · مستحقات {(supplierCounts.totalPayables / 1000).toFixed(0)}ك ج.م
          </p>
        </div>
        {!isMobile && (
          <Link
            href="/suppliers/new"
            className={cn(
              "inline-flex items-center gap-2 h-12 px-5 rounded-md text-base font-medium tracking-tight",
              "bg-brand-primary text-text-on-brand shadow-sm",
              "hover:bg-brand-primary-hover hover:shadow-md active:scale-[0.985]",
              "transition-all duration-fast ease-out-expo"
            )}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            مورد جديد
          </Link>
        )}
      </header>

      {/* ------- SMART ALERTS ------- */}
      {!isMobile && smartAlerts.length > 0 && (
        <SmartAlertsStrip
          activeId={activeAlertId}
          setActiveId={setActiveAlertId}
        />
      )}

      {/* ------- KPI TILES ------- */}
      {!isMobile && (
        <>
          <div className="gold-hairline" />
          <section className={cn("grid gap-3", isDesktop ? "grid-cols-5" : "grid-cols-2 lg:grid-cols-5")}>
            <KpiTile label="إجمالي الموردين" value={supplierCounts.total} />
            <KpiTile label="موردون مفضّلون" value={supplierCounts.preferred} accent="brand" />
            <KpiTile label="أداء مرتفع" value={supplierCounts.highPerformers} accent="success" />
            <KpiTile
              label="بلاغات مفتوحة"
              value={supplierCounts.openIssues}
              accent={supplierCounts.openIssues > 0 ? "warning" : "neutral"}
              highlight={supplierCounts.openIssues > 0}
            />
            <KpiTile
              label="مستحقات"
              value={`${(supplierCounts.totalPayables / 1000).toFixed(0)}ك`}
              unit="ج.م"
              accent="neutral"
            />
          </section>
        </>
      )}

      {/* ------- TOOLBAR ------- */}
      <div className={cn("flex items-center gap-3 flex-wrap", isMobile && "flex-col-reverse items-stretch")}>
        <SearchBox value={search} onChange={setSearch} />
        <div className={cn("flex items-center gap-2", isMobile && "justify-between")}>
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 h-10 px-3.5 rounded-sm text-sm font-medium tracking-tight",
              "transition-all duration-fast ease-out-expo border",
              advancedOpen
                ? "bg-brand-primary/12 text-brand-primary border-brand-primary/40"
                : "bg-bg-surface text-text-secondary border-border hover:border-border-strong"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>فلاتر متقدمة</span>
            {activeCount > 0 && (
              <span className={cn(
                "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold tabular",
                advancedOpen ? "bg-brand-primary text-text-on-brand" : "bg-brand-primary/20 text-brand-primary"
              )}>
                {activeCount}
              </span>
            )}
          </button>
          {!isMobile && <ViewToggle value={view} onChange={changeView} />}
        </div>
        {isMobile && (
          <Link
            href="/suppliers/new"
            className="inline-flex items-center justify-center gap-2 h-12 rounded-sm bg-brand-primary text-text-on-brand text-sm font-medium tracking-tight active:scale-[0.985] transition-transform"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            مورد جديد
          </Link>
        )}
      </div>

      {/* ------- QUICK FILTER CHIPS ------- */}
      <QuickFilterRow
        statusFilters={statusFilters}
        perfFilters={perfFilters}
        lastOrderFilter={lastOrderFilter}
        onToggleStatus={(s) => setStatusFilters(toggleSet(statusFilters, s))}
        onTogglePerf={(p) => setPerfFilters(toggleSet(perfFilters, p))}
        onLastOrder={setLastOrderFilter}
      />

      {/* ------- ADVANCED PANEL ------- */}
      {advancedOpen && (
        <AdvancedPanel
          statusFilters={statusFilters}
          categoryFilters={categoryFilters}
          perfFilters={perfFilters}
          minRating={minRating}
          lastOrderFilter={lastOrderFilter}
          onToggleStatus={(s) => setStatusFilters(toggleSet(statusFilters, s))}
          onToggleCategory={(c) => setCategoryFilters(toggleSet(categoryFilters, c))}
          onTogglePerf={(p) => setPerfFilters(toggleSet(perfFilters, p))}
          onMinRating={setMinRating}
          onLastOrder={setLastOrderFilter}
        />
      )}

      {/* ------- ACTIVE FILTER CHIPS ------- */}
      {activeCount > 0 && (
        <ActiveFilterChips
          statusFilters={statusFilters}
          categoryFilters={categoryFilters}
          perfFilters={perfFilters}
          minRating={minRating}
          lastOrderFilter={lastOrderFilter}
          onClear={clearAll}
          onRemoveStatus={(s) => setStatusFilters(toggleSet(statusFilters, s))}
          onRemoveCategory={(c) => setCategoryFilters(toggleSet(categoryFilters, c))}
          onRemovePerf={(p) => setPerfFilters(toggleSet(perfFilters, p))}
          onClearRating={() => setMinRating(0)}
          onClearLastOrder={() => setLastOrderFilter("all")}
        />
      )}

      {/* ------- BODY ------- */}
      {!ready ? (
        <LoadingState view={view} isMobile={isMobile} />
      ) : sorted.length === 0 ? (
        <EmptyState onClear={clearAll} hasFilters={activeCount > 0 || !!search.trim()} />
      ) : (
        <div key={renderKey} className="animate-fade-in">
          {view === "grid" || isMobile ? (
            <GridView suppliers={sorted} query={deferredSearch} isMobile={isMobile} isDesktop={isDesktop} />
          ) : (
            <SupplierTable
              suppliers={sorted}
              query={deferredSearch}
              selected={selected}
              setSelected={setSelected}
              sortKey={sortKey}
              sortDir={sortDir}
              setSort={setSort}
              canEdit
            />
          )}
        </div>
      )}

      {/* Mobile FAB */}
      {isMobile && (
        <Link
          href="/suppliers/new"
          className={cn(
            "fixed bottom-[88px] left-4 z-20",
            "w-14 h-14 rounded-full bg-brand-primary text-text-on-brand",
            "shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          )}
          aria-label="مورد جديد"
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </Link>
      )}
    </div>
  );
}

/* ======================================================================
 * Smart alerts strip
 * ==================================================================== */

function SmartAlertsStrip({
  activeId,
  setActiveId,
}: {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}) {
  return (
    <div className="flex items-stretch gap-3 overflow-x-auto pb-1 -mb-1">
      <div className="shrink-0 flex items-center gap-2 px-3 self-stretch border-l border-border-subtle">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-status-warning/15">
          <AlertTriangle className="w-3.5 h-3.5 text-status-warning" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary">تنبيهات</p>
          <p className="text-xs font-medium text-text-secondary">{smartAlerts.length} إشارة</p>
        </div>
      </div>
      <div className="flex items-stretch gap-2 min-w-0">
        {smartAlerts.map((alert) => {
          const tone =
            alert.severity === "danger" ? "danger" :
            alert.severity === "warning" ? "warning" : "info";
          const Icon =
            alert.severity === "danger" ? AlertCircle :
            alert.severity === "warning" ? AlertTriangle : Info;
          return (
            <Link
              href={alert.supplierId ? `/suppliers/${alert.supplierId}` : "#"}
              key={alert.id}
              onMouseEnter={() => setActiveId(alert.id)}
              onMouseLeave={() => setActiveId(null)}
              className={cn(
                "shrink-0 inline-flex items-center gap-3 max-w-[420px] px-4 h-14 rounded-md border bg-bg-surface",
                "transition-all duration-fast ease-out-expo group",
                tone === "danger" && "border-status-danger/30 hover:border-status-danger/60",
                tone === "warning" && "border-status-warning/30 hover:border-status-warning/60",
                tone === "info" && "border-status-info/30 hover:border-status-info/60",
                activeId === alert.id && "shadow-sm -translate-y-0.5"
              )}
            >
              <span className={cn(
                "shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full",
                tone === "danger" && "bg-status-danger/15 text-status-danger",
                tone === "warning" && "bg-status-warning/15 text-status-warning",
                tone === "info" && "bg-status-info/15 text-status-info",
              )}>
                <Icon className="w-4 h-4" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium tracking-tight leading-tight truncate">
                  {alert.text}
                </p>
                <p className="text-[11px] text-text-tertiary mt-0.5 truncate">
                  {alert.supplierName} · {alert.date}
                </p>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-text-tertiary shrink-0 transition-transform duration-fast group-hover:-translate-x-0.5" strokeWidth={1.75} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ======================================================================
 * Search box with leading icon, clear button
 * ==================================================================== */

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative flex items-center h-12 flex-1 min-w-[240px] rounded-sm bg-bg-surface border border-border focus-within:border-border-focus focus-within:shadow-glow-brand transition-all duration-fast">
      <Search className="absolute right-4 w-4 h-4 text-text-tertiary pointer-events-none" strokeWidth={1.75} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ابحث بالاسم أو الهاتف أو الفئة..."
        className={cn(
          "w-full h-full bg-transparent outline-none px-12",
          "text-base text-text-primary placeholder:text-text-tertiary"
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute left-3 inline-flex items-center justify-center w-6 h-6 rounded-full text-text-tertiary hover:bg-bg-surface-raised hover:text-text-primary transition-colors duration-fast"
          aria-label="مسح البحث"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

/* ======================================================================
 * View toggle (segmented)
 * ==================================================================== */

function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="inline-flex items-center h-10 p-0.5 rounded-sm bg-bg-surface border border-border">
      <ToggleBtn active={value === "grid"} onClick={() => onChange("grid")} label="شبكة">
        <LayoutGrid className="w-3.5 h-3.5" strokeWidth={2} />
      </ToggleBtn>
      <ToggleBtn active={value === "table"} onClick={() => onChange("table")} label="جدول">
        <Rows3 className="w-3.5 h-3.5" strokeWidth={2} />
      </ToggleBtn>
    </div>
  );
}

function ToggleBtn({
  active, onClick, children, label,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-[10px] text-xs font-medium tracking-tight transition-all duration-fast",
        active
          ? "bg-bg-surface-raised text-text-primary shadow-xs"
          : "text-text-tertiary hover:text-text-secondary"
      )}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

/* ======================================================================
 * Quick filter row — short, scrolling on mobile
 * ==================================================================== */

function QuickFilterRow({
  statusFilters,
  perfFilters,
  lastOrderFilter,
  onToggleStatus,
  onTogglePerf,
  onLastOrder,
}: {
  statusFilters: Set<SupplierStatus>;
  perfFilters: Set<PerformanceTag>;
  lastOrderFilter: LastOrderWindow;
  onToggleStatus: (s: SupplierStatus) => void;
  onTogglePerf: (p: PerformanceTag) => void;
  onLastOrder: (v: LastOrderWindow) => void;
}) {
  const quickStatus: SupplierStatus[] = ["preferred", "active", "review"];
  return (
    <div className="-mx-1 overflow-x-auto pb-1">
      <div className="flex items-center gap-2 min-w-max px-1">
        {quickStatus.map((s) => {
          const meta = supplierStatusMeta[s];
          const active = statusFilters.has(s);
          return (
            <Chip
              key={s}
              active={active}
              tone={meta.intent}
              onClick={() => onToggleStatus(s)}
            >
              {meta.label}
            </Chip>
          );
        })}
        <span className="w-px h-5 bg-border-subtle mx-1" />
        <Chip active={perfFilters.has("high")} tone="success" onClick={() => onTogglePerf("high")}>
          أداء مرتفع
        </Chip>
        <Chip active={perfFilters.has("risky")} tone="warning" onClick={() => onTogglePerf("risky")}>
          مورد مخاطر
        </Chip>
        <span className="w-px h-5 bg-border-subtle mx-1" />
        <Chip active={lastOrderFilter === "7d"} tone="info" onClick={() => onLastOrder(lastOrderFilter === "7d" ? "all" : "7d")}>
          آخر 7 أيام
        </Chip>
        <Chip active={lastOrderFilter === "none"} tone="neutral" onClick={() => onLastOrder(lastOrderFilter === "none" ? "all" : "none")}>
          بدون طلبات حديثة
        </Chip>
      </div>
    </div>
  );
}

function Chip({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  tone: "neutral" | "info" | "success" | "warning" | "danger" | "brand";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const activeBg: Record<string, string> = {
    brand:   "bg-brand-primary text-text-on-brand border-brand-primary",
    success: "bg-status-success text-white border-status-success",
    warning: "bg-status-warning text-white border-status-warning",
    danger:  "bg-status-danger text-white border-status-danger",
    info:    "bg-status-info text-white border-status-info",
    neutral: "bg-text-primary text-text-inverse border-text-primary",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-medium tracking-tight border",
        "transition-all duration-fast ease-out-expo active:scale-[1.05]",
        active
          ? activeBg[tone]
          : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary"
      )}
    >
      {children}
    </button>
  );
}

/* ======================================================================
 * Advanced filter panel
 * ==================================================================== */

function AdvancedPanel({
  statusFilters,
  categoryFilters,
  perfFilters,
  minRating,
  lastOrderFilter,
  onToggleStatus,
  onToggleCategory,
  onTogglePerf,
  onMinRating,
  onLastOrder,
}: {
  statusFilters: Set<SupplierStatus>;
  categoryFilters: Set<SupplierCategory>;
  perfFilters: Set<PerformanceTag>;
  minRating: number;
  lastOrderFilter: LastOrderWindow;
  onToggleStatus: (s: SupplierStatus) => void;
  onToggleCategory: (c: SupplierCategory) => void;
  onTogglePerf: (p: PerformanceTag) => void;
  onMinRating: (n: number) => void;
  onLastOrder: (v: LastOrderWindow) => void;
}) {
  return (
    <Card padding="lg" className="animate-slide-up">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Status */}
        <FilterGroup label="الحالة">
          <div className="flex items-center gap-1.5 flex-wrap">
            {ALL_STATUSES.map((s) => (
              <Chip
                key={s}
                active={statusFilters.has(s)}
                tone={supplierStatusMeta[s].intent}
                onClick={() => onToggleStatus(s)}
              >
                {supplierStatusMeta[s].label}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        {/* Performance */}
        <FilterGroup label="الأداء">
          <div className="flex items-center gap-1.5 flex-wrap">
            {ALL_PERF.map((p) => (
              <Chip
                key={p}
                active={perfFilters.has(p)}
                tone={performanceTagMeta[p].intent}
                onClick={() => onTogglePerf(p)}
              >
                {performanceTagMeta[p].label}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        {/* Last order */}
        <FilterGroup label="آخر طلب">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Chip active={lastOrderFilter === "7d"} tone="info" onClick={() => onLastOrder(lastOrderFilter === "7d" ? "all" : "7d")}>آخر 7 أيام</Chip>
            <Chip active={lastOrderFilter === "30d"} tone="info" onClick={() => onLastOrder(lastOrderFilter === "30d" ? "all" : "30d")}>آخر 30 يوم</Chip>
            <Chip active={lastOrderFilter === "none"} tone="neutral" onClick={() => onLastOrder(lastOrderFilter === "none" ? "all" : "none")}>بدون طلبات حديثة</Chip>
          </div>
        </FilterGroup>

        {/* Categories */}
        <FilterGroup label="الفئات" colSpan="md:col-span-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {ALL_CATEGORIES.map((c) => (
              <Chip
                key={c}
                active={categoryFilters.has(c)}
                tone="brand"
                onClick={() => onToggleCategory(c)}
              >
                {categoryMeta[c].label}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        {/* Rating */}
        <FilterGroup label="الحد الأدنى للتقييم">
          <div className="flex items-center gap-1.5">
            {[0, 3, 3.5, 4, 4.5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onMinRating(n)}
                className={cn(
                  "inline-flex items-center justify-center gap-1 h-9 px-3 rounded-sm text-xs font-medium tabular tracking-tight border transition-all duration-fast active:scale-[1.05]",
                  minRating === n
                    ? "bg-brand-primary text-text-on-brand border-brand-primary"
                    : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong"
                )}
              >
                {n === 0 ? (
                  "أي تقييم"
                ) : (
                  <>
                    <Star className={cn("w-3 h-3", minRating === n ? "fill-current" : "fill-current")} strokeWidth={1.5} />
                    {n.toFixed(1)}+
                  </>
                )}
              </button>
            ))}
          </div>
        </FilterGroup>
      </div>
    </Card>
  );
}

function FilterGroup({
  label,
  children,
  colSpan,
}: {
  label: string;
  children: React.ReactNode;
  colSpan?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", colSpan)}>
      <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary">{label}</p>
      <div>{children}</div>
    </div>
  );
}

/* ======================================================================
 * Active filter chips bar
 * ==================================================================== */

function ActiveFilterChips({
  statusFilters,
  categoryFilters,
  perfFilters,
  minRating,
  lastOrderFilter,
  onClear,
  onRemoveStatus,
  onRemoveCategory,
  onRemovePerf,
  onClearRating,
  onClearLastOrder,
}: {
  statusFilters: Set<SupplierStatus>;
  categoryFilters: Set<SupplierCategory>;
  perfFilters: Set<PerformanceTag>;
  minRating: number;
  lastOrderFilter: LastOrderWindow;
  onClear: () => void;
  onRemoveStatus: (s: SupplierStatus) => void;
  onRemoveCategory: (c: SupplierCategory) => void;
  onRemovePerf: (p: PerformanceTag) => void;
  onClearRating: () => void;
  onClearLastOrder: () => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[11px] uppercase tracking-[0.16em] text-text-tertiary me-1">مفعّل:</span>
      {[...statusFilters].map((s) => (
        <RemovableChip key={`s-${s}`} onRemove={() => onRemoveStatus(s)}>
          {supplierStatusMeta[s].label}
        </RemovableChip>
      ))}
      {[...categoryFilters].map((c) => (
        <RemovableChip key={`c-${c}`} onRemove={() => onRemoveCategory(c)}>
          {categoryMeta[c].label}
        </RemovableChip>
      ))}
      {[...perfFilters].map((p) => (
        <RemovableChip key={`p-${p}`} onRemove={() => onRemovePerf(p)}>
          {performanceTagMeta[p].label}
        </RemovableChip>
      ))}
      {minRating > 0 && (
        <RemovableChip onRemove={onClearRating}>
          ★ {minRating.toFixed(1)}+
        </RemovableChip>
      )}
      {lastOrderFilter !== "all" && (
        <RemovableChip onRemove={onClearLastOrder}>
          {lastOrderFilter === "7d" ? "آخر 7 أيام" : lastOrderFilter === "30d" ? "آخر 30 يوم" : "بدون طلبات حديثة"}
        </RemovableChip>
      )}
      <button
        type="button"
        onClick={onClear}
        className="text-xs text-text-tertiary hover:text-status-danger transition-colors duration-fast underline-offset-4 hover:underline"
      >
        مسح الكل
      </button>
    </div>
  );
}

function RemovableChip({ onRemove, children }: { onRemove: () => void; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/30 text-xs font-medium tracking-tight animate-fade-in">
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-brand-primary/20 transition-colors duration-fast"
        aria-label="إزالة الفلتر"
      >
        <X className="w-2.5 h-2.5" strokeWidth={2.5} />
      </button>
    </span>
  );
}

/* ======================================================================
 * Grid view (cards)
 * ==================================================================== */

function GridView({
  suppliers: list,
  query,
  isMobile,
  isDesktop,
}: {
  suppliers: Supplier[];
  query: string;
  isMobile: boolean;
  isDesktop: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        isMobile ? "grid-cols-1" : isDesktop ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
      )}
    >
      {list.map((s) => (
        <SupplierCard key={s.id} supplier={s} query={query} />
      ))}
    </div>
  );
}

function SupplierCard({ supplier, query }: { supplier: Supplier; query: string }) {
  const status = supplierStatusMeta[supplier.status];
  const perf = performanceTagMeta[supplier.performanceTag];
  const initial = supplier.name.charAt(0);
  const router = useRouter();
  const toast = useToastContext();

  return (
    <Link href={`/suppliers/${supplier.id}`} className="block group relative">
      <Card
        padding="md"
        className={cn(
          "h-full relative overflow-hidden",
          "transition-all duration-fast ease-out-expo",
          "group-hover:border-border-strong group-hover:-translate-y-0.5"
        )}
      >
        {/* Top row: avatar + name + status */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className={cn(
              "shrink-0 w-12 h-12 rounded-md flex items-center justify-center font-bold text-lg",
              supplier.status === "preferred"
                ? "bg-brand-primary/15 text-brand-primary"
                : supplier.status === "review"
                ? "bg-status-warning/15 text-status-warning"
                : supplier.status === "blocked"
                ? "bg-status-danger/15 text-status-danger"
                : "bg-bg-surface-raised text-text-secondary"
            )}
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold tracking-tight leading-tight truncate">
              <Highlight text={supplier.name} query={query} />
            </p>
            <p className="text-[11px] text-text-tertiary tracking-tight truncate mt-0.5">
              <Highlight text={supplier.nameEn} query={query} />
            </p>
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {supplier.categories.map((c) => (
                <CategoryChip key={c} category={c} />
              ))}
            </div>
          </div>
          <Badge intent={status.intent} size="sm">{status.label}</Badge>
        </div>

        {/* Body row: gauge + ratings */}
        <div className="flex items-center gap-4 py-3 border-t border-border-subtle">
          <HealthGauge value={supplier.healthScore} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "w-3.5 h-3.5",
                    n <= Math.round(supplier.rating)
                      ? "text-brand-primary fill-brand-primary"
                      : "text-text-tertiary/40"
                  )}
                  strokeWidth={1.5}
                />
              ))}
              <span className="text-xs text-text-tertiary tabular ms-1">
                {supplier.rating.toFixed(1)}
              </span>
            </div>
            <Badge intent={perf.intent} size="sm" dot pulse={supplier.performanceTag === "risky"}>
              {perf.label}
            </Badge>
          </div>
        </div>

        {/* Footer row: phone + last order + total */}
        <div className="flex items-center gap-3 pt-3 border-t border-border-subtle text-[11px] text-text-tertiary">
          <span className="inline-flex items-center gap-1.5 min-w-0 flex-1 truncate">
            <Phone className="w-3 h-3" strokeWidth={1.75} />
            <span className="tabular truncate">
              <Highlight text={supplier.phone} query={query} />
            </span>
          </span>
          <span className="shrink-0">آخر طلب: {supplier.lastOrderDate}</span>
          <span className="shrink-0 tabular">
            <span className="text-text-secondary font-bold">{supplier.totalOrders}</span> طلب
          </span>
        </div>

        {/* Quick actions — fade in on hover.
            Using buttons (not nested Links) to avoid <a><a/> hydration error. */}
        <div className={cn(
          "absolute top-3 left-3 flex items-center gap-1",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-fast"
        )}>
          <CardAction
            icon={<Pencil className="w-3 h-3" strokeWidth={2} />}
            label="تعديل"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/suppliers/${supplier.id}/edit`);
            }}
          />
          <CardAction
            icon={<PackagePlus className="w-3 h-3" strokeWidth={2} />}
            label="أمر جديد"
            tone="brand"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.info("بدء أمر شراء جديد", supplier.name);
            }}
          />
        </div>
      </Card>
    </Link>
  );
}

function CardAction({
  icon, onClick, label, tone,
}: {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  label: string;
  tone?: "brand";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center w-7 h-7 rounded-sm border",
        "bg-bg-surface-raised border-border-subtle text-text-secondary",
        "hover:border-border-strong hover:text-text-primary transition-all duration-fast",
        tone === "brand" && "hover:text-brand-primary hover:border-brand-primary/40"
      )}
    >
      {icon}
    </button>
  );
}

/* ======================================================================
 * Loading state — skeletons
 * ==================================================================== */

function LoadingState({ view, isMobile }: { view: ViewMode; isMobile: boolean }) {
  if (view === "table" && !isMobile) {
    return (
      <div className="rounded-md border border-border-subtle bg-bg-surface overflow-hidden">
        <div className="h-11 bg-bg-muted/40 border-b border-border-subtle" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 px-3 flex items-center gap-3 border-b border-border-subtle last:border-0">
            <div className="w-9 h-9 rounded-sm bg-bg-muted animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-40 rounded-full bg-bg-muted animate-pulse" />
              <div className="h-2 w-24 rounded-full bg-bg-muted/60 animate-pulse" />
            </div>
            <div className="w-16 h-6 rounded-full bg-bg-muted animate-pulse" />
            <div className="w-14 h-6 rounded-full bg-bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3")}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} padding="md" className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-md bg-bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded-full bg-bg-muted animate-pulse" />
              <div className="h-3 w-1/2 rounded-full bg-bg-muted/60 animate-pulse" />
            </div>
            <div className="w-14 h-6 rounded-full bg-bg-muted animate-pulse" />
          </div>
          <div className="flex items-center gap-4 pt-3 border-t border-border-subtle">
            <div className="w-14 h-14 rounded-full bg-bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 rounded-full bg-bg-muted animate-pulse" />
              <div className="h-3 w-1/3 rounded-full bg-bg-muted/60 animate-pulse" />
            </div>
          </div>
          <div className="h-3 w-full rounded-full bg-bg-muted/40 animate-pulse" />
        </Card>
      ))}
    </div>
  );
}

/* ======================================================================
 * Empty state — friendly, with clear CTA
 * ==================================================================== */

function EmptyState({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6 animate-fade-in">
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute inset-0 rounded-full bg-brand-primary/8 animate-pulse-dot" />
        <div className="absolute inset-3 rounded-full bg-brand-primary/12" />
        <div className="absolute inset-6 rounded-full border border-brand-primary/30 flex items-center justify-center">
          <Building2 className="w-10 h-10 text-brand-primary" strokeWidth={1.25} />
        </div>
      </div>
      <h3 className="text-lg font-bold tracking-tight mb-1">
        {hasFilters ? "لا يوجد مورد يطابق هذه الفلاتر" : "لم تُضف موردين بعد"}
      </h3>
      <p className="text-sm text-text-tertiary max-w-sm mb-6">
        {hasFilters
          ? "جرّب تخفيف معايير البحث أو ابدأ من جديد بمسح الفلاتر."
          : "ابدأ ببناء قائمة الموردين لتتبّع الأداء وإدارة العلاقات وتسريع أوامر الشراء."}
      </p>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {hasFilters && (
          <Button variant="secondary" size="md" onClick={onClear} leadingIcon={<RotateCw className="w-3.5 h-3.5" strokeWidth={2} />}>
            مسح الفلاتر
          </Button>
        )}
        <Link
          href="/suppliers/new"
          className="inline-flex items-center gap-2 h-12 px-5 rounded-md bg-brand-primary text-text-on-brand text-base font-medium tracking-tight hover:bg-brand-primary-hover hover:shadow-md active:scale-[0.985] transition-all duration-fast ease-out-expo"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          إضافة مورد
        </Link>
      </div>
    </div>
  );
}

/* ======================================================================
 * KPI tile — used at the top of the page
 * ==================================================================== */

function KpiTile({
  label,
  value,
  unit,
  accent = "neutral",
  highlight,
}: {
  label: string;
  value: number | string;
  unit?: string;
  accent?: "neutral" | "brand" | "warning" | "success" | "danger";
  highlight?: boolean;
}) {
  const accentClass =
    accent === "brand"   ? "text-brand-primary" :
    accent === "warning" ? "text-status-warning" :
    accent === "success" ? "text-status-success" :
    accent === "danger"  ? "text-status-danger" :
                           "text-text-primary";
  return (
    <Card padding="md" className={cn("min-w-0", highlight && "border-status-warning/40 bg-status-warning/[0.06]")}>
      <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-2 truncate">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <p className={cn("text-2xl sm:text-3xl font-bold tabular tracking-tight", accentClass)}>
          {value}
        </p>
        {unit && <span className="text-xs text-text-tertiary font-medium">{unit}</span>}
      </div>
    </Card>
  );
}
