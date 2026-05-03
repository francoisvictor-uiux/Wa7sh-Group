/**
 * Mock alerts feed — drives the smart alerts panel on dashboards
 * and the notification bell badge in the shell.
 */

export type AlertPriority = "p0" | "p1" | "p2" | "p3";

export interface AlertItem {
  id: string;
  priority: AlertPriority;
  title: string;
  body: string;
  source: string; // module
  branchId?: string;
  timestamp: string; // human-readable Arabic
  ctaLabel?: string;
  ctaHref?: string;
  unread?: boolean;
}

export const alertsFeed: AlertItem[] = [
  {
    id: "al-1",
    priority: "p0",
    title: "شحنة متأخرة 32 دقيقة",
    body: "شحنة #SH-2814 من المصنع لفرع المعادي — السائق محمود علي لم يصل بعد.",
    source: "الطلبات",
    branchId: "br-maadi",
    timestamp: "منذ 5 دقائق",
    ctaLabel: "فتح الطلب",
    ctaHref: "/requests",
    unread: true,
  },
  {
    id: "al-2",
    priority: "p1",
    title: "موافقة معلّقة منذ 32 دقيقة",
    body: "طلب رقم #RQ-1043 من فرع الزمالك — جبنة موزاريلا 12 كجم، لحم برجر 18 كجم.",
    source: "الطلبات",
    branchId: "br-zamalek",
    timestamp: "منذ 32 دقيقة",
    ctaLabel: "افتح الطلب",
    ctaHref: "/requests",
    unread: true,
  },
  {
    id: "al-3",
    priority: "p1",
    title: "صنف قارب الانتهاء",
    body: "جبنة شيدر — تنتهي صلاحية 8 كجم بعد يومين بفرع 6 أكتوبر.",
    source: "المخزون",
    branchId: "br-october",
    timestamp: "منذ ساعة",
    ctaLabel: "افتح بطاقة الصنف",
    ctaHref: "/inventory",
    unread: true,
  },
  {
    id: "al-4",
    priority: "p2",
    title: "تم استلام شحنة بنجاح",
    body: "شحنة #SH-2812 وصلت لفرع مصر الجديدة — 18 صنف، تطابق كامل، 0 فروقات.",
    source: "الاستلام",
    branchId: "br-heliopolis",
    timestamp: "منذ ساعتين",
  },
  {
    id: "al-5",
    priority: "p2",
    title: "تم تحويل المخزون",
    body: "5 كجم لحم مفروم تحوّلت من فرع مدينة نصر لفرع الزمالك.",
    source: "المخزون",
    timestamp: "منذ 3 ساعات",
  },
  {
    id: "al-6",
    priority: "p3",
    title: "ملخص أداء أمس",
    body: "كل الفروع حقّقت أهدافها — تكلفة الطعام عند 32.4% (الهدف ≤ 33%).",
    source: "التقارير",
    timestamp: "أمس · 11:30 م",
  },
];

export const unreadCount = alertsFeed.filter((a) => a.unread).length;
