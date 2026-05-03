"use client";

import { Clock, AlertTriangle, CheckCircle2, Truck, XCircle, Package, Check, ChefHat, Inbox } from "lucide-react";
import { brandMeta } from "@/lib/mock/branches";
import { BrandIcon } from "@/components/brand/BrandIcon";
import type { FactoryRequest } from "@/lib/mock/factoryRequests";
import type { RequestStatus } from "@/lib/mock/requests";
import { cn } from "@/lib/utils";

const statusConfig = {
  requested:   { label: "في الانتظار",  color: "text-status-warning", bg: "bg-status-warning/10  border-status-warning/30",  icon: Clock        },
  approved:    { label: "تمت الموافقة", color: "text-status-info",    bg: "bg-status-info/10     border-status-info/30",     icon: CheckCircle2 },
  preparing:   { label: "جاري التحضير", color: "text-brand-primary",  bg: "bg-brand-primary/10   border-brand-primary/30",   icon: Package      },
  loaded:      { label: "تم التحميل",   color: "text-status-info",    bg: "bg-status-info/10     border-status-info/30",     icon: Package      },
  "in-transit":{ label: "في الطريق",    color: "text-status-warning", bg: "bg-status-warning/10  border-status-warning/30",  icon: Truck        },
  delivered:   { label: "تم التسليم",   color: "text-status-success", bg: "bg-status-success/10  border-status-success/30",  icon: CheckCircle2 },
  confirmed:   { label: "مؤكد",         color: "text-status-success", bg: "bg-status-success/10  border-status-success/30",  icon: CheckCircle2 },
  closed:      { label: "مغلق",         color: "text-text-tertiary",  bg: "bg-bg-surface-raised  border-border-subtle",      icon: CheckCircle2 },
  "on-hold":   { label: "معلّق",        color: "text-status-warning", bg: "bg-status-warning/10  border-status-warning/30",  icon: Clock        },
  disputed:    { label: "متنازع عليه",  color: "text-status-danger",  bg: "bg-status-danger/10   border-status-danger/30",   icon: XCircle      },
  rejected:    { label: "مرفوض",        color: "text-status-danger",  bg: "bg-status-danger/10   border-status-danger/30",   icon: XCircle      },
  cancelled:   { label: "ملغى",         color: "text-text-tertiary",  bg: "bg-bg-surface-raised  border-border-subtle",      icon: XCircle      },
};

/**
 * Maps the lifecycle status to a 4-step factory pipeline:
 *   1. الطلب (requested)
 *   2. الموافقة (approved)
 *   3. التحضير (preparing)
 *   4. التحميل (loaded → handed to driver)
 *
 * Returns the index of the active step (0-3), or -1 if the order has passed
 * the factory pipeline (in-transit / delivered / confirmed / closed).
 */
function activePipelineStep(status: RequestStatus): number {
  switch (status) {
    case "requested":             return 0;
    case "approved":              return 1;
    case "preparing":             return 2;
    case "loaded":
    case "in-transit":            return 3;
    case "delivered":
    case "confirmed":
    case "closed":                return 4; // all 4 done, beyond factory
    case "on-hold":               return 0; // paused at request stage typically
    case "disputed":              return 4; // happens after delivery
    case "rejected":
    case "cancelled":             return -1; // terminal failure — render differently
  }
}

const PIPELINE_STEPS: Array<{ label: string; Icon: typeof Inbox }> = [
  { label: "الطلب",     Icon: Inbox       },
  { label: "الموافقة",  Icon: Check       },
  { label: "التحضير",   Icon: ChefHat     },
  { label: "الإرسال",   Icon: Truck       },
];

interface Props {
  request: FactoryRequest;
  selected?: boolean;
  onClick?: () => void;
}

export function IncomingRequestCard({ request, selected, onClick }: Props) {
  const brand    = brandMeta[request.brandId];
  const status   = statusConfig[request.status] ?? statusConfig.requested;
  const StatusIcon = status.icon;
  const isUrgent = request.priority === "urgent";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-right rounded-xl border p-4 transition-all duration-fast",
        "hover:border-border-strong hover:bg-bg-surface-raised",
        "focus-visible:outline-none",
        selected
          ? "border-brand-primary bg-brand-primary/6 shadow-glow-brand"
          : "border-border-subtle bg-bg-surface"
      )}
    >
      {/* Top — number + status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <BrandIcon brandId={request.brandId} size="xs" />
          <span className="text-xs text-text-tertiary font-mono tracking-tight">
            {request.requestNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isUrgent && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-status-danger bg-status-danger/10 border border-status-danger/30 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" strokeWidth={2} />
              عاجل
            </span>
          )}
          <span className={cn(
            "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border",
            status.color, status.bg
          )}>
            <StatusIcon className="w-3 h-3" strokeWidth={2} />
            {status.label}
          </span>
        </div>
      </div>

      {/* Branch */}
      <div className="mb-2">
        <p className="text-sm font-semibold tracking-tight text-text-primary">
          {request.branchName}
        </p>
        <p className="text-xs text-text-tertiary mt-0.5">{brand.name}</p>
      </div>

      {/* Items chips */}
      <div className="flex flex-wrap gap-1 mb-3">
        {request.items.slice(0, 3).map((item) => (
          <span
            key={item.catalogId}
            className="text-[11px] text-text-secondary bg-bg-surface-raised border border-border-subtle px-2 py-0.5 rounded-md"
          >
            {item.name.split(" ")[0]} · {item.requestedQty} {item.unit}
          </span>
        ))}
        {request.items.length > 3 && (
          <span className="text-[11px] text-text-tertiary bg-bg-surface-raised border border-border-subtle px-2 py-0.5 rounded-md">
            +{request.items.length - 3} أصناف
          </span>
        )}
      </div>

      {/* Pipeline progress — 4 stages of the factory flow */}
      <PipelineProgress status={request.status} />

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-text-tertiary border-t border-border-subtle pt-2.5 mt-1">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" strokeWidth={1.75} />
          {request.createdAt}
        </span>
        <span>تسليم: {request.requestedDeliveryDate}</span>
      </div>

      {request.status === "rejected" && request.rejectionReason && (
        <div className="mt-2.5 text-[11px] text-status-danger bg-status-danger/8 border border-status-danger/20 rounded-lg px-3 py-2">
          سبب الرفض: {request.rejectionReason}
        </div>
      )}
    </button>
  );
}

/* ----------------------------------------------------------------------
 * Pipeline progress — horizontal 4-step stepper showing where the order
 * sits within the factory flow (طلب → موافقة → تحضير → تحميل).
 * Past steps are checked + green; the active step is filled with the
 * brand color; future steps are dimmed. Cancelled / rejected orders
 * collapse to a single failed strip with the reason badge.
 * -------------------------------------------------------------------- */

function PipelineProgress({ status }: { status: RequestStatus }) {
  const active = activePipelineStep(status);

  if (active === -1) {
    return (
      <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-md bg-status-danger/8 border border-status-danger/30">
        <XCircle className="w-3.5 h-3.5 text-status-danger shrink-0" strokeWidth={2} />
        <span className="text-[11px] font-medium text-status-danger">
          {status === "cancelled" ? "أُلغي قبل الإرسال" : "تم رفض الطلب"}
        </span>
      </div>
    );
  }

  const passedFactory = active === 4; // already left the factory

  return (
    <div className="mb-3 mt-1">
      <div className="flex items-center gap-1">
        {PIPELINE_STEPS.map((step, i) => {
          const isDone = i < active || passedFactory;
          const isActive = i === active && !passedFactory;
          const StepIcon = step.Icon;
          return (
            <div key={i} className="flex items-center gap-1 flex-1 min-w-0">
              <span
                className={cn(
                  "shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-colors duration-fast",
                  isDone
                    ? "bg-status-success/15 border-status-success/40 text-status-success"
                    : isActive
                    ? "bg-brand-primary/15 border-brand-primary/50 text-brand-primary ring-2 ring-brand-primary/20"
                    : "bg-bg-surface-raised border-border-subtle text-text-tertiary"
                )}
                aria-hidden
              >
                {isDone ? (
                  <Check className="w-3 h-3" strokeWidth={2.5} />
                ) : (
                  <StepIcon className="w-2.5 h-2.5" strokeWidth={2} />
                )}
              </span>
              <span className={cn("text-[10px] tracking-tight truncate", isActive ? "text-brand-primary font-semibold" : isDone ? "text-status-success font-medium" : "text-text-tertiary")}>
                {step.label}
              </span>
              {i < PIPELINE_STEPS.length - 1 && (
                <span
                  className={cn(
                    "h-px flex-1 min-w-2",
                    isDone ? "bg-status-success/40" : "bg-border-subtle"
                  )}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
