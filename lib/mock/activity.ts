/**
 * Recent activity feed — short list of "what just happened" across modules.
 * Used in the dashboard right rail.
 */

export type ActivityType =
  | "shipment.dispatched"
  | "shipment.delivered"
  | "request.created"
  | "request.approved"
  | "receipt.confirmed"
  | "receipt.disputed"
  | "stock.transferred"
  | "stock.counted"
  | "employee.clocked-in";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  actor: string;
  description: string;
  branch?: string;
  timestamp: string;
}

export const recentActivity: ActivityItem[] = [
  {
    id: "ac-1",
    type: "shipment.dispatched",
    actor: "أحمد رضا",
    description: "أرسل شحنة #SH-2815 لفرع المعادي — 12 صنف",
    branch: "المصنع",
    timestamp: "منذ دقيقتين",
  },
  {
    id: "ac-2",
    type: "request.approved",
    actor: "أحمد رضا",
    description: "وافق على طلب #RQ-1042 من فرع الزمالك",
    branch: "المصنع",
    timestamp: "منذ 8 دقائق",
  },
  {
    id: "ac-3",
    type: "receipt.confirmed",
    actor: "منى محمود",
    description: "أكّدت استلام شحنة #SH-2812 — تطابق كامل",
    branch: "مصر الجديدة",
    timestamp: "منذ ساعتين",
  },
  {
    id: "ac-4",
    type: "stock.transferred",
    actor: "كريم العشري",
    description: "حوّل 5 كجم لحم مفروم إلى فرع الزمالك",
    branch: "6 أكتوبر",
    timestamp: "منذ 3 ساعات",
  },
  {
    id: "ac-5",
    type: "request.created",
    actor: "ليلى أحمد",
    description: "أنشأت طلب #RQ-1044 — 8 أصناف",
    branch: "مدينة نصر",
    timestamp: "منذ 4 ساعات",
  },
  {
    id: "ac-6",
    type: "stock.counted",
    actor: "هشام جمال",
    description: "أكمل الجرد الدوري — انحراف 0.6%",
    branch: "المعادي",
    timestamp: "أمس · 9:42 م",
  },
];
