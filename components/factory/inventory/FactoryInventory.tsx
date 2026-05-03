"use client";

import { useState, useMemo } from "react";
import { Search, AlertTriangle, Package } from "lucide-react";
import { BrandIcon } from "@/components/brand/BrandIcon";
import {
  factoryStock, factoryStockCounts, categories, levelMeta,
  type FactoryStockItem, type StockLevel,
} from "@/lib/mock/factoryInventory";
import { brandMeta } from "@/lib/mock/branches";
import { useDevice } from "@/hooks/useDevice";
import { cn } from "@/lib/utils";

export function FactoryInventory() {
  const device  = useDevice();
  const [search, setSearch]           = useState("");
  const [catFilter, setCatFilter]     = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<StockLevel | "all">("all");
  const [selected, setSelected]       = useState<FactoryStockItem | null>(factoryStock[0] ?? null);

  const filtered = useMemo(() => {
    return factoryStock.filter((i) => {
      if (catFilter   !== "all" && i.category !== catFilter)   return false;
      if (levelFilter !== "all" && i.level    !== levelFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, catFilter, levelFilter]);

  const liveSelected = selected
    ? factoryStock.find((i) => i.id === selected.id) ?? selected
    : null;

  const listPanel = (compact = false) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn("border-b border-border-subtle space-y-3", compact ? "p-3" : "p-4")}>
        <div>
          <h1 className={cn("font-bold tracking-tight", compact ? "text-sm" : "text-base")}>مخزون المصنع</h1>
          <p className="text-xs text-text-tertiary mt-0.5">
            {factoryStockCounts.total} صنف
            {factoryStockCounts.critical > 0 && <span className="text-status-danger font-medium"> · {factoryStockCounts.critical} حرج</span>}
            {factoryStockCounts.out      > 0 && <span className="text-status-danger font-medium"> · {factoryStockCounts.out} نفد</span>}
            {factoryStockCounts.expiring > 0 && <span className="text-status-warning font-medium"> · {factoryStockCounts.expiring} قارب الانتهاء</span>}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن صنف..."
            className="w-full h-9 pr-9 pl-3 text-sm rounded-lg bg-bg-surface-raised border border-border-subtle placeholder:text-text-tertiary text-text-primary focus:outline-none focus:border-border-focus transition-colors duration-fast"
          />
        </div>

        {/* Level filter chips */}
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "critical", "low", "out"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevelFilter(l)}
              className={cn(
                "text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all duration-fast",
                levelFilter === l
                  ? l === "all"
                    ? "bg-brand-primary/10 border-brand-primary/50 text-brand-primary"
                    : `${levelMeta[l].bg} ${levelMeta[l].color}`
                  : "border-border-subtle text-text-secondary hover:bg-bg-surface-raised"
              )}
            >
              {l === "all" ? "الكل" : levelMeta[l].label}
              {l !== "all" && factoryStockCounts[l] > 0 && (
                <span className="mr-1 font-bold">{factoryStockCounts[l]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-1 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => setCatFilter("all")}
            className={cn("shrink-0 text-[11px] px-2.5 py-1 rounded-lg border transition-colors duration-fast",
              catFilter === "all" ? "bg-brand-primary/10 border-brand-primary/50 text-brand-primary" : "border-border-subtle text-text-secondary hover:bg-bg-surface-raised"
            )}
          >الكل</button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCatFilter(c)}
              className={cn("shrink-0 text-[11px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors duration-fast",
                catFilter === c ? "bg-brand-primary/10 border-brand-primary/50 text-brand-primary" : "border-border-subtle text-text-secondary hover:bg-bg-surface-raised"
              )}
            >{c}</button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {filtered.map((item) => (
          <StockRow
            key={item.id}
            item={item}
            selected={selected?.id === item.id}
            onClick={() => setSelected(item)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-sm text-text-secondary">لا توجد أصناف</p>
          </div>
        )}
      </div>
    </div>
  );

  const detailPanel = () => liveSelected ? (
    <StockItemDetail item={liveSelected} onClose={device === "mobile" ? () => setSelected(null) : undefined} />
  ) : (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <Package className="w-10 h-10 text-text-tertiary mb-3" strokeWidth={1.5} />
      <p className="text-sm text-text-secondary">اختر صنفاً لعرض التفاصيل</p>
    </div>
  );

  if (device === "mobile") {
    return (
      <div className="relative h-[calc(100vh-56px)] overflow-hidden">
        <div className={cn("absolute inset-0 transition-transform duration-300 ease-out-expo", selected ? "-translate-x-full" : "translate-x-0")}>
          {listPanel(true)}
        </div>
        <div className={cn("absolute inset-0 bg-bg-surface transition-transform duration-300 ease-out-expo", selected ? "translate-x-0" : "translate-x-full")}>
          {detailPanel()}
        </div>
      </div>
    );
  }

  if (device === "tablet") {
    return (
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-[45%] border-l border-border-subtle bg-bg-canvas">{listPanel(true)}</div>
        <div className="flex-1 min-w-0 bg-bg-surface">{detailPanel()}</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="w-[400px] xl:w-[440px] border-l border-border-subtle shrink-0 bg-bg-canvas">{listPanel()}</div>
      <div className="flex-1 min-w-0 bg-bg-surface">{detailPanel()}</div>
    </div>
  );
}

// ─── Stock row ────────────────────────────────────────────────────────────────

function StockRow({ item, selected, onClick }: { item: FactoryStockItem; selected: boolean; onClick: () => void }) {
  const meta  = levelMeta[item.level];
  const brand = item.brand !== "shared" ? brandMeta[item.brand] : null;
  const pct   = Math.min(100, Math.round((item.currentQty / item.maxQty) * 100));

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-right rounded-xl border px-3 py-2.5 transition-all duration-fast",
        "hover:border-border-strong hover:bg-bg-surface-raised focus-visible:outline-none",
        selected ? "border-brand-primary bg-brand-primary/6" : "border-border-subtle bg-bg-surface"
      )}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {item.brand !== "shared" && <BrandIcon brandId={item.brand} size="xs" />}
            <p className="text-xs font-medium text-text-primary truncate">{item.name}</p>
          </div>
          <p className="text-[10px] text-text-tertiary">{item.location} · {item.sku}</p>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span className="text-sm font-bold tabular text-text-primary">{item.currentQty}</span>
          <span className="text-[10px] text-text-tertiary">{item.unit}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-bg-surface-raised overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-normal",
              item.level === "good"     && "bg-status-success",
              item.level === "low"      && "bg-status-warning",
              item.level === "critical" && "bg-status-danger",
              item.level === "out"      && "bg-status-danger",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={cn("text-[10px] font-medium", meta.color)}>{meta.label}</span>
        {item.daysToExpiry !== undefined && item.daysToExpiry <= 5 && (
          <AlertTriangle className="w-3 h-3 text-status-warning" strokeWidth={2} />
        )}
      </div>
    </button>
  );
}

// ─── Stock item detail ────────────────────────────────────────────────────────

function StockItemDetail({ item, onClose }: { item: FactoryStockItem; onClose?: () => void }) {
  const meta  = levelMeta[item.level];
  const brand = item.brand !== "shared" ? brandMeta[item.brand] : null;
  const pct   = Math.min(100, Math.round((item.currentQty / item.maxQty) * 100));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border-subtle">
        {onClose && (
          <button type="button" onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors">
            <Search className="w-4 h-4 rotate-0" strokeWidth={1.75} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {item.brand !== "shared" && <BrandIcon brandId={item.brand} size="xs" />}
            <span className="text-[11px] text-text-tertiary font-mono">{item.sku}</span>
          </div>
          <h2 className="text-sm font-bold tracking-tight">{item.name}</h2>
          <p className="text-[11px] text-text-tertiary">{item.category} · {item.location}</p>
        </div>
        <span className={cn("text-[11px] font-medium px-2.5 py-0.5 rounded-full border", meta.color, meta.bg)}>
          {meta.label}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Qty cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "الحالي",   value: item.currentQty, color: meta.color },
            { label: "الأدنى",   value: item.minQty,     color: "text-text-secondary" },
            { label: "الأقصى",   value: item.maxQty,     color: "text-text-secondary" },
          ].map((c) => (
            <div key={c.label} className="rounded-lg bg-bg-surface-raised border border-border-subtle p-2.5 text-center">
              <p className="text-[10px] text-text-tertiary mb-1">{c.label}</p>
              <p className={cn("text-xl font-bold tabular", c.color)}>{c.value}</p>
              <p className="text-[10px] text-text-tertiary">{item.unit}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-text-tertiary">مستوى المخزون</span>
            <span className="text-xs font-medium">{pct}%</span>
          </div>
          <div className="h-3 rounded-full bg-bg-surface-raised overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-normal",
                item.level === "good" && "bg-status-success",
                (item.level === "low" || item.level === "critical") && "bg-status-warning",
                item.level === "out" && "bg-status-danger",
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Expiry */}
        {item.expiryDate && (
          <div className={cn(
            "flex items-center gap-2 px-3 py-2.5 rounded-xl border",
            (item.daysToExpiry ?? 99) <= 3
              ? "bg-status-danger/8 border-status-danger/30"
              : (item.daysToExpiry ?? 99) <= 7
              ? "bg-status-warning/8 border-status-warning/30"
              : "bg-bg-surface-raised border-border-subtle"
          )}>
            <AlertTriangle className={cn("w-4 h-4 shrink-0",
              (item.daysToExpiry ?? 99) <= 3 ? "text-status-danger" : "text-status-warning"
            )} strokeWidth={1.75} />
            <div>
              <p className="text-xs font-medium">تاريخ الانتهاء: {item.expiryDate}</p>
              <p className="text-[11px] text-text-tertiary">
                {item.daysToExpiry !== undefined && item.daysToExpiry <= 7
                  ? `ينتهي خلال ${item.daysToExpiry} أيام`
                  : "ضمن المدة المقبولة"
                }
              </p>
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="space-y-2">
          <p className="text-[10px] text-text-tertiary uppercase tracking-wide">معلومات</p>
          {[
            { label: "الفئة",         value: item.category },
            { label: "الموقع",        value: item.location },
            { label: "البراند",       value: brand?.name ?? "مشترك" },
            { label: "السعر للوحدة",  value: `${item.pricePerUnit} ج.م / ${item.unit}` },
            { label: "آخر تحديث",     value: item.lastUpdated },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between py-1.5 border-b border-border-subtle last:border-0">
              <span className="text-xs text-text-tertiary">{r.label}</span>
              <span className="text-xs font-medium text-text-primary">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
