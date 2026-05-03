/**
 * Factory Inventory — raw materials + finished goods at the main warehouse.
 * Separate from branch stock (lib/mock/inventory.ts).
 */

import type { BrandId } from "@/lib/mock/branches";

export type StockLevel = "good" | "low" | "critical" | "out";

export interface FactoryStockItem {
  id:          string;
  name:        string;
  sku:         string;
  category:    string;
  unit:        string;
  currentQty:  number;
  minQty:      number;
  maxQty:      number;
  location:    string;
  brand:       BrandId | "shared";
  expiryDate?: string;
  daysToExpiry?: number;
  lastUpdated: string;
  level:       StockLevel;
  pricePerUnit: number;
}

function level(current: number, min: number): StockLevel {
  if (current === 0)         return "out";
  if (current <= min * 0.5)  return "critical";
  if (current <= min)        return "low";
  return "good";
}

const items: Omit<FactoryStockItem, "level">[] = [
  // ── لحوم ──────────────────────────────────────────────────────────────────
  { id: "fi-001", name: "لحم برجر — قطعة 150ج", sku: "WB-B-001", category: "لحوم",    unit: "كجم",    currentQty: 320, minQty: 80,  maxQty: 500, location: "ثلاجة 1", brand: "wahsh",   expiryDate: "2026-05-05", daysToExpiry: 5,  lastUpdated: "اليوم · 7:00 ص", pricePerUnit: 285 },
  { id: "fi-002", name: "لحم مفروم بقري",        sku: "WB-B-002", category: "لحوم",    unit: "كجم",    currentQty: 210, minQty: 60,  maxQty: 300, location: "ثلاجة 1", brand: "shared",  expiryDate: "2026-05-04", daysToExpiry: 4,  lastUpdated: "اليوم · 7:00 ص", pricePerUnit: 245 },
  { id: "fi-003", name: "تتبيلة كباب جاهزة",     sku: "KB-K-001", category: "لحوم",    unit: "كجم",    currentQty: 90,  minQty: 30,  maxQty: 150, location: "ثلاجة 2", brand: "kababgy", expiryDate: "2026-05-07", daysToExpiry: 7,  lastUpdated: "أمس",            pricePerUnit: 320 },
  { id: "fi-004", name: "شاورما خام متبّلة",     sku: "KB-S-001", category: "لحوم",    unit: "كجم",    currentQty: 140, minQty: 50,  maxQty: 200, location: "ثلاجة 2", brand: "kababgy", expiryDate: "2026-05-06", daysToExpiry: 6,  lastUpdated: "أمس",            pricePerUnit: 295 },
  { id: "fi-005", name: "صدر دجاج مخلية",        sku: "FN-CH-001", category: "دواجن",  unit: "كجم",    currentQty: 25,  minQty: 60,  maxQty: 250, location: "ثلاجة 3", brand: "shared",  expiryDate: "2026-05-03", daysToExpiry: 3,  lastUpdated: "اليوم · 7:00 ص", pricePerUnit: 195 },
  { id: "fi-006", name: "أوراك دجاج",             sku: "KB-CH-002", category: "دواجن",  unit: "كجم",    currentQty: 95,  minQty: 40,  maxQty: 180, location: "ثلاجة 3", brand: "kababgy", expiryDate: "2026-05-08", daysToExpiry: 8,  lastUpdated: "أمس",            pricePerUnit: 165 },
  // ── ألبان ─────────────────────────────────────────────────────────────────
  { id: "fi-007", name: "جبنة موزاريلا",          sku: "FN-MZ-001", category: "ألبان",  unit: "كجم",    currentQty: 120, minQty: 40,  maxQty: 200, location: "ثلاجة 4", brand: "forno",   expiryDate: "2026-05-10", daysToExpiry: 10, lastUpdated: "أمس",            pricePerUnit: 215 },
  { id: "fi-008", name: "جبنة شيدر شرائح",        sku: "WB-CH-001", category: "ألبان",  unit: "كجم",    currentQty: 18,  minQty: 25,  maxQty: 80,  location: "ثلاجة 4", brand: "wahsh",   expiryDate: "2026-05-15", daysToExpiry: 15, lastUpdated: "أمس",            pricePerUnit: 190 },
  { id: "fi-009", name: "كريمة طبخ",              sku: "FN-CR-001", category: "ألبان",  unit: "لتر",    currentQty: 0,   minQty: 30,  maxQty: 100, location: "ثلاجة 4", brand: "forno",   lastUpdated: "منذ 3 أيام", pricePerUnit: 75 },
  // ── خضار ──────────────────────────────────────────────────────────────────
  { id: "fi-010", name: "طماطم",                  sku: "SH-V-001",  category: "خضار",   unit: "كجم",    currentQty: 220, minQty: 80,  maxQty: 400, location: "تخزين بارد", brand: "shared", expiryDate: "2026-05-04", daysToExpiry: 4, lastUpdated: "اليوم · 6:00 ص", pricePerUnit: 28 },
  { id: "fi-011", name: "بصل",                    sku: "SH-V-002",  category: "خضار",   unit: "كجم",    currentQty: 180, minQty: 60,  maxQty: 300, location: "تخزين جاف", brand: "shared",  lastUpdated: "أمس",        pricePerUnit: 22 },
  { id: "fi-012", name: "خس",                     sku: "WB-V-001",  category: "خضار",   unit: "كجم",    currentQty: 22,  minQty: 20,  maxQty: 80,  location: "تخزين بارد", brand: "wahsh", expiryDate: "2026-05-02", daysToExpiry: 2, lastUpdated: "اليوم · 6:00 ص", pricePerUnit: 35 },
  // ── مخبوزات ───────────────────────────────────────────────────────────────
  { id: "fi-013", name: "خبز برجر",               sku: "WB-D-001",  category: "مخبوزات", unit: "كرتونة", currentQty: 64, minQty: 20,  maxQty: 120, location: "تخزين جاف", brand: "wahsh",  expiryDate: "2026-05-06", daysToExpiry: 6, lastUpdated: "أمس",             pricePerUnit: 240 },
  { id: "fi-014", name: "عجينة بيتزا",            sku: "FN-D-001",  category: "مخبوزات", unit: "كرتونة", currentQty: 12, minQty: 16,  maxQty: 60,  location: "فريزر 1",   brand: "forno",  expiryDate: "2026-05-30", daysToExpiry: 30, lastUpdated: "منذ يومين",       pricePerUnit: 180 },
  { id: "fi-015", name: "دقيق إيطالي 00",         sku: "FN-F-001",  category: "مخبوزات", unit: "كيس",   currentQty: 30, minQty: 10,  maxQty: 60,  location: "تخزين جاف", brand: "forno",   lastUpdated: "منذ أسبوع",  pricePerUnit: 420 },
  // ── مشروبات ───────────────────────────────────────────────────────────────
  { id: "fi-016", name: "كوكاكولا 330مل",         sku: "WB-DR-001", category: "مشروبات", unit: "كرتونة", currentQty: 56, minQty: 24,  maxQty: 120, location: "تخزين عادي", brand: "shared", lastUpdated: "منذ أسبوع",  pricePerUnit: 180 },
  { id: "fi-017", name: "مياه معدنية 600مل",      sku: "SH-DR-001", category: "مشروبات", unit: "كرتونة", currentQty: 80, minQty: 30,  maxQty: 150, location: "تخزين عادي", brand: "shared", lastUpdated: "منذ أسبوع",  pricePerUnit: 65  },
];

export const factoryStock: FactoryStockItem[] = items.map((i) => ({
  ...i,
  level: level(i.currentQty, i.minQty),
}));

export const factoryStockCounts = {
  total:    factoryStock.length,
  good:     factoryStock.filter((i) => i.level === "good").length,
  low:      factoryStock.filter((i) => i.level === "low").length,
  critical: factoryStock.filter((i) => i.level === "critical").length,
  out:      factoryStock.filter((i) => i.level === "out").length,
  expiring: factoryStock.filter((i) => (i.daysToExpiry ?? 99) <= 5).length,
};

export const categories = [...new Set(factoryStock.map((i) => i.category))];

export const levelMeta: Record<StockLevel, { label: string; color: string; bg: string }> = {
  good:     { label: "متوفر",  color: "text-status-success", bg: "bg-status-success/10 border-status-success/30" },
  low:      { label: "منخفض", color: "text-status-warning", bg: "bg-status-warning/10 border-status-warning/30" },
  critical: { label: "حرج",   color: "text-status-danger",  bg: "bg-status-danger/10  border-status-danger/30"  },
  out:      { label: "نفد",   color: "text-status-danger",  bg: "bg-status-danger/10  border-status-danger/30"  },
};
