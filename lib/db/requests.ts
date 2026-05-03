"use client";

/**
 * Shared mock database for requests.
 *
 * Persisted in localStorage under "wahsh.db.requests".
 * Both branch and factory users share the same browser storage, so
 * changes by one user are immediately visible to the other.
 *
 * Seeded from factoryRequests mock on first run so the factory user
 * always has sample data to work with.
 */

import { useState, useEffect, useCallback } from "react";
import { factoryRequests, type FactoryRequest, type RequestItem, type DispatchItem } from "@/lib/mock/factoryRequests";
import type { RequestStatus } from "@/lib/mock/requests";
import type { BrandId } from "@/lib/mock/branches";

const DB_KEY = "wahsh.db.requests";
const SEEDED_KEY = "wahsh.db.seeded";

/* ── Helpers ── */

function arabicDateTime(date = new Date()): string {
  return date.toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" })
    + " · "
    + date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

function arabicRelative(isoString: string): string {
  const diff = Math.round((Date.now() - new Date(isoString).getTime()) / 60000);
  if (diff < 1)    return "الآن";
  if (diff < 60)   return `منذ ${diff} دقيقة`;
  if (diff < 1440) return `منذ ${Math.round(diff / 60)} ساعة`;
  return `منذ ${Math.round(diff / 1440)} يوم`;
}

function nextReqNumber(list: FactoryRequest[]): string {
  const nums = list
    .map((r) => parseInt(r.requestNumber.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 1000;
  return `#REQ-${max + 1}`;
}

/* ── Seed from mock if first run ── */

function loadDB(): FactoryRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed: FactoryRequest[] = JSON.parse(raw);
      // Rehydrate createdAtDate (stored as ISO string)
      return parsed.map((r) => ({
        ...r,
        createdAtDate: new Date((r as any).createdAtISO ?? r.createdAtDate ?? Date.now()),
      }));
    }
  } catch {}

  // First run — seed with mock data
  const seeded = factoryRequests.map((r) => ({
    ...r,
    createdAtISO: r.createdAtDate.toISOString(),
  }));
  localStorage.setItem(DB_KEY, JSON.stringify(seeded));
  localStorage.setItem(SEEDED_KEY, "1");
  return factoryRequests;
}

function saveDB(list: FactoryRequest[]): void {
  if (typeof window === "undefined") return;
  const serializable = list.map((r) => ({
    ...r,
    createdAtISO: (r.createdAtDate instanceof Date
      ? r.createdAtDate
      : new Date((r as any).createdAtISO ?? Date.now())
    ).toISOString(),
    createdAtDate: undefined, // don't double-store
  }));
  localStorage.setItem(DB_KEY, JSON.stringify(serializable));
}

/* ══════════════════════════════════════════════════════════════════════════
 * Hook
 * ══════════════════════════════════════════════════════════════════════════ */

export interface CreateRequestPayload {
  brandId: BrandId;
  branchId: string;
  branchName: string;
  items: RequestItem[];
  priority: "normal" | "urgent";
  note?: string;
  requestedDeliveryDate?: string;
}

export interface StatusUpdatePayload {
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export function useRequestsDB() {
  const [requests, setRequests] = useState<FactoryRequest[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setRequests(loadDB());

    // Listen for changes from other "users" (same browser, different tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === DB_KEY) setRequests(loadDB());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* Internal persist — updates state + localStorage */
  const persist = useCallback((list: FactoryRequest[]) => {
    saveDB(list);
    setRequests(list.map((r) => ({
      ...r,
      createdAtDate: r.createdAtDate instanceof Date
        ? r.createdAtDate
        : new Date((r as any).createdAtISO ?? Date.now()),
    })));
  }, []);

  /* ── Create a new request (branch → factory) ── */
  const createRequest = useCallback((payload: CreateRequestPayload): FactoryRequest => {
    const current = loadDB();
    const now = new Date();
    const req: FactoryRequest = {
      id: `req-${Date.now()}`,
      requestNumber: nextReqNumber(current),
      brandId: payload.brandId,
      branchId: payload.branchId,
      branchName: payload.branchName,
      items: payload.items,
      status: "requested",
      priority: payload.priority,
      createdAt: arabicRelative(now.toISOString()),
      createdAtDate: now,
      requestedDeliveryDate: payload.requestedDeliveryDate ?? "غداً · 8:00 ص",
      note: payload.note,
      totalItems: payload.items.length,
    };
    persist([...current, req]);
    return req;
  }, [persist]);

  /* ── Update request status (factory actions) ── */
  const updateStatus = useCallback((
    id: string,
    status: RequestStatus,
    meta: StatusUpdatePayload = {}
  ) => {
    setRequests((prev) => {
      const next = prev.map((r) => r.id === id ? { ...r, status, ...meta } : r);
      saveDB(next);
      return next;
    });
  }, []);

  /* ── Bulk status update ── */
  const bulkUpdateStatus = useCallback((ids: string[], status: RequestStatus, meta: StatusUpdatePayload = {}) => {
    setRequests((prev) => {
      const idSet = new Set(ids);
      const next = prev.map((r) => idSet.has(r.id) ? { ...r, status, ...meta } : r);
      saveDB(next);
      return next;
    });
  }, []);

  /* ── Reset DB (back to mock seed) ── */
  /* ── Dispatch order (factory → in-transit) — generates a security token
   * embedded in the QR and an ISO timestamp the branch uses to validate
   * the QR hasn't expired. Token is short, alphanumeric, uppercase. */
  const dispatchOrder = useCallback((
    id: string,
    dispatchItems: DispatchItem[],
    dispatchNote?: string,
    driverName?: string
  ) => {
    const nowDate = new Date();
    const humanNow = arabicDateTime(nowDate);
    const token = Array.from({ length: 8 }, () =>
      "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 31)]
    ).join("");
    setRequests((prev) => {
      const next = prev.map((r) => r.id === id ? {
        ...r, status: "in-transit" as const,
        dispatchItems, dispatchNote, driverName,
        dispatchedAt: humanNow,
        dispatchedAtISO: nowDate.toISOString(),
        dispatchToken: token,
      } : r);
      saveDB(next);
      return next;
    });
  }, []);

  /* ── Branch confirms receipt ── */
  const branchConfirm = useCallback((id: string, receiveNote?: string) => {
    const now = arabicDateTime();
    setRequests((prev) => {
      const next = prev.map((r) => r.id === id ? {
        ...r, branchConfirmedAt: now, receiveNote,
      } : r);
      saveDB(next);
      return next;
    });
  }, []);

  /* ── Driver confirms quantities ── */
  const driverConfirm = useCallback((id: string) => {
    const now = arabicDateTime();
    setRequests((prev) => {
      const next = prev.map((r) => r.id === id ? {
        ...r, status: "confirmed" as const, driverConfirmedAt: now,
      } : r);
      saveDB(next);
      return next;
    });
  }, []);

  /* ── Open dispute ── */
  const openDispute = useCallback((
    id: string,
    disputeType: "factory" | "driver",
    disputeDescription: string
  ) => {
    const now = arabicDateTime();
    setRequests((prev) => {
      const next = prev.map((r) => r.id === id ? {
        ...r, status: "disputed" as const, disputeType, disputeDescription, disputedAt: now,
      } : r);
      saveDB(next);
      return next;
    });
  }, []);

  const resetDB = useCallback(() => {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(SEEDED_KEY);
    persist(loadDB());
  }, [persist]);

  /* ── Derived views ── */
  const getByBranch = useCallback(
    (branchId: string) => requests.filter((r) => r.branchId === branchId),
    [requests]
  );

  return {
    requests,
    createRequest,
    updateStatus,
    bulkUpdateStatus,
    dispatchOrder,
    branchConfirm,
    driverConfirm,
    openDispute,
    resetDB,
    getByBranch,
  };
}
