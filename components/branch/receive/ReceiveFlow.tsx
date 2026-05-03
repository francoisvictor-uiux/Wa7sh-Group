"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  QrCode, Search, ArrowLeft, ChevronLeft, Truck, AlertTriangle,
  CheckCircle2, Package, X, MessageSquare, ArrowRight, Lock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRequestsDB } from "@/lib/db/requests";
import { type FactoryRequest } from "@/lib/mock/factoryRequests";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { QRScanner } from "./QRScanner";
import { cn } from "@/lib/utils";

type Phase = "scan" | "review" | "driver-confirm" | "disputed";

/* ══════════════════════════════════════════════════════════════════════════
 * Slide-to-confirm button
 * ══════════════════════════════════════════════════════════════════════════ */

function SlideToConfirm({
  label,
  sublabel,
  color = "success",
  onConfirm,
}: {
  label: string;
  sublabel?: string;
  color?: "success" | "danger";
  onConfirm: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);
  const dragging = useRef(false);

  const colorClass = color === "success"
    ? { track: "bg-status-success/15", thumb: "bg-status-success", text: "text-status-success" }
    : { track: "bg-status-danger/15", thumb: "bg-status-danger", text: "text-status-danger" };

  const onPointerDown = (e: React.PointerEvent) => {
    if (done) return;
    dragging.current = true;
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !trackRef.current) return;
    const trackW = trackRef.current.offsetWidth - 56;
    const moved = Math.max(0, Math.min(1, (e.clientX - startX.current) / trackW));
    setProgress(moved);
    if (moved >= 0.95) {
      dragging.current = false;
      setProgress(1);
      setDone(true);
      setTimeout(onConfirm, 300);
    }
  };

  const onPointerUp = () => {
    if (!done) { dragging.current = false; setProgress(0); }
  };

  return (
    <div className="space-y-1.5">
      <div
        ref={trackRef}
        className={cn("relative h-14 rounded-full overflow-hidden select-none", colorClass.track)}
      >
        {/* Fill */}
        <div
          className={cn("absolute inset-y-0 right-0 rounded-full transition-none", colorClass.thumb, "opacity-20")}
          style={{ width: `${progress * 100}%` }}
        />
        {/* Label */}
        {!done && (
          <div className={cn("absolute inset-0 flex items-center justify-center gap-2 text-sm font-bold tracking-tight pointer-events-none", colorClass.text)}>
            <ArrowRight className="w-4 h-4 opacity-60" strokeWidth={2.5} />
            {label}
          </div>
        )}
        {done && (
          <div className={cn("absolute inset-0 flex items-center justify-center gap-2 text-sm font-bold tracking-tight pointer-events-none", colorClass.text)}>
            <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
            تم!
          </div>
        )}
        {/* Thumb */}
        {!done && (
          <div
            className={cn(
              "absolute top-1 bottom-1 right-1 w-12 rounded-full flex items-center justify-center text-white shadow-md cursor-grab active:cursor-grabbing transition-transform",
              colorClass.thumb
            )}
            style={{ transform: `translateX(-${progress * (trackRef.current ? trackRef.current.offsetWidth - 56 : 0)}px)` }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </div>
        )}
      </div>
      {sublabel && <p className="text-[11px] text-text-tertiary text-center">{sublabel}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
 * Main receive flow
 * ══════════════════════════════════════════════════════════════════════════ */

export function ReceiveFlow() {
  const { user } = useAuth();
  const { requests, branchConfirm, driverConfirm, openDispute, seedDemoInTransit } = useRequestsDB();

  const [phase, setPhase] = useState<Phase>("scan");
  const [scanInput, setScanInput] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [scanError, setScanError] = useState<string>("");
  const [verifiedItems, setVerifiedItems] = useState(false);
  const [order, setOrder] = useState<FactoryRequest | null>(null);
  const [receiveNote, setReceiveNote] = useState("");
  const [showDispute, setShowDispute] = useState(false);
  const [disputeType, setDisputeType] = useState<"factory" | "driver" | null>(null);
  const [disputeDesc, setDisputeDesc] = useState("");
  const [branchDone, setBranchDone] = useState(false);

  const branchId = user?.branchId ?? "";

  // In-transit orders for this branch
  const inTransitOrders = requests.filter(
    (r) => r.branchId === branchId && r.status === "in-transit"
  );

  function loadOrder(req: FactoryRequest) {
    setOrder(req);
    setPhase("review");
    setScanInput("");
  }

  /**
   * Manual entry — try to find a matching in-transit order for this branch
   * by request number. No token validation since the user typed it; we
   * trust them to be standing in front of the driver.
   */
  function handleScanSearch(value?: string) {
    const q = (value ?? scanInput).trim().toLowerCase();
    if (!q) return;
    const found = requests.find(
      (r) => (r.requestNumber.toLowerCase().includes(q) || r.id.toLowerCase() === q)
        && r.branchId === branchId
    );
    if (!found) {
      setScanError(`لم يتم العثور على طلب برقم: ${value ?? scanInput}`);
      return;
    }
    if (found.status !== "in-transit") {
      setScanError(`الطلب ${found.requestNumber} ليس في الطريق حالياً (${found.status})`);
      return;
    }
    loadOrder(found);
    setScanError("");
  }

  /**
   * QR scan — the QR contains a structured JSON payload. Validate it
   * fully before loading the order:
   *   1. Parseable JSON
   *   2. Order exists for this branch
   *   3. Status is "in-transit"
   *   4. Token matches the one stored at dispatch
   *   5. Not expired (issued_at + expires_in still in the future)
   */
  function handleQRScan(value: string) {
    let payload: { order_id?: string; token?: string; issued_at?: string; expires_in?: number };
    try {
      payload = JSON.parse(value);
    } catch {
      // Fall back: maybe the QR is just a plain request number (legacy)
      handleScanSearch(value);
      return;
    }

    const found = requests.find(
      (r) => r.requestNumber === payload.order_id && r.branchId === branchId
    );

    if (!found) {
      setScanError("هذا الكود لا يطابق أي طلب لفرعك");
      return;
    }
    if (found.status !== "in-transit") {
      setScanError(`الطلب ${found.requestNumber} ليس في الطريق — ربما تم استلامه مسبقاً`);
      return;
    }
    if (!payload.token || payload.token !== found.dispatchToken) {
      setScanError("الكود غير صحيح — الرمز الأمني لا يطابق الطلب");
      return;
    }
    if (payload.issued_at && payload.expires_in) {
      const issuedAt = new Date(payload.issued_at).getTime();
      const expiresAt = issuedAt + payload.expires_in * 1000;
      if (Date.now() > expiresAt) {
        setScanError("انتهت صلاحية الكود — اطلب من المصنع إصدار كود جديد");
        return;
      }
    }
    loadOrder(found);
    setScanError("");
  }

  function handleBranchConfirm() {
    if (!order) return;
    branchConfirm(order.id, receiveNote || undefined);
    setBranchDone(true);
    setPhase("driver-confirm");
  }

  function handleDriverConfirm() {
    if (!order) return;
    driverConfirm(order.id);
    // Reload order from updated requests
    const updated = requests.find((r) => r.id === order.id);
    if (updated) setOrder({ ...updated, status: "confirmed" });
  }

  function handleDispute() {
    if (!order || !disputeType || !disputeDesc.trim()) return;
    openDispute(order.id, disputeType, disputeDesc);
    setPhase("disputed");
  }

  /* ── Diff helpers ── */
  function getDiff(item: FactoryRequest["items"][0]) {
    if (!order?.dispatchItems) return null;
    const di = order.dispatchItems.find((d) => d.catalogId === item.catalogId);
    if (!di) return null;
    return di.dispatchedQty - item.requestedQty;
  }

  const items = order?.items ?? [];
  const dispatchItems = order?.dispatchItems;
  const hasDiffs = dispatchItems?.some((d) => {
    const orig = items.find((it) => it.catalogId === d.catalogId);
    return orig && d.dispatchedQty !== orig.requestedQty;
  }) ?? false;

  /* ════════════════════════════════════════════════════════════════════
   * RENDER
   * ════════════════════════════════════════════════════════════════════ */

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Top bar */}
      <header className="sticky top-0 z-10 px-6 py-4 border-b border-border-subtle bg-bg-canvas/90 backdrop-blur-md">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Link href="/requests" className="text-text-secondary hover:text-brand-primary transition-colors">
            <ArrowLeft className="w-5 h-5 rotate-180" strokeWidth={2} />
          </Link>
          <div className="gold-hairline-vert h-5" />
          <div>
            <p className="text-[10px] tracking-[0.16em] uppercase text-text-tertiary">RECEIVE ORDER</p>
            <h1 className="text-base font-bold tracking-tight">استلام من المصنع</h1>
          </div>
          {phase !== "scan" && order && (
            <div className="mr-auto">
              <Badge intent="info" size="sm">{order.requestNumber}</Badge>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full space-y-5">

        {/* ── PHASE: SCAN ── */}
        {phase === "scan" && (
          <div className="space-y-6">
            {/* Scanner heading */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/12 text-brand-primary flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight">امسح كود QR من السائق</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">
                  وجّه الكاميرا للكود الموجود مع الشحنة
                </p>
              </div>
            </div>

            {/* Camera scanner */}
            {!showManual ? (
              <QRScanner
                onScan={handleQRScan}
                onManual={() => setShowManual(true)}
              />
            ) : (
              <Card padding="lg" className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-tight">إدخال رقم الطلب يدوياً</p>
                  <button type="button" onClick={() => { setShowManual(false); setScanError(""); setScanInput(""); }}
                    className="text-[11px] text-brand-primary hover:underline">
                    العودة للكاميرا
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" strokeWidth={1.75} />
                    <input
                      autoFocus
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleScanSearch()}
                      placeholder="مثال: #REQ-1049"
                      className="w-full h-11 pr-10 pl-3 rounded-sm border border-border focus:border-brand-primary focus:shadow-glow-brand bg-bg-surface outline-none text-sm tracking-tight transition-all"
                    />
                  </div>
                  <button type="button" onClick={() => handleScanSearch()}
                    className="h-11 px-4 rounded-sm bg-brand-primary text-text-on-brand text-sm font-medium hover:bg-brand-primary-hover transition-all">
                    بحث
                  </button>
                </div>
              </Card>
            )}

            {/* Scan error */}
            {scanError && (
              <div className="rounded-md border border-status-danger/40 bg-status-danger/8 px-4 py-2.5 text-xs text-status-danger">
                {scanError}
              </div>
            )}

            {/* In-transit orders */}
            {inTransitOrders.length > 0 && (
              <div className="space-y-3">
                <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary">طلبات في الطريق إليك</p>
                {inTransitOrders.map((req) => (
                  <button key={req.id} type="button" onClick={() => loadOrder(req)} className="w-full text-right group">
                    <Card padding="md" className="hover:border-brand-primary/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-fast group-active:scale-[0.99]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-status-info/15 text-status-info flex items-center justify-center shrink-0">
                          <Truck className="w-4 h-4" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold tabular tracking-tight">{req.requestNumber}</p>
                          <p className="text-[11px] text-text-tertiary mt-0.5">
                            {req.items.length} صنف
                            {req.driverName && ` · السائق: ${req.driverName}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {req.dispatchItems?.some((d) => {
                            const orig = req.items.find((it) => it.catalogId === d.catalogId);
                            return orig && d.dispatchedQty !== orig.requestedQty;
                          }) && (
                            <Badge intent="warning" size="sm">
                              <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                              فرق في الكميات
                            </Badge>
                          )}
                          <ChevronLeft className="w-4 h-4 text-text-tertiary group-hover:text-brand-primary transition-colors" strokeWidth={2} />
                        </div>
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            )}

            {inTransitOrders.length === 0 && (
              <div className="text-center py-10">
                <Package className="w-10 h-10 text-text-tertiary mx-auto mb-3" strokeWidth={1.25} />
                <p className="text-sm font-medium text-text-secondary">لا توجد طلبات في الطريق حالياً</p>
                <p className="text-xs text-text-tertiary mt-1 mb-5">ستظهر هنا عندما يرسل المصنع طلبك</p>

                {/* Demo helper — generates a fully-populated in-transit order
                    so a single account can test the receive flow end-to-end */}
                <button
                  type="button"
                  onClick={() => {
                    if (!user?.branchId) return;
                    const req = seedDemoInTransit(
                      user.branchId,
                      "فرع العصافرة",
                      user.brandId ?? "wahsh"
                    );
                    loadOrder(req);
                  }}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-sm border border-brand-primary/40 text-brand-primary text-xs font-medium hover:bg-brand-primary/8 transition-all"
                >
                  <Package className="w-3.5 h-3.5" strokeWidth={2} />
                  أنشئ طلب تجريبي للاختبار
                </button>
                <p className="text-[10px] text-text-tertiary mt-2 max-w-[260px] mx-auto leading-relaxed">
                  يُنشِئ طلباً وهمياً جاهزاً للاستلام مع كود QR صالح لتجربة كامل الخطوات
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── PHASE: REVIEW ── */}
        {phase === "review" && order && (
          <div className="space-y-4">
            {/* Order header */}
            <Card padding="md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-text-tertiary">طلب من المصنع</p>
                  <p className="text-xl font-bold tabular tracking-tight mt-0.5">{order.requestNumber}</p>
                  <p className="text-xs text-text-tertiary mt-1">
                    {order.items.length} صنف
                    {order.driverName && ` · السائق: ${order.driverName}`}
                  </p>
                </div>
                <Badge intent="info" size="sm" dot pulse>في الطريق</Badge>
              </div>
            </Card>

            {/* Factory note if present */}
            {order.dispatchNote && (
              <div className="rounded-md border border-status-warning/40 bg-status-warning/8 px-4 py-3 flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-status-warning shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="text-xs font-bold text-status-warning mb-0.5">ملاحظة من المصنع</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{order.dispatchNote}</p>
                </div>
              </div>
            )}

            {/* Items comparison */}
            <div className="rounded-lg border border-border-subtle overflow-hidden">
              <div className="px-4 py-2.5 bg-bg-muted/30 border-b border-border-subtle flex items-center justify-between">
                <p className="text-[10px] tracking-[0.16em] uppercase text-text-tertiary font-semibold">مقارنة الكميات</p>
                {hasDiffs && (
                  <Badge intent="warning" size="sm">
                    <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                    كميات مختلفة
                  </Badge>
                )}
              </div>

              {/* Table header */}
              <div className="grid grid-cols-4 px-4 py-2 bg-bg-muted/20 border-b border-border-subtle text-[10px] text-text-tertiary font-medium tracking-[0.12em] uppercase">
                <span className="col-span-2">الصنف</span>
                <span className="text-center">طُلب</span>
                <span className="text-center">أُرسل</span>
              </div>

              <ul className="divide-y divide-border-subtle">
                {order.items.map((item) => {
                  const dispatched = dispatchItems?.find((d) => d.catalogId === item.catalogId);
                  const sentQty = dispatched?.dispatchedQty ?? item.requestedQty;
                  const diff = sentQty - item.requestedQty;
                  const hasDiff = diff !== 0;
                  return (
                    <li key={item.catalogId}
                      className={cn("grid grid-cols-4 items-center px-4 py-3", hasDiff && "bg-status-warning/5")}>
                      <div className="col-span-2 min-w-0">
                        <p className="text-xs font-medium truncate">{item.name}</p>
                        <p className="text-[10px] text-text-tertiary">{item.unit}</p>
                      </div>
                      <p className="text-center text-sm font-bold tabular text-text-secondary">{item.requestedQty}</p>
                      <div className="text-center">
                        <p className={cn("text-sm font-bold tabular", hasDiff ? "text-status-warning" : "text-status-success")}>
                          {sentQty}
                        </p>
                        {hasDiff && (
                          <p className={cn("text-[10px] font-medium", diff < 0 ? "text-status-danger" : "text-status-success")}>
                            {diff > 0 ? "+" : ""}{diff}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Receive note */}
            <div>
              <label className="block text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-1.5">
                ملاحظتك على الاستلام (اختياري)
              </label>
              <textarea
                value={receiveNote}
                onChange={(e) => setReceiveNote(e.target.value)}
                placeholder="مثال: تم الاستلام بحضور السائق — كل الأصناف مطابقة"
                rows={2}
                className="w-full px-3 py-2.5 rounded-sm text-sm bg-bg-surface border border-border focus:border-brand-primary outline-none tracking-tight resize-none transition-all placeholder:text-text-tertiary"
              />
            </div>

            {/* Verification gate — must check this to unlock slide-to-confirm.
                Forces a deliberate review step before the destructive action. */}
            <label className={cn(
              "flex items-start gap-3 p-3.5 rounded-md border cursor-pointer transition-all",
              verifiedItems
                ? "border-status-success/50 bg-status-success/5"
                : "border-border-subtle bg-bg-surface hover:border-border-strong"
            )}>
              <input
                type="checkbox"
                checked={verifiedItems}
                onChange={(e) => setVerifiedItems(e.target.checked)}
                className="sr-only peer"
              />
              <span className={cn(
                "shrink-0 w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-all mt-0.5",
                verifiedItems
                  ? "bg-status-success border-status-success text-white"
                  : "border-border-strong bg-bg-canvas"
              )}>
                {verifiedItems && <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium tracking-tight">
                  راجعت كل الكميات مع السائق
                </p>
                <p className="text-[11px] text-text-tertiary mt-0.5 leading-relaxed">
                  بمجرد التأكيد، تُضاف الكميات لمخزون الفرع ولا يمكن التراجع
                </p>
              </div>
            </label>

            {/* Actions */}
            <div className="space-y-3 pb-4">
              {verifiedItems ? (
                <SlideToConfirm
                  label="اسحب لتأكيد الاستلام"
                  sublabel="ستُحدَّث حالة الطلب وحالة المخزون فوراً"
                  color="success"
                  onConfirm={handleBranchConfirm}
                />
              ) : (
                <div className="h-14 rounded-full bg-bg-surface-raised/60 border border-dashed border-border-subtle flex items-center justify-center gap-2 text-xs text-text-tertiary">
                  <Lock className="w-3.5 h-3.5" strokeWidth={1.75} />
                  أكّد المراجعة أعلاه لتفعيل التأكيد
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowDispute(true)}
                className="w-full h-11 rounded-sm border border-status-danger/40 text-status-danger text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-status-danger/8 transition-all"
              >
                <AlertTriangle className="w-4 h-4" strokeWidth={1.75} />
                الإبلاغ عن نزاع
              </button>
            </div>
          </div>
        )}

        {/* ── PHASE: DRIVER CONFIRM ── */}
        {phase === "driver-confirm" && order && (
          <div className="space-y-5">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-status-success/15 text-status-success flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-bold tracking-tight">أكّدت الاستلام ✓</h2>
              <p className="text-sm text-text-secondary mt-1">
                {order.requestNumber} · {order.branchName}
              </p>
            </div>

            <Card padding="lg" className="border-brand-primary/30 bg-brand-primary/5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold tracking-tight">تأكيد السائق</p>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                    {order.driverName
                      ? `${order.driverName} — يرجى تمرير الهاتف للسائق ليؤكد أن الكميات صحيحة`
                      : "يرجى تمرير الهاتف للسائق ليؤكد أن الكميات صحيحة"}
                  </p>
                </div>
              </div>
            </Card>

            <SlideToConfirm
              label="السائق يؤكد الكميات"
              sublabel="اسحب للتأكيد بعد مراجعة الكميات مع مدير الفرع"
              color="success"
              onConfirm={handleDriverConfirm}
            />

            {/* If driver already confirmed (re-render from DB update) */}
            {order.status === "confirmed" && (
              <div className="text-center space-y-3">
                <div className="rounded-md border border-status-success/40 bg-status-success/8 px-4 py-3">
                  <p className="text-sm font-bold text-status-success">تم الاستلام بشكل كامل! 🎉</p>
                  <p className="text-xs text-text-secondary mt-1">أكّد كلا الطرفين — تم تحديث المخزون</p>
                </div>
                <Link href="/requests"
                  className="block w-full h-11 rounded-sm bg-brand-primary text-text-on-brand text-sm font-medium text-center leading-[44px] hover:bg-brand-primary-hover transition-all">
                  العودة للرئيسية
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── PHASE: DISPUTED ── */}
        {phase === "disputed" && order && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-status-danger/15 text-status-danger flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">تم تسجيل النزاع</h2>
              <p className="text-sm text-text-secondary mt-1">{order.requestNumber}</p>
            </div>
            <Card padding="md" className="text-right border-status-danger/30 bg-status-danger/5">
              <p className="text-[10px] tracking-[0.14em] uppercase text-text-tertiary mb-1">نوع النزاع</p>
              <p className="text-sm font-bold text-status-danger">
                {order.disputeType === "factory" ? "تحميل على المصنع" : "تحميل على السائق"}
              </p>
              {order.disputeDescription && (
                <>
                  <p className="text-[10px] tracking-[0.14em] uppercase text-text-tertiary mt-3 mb-1">الوصف</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{order.disputeDescription}</p>
                </>
              )}
            </Card>
            <p className="text-xs text-text-tertiary">سيتم مراجعة النزاع من قِبل المسؤول</p>
            <Link href="/requests"
              className="block w-full h-11 rounded-sm bg-brand-primary text-text-on-brand text-sm font-medium text-center leading-[44px] hover:bg-brand-primary-hover transition-all">
              العودة للرئيسية
            </Link>
          </div>
        )}
      </div>

      {/* ── DISPUTE MODAL ── */}
      {showDispute && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowDispute(false)} />
          <div className="fixed inset-x-4 bottom-4 z-50 rounded-2xl bg-bg-canvas border border-border-subtle shadow-2xl p-5 space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold tracking-tight">الإبلاغ عن نزاع</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">{order?.requestNumber}</p>
              </div>
              <button type="button" onClick={() => setShowDispute(false)}
                className="w-8 h-8 rounded-sm flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-surface-raised transition-all">
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            {/* Dispute type */}
            <div className="grid grid-cols-2 gap-2">
              <button type="button"
                onClick={() => setDisputeType("factory")}
                className={cn(
                  "h-14 rounded-md border text-sm font-medium tracking-tight transition-all",
                  disputeType === "factory"
                    ? "bg-status-danger/12 border-status-danger text-status-danger"
                    : "bg-bg-surface border-border-subtle text-text-secondary hover:border-border-strong"
                )}>
                🏭 تحميل على المصنع
              </button>
              <button type="button"
                onClick={() => setDisputeType("driver")}
                className={cn(
                  "h-14 rounded-md border text-sm font-medium tracking-tight transition-all",
                  disputeType === "driver"
                    ? "bg-status-warning/12 border-status-warning text-status-warning"
                    : "bg-bg-surface border-border-subtle text-text-secondary hover:border-border-strong"
                )}>
                🚛 تحميل على السائق
              </button>
            </div>

            <textarea
              value={disputeDesc}
              onChange={(e) => setDisputeDesc(e.target.value)}
              placeholder="اشرح المشكلة بالتفصيل — مثال: نقصت 8 كجم لحم برجر ولم يُذكر ذلك في ملاحظة المصنع"
              rows={3}
              className="w-full px-3 py-2.5 rounded-sm text-sm bg-bg-surface border border-border focus:border-status-danger outline-none tracking-tight resize-none transition-all placeholder:text-text-tertiary"
            />

            <button
              type="button"
              onClick={handleDispute}
              disabled={!disputeType || !disputeDesc.trim()}
              className="w-full h-11 rounded-sm bg-status-danger text-white text-sm font-medium disabled:opacity-40 hover:bg-status-danger/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" strokeWidth={2} />
              تأكيد تسجيل النزاع
            </button>
          </div>
        </>
      )}
    </div>
  );
}
