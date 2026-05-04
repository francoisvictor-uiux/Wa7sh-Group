"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  User,
  AlertCircle,
  Check,
  X,
  Edit,
  Zap,
  MessageSquare,
  ChefHat,
  Truck,
  Minus,
  Plus,
} from "lucide-react";
import { DispatchPanel } from "@/components/factory/requests/DispatchPanel";
import { useDevice } from "@/hooks/useDevice";
import { useAuth } from "@/hooks/useAuth";
import { useRequestsDB } from "@/lib/db/requests";
import { requests, type RequestRecord } from "@/lib/mock/requests";
import type { FactoryRequest } from "@/lib/mock/factoryRequests";
import { factoryStock } from "@/lib/mock/factoryInventory";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RequestStatusPill } from "./RequestStatusPill";
import { RequestTimeline } from "./RequestTimeline";
import { SwipeApproval } from "./SwipeApproval";
import { cn } from "@/lib/utils";

/** Adapt a FactoryRequest (DB document) to the RequestRecord shape used by
 * the existing detail UI. Lets DB-created requests render through the same
 * component without a parallel implementation. Defensive against stale or
 * partial localStorage data — every field has a fallback. */
function adaptFactoryRequest(r: FactoryRequest): RequestRecord {
  const items = Array.isArray(r.items) ? r.items : [];
  return {
    id: r.id ?? "",
    number: r.requestNumber ?? "—",
    status: r.status ?? "requested",
    fromBranchId: r.branchId ?? "",
    fromBranchName: r.branchName ?? "—",
    toFactory: "المصنع الرئيسي",
    createdBy: r.createdBy ?? "—",
    createdAt: r.createdAt ?? "—",
    approvedBy: r.approvedBy,
    approvedAt: r.approvedAt,
    adjustmentNote: r.adjustmentNote,
    adjustedBy: r.adjustedBy,
    adjustedAt: r.adjustedAt,
    scheduledDelivery: r.requestedDeliveryDate,
    items: items.map((it) => ({
      catalogId: it.catalogId ?? "",
      name: it.name ?? "—",
      quantity: it.requestedQty ?? 0,
      adjustedQty: it.approvedQty,
      unit: (it.unit as any) ?? "حبة",
      pricePerUnit: 0,
    })),
    totalValue: 0,
    itemCount: items.length,
    priority: r.priority === "urgent" ? "rush" : "normal",
    note: r.note,
    isForMyApproval: r.status === "requested",
  };
}

function arabicDateTime(date = new Date()): string {
  return (
    date.toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" }) +
    " · " +
    date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
  );
}

/** Look up current factory stock for a request item by name match. */
function findStock(itemName: string) {
  return factoryStock.find((s) => s.name === itemName);
}

export function RequestDetail({ requestId }: { requestId: string }) {
  const device = useDevice();
  const router = useRouter();
  const { user } = useAuth();
  const { requests: dbRequests, updateStatus, updateItems } = useRequestsDB();
  // Look up in the static mock first, then in the live DB. DB-created
  // requests are adapted into the RequestRecord shape on the fly.
  const dbHit = (dbRequests ?? []).find((r) => r?.id === requestId);
  const staticHit = requests.find((r) => r.id === requestId);
  const request = staticHit ?? (dbHit ? adaptFactoryRequest(dbHit) : requests[0]);

  // Guard against a missing request — happens if requestId doesn't match
  // anything (bad/expired link, cleared DB, etc.) and the mock list is
  // somehow empty too. Render a friendly fallback instead of crashing.
  if (!request) {
    return (
      <div className="px-8 py-12 max-w-md mx-auto text-center space-y-4">
        <p className="text-base font-bold tracking-tight">لم يتم العثور على الطلب</p>
        <p className="text-sm text-text-tertiary">
          الطلب غير موجود — ربما تم حذفه أو الرابط منتهي الصلاحية.
        </p>
        <Link href="/requests" className="inline-flex items-center justify-center h-10 px-5 rounded-sm bg-brand-primary text-text-on-brand text-sm font-medium">
          العودة لكل الطلبات
        </Link>
      </div>
    );
  }
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedQty, setEditedQty] = useState<Record<string, number>>({});
  const [editNote, setEditNote] = useState("");

  // Only factory-scope users can approve/reject — branch users cannot
  const isFactory = user?.scope === "factory" || user?.scope === "group";
  const canApprove   = isFactory && Boolean(request.isForMyApproval) && !approved && !rejected;
  const canStartPrep = isFactory && request.status === "approved";
  const canDispatch  = isFactory && request.status === "preparing";

  const handleApprove = () => {
    setApproved(true);
    if (dbHit) {
      updateStatus(dbHit.id, "approved", {
        approvedBy: user?.name ?? "—",
        approvedAt: arabicDateTime(),
      });
    }
    window.setTimeout(() => router.push("/requests"), 700);
  };

  const handleReject = () => {
    setRejected(true);
    if (dbHit) {
      updateStatus(dbHit.id, "rejected", {
        rejectedBy: user?.name ?? "—",
        rejectedAt: arabicDateTime(),
      });
    }
    window.setTimeout(() => router.push("/requests"), 700);
  };

  const handleStartPrep = () => {
    if (dbHit) updateStatus(dbHit.id, "preparing");
  };

  const handleOpenDispatch = () => setDispatchOpen(true);

  const handleStartEdit = () => {
    const seed: Record<string, number> = {};
    request.items.forEach((it) => { seed[it.catalogId] = it.adjustedQty ?? it.quantity; });
    setEditedQty(seed);
    setEditNote(request.adjustmentNote ?? "");
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedQty({});
    setEditNote("");
  };

  const handleSaveEdit = () => {
    if (dbHit) {
      const adjustments = dbHit.items.map((it) => ({
        catalogId: it.catalogId,
        approvedQty: Math.max(0, editedQty[it.catalogId] ?? it.requestedQty),
      }));
      updateItems(dbHit.id, adjustments, { note: editNote.trim(), by: user?.name });
    }
    setEditMode(false);
    setEditNote("");
  };

  // Did the factory actually change anything from the original?
  const hasAnyChange = request.items.some((it) => {
    const edited = editedQty[it.catalogId];
    return edited != null && edited !== it.quantity;
  });

  const editValid = editNote.trim().length >= 3 && hasAnyChange;

  const setItemQty = (catalogId: string, qty: number) => {
    // Factory can only decrease — cap at the original requested quantity.
    const item = dbHit?.items.find((i) => i.catalogId === catalogId);
    const max = item?.requestedQty ?? Infinity;
    setEditedQty((prev) => ({ ...prev, [catalogId]: Math.max(0, Math.min(max, qty)) }));
  };

  const props = {
    request,
    canApprove, canStartPrep, canDispatch,
    isFactory, approved, rejected,
    editMode, editedQty, editNote, editValid,
    onApprove: handleApprove,
    onReject: handleReject,
    onStartPrep: handleStartPrep,
    onOpenDispatch: handleOpenDispatch,
    onStartEdit: handleStartEdit,
    onCancelEdit: handleCancelEdit,
    onSaveEdit: handleSaveEdit,
    onItemQtyChange: setItemQty,
    onEditNoteChange: setEditNote,
  };

  const view =
    device === "mobile"  ? <RequestDetailMobile  {...props} /> :
    device === "desktop" ? <RequestDetailDesktop {...props} /> :
                           <RequestDetailTablet  {...props} />;

  return (
    <>
      {view}
      {dispatchOpen && dbHit && (
        <DispatchPanel request={dbHit} onClose={() => setDispatchOpen(false)} />
      )}
    </>
  );
}

/* =======================================================================
   Mobile — single column, vertical timeline, swipe approval
   ======================================================================= */

interface DetailViewProps {
  request: RequestRecord;
  canApprove: boolean;
  canStartPrep: boolean;
  canDispatch: boolean;
  isFactory: boolean;
  approved: boolean;
  rejected: boolean;
  editMode: boolean;
  editedQty: Record<string, number>;
  editNote: string;
  editValid: boolean;
  onApprove: () => void;
  onReject: () => void;
  onStartPrep: () => void;
  onOpenDispatch: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onItemQtyChange: (catalogId: string, qty: number) => void;
  onEditNoteChange: (v: string) => void;
}

function RequestDetailMobile({ request, canApprove, canStartPrep, canDispatch, isFactory, approved, rejected, editMode, editedQty, editNote, editValid, onApprove, onReject, onStartPrep, onOpenDispatch, onStartEdit, onCancelEdit, onSaveEdit, onItemQtyChange, onEditNoteChange }: DetailViewProps) {
  return (
    <div className="px-4 pt-4 pb-24 space-y-4">
      <Link href="/requests" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors">
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        كل الطلبات
      </Link>

      {/* Header */}
      <Card padding="md">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-1">رقم الطلب</p>
            <p className="text-xl font-bold tabular tracking-tight">{request.number}</p>
          </div>
          <RequestStatusPill status={request.status} size="md" pulse={request.status === "requested"} />
        </div>
        {request.priority === "rush" && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-status-danger/12 border border-status-danger/30">
            <Zap className="w-3 h-3 text-status-danger" strokeWidth={2.5} />
            <span className="text-xs font-medium text-status-danger tracking-tight">طلب طارئ — أولوية قصوى</span>
          </div>
        )}
        {/* Meta only for factory */}
        {isFactory && (
          <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-border-subtle">
            <Meta icon={<Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />} label="من" value={request.fromBranchName} />
            <Meta icon={<User className="w-3.5 h-3.5" strokeWidth={1.75} />} label="بواسطة" value={request.createdBy} />
            <Meta icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />} label="الإنشاء" value={request.createdAt} />
          </div>
        )}
      </Card>

      {/* Note — factory only */}
      {isFactory && request.note && (
        <Card padding="md" className="bg-status-info/8 border-status-info/30">
          <div className="flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 text-status-info shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="text-xs font-medium tracking-tight mb-1">ملاحظة من المُرسِل</p>
              <p className="text-xs text-text-secondary leading-relaxed">{request.note}</p>
            </div>
          </div>
        </Card>
      )}

      <AdjustmentNotice request={request} />

      {/* Timeline */}
      <Card padding="md">
        <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">
          مسار الطلب
        </p>
        <RequestTimeline request={request} orientation="vertical" />
      </Card>

      {/* Items */}
      <Card padding="none">
        <div className="px-4 pt-4 pb-2 border-b border-border-subtle flex items-center justify-between">
          <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary">
            الأصناف ({request.itemCount}) {editMode && <span className="text-status-info font-medium">· تعديل</span>}
          </p>
          {isFactory && canApprove && !editMode && (
            <button
              type="button"
              onClick={onStartEdit}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-primary hover:underline"
            >
              <Edit className="w-3 h-3" strokeWidth={2} />
              تعديل
            </button>
          )}
        </div>
        <ul>
          {request.items.map((it) => {
            const editedQ = editedQty[it.catalogId] ?? it.adjustedQty ?? it.quantity;
            const editDiff = editedQ - it.quantity;
            const persistedAdjust = it.adjustedQty != null && it.adjustedQty !== it.quantity;
            const persistedDiff = (it.adjustedQty ?? it.quantity) - it.quantity;
            const stock = isFactory ? findStock(it.name) : null;
            const stockEnough = stock ? stock.currentQty >= (it.adjustedQty ?? it.quantity) : null;
            return (
              <li
                key={it.catalogId}
                className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border-subtle last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium tracking-tight truncate">{it.name}</p>
                  <p className="text-[11px] text-text-tertiary tabular">/{it.unit}</p>
                  {stock && (
                    <p className={cn("text-[11px] mt-0.5 font-medium tabular", stockEnough ? "text-status-success" : "text-status-danger")}>
                      المخزون: {stock.currentQty} {stock.unit}{!stockEnough && " — أقل من المطلوب"}
                    </p>
                  )}
                  {editMode && editDiff !== 0 && (
                    <p className={cn("text-[11px] mt-0.5 font-medium tabular", editDiff > 0 ? "text-status-success" : "text-status-danger")}>
                      الأصلي: {it.quantity} ({editDiff > 0 ? "+" : ""}{editDiff})
                    </p>
                  )}
                </div>
                <div className="text-left shrink-0">
                  {editMode ? (
                    <QtyControl value={editedQ} unit={it.unit} max={it.quantity} onChange={(v) => onItemQtyChange(it.catalogId, v)} />
                  ) : persistedAdjust ? (
                    <div className="text-left">
                      <p className="text-[11px] text-text-tertiary tabular line-through">طُلب: {it.quantity}</p>
                      <p className={cn("text-sm font-bold tabular tracking-tight inline-flex items-center gap-1", persistedDiff > 0 ? "text-status-success" : "text-status-danger")}>
                        {it.adjustedQty} {it.unit}
                        <span className="text-[10px] font-medium">({persistedDiff > 0 ? "+" : ""}{persistedDiff})</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-bold tabular tracking-tight">{it.quantity} {it.unit}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="px-4 py-3 border-t border-border-subtle bg-bg-surface-raised/40">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-text-secondary">الإجمالي</span>
            <span className="text-xl font-bold tabular tracking-tight">
              {request.itemCount}
              <span className="text-xs text-text-tertiary font-normal mr-1">صنف</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Approval actions — sticky bottom */}
      {canApprove && !editMode && (
        <div
          className={cn(
            "fixed bottom-[68px] inset-x-0 z-20",
            "bg-bg-canvas/95 backdrop-blur-md border-t border-border-subtle",
            "px-4 py-4"
          )}
        >
          <p className="text-xs text-text-secondary text-center mb-3 tracking-tight">
            اسحب للموافقة ⏶ أو الرفض ⏷
          </p>
          <SwipeApproval onApprove={onApprove} onReject={onReject} />
        </div>
      )}

      {/* Edit-mode actions — sticky bottom */}
      {canApprove && editMode && (
        <div
          className={cn(
            "fixed bottom-[68px] inset-x-0 z-20",
            "bg-bg-canvas/95 backdrop-blur-md border-t border-border-subtle",
            "px-4 py-3 space-y-3 max-h-[60vh] overflow-y-auto"
          )}
        >
          <EditNoteField value={editNote} onChange={onEditNoteChange} />
          <div className="space-y-2">
            <Button
              onClick={onSaveEdit}
              size="lg"
              fullWidth
              disabled={!editValid}
              title={!editValid ? "اكتب سبب التعديل وعدّل كمية واحدة على الأقل" : ""}
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
              حفظ التعديلات
            </Button>
            <Button onClick={onCancelEdit} variant="ghost" size="md" fullWidth>
              <X className="w-4 h-4" strokeWidth={2} />
              إلغاء
            </Button>
          </div>
        </div>
      )}

      {/* Post-approval actions — sticky bottom */}
      {!canApprove && (canStartPrep || canDispatch) && (
        <div
          className={cn(
            "fixed bottom-[68px] inset-x-0 z-20",
            "bg-bg-canvas/95 backdrop-blur-md border-t border-border-subtle",
            "px-4 py-3 space-y-2"
          )}
        >
          {canStartPrep && (
            <Button onClick={onStartPrep} variant="secondary" size="lg" fullWidth>
              <ChefHat className="w-4 h-4" strokeWidth={2} />
              بدء التحضير
            </Button>
          )}
          {canDispatch && (
            <Button onClick={onOpenDispatch} size="lg" fullWidth>
              <Truck className="w-4 h-4" strokeWidth={2} />
              إرسال للفرع
            </Button>
          )}
        </div>
      )}

      {/* Confirmation overlays */}
      {(approved || rejected) && (
        <Confirmation type={approved ? "approve" : "reject"} />
      )}
    </div>
  );
}

/* =======================================================================
   Tablet
   ======================================================================= */

function RequestDetailTablet({ request, canApprove, canStartPrep, canDispatch, isFactory, approved, rejected, editMode, editedQty, editNote, editValid, onApprove, onReject, onStartPrep, onOpenDispatch, onStartEdit, onCancelEdit, onSaveEdit, onItemQtyChange, onEditNoteChange }: DetailViewProps) {
  const showSidePanel = canApprove || canStartPrep || canDispatch;
  const editTotal = request.items.reduce((s, i) => {
    const effective = editMode
      ? (editedQty[i.catalogId] ?? i.adjustedQty ?? i.quantity)
      : (i.adjustedQty ?? i.quantity);
    return s + effective;
  }, 0);
  return (
    <div className="px-6 py-6 max-w-[1280px] mx-auto space-y-6">
      <Link
        href="/requests"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        كل الطلبات
      </Link>

      {/* Header */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase">
              رقم الطلب
            </p>
            {request.priority === "rush" && (
              <Badge intent="danger" size="sm">
                <Zap className="w-3 h-3" strokeWidth={2.5} />
                طلب طارئ
              </Badge>
            )}
            {request.isForMyApproval && (
              <Badge intent="warning" size="sm" pulse dot>
                ينتظر موافقتك
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tabular tracking-tight">
            {request.number}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {request.fromBranchName} ← {request.toFactory}
          </p>
        </div>
        <RequestStatusPill
          status={request.status}
          size="md"
          pulse={request.status === "requested"}
        />
      </header>

      {/* Meta strip — factory only */}
      {isFactory && (
        <Card padding="md">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Meta icon={<User className="w-3.5 h-3.5" strokeWidth={1.75} />} label="بواسطة" value={request.createdBy} />
            <Meta icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />} label="الإنشاء" value={request.createdAt} />
            {request.approvedBy && <Meta icon={<Check className="w-3.5 h-3.5" strokeWidth={1.75} />} label="وافق" value={`${request.approvedBy} · ${request.approvedAt}`} />}
          </div>
        </Card>
      )}

      {/* Timeline */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">مسار الطلب</p>
            <h2 className="text-base font-medium tracking-tight">تتبع كامل من الإنشاء للإغلاق</h2>
          </div>
        </div>
        <RequestTimeline request={request} orientation="horizontal" />
      </Card>

      {/* Note — factory only */}
      {isFactory && request.note && (
        <Card padding="md" className="bg-status-info/8 border-status-info/30">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-4 h-4 text-status-info shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-medium tracking-tight mb-1">ملاحظة من المُرسِل</p>
              <p className="text-sm text-text-secondary leading-relaxed">{request.note}</p>
            </div>
          </div>
        </Card>
      )}

      <AdjustmentNotice request={request} />

      {/* Items — full width for branch, with action panel for factory */}
      <div className={cn("grid gap-5", isFactory && showSidePanel ? "grid-cols-1 lg:grid-cols-[1fr_320px]" : "grid-cols-1")}>
        <Card padding="none">
          <div className="px-5 pt-5 pb-3 border-b border-border-subtle">
            <h2 className="text-base font-medium tracking-tight">الأصناف ({request.itemCount})</h2>
            <p className="text-xs text-text-tertiary mt-0.5">{request.items.reduce((s, i) => s + i.quantity, 0)} وحدة إجمالية</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-bg-surface-raised/40 border-b border-border-subtle">
              <tr className="text-right text-[11px] tracking-[0.16em] uppercase text-text-tertiary">
                <th className="px-5 py-2.5 font-medium">الصنف</th>
                <th className="px-5 py-2.5 font-medium text-left">الكمية</th>
              </tr>
            </thead>
            <tbody>
              {request.items.map((it) => {
                const editedQ = editedQty[it.catalogId] ?? it.adjustedQty ?? it.quantity;
                const editDiff = editedQ - it.quantity;
                const persistedAdjust = it.adjustedQty != null && it.adjustedQty !== it.quantity;
                const persistedDiff = (it.adjustedQty ?? it.quantity) - it.quantity;
                const stock = isFactory ? findStock(it.name) : null;
                const stockEnough = stock ? stock.currentQty >= (it.adjustedQty ?? it.quantity) : null;
                return (
                  <tr key={it.catalogId} className="border-b border-border-subtle last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium tracking-tight">{it.name}</p>
                      {stock && (
                        <p className={cn("text-[11px] mt-0.5 font-medium tabular", stockEnough ? "text-status-success" : "text-status-danger")}>
                          المخزون: {stock.currentQty} {stock.unit}{!stockEnough && " — أقل من المطلوب"}
                        </p>
                      )}
                      {editMode && editDiff !== 0 && (
                        <p className={cn("text-[11px] mt-0.5 tabular", editDiff > 0 ? "text-status-success" : "text-status-danger")}>
                          الأصلي: {it.quantity} ({editDiff > 0 ? "+" : ""}{editDiff})
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-2.5 text-left">
                      {editMode ? (
                        <QtyControl
                          value={editedQ}
                          unit={it.unit}
                          max={it.quantity}
                          onChange={(v) => onItemQtyChange(it.catalogId, v)}
                        />
                      ) : persistedAdjust ? (
                        <div className="inline-flex flex-col items-end leading-tight">
                          <span className="text-[11px] text-text-tertiary tabular line-through">طُلب: {it.quantity} {it.unit}</span>
                          <span className={cn("text-sm font-bold tabular inline-flex items-center gap-1", persistedDiff > 0 ? "text-status-success" : "text-status-danger")}>
                            {it.adjustedQty} {it.unit}
                            <span className="text-[10px] font-medium">({persistedDiff > 0 ? "+" : ""}{persistedDiff})</span>
                          </span>
                        </div>
                      ) : (
                        <span className="tabular text-sm font-medium">{it.quantity} {it.unit}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-bg-surface-raised/30">
                <td className="px-5 py-3 text-sm text-text-secondary">إجمالي الكميات</td>
                <td className="px-5 py-3 text-left text-lg font-bold tabular">
                  {editTotal}
                  <span className="text-xs text-text-tertiary font-normal mr-1">وحدة</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </Card>

        {/* Action panel — factory only */}
        {isFactory && canApprove && (
          editMode ? (
            <Card padding="md" className="bg-status-info/8 border-status-info/40 space-y-4">
              <div>
                <p className="text-[11px] tracking-[0.16em] uppercase text-status-info mb-2">وضع التعديل</p>
                <p className="text-sm text-text-secondary leading-relaxed">عدّل الكميات على اليمين، اكتب سبب التعديل، ثم احفظ.</p>
              </div>
              <EditNoteField value={editNote} onChange={onEditNoteChange} />
              <div className="space-y-2">
                <Button
                  onClick={onSaveEdit}
                  size="lg"
                  fullWidth
                  disabled={!editValid}
                  title={!editValid ? "اكتب سبب التعديل وعدّل كمية واحدة على الأقل" : ""}
                >
                  <Check className="w-4 h-4" strokeWidth={2.5} />حفظ التعديلات
                </Button>
                <Button onClick={onCancelEdit} variant="ghost" size="md" fullWidth><X className="w-4 h-4" strokeWidth={2} />إلغاء</Button>
              </div>
            </Card>
          ) : (
            <Card padding="md" className="bg-status-warning/8 border-status-warning/40">
              <p className="text-[11px] tracking-[0.16em] uppercase text-status-warning mb-2">ينتظر قرارك</p>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">هذا الطلب من فرع {request.fromBranchName}. راجع الكميات، ثم وافق أو ارفض.</p>
              <div className="space-y-2">
                <Button onClick={onApprove} size="lg" fullWidth><Check className="w-4 h-4" strokeWidth={2.5} />وافق على الطلب</Button>
                <Button onClick={onReject} variant="danger" size="md" fullWidth><X className="w-4 h-4" strokeWidth={2.5} />ارفض</Button>
                <Button onClick={onStartEdit} variant="ghost" size="md" fullWidth><Edit className="w-4 h-4" strokeWidth={1.75} />عدّل قبل الموافقة</Button>
              </div>
            </Card>
          )
        )}
        {isFactory && !canApprove && (canStartPrep || canDispatch) && (
          <Card padding="md" className="bg-status-info/8 border-status-info/40">
            <p className="text-[11px] tracking-[0.16em] uppercase text-status-info mb-2">
              {canStartPrep ? "جاهز للتحضير" : "جاهز للإرسال"}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              {canStartPrep
                ? "ابدأ تحضير الطلب. بعد التحضير يظهر زر الإرسال للفرع."
                : "حدّد الكميات الفعلية، اختر السائق، والنظام يولّد QR للسائق."}
            </p>
            <div className="space-y-2">
              {canStartPrep && (
                <Button onClick={onStartPrep} size="lg" fullWidth>
                  <ChefHat className="w-4 h-4" strokeWidth={2} />
                  بدء التحضير
                </Button>
              )}
              {canDispatch && (
                <Button onClick={onOpenDispatch} size="lg" fullWidth>
                  <Truck className="w-4 h-4" strokeWidth={2} />
                  إرسال للفرع
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      {(approved || rejected) && (
        <Confirmation type={approved ? "approve" : "reject"} />
      )}
    </div>
  );
}

/* =======================================================================
   Desktop
   ======================================================================= */

function RequestDetailDesktop({ request, canApprove, canStartPrep, canDispatch, isFactory, approved, rejected, editMode, editedQty, editNote, editValid, onApprove, onReject, onStartPrep, onOpenDispatch, onStartEdit, onCancelEdit, onSaveEdit, onItemQtyChange, onEditNoteChange }: DetailViewProps) {
  const editTotal = request.items.reduce((s, i) => {
    const effective = editMode
      ? (editedQty[i.catalogId] ?? i.adjustedQty ?? i.quantity)
      : (i.adjustedQty ?? i.quantity);
    return s + effective;
  }, 0);
  return (
    <div className="px-8 py-7 max-w-[1600px] mx-auto space-y-6">
      <Link
        href="/requests"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        كل الطلبات
      </Link>

      {/* Header */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase">
              رقم الطلب · #{request.id.toUpperCase()}
            </p>
            {request.priority === "rush" && (
              <Badge intent="danger" size="sm">
                <Zap className="w-3 h-3" strokeWidth={2.5} />
                طلب طارئ
              </Badge>
            )}
            {request.isForMyApproval && (
              <Badge intent="warning" size="sm" pulse dot>
                ينتظر موافقتك
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold tabular tracking-tight">
            {request.number}
          </h1>
          <p className="text-sm text-text-secondary mt-2">
            {request.fromBranchName} ← {request.toFactory}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <RequestStatusPill
            status={request.status}
            size="md"
            pulse={request.status === "requested"}
          />
          <p className="text-3xl font-bold tabular tracking-tight">
            {request.itemCount}
            <span className="text-sm text-text-tertiary font-normal mr-1.5">صنف</span>
          </p>
        </div>
      </header>

      <div className="gold-hairline" />

      {/* Timeline strip */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">
              مسار الطلب
            </p>
            <h2 className="text-base font-medium tracking-tight">
              تتبع كامل من الإنشاء للإغلاق
            </h2>
          </div>
          <Badge intent="brand" size="sm">
            7 خطوات
          </Badge>
        </div>
        <RequestTimeline request={request} orientation="horizontal" />
      </Card>

      <div className={cn("grid gap-6", isFactory ? "grid-cols-1 xl:grid-cols-[1fr_400px]" : "grid-cols-1")}>
        {/* Main column */}
        <div className="space-y-5 min-w-0">
          {/* Note — factory only */}
          {isFactory && request.note && (
            <Card padding="md" className="bg-status-info/8 border-status-info/30">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-status-info shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="text-sm font-medium tracking-tight mb-1">ملاحظة من المُرسِل</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{request.note}</p>
                </div>
              </div>
            </Card>
          )}

          <AdjustmentNotice request={request} />

          {/* Items table */}
          <Card padding="none">
            <div className="px-6 pt-6 pb-4 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium tracking-tight">الأصناف</h2>
                <p className="text-xs text-text-tertiary mt-0.5">
                  {request.itemCount} صنف · {editTotal} وحدة {editMode && <span className="text-status-info font-medium">· وضع التعديل</span>}
                </p>
              </div>
              {isFactory && canApprove && !editMode && (
                <Button onClick={onStartEdit} variant="secondary" size="sm">
                  <Edit className="w-3.5 h-3.5" strokeWidth={1.75} />
                  تعديل
                </Button>
              )}
            </div>
            <table className="w-full text-sm">
              <thead className="bg-bg-surface-raised/40 border-b border-border-subtle">
                <tr className="text-right text-[11px] tracking-[0.16em] uppercase text-text-tertiary">
                  <th className="px-6 py-3 font-medium">الصنف</th>
                  <th className="px-3 py-3 font-medium">SKU</th>
                  <th className="px-6 py-3 font-medium text-left">الكمية</th>
                </tr>
              </thead>
              <tbody>
                {request.items.map((it) => {
                  const editedQ = editedQty[it.catalogId] ?? it.adjustedQty ?? it.quantity;
                  const editDiff = editedQ - it.quantity;
                  const persistedAdjust = it.adjustedQty != null && it.adjustedQty !== it.quantity;
                  const persistedDiff = (it.adjustedQty ?? it.quantity) - it.quantity;
                  const stock = isFactory ? findStock(it.name) : null;
                  const stockEnough = stock ? stock.currentQty >= (it.adjustedQty ?? it.quantity) : null;
                  return (
                    <tr
                      key={it.catalogId}
                      className="border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised/40 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <p className="font-medium tracking-tight">{it.name}</p>
                        {stock && (
                          <p className={cn("text-[11px] mt-0.5 font-medium tabular", stockEnough ? "text-status-success" : "text-status-danger")}>
                            المخزون: {stock.currentQty} {stock.unit}{!stockEnough && " — أقل من المطلوب"}
                          </p>
                        )}
                        {editMode && editDiff !== 0 && (
                          <p className={cn("text-[11px] mt-0.5 tabular", editDiff > 0 ? "text-status-success" : "text-status-danger")}>
                            الأصلي: {it.quantity} ({editDiff > 0 ? "+" : ""}{editDiff})
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3.5 tabular text-xs text-text-tertiary">
                        {it.catalogId}
                      </td>
                      <td className="px-6 py-2.5 text-left">
                        {editMode ? (
                          <QtyControl
                            value={editedQ}
                            unit={it.unit}
                            max={it.quantity}
                            onChange={(v) => onItemQtyChange(it.catalogId, v)}
                          />
                        ) : persistedAdjust ? (
                          <div className="inline-flex flex-col items-end leading-tight">
                            <span className="text-[11px] text-text-tertiary tabular line-through">طُلب: {it.quantity} {it.unit}</span>
                            <span className={cn("text-sm font-bold tabular inline-flex items-center gap-1", persistedDiff > 0 ? "text-status-success" : "text-status-danger")}>
                              {it.adjustedQty} {it.unit}
                              <span className="text-[10px] font-medium">({persistedDiff > 0 ? "+" : ""}{persistedDiff})</span>
                            </span>
                          </div>
                        ) : (
                          <span className="tabular font-medium">{it.quantity} {it.unit}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-bg-surface-raised/30">
                  <td colSpan={2} className="px-6 py-4 text-sm text-text-secondary">
                    إجمالي الكميات
                  </td>
                  <td className="px-6 py-4 text-left text-xl font-bold tabular tracking-tight">
                    {editTotal}
                    <span className="text-xs text-text-tertiary font-normal mr-1">
                      وحدة
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </Card>
        </div>

        {/* Right rail — factory only */}
        {isFactory && <aside className="space-y-5 min-w-0">
          <Card padding="md">
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">
              تفاصيل الطلب
            </p>
            <ul className="space-y-3">
              <MetaRow label="الفرع المُرسل" value={request.fromBranchName} icon={<Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />} />
              <MetaRow label="الوجهة" value={request.toFactory} icon={<Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />} />
              <MetaRow label="بواسطة" value={request.createdBy} icon={<User className="w-3.5 h-3.5" strokeWidth={1.75} />} />
              <MetaRow label="الإنشاء" value={request.createdAt} icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />} />
              {request.approvedBy && (
                <MetaRow label="وافق عليه" value={`${request.approvedBy}`} icon={<Check className="w-3.5 h-3.5" strokeWidth={1.75} />} />
              )}
            </ul>
          </Card>

          {canApprove ? (
            editMode ? (
              <Card padding="md" className="bg-status-info/8 border-status-info/40 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Edit className="w-4 h-4 text-status-info" strokeWidth={2} />
                    <p className="text-sm font-medium tracking-tight text-status-info">وضع التعديل</p>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    عدّل الكميات في الجدول، اكتب السبب، ثم احفظ.
                  </p>
                </div>
                <EditNoteField value={editNote} onChange={onEditNoteChange} />
                <div className="space-y-2">
                  <Button
                    onClick={onSaveEdit}
                    size="lg"
                    fullWidth
                    disabled={!editValid}
                    title={!editValid ? "اكتب سبب التعديل وعدّل كمية واحدة على الأقل" : ""}
                  >
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                    حفظ التعديلات
                  </Button>
                  <Button onClick={onCancelEdit} variant="ghost" size="md" fullWidth>
                    <X className="w-4 h-4" strokeWidth={2} />
                    إلغاء
                  </Button>
                </div>
              </Card>
            ) : (
              <Card padding="md" className="bg-status-warning/8 border-status-warning/40">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-status-warning" strokeWidth={2} />
                  <p className="text-sm font-medium tracking-tight text-status-warning">
                    ينتظر قرارك
                  </p>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  راجع الكميات، ثم وافق أو ارفض الطلب. الموافقة تنشئ تلقائيًا أمر تحضير في المصنع.
                </p>
                <div className="space-y-2">
                  <Button onClick={onApprove} size="lg" fullWidth>
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                    وافق على الطلب
                  </Button>
                  <Button onClick={onReject} variant="danger" size="md" fullWidth>
                    <X className="w-4 h-4" strokeWidth={2.5} />
                    ارفض
                  </Button>
                  <Button onClick={onStartEdit} variant="ghost" size="md" fullWidth>
                    <Edit className="w-4 h-4" strokeWidth={1.75} />
                    عدّل قبل الموافقة
                  </Button>
                </div>
              </Card>
            )
          ) : (canStartPrep || canDispatch) ? (
            <Card padding="md" className="bg-status-info/8 border-status-info/40">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-status-info" strokeWidth={2} />
                <p className="text-sm font-medium tracking-tight text-status-info">
                  {canStartPrep ? "جاهز للتحضير" : "جاهز للإرسال"}
                </p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                {canStartPrep
                  ? "ابدأ تحضير الطلب. بعد ما يبدأ التحضير يظهر زر الإرسال للفرع."
                  : "حدّد الكميات الفعلية، اختر السائق، وأرسل. النظام يولّد QR للفرع يمسحه عند الاستلام."}
              </p>
              <div className="space-y-2">
                {canStartPrep && (
                  <Button onClick={onStartPrep} size="lg" fullWidth>
                    <ChefHat className="w-4 h-4" strokeWidth={2} />
                    بدء التحضير
                  </Button>
                )}
                {canDispatch && (
                  <Button onClick={onOpenDispatch} size="lg" fullWidth>
                    <Truck className="w-4 h-4" strokeWidth={2} />
                    إرسال للفرع
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card padding="md">
              <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">
                إجراءات
              </p>
              <div className="space-y-2">
                <Button variant="secondary" size="md" fullWidth>
                  طباعة الفاتورة
                </Button>
                <Button variant="ghost" size="md" fullWidth>
                  نسخ كقالب جديد
                </Button>
                <Button variant="ghost" size="md" fullWidth>
                  تصدير PDF
                </Button>
              </div>
            </Card>
          )}
        </aside>}
      </div>

      {(approved || rejected) && (
        <Confirmation type={approved ? "approve" : "reject"} />
      )}
    </div>
  );
}

/* =======================================================================
   Shared subcomponents
   ======================================================================= */

function Meta({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary tracking-[0.14em] uppercase mb-1">
        <span className="text-text-tertiary">{icon}</span>
        {label}
      </div>
      <p
        className={cn(
          "text-sm font-medium tracking-tight truncate",
          accent && "text-brand-primary tabular"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-[11px] text-text-tertiary tracking-tight">
        <span>{icon}</span>
        {label}
      </div>
      <span
        className={cn(
          "text-xs font-medium tracking-tight text-left truncate",
          accent && "text-brand-primary tabular"
        )}
      >
        {value}
      </span>
    </li>
  );
}

function AdjustmentNotice({ request }: { request: RequestRecord }) {
  if (!request.adjustmentNote) return null;
  return (
    <Card padding="md" className="bg-status-warning/8 border-status-warning/40">
      <div className="flex items-start gap-2.5">
        <Edit className="w-4 h-4 text-status-warning shrink-0 mt-0.5" strokeWidth={1.75} />
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-tight mb-1 text-status-warning">
            تم تعديل الكميات من المصنع
            {request.adjustedBy && <span className="text-text-secondary font-normal"> · {request.adjustedBy}</span>}
            {request.adjustedAt && <span className="text-text-tertiary font-normal"> · {request.adjustedAt}</span>}
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">{request.adjustmentNote}</p>
        </div>
      </div>
    </Card>
  );
}

function EditNoteField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-1.5">
        سبب التعديل <span className="text-status-danger">*</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="مثال: المخزون أقل من المطلوب — يُكمَّل الباقي من تحضيرة بكرة"
        rows={3}
        className="w-full px-3 py-2.5 rounded-sm text-sm bg-bg-surface border border-border focus:border-brand-primary outline-none tracking-tight resize-none transition-all placeholder:text-text-tertiary"
      />
      <p className="text-[10px] text-text-tertiary mt-1">يظهر للفرع علشان يفهم سبب الفرق.</p>
    </div>
  );
}

function QtyControl({ value, unit, max, onChange }: { value: number; unit: string; max?: number; onChange: (v: number) => void }) {
  const atMax = max != null && value >= max;
  const atMin = value <= 0;
  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={atMin}
        className="w-7 h-7 rounded-full flex items-center justify-center bg-status-danger text-white shadow-sm hover:bg-status-danger/85 active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
        aria-label="أنقص"
      >
        <Minus className="w-3 h-3" strokeWidth={2.5} />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-12 h-7 text-center text-xs font-bold tabular border border-border-subtle rounded-sm bg-bg-surface outline-none focus:border-brand-primary"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={atMax}
        title={atMax ? "لا يمكن زيادة الكمية المطلوبة من الفرع" : ""}
        className="w-7 h-7 rounded-full flex items-center justify-center bg-status-success text-white shadow-sm hover:bg-status-success/85 active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
        aria-label="أضف"
      >
        <Plus className="w-3 h-3" strokeWidth={2.5} />
      </button>
      <span className="text-[10px] text-text-tertiary mr-0.5">{unit}</span>
    </div>
  );
}

function Confirmation({ type }: { type: "approve" | "reject" }) {
  const isApprove = type === "approve";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadein px-4">
      <div
        className={cn(
          "relative max-w-sm w-full rounded-lg overflow-hidden shadow-2xl",
          "bg-bg-surface border-2",
          isApprove ? "border-status-success" : "border-status-danger"
        )}
      >
        {/* Colored header band */}
        <div
          className={cn(
            "px-6 pt-7 pb-5 text-center",
            isApprove ? "bg-status-success" : "bg-status-danger"
          )}
        >
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-white/25 ring-4 ring-white/15">
            {isApprove ? (
              <Check className="w-9 h-9 text-white" strokeWidth={3} />
            ) : (
              <X className="w-9 h-9 text-white" strokeWidth={3} />
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 text-center">
          <p
            className={cn(
              "text-lg font-bold tracking-tight",
              isApprove ? "text-status-success" : "text-status-danger"
            )}
          >
            {isApprove ? "تمت الموافقة" : "تم الرفض"}
          </p>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            {isApprove
              ? "أمر التحضير أُرسل للمصنع تلقائيًا"
              : "سيُبلَّغ المُرسِل بالقرار"}
          </p>
        </div>
      </div>
    </div>
  );
}
