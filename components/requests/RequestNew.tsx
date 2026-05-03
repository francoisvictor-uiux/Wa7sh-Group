"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ShoppingBag, X, Zap, BookmarkPlus, Check,
  Trash2, Minus, Plus, ChevronDown,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { useAuth } from "@/hooks/useAuth";
import { useTemplates } from "@/hooks/useTemplates";
import { catalog, type CatalogItem, type Template } from "@/lib/mock/requests";
import { branchMap } from "@/lib/mock/branches";
import { useRequestsDB } from "@/lib/db/requests";
import { CatalogGrid } from "./CatalogGrid";
import { TemplatePicker } from "./TemplatePicker";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function RequestNew() {
  const device = useDevice();
  const router = useRouter();
  const { user } = useAuth();
  const { templates, addTemplate, updateTemplate, removeTemplate } = useTemplates();
  const { createRequest } = useRequestsDB();
  const isMobile = device === "mobile";

  const [phase, setPhase] = useState<"templates" | "catalog">("templates");
  const [selected, setSelected] = useState<Map<string, number>>(new Map());
  const [cartOpen, setCartOpen] = useState(false);
  const [priority, setPriority] = useState<"normal" | "rush">("normal");
  const [note, setNote] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");

  /* ── basket helpers ── */
  const handleAdd = (item: CatalogItem) => {
    setSelected((prev) => { const n = new Map(prev); n.set(item.id, (n.get(item.id) ?? 0) + 1); return n; });
  };
  const handleUpdate = (id: string, q: number) => {
    setSelected((prev) => { const n = new Map(prev); n.set(id, q); return n; });
  };
  const handleRemove = (id: string) => {
    setSelected((prev) => { const n = new Map(prev); n.delete(id); return n; });
  };
  const handlePickTemplate = (tpl: Template) => {
    const next = new Map<string, number>();
    if (tpl.items.length > 0) {
      tpl.items.forEach((i) => next.set(i.catalogId, i.quantity));
    } else {
      catalog.filter((c) => c.popular).slice(0, 6).forEach((c) => next.set(c.id, 4));
    }
    setSelected(next);
    setPhase("catalog");
  };
  const handleSubmit = () => {
    const items = Array.from(selected.entries()).map(([id, requestedQty]) => {
      const catalogItem = catalog.find((c) => c.id === id);
      return {
        catalogId: id,
        name: catalogItem?.name ?? id,
        unit: catalogItem?.unit ?? "",
        requestedQty,
      };
    });
    createRequest({
      brandId: user?.brandId ?? "wahsh",
      branchId: user?.branchId ?? "",
      branchName: user?.branchId ? (branchMap[user.branchId]?.name ?? user.branchId) : "",
      items,
      priority: priority === "rush" ? "urgent" : "normal",
      note: note || undefined,
    });
    router.push("/requests");
  };
  const handleSaveTemplate = (name: string) => {
    addTemplate({
      id: `tpl-${Date.now()}`,
      name,
      description: `${selected.size} صنف · تم الحفظ اليوم`,
      itemCount: selected.size,
      totalValue: 0,
      lastUsed: "الآن",
      items: Array.from(selected.entries()).map(([catalogId, quantity]) => ({ catalogId, quantity })),
    });
    setSavingTemplate(false);
    setTemplateName("");
  };

  const itemCount = selected.size;
  const totalQty = Array.from(selected.values()).reduce((s, q) => s + q, 0);
  const basketItems = Array.from(selected.entries())
    .map(([id, q]) => ({ item: catalog.find((c) => c.id === id) as CatalogItem, quantity: q }))
    .filter((x) => x.item);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] min-h-0">
      {/* Top bar */}
      <header className={cn(
        "border-b border-border-subtle bg-bg-canvas/85 backdrop-blur-md shrink-0",
        isMobile ? "px-4 py-3" : "px-8 py-4"
      )}>
        <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/requests"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
              إلغاء والعودة
            </Link>
            <div className="gold-hairline-vert h-6" />
            <div>
              <p className="text-xs text-text-tertiary tracking-[0.16em] uppercase">طلب جديد</p>
              <h1 className="text-lg font-medium tracking-tight">طلب من المصنع</h1>
            </div>
          </div>
          {phase === "catalog" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setPhase("templates"); setSelected(new Map()); setCartOpen(false); }}
            >
              ابدأ من قالب آخر
            </Button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 min-h-0 relative">
        {phase === "templates" ? (
          <div className="h-full overflow-y-auto">
            <div className={cn("mx-auto", isMobile ? "px-4 py-6" : "px-8 py-8 max-w-[1280px]")}>
              <TemplatePicker
                templates={templates}
                layout={isMobile ? "grid" : "row"}
                onPick={handlePickTemplate}
                onStartBlank={() => setPhase("catalog")}
                onEdit={updateTemplate}
                onDelete={removeTemplate}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Full-width catalog */}
            <CatalogGrid
              selected={selected}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              density={isMobile ? "compact" : "comfortable"}
            />

            {/* Floating cart FAB */}
            <div className={cn(
              "absolute bottom-6 left-1/2 -translate-x-1/2 z-30",
              "transition-all duration-normal ease-out-expo",
              itemCount === 0 && "opacity-0 pointer-events-none translate-y-4"
            )}>
              <button
                type="button"
                onClick={() => setCartOpen((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-3 h-14 px-5 rounded-full shadow-xl",
                  "bg-brand-primary text-text-on-brand",
                  "hover:bg-brand-primary-hover active:scale-[0.97]",
                  "transition-all duration-fast ease-out-expo",
                  "border-2 border-text-on-brand/20"
                )}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" strokeWidth={2} />
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-text-on-brand text-brand-primary text-[10px] font-bold tabular inline-flex items-center justify-center leading-none">
                    {itemCount}
                  </span>
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-sm font-bold tracking-tight">{itemCount} صنف</span>
                  <span className="text-[11px] opacity-80">{totalQty} وحدة إجمالي</span>
                </div>
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform duration-fast", cartOpen && "rotate-180")}
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* Cart sheet overlay */}
            {cartOpen && (
              <>
                {/* Backdrop */}
                <button
                  type="button"
                  aria-label="إغلاق السلة"
                  onClick={() => setCartOpen(false)}
                  className="absolute inset-0 z-20 bg-black/30 backdrop-blur-[2px]"
                />

                {/* Panel */}
                <div
                  className={cn(
                    "absolute z-30 bg-bg-canvas border border-border-subtle shadow-2xl flex flex-col",
                    "animate-slide-up",
                    isMobile
                      ? "inset-x-0 bottom-0 rounded-t-2xl max-h-[82vh]"
                      : "bottom-0 left-6 right-6 md:left-auto md:right-6 md:w-[420px] rounded-t-2xl max-h-[80vh]"
                  )}
                  style={{ animationDuration: "280ms" }}
                >
                  {/* Handle / header */}
                  <div className="px-5 pt-4 pb-3 border-b border-border-subtle flex items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-brand-primary/12 text-brand-primary flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-sm font-bold tracking-tight">سلة الطلب</p>
                        <p className="text-[11px] text-text-tertiary">{itemCount} صنف · {totalQty} وحدة</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCartOpen(false)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-text-tertiary hover:text-text-primary hover:bg-bg-surface-raised transition-all duration-fast"
                      aria-label="إغلاق"
                    >
                      <X className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>

                  {/* Items list */}
                  <div className="flex-1 overflow-y-auto">
                    <ul className="py-1 divide-y divide-border-subtle">
                      {basketItems.map(({ item, quantity }) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                            <div className="shrink-0 w-8 h-8 rounded-md bg-bg-surface-raised flex items-center justify-center">
                              <Icon className="w-4 h-4 text-brand-primary" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium tracking-tight truncate">{item.name}</p>
                              <p className="text-[10px] text-text-tertiary mt-0.5">{item.unit}</p>
                            </div>
                            {/* Inline stepper */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => { if (quantity <= 1) handleRemove(item.id); else handleUpdate(item.id, quantity - 1); }}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-status-danger text-white shadow-sm hover:bg-status-danger/85 active:scale-90 transition-all duration-fast"
                              >
                                {quantity === 1 ? <Trash2 className="w-3.5 h-3.5" strokeWidth={2} /> : <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />}
                              </button>
                              <span className="w-9 text-center text-sm font-bold tabular">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleUpdate(item.id, quantity + 1)}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-status-success text-white shadow-sm hover:bg-status-success/85 active:scale-90 transition-all duration-fast"
                              >
                                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="shrink-0 border-t border-border-subtle bg-bg-surface/60 backdrop-blur-sm">
                    {/* Priority */}
                    <div className="px-5 pt-4 pb-3 space-y-3">
                      <div>
                        <p className="text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-2">الأولوية</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPriority("normal")}
                            className={cn(
                              "h-9 rounded-md text-xs font-medium tracking-tight transition-all border",
                              priority === "normal"
                                ? "bg-brand-primary/12 text-brand-primary border-brand-primary"
                                : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong"
                            )}
                          >
                            عادي
                          </button>
                          <button
                            type="button"
                            onClick={() => setPriority("rush")}
                            className={cn(
                              "h-9 rounded-md text-xs font-medium tracking-tight transition-all border inline-flex items-center justify-center gap-1.5",
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

                      {/* Summary row */}
                      <div className="flex items-center justify-between py-2 border-t border-border-subtle">
                        <span className="text-xs text-text-tertiary">الإجمالي</span>
                        <span className="text-base font-bold tabular tracking-tight">
                          {itemCount} <span className="text-xs text-text-tertiary font-normal">صنف</span>
                          <span className="text-text-tertiary font-normal mx-1">·</span>
                          {totalQty} <span className="text-xs text-text-tertiary font-normal">وحدة</span>
                        </span>
                      </div>

                      {/* Save as template */}
                      {savingTemplate ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="اسم القالب..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && templateName.trim()) handleSaveTemplate(templateName.trim());
                              if (e.key === "Escape") { setSavingTemplate(false); setTemplateName(""); }
                            }}
                            className="flex-1 h-9 px-3 rounded-sm text-xs bg-bg-surface border border-brand-primary/60 focus:border-brand-primary outline-none tracking-tight transition-all"
                          />
                          <button type="button" disabled={!templateName.trim()} onClick={() => handleSaveTemplate(templateName.trim())} className="w-9 h-9 rounded-sm bg-brand-primary text-text-on-brand disabled:opacity-40 flex items-center justify-center hover:bg-brand-primary-hover transition-colors">
                            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                          <button type="button" onClick={() => { setSavingTemplate(false); setTemplateName(""); }} className="w-9 h-9 rounded-sm border border-border text-text-tertiary flex items-center justify-center hover:text-text-primary transition-colors">
                            <X className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSavingTemplate(true)}
                          className="w-full h-9 rounded-sm border border-border-subtle text-xs text-text-secondary font-medium inline-flex items-center justify-center gap-1.5 hover:border-brand-primary/40 hover:text-brand-primary transition-all duration-fast"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" strokeWidth={1.75} />
                          حفظ كقالب جديد
                        </button>
                      )}

                      {/* Primary CTA */}
                      <Button onClick={handleSubmit} size="lg" fullWidth>
                        أرسل للموافقة
                        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                      </Button>
                      <p className="text-[10px] text-text-tertiary text-center">
                        سيُرسل الطلب لمدير المصنع للمراجعة
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
