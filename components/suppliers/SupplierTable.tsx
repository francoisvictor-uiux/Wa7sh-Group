"use client";

import * as React from "react";
import Link from "next/link";
import {
  Eye,
  Pencil,
  Power,
  PackagePlus,
  ChevronUp,
  Star,
  CheckCircle2,
  Trash2,
  X,
  Tags,
} from "lucide-react";
import {
  type Supplier,
  supplierStatusMeta,
  categoryMeta,
  performanceTagMeta,
  healthBand,
} from "@/lib/mock/suppliers";
import { Badge } from "@/components/ui/Badge";
import { HealthGauge } from "@/components/ui/HealthGauge";
import { useToastContext } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import { Highlight } from "./SupplierHighlight";

type ToastApi = ReturnType<typeof useToastContext>;

export type SortKey = "name" | "rating" | "health" | "lastOrder" | "totalOrders";
export type SortDir = "asc" | "desc";

interface Props {
  suppliers: Supplier[];
  query: string;
  selected: Set<string>;
  setSelected: (next: Set<string>) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  setSort: (key: SortKey) => void;
  canEdit: boolean;
}

const cols: Array<{ key: SortKey | "actions" | "checkbox" | "categories" | "phone" | "status" | "performance"; label: string; sortable?: boolean; align?: "start" | "end" | "center"; width?: string }> = [
  { key: "checkbox", label: "", width: "40px" },
  { key: "name", label: "المورد", sortable: true },
  { key: "categories", label: "الفئات" },
  { key: "phone", label: "الهاتف" },
  { key: "rating", label: "التقييم", sortable: true, align: "center", width: "100px" },
  { key: "health", label: "المؤشر", sortable: true, align: "center", width: "92px" },
  { key: "status", label: "الحالة", align: "center", width: "120px" },
  { key: "lastOrder", label: "آخر طلب", sortable: true, align: "center", width: "112px" },
  { key: "totalOrders", label: "الأوامر", sortable: true, align: "end", width: "84px" },
  { key: "performance", label: "الأداء", align: "center", width: "128px" },
  { key: "actions", label: "", align: "end", width: "112px" },
];

export function SupplierTable({
  suppliers,
  query,
  selected,
  setSelected,
  sortKey,
  sortDir,
  setSort,
  canEdit,
}: Props) {
  const toast = useToastContext();
  const allSelected = suppliers.length > 0 && suppliers.every((s) => selected.has(s.id));
  const someSelected = !allSelected && suppliers.some((s) => selected.has(s.id));

  function toggleAll() {
    if (allSelected) {
      const next = new Set(selected);
      suppliers.forEach((s) => next.delete(s.id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      suppliers.forEach((s) => next.add(s.id));
      setSelected(next);
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  return (
    <div className="rounded-md border border-border-subtle bg-bg-surface overflow-hidden">
      <BulkBar
        count={[...selected].filter((id) => suppliers.some((s) => s.id === id)).length}
        clear={() => setSelected(new Set())}
        canEdit={canEdit}
        toast={toast}
      />

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
                    {c.key === "checkbox" ? (
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={toggleAll}
                        ariaLabel="تحديد كل الموردين"
                      />
                    ) : (
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
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, idx) => (
              <Row
                key={s.id}
                supplier={s}
                query={query}
                selected={selected.has(s.id)}
                toggle={() => toggleOne(s.id)}
                canEdit={canEdit}
                last={idx === suppliers.length - 1}
                toast={toast}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------
 * Row
 * -------------------------------------------------------------------- */

function Row({
  supplier,
  query,
  selected,
  toggle,
  canEdit,
  last,
  toast,
}: {
  supplier: Supplier;
  query: string;
  selected: boolean;
  toggle: () => void;
  canEdit: boolean;
  last: boolean;
  toast: ToastApi;
}) {
  const status = supplierStatusMeta[supplier.status];
  const perf = performanceTagMeta[supplier.performanceTag];
  const band = healthBand(supplier.healthScore);
  const healthTone =
    band === "good" ? "text-status-success" :
    band === "ok" ? "text-brand-primary" :
    band === "risk" ? "text-status-warning" :
    "text-status-danger";

  return (
    <tr
      className={cn(
        "group relative border-b border-border-subtle transition-colors duration-fast",
        !last && "border-b",
        selected
          ? "bg-brand-primary/[0.06]"
          : "hover:[box-shadow:inset_3px_0_0_0_var(--brand-primary)]"
      )}
    >
      <td className="px-3 align-middle">
        <Checkbox
          checked={selected}
          onChange={toggle}
          ariaLabel={`تحديد ${supplier.name}`}
        />
      </td>

      <td className="px-3 py-3 align-middle">
        <Link href={`/suppliers/${supplier.id}`} className="flex items-center gap-3 min-w-0">
          <span
            className={cn(
              "shrink-0 w-9 h-9 rounded-sm flex items-center justify-center font-bold text-sm",
              supplier.status === "preferred"
                ? "bg-brand-primary/15 text-brand-primary"
                : supplier.status === "review"
                ? "bg-status-warning/15 text-status-warning"
                : "bg-bg-surface-raised text-text-secondary"
            )}
          >
            {supplier.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-tight truncate leading-tight">
              <Highlight text={supplier.name} query={query} />
            </p>
            <p className="text-[11px] text-text-tertiary truncate mt-0.5">
              <Highlight text={supplier.nameEn} query={query} />
            </p>
          </div>
        </Link>
      </td>

      <td className="px-3 align-middle">
        <div className="flex items-center gap-1 flex-wrap max-w-[180px]">
          {supplier.categories.slice(0, 2).map((c) => (
            <CategoryChip key={c} category={c} />
          ))}
          {supplier.categories.length > 2 && (
            <span className="text-[10px] text-text-tertiary tabular">
              +{supplier.categories.length - 2}
            </span>
          )}
        </div>
      </td>

      <td className="px-3 align-middle">
        <span className="text-xs tabular text-text-secondary">
          <Highlight text={supplier.phone} query={query} />
        </span>
      </td>

      <td className="px-3 align-middle text-center">
        <div className="inline-flex items-center gap-1">
          <Star className="w-3 h-3 text-brand-primary fill-brand-primary" strokeWidth={1.5} />
          <span className="text-sm font-medium tabular">{supplier.rating.toFixed(1)}</span>
        </div>
      </td>

      <td className="px-3 align-middle text-center">
        <div className={cn(
          "inline-flex items-center justify-center w-12 h-7 rounded-full text-xs font-bold tabular tracking-tight border",
          band === "good" && "bg-status-success/12 text-status-success border-status-success/30",
          band === "ok" && "bg-brand-primary/12 text-brand-primary border-brand-primary/30",
          band === "risk" && "bg-status-warning/12 text-status-warning border-status-warning/30",
          band === "critical" && "bg-status-danger/12 text-status-danger border-status-danger/30",
        )}>
          {Math.round(supplier.healthScore)}
        </div>
      </td>

      <td className="px-3 align-middle text-center">
        <Badge intent={status.intent} size="sm">{status.label}</Badge>
      </td>

      <td className="px-3 align-middle text-center">
        <span className="text-xs text-text-secondary tabular">{supplier.lastOrderDate}</span>
      </td>

      <td className="px-3 align-middle text-left">
        <span className="text-sm font-medium tabular tracking-tight">{supplier.totalOrders}</span>
      </td>

      <td className="px-3 align-middle text-center">
        <Badge intent={perf.intent} size="sm" dot pulse={supplier.performanceTag === "risky"}>
          {perf.label}
        </Badge>
      </td>

      <td className="px-2 align-middle text-left">
        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
          <RowAction icon={<Eye className="w-3.5 h-3.5" strokeWidth={1.75} />} label="عرض" href={`/suppliers/${supplier.id}`} />
          {canEdit && <RowAction icon={<Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />} label="تعديل" href={`/suppliers/${supplier.id}/edit`} />}
          {canEdit && <RowAction
            icon={<Power className="w-3.5 h-3.5" strokeWidth={1.75} />}
            label={supplier.status === "blocked" ? "تفعيل" : "إيقاف"}
            onClick={() => toast.success(supplier.status === "blocked" ? "تم تفعيل المورد" : "تم إيقاف المورد", supplier.name)}
            tone="warning"
          />}
          <RowAction
            icon={<PackagePlus className="w-3.5 h-3.5" strokeWidth={1.75} />}
            label="أمر جديد"
            onClick={() => toast.info("بدء أمر شراء جديد", supplier.name)}
            tone="brand"
          />
        </div>
      </td>
    </tr>
  );
}

/* ----------------------------------------------------------------------
 * Bulk action bar — animates in when count > 0
 * -------------------------------------------------------------------- */

function BulkBar({
  count, clear, canEdit, toast,
}: {
  count: number;
  clear: () => void;
  canEdit: boolean;
  toast: ToastApi;
}) {
  if (count === 0) return null;
  return (
    <div className="flex items-center justify-between gap-3 px-4 h-12 bg-brand-primary/12 border-b border-brand-primary/30 animate-slide-up">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-text-on-brand text-xs font-bold tabular">
          {count}
        </span>
        <span className="text-sm font-medium text-text-primary">عُنصر محدد</span>
      </div>
      <div className="flex items-center gap-1.5">
        {canEdit && (
          <>
            <BulkBtn
              icon={<CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />}
              label="تفعيل"
              onClick={() => { toast.success(`تم تفعيل ${count} مورد`); clear(); }}
            />
            <BulkBtn
              icon={<Power className="w-3.5 h-3.5" strokeWidth={2} />}
              label="إيقاف"
              onClick={() => { toast.success(`تم إيقاف ${count} مورد`); clear(); }}
            />
            <BulkBtn
              icon={<Tags className="w-3.5 h-3.5" strokeWidth={2} />}
              label="تخصيص فئة"
              onClick={() => toast.info("اختر الفئة من القائمة")}
            />
            <BulkBtn
              icon={<Trash2 className="w-3.5 h-3.5" strokeWidth={2} />}
              label="حذف"
              tone="danger"
              onClick={() => { toast.error(`تم حذف ${count} مورد`); clear(); }}
            />
          </>
        )}
        <button
          type="button"
          onClick={clear}
          className="ml-2 p-1.5 rounded-full text-text-tertiary hover:text-text-primary hover:bg-bg-surface transition-colors duration-fast"
          aria-label="إلغاء التحديد"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function BulkBtn({
  icon,
  label,
  onClick,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 h-8 px-3 rounded-sm text-xs font-medium tracking-tight transition-colors duration-fast",
        "bg-bg-surface border border-border hover:border-border-strong",
        tone === "danger" && "hover:border-status-danger/60 hover:text-status-danger"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* ----------------------------------------------------------------------
 * RowAction button (small icon button used in actions cell)
 * -------------------------------------------------------------------- */

function RowAction({
  icon,
  label,
  href,
  onClick,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  tone?: "brand" | "warning" | "danger";
}) {
  const className = cn(
    "inline-flex items-center justify-center w-7 h-7 rounded-sm text-text-tertiary",
    "hover:bg-bg-surface-raised transition-all duration-fast",
    tone === "brand" && "hover:text-brand-primary",
    tone === "warning" && "hover:text-status-warning",
    tone === "danger" && "hover:text-status-danger",
    !tone && "hover:text-text-primary"
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-label={label} title={label}>
        {icon}
      </Link>
    );
  }
  return (
    <button type="button" className={className} onClick={onClick} aria-label={label} title={label}>
      {icon}
    </button>
  );
}

/* ----------------------------------------------------------------------
 * Category chip (tone-tinted)
 * -------------------------------------------------------------------- */

export function CategoryChip({ category }: { category: keyof typeof categoryMeta }) {
  const meta = categoryMeta[category];
  const tone = meta.tone as "danger" | "success" | "info" | "warning" | "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center h-5 px-2 rounded-full text-[10px] font-medium tracking-tight",
        tone === "danger" && "bg-status-danger/10 text-status-danger",
        tone === "success" && "bg-status-success/12 text-status-success",
        tone === "info" && "bg-status-info/12 text-status-info",
        tone === "warning" && "bg-status-warning/12 text-status-warning",
        tone === "neutral" && "bg-bg-surface-raised text-text-secondary",
      )}
    >
      {meta.label}
    </span>
  );
}

/* ----------------------------------------------------------------------
 * Checkbox (custom, tri-state)
 * -------------------------------------------------------------------- */

export function Checkbox({
  checked,
  indeterminate,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  ariaLabel: string;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate && !checked;
  }, [indeterminate, checked]);

  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      <span className="sr-only">{ariaLabel}</span>
      <input
        ref={ref}
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <span
        className={cn(
          "inline-flex items-center justify-center w-4 h-4 rounded-[5px] border transition-all duration-fast",
          "border-border-strong bg-bg-surface",
          "peer-focus-visible:shadow-glow-brand",
          (checked || indeterminate) && "bg-brand-primary border-brand-primary scale-105"
        )}
        onClick={(e) => { e.preventDefault(); onChange(); }}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="w-3 h-3 text-text-on-brand" fill="none">
            <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {indeterminate && !checked && (
          <span className="block w-2 h-0.5 bg-text-on-brand rounded-full" />
        )}
      </span>
    </label>
  );
}
