"use client";

import { useState, useMemo, useEffect, useDeferredValue } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  LayoutGrid,
  Rows3,
  SlidersHorizontal,
  X,
  Package,
  AlertTriangle,
  ClockAlert,
  PackageX,
  Boxes,
  RotateCw,
  ChevronUp,
  Eye,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import {
  factoryStock,
  factoryStockCounts,
  categories,
  levelMeta,
  type FactoryStockItem,
  type StockLevel,
} from "@/lib/mock/factoryInventory";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Highlight } from "@/components/suppliers/SupplierHighlight";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "table";
type LevelFilter = StockLevel | "all" | "expiring";
type SortKey = "name" | "qty" | "expiry" | "level" | "value";
type SortDir = "asc" | "desc";

const ALL_LEVELS: StockLevel[] = ["good", "low", "critical", "out"];

export function Inventory() {
  const device = useDevice();
  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";

  const [ready, setReady] = useState(false);
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [categoryFilters, setCategoryFilters] = useState<Set<string>>(new Set());
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 280);
    return () => clearTimeout(t);
  }, []);

  /* ---------- filtering ---------- */
  const filtered = useMemo(() => {
    let list = factoryStock;
    const q = deferredSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((i) =>
        i.name.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
      );
    }
    if (levelFilter === "expiring") {
      list = list.filter((i) => (i.daysToExpiry ?? 99) <= 5);
    } else if (levelFilter !== "all") {
      list = list.filter((i) => i.level === levelFilter);
    }
    if (categoryFilters.size > 0) {
      list = list.filter((i) => categoryFilters.has(i.category));
    }
    return list;
  }, [deferredSearch, levelFilter, categoryFilters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    const levelOrder: Record<StockLevel, number> = { out: 0, critical: 1, low: 2, good: 3 };
    list.sort((a, b) => {
      switch (sortKey) {
        case "qty": return (a.currentQty - b.currentQty) * dir;
        case "expiry": return ((a.daysToExpiry ?? 999) - (b.daysToExpiry ?? 999)) * dir;
        case "level": return (levelOrder[a.level] - levelOrder[b.level]) * dir;
        case "value": return (a.currentQty * a.pricePerUnit - b.currentQty * b.pricePerUnit) * dir;
        case "name":
        default: return a.name.localeCompare(b.name, "ar") * dir;
      }
    });
    return list;
  }, [filtered, sortKey, sortDir]);

  function toggleSet<T>(set: Set<T>, value: T): Set<T> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value); else next.add(value);
    return next;
  }
  function clearAll() {
    setLevelFilter("all");
    setCategoryFilters(new Set());
    setSearch("");
  }
  function setSort(key: SortKey) {
    if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const activeCount =
    (levelFilter !== "all" ? 1 : 0) + categoryFilters.size;

  return (
    <div
      className={cn(
        "mx-auto",
        isMobile ? "px-4 pt-4 pb-20 space-y-4" : isDesktop ? "px-8 py-7 max-w-[1600px] space-y-6" : "px-6 py-6 max-w-[1280px] space-y-5"
      )}
    >
      <header className="flex items-end gap-4 flex-wrap justify-between">
        <div>
          <p className={cn("text-text-tertiary tracking-[0.18em] uppercase mb-1", isMobile ? "text-[10px]" : "text-xs")}>
            INVENTORY · مخزون المصنع
          </p>
          <h1 className={cn("font-bold tracking-tight", isDesktop ? "text-3xl" : isMobile ? "text-xl" : "text-2xl")}>
            المخزون
          </h1>
          <p className={cn("text-text-tertiary mt-1", isMobile ? "text-xs" : "text-sm")}>
            {factoryStockCounts.total} صنف · {factoryStockCounts.low + factoryStockCounts.critical} يحتاج اهتمام · {factoryStockCounts.expiring} قارب الانتهاء
          </p>
        </div>
        {!isMobile && (
          <Link
            href="/inventory/new"
            className={cn(
              "inline-flex items-center gap-2 h-12 px-5 rounded-md text-base font-medium tracking-tight",
              "bg-brand-primary text-text-on-brand shadow-sm",
              "hover:bg-brand-primary-hover hover:shadow-md active:scale-[0.985]",
              "transition-all duration-fast ease-out-expo"
            )}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            صنف جديد
          </Link>
        )}
      </header>

      {!isMobile && (
        <>
          <div className="gold-hairline" />
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiTile icon={Boxes} label="إجمالي الأصناف" value={factoryStockCounts.total} tone="neutral" hint="في المخزن" />
            <KpiTile icon={Package} label="متوفر" value={factoryStockCounts.good} tone="success" hint="مخزون كافي" />
            <KpiTile icon={AlertTriangle} label="منخفض" value={factoryStockCounts.low} tone="warning" hint="تحت الحد الأدنى" />
            <KpiTile icon={PackageX} label="حرج / نفد" value={factoryStockCounts.critical + factoryStockCounts.out} tone="danger" hint="إعادة طلب فوراً" />
          </section>
        </>
      )}

      {/* TOOLBAR */}
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
          {!isMobile && <ViewToggle value={view} onChange={(v) => { setView(v); if (v === "grid") setSelected(new Set()); }} />}
        </div>
        {isMobile && (
          <Link
            href="/inventory/new"
            className="inline-flex items-center justify-center gap-2 h-12 rounded-sm bg-brand-primary text-text-on-brand text-sm font-medium tracking-tight active:scale-[0.985] transition-transform"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            صنف جديد
          </Link>
        )}
      </div>

      {/* QUICK CHIPS */}
      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="flex items-center gap-2 min-w-max px-1">
          <Chip active={levelFilter === "all"} tone="neutral" onClick={() => setLevelFilter("all")}>
            الكل ({factoryStockCounts.total})
          </Chip>
          <Chip active={levelFilter === "good"} tone="success" onClick={() => setLevelFilter(levelFilter === "good" ? "all" : "good")}>
            متوفر ({factoryStockCounts.good})
          </Chip>
          <Chip active={levelFilter === "low"} tone="warning" onClick={() => setLevelFilter(levelFilter === "low" ? "all" : "low")}>
            منخفض ({factoryStockCounts.low})
          </Chip>
          <Chip active={levelFilter === "critical"} tone="danger" onClick={() => setLevelFilter(levelFilter === "critical" ? "all" : "critical")}>
            حرج ({factoryStockCounts.critical})
          </Chip>
          <Chip active={levelFilter === "out"} tone="danger" onClick={() => setLevelFilter(levelFilter === "out" ? "all" : "out")}>
            نفد ({factoryStockCounts.out})
          </Chip>
          <span className="w-px h-5 bg-border-subtle mx-1" />
          <Chip active={levelFilter === "expiring"} tone="warning" onClick={() => setLevelFilter(levelFilter === "expiring" ? "all" : "expiring")}>
            قارب على الانتهاء ({factoryStockCounts.expiring})
          </Chip>
        </div>
      </div>

      {advancedOpen && (
        <Card padding="lg" className="animate-slide-up">
          <div className="grid gap-6 md:grid-cols-2">
            <FilterGroup label="الفئات">
              <div className="flex items-center gap-1.5 flex-wrap">
                {categories.map((c) => (
                  <Chip
                    key={c}
                    active={categoryFilters.has(c)}
                    tone="brand"
                    onClick={() => setCategoryFilters(toggleSet(categoryFilters, c))}
                  >
                    {c}
                  </Chip>
                ))}
              </div>
            </FilterGroup>
            <FilterGroup label="المستوى">
              <div className="flex items-center gap-1.5 flex-wrap">
                {ALL_LEVELS.map((lv) => {
                  const meta = levelMeta[lv];
                  return (
                    <Chip
                      key={lv}
                      active={levelFilter === lv}
                      tone={lv === "good" ? "success" : lv === "low" ? "warning" : "danger"}
                      onClick={() => setLevelFilter(levelFilter === lv ? "all" : lv)}
                    >
                      {meta.label}
                    </Chip>
                  );
                })}
              </div>
            </FilterGroup>
          </div>
        </Card>
      )}

      {activeCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] uppercase tracking-[0.16em] text-text-tertiary me-1">مفعّل:</span>
          {levelFilter !== "all" && (
            <RemovableChip onRemove={() => setLevelFilter("all")}>
              {levelFilter === "expiring" ? "قارب على الانتهاء" : levelMeta[levelFilter as StockLevel].label}
            </RemovableChip>
          )}
          {[...categoryFilters].map(c => (
            <RemovableChip key={`cat-${c}`} onRemove={() => setCategoryFilters(toggleSet(categoryFilters, c))}>
              {c}
            </RemovableChip>
          ))}
          <button onClick={clearAll} className="text-xs text-text-tertiary hover:text-status-danger transition-colors duration-fast underline-offset-4 hover:underline">
            مسح الكل
          </button>
        </div>
      )}

      {!ready ? (
        <LoadingState view={view} isMobile={isMobile} />
      ) : sorted.length === 0 ? (
        <EmptyState onClear={clearAll} hasFilters={activeCount > 0 || !!search.trim()} />
      ) : (
        <div className="animate-fade-in">
          {view === "grid" || isMobile ? (
            <GridView items={sorted} query={deferredSearch} isMobile={isMobile} isDesktop={isDesktop} />
          ) : (
            <TableView
              items={sorted}
              query={deferredSearch}
              sortKey={sortKey}
              sortDir={sortDir}
              setSort={setSort}
            />
          )}
        </div>
      )}

      {isMobile && (
        <Link
          href="/inventory/new"
          className="fixed bottom-[88px] left-4 z-20 w-14 h-14 rounded-full bg-brand-primary text-text-on-brand shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          aria-label="صنف جديد"
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </Link>
      )}
    </div>
  );
}

/* ======================================================================
 * SearchBox / ViewToggle / Chip / FilterGroup / RemovableChip
 * ==================================================================== */

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative flex items-center h-12 flex-1 min-w-[240px] rounded-sm bg-bg-surface border border-border focus-within:border-border-focus focus-within:shadow-glow-brand transition-all duration-fast">
      <Search className="absolute right-4 w-4 h-4 text-text-tertiary pointer-events-none" strokeWidth={1.75} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ابحث بالاسم، SKU، الفئة، أو المكان..."
        className="w-full h-full bg-transparent outline-none px-12 text-base text-text-primary placeholder:text-text-tertiary"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute left-3 inline-flex items-center justify-center w-6 h-6 rounded-full text-text-tertiary hover:text-text-primary transition-colors duration-fast"
          aria-label="مسح"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="inline-flex items-center h-10 p-0.5 rounded-sm bg-bg-surface border border-border">
      <ToggleBtn active={value === "grid"} onClick={() => onChange("grid")} label="شبكة" Icon={LayoutGrid} />
      <ToggleBtn active={value === "table"} onClick={() => onChange("table")} label="جدول" Icon={Rows3} />
    </div>
  );
}

function ToggleBtn({ active, onClick, label, Icon }: { active: boolean; onClick: () => void; label: string; Icon: LucideIcon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-[10px] text-xs font-medium tracking-tight transition-all duration-fast",
        active ? "bg-bg-surface-raised text-text-primary shadow-xs" : "text-text-tertiary hover:text-text-secondary"
      )}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function Chip({
  active, tone, onClick, children,
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
        active ? activeBg[tone] : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary"
      )}
    >
      {children}
    </button>
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
        aria-label="إزالة"
      >
        <X className="w-2.5 h-2.5" strokeWidth={2.5} />
      </button>
    </span>
  );
}

/* ======================================================================
 * KPI tile
 * ==================================================================== */

function KpiTile({
  icon: Icon, label, value, tone, hint,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  tone: "neutral" | "success" | "warning" | "danger";
  hint?: string;
}) {
  const toneText = {
    neutral: "text-text-primary",
    success: "text-status-success",
    warning: "text-status-warning",
    danger: "text-status-danger",
  }[tone];
  const toneBg = {
    neutral: "bg-bg-surface-raised text-text-secondary",
    success: "bg-status-success/15 text-status-success",
    warning: "bg-status-warning/15 text-status-warning",
    danger: "bg-status-danger/15 text-status-danger",
  }[tone];
  return (
    <Card padding="md" className="min-w-0">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[10px] text-text-tertiary tracking-[0.18em] uppercase font-semibold truncate">{label}</p>
        <div className={cn("w-8 h-8 rounded-sm flex items-center justify-center", toneBg)}>
          <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
        </div>
      </div>
      <p className={cn("text-3xl font-bold tabular tracking-tight leading-none", toneText)}>{value}</p>
      {hint && <p className="text-[11px] text-text-tertiary mt-1.5 truncate">{hint}</p>}
    </Card>
  );
}

/* ======================================================================
 * Grid view + ItemCard
 * ==================================================================== */

function GridView({
  items, query, isMobile, isDesktop,
}: {
  items: FactoryStockItem[];
  query: string;
  isMobile: boolean;
  isDesktop: boolean;
}) {
  return (
    <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : isDesktop ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 md:grid-cols-2")}>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} query={query} />
      ))}
    </div>
  );
}

function ItemCard({ item, query }: { item: FactoryStockItem; query: string }) {
  const meta = levelMeta[item.level];
  const fillPct = Math.max(2, Math.min(100, (item.currentQty / item.maxQty) * 100));
  const minPct = (item.minQty / item.maxQty) * 100;
  const expiringSoon = (item.daysToExpiry ?? 99) <= 5;

  return (
    <Card padding="md" className="h-full flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div
          className={cn(
            "shrink-0 w-12 h-12 rounded-md flex items-center justify-center",
            item.level === "good" ? "bg-status-success/12 text-status-success"
            : item.level === "low" ? "bg-status-warning/12 text-status-warning"
            : "bg-status-danger/12 text-status-danger"
          )}
        >
          <Package className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold tracking-tight leading-tight truncate">
            <Highlight text={item.name} query={query} />
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-text-tertiary tabular tracking-tight truncate">
              <Highlight text={item.sku} query={query} />
            </span>
            <span className="text-text-tertiary">·</span>
            <span className="text-[11px] text-text-secondary truncate">
              <Highlight text={item.category} query={query} />
            </span>
          </div>
        </div>
        <Badge intent={item.level === "good" ? "success" : item.level === "low" ? "warning" : "danger"} size="sm">
          {meta.label}
        </Badge>
      </div>

      <div className="pt-3 border-t border-border-subtle">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-text-tertiary tracking-[0.14em] uppercase">المخزون</span>
          <span className="text-sm tabular">
            <span className={cn("font-bold", item.level === "good" ? "text-status-success" : item.level === "low" ? "text-status-warning" : "text-status-danger")}>
              {item.currentQty}
            </span>
            <span className="text-text-tertiary"> / {item.maxQty} {item.unit}</span>
          </span>
        </div>
        <div className="relative h-2 rounded-full bg-bg-muted overflow-hidden">
          <span aria-hidden className="absolute top-0 bottom-0 w-px bg-text-tertiary/40" style={{ right: `${minPct}%` }} />
          <span
            className={cn(
              "absolute top-0 bottom-0 right-0 rounded-full transition-all duration-slow ease-out-expo",
              item.level === "good" ? "bg-status-success/80" : item.level === "low" ? "bg-status-warning/80" : "bg-status-danger/80"
            )}
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3 mt-3 border-t border-border-subtle text-[11px] text-text-tertiary">
        {item.expiryDate ? (
          <span className={cn("inline-flex items-center gap-1 tabular shrink-0", expiringSoon && "text-status-warning font-medium")}>
            <ClockAlert className="w-3 h-3" strokeWidth={1.75} />
            {item.daysToExpiry} يوم
          </span>
        ) : <span className="flex-1" />}
        <span className="shrink-0 tabular ms-auto">{item.lastUpdated}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-border-subtle">
        <Link
          href={`/inventory/${item.id}`}
          className="inline-flex items-center justify-center gap-1.5 h-9 rounded-sm border border-border-default bg-bg-surface text-sm font-medium text-text-primary hover:border-border-strong hover:bg-bg-surface-raised transition-colors duration-fast"
        >
          <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
          عرض
        </Link>
        <Link
          href={`/inventory/${item.id}/edit`}
          className="inline-flex items-center justify-center gap-1.5 h-9 rounded-sm border border-brand-primary/40 bg-brand-primary/8 text-sm font-medium text-brand-primary hover:bg-brand-primary/15 hover:border-brand-primary/60 transition-colors duration-fast"
        >
          <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
          تعديل
        </Link>
      </div>
    </Card>
  );
}

/* ======================================================================
 * Table view
 * ==================================================================== */

function TableView({
  items, query, sortKey, sortDir, setSort,
}: {
  items: FactoryStockItem[];
  query: string;
  sortKey: SortKey;
  sortDir: SortDir;
  setSort: (key: SortKey) => void;
}) {
  const cols: Array<{ key: SortKey | "actions" | "category" | "location"; label: string; sortable?: boolean; align?: "start" | "end" | "center"; width?: string }> = [
    { key: "name", label: "الصنف", sortable: true },
    { key: "category", label: "الفئة" },
    { key: "qty", label: "الكمية", sortable: true, align: "center", width: "120px" },
    { key: "level", label: "المستوى", sortable: true, align: "center", width: "100px" },
    { key: "expiry", label: "الصلاحية", sortable: true, align: "center", width: "112px" },
    { key: "location", label: "الموقع", width: "140px" },
    { key: "value", label: "القيمة", sortable: true, align: "end", width: "120px" },
    { key: "actions", label: "", align: "end", width: "112px" },
  ];

  return (
    <div className="rounded-md border border-border-subtle bg-bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm tabular">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-muted/40 sticky top-0 z-10 backdrop-blur">
              {cols.map((c) => {
                const active = c.sortable && sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    style={{ width: c.width }}
                    className={cn(
                      "h-11 px-3 text-[11px] font-medium tracking-[0.14em] uppercase text-text-tertiary",
                      c.align === "end" && "text-left",
                      c.align === "center" && "text-center",
                      !c.align && "text-right",
                      c.sortable && "cursor-pointer hover:text-text-secondary transition-colors duration-fast"
                    )}
                    onClick={c.sortable ? () => setSort(c.key as SortKey) : undefined}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {c.label}
                      {c.sortable && (
                        <ChevronUp
                          className={cn(
                            "w-3 h-3 transition-all duration-fast",
                            active ? "text-brand-primary opacity-100" : "opacity-30",
                            active && sortDir === "desc" && "rotate-180"
                          )}
                          strokeWidth={2.5}
                        />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ItemRow key={item.id} item={item} query={query} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ItemRow({ item, query }: { item: FactoryStockItem; query: string }) {
  const meta = levelMeta[item.level];
  const expiringSoon = (item.daysToExpiry ?? 99) <= 5;
  return (
    <tr
      className={cn(
        "group relative border-b border-border-subtle transition-shadow duration-fast",
        "hover:[box-shadow:inset_3px_0_0_0_var(--brand-primary)]"
      )}
    >
      <td className="px-3 py-3 align-middle">
        <Link href={`/inventory/${item.id}`} className="flex items-center gap-3 min-w-0">
          <span className={cn(
            "shrink-0 w-9 h-9 rounded-sm flex items-center justify-center",
            item.level === "good" ? "bg-status-success/12 text-status-success"
            : item.level === "low" ? "bg-status-warning/12 text-status-warning"
            : "bg-status-danger/12 text-status-danger"
          )}>
            <Package className="w-4 h-4" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-tight truncate leading-tight">
              <Highlight text={item.name} query={query} />
            </p>
            <p className="text-[11px] text-text-tertiary tabular truncate mt-0.5">
              <Highlight text={item.sku} query={query} />
            </p>
          </div>
        </Link>
      </td>
      <td className="px-3 align-middle"><span className="text-xs text-text-secondary">{item.category}</span></td>
      <td className="px-3 align-middle text-center">
        <span className={cn("text-sm tabular font-medium", item.level === "good" ? "text-status-success" : item.level === "low" ? "text-status-warning" : "text-status-danger")}>
          {item.currentQty}
        </span>
        <span className="text-[10px] text-text-tertiary"> / {item.maxQty}</span>
      </td>
      <td className="px-3 align-middle text-center">
        <Badge intent={item.level === "good" ? "success" : item.level === "low" ? "warning" : "danger"} size="sm">
          {meta.label}
        </Badge>
      </td>
      <td className="px-3 align-middle text-center">
        {item.daysToExpiry !== undefined ? (
          <span className={cn("text-xs tabular inline-flex items-center gap-1", expiringSoon && "text-status-warning font-medium")}>
            <ClockAlert className="w-3 h-3" strokeWidth={1.75} />
            {item.daysToExpiry} يوم
          </span>
        ) : (
          <span className="text-[11px] text-text-tertiary">—</span>
        )}
      </td>
      <td className="px-3 align-middle"><span className="text-xs text-text-secondary truncate">{item.location}</span></td>
      <td className="px-3 align-middle text-left">
        <span className="text-sm font-medium tabular tracking-tight">
          {(item.currentQty * item.pricePerUnit).toLocaleString("en-US")}
        </span>
        <span className="text-[10px] text-text-tertiary"> ج.م</span>
      </td>
      <td className="px-2 align-middle text-left">
        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
          <Link href={`/inventory/${item.id}`} className="inline-flex items-center justify-center w-7 h-7 rounded-sm text-text-tertiary hover:text-text-primary hover:bg-bg-surface-raised transition-all duration-fast" aria-label="عرض" title="عرض">
            <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
          </Link>
          <Link href={`/inventory/${item.id}/edit`} className="inline-flex items-center justify-center w-7 h-7 rounded-sm text-text-tertiary hover:text-text-primary hover:bg-bg-surface-raised transition-all duration-fast" aria-label="تعديل" title="تعديل">
            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
          </Link>
        </div>
      </td>
    </tr>
  );
}

/* ======================================================================
 * Loading + empty states
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
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3")}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} padding="md" className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-md bg-bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded-full bg-bg-muted animate-pulse" />
              <div className="h-3 w-1/2 rounded-full bg-bg-muted/60 animate-pulse" />
            </div>
            <div className="w-14 h-6 rounded-full bg-bg-muted animate-pulse" />
          </div>
          <div className="h-2 w-full rounded-full bg-bg-muted animate-pulse" />
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6 animate-fade-in">
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute inset-0 rounded-full bg-brand-primary/8 animate-pulse-dot" />
        <div className="absolute inset-3 rounded-full bg-brand-primary/12" />
        <div className="absolute inset-6 rounded-full border border-brand-primary/30 flex items-center justify-center">
          <Package className="w-10 h-10 text-brand-primary" strokeWidth={1.25} />
        </div>
      </div>
      <h3 className="text-lg font-bold tracking-tight mb-1">
        {hasFilters ? "لا يوجد صنف يطابق الفلاتر" : "المخزون فارغ"}
      </h3>
      <p className="text-sm text-text-tertiary max-w-sm mb-6">
        {hasFilters ? "جرّب تخفيف معايير البحث أو ابدأ من جديد بمسح الفلاتر." : "ابدأ بإضافة الأصناف ليبدأ النظام بتتبع المخزون."}
      </p>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {hasFilters && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-sm text-sm font-medium tracking-tight bg-bg-surface border border-border hover:border-border-strong text-text-secondary transition-all duration-fast"
          >
            <RotateCw className="w-3.5 h-3.5" strokeWidth={2} />
            مسح الفلاتر
          </button>
        )}
        <Link
          href="/inventory/new"
          className="inline-flex items-center gap-2 h-12 px-5 rounded-md bg-brand-primary text-text-on-brand text-base font-medium tracking-tight hover:bg-brand-primary-hover hover:shadow-md active:scale-[0.985] transition-all duration-fast ease-out-expo"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          إضافة صنف
        </Link>
      </div>
    </div>
  );
}
