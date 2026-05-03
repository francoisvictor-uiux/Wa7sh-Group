"use client";

import { useState } from "react";
import { ShoppingBag, Trash2, ArrowLeft, Zap, BookmarkPlus, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { catalog, type CatalogItem } from "@/lib/mock/requests";
import { cn } from "@/lib/utils";

interface BasketPanelProps {
  selected: Map<string, number>;
  onUpdate: (catalogId: string, quantity: number) => void;
  onRemove: (catalogId: string) => void;
  onSubmit: () => void;
  onSaveTemplate?: (name: string) => void;
  variant?: "panel" | "drawer";
  priority: "normal" | "rush";
  onPriorityChange: (p: "normal" | "rush") => void;
  note: string;
  onNoteChange: (n: string) => void;
  className?: string;
}

export function BasketPanel({
  selected,
  onUpdate,
  onRemove,
  onSubmit,
  onSaveTemplate,
  variant = "panel",
  priority,
  onPriorityChange,
  note,
  onNoteChange,
  className,
}: BasketPanelProps) {
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const items = Array.from(selected.entries())
    .map(([id, q]) => ({
      item: catalog.find((c) => c.id === id) as CatalogItem,
      quantity: q,
    }))
    .filter((x) => x.item);

  const totalQty = items.reduce((sum, x) => sum + x.quantity, 0);

  return (
    <div className={cn("flex flex-col h-full min-h-0 bg-bg-surface", className)}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-brand-primary/12 text-brand-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-medium tracking-tight">سلة الطلب</p>
              <p className="text-[11px] text-text-tertiary">
                {items.length} صنف · {totalQty} وحدة
              </p>
            </div>
          </div>
          {priority === "rush" && (
            <Badge intent="danger" size="sm">
              <Zap className="w-3 h-3" strokeWidth={2.5} />
              طارئ
            </Badge>
          )}
        </div>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-6 h-full">
            <div className="w-14 h-14 rounded-full bg-bg-surface-raised flex items-center justify-center mb-3">
              <ShoppingBag
                className="w-6 h-6 text-text-tertiary"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-sm font-medium tracking-tight">السلة فارغة</p>
            <p className="text-xs text-text-tertiary mt-1.5 leading-relaxed max-w-[240px]">
              اختر أصناف من الكتالوج، أو ابدأ من قالب طلب سابق
            </p>
          </div>
        ) : (
          <ul className="py-1">
            {items.map(({ item, quantity }) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.id}
                  className="px-5 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-md bg-bg-surface-raised flex items-center justify-center">
                      <Icon
                        className="w-4 h-4 text-brand-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium tracking-tight leading-tight line-clamp-2">
                          {item.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => onRemove(item.id)}
                          aria-label="حذف"
                          className="shrink-0 text-text-tertiary hover:text-status-danger transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                        </button>
                      </div>
                      <div className="mt-2">
                        <QuantityStepper
                          value={quantity}
                          onChange={(n) => {
                            if (n === 0) onRemove(item.id);
                            else onUpdate(item.id, n);
                          }}
                          unit={item.unit}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer — meta + submit */}
      {items.length > 0 && (
        <div className="border-t border-border-subtle bg-bg-surface-raised/30">
          <div className="px-5 py-4 space-y-4">
            {/* Priority toggle */}
            <div>
              <p className="text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-2">
                الأولوية
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onPriorityChange("normal")}
                  className={cn(
                    "h-9 rounded-md text-xs font-medium tracking-tight transition-all",
                    "border",
                    priority === "normal"
                      ? "bg-brand-primary/12 text-brand-primary border-brand-primary"
                      : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong"
                  )}
                >
                  عادي
                </button>
                <button
                  type="button"
                  onClick={() => onPriorityChange("rush")}
                  className={cn(
                    "h-9 rounded-md text-xs font-medium tracking-tight transition-all",
                    "border inline-flex items-center justify-center gap-1.5",
                    priority === "rush"
                      ? "bg-status-danger/12 text-status-danger border-status-danger"
                      : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong"
                  )}
                >
                  <Zap className="w-3 h-3" strokeWidth={2.5} />
                  طارئ
                </button>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-2">
                ملاحظة (اختياري)
              </label>
              <textarea
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="مثال: اللي جاي السبت فيه ماتش — متوقعين ضغط"
                rows={2}
                className={cn(
                  "w-full text-xs resize-none rounded-md p-2.5",
                  "bg-bg-surface border border-border-subtle",
                  "focus:outline-none focus:border-brand-primary",
                  "placeholder:text-text-tertiary tracking-tight",
                  "transition-colors duration-fast"
                )}
              />
            </div>
          </div>

          {/* Save as template */}
          {onSaveTemplate && (
            <div className="px-5 pt-4 pb-2">
              {savingTemplate ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="اسم القالب الجديد..."
                    className="flex-1 h-9 px-3 rounded-sm text-xs bg-bg-surface border border-brand-primary/60 focus:border-brand-primary focus:shadow-glow-brand outline-none tracking-tight transition-all duration-fast"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && templateName.trim()) {
                        onSaveTemplate(templateName.trim());
                        setTemplateName("");
                        setSavingTemplate(false);
                      }
                      if (e.key === "Escape") { setSavingTemplate(false); setTemplateName(""); }
                    }}
                  />
                  <button
                    type="button"
                    disabled={!templateName.trim()}
                    onClick={() => { onSaveTemplate(templateName.trim()); setTemplateName(""); setSavingTemplate(false); }}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-sm bg-brand-primary text-text-on-brand disabled:opacity-40 hover:bg-brand-primary-hover transition-colors duration-fast"
                  >
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSavingTemplate(false); setTemplateName(""); }}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-sm border border-border text-text-tertiary hover:text-text-primary hover:border-border-strong transition-colors duration-fast"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSavingTemplate(true)}
                  className="w-full h-9 rounded-sm border border-border-subtle text-xs text-text-secondary font-medium tracking-tight inline-flex items-center justify-center gap-1.5 hover:border-brand-primary/40 hover:text-brand-primary transition-all duration-fast"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" strokeWidth={1.75} />
                  حفظ كقالب جديد
                </button>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="px-5 py-4 border-t border-border-subtle bg-bg-surface">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <p className="text-xs text-text-tertiary tracking-tight">الإجمالي</p>
              <p className="text-2xl font-bold tabular tracking-tight">
                {items.length}
                <span className="text-xs text-text-tertiary font-normal mr-1">صنف</span>
                <span className="text-text-tertiary font-normal mx-1">·</span>
                {totalQty}
                <span className="text-xs text-text-tertiary font-normal mr-1">وحدة</span>
              </p>
            </div>
            <Button onClick={onSubmit} size="lg" fullWidth>
              أرسل للموافقة
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            </Button>
            <p className="text-[10px] text-text-tertiary text-center mt-2">
              سيُرسل الطلب مباشرة لمدير المصنع للمراجعة
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
