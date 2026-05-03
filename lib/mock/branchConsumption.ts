/**
 * Per-branch monthly consumption from the factory.
 *
 * Synthesizes realistic monthly aggregates for each branch — value of goods
 * received from the factory + order count + top item. Used by the factory
 * dashboard to show "ما الذي أخذه كل فرع شهرياً".
 */

import { allBranches, branchMap, type BrandId } from "@/lib/mock/branches";

export type Month = "2026-01" | "2026-02" | "2026-03" | "2026-04" | "2026-05";

export interface MonthRecord {
  value: number;
  orderCount: number;
  topItem: string;
}

export interface BranchConsumption {
  branchId: string;
  branchName: string;
  brandId: BrandId;
  monthly: Record<Month, MonthRecord>;
  ytdValue: number;
  ytdOrders: number;
}

export const monthLabels: Record<Month, string> = {
  "2026-01": "يناير",
  "2026-02": "فبراير",
  "2026-03": "مارس",
  "2026-04": "أبريل",
  "2026-05": "مايو",
};

export const allMonths: Month[] = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05"];

/* ----------------------------------------------------------------------
 * Generate a deterministic-but-realistic series per branch.
 * Uses a small per-branch seed so the numbers feel intentional rather
 * than random across reloads.
 * -------------------------------------------------------------------- */

function seedFromId(id: string): number {
  return [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 7);
}

function genSeries(branchId: string, brand: BrandId): Record<Month, MonthRecord> {
  const seed = seedFromId(branchId);
  // Base value scaled slightly by brand (forno smaller volume, kababgy bigger meat)
  const brandFactor = brand === "kababgy" ? 1.18 : brand === "forno" ? 0.82 : 1.0;
  const base = (180_000 + (seed % 90_000)) * brandFactor;

  const items: Record<BrandId, string[]> = {
    wahsh:   ["لحم برجر — قطعة 150ج", "خبز برجر", "جبنة شيدر شرائح"],
    kababgy: ["تتبيلة كباب جاهزة", "شاورما خام متبّلة", "أوراك دجاج"],
    forno:   ["جبنة موزاريلا", "عجينة بيتزا", "دقيق إيطالي 00"],
  };
  const topPool = items[brand];

  const out = {} as Record<Month, MonthRecord>;
  allMonths.forEach((m, i) => {
    // Light upward trend + small per-month noise + seasonal mid-month bump
    const trend = 1 + i * 0.04;
    const noise = ((seed * (i + 7)) % 17 - 8) / 100;
    const seasonal = (i === 2 || i === 3) ? 1.06 : 1.0;
    const value = Math.round(base * trend * seasonal * (1 + noise));
    const orderCount = 18 + ((seed + i) % 9);
    const topItem = topPool[(seed + i) % topPool.length];
    out[m] = { value, orderCount, topItem };
  });
  return out;
}

export const branchConsumption: BranchConsumption[] = allBranches.map((b) => {
  const monthly = genSeries(b.id, b.brandId);
  const ytdValue = Object.values(monthly).reduce((s, v) => s + v.value, 0);
  const ytdOrders = Object.values(monthly).reduce((s, v) => s + v.orderCount, 0);
  return {
    branchId: b.id,
    branchName: b.name,
    brandId: b.brandId,
    monthly,
    ytdValue,
    ytdOrders,
  };
});

export function getBranchConsumption(branchId: string) {
  return branchConsumption.find((c) => c.branchId === branchId);
}

/* ----------------------------------------------------------------------
 * Roll-ups for the dashboard
 * -------------------------------------------------------------------- */

export function totalForMonth(month: Month): number {
  return branchConsumption.reduce((s, b) => s + b.monthly[month].value, 0);
}

export function topBranchesForMonth(month: Month, n = 5): BranchConsumption[] {
  return [...branchConsumption]
    .sort((a, b) => b.monthly[month].value - a.monthly[month].value)
    .slice(0, n);
}

export function brandTotalForMonth(brand: BrandId, month: Month): number {
  return branchConsumption
    .filter((b) => b.brandId === brand)
    .reduce((s, b) => s + b.monthly[month].value, 0);
}

/**
 * Weight in kg derived from the synthetic value series. The mock generator
 * was built around currency, but the dashboard now reports weights only —
 * this divisor turns the existing seeded values into plausible kg figures
 * (a few thousand kg per branch per month).
 */
const KG_PER_VALUE_UNIT = 1 / 50;

export function valueToKg(value: number): number {
  return Math.round(value * KG_PER_VALUE_UNIT);
}

export function branchWeightForMonth(branchId: string, month: Month): number {
  const c = branchConsumption.find((b) => b.branchId === branchId);
  return c ? valueToKg(c.monthly[month].value) : 0;
}

export function brandWeightForMonth(brand: BrandId, month: Month): number {
  return valueToKg(brandTotalForMonth(brand, month));
}

export function totalWeightForMonth(month: Month): number {
  return valueToKg(totalForMonth(month));
}

/* small helper exported alongside, since the dashboard needs the branch map */
export { branchMap };
