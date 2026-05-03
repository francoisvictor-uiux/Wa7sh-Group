"use client";

import { useState } from "react";
import { Search, Star, Phone, Building2, FileText, AlertTriangle } from "lucide-react";
import {
  suppliers, purchaseOrders, supplierStatusMeta, orderStatusMeta,
  type Supplier, type PurchaseOrder,
} from "@/lib/mock/factorySuppliers";
import { useDevice } from "@/hooks/useDevice";
import { cn } from "@/lib/utils";

type Tab = "suppliers" | "orders";

export function FactorySuppliers() {
  const device  = useDevice();
  const [tab, setTab]         = useState<Tab>("suppliers");
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState<Supplier | null>(suppliers[0] ?? null);

  const filteredSuppliers = suppliers.filter((s) =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())
  );

  const liveSelected = selected ? suppliers.find((s) => s.id === selected.id) ?? selected : null;

  const listPanel = (compact = false) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn("border-b border-border-subtle space-y-3", compact ? "p-3" : "p-4")}>
        <div>
          <h1 className={cn("font-bold tracking-tight", compact ? "text-sm" : "text-base")}>الموردون</h1>
          <p className="text-xs text-text-tertiary mt-0.5">
            {suppliers.filter((s) => s.status === "active").length} نشط
            {suppliers.filter((s) => s.status === "on-hold").length > 0 && (
              <span className="text-status-danger font-medium"> · {suppliers.filter((s) => s.status === "on-hold").length} موقوف</span>
            )}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-bg-surface-raised border border-border-subtle">
          {(["suppliers", "orders"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 text-xs font-medium py-1.5 rounded-md transition-all duration-fast",
                tab === t ? "bg-brand-primary text-text-on-brand shadow-sm" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {t === "suppliers" ? "الموردون" : "أوامر الشراء"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={tab === "suppliers" ? "ابحث عن مورد..." : "ابحث عن أمر شراء..."}
            className="w-full h-9 pr-9 pl-3 text-sm rounded-lg bg-bg-surface-raised border border-border-subtle placeholder:text-text-tertiary text-text-primary focus:outline-none focus:border-border-focus transition-colors duration-fast"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {tab === "suppliers" ? (
          filteredSuppliers.map((s) => (
            <SupplierCard
              key={s.id}
              supplier={s}
              selected={selected?.id === s.id}
              onClick={() => setSelected(s)}
            />
          ))
        ) : (
          purchaseOrders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))
        )}
      </div>
    </div>
  );

  const detailPanel = () => liveSelected && tab === "suppliers" ? (
    <SupplierDetail
      supplier={liveSelected}
      orders={purchaseOrders.filter((o) => o.supplierId === liveSelected.id)}
      onClose={device === "mobile" ? () => setSelected(null) : undefined}
    />
  ) : (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <Building2 className="w-10 h-10 text-text-tertiary mb-3" strokeWidth={1.5} />
      <p className="text-sm text-text-secondary">اختر مورداً لعرض التفاصيل</p>
    </div>
  );

  if (device === "mobile") {
    return (
      <div className="relative h-[calc(100vh-56px)] overflow-hidden">
        <div className={cn("absolute inset-0 transition-transform duration-300 ease-out-expo", selected && tab === "suppliers" ? "-translate-x-full" : "translate-x-0")}>
          {listPanel(true)}
        </div>
        <div className={cn("absolute inset-0 bg-bg-surface transition-transform duration-300 ease-out-expo", selected && tab === "suppliers" ? "translate-x-0" : "translate-x-full")}>
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

// ─── Supplier card ────────────────────────────────────────────────────────────

function SupplierCard({ supplier, selected, onClick }: { supplier: Supplier; selected: boolean; onClick: () => void }) {
  const meta = supplierStatusMeta[supplier.status];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-right rounded-xl border p-3 transition-all duration-fast",
        "hover:border-border-strong hover:bg-bg-surface-raised focus-visible:outline-none",
        selected ? "border-brand-primary bg-brand-primary/6" : "border-border-subtle bg-bg-surface"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-primary truncate">{supplier.name}</p>
          <p className="text-[11px] text-text-tertiary">{supplier.category}</p>
        </div>
        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0", meta.color, meta.bg)}>
          {meta.label}
        </span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-text-tertiary">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-brand-primary" fill="currentColor" strokeWidth={0} />
          <span className="text-brand-primary font-medium">{supplier.rating}</span>
          <span>· {supplier.onTimeRate}% في الموعد</span>
        </div>
        {supplier.lastOrder && <span>{supplier.lastOrder}</span>}
      </div>
      {supplier.status === "on-hold" && supplier.notes && (
        <div className="flex items-start gap-1.5 mt-2 text-[11px] text-status-danger">
          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" strokeWidth={2} />
          <span className="truncate">{supplier.notes}</span>
        </div>
      )}
    </button>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: PurchaseOrder }) {
  const meta = orderStatusMeta[order.status];
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-text-tertiary font-mono">{order.orderNumber}</span>
        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", meta.color, meta.bg)}>
          {meta.label}
        </span>
      </div>
      <p className="text-xs font-medium">{order.supplierName}</p>
      <div className="flex items-center justify-between text-[11px] text-text-tertiary mt-1.5">
        <span>{order.items.length} أصناف</span>
        <span className="font-medium text-text-primary tabular">{order.totalValue.toLocaleString()} ج.م</span>
      </div>
      <p className="text-[11px] text-text-tertiary mt-1">{order.createdAt}</p>
    </div>
  );
}

// ─── Supplier detail ──────────────────────────────────────────────────────────

function SupplierDetail({ supplier, orders, onClose }: { supplier: Supplier; orders: PurchaseOrder[]; onClose?: () => void }) {
  const meta = supplierStatusMeta[supplier.status];
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border-subtle">
        {onClose && (
          <button type="button" onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors">
            <Search className="w-4 h-4" strokeWidth={1.75} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold tracking-tight">{supplier.name}</h2>
          <p className="text-[11px] text-text-tertiary">{supplier.category}</p>
        </div>
        <span className={cn("text-[11px] font-medium px-2.5 py-0.5 rounded-full border", meta.color, meta.bg)}>
          {meta.label}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "التقييم",       value: `${supplier.rating}/5`, icon: Star       },
            { label: "في الموعد",     value: `${supplier.onTimeRate}%`, icon: FileText },
            { label: "إجمالي الطلبات", value: String(supplier.totalOrders), icon: Building2 },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-bg-surface-raised border border-border-subtle p-2.5 text-center">
              <p className="text-[10px] text-text-tertiary mb-1">{s.label}</p>
              <p className="text-lg font-bold text-brand-primary">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <p className="text-[10px] text-text-tertiary uppercase tracking-wide">بيانات التواصل</p>
          {[
            { label: "المسئول",        value: supplier.contactPerson },
            { label: "الهاتف",         value: supplier.phone },
            { label: "العنوان",        value: supplier.address },
            { label: "شروط الدفع",    value: supplier.paymentTerms },
            ...(supplier.email ? [{ label: "البريد", value: supplier.email }] : []),
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between py-1.5 border-b border-border-subtle last:border-0">
              <span className="text-xs text-text-tertiary">{r.label}</span>
              <span className="text-xs font-medium text-text-primary">{r.value}</span>
            </div>
          ))}
        </div>

        {/* Notes */}
        {supplier.notes && (
          <div className="flex gap-2 px-3 py-2 rounded-lg bg-status-warning/8 border border-status-warning/25">
            <AlertTriangle className="w-3.5 h-3.5 text-status-warning shrink-0 mt-0.5" strokeWidth={1.75} />
            <p className="text-xs text-text-secondary">{supplier.notes}</p>
          </div>
        )}

        {/* Recent orders */}
        {orders.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-text-tertiary uppercase tracking-wide">آخر الطلبيات</p>
            {orders.map((o) => {
              const ometa = orderStatusMeta[o.status];
              return (
                <div key={o.id} className="rounded-lg border border-border-subtle bg-bg-surface-raised p-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium">{o.orderNumber}</p>
                    <p className="text-[11px] text-text-tertiary">{o.createdAt} · {o.items.length} أصناف</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", ometa.color, ometa.bg)}>
                      {ometa.label}
                    </span>
                    <span className="text-[11px] font-medium tabular">{o.totalValue.toLocaleString()} ج.م</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
