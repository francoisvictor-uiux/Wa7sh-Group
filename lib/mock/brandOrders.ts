/**
 * Synthetic per-brand order history.
 *
 * Generated deterministically from the existing branch-consumption seeds so
 * the totals roughly line up with what the dashboard reports. Each order has
 * a date, branch, and an item breakdown — quantities in kg/ل/كرتونة, never
 * prices.
 */

import {
  branchConsumption,
  monthLabels,
  allMonths,
  type Month,
} from "./branchConsumption";
import { brandMeta, type BrandId } from "./branches";

export interface BrandOrderItem {
  catalogId: string;
  name: string;
  qty: number;
  unit: "كجم" | "لتر" | "كرتونة" | "كيس";
}

/**
 * Lifecycle status — same vocabulary as the requests module so timelines
 * read consistently. Cancelled / disputed orders short-circuit the chain.
 */
export type BrandOrderStatus =
  | "requested"
  | "approved"
  | "preparing"
  | "loaded"
  | "in-transit"
  | "delivered"
  | "confirmed"
  | "cancelled"
  | "disputed";

export interface OrderTimelineEvent {
  status: BrandOrderStatus;
  timestamp: string;       // human Arabic
  actor?: string;          // who performed it
  note?: string;
}

export interface BrandOrder {
  id: string;
  number: string;          // human-readable "#OR-1042"
  brandId: BrandId;
  branchId: string;
  branchName: string;
  month: Month;
  date: string;            // human Arabic — request creation
  totalKg: number;         // headline number
  itemCount: number;
  status: BrandOrderStatus; // terminal status of the order
  items: BrandOrderItem[];
  timeline: OrderTimelineEvent[];
}

/* ----------------------------------------------------------------------
 * Item pools per brand. Each brand has a curated set so the breakdown
 * looks plausible.
 * -------------------------------------------------------------------- */

const itemPool: Record<BrandId, Array<Omit<BrandOrderItem, "qty">>> = {
  wahsh: [
    { catalogId: "c-burger-patty", name: "لحم برجر — قطعة 150ج", unit: "كجم" },
    { catalogId: "c-mince",         name: "لحم مفروم بقري",        unit: "كجم" },
    { catalogId: "c-bun",           name: "خبز برجر",              unit: "كرتونة" },
    { catalogId: "c-cheddar",       name: "جبنة شيدر شرائح",        unit: "كجم" },
    { catalogId: "c-lettuce",       name: "خس",                     unit: "كجم" },
    { catalogId: "c-tomato",        name: "طماطم",                  unit: "كجم" },
    { catalogId: "c-fries",         name: "بطاطس مجمدة",            unit: "كرتونة" },
    { catalogId: "c-coke",          name: "كوكاكولا 330مل",         unit: "كرتونة" },
  ],
  kababgy: [
    { catalogId: "c-kebab-mix",  name: "تتبيلة كباب جاهزة",      unit: "كجم" },
    { catalogId: "c-shawarma",   name: "شاورما خام متبّلة",       unit: "كجم" },
    { catalogId: "c-chicken",    name: "صدر دجاج مخلية",          unit: "كجم" },
    { catalogId: "c-chicken-leg",name: "أوراك دجاج",              unit: "كجم" },
    { catalogId: "c-onion",      name: "بصل",                     unit: "كجم" },
    { catalogId: "c-tomato",     name: "طماطم",                   unit: "كجم" },
    { catalogId: "c-water",      name: "مياه معدنية 600مل",        unit: "كرتونة" },
  ],
  forno: [
    { catalogId: "c-pizza-dough", name: "عجينة بيتزا — كرة 250ج", unit: "كرتونة" },
    { catalogId: "c-mozzarella",  name: "جبنة موزاريلا",          unit: "كجم" },
    { catalogId: "c-flour",       name: "دقيق إيطالي 00",         unit: "كيس" },
    { catalogId: "c-cream",       name: "كريمة طبخ",              unit: "لتر" },
    { catalogId: "c-tomato",      name: "طماطم",                   unit: "كجم" },
    { catalogId: "c-coffee",      name: "بن إسبريسو",              unit: "كيس" },
  ],
};

function seedFromString(s: string): number {
  return [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 13);
}

function pseudoRandom(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/* ----------------------------------------------------------------------
 * Generate orders deterministically.
 * For each (brand × branch × month) we emit `orderCount` orders, each
 * carrying 3-6 line items whose total kg sums to roughly the branch's
 * monthly weight figure (value/50, matching the dashboard helper).
 * -------------------------------------------------------------------- */

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function buildTimeline(
  rand: () => number,
  baseDay: number,
  baseHour: number,
  baseMinute: number,
  monthLabel: string,
  approver: string,
  driver: string,
  receiver: string,
): { timeline: OrderTimelineEvent[]; status: BrandOrderStatus } {
  // Choose a terminal status — most orders complete, a small share is
  // cancelled or disputed. Distribution: 60% confirmed, 25% delivered,
  // 8% in-transit, 4% cancelled, 3% disputed.
  const r = rand();
  const status: BrandOrderStatus =
    r < 0.04 ? "cancelled" :
    r < 0.07 ? "disputed" :
    r < 0.15 ? "in-transit" :
    r < 0.40 ? "delivered" :
               "confirmed";

  let h = baseHour, m = baseMinute;
  const stamp = (incMin: number) => {
    m += incMin;
    while (m >= 60) { m -= 60; h += 1; }
    return `${monthLabel} ${baseDay} · ${pad2(h)}:${pad2(m)}`;
  };

  const events: OrderTimelineEvent[] = [
    {
      status: "requested",
      timestamp: stamp(0),
      actor: receiver,
      note: "تم إنشاء الطلب من الفرع",
    },
  ];

  if (status === "cancelled") {
    events.push({
      status: "cancelled",
      timestamp: stamp(8 + Math.floor(rand() * 25)),
      actor: receiver,
      note: "إلغاء بناءً على طلب الفرع قبل الموافقة",
    });
    return { timeline: events, status };
  }

  events.push({
    status: "approved",
    timestamp: stamp(10 + Math.floor(rand() * 20)),
    actor: approver,
    note: "تمت الموافقة على الطلب",
  });
  events.push({
    status: "preparing",
    timestamp: stamp(15 + Math.floor(rand() * 25)),
    actor: "فريق التحضير",
    note: "بدأ تحضير الأصناف بالمصنع",
  });
  events.push({
    status: "loaded",
    timestamp: stamp(35 + Math.floor(rand() * 30)),
    actor: "فريق الشحن",
    note: "تم تحميل الشحنة على عربة التوزيع",
  });
  events.push({
    status: "in-transit",
    timestamp: stamp(20 + Math.floor(rand() * 25)),
    actor: driver,
    note: "السائق في طريقه إلى الفرع",
  });

  if (status === "in-transit") {
    return { timeline: events, status };
  }

  events.push({
    status: "delivered",
    timestamp: stamp(35 + Math.floor(rand() * 35)),
    actor: driver,
    note: "تم التسليم للفرع",
  });

  if (status === "disputed") {
    events.push({
      status: "disputed",
      timestamp: stamp(40 + Math.floor(rand() * 30)),
      actor: receiver,
      note: "فرق في الكميات المستلمة — قيد المراجعة",
    });
    return { timeline: events, status };
  }

  if (status === "delivered") {
    return { timeline: events, status };
  }

  events.push({
    status: "confirmed",
    timestamp: stamp(15 + Math.floor(rand() * 30)),
    actor: receiver,
    note: "تأكيد الاستلام بعد المطابقة",
  });
  return { timeline: events, status: "confirmed" };
}

function generateOrdersForBranch(brandId: BrandId, branchId: string, branchName: string): BrandOrder[] {
  const consumption = branchConsumption.find((b) => b.branchId === branchId);
  if (!consumption) return [];

  const pool = itemPool[brandId];
  const out: BrandOrder[] = [];
  let serial = 0;

  // Per-branch supporting cast, drawn deterministically from short rosters.
  const branchSeed = seedFromString(branchId);
  const approvers = ["أحمد رضا", "طارق سعيد", "سامر فؤاد"];
  const drivers   = ["محمود علي", "كريم حسن", "إبراهيم خالد", "ماجد عوض"];
  const receivers = ["منى محمود", "رامي صبري", "ياسمين فاروق", "أنس فؤاد", "هشام جمال"];
  const approver = approvers[branchSeed % approvers.length];
  const driver   = drivers[branchSeed % drivers.length];
  const receiver = receivers[branchSeed % receivers.length];

  allMonths.forEach((month) => {
    const rec = consumption.monthly[month];
    const totalKgForMonth = Math.round(rec.value / 50);
    const orderCount = rec.orderCount;
    const monthLabel = monthLabels[month];
    const seed = seedFromString(`${branchId}-${month}`);
    const rand = pseudoRandom(seed);

    for (let i = 0; i < orderCount; i++) {
      serial += 1;
      const orderKg = Math.max(40, Math.round((totalKgForMonth / orderCount) * (0.7 + rand() * 0.6)));
      const itemCount = 3 + Math.floor(rand() * 4); // 3-6 items
      const items: BrandOrderItem[] = [];
      let allocated = 0;

      // Build item list from a shuffled-ish slice of the pool
      const startIdx = Math.floor(rand() * pool.length);
      for (let k = 0; k < itemCount; k++) {
        const cand = pool[(startIdx + k) % pool.length];
        const remaining = orderKg - allocated;
        const slice = k === itemCount - 1
          ? Math.max(2, remaining)
          : Math.max(2, Math.round(remaining * (0.25 + rand() * 0.35)));
        const qty =
          cand.unit === "كرتونة" ? Math.max(1, Math.round(slice / 10)) :
          cand.unit === "كيس"    ? Math.max(1, Math.round(slice / 15)) :
          cand.unit === "لتر"    ? Math.max(2, slice) :
                                   Math.max(2, slice);
        items.push({ ...cand, qty });
        allocated += slice;
      }

      const day = 1 + Math.floor(rand() * 28);
      const hour = 7 + Math.floor(rand() * 6);
      const minute = Math.floor(rand() * 60);

      const { timeline, status } = buildTimeline(rand, day, hour, minute, monthLabel, approver, driver, receiver);

      out.push({
        id:        `or-${branchId}-${month}-${i}`,
        number:    `#OR-${(2000 + serial * 7).toString()}`,
        brandId,
        branchId,
        branchName,
        month,
        date:      `${monthLabel} ${day} · ${pad2(hour)}:${pad2(minute)}`,
        totalKg:   orderKg,
        itemCount: items.length,
        status,
        items,
        timeline,
      });
    }
  });

  return out.reverse();
}

/* ----------------------------------------------------------------------
 * Cache per-brand orders so re-renders don't regenerate.
 * -------------------------------------------------------------------- */

const cache: Partial<Record<BrandId, BrandOrder[]>> = {};

export function getBrandOrders(brandId: BrandId): BrandOrder[] {
  if (cache[brandId]) return cache[brandId]!;
  const branches = branchConsumption.filter((b) => b.brandId === brandId);
  const orders = branches.flatMap((b) =>
    generateOrdersForBranch(brandId, b.branchId, b.branchName)
  );
  // Sort newest month first, then most recent within month
  orders.sort((a, b) => {
    if (a.month !== b.month) return b.month.localeCompare(a.month);
    return b.id.localeCompare(a.id);
  });
  cache[brandId] = orders;
  return orders;
}

export function getBrandOrderCounts(brandId: BrandId): {
  total: number;
  byMonth: Record<Month, number>;
  byBranch: Record<string, number>;
} {
  const orders = getBrandOrders(brandId);
  const byMonth = allMonths.reduce(
    (acc, m) => ({ ...acc, [m]: orders.filter((o) => o.month === m).length }),
    {} as Record<Month, number>,
  );
  const byBranch: Record<string, number> = {};
  orders.forEach((o) => { byBranch[o.branchId] = (byBranch[o.branchId] ?? 0) + 1; });
  return { total: orders.length, byMonth, byBranch };
}

export { brandMeta };
