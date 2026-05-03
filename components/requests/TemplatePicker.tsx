"use client";

import { useState } from "react";
import { Sparkles, Clock, Pencil, Trash2, Check, X, Plus, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { type Template } from "@/lib/mock/requests";
import { cn } from "@/lib/utils";

interface TemplatePickerProps {
  templates: Template[];
  onPick: (template: Template) => void;
  onStartBlank: () => void;
  onEdit: (id: string, name: string, description: string) => void;
  onDelete: (id: string) => void;
  layout?: "grid" | "row";
  className?: string;
}

export function TemplatePicker({
  templates,
  onPick,
  onStartBlank,
  onEdit,
  onDelete,
  layout = "grid",
  className,
}: TemplatePickerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function startEdit(tpl: Template, e: React.MouseEvent) {
    e.stopPropagation();
    setDeletingId(null);
    setEditingId(tpl.id);
    setEditName(tpl.name);
    setEditDesc(tpl.description);
  }

  function confirmEdit(e: React.MouseEvent) {
    e.stopPropagation();
    if (editingId && editName.trim()) {
      onEdit(editingId, editName.trim(), editDesc.trim());
    }
    setEditingId(null);
  }

  function cancelEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditingId(null);
  }

  function startDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingId(null);
    setDeletingId(id);
  }

  function confirmDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    onDelete(id);
    setDeletingId(null);
  }

  function cancelDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setDeletingId(null);
  }

  return (
    <div className={cn("space-y-5", className)}>
      {/* Header */}
      <div>
        <p className="text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-1">
          ابدأ سريعًا
        </p>
        <h2 className="text-base font-medium tracking-tight">
          قوالب مستخدمة سابقًا
        </h2>
      </div>

      {/* Template grid */}
      {templates.length === 0 ? (
        <div className="py-10 text-center text-sm text-text-tertiary">
          لا توجد قوالب محفوظة بعد
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-3",
            layout === "grid"
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {templates.map((tpl) => {
            const isEditing  = editingId  === tpl.id;
            const isDeleting = deletingId === tpl.id;

            return (
              <div key={tpl.id} className="relative group">
                {/* Edit / Delete action buttons — top-left on hover */}
                {!isEditing && !isDeleting && (
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
                    <button
                      type="button"
                      onClick={(e) => startEdit(tpl, e)}
                      aria-label="تعديل القالب"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-sm bg-bg-surface border border-border-subtle text-text-tertiary hover:text-brand-primary hover:border-brand-primary/40 transition-all duration-fast shadow-sm"
                    >
                      <Pencil className="w-3 h-3" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => startDelete(tpl.id, e)}
                      aria-label="حذف القالب"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-sm bg-bg-surface border border-border-subtle text-text-tertiary hover:text-status-danger hover:border-status-danger/40 transition-all duration-fast shadow-sm"
                    >
                      <Trash2 className="w-3 h-3" strokeWidth={2} />
                    </button>
                  </div>
                )}

                {/* Delete confirmation overlay */}
                {isDeleting ? (
                  <Card padding="md" className="h-full border-status-danger/40 bg-status-danger/5">
                    <div className="flex flex-col items-center justify-center text-center gap-3 py-4">
                      <div className="w-10 h-10 rounded-full bg-status-danger/15 text-status-danger flex items-center justify-center">
                        <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-sm font-medium tracking-tight">حذف القالب؟</p>
                        <p className="text-[11px] text-text-tertiary mt-0.5 line-clamp-1">{tpl.name}</p>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <button
                          type="button"
                          onClick={(e) => confirmDelete(tpl.id, e)}
                          className="flex-1 h-8 rounded-sm bg-status-danger text-white text-xs font-medium tracking-tight hover:bg-status-danger/90 transition-colors duration-fast"
                        >
                          نعم، احذف
                        </button>
                        <button
                          type="button"
                          onClick={cancelDelete}
                          className="flex-1 h-8 rounded-sm bg-bg-surface border border-border text-text-secondary text-xs font-medium tracking-tight hover:border-border-strong transition-colors duration-fast"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  </Card>
                ) : isEditing ? (
                  /* Edit form inline */
                  <Card padding="md" className="h-full border-brand-primary/40">
                    <p className="text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-3">تعديل القالب</p>
                    <div className="space-y-2.5">
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="اسم القالب"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-9 px-3 rounded-sm text-sm bg-bg-surface border border-border focus:border-brand-primary focus:shadow-glow-brand outline-none tracking-tight transition-all duration-fast"
                      />
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="وصف مختصر (اختياري)"
                        rows={2}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-3 py-2 rounded-sm text-xs bg-bg-surface border border-border focus:border-brand-primary outline-none tracking-tight resize-none transition-all duration-fast placeholder:text-text-tertiary"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={confirmEdit}
                        disabled={!editName.trim()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-sm bg-brand-primary text-text-on-brand text-xs font-medium tracking-tight disabled:opacity-40 hover:bg-brand-primary-hover transition-colors duration-fast"
                      >
                        <Check className="w-3 h-3" strokeWidth={2.5} />
                        حفظ
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex-1 h-8 rounded-sm bg-bg-surface border border-border text-text-secondary text-xs font-medium tracking-tight hover:border-border-strong transition-colors duration-fast"
                      >
                        إلغاء
                      </button>
                    </div>
                  </Card>
                ) : (
                  /* Normal card */
                  <button
                    type="button"
                    onClick={() => onPick(tpl)}
                    className="w-full group/card text-right"
                  >
                    <Card
                      padding="md"
                      className={cn(
                        "h-full cursor-pointer",
                        "group-hover/card:border-brand-primary/40 group-hover/card:shadow-md group-hover/card:-translate-y-0.5",
                        "transition-all duration-fast ease-out-expo"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-md flex items-center justify-center shrink-0",
                            tpl.popular
                              ? "bg-brand-primary/12 text-brand-primary"
                              : "bg-bg-surface-raised text-text-tertiary"
                          )}
                        >
                          <Sparkles className="w-4 h-4" strokeWidth={1.75} />
                        </div>
                        {tpl.popular && (
                          <Badge intent="brand" size="sm">شائع</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium tracking-tight mb-1 leading-tight">
                        {tpl.name}
                      </p>
                      <p className="text-[11px] text-text-tertiary leading-relaxed line-clamp-2 min-h-[28px] mb-3">
                        {tpl.description}
                      </p>
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border-subtle">
                        <span className="text-[11px] text-text-tertiary tabular tracking-tight">
                          {tpl.itemCount} صنف
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-text-tertiary">
                          <Clock className="w-3 h-3" strokeWidth={1.75} />
                          {tpl.lastUsed}
                        </span>
                      </div>
                    </Card>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Primary CTA — start from scratch */}
      <div className="pt-2">
        <div className="relative flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border-subtle" />
          <span className="text-[10px] tracking-[0.16em] uppercase text-text-tertiary">أو</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>
        <button
          type="button"
          onClick={onStartBlank}
          className={cn(
            "w-full h-12 rounded-sm",
            "inline-flex items-center justify-center gap-2",
            "bg-brand-primary text-text-on-brand",
            "text-sm font-medium tracking-tight",
            "hover:bg-brand-primary-hover active:scale-[0.985]",
            "transition-all duration-fast ease-out-expo",
            "shadow-sm hover:shadow-md"
          )}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          ابدأ من الصفر
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
