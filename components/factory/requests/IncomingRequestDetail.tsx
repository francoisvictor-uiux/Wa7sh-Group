"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Truck, Package, AlertTriangle, ChevronLeft } from "lucide-react";
import { brandMeta } from "@/lib/mock/branches";
import { BrandIcon } from "@/components/brand/BrandIcon";
import type { FactoryRequest } from "@/lib/mock/factoryRequests";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

interface Props {
  request: FactoryRequest;
  onApprove: (id: string) => void;
  onReject:  (id: string, reason: string) => void;
  onClose?:  () => void;
}

const statusLabel: Record<string, { text: string; color: string }> = {
  requested:    { text: "في الانتظار",  color: "text-status-warning"  },
  approved:     { text: "موافق عليه",   color: "text-status-info"     },
  preparing:    { text: "جاري التحضير", color: "text-brand-primary"   },
  "in-transit": { text: "في الطريق",    color: "text-status-warning"  },
  delivered:    { text: "تم التسليم",   color: "text-status-success"  },
  confirmed:    { text: "مؤكد",         color: "text-status-success"  },
  rejected:     { text: "مرفوض",        color: "text-status-danger"   },
};

export function IncomingRequestDetail({ request, onApprove, onReject, onClose }: Props) {
  const router  = useRouter();
  const toast   = useToast();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason]     = useState("");
  const [loading, setLoading]               = useState<"approve" | "reject" | null>(null);

  const brand     = brandMeta[request.brandId];
  const isPending = request.status === "requested";
  const sl        = statusLabel[request.status] ?? { text: request.status, color: "text-text-tertiary" };

  const handleApprove = () => {
    setLoading("approve");
    setTimeout(() => {
      onApprove(request.id);
      toast.success("تمت الموافقة", `${request.requestNumber} · ${request.branchName}`);
      setLoading(null);
    }, 700);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.warning("سبب الرفض مطلوب");
      return;
    }
    setLoading("reject");
    setTimeout(() => {
      onReject(request.id, rejectReason);
      toast.error("تم الرفض", `${request.requestNumber}`);
      setLoading(null);
      setShowRejectForm(false);
      setRejectReason("");
    }, 700);
  };

  return (
    <div className="flex flex-col h-full bg-bg-canvas">

      {/* ── Header ── */}
      <div className="px-6 py-4 border-b border-border-subtle">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="mt-0.5 text-text-tertiary hover:text-text-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              </button>
            )}
            <div>
              {/* Brand + number */}
              <div className="flex items-center gap-2 mb-2">
                <BrandIcon brandId={request.brandId} size="sm" />
                <span className="text-xs font-mono text-text-tertiary tracking-wider">
                  {request.requestNumber}
                </span>
                {request.priority === "urgent" && (
                  <span className="text-[10px] font-semibold text-status-danger flex items-center gap-0.5">
                    <AlertTriangle className="w-2.5 h-2.5" strokeWidth={2.5} />
                    عاجل
                  </span>
                )}
              </div>
              {/* Branch name — large */}
              <h2 className="text-lg font-bold tracking-tight leading-none mb-1">
                {request.branchName}
              </h2>
              <p className="text-xs text-text-tertiary">{brand.name}</p>
            </div>
          </div>

          {/* Status */}
          <span className={cn("text-xs font-semibold mt-1", sl.color)}>
            {sl.text}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Meta strip */}
        <div className="grid grid-cols-2 gap-px bg-border-subtle border-b border-border-subtle">
          <MetaCell label="وقت الطلب"    value={request.createdAt} />
          <MetaCell label="موعد التسليم" value={request.requestedDeliveryDate} urgent={request.priority === "urgent"} />
          {request.approvedBy && <MetaCell label="وافق عليه" value={request.approvedBy} />}
          {request.approvedAt && <MetaCell label="وقت الموافقة" value={request.approvedAt} />}
        </div>

        {/* Note */}
        {request.note && (
          <div className="mx-5 mt-4 flex gap-2.5 px-3 py-2.5 rounded-lg bg-status-warning/6 border-r-2 border-r-status-warning">
            <p className="text-xs text-text-secondary leading-relaxed">{request.note}</p>
          </div>
        )}

        {/* Items */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest">
              الأصناف المطلوبة
            </p>
            <span className="text-[10px] text-text-tertiary">{request.items.length} صنف</span>
          </div>

          <div className="space-y-0 border border-border-subtle rounded-lg overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-[1fr_72px_72px] gap-0 bg-bg-surface-raised px-4 py-2">
              <span className="text-[10px] text-text-tertiary uppercase tracking-wide">الصنف</span>
              <span className="text-[10px] text-text-tertiary uppercase tracking-wide text-center">مطلوب</span>
              {request.items.some((i) => i.approvedQty !== undefined) && (
                <span className="text-[10px] text-text-tertiary uppercase tracking-wide text-center">معتمد</span>
              )}
            </div>

            {request.items.map((item, idx) => (
              <div
                key={item.catalogId}
                className={cn(
                  "grid grid-cols-[1fr_72px_72px] gap-0 px-4 py-2.5 items-center",
                  idx < request.items.length - 1 && "border-b border-border-subtle"
                )}
              >
                <span className="text-xs text-text-primary">{item.name}</span>
                <span className="text-xs font-semibold tabular text-center text-text-primary">
                  {item.requestedQty}
                  <span className="text-text-tertiary font-normal text-[10px]"> {item.unit}</span>
                </span>
                {item.approvedQty !== undefined && (
                  <span className={cn(
                    "text-xs font-semibold tabular text-center",
                    item.approvedQty === item.requestedQty ? "text-status-success" : "text-status-warning"
                  )}>
                    {item.approvedQty}
                    <span className="text-text-tertiary font-normal text-[10px]"> {item.unit}</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rejection reason */}
        {request.status === "rejected" && request.rejectionReason && (
          <div className="mx-5 mb-4 px-3 py-2.5 rounded-lg bg-status-danger/6 border-r-2 border-r-status-danger">
            <p className="text-[10px] font-semibold text-status-danger uppercase tracking-wide mb-1">سبب الرفض</p>
            <p className="text-xs text-text-secondary">{request.rejectionReason}</p>
            {request.rejectedBy && (
              <p className="text-[10px] text-text-tertiary mt-1">{request.rejectedBy} · {request.rejectedAt}</p>
            )}
          </div>
        )}

        {/* Reject form */}
        {showRejectForm && (
          <div className="mx-5 mb-4 p-4 rounded-lg border border-status-danger/30 bg-status-danger/4 space-y-3">
            <p className="text-xs font-semibold text-status-danger">سبب الرفض <span className="font-normal text-text-tertiary">(مطلوب)</span></p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="اكتب سبب الرفض..."
              rows={3}
              className={cn(
                "w-full resize-none rounded-md border border-border bg-bg-surface",
                "px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary",
                "focus:outline-none focus:border-status-danger/50 transition-colors duration-fast"
              )}
            />
            <div className="flex gap-2">
              <Button variant="danger" size="sm" loading={loading === "reject"} onClick={handleReject}
                trailingIcon={<XCircle className="w-3.5 h-3.5" strokeWidth={1.75} />}>
                تأكيد الرفض
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setShowRejectForm(false); setRejectReason(""); }}>
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Action bar ── */}
      {isPending && !showRejectForm && (
        <div className="border-t border-border-subtle px-5 py-3.5 flex gap-2.5 bg-bg-surface">
          <Button variant="primary" size="md" fullWidth loading={loading === "approve"} onClick={handleApprove}
            trailingIcon={<CheckCircle2 className="w-4 h-4" strokeWidth={2} />}>
            موافقة
          </Button>
          <Button variant="secondary" size="md" fullWidth onClick={() => setShowRejectForm(true)}
            trailingIcon={<XCircle className="w-4 h-4" strokeWidth={1.75} />}>
            رفض
          </Button>
        </div>
      )}

      {(request.status === "approved" || request.status === "preparing") && (
        <div className="border-t border-border-subtle px-5 py-3.5 bg-bg-surface">
          <Button variant="primary" size="md" fullWidth
            trailingIcon={<Package className="w-4 h-4" strokeWidth={1.75} />}>
            بدء التحضير
          </Button>
        </div>
      )}

      {request.status === "in-transit" && (
        <div className="border-t border-border-subtle px-5 py-3 bg-bg-surface flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-status-warning shrink-0" strokeWidth={1.75} />
          <div>
            <p className="text-xs font-medium text-status-warning">في الطريق</p>
            <p className="text-[11px] text-text-tertiary">{request.branchName} · ETA {request.requestedDeliveryDate}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Meta cell ────────────────────────────────────────────────────────────────

function MetaCell({ label, value, urgent }: { label: string; value: string; urgent?: boolean }) {
  return (
    <div className="bg-bg-surface px-4 py-2.5">
      <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-0.5">{label}</p>
      <p className={cn("text-xs font-medium", urgent ? "text-status-danger" : "text-text-primary")}>
        {value}
      </p>
    </div>
  );
}
