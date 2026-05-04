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
  createdBy?: string;
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

export interface DispatchDriverInfo {
  name?: string;
  id?: string;
  phone?: string;
  nationalId?: string;
  vehicleNumber?: string;
  vehicleType?: string;
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
      createdBy: payload.createdBy,
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

  /* ── Adjust quantities (factory edits before approval). Stores the
   * factory's number in `approvedQty` while keeping the original
   * `requestedQty` immutable so both sides see the diff. The reason
   * note is required by the UI so the branch can see why. */
  const updateItems = useCallback((
    id: string,
    adjustments: Array<{ catalogId: string; approvedQty: number }>,
    meta: { note: string; by?: string },
  ) => {
    const now = arabicDateTime();
    setRequests((prev) => {
      const next = prev.map((r) => {
        if (r.id !== id) return r;
        const map = new Map(adjustments.map((a) => [a.catalogId, a.approvedQty]));
        return {
          ...r,
          items: r.items.map((it) =>
            map.has(it.catalogId) ? { ...it, approvedQty: map.get(it.catalogId)! } : it
          ),
          adjustmentNote: meta.note,
          adjustedBy: meta.by,
          adjustedAt: now,
        };
      });
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
    driver?: DispatchDriverInfo | string
  ) => {
    const nowDate = new Date();
    const humanNow = arabicDateTime(nowDate);
    const token = Array.from({ length: 8 }, () =>
      "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 31)]
    ).join("");
    const d: DispatchDriverInfo = typeof driver === "string" ? { name: driver } : (driver ?? {});
    setRequests((prev) => {
      const next = prev.map((r) => r.id === id ? {
        ...r, status: "in-transit" as const,
        dispatchItems, dispatchNote,
        driverName: d.name,
        driverId: d.id,
        driverPhone: d.phone,
        driverNationalId: d.nationalId,
        driverVehicleNumber: d.vehicleNumber,
        driverVehicleType: d.vehicleType,
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

  /* ── Seed a fake in-transit order so a single-account demo can test the
   * full receive flow (scan/confirm/dispute) without needing the factory
   * user to dispatch first. The order has a valid dispatchToken and a
   * recent dispatchedAtISO so QR validation passes. */
  const seedDemoInTransit = useCallback((branchId: string, branchName: string, brandId: BrandId): FactoryRequest => {
    const nowDate = new Date();
    const token = Array.from({ length: 8 }, () =>
      "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 31)]
    ).join("");
    const items: RequestItem[] = [
      { catalogId: "c-burger-patty", name: "لحم برجر — قطعة 150ج", unit: "كجم",     requestedQty: 18 },
      { catalogId: "c-bun",          name: "خبز برجر",              unit: "كرتونة", requestedQty: 4  },
      { catalogId: "c-cheddar",      name: "جبنة شيدر شرائح",       unit: "كجم",     requestedQty: 6  },
      { catalogId: "c-tomato",       name: "طماطم",                  unit: "كجم",     requestedQty: 12 },
    ];
    const dispatchItems: DispatchItem[] = items.map((it) => ({
      catalogId: it.catalogId, name: it.name, unit: it.unit,
      requestedQty: it.requestedQty,
      // Mimic a real dispatch with a small shortage on cheddar
      dispatchedQty: it.catalogId === "c-cheddar" ? it.requestedQty - 2 : it.requestedQty,
    }));
    const current = loadDB();
    const req: FactoryRequest = {
      id: `req-demo-${Date.now()}`,
      requestNumber: nextReqNumber(current),
      brandId, branchId, branchName,
      items,
      status: "in-transit",
      priority: "normal",
      createdAt: arabicRelative(new Date(Date.now() - 60 * 60 * 1000).toISOString()),
      createdAtDate: new Date(Date.now() - 60 * 60 * 1000),
      requestedDeliveryDate: "اليوم · 4:00 م",
      note: "طلب تجريبي للاختبار",
      totalItems: items.length,
      dispatchItems,
      dispatchNote: "نقصت 2 كجم من جبنة الشيدر بسبب نفاذ المخزون — سيُرسل الباقي غداً",
      dispatchedAt: arabicDateTime(nowDate),
      dispatchedAtISO: nowDate.toISOString(),
      dispatchToken: token,
      driverName: "محمود علي",
    };
    persist([...current, req]);
    return req;
  }, [persist]);

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
    updateItems,
    bulkUpdateStatus,
    dispatchOrder,
    branchConfirm,
    driverConfirm,
    openDispute,
    seedDemoInTransit,
    resetDB,
    getByBranch,
  };
}
