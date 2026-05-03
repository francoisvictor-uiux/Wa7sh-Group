"use client";

import { useState, useMemo } from "react";
import {
  X, Plus, Minus, Sparkles, Pencil, Trash2, Check,
  Clock, CalendarDays, Package, Search,
} from "lucide-react";
import { catalog, type Template } from "@/lib/mock/requests";
import { cn } from "@/lib/utils";

interface TemplatesPanelProps {
  templates: Template[];
  onClose: () => void;
  onAdd: (tpl: Template) => void;
  onReplace: (id: string, tpl: Template) => void;
  onDelete: (id: string) => void;
}

function resolveItem(catalogId: string) {
  return catalog.find((c) => c.id === catalogId);
}

/* ── Compact item row used in both the add form and the card item list ── */
function ItemPickerRow({
  item,
  quantity,
  onIncrease,
  onDecrease,
}: {
  item: (typeof catalog)[0];
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const Icon = item.icon;
  const inBasket = quantity > 0;
  return (
    <li className={cn(
      "flex items-center gap-3 px-3 py-2.5 transition-colors duration-fast",
      inBasket ? "bg-brand-primary/5" : "hover:bg-bg-surface-raised/60"
    )}>
      <div className={cn(
        "shrink-0 w-7 h-7 rounded-sm flex items-center justify-center",
        inBasket ? "bg-brand-primary/15 text-brand-primary" : "bg-bg-surface-raised text-text-tertiary"
      )}>
        <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium tracking-tight truncate">{item.name}</p>
        <p className="text-[10px] text-text-tertiary">{item.unit}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {inBasket ? (
          <>
            <button type="button" onClick={onDecrease}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-status-danger text-white shadow-sm hover:bg-status-danger/85 active:scale-90 transition-all duration-fast">
              <Minus className="w-3 h-3" strokeWidth={2.5} />
            </button>
            <span className="w-7 text-center text-sm font-bold tabular text-brand-primary">{quantity}</span>
            <button type="button" onClick={onIncrease}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-status-success text-white shadow-sm hover:bg-status-success/85 active:scale-90 transition-all duration-fast">
              <Plus className="w-3 h-3" strokeWidth={2.5} />
            </button>
          </>
        ) : (
          <button type="button" onClick={onIncrease}
            className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full border border-border-subtle text-[11px] text-text-secondary hover:border-brand-primary/40 hover:text-brand-primary transition-all duration-fast">
            <Plus className="w-3 h-3" strokeWidth={2.5} />
            أضف
          </button>
        )}
      </div>
    </li>
  );
}

/* ── Add / Edit template form with item picker ── */
function TemplateForm({
  initialName    = "",
  initialDesc    = "",
  initialItems   = new Map<string, number>(),
  title,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  initialName?:  string;
  initialDesc?:  string;
  initialItems?: Map<string, number>;
  title: string;
  confirmLabel: string;
  onConfirm: (name: string, desc: string, items: Map<string, number>) => void;
  onCancel: () => void;
}) {
  const [name,    setName]   = useState(initialName);
  const [desc,    setDesc]   = useState(initialDesc);
  const [items,   setItems]  = useState<Map<string, number>>(new Map(initialItems));
  const [search,  setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? catalog.filter((c) => c.name.toLowerCase().includes(q) || c.unit.includes(q)) : catalog;
  }, [search]);

  const selectedCount = Array.from(items.values()).filter((q) => q > 0).length;

  function increase(id: string) {
    setItems((prev) => { const n = new Map(prev); n.set(id, (n.get(id) ?? 0) + 1); return n; });
  }
  function decrease(id: string) {
    setItems((prev) => {
      const n = new Map(prev);
      const q = (n.get(id) ?? 0) - 1;
      if (q <= 0) n.delete(id); else n.set(id, q);
      return n;
    });
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Name + desc */}
      <div className="shrink-0 px-5 pt-4 pb-3 space-y-2.5 border-b border-border-subtle">
        <p className="text-[10px] tracking-[0.18em] uppercase text-brand-primary font-bold">{title}</p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم القالب *"
          onKeyDown={(e) => e.key === "Escape" && onCancel()}
          className="w-full h-10 px-3 rounded-sm text-sm bg-bg-surface border border-border focus:border-brand-primary focus:shadow-glow-brand outline-none tracking-tight transition-all"
        />
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="وصف مختصر (اختياري)"
          className="w-full h-9 px-3 rounded-sm text-xs bg-bg-surface border border-border focus:border-brand-primary outline-none tracking-tight transition-all placeholder:text-text-tertiary"
        />
      </div>

      {/* Items picker */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Search + count */}
        <div className="shrink-0 px-5 py-2.5 border-b border-border-subtle flex items-center gap-2">
          <div className="flex-1 relative flex items-center h-9 rounded-sm bg-bg-surface border border-border focus-within:border-brand-primary transition-all">
            <Search className="absolute right-2.5 w-3.5 h-3.5 text-text-tertiary pointer-events-none" strokeWidth={1.75} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن صنف..."
              className="w-full h-full bg-transparent outline-none pr-8 pl-3 text-xs text-text-primary placeholder:text-text-tertiary"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="absolute left-2 text-text-tertiary hover:text-text-primary">
                <X className="w-3 h-3" strokeWidth={2} />
              </button>
            )}
          </div>
          {selectedCount > 0 && (
            <span className="shrink-0 inline-flex items-center justify-center h-7 px-2.5 rounded-full bg-brand-primary/12 text-brand-primary text-[11px] font-bold tabular">
              {selectedCount} صنف
            </span>
          )}
        </div>

        {/* Catalog list */}
        <ul className="flex-1 overflow-y-auto divide-y divide-border-subtle">
          {filtered.map((item) => (
            <ItemPickerRow
              key={item.id}
              item={item}
              quantity={items.get(item.id) ?? 0}
              onIncrease={() => increase(item.id)}
              onDecrease={() => decrease(item.id)}
            />
          ))}
          {filtered.length === 0 && (
            <li className="py-10 text-center text-xs text-text-tertiary">
              لا توجد أصناف تطابق البحث
            </li>
          )}
        </ul>
      </div>

      {/* Actions */}
      <div className="shrink-0 px-5 py-3.5 border-t border-border-subtle bg-bg-surface/60 flex gap-2">
        <button
          type="button"
          onClick={() => onConfirm(name.trim(), desc.trim(), items)}
          disabled={!name.trim()}
          className="flex-[2] h-10 rounded-sm bg-brand-primary text-text-on-brand text-sm font-medium disabled:opacity-40 hover:bg-brand-primary-hover active:scale-[0.98] transition-all duration-fast inline-flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" strokeWidth={2.5} />
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-10 rounded-sm border border-border bg-bg-surface text-text-secondary text-sm font-medium hover:border-border-strong transition-colors"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */

export function TemplatesPanel({
  templates,
  onClose,
  onAdd,
  onReplace,
  onDelete,
}: TemplatesPanelProps) {
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingTpl, setEditingTpl] = useState<Template | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleAdd(name: string, desc: string, items: Map<string, number>) {
    const itemEntries = Array.from(items.entries())
      .filter(([, q]) => q > 0)
      .map(([catalogId, quantity]) => ({ catalogId, quantity }));
    onAdd({
      id: `tpl-${Date.now()}`,
      name,
      description: desc || `${itemEntries.length} صنف · تم الإنشاء اليوم`,
      itemCount: itemEntries.length,
      totalValue: 0,
      lastUsed: "لم يُستخدم بعد",
      items: itemEntries,
    });
    setMode("list");
  }

  function handleEdit(name: string, desc: string, items: Map<string, number>) {
    if (!editingTpl) return;
    const itemEntries = Array.from(items.entries())
      .filter(([, q]) => q > 0)
      .map(([catalogId, quantity]) => ({ catalogId, quantity }));
    onReplace(editingTpl.id, {
      ...editingTpl,
      name,
      description: desc || editingTpl.description,
      itemCount: itemEntries.length,
      items: itemEntries,
    });
    setMode("list");
    setEditingTpl(null);
  }

  const showForm = mode === "add" || mode === "edit";

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="إغلاق"
        onClick={() => { if (showForm) { setMode("list"); setEditingTpl(null); } else onClose(); }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
      />

      {/* Panel */}
      <aside
        className="fixed top-0 left-0 bottom-0 z-50 w-full max-w-[520px] bg-bg-canvas flex flex-col"
        style={{
          boxShadow: "4px 0 40px rgba(0,0,0,0.18)",
          animation: "slideInLeft 280ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <style jsx global>{`
          @keyframes slideInLeft {
            from { transform: translateX(-100%); opacity: 0.6; }
            to   { transform: translateX(0);     opacity: 1; }
          }
        `}</style>

        {/* ── Header ── */}
        <header className="shrink-0 flex items-center justify-between gap-3 px-6 py-4 border-b border-border-subtle">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-text-tertiary mb-0.5">TEMPLATES</p>
            <h2 className="text-lg font-bold tracking-tight">
              {mode === "add"  ? "قالب جديد" :
               mode === "edit" ? "تعديل القالب" :
               "القوالب المحفوظة"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {mode === "list" && (
              <button
                type="button"
                onClick={() => setMode("add")}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-sm bg-brand-primary text-text-on-brand text-xs font-medium tracking-tight hover:bg-brand-primary-hover active:scale-[0.97] transition-all duration-fast shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                قالب جديد
              </button>
            )}
            <button
              type="button"
              onClick={() => { setMode("list"); setEditingTpl(null); onClose(); }}
              aria-label="إغلاق"
              className="inline-flex items-center justify-center w-9 h-9 rounded-sm text-text-tertiary hover:text-text-primary hover:bg-bg-surface-raised transition-all duration-fast"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </header>

        {/* ── Add / Edit form — flex-1 so it fills remaining height ── */}
        {(mode === "add" || (mode === "edit" && editingTpl)) && (
          <div className="flex-1 min-h-0 flex flex-col">
            <TemplateForm
              title={mode === "add" ? "إنشاء قالب جديد" : "تعديل القالب"}
              confirmLabel={mode === "add" ? "حفظ القالب" : "حفظ التعديلات"}
              initialName={mode === "edit" ? editingTpl!.name : ""}
              initialDesc={mode === "edit" ? editingTpl!.description : ""}
              initialItems={mode === "edit" ? new Map(editingTpl!.items.map((i) => [i.catalogId, i.quantity])) : new Map()}
              onConfirm={mode === "add" ? handleAdd : handleEdit}
              onCancel={() => { setMode("list"); setEditingTpl(null); }}
            />
          </div>
        )}

        {/* ── Templates list ── */}
        {mode === "list" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {templates.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-brand-primary/8 flex items-center justify-center mb-4">
                    <Sparkles className="w-7 h-7 text-brand-primary/60" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-bold tracking-tight">لا توجد قوالب بعد</p>
                  <p className="text-xs text-text-tertiary mt-1.5 max-w-[200px] leading-relaxed">
                    أضف قالبًا جديدًا أو احفظ سلة طلب من نموذج الطلب
                  </p>
                  <button
                    type="button"
                    onClick={() => setMode("add")}
                    className="mt-5 inline-flex items-center gap-1.5 h-9 px-4 rounded-sm bg-brand-primary text-text-on-brand text-xs font-medium hover:bg-brand-primary-hover transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                    أنشئ أول قالب
                  </button>
                </div>
              )}

              {templates.map((tpl) => {
                const isDeleting = deletingId === tpl.id;
                const resolvedItems = tpl.items
                  .map((it) => ({ ...it, catalog: resolveItem(it.catalogId) }))
                  .filter((it) => !!it.catalog);
                const previewItems = resolvedItems.slice(0, 4);
                const extraCount  = resolvedItems.length - previewItems.length;

                if (isDeleting) return (
                  <div key={tpl.id} className="rounded-lg border border-status-danger/50 bg-status-danger/5 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-status-danger/15 text-status-danger flex items-center justify-center shrink-0">
                        <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-status-danger">تأكيد الحذف</p>
                        <p className="text-xs text-text-tertiary truncate mt-0.5">{tpl.name}</p>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                      سيتم حذف القالب نهائيًا ولا يمكن التراجع عن هذا الإجراء.
                    </p>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { onDelete(tpl.id); setDeletingId(null); }} className="flex-1 h-9 rounded-sm bg-status-danger text-white text-xs font-medium hover:bg-status-danger/90 transition-colors">
                        نعم، احذف
                      </button>
                      <button type="button" onClick={() => setDeletingId(null)} className="flex-1 h-9 rounded-sm border border-border bg-bg-surface text-text-secondary text-xs font-medium hover:border-border-strong transition-colors">
                        إلغاء
                      </button>
                    </div>
                  </div>
                );

                return (
                  <div key={tpl.id} className="rounded-lg border border-border-subtle bg-bg-surface overflow-hidden hover:border-border-strong transition-colors duration-fast">
                    {/* Card header */}
                    <div className="flex items-start gap-3 px-4 pt-4 pb-3">
                      <div className={cn(
                        "shrink-0 w-9 h-9 rounded-md flex items-center justify-center mt-0.5",
                        tpl.popular ? "bg-brand-primary/12 text-brand-primary" : "bg-bg-surface-raised text-text-tertiary"
                      )}>
                        <Sparkles className="w-4 h-4" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold tracking-tight leading-tight">{tpl.name}</p>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => { setEditingTpl(tpl); setMode("edit"); }}
                              className="w-7 h-7 rounded-sm text-text-tertiary hover:text-brand-primary hover:bg-brand-primary/10 transition-all flex items-center justify-center"
                            >
                              <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingId(tpl.id)}
                              className="w-7 h-7 rounded-sm text-text-tertiary hover:text-status-danger hover:bg-status-danger/10 transition-all flex items-center justify-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                        {tpl.description && (
                          <p className="text-[11px] text-text-tertiary mt-0.5 line-clamp-1">{tpl.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    {resolvedItems.length > 0 ? (
                      <div className="mx-4 mb-3 rounded-md border border-border-subtle overflow-hidden bg-bg-canvas">
                        <div className="px-3 py-1.5 border-b border-border-subtle bg-bg-muted/30 flex items-center justify-between">
                          <span className="text-[10px] tracking-[0.14em] uppercase text-text-tertiary font-semibold">الأصناف</span>
                          <span className="text-[10px] text-text-tertiary tabular">{resolvedItems.length} صنف</span>
                        </div>
                        <ul className="divide-y divide-border-subtle">
                          {previewItems.map(({ catalogId, quantity, catalog: item }) => {
                            if (!item) return null;
                            const Icon = item.icon;
                            return (
                              <li key={catalogId} className="flex items-center gap-2.5 px-3 py-2">
                                <Icon className="w-3.5 h-3.5 text-brand-primary/70 shrink-0" strokeWidth={1.5} />
                                <span className="flex-1 text-xs text-text-primary truncate">{item.name}</span>
                                <span className="shrink-0 text-[11px] font-bold tabular text-brand-primary">
                                  ×{quantity}
                                  <span className="font-normal text-text-tertiary mr-0.5 text-[10px]">{item.unit}</span>
                                </span>
                              </li>
                            );
                          })}
                          {extraCount > 0 && (
                            <li className="px-3 py-1.5 flex items-center gap-1.5 text-[11px] text-text-tertiary">
                              <Package className="w-3 h-3" strokeWidth={1.75} />
                              و {extraCount} {extraCount === 1 ? "صنف آخر" : "أصناف أخرى"}
                            </li>
                          )}
                        </ul>
                      </div>
                    ) : (
                      <div className="mx-4 mb-3 rounded-md border border-dashed border-border-subtle px-3 py-2.5 text-center">
                        <p className="text-[11px] text-text-tertiary">لا توجد أصناف — عدّل القالب لإضافتها</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-4 px-4 py-2 border-t border-border-subtle bg-bg-muted/20">
                      {tpl.createdAt && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-text-tertiary">
                          <CalendarDays className="w-3 h-3" strokeWidth={1.75} />
                          {tpl.createdAt}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[10px] text-text-tertiary">
                        <Clock className="w-3 h-3" strokeWidth={1.75} />
                        {tpl.lastUsed}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-3 border-t border-border-subtle bg-bg-surface/60 flex items-center justify-between">
              <p className="text-[11px] text-text-tertiary">
                {templates.length} {templates.length === 1 ? "قالب محفوظ" : "قوالب محفوظة"}
              </p>
              <button type="button" onClick={onClose} className="text-xs text-text-tertiary hover:text-text-primary transition-colors">
                إغلاق
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
