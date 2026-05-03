/**
 * Inventory mock data — per-branch stock with expiry batches,
 * recent movements, and derived health status.
 *
 * Anchored to current user's branch (Heliopolis) for the demo.
 */

import { catalog, type CatalogItem, categoryMeta, type Category } from "./requests";

export type StockHealth = "good" | "low" | "critical" | "expiring" | "out";

export interface ExpiryBatch {
  id: string;
  qty: number;
  expiryDate: string; // ISO
  daysLeft: number;
}

export type MovementType =
  | "receive"
  | "dispatch"
  | "transfer-in"
  | "transfer-out"
  | "waste"
  | "count-adjust"
  | "sale-deplete";

export interface Movement {
  id: string;
  type: MovementType;
  qty: number; // positive in, negative out
  timestamp: string;
  actor: string;
  reference?: string;
  note?: string;
}

export interface StockItem {
  id: string; // stockId, e.g. st-c-burger-patty
  catalogId: string;
  catalog: CatalogItem;
  branchId: string;
  currentQty: number;
  minQty: number;
  maxQty: number;
  location: string;
  lastCountedAt: string;
  expiryBatches: ExpiryBatch[];
  movements: Movement[];
  health: StockHealth;
  daysUntilOOS?: number; // days of stock at avg usage
}

const branchId = "br-heliopolis";

function deriveHealth(
  current: number,
  min: number,
  expiryBatches: ExpiryBatch[]
): StockHealth {
  if (current === 0) return "out";
  const earliestExpiry = Math.min(...expiryBatches.map((b) => b.daysLeft));
  if (earliestExpiry <= 3) return "expiring";
  if (current <= min * 0.5) return "critical";
  if (current <= min) return "low";
  return "good";
}

/* Build stock per catalog item */
const baseStockData: Array<{
  catalogId: string;
  current: number;
  min: number;
  max: number;
  location: string;
  lastCountedDays: number;
  batches: Array<{ qty: number; daysLeft: number }>;
}> = [
  { catalogId: "c-burger-patty", current: 28, min: 20, max: 80, location: "ثلاجة 1 · رف A", lastCountedDays: 1, batches: [{ qty: 18, daysLeft: 5 }, { qty: 10, daysLeft: 12 }] },
  { catalogId: "c-mince", current: 8, min: 12, max: 40, location: "ثلاجة 1 · رف B", lastCountedDays: 1, batches: [{ qty: 8, daysLeft: 4 }] },
  { catalogId: "c-kebab-mix", current: 14, min: 8, max: 30, location: "ثلاجة 2 · رف A", lastCountedDays: 2, batches: [{ qty: 6, daysLeft: 2 }, { qty: 8, daysLeft: 9 }] },
  { catalogId: "c-shawarma", current: 18, min: 12, max: 45, location: "ثلاجة 2 · رف B", lastCountedDays: 2, batches: [{ qty: 12, daysLeft: 7 }, { qty: 6, daysLeft: 14 }] },
  { catalogId: "c-chicken", current: 22, min: 15, max: 50, location: "ثلاجة 1 · رف C", lastCountedDays: 1, batches: [{ qty: 14, daysLeft: 3 }, { qty: 8, daysLeft: 8 }] },
  { catalogId: "c-mozzarella", current: 6, min: 8, max: 30, location: "ثلاجة 3 · رف A", lastCountedDays: 1, batches: [{ qty: 6, daysLeft: 6 }] },
  { catalogId: "c-cheddar", current: 4, min: 5, max: 20, location: "ثلاجة 3 · رف A", lastCountedDays: 3, batches: [{ qty: 4, daysLeft: 11 }] },
  { catalogId: "c-cream", current: 0, min: 4, max: 15, location: "ثلاجة 3 · رف B", lastCountedDays: 1, batches: [] },
  { catalogId: "c-tomato", current: 32, min: 18, max: 60, location: "تخزين بارد · رف A", lastCountedDays: 0, batches: [{ qty: 20, daysLeft: 4 }, { qty: 12, daysLeft: 7 }] },
  { catalogId: "c-onion", current: 40, min: 15, max: 50, location: "تخزين جاف · رف A", lastCountedDays: 5, batches: [{ qty: 40, daysLeft: 30 }] },
  { catalogId: "c-lettuce", current: 5, min: 4, max: 12, location: "تخزين بارد · رف B", lastCountedDays: 0, batches: [{ qty: 5, daysLeft: 2 }] },
  { catalogId: "c-bun", current: 12, min: 6, max: 24, location: "تخزين جاف · رف B", lastCountedDays: 1, batches: [{ qty: 8, daysLeft: 6 }, { qty: 4, daysLeft: 9 }] },
  { catalogId: "c-egg", current: 18, min: 8, max: 24, location: "ثلاجة 4", lastCountedDays: 1, batches: [{ qty: 18, daysLeft: 18 }] },
  { catalogId: "c-coke", current: 14, min: 10, max: 40, location: "تخزين عادي · رف C", lastCountedDays: 7, batches: [{ qty: 14, daysLeft: 180 }] },
  { catalogId: "c-water", current: 22, min: 12, max: 40, location: "تخزين عادي · رف C", lastCountedDays: 7, batches: [{ qty: 22, daysLeft: 365 }] },
  { catalogId: "c-fries", current: 5, min: 6, max: 18, location: "فريزر 1", lastCountedDays: 2, batches: [{ qty: 5, daysLeft: 90 }] },
];

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function daysAgo(n: number): string {
  if (n === 0) return "اليوم";
  if (n === 1) return "أمس";
  return `منذ ${n} أيام`;
}

export const branchStock: StockItem[] = baseStockData.map((s, idx) => {
  const cat = catalog.find((c) => c.id === s.catalogId);
  if (!cat) throw new Error(`Catalog item ${s.catalogId} not found`);

  const expiryBatches: ExpiryBatch[] = s.batches.map((b, i) => ({
    id: `bt-${s.catalogId}-${i}`,
    qty: b.qty,
    expiryDate: todayPlus(b.daysLeft),
    daysLeft: b.daysLeft,
  }));

  const health = deriveHealth(s.current, s.min, expiryBatches);

  // Generate plausible movements
  const movements: Movement[] = [
    { id: `mv-${idx}-1`, type: "receive", qty: 18, timestamp: "اليوم · 7:24 ص", actor: "منى محمود", reference: "#SH-2812" },
    { id: `mv-${idx}-2`, type: "sale-deplete", qty: -8, timestamp: "اليوم · 12:18 م", actor: "كاشير", note: "بيع طبيعي وردية الصباح" },
    { id: `mv-${idx}-3`, type: "transfer-out", qty: -2, timestamp: "أمس · 4:45 م", actor: "كريم العشري", reference: "→ فرع الزمالك" },
    { id: `mv-${idx}-4`, type: "count-adjust", qty: -1, timestamp: "أمس · 9:42 م", actor: "هشام جمال", note: "جرد دوري — انحراف بسيط" },
  ];

  return {
    id: `st-${s.catalogId}`,
    catalogId: s.catalogId,
    catalog: cat,
    branchId,
    currentQty: s.current,
    minQty: s.min,
    maxQty: s.max,
    location: s.location,
    lastCountedAt: daysAgo(s.lastCountedDays),
    expiryBatches,
    movements,
    health,
    daysUntilOOS: s.current === 0 ? 0 : Math.max(1, Math.round(s.current / Math.max(1, s.min / 4))),
  };
});

/* Helpers */
export function getStockItem(id: string): StockItem | undefined {
  return branchStock.find((s) => s.id === id || s.catalogId === id);
}

export const stockHealthMeta: Record<
  StockHealth,
  { label: string; intent: "neutral" | "info" | "warning" | "success" | "danger" | "brand" }
> = {
  good: { label: "متوفر", intent: "success" },
  low: { label: "منخفض", intent: "warning" },
  critical: { label: "حرج", intent: "danger" },
  expiring: { label: "قارب الانتهاء", intent: "warning" },
  out: { label: "نفد", intent: "danger" },
};

/* Aggregate counts */
export const stockCounts = {
  total: branchStock.length,
  good: branchStock.filter((s) => s.health === "good").length,
  low: branchStock.filter((s) => s.health === "low").length,
  critical: branchStock.filter((s) => s.health === "critical").length,
  expiring: branchStock.filter((s) => s.health === "expiring").length,
  out: branchStock.filter((s) => s.health === "out").length,
};

/* Total value of stock */
export const totalStockValue = branchStock.reduce(
  (sum, s) => sum + s.currentQty * s.catalog.pricePerUnit,
  0
);

/* Expiring items grouped by urgency */
export const expiringItems = branchStock
  .filter((s) => s.expiryBatches.some((b) => b.daysLeft <= 7))
  .map((s) => ({
    item: s,
    earliestBatch: s.expiryBatches.reduce(
      (min, b) => (b.daysLeft < min.daysLeft ? b : min),
      s.expiryBatches[0]
    ),
  }))
  .sort((a, b) => a.earliestBatch.daysLeft - b.earliestBatch.daysLeft);

/* Movement type metadata */
export const movementMeta: Record<
  MovementType,
  { label: string; intent: "info" | "success" | "danger" | "warning" | "neutral" | "brand" }
> = {
  receive: { label: "استلام", intent: "success" },
  dispatch: { label: "إرسال", intent: "info" },
  "transfer-in": { label: "تحويل وارد", intent: "info" },
  "transfer-out": { label: "تحويل صادر", intent: "warning" },
  waste: { label: "هدر", intent: "danger" },
  "count-adjust": { label: "تعديل جرد", intent: "neutral" },
  "sale-deplete": { label: "استهلاك بيع", intent: "neutral" },
};
