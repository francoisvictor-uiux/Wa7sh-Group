/**
 * Mock KPIs for dashboard surfaces.
 * Numbers are intentionally realistic for an Egyptian F&B chain.
 */

export interface Kpi {
  id: string;
  label: string;
  value: string;
  unit?: string;
  delta?: number; // % change vs previous period
  trend?: "up" | "down" | "flat";
  intent?: "neutral" | "positive" | "negative" | "warning";
  hint?: string;
  icon?: string; // lucide name
}

export const todayKpis: Kpi[] = [
  {
    id: "sales-today",
    label: "مبيعات اليوم",
    value: "284,560",
    unit: "ج.م",
    delta: 12.4,
    trend: "up",
    intent: "positive",
    hint: "مقابل ٢٥٣,١٢٠ أمس",
    icon: "TrendingUp",
  },
  {
    id: "food-cost",
    label: "تكلفة الطعام",
    value: "32.1",
    unit: "%",
    delta: -1.2,
    trend: "down",
    intent: "positive",
    hint: "الهدف ≤ 33%",
    icon: "Beef",
  },
  {
    id: "waste",
    label: "الفاقد",
    value: "1.8",
    unit: "%",
    delta: 0.4,
    trend: "up",
    intent: "warning",
    hint: "الهدف ≤ 1.5%",
    icon: "Trash2",
  },
  {
    id: "on-time",
    label: "تسليم في الموعد",
    value: "94.6",
    unit: "%",
    delta: 2.1,
    trend: "up",
    intent: "positive",
    hint: "آخر 7 أيام",
    icon: "Clock",
  },
  {
    id: "shipments-active",
    label: "شحنات نشطة",
    value: "8",
    delta: 0,
    trend: "flat",
    intent: "neutral",
    hint: "3 في الطريق · 5 تحضير",
    icon: "Truck",
  },
  {
    id: "approvals-pending",
    label: "موافقات معلّقة",
    value: "4",
    delta: 1,
    trend: "up",
    intent: "warning",
    hint: "أقدمها منذ ٣٢ دقيقة",
    icon: "Inbox",
  },
  {
    id: "inventory-accuracy",
    label: "دقة المخزون",
    value: "98.7",
    unit: "%",
    delta: 0.2,
    trend: "up",
    intent: "positive",
    hint: "الجرد الأخير قبل يومين",
    icon: "PackageCheck",
  },
  {
    id: "disputes-open",
    label: "نزاعات مفتوحة",
    value: "1",
    delta: 0,
    trend: "flat",
    intent: "negative",
    hint: "شحنة #SH-2814",
    icon: "AlertTriangle",
  },
];

export const branchKpis: Kpi[] = [
  {
    id: "br-sales",
    label: "مبيعات الفرع اليوم",
    value: "42,830",
    unit: "ج.م",
    delta: 8.1,
    trend: "up",
    intent: "positive",
    icon: "TrendingUp",
  },
  {
    id: "br-receipts",
    label: "شحنات مستلمة",
    value: "3 / 4",
    delta: 0,
    trend: "flat",
    intent: "neutral",
    hint: "في انتظار شحنة المساء",
    icon: "PackageCheck",
  },
  {
    id: "br-staff",
    label: "موظفون في الوردية",
    value: "12",
    delta: 0,
    trend: "flat",
    intent: "neutral",
    hint: "من أصل 14 مجدول",
    icon: "Users",
  },
  {
    id: "br-stock-low",
    label: "أصناف قاربت الانتهاء",
    value: "5",
    delta: 2,
    trend: "up",
    intent: "warning",
    hint: "اطلب تحويل قبل 4 م",
    icon: "PackageMinus",
  },
];

export const factoryKpis: Kpi[] = [
  {
    id: "fac-output",
    label: "إنتاج اليوم",
    value: "1,840",
    unit: "كجم",
    delta: 4.6,
    trend: "up",
    intent: "positive",
    icon: "Factory",
  },
  {
    id: "fac-dispatch",
    label: "شحنات اليوم",
    value: "12",
    delta: 0,
    trend: "flat",
    intent: "neutral",
    hint: "8 مكتملة · 4 قيد التحضير",
    icon: "Truck",
  },
  {
    id: "fac-raw-stock",
    label: "أيام مخزون خام",
    value: "5.2",
    unit: "أيام",
    delta: -0.3,
    trend: "down",
    intent: "warning",
    hint: "الحد الأدنى ٤ أيام",
    icon: "Boxes",
  },
  {
    id: "fac-quality",
    label: "تقييم الجودة",
    value: "9.4",
    unit: "/10",
    delta: 0.1,
    trend: "up",
    intent: "positive",
    icon: "ShieldCheck",
  },
];
