/**
 * Factory Incoming Requests — mock data
 *
 * Requests come from branches across all 3 brands.
 * Factory sees ALL of them. Each request flows through:
 *   requested → approved → preparing → loaded → in-transit → delivered → confirmed → closed
 */

import type { BrandId } from "@/lib/mock/branches";
import type { RequestStatus } from "@/lib/mock/requests";

export interface RequestItem {
  catalogId: string;
  name: string;
  unit: string;
  requestedQty: number;
  approvedQty?: number; // can differ from requested
}

export interface DispatchItem {
  catalogId: string;
  name: string;
  unit: string;
  requestedQty: number;
  dispatchedQty: number;
}

export interface FactoryRequest {
  id: string;
  requestNumber: string;
  brandId: BrandId;
  branchId: string;
  branchName: string;
  items: RequestItem[];
  status: RequestStatus;
  priority: "normal" | "urgent";
  createdAt: string;
  createdAtDate: Date;
  requestedDeliveryDate: string;
  note?: string;
  createdBy?: string;
  adjustmentNote?: string;       // factory's justification for editing qty
  adjustedAt?: string;
  adjustedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  totalItems: number;
  /* ── Dispatch (factory fills before sending) ── */
  dispatchItems?: DispatchItem[];
  dispatchNote?: string;
  dispatchedAt?: string;
  dispatchedAtISO?: string;   // for QR expiry calculations
  dispatchToken?: string;     // 8-char security token embedded in the QR
  driverName?: string;
  driverId?: string;          // optional ref to drivers.ts when picked from dropdown
  driverPhone?: string;
  driverNationalId?: string;
  driverVehicleNumber?: string;
  driverVehicleType?: string;
  /* ── Receive (branch fills on arrival) ── */
  branchConfirmedAt?: string;
  driverConfirmedAt?: string;
  receiveNote?: string;
  /* ── Dispute ── */
  disputeType?: "factory" | "driver";
  disputeDescription?: string;
  disputedAt?: string;
}

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);
const fmt = (d: Date) => {
  const diff = Math.round((now.getTime() - d.getTime()) / 60000);
  if (diff < 60) return `منذ ${diff} دقيقة`;
  if (diff < 1440) return `منذ ${Math.round(diff / 60)} ساعة`;
  return `منذ ${Math.round(diff / 1440)} يوم`;
};

export const factoryRequests: FactoryRequest[] = [
  // ── Pending (requested) ──────────────────────────────────────────────────
  {
    id: "freq-001",
    requestNumber: "#REQ-1048",
    brandId: "wahsh",
    branchId: "br-wahsh-gleem",
    branchName: "فرع جليم",
    priority: "urgent",
    status: "requested",
    createdAtDate: hoursAgo(1),
    createdAt: fmt(hoursAgo(1)),
    requestedDeliveryDate: "اليوم · 4:00 م",
    note: "مخزون اللحم وصل للحد الأدنى",
    items: [
      { catalogId: "c-burger-patty", name: "لحم برجر — قطعة 150ج", unit: "كجم", requestedQty: 50 },
      { catalogId: "c-cheddar",      name: "جبنة شيدر شرائح",       unit: "كجم", requestedQty: 12 },
      { catalogId: "c-bun",          name: "خبز برجر",               unit: "كرتونة", requestedQty: 6 },
      { catalogId: "c-lettuce",      name: "خس",                     unit: "كجم", requestedQty: 8 },
    ],
    totalItems: 4,
  },
  {
    id: "freq-002",
    requestNumber: "#REQ-1047",
    brandId: "kababgy",
    branchId: "br-kababgy-smoha",
    branchName: "فرع سموحة",
    priority: "normal",
    status: "requested",
    createdAtDate: hoursAgo(2),
    createdAt: fmt(hoursAgo(2)),
    requestedDeliveryDate: "غداً · 8:00 ص",
    items: [
      { catalogId: "c-kebab-mix", name: "تتبيلة كباب جاهزة",  unit: "كجم", requestedQty: 30 },
      { catalogId: "c-shawarma",  name: "شاورما خام متبّلة",  unit: "كجم", requestedQty: 25 },
      { catalogId: "c-chicken",   name: "صدر دجاج",            unit: "كجم", requestedQty: 20 },
      { catalogId: "c-onion",     name: "بصل",                 unit: "كجم", requestedQty: 15 },
      { catalogId: "c-tomato",    name: "طماطم",               unit: "كجم", requestedQty: 20 },
    ],
    totalItems: 5,
  },
  {
    id: "freq-003",
    requestNumber: "#REQ-1046",
    brandId: "forno",
    branchId: "br-forno-raml",
    branchName: "فرع محطة الرمل",
    priority: "normal",
    status: "requested",
    createdAtDate: hoursAgo(3),
    createdAt: fmt(hoursAgo(3)),
    requestedDeliveryDate: "غداً · 9:00 ص",
    items: [
      { catalogId: "c-pizza-dough", name: "عجينة بيتزا",   unit: "كرتونة", requestedQty: 8 },
      { catalogId: "c-mozzarella",  name: "جبنة موزاريلا", unit: "كجم",    requestedQty: 18 },
      { catalogId: "c-flour",       name: "دقيق إيطالي",   unit: "كيس",    requestedQty: 4 },
      { catalogId: "c-cream",       name: "كريمة طبخ",     unit: "لتر",    requestedQty: 10 },
    ],
    totalItems: 4,
  },
  {
    id: "freq-004",
    requestNumber: "#REQ-1045",
    brandId: "wahsh",
    branchId: "br-wahsh-corniche",
    branchName: "فرع الكورنيش",
    priority: "normal",
    status: "requested",
    createdAtDate: hoursAgo(5),
    createdAt: fmt(hoursAgo(5)),
    requestedDeliveryDate: "غداً · 10:00 ص",
    items: [
      { catalogId: "c-burger-patty", name: "لحم برجر", unit: "كجم",    requestedQty: 40 },
      { catalogId: "c-mince",        name: "لحم مفروم", unit: "كجم",   requestedQty: 15 },
      { catalogId: "c-fries",        name: "بطاطس مجمدة", unit: "كرتونة", requestedQty: 5 },
      { catalogId: "c-coke",         name: "كوكاكولا",  unit: "كرتونة", requestedQty: 10 },
    ],
    totalItems: 4,
  },
  {
    id: "freq-005",
    requestNumber: "#REQ-1044",
    brandId: "kababgy",
    branchId: "br-kababgy-raml",
    branchName: "فرع محطة الرمل",
    priority: "urgent",
    status: "requested",
    createdAtDate: hoursAgo(6),
    createdAt: fmt(hoursAgo(6)),
    requestedDeliveryDate: "اليوم · 6:00 م",
    note: "طلب عاجل — حفل كبير الليلة",
    items: [
      { catalogId: "c-kebab-mix",   name: "تتبيلة كباب",    unit: "كجم", requestedQty: 45 },
      { catalogId: "c-chicken-leg", name: "أوراك دجاج",     unit: "كجم", requestedQty: 30 },
      { catalogId: "c-tomato",      name: "طماطم",           unit: "كجم", requestedQty: 25 },
    ],
    totalItems: 3,
  },

  // ── Approved ─────────────────────────────────────────────────────────────
  {
    id: "freq-006",
    requestNumber: "#REQ-1043",
    brandId: "wahsh",
    branchId: "br-wahsh-mandara",
    branchName: "فرع المندرة",
    priority: "normal",
    status: "approved",
    createdAtDate: hoursAgo(8),
    createdAt: fmt(hoursAgo(8)),
    requestedDeliveryDate: "اليوم · 2:00 م",
    approvedBy: "أحمد رضا",
    approvedAt: fmt(hoursAgo(6)),
    items: [
      { catalogId: "c-burger-patty", name: "لحم برجر",    unit: "كجم",     requestedQty: 35, approvedQty: 35 },
      { catalogId: "c-bun",          name: "خبز برجر",    unit: "كرتونة",  requestedQty: 5,  approvedQty: 5  },
      { catalogId: "c-lettuce",      name: "خس",          unit: "كجم",     requestedQty: 6,  approvedQty: 6  },
    ],
    totalItems: 3,
  },
  {
    id: "freq-007",
    requestNumber: "#REQ-1042",
    brandId: "kababgy",
    branchId: "br-kababgy-sidi-gaber",
    branchName: "فرع سيدي جابر",
    priority: "normal",
    status: "preparing",
    createdAtDate: hoursAgo(10),
    createdAt: fmt(hoursAgo(10)),
    requestedDeliveryDate: "اليوم · 3:00 م",
    approvedBy: "أحمد رضا",
    approvedAt: fmt(hoursAgo(8)),
    items: [
      { catalogId: "c-shawarma",  name: "شاورما متبّلة", unit: "كجم", requestedQty: 20, approvedQty: 20 },
      { catalogId: "c-chicken",   name: "صدر دجاج",     unit: "كجم", requestedQty: 15, approvedQty: 15 },
    ],
    totalItems: 2,
  },

  // ── In Transit ───────────────────────────────────────────────────────────
  {
    id: "freq-008",
    requestNumber: "#REQ-1041",
    brandId: "wahsh",
    branchId: "br-wahsh-downtown",
    branchName: "فرع داون تاون",
    priority: "normal",
    status: "in-transit",
    createdAtDate: hoursAgo(14),
    createdAt: fmt(hoursAgo(14)),
    requestedDeliveryDate: "اليوم · 11:00 ص",
    approvedBy: "أحمد رضا",
    approvedAt: fmt(hoursAgo(12)),
    items: [
      { catalogId: "c-burger-patty", name: "لحم برجر",  unit: "كجم",    requestedQty: 60, approvedQty: 60 },
      { catalogId: "c-mince",        name: "لحم مفروم", unit: "كجم",    requestedQty: 20, approvedQty: 20 },
      { catalogId: "c-coke",         name: "كوكاكولا",  unit: "كرتونة", requestedQty: 12, approvedQty: 12 },
    ],
    totalItems: 3,
  },

  // ── Delivered / Confirmed ─────────────────────────────────────────────────
  {
    id: "freq-009",
    requestNumber: "#REQ-1040",
    brandId: "forno",
    branchId: "br-forno-raml",
    branchName: "فرع محطة الرمل",
    priority: "normal",
    status: "confirmed",
    createdAtDate: hoursAgo(24),
    createdAt: fmt(hoursAgo(24)),
    requestedDeliveryDate: "أمس · 10:00 ص",
    approvedBy: "أحمد رضا",
    approvedAt: fmt(hoursAgo(22)),
    items: [
      { catalogId: "c-pizza-dough", name: "عجينة بيتزا",   unit: "كرتونة", requestedQty: 10, approvedQty: 10 },
      { catalogId: "c-mozzarella",  name: "جبنة موزاريلا", unit: "كجم",    requestedQty: 15, approvedQty: 15 },
    ],
    totalItems: 2,
  },

  // ── Rejected ──────────────────────────────────────────────────────────────
  {
    id: "freq-010",
    requestNumber: "#REQ-1039",
    brandId: "wahsh",
    branchId: "br-wahsh-zezenia",
    branchName: "فرع زيزينيا",
    priority: "normal",
    status: "rejected",
    createdAtDate: hoursAgo(26),
    createdAt: fmt(hoursAgo(26)),
    requestedDeliveryDate: "أمس · 2:00 م",
    rejectedBy: "أحمد رضا",
    rejectedAt: fmt(hoursAgo(24)),
    rejectionReason: "المخزون غير كافٍ دلوقتي — سيتم التوريد بكرة",
    items: [
      { catalogId: "c-burger-patty", name: "لحم برجر", unit: "كجم", requestedQty: 80 },
    ],
    totalItems: 1,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getRequestsByStatus(status: RequestStatus) {
  return factoryRequests.filter((r) => r.status === status);
}

export function getRequestsByBrand(brandId: BrandId) {
  return factoryRequests.filter((r) => r.brandId === brandId);
}

export const requestCounts = {
  pending:    factoryRequests.filter((r) => r.status === "requested").length,
  approved:   factoryRequests.filter((r) => r.status === "approved").length,
  preparing:  factoryRequests.filter((r) => r.status === "preparing").length,
  inTransit:  factoryRequests.filter((r) => r.status === "in-transit").length,
  confirmed:  factoryRequests.filter((r) => r.status === "confirmed").length,
  rejected:   factoryRequests.filter((r) => r.status === "rejected").length,
};
