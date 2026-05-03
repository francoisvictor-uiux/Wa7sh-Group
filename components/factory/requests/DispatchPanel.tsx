"use client";

import { useState } from "react";
import { X, Truck, QrCode, Check, Minus, Plus, AlertTriangle } from "lucide-react";
import { type FactoryRequest, type DispatchItem } from "@/lib/mock/factoryRequests";
import { useRequestsDB } from "@/lib/db/requests";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface DispatchPanelProps {
  request: FactoryRequest;
  onClose: () => void;
}

/* ── Simple visual QR placeholder generated from request ID ── */
function MockQR({ value }: { value: string }) {
  const size = 21;
  // Deterministic pseudo-random grid from the value string
  const cells = Array.from({ length: size * size }, (_, i) => {
    const seed = value.charCodeAt(i % value.length) ^ (i * 137);
    return (seed * 1664525 + 1013904223) % 256 > 120;
  });
  // Force finder squares in corners (top-left, top-right, bottom-left)
  const forceSquare = (ox: number, oy: number) => {
    for (let y = oy; y < oy + 7; y++)
      for (let x = ox; x < ox + 7; x++) {
        const border = x === ox || x === ox + 6 || y === oy || y === oy + 6;
        const inner = x >= ox + 2 && x <= ox + 4 && y >= oy + 2 && y <= oy + 4;
        cells[y * size + x] = border || inner;
      }
  };
  forceSquare(0, 0); forceSquare(size - 7, 0); forceSquare(0, size - 7);

  return (
    <div className="p-3 bg-white rounded-lg border border-border-subtle inline-block">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-40 h-40">
        {cells.map((on, i) => on ? (
          <rect key={i} x={i % size} y={Math.floor(i / size)} width={1} height={1} fill="#000" />
        ) : null)}
      </svg>
      <p className="text-center text-[11px] text-text-tertiary font-mono mt-1.5">{value}</p>
    </div>
  );
}

export function DispatchPanel({ request, onClose }: DispatchPanelProps) {
  const { dispatchOrder } = useRequestsDB();

  // Init dispatch items from approved/requested quantities
  const [dispatchItems, setDispatchItems] = useState<DispatchItem[]>(
    request.items.map((it) => ({
      catalogId: it.catalogId,
      name: it.name,
      unit: it.unit,
      requestedQty: it.requestedQty,
      dispatchedQty: it.approvedQty ?? it.requestedQty,
    }))
  );
  const [note, setNote] = useState("");
  const [driverName, setDriverName] = useState("");
  const [phase, setPhase] = useState<"edit" | "qr">("edit");

  const hasDiff = dispatchItems.some((it) => it.dispatchedQty !== it.requestedQty);

  function updateQty(catalogId: string, qty: number) {
    setDispatchItems((prev) =>
      prev.map((it) => it.catalogId === catalogId ? { ...it, dispatchedQty: Math.max(0, qty) } : it)
    );
  }

  function handleDispatch() {
    dispatchOrder(request.id, dispatchItems, note || undefined, driverName || undefined);
    setPhase("qr");
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[480px] bg-bg-canvas border-l border-border-subtle shadow-2xl flex flex-col"
        style={{ animation: "slideInRight 280ms cubic-bezier(0.16,1,0.3,1)" }}>
        <style jsx global>{`
          @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        `}</style>

        {/* Header */}
        <header className="shrink-0 px-5 py-4 border-b border-border-subtle flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.18em] uppercase text-text-tertiary">DISPATCH ORDER</p>
            <h2 className="text-base font-bold tracking-tight mt-0.5">
              {phase === "qr" ? "جاهز للإرسال" : "تجهيز الطلب للإرسال"}
            </h2>
            <p className="text-[11px] text-text-tertiary mt-0.5">{request.requestNumber} · {request.branchName}</p>
          </div>
          <button type="button" onClick={onClose}
            className="w-9 h-9 rounded-sm flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-surface-raised transition-all">
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </header>

        {phase === "edit" ? (
          <>
            <div className="flex-1 overflow-y-auto">
              {/* Items */}
              <div className="px-5 pt-4 pb-2">
                <p className="text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-3">
                  الأصناف — عدّل الكميات إذا اختلفت عن الطلب
                </p>
                <div className="space-y-2">
                  {dispatchItems.map((it) => {
                    const diff = it.dispatchedQty - it.requestedQty;
                    const isDiff = diff !== 0;
                    return (
                      <div key={it.catalogId}
                        className={cn(
                          "flex items-center gap-3 rounded-md border px-3 py-2.5",
                          isDiff ? "border-status-warning/50 bg-status-warning/5" : "border-border-subtle bg-bg-surface"
                        )}>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{it.name}</p>
                          <p className="text-[10px] text-text-tertiary">
                            طُلب: <span className="font-bold tabular">{it.requestedQty}</span> {it.unit}
                            {isDiff && (
                              <span className={cn("mr-2 font-medium", diff < 0 ? "text-status-danger" : "text-status-success")}>
                                ({diff > 0 ? "+" : ""}{diff} {it.unit})
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button type="button" onClick={() => updateQty(it.catalogId, it.dispatchedQty - 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-status-danger text-white shadow-sm hover:bg-status-danger/85 active:scale-90 transition-all">
                            <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                          <input
                            type="number"
                            value={it.dispatchedQty}
                            onChange={(e) => updateQty(it.catalogId, Number(e.target.value))}
                            className="w-14 h-8 text-center text-sm font-bold tabular border border-border-subtle rounded-sm bg-bg-surface outline-none focus:border-brand-primary"
                          />
                          <button type="button" onClick={() => updateQty(it.catalogId, it.dispatchedQty + 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-status-success text-white shadow-sm hover:bg-status-success/85 active:scale-90 transition-all">
                            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {hasDiff && (
                <div className="mx-5 mt-2 rounded-md border border-status-warning/40 bg-status-warning/8 px-3 py-2.5 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-status-warning shrink-0 mt-0.5" strokeWidth={1.75} />
                  <p className="text-xs text-status-warning leading-relaxed">
                    بعض الكميات تختلف عن الطلب — يجب إضافة ملاحظة لإعلام الفرع
                  </p>
                </div>
              )}

              {/* Driver + Note */}
              <div className="px-5 pt-4 pb-4 space-y-3">
                <div>
                  <label className="block text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-1.5">اسم السائق (اختياري)</label>
                  <input
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="مثال: محمود علي"
                    className="w-full h-10 px-3 rounded-sm text-sm bg-bg-surface border border-border focus:border-brand-primary outline-none tracking-tight transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-1.5">
                    ملاحظة للفرع {hasDiff && <span className="text-status-warning">*</span>}
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="مثال: جبنة الشيدر نقصت بسبب نفاذ المخزون — سيتم إرسال الباقي غداً"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-sm text-sm bg-bg-surface border border-border focus:border-brand-primary outline-none tracking-tight resize-none transition-all placeholder:text-text-tertiary"
                  />
                </div>
              </div>
            </div>

            <div className="shrink-0 px-5 py-4 border-t border-border-subtle bg-bg-surface/60 flex gap-2">
              <button type="button" onClick={onClose}
                className="flex-1 h-11 rounded-sm border border-border bg-bg-surface text-text-secondary text-sm font-medium hover:border-border-strong transition-colors">
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDispatch}
                disabled={hasDiff && !note.trim()}
                className="flex-[2] h-11 rounded-sm bg-brand-primary text-text-on-brand text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-brand-primary-hover disabled:opacity-40 active:scale-[0.98] transition-all"
              >
                <Truck className="w-4 h-4" strokeWidth={2} />
                إرسال الطلب للفرع
              </button>
            </div>
          </>
        ) : (
          /* QR phase */
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-6 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-status-success/15 text-status-success flex items-center justify-center">
              <Check className="w-7 h-7" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">تم إرسال الطلب!</h3>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                الطلب {request.requestNumber} في الطريق إلى {request.branchName}
              </p>
            </div>

            <div className="py-2">
              <p className="text-[11px] tracking-[0.14em] uppercase text-text-tertiary mb-3">
                <QrCode className="w-3.5 h-3.5 inline-block mr-1" strokeWidth={1.75} />
                أعطِ هذا الكود للسائق
              </p>
              <MockQR value={request.requestNumber} />
              <p className="text-xs text-text-tertiary mt-2">
                الفرع سيستخدمه لاستلام الطلب
              </p>
            </div>

            {request.driverName && (
              <Card padding="sm" className="w-full text-right">
                <p className="text-[10px] text-text-tertiary">السائق</p>
                <p className="text-sm font-medium mt-0.5">{request.driverName}</p>
              </Card>
            )}

            <button type="button" onClick={onClose}
              className="w-full h-11 rounded-sm bg-brand-primary text-text-on-brand text-sm font-medium hover:bg-brand-primary-hover transition-all">
              تم ✓
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
