"use client";

/**
 * useLiveOrderEvents — emits toast notifications when the OTHER side of a
 * request changes its state. This is what makes the system feel like a
 * real two-sided workflow:
 *
 *   Branch user sees:   "تمت الموافقة على #REQ-1049"  → factory approved
 *                       "طلبك في الطريق · #REQ-1049"   → factory dispatched
 *                       "تم رفض طلبك #REQ-1049"        → factory rejected
 *
 *   Factory user sees:  "طلب جديد من فرع العصافرة"     → branch submitted
 *                       "تم استلام #REQ-1049"          → branch confirmed
 *                       "نزاع على #REQ-1049"           → branch disputed
 *
 * Works by snapshotting the request set on every render and diffing what
 * changed since the previous render. Cross-tab updates are picked up via
 * the `storage` event already wired into useRequestsDB.
 */

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRequestsDB } from "@/lib/db/requests";
import { useToastContext } from "@/context/ToastContext";
import type { FactoryRequest } from "@/lib/mock/factoryRequests";
import type { RequestStatus } from "@/lib/mock/requests";

type Snap = {
  status: RequestStatus;
  hasDisputeType: boolean;
  hasBranchConfirmed: boolean;
};

function snapshot(r: FactoryRequest): Snap {
  return {
    status: r.status,
    hasDisputeType: !!r.disputeType,
    hasBranchConfirmed: !!r.branchConfirmedAt,
  };
}

export function useLiveOrderEvents() {
  const { user } = useAuth();
  const { requests } = useRequestsDB();
  const toast = useToastContext();
  const prevRef = useRef<Map<string, Snap> | null>(null);
  // Skip the very first run so we don't spam the user with one toast per
  // request when they first open the app.
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    try {

    const next = new Map<string, Snap>();
    requests.forEach((r) => { if (r?.id) next.set(r.id, snapshot(r)); });

    if (!initializedRef.current) {
      prevRef.current = next;
      initializedRef.current = true;
      return;
    }

    const prev = prevRef.current ?? new Map();
    const isBranch  = user.scope === "branch";
    const isFactory = user.scope === "factory" || user.scope === "group";
    const myBranchId = user.branchId;

    requests.forEach((r) => {
      const before = prev.get(r.id);
      const after  = next.get(r.id);
      if (!after) return;

      // ── New request appeared (factory user perspective) ──
      if (!before && isFactory && after.status === "requested") {
        toast.info("طلب جديد", `${r.requestNumber} · ${r.branchName}`);
        return;
      }

      if (!before) return;

      // ── Status transitions ──
      if (before.status !== after.status) {
        // Branch perspective — only own branch's requests
        if (isBranch && r.branchId === myBranchId) {
          if (after.status === "approved") {
            toast.success("تمت الموافقة على طلبك", `${r.requestNumber} · جاري التحضير في المصنع`);
          } else if (after.status === "in-transit") {
            toast.info("طلبك في الطريق إليك", `${r.requestNumber} · امسح الكود من السائق للاستلام`);
          } else if (after.status === "rejected") {
            toast.error("تم رفض طلبك", `${r.requestNumber}${r.rejectionReason ? ` · ${r.rejectionReason}` : ""}`);
          } else if (after.status === "preparing") {
            toast.info("جاري تحضير طلبك", r.requestNumber);
          }
        }

        // Factory perspective — all branches' requests
        if (isFactory) {
          if (after.status === "confirmed") {
            toast.success("تم تأكيد الاستلام", `${r.requestNumber} · ${r.branchName}`);
          } else if (after.status === "disputed") {
            toast.error("نزاع على الطلب", `${r.requestNumber} · ${r.branchName}${r.disputeType === "factory" ? " · تحميل على المصنع" : " · تحميل على السائق"}`);
          }
        }
      }

      // ── Branch confirmed receipt (factory perspective) ──
      if (isFactory && !before.hasBranchConfirmed && after.hasBranchConfirmed && after.status !== "confirmed") {
        toast.info("الفرع أكّد الاستلام", `${r.requestNumber} · بانتظار تأكيد السائق`);
      }
    });

    prevRef.current = next;
    } catch (err) {
      // Stale localStorage entries with missing fields shouldn't crash
      // the whole shell — swallow and resync on the next change.
      console.warn("useLiveOrderEvents diff failed", err);
      prevRef.current = null;
    }
  }, [requests, user, toast]);
}
