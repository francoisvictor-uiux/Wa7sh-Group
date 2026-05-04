/**
 * Mock requests + catalog data.
 *
 * Status lifecycle (per UX strategy):
 *   requested → approved → preparing → loaded → in-transit → delivered → confirmed → closed
 * Edge states: on-hold, disputed, rejected, cancelled
 */

import type { LucideIcon } from "lucide-react";
import {
  Beef,
  Drumstick,
  Pizza,
  Wheat,
  Milk,
  Egg,
  Salad,
  Coffee,
  Cookie,
  CupSoda,
  Apple,
  Soup,
  Flame,
  Carrot,
} from "lucide-react";

export type RequestStatus =
  | "requested"
  | "approved"
  | "preparing"
  | "loaded"
  | "in-transit"
  | "delivered"
  | "confirmed"
  | "closed"
  | "on-hold"
  | "disputed"
  | "rejected"
  | "cancelled";

export const statusMeta: Record<
  RequestStatus,
  { label: string; intent: "neutral" | "info" | "warning" | "success" | "danger" | "brand"; step: number }
> = {
  requested: { label: "تم الطلب", intent: "info", step: 1 },
  approved: { label: "تمت الموافقة", intent: "info", step: 2 },
  preparing: { label: "جاري التحضير", intent: "brand", step: 3 },
  loaded: { label: "تم التحميل", intent: "brand", step: 4 },
  "in-transit": { label: "في الطريق", intent: "warning", step: 5 },
  delivered: { label: "تم التسليم", intent: "success", step: 6 },
  confirmed: { label: "تم التأكيد", intent: "success", step: 7 },
  closed: { label: "مغلق", intent: "neutral", step: 8 },
  "on-hold": { label: "معلّق", intent: "warning", step: 0 },
  disputed: { label: "متنازع عليه", intent: "danger", step: 0 },
  rejected: { label: "مرفوض", intent: "danger", step: 0 },
  cancelled: { label: "ملغى", intent: "neutral", step: 0 },
};

export interface CatalogItem {
  id: string;
  sku: string;
  name: string;
  category: "lhom" | "dawajen" | "albaan" | "khodar" | "dakik" | "mashroob" | "moshtaqat" | "other";
  unit: "كجم" | "لتر" | "علبة" | "كرتونة" | "حبة" | "كيس";
  pricePerUnit: number; // EGP
  brand: "wahsh" | "kababgy" | "forno" | "shared";
  icon: LucideIcon;
  imageHue?: string;
  stockAtFactory: number;
  reorderPoint: number;
  popular?: boolean;
}

export const catalog: CatalogItem[] = [
  { id: "c-burger-patty", sku: "WB-B-001", name: "لحم برجر — قطعة 150ج", category: "lhom", unit: "كجم", pricePerUnit: 285, brand: "wahsh", icon: Beef, imageHue: "12 60% 35%", stockAtFactory: 320, reorderPoint: 80, popular: true },
  { id: "c-mince", sku: "WB-B-002", name: "لحم مفروم بقري", category: "lhom", unit: "كجم", pricePerUnit: 245, brand: "shared", icon: Beef, stockAtFactory: 210, reorderPoint: 60, popular: true },
  { id: "c-kebab-mix", sku: "KB-K-001", name: "تتبيلة كباب جاهزة", category: "lhom", unit: "كجم", pricePerUnit: 320, brand: "kababgy", icon: Flame, stockAtFactory: 90, reorderPoint: 30 },
  { id: "c-shawarma", sku: "KB-S-001", name: "شاورما خام متبّلة", category: "lhom", unit: "كجم", pricePerUnit: 295, brand: "kababgy", icon: Drumstick, stockAtFactory: 140, reorderPoint: 50 },
  { id: "c-chicken", sku: "FN-CH-001", name: "صدر دجاج مخلية", category: "dawajen", unit: "كجم", pricePerUnit: 195, brand: "shared", icon: Drumstick, stockAtFactory: 180, reorderPoint: 60, popular: true },
  { id: "c-chicken-leg", sku: "KB-CH-002", name: "أوراك دجاج", category: "dawajen", unit: "كجم", pricePerUnit: 165, brand: "kababgy", icon: Drumstick, stockAtFactory: 95, reorderPoint: 40 },
  { id: "c-mozzarella", sku: "FN-CH-001", name: "جبنة موزاريلا", category: "albaan", unit: "كجم", pricePerUnit: 215, brand: "forno", icon: Milk, stockAtFactory: 120, reorderPoint: 40, popular: true },
  { id: "c-cheddar", sku: "WB-CH-001", name: "جبنة شيدر شرائح", category: "albaan", unit: "كجم", pricePerUnit: 190, brand: "wahsh", icon: Milk, stockAtFactory: 60, reorderPoint: 25 },
  { id: "c-cream", sku: "FN-CR-001", name: "كريمة طبخ", category: "albaan", unit: "لتر", pricePerUnit: 75, brand: "forno", icon: Milk, stockAtFactory: 80, reorderPoint: 30 },
  { id: "c-tomato", sku: "SH-V-001", name: "طماطم", category: "khodar", unit: "كجم", pricePerUnit: 28, brand: "shared", icon: Apple, stockAtFactory: 220, reorderPoint: 80, popular: true },
  { id: "c-onion", sku: "SH-V-002", name: "بصل", category: "khodar", unit: "كجم", pricePerUnit: 22, brand: "shared", icon: Carrot, stockAtFactory: 180, reorderPoint: 60 },
  { id: "c-lettuce", sku: "WB-V-001", name: "خس", category: "khodar", unit: "كجم", pricePerUnit: 35, brand: "wahsh", icon: Salad, stockAtFactory: 50, reorderPoint: 20 },
  { id: "c-bun", sku: "WB-D-001", name: "خبز برجر — حبة", category: "dakik", unit: "كرتونة", pricePerUnit: 240, brand: "wahsh", icon: Wheat, stockAtFactory: 64, reorderPoint: 20, popular: true },
  { id: "c-pizza-dough", sku: "FN-D-001", name: "عجينة بيتزا — كرة 250ج", category: "dakik", unit: "كرتونة", pricePerUnit: 180, brand: "forno", icon: Pizza, stockAtFactory: 48, reorderPoint: 16 },
  { id: "c-flour", sku: "FN-F-001", name: "دقيق إيطالي 00", category: "dakik", unit: "كيس", pricePerUnit: 420, brand: "forno", icon: Wheat, stockAtFactory: 30, reorderPoint: 10 },
  { id: "c-egg", sku: "SH-E-001", name: "بيض — طبق", category: "moshtaqat", unit: "كرتونة", pricePerUnit: 145, brand: "shared", icon: Egg, stockAtFactory: 42, reorderPoint: 18 },
  { id: "c-coke", sku: "WB-DR-001", name: "كوكاكولا 330مل", category: "mashroob", unit: "كرتونة", pricePerUnit: 180, brand: "shared", icon: CupSoda, stockAtFactory: 56, reorderPoint: 24 },
  { id: "c-water", sku: "SH-DR-001", name: "مياه معدنية 600مل", category: "mashroob", unit: "كرتونة", pricePerUnit: 65, brand: "shared", icon: CupSoda, stockAtFactory: 80, reorderPoint: 30 },
  { id: "c-coffee", sku: "FN-DR-001", name: "بن إسبريسو", category: "mashroob", unit: "كيس", pricePerUnit: 350, brand: "forno", icon: Coffee, stockAtFactory: 24, reorderPoint: 8 },
  { id: "c-fries", sku: "WB-S-001", name: "بطاطس مجمدة", category: "khodar", unit: "كرتونة", pricePerUnit: 320, brand: "wahsh", icon: Cookie, stockAtFactory: 36, reorderPoint: 14 },
];

export const categoryMeta = {
  lhom: { label: "اللحوم", icon: Beef },
  dawajen: { label: "الدواجن", icon: Drumstick },
  albaan: { label: "الألبان والأجبان", icon: Milk },
  khodar: { label: "الخضروات", icon: Salad },
  dakik: { label: "الخبز والعجين", icon: Wheat },
  moshtaqat: { label: "البيض والمشتقات", icon: Egg },
  mashroob: { label: "المشروبات", icon: Coffee },
  other: { label: "أخرى", icon: Soup },
} as const;

export type Category = keyof typeof categoryMeta;

/* ---------------- Templates ---------------- */

export interface Template {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  totalValue: number;
  lastUsed: string;
  createdAt?: string;
  items: Array<{ catalogId: string; quantity: number }>;
  popular?: boolean;
}

export const templates: Template[] = [
  {
    id: "tpl-week",
    name: "نفس طلب الأسبوع الماضي",
    description: "نسخ كامل من طلب الإثنين الماضي — 14 صنف",
    itemCount: 14,
    totalValue: 28450,
    lastUsed: "منذ 7 أيام",
    items: [
      { catalogId: "c-burger-patty", quantity: 18 },
      { catalogId: "c-mince", quantity: 12 },
      { catalogId: "c-chicken", quantity: 14 },
      { catalogId: "c-mozzarella", quantity: 8 },
      { catalogId: "c-cheddar", quantity: 6 },
      { catalogId: "c-tomato", quantity: 22 },
      { catalogId: "c-onion", quantity: 18 },
      { catalogId: "c-lettuce", quantity: 5 },
      { catalogId: "c-bun", quantity: 4 },
      { catalogId: "c-egg", quantity: 6 },
      { catalogId: "c-coke", quantity: 6 },
      { catalogId: "c-water", quantity: 8 },
      { catalogId: "c-fries", quantity: 4 },
      { catalogId: "c-cream", quantity: 4 },
    ],
    popular: true,
  },
  {
    id: "tpl-weekend",
    name: "طلب نهاية الأسبوع",
    description: "كمية مضاعفة للجمعة والسبت — 16 صنف",
    itemCount: 16,
    totalValue: 38200,
    lastUsed: "منذ 14 يوم",
    items: [],
    popular: true,
  },
  {
    id: "tpl-light",
    name: "طلب يومي خفيف",
    description: "إعادة تموين سريع — 8 أصناف أساسية فقط",
    itemCount: 8,
    totalValue: 12450,
    lastUsed: "منذ 3 أيام",
    items: [],
  },
  {
    id: "tpl-emergency",
    name: "طلب طارئ — نفاذ مخزون",
    description: "للحالات العاجلة — أولوية قصوى للموافقة",
    itemCount: 4,
    totalValue: 4280,
    lastUsed: "منذ شهر",
    items: [],
  },
];

/* ---------------- Requests ---------------- */

export interface RequestItem {
  catalogId: string;
  name: string;
  quantity: number;            // original quantity requested by branch
  adjustedQty?: number;        // optional factory-edited qty (only set when factory edits)
  unit: string;
  pricePerUnit: number;
}

export interface RequestRecord {
  id: string;
  number: string; // human-readable
  status: RequestStatus;
  fromBranchId: string;
  fromBranchName: string;
  toFactory: string;
  createdBy: string;
  createdAt: string; // human Arabic
  approvedBy?: string;
  approvedAt?: string;
  adjustmentNote?: string;
  adjustedBy?: string;
  adjustedAt?: string;
  scheduledDelivery?: string;
  items: RequestItem[];
  totalValue: number;
  itemCount: number;
  priority: "normal" | "rush" | "scheduled";
  note?: string;
  isMine?: boolean; // current user created
  isForMyApproval?: boolean; // current user is approver
}

export const requests: RequestRecord[] = [
  {
    id: "rq-1043",
    number: "#RQ-1043",
    status: "requested",
    fromBranchId: "br-zamalek",
    fromBranchName: "فرع الزمالك",
    toFactory: "مصنع 6 أكتوبر",
    createdBy: "سلمى رشدي",
    createdAt: "منذ 32 دقيقة",
    items: [
      { catalogId: "c-mozzarella", name: "جبنة موزاريلا", quantity: 12, unit: "كجم", pricePerUnit: 215 },
      { catalogId: "c-burger-patty", name: "لحم برجر — قطعة 150ج", quantity: 18, unit: "كجم", pricePerUnit: 285 },
      { catalogId: "c-cheddar", name: "جبنة شيدر شرائح", quantity: 6, unit: "كجم", pricePerUnit: 190 },
      { catalogId: "c-tomato", name: "طماطم", quantity: 15, unit: "كجم", pricePerUnit: 28 },
    ],
    itemCount: 4,
    totalValue: 9210,
    priority: "rush",
    note: "السبت اللي جاي فيه ماتش — متوقعين ضغط",
    isForMyApproval: true,
  },
  {
    id: "rq-1042",
    number: "#RQ-1042",
    status: "approved",
    fromBranchId: "br-heliopolis",
    fromBranchName: "فرع مصر الجديدة",
    toFactory: "مصنع 6 أكتوبر",
    createdBy: "منى محمود",
    createdAt: "اليوم · 8:14 ص",
    approvedBy: "أحمد رضا",
    approvedAt: "اليوم · 8:32 ص",
    scheduledDelivery: "اليوم · 12:30 م",
    items: [
      { catalogId: "c-burger-patty", name: "لحم برجر — قطعة 150ج", quantity: 22, unit: "كجم", pricePerUnit: 285 },
      { catalogId: "c-bun", name: "خبز برجر — حبة", quantity: 5, unit: "كرتونة", pricePerUnit: 240 },
      { catalogId: "c-tomato", name: "طماطم", quantity: 18, unit: "كجم", pricePerUnit: 28 },
      { catalogId: "c-cheddar", name: "جبنة شيدر شرائح", quantity: 8, unit: "كجم", pricePerUnit: 190 },
      { catalogId: "c-fries", name: "بطاطس مجمدة", quantity: 4, unit: "كرتونة", pricePerUnit: 320 },
    ],
    itemCount: 5,
    totalValue: 11434,
    priority: "normal",
    isMine: true,
  },
  {
    id: "rq-1041",
    number: "#RQ-1041",
    status: "preparing",
    fromBranchId: "br-october",
    fromBranchName: "فرع 6 أكتوبر",
    toFactory: "مصنع 6 أكتوبر",
    createdBy: "كريم العشري",
    createdAt: "اليوم · 7:50 ص",
    approvedBy: "أحمد رضا",
    approvedAt: "اليوم · 8:05 ص",
    scheduledDelivery: "اليوم · 11:00 ص",
    items: [
      { catalogId: "c-pizza-dough", name: "عجينة بيتزا — كرة 250ج", quantity: 8, unit: "كرتونة", pricePerUnit: 180 },
      { catalogId: "c-mozzarella", name: "جبنة موزاريلا", quantity: 14, unit: "كجم", pricePerUnit: 215 },
      { catalogId: "c-flour", name: "دقيق إيطالي 00", quantity: 3, unit: "كيس", pricePerUnit: 420 },
    ],
    itemCount: 3,
    totalValue: 5710,
    priority: "normal",
  },
  {
    id: "rq-1040",
    number: "#RQ-1040",
    status: "in-transit",
    fromBranchId: "br-maadi",
    fromBranchName: "فرع المعادي",
    toFactory: "مصنع 6 أكتوبر",
    createdBy: "هشام جمال",
    createdAt: "اليوم · 6:30 ص",
    approvedBy: "أحمد رضا",
    approvedAt: "اليوم · 6:45 ص",
    scheduledDelivery: "اليوم · 10:30 ص",
    items: [
      { catalogId: "c-pizza-dough", name: "عجينة بيتزا — كرة 250ج", quantity: 6, unit: "كرتونة", pricePerUnit: 180 },
      { catalogId: "c-mozzarella", name: "جبنة موزاريلا", quantity: 10, unit: "كجم", pricePerUnit: 215 },
      { catalogId: "c-coffee", name: "بن إسبريسو", quantity: 2, unit: "كيس", pricePerUnit: 350 },
    ],
    itemCount: 3,
    totalValue: 3930,
    priority: "normal",
  },
  {
    id: "rq-1039",
    number: "#RQ-1039",
    status: "delivered",
    fromBranchId: "br-nasr",
    fromBranchName: "فرع مدينة نصر",
    toFactory: "مصنع 6 أكتوبر",
    createdBy: "ليلى أحمد",
    createdAt: "اليوم · 5:15 ص",
    approvedBy: "أحمد رضا",
    approvedAt: "اليوم · 5:32 ص",
    scheduledDelivery: "اليوم · 9:00 ص",
    items: [
      { catalogId: "c-mince", name: "لحم مفروم بقري", quantity: 8, unit: "كجم", pricePerUnit: 245 },
      { catalogId: "c-onion", name: "بصل", quantity: 12, unit: "كجم", pricePerUnit: 22 },
      { catalogId: "c-tomato", name: "طماطم", quantity: 10, unit: "كجم", pricePerUnit: 28 },
    ],
    itemCount: 3,
    totalValue: 2504,
    priority: "normal",
  },
  {
    id: "rq-1038",
    number: "#RQ-1038",
    status: "confirmed",
    fromBranchId: "br-heliopolis",
    fromBranchName: "فرع مصر الجديدة",
    toFactory: "مصنع 6 أكتوبر",
    createdBy: "منى محمود",
    createdAt: "أمس · 4:20 م",
    approvedBy: "أحمد رضا",
    approvedAt: "أمس · 4:35 م",
    scheduledDelivery: "اليوم · 7:30 ص",
    items: [
      { catalogId: "c-egg", name: "بيض — طبق", quantity: 6, unit: "كرتونة", pricePerUnit: 145 },
      { catalogId: "c-water", name: "مياه معدنية 600مل", quantity: 8, unit: "كرتونة", pricePerUnit: 65 },
      { catalogId: "c-coke", name: "كوكاكولا 330مل", quantity: 4, unit: "كرتونة", pricePerUnit: 180 },
    ],
    itemCount: 3,
    totalValue: 2110,
    priority: "normal",
    isMine: true,
  },
  {
    id: "rq-1037",
    number: "#RQ-1037",
    status: "disputed",
    fromBranchId: "br-alex",
    fromBranchName: "فرع سموحة",
    toFactory: "مصنع 6 أكتوبر",
    createdBy: "أنس فؤاد",
    createdAt: "أمس · 8:00 ص",
    approvedBy: "أحمد رضا",
    approvedAt: "أمس · 8:25 ص",
    scheduledDelivery: "أمس · 4:00 م",
    items: [
      { catalogId: "c-shawarma", name: "شاورما خام متبّلة", quantity: 14, unit: "كجم", pricePerUnit: 295 },
      { catalogId: "c-kebab-mix", name: "تتبيلة كباب جاهزة", quantity: 8, unit: "كجم", pricePerUnit: 320 },
    ],
    itemCount: 2,
    totalValue: 6690,
    priority: "rush",
    note: "وصلت كمية ناقصة 1.5 كجم شاورما — في انتظار تأكيد المصنع",
  },
  {
    id: "rq-1036",
    number: "#RQ-1036",
    status: "rejected",
    fromBranchId: "br-zamalek",
    fromBranchName: "فرع الزمالك",
    toFactory: "مصنع 6 أكتوبر",
    createdBy: "سلمى رشدي",
    createdAt: "أمس · 11:00 ص",
    approvedBy: "أحمد رضا",
    items: [
      { catalogId: "c-burger-patty", name: "لحم برجر — قطعة 150ج", quantity: 35, unit: "كجم", pricePerUnit: 285 },
    ],
    itemCount: 1,
    totalValue: 9975,
    priority: "rush",
    note: "كمية كبيرة — تتعدى المتوسط بـ 3x. تم الرفض ومطلوب إعادة تقديم بكمية معقولة.",
  },
];

export const myRequests = requests.filter((r) => r.isMine);
export const pendingApprovals = requests.filter((r) => r.isForMyApproval);
export const recentRequests = requests.slice(0, 6);

/* Status counts for KPI strip */
export const statusCounts = {
  total: requests.length,
  pending: requests.filter((r) => r.status === "requested").length,
  inProgress: requests.filter((r) =>
    ["approved", "preparing", "loaded", "in-transit"].includes(r.status)
  ).length,
  delivered: requests.filter((r) =>
    ["delivered", "confirmed", "closed"].includes(r.status)
  ).length,
  issues: requests.filter((r) =>
    ["disputed", "rejected", "on-hold"].includes(r.status)
  ).length,
};
