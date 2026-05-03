"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { catalog, categoryMeta, type Category, type CatalogItem } from "@/lib/mock/requests";
import { cn } from "@/lib/utils";

interface CatalogGridProps {
  selected: Map<string, number>;
  onAdd: (item: CatalogItem) => void;
  onUpdate: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  density?: "compact" | "comfortable";
  showCategories?: boolean;
}

const categories: Array<Category | "all"> = [
  "all", "lhom", "dawajen", "albaan", "khodar", "dakik", "moshtaqat", "mashroob",
];

export function CatalogGrid({
  selected,
  onAdd,
  onUpdate,
  onRemove,
  density = "comfortable",
  showCategories = true,
}: CatalogGridProps) {
  const [active, setActive] = useState<Category | "all">("all");
  const filtered = active === "all" ? catalog : catalog.filter((c) => c.category === active);

  return (
    <div className="flex flex-col h-full min-h-0">
      {showCategories && (
        <div className="border-b border-border-subtle bg-bg-canvas/40 px-3 py-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((c) => {
              const isActive = active === c;
              const isAll = c === "all";
              const meta = !isAll ? categoryMeta[c] : null;
              const Icon = meta?.icon;
              const count = isAll ? catalog.length : catalog.filter((it) => it.category === c).length;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActive(c)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full",
                    "text-xs font-medium tracking-tight transition-all duration-fast border",
                    isActive
                      ? "bg-brand-primary text-text-on-brand border-brand-primary"
                      : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong"
                  )}
                >
                  {Icon && <Icon className="w-3 h-3" strokeWidth={2} />}
                  <span>{isAll ? "كل الأصناف" : meta!.label}</span>
                  <span className={cn("tabular text-[10px] font-bold", isActive ? "opacity-90" : "text-text-tertiary")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3">
        <div className={cn(
          "grid gap-3",
          density === "compact"
            ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-2 lg:grid-cols-3"
        )}>
          {filtered.map((item) => (
            <CatalogTile
              key={item.id}
              item={item}
              quantity={selected.get(item.id) ?? 0}
              onAdd={() => onAdd(item)}
              onIncrease={() => onUpdate(item.id, (selected.get(item.id) ?? 0) + 1)}
              onDecrease={() => {
                const q = (selected.get(item.id) ?? 0) - 1;
                if (q <= 0) onRemove(item.id);
                else onUpdate(item.id, q);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Catalog tile with inline +/- stepper ──────────────────────────────────── */

function CatalogTile({
  item, quantity, onAdd, onIncrease, onDecrease,
}: {
  item: CatalogItem;
  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const Icon = item.icon;
  const inBasket = quantity > 0;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-md border overflow-hidden",
        "bg-bg-surface transition-all duration-fast ease-out-expo",
        inBasket
          ? "border-brand-primary shadow-md"
          : "border-border-subtle hover:border-border-strong hover:shadow-sm"
      )}
    >
      {item.popular && !inBasket && (
        <span className="absolute top-2 right-2 z-10 text-[9px] tracking-[0.16em] uppercase text-brand-primary font-bold">
          شائع
        </span>
      )}

      {/* Image area */}
      <div className="h-20 sm:h-24 flex items-center justify-center relative bg-gradient-to-br from-bg-surface-raised/60 to-bg-surface-raised">
        <Icon
          className={cn("w-9 h-9 transition-colors duration-fast", inBasket ? "text-brand-primary" : "text-text-tertiary")}
          strokeWidth={1.5}
        />
        <span aria-hidden className="absolute inset-0 opacity-30 bg-gradient-to-t from-bg-surface to-transparent" />
      </div>

      {/* Info */}
      <div className="px-2.5 pt-2.5 pb-2 flex flex-col gap-1 flex-1">
        <p className="text-[12px] font-medium tracking-tight leading-tight line-clamp-2 min-h-[28px]">
          {item.name}
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-text-tertiary tabular tracking-tight">{item.sku}</span>
          <span className="text-[10px] text-text-tertiary tabular tracking-tight">/{item.unit}</span>
        </div>
      </div>

      {/* +/- stepper or Add button */}
      <div className="px-2.5 pb-2.5">
        {inBasket ? (
          <div className="flex items-center justify-center gap-1.5 py-1">
            <button
              type="button"
              onClick={onDecrease}
              aria-label="تقليل"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-status-danger text-white shadow-sm hover:bg-status-danger/85 active:scale-90 transition-all duration-fast"
            >
              <Minus className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <span className="w-10 text-center text-base font-bold tabular text-brand-primary leading-none">
              {quantity}
              <span className="text-[10px] font-normal text-text-tertiary block mt-0.5">{item.unit}</span>
            </span>
            <button
              type="button"
              onClick={onIncrease}
              aria-label="زيادة"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-status-success text-white shadow-sm hover:bg-status-success/85 active:scale-90 transition-all duration-fast"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="w-full h-8 rounded-md bg-bg-surface-raised hover:bg-brand-primary/10 hover:text-brand-primary border border-border-subtle hover:border-brand-primary/40 text-text-secondary text-[11px] font-medium tracking-tight inline-flex items-center justify-center gap-1.5 transition-all duration-fast active:scale-[0.97]"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            أضف
          </button>
        )}
      </div>
    </div>
  );
}
