/**
 * Finance mock data — P&L per branch, AR/AP aging, tax status.
 * All figures in EGP unless noted.
 */

export interface BranchPnl {
  branchId: string;
  branchName: string;
  revenue: number;
  cogs: number; // cost of goods sold
  grossProfit: number;
  operatingExpenses: number;
  netIncome: number;
  foodCostPct: number;
  grossMarginPct: number;
  netMarginPct: number;
  trendVsPrev: number; // % vs previous month
  staffCount: number;
}

export const monthlyPnl: BranchPnl[] = [
  { branchId: "br-heliopolis", branchName: "مصر الجديدة", revenue: 1_240_000, cogs: 396_800, grossProfit: 843_200, operatingExpenses: 482_000, netIncome: 361_200, foodCostPct: 32.0, grossMarginPct: 68.0, netMarginPct: 29.1, trendVsPrev: 8.4, staffCount: 28 },
  { branchId: "br-zamalek", branchName: "الزمالك", revenue: 1_080_000, cogs: 350_000, grossProfit: 730_000, operatingExpenses: 425_000, netIncome: 305_000, foodCostPct: 32.4, grossMarginPct: 67.6, netMarginPct: 28.2, trendVsPrev: 6.1, staffCount: 24 },
  { branchId: "br-october", branchName: "6 أكتوبر", revenue: 1_460_000, cogs: 449_700, grossProfit: 1_010_300, operatingExpenses: 548_000, netIncome: 462_300, foodCostPct: 30.8, grossMarginPct: 69.2, netMarginPct: 31.7, trendVsPrev: 12.3, staffCount: 31 },
  { branchId: "br-maadi", branchName: "المعادي", revenue: 920_000, cogs: 318_400, grossProfit: 601_600, operatingExpenses: 380_000, netIncome: 221_600, foodCostPct: 34.6, grossMarginPct: 65.4, netMarginPct: 24.1, trendVsPrev: -2.4, staffCount: 22 },
  { branchId: "br-nasr", branchName: "مدينة نصر", revenue: 760_000, cogs: 255_360, grossProfit: 504_640, operatingExpenses: 312_000, netIncome: 192_640, foodCostPct: 33.6, grossMarginPct: 66.4, netMarginPct: 25.3, trendVsPrev: 4.2, staffCount: 19 },
  { branchId: "br-alex", branchName: "سموحة", revenue: 640_000, cogs: 211_840, grossProfit: 428_160, operatingExpenses: 268_000, netIncome: 160_160, foodCostPct: 33.1, grossMarginPct: 66.9, netMarginPct: 25.0, trendVsPrev: 1.8, staffCount: 17 },
];

export const groupTotals = monthlyPnl.reduce(
  (sum, p) => ({
    revenue: sum.revenue + p.revenue,
    cogs: sum.cogs + p.cogs,
    grossProfit: sum.grossProfit + p.grossProfit,
    operatingExpenses: sum.operatingExpenses + p.operatingExpenses,
    netIncome: sum.netIncome + p.netIncome,
    staffCount: sum.staffCount + p.staffCount,
  }),
  { revenue: 0, cogs: 0, grossProfit: 0, operatingExpenses: 0, netIncome: 0, staffCount: 0 }
);

export const groupKpis = {
  ...groupTotals,
  foodCostPct: (groupTotals.cogs / groupTotals.revenue) * 100,
  grossMarginPct: (groupTotals.grossProfit / groupTotals.revenue) * 100,
  netMarginPct: (groupTotals.netIncome / groupTotals.revenue) * 100,
  trendVsPrev: 6.8,
};

/* Monthly trend — last 6 months */
export const revenueTrend = [
  { label: "نوفمبر", revenue: 5_240_000 },
  { label: "ديسمبر", revenue: 5_680_000 },
  { label: "يناير", revenue: 5_420_000 },
  { label: "فبراير", revenue: 5_810_000 },
  { label: "مارس", revenue: 5_960_000 },
  { label: "إبريل", revenue: groupTotals.revenue },
];

/* Cost breakdown */
export const costBreakdown = [
  { category: "تكلفة الطعام (COGS)", amount: groupTotals.cogs, color: "var(--brand-primary)" },
  { category: "الرواتب والأجور", amount: 1_280_000, color: "var(--status-info)" },
  { category: "الإيجارات", amount: 540_000, color: "var(--status-warning)" },
  { category: "الكهرباء والمياه", amount: 186_000, color: "var(--brand-warm)" },
  { category: "التسويق والإعلان", amount: 124_000, color: "var(--status-danger)" },
  { category: "صيانة ومتنوعة", amount: 285_000, color: "var(--text-tertiary)" },
];

/* AR — what branches/customers owe (corporate clients, catering, branch transfers) */
export type AgingBucket = "current" | "1-30" | "31-60" | "61-90" | "90+";

export interface Receivable {
  id: string;
  invoiceNumber: string;
  customer: string;
  customerType: "corporate" | "catering" | "branch-transfer" | "credit-card-batch";
  amount: number;
  dueDate: string;
  daysOverdue: number;
  bucket: AgingBucket;
  status: "current" | "overdue" | "in-collection";
}

export const receivables: Receivable[] = [
  { id: "ar-1", invoiceNumber: "#INV-1284", customer: "بنك مصر — كيترنج", customerType: "catering", amount: 124_500, dueDate: "5 مايو 2026", daysOverdue: 0, bucket: "current", status: "current" },
  { id: "ar-2", invoiceNumber: "#INV-1281", customer: "شركة فودافون", customerType: "corporate", amount: 86_400, dueDate: "12 مايو 2026", daysOverdue: 0, bucket: "current", status: "current" },
  { id: "ar-3", invoiceNumber: "#INV-1278", customer: "شركة CIB", customerType: "corporate", amount: 142_000, dueDate: "15 إبريل 2026", daysOverdue: 14, bucket: "1-30", status: "overdue" },
  { id: "ar-4", invoiceNumber: "#INV-1275", customer: "كيترنج فندق سميراميس", customerType: "catering", amount: 68_200, dueDate: "8 إبريل 2026", daysOverdue: 21, bucket: "1-30", status: "overdue" },
  { id: "ar-5", invoiceNumber: "#INV-1268", customer: "شركة Orange", customerType: "corporate", amount: 94_800, dueDate: "20 مارس 2026", daysOverdue: 40, bucket: "31-60", status: "overdue" },
  { id: "ar-6", invoiceNumber: "#INV-1259", customer: "شركة الأهلي للسياحة", customerType: "corporate", amount: 56_400, dueDate: "12 فبراير 2026", daysOverdue: 76, bucket: "61-90", status: "overdue" },
  { id: "ar-7", invoiceNumber: "#INV-1244", customer: "مطعم النيل العائم", customerType: "catering", amount: 38_200, dueDate: "5 يناير 2026", daysOverdue: 114, bucket: "90+", status: "in-collection" },
  { id: "ar-8", invoiceNumber: "#INV-CC-042", customer: "بنوك بطاقات الائتمان (يومي)", customerType: "credit-card-batch", amount: 184_600, dueDate: "30 إبريل 2026", daysOverdue: 0, bucket: "current", status: "current" },
];

export const arAging = {
  current: receivables.filter((r) => r.bucket === "current").reduce((s, r) => s + r.amount, 0),
  "1-30": receivables.filter((r) => r.bucket === "1-30").reduce((s, r) => s + r.amount, 0),
  "31-60": receivables.filter((r) => r.bucket === "31-60").reduce((s, r) => s + r.amount, 0),
  "61-90": receivables.filter((r) => r.bucket === "61-90").reduce((s, r) => s + r.amount, 0),
  "90+": receivables.filter((r) => r.bucket === "90+").reduce((s, r) => s + r.amount, 0),
};

export const arTotal = Object.values(arAging).reduce((s, v) => s + v, 0);
export const arOverdue = arAging["1-30"] + arAging["31-60"] + arAging["61-90"] + arAging["90+"];

/* AP — what we owe suppliers */
export interface Payable {
  id: string;
  supplierName: string;
  poNumber: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  bucket: AgingBucket;
}

export const payables: Payable[] = [
  { id: "ap-1", supplierName: "شركة برايم للحوم", poNumber: "#PO-2401", amount: 86_400, dueDate: "20 مايو 2026", daysOverdue: 0, bucket: "current" },
  { id: "ap-2", supplierName: "ألبان جرين لاند", poNumber: "#PO-2399", amount: 42_800, dueDate: "18 مايو 2026", daysOverdue: 0, bucket: "current" },
  { id: "ap-3", supplierName: "دواجن القاهرة", poNumber: "#PO-2397", amount: 64_200, dueDate: "12 مايو 2026", daysOverdue: 0, bucket: "current" },
  { id: "ap-4", supplierName: "كوكاكولا مصر", poNumber: "#PO-2393", amount: 38_400, dueDate: "10 يونيو 2026", daysOverdue: 0, bucket: "current" },
  { id: "ap-5", supplierName: "إيكو باك للتغليف", poNumber: "#PO-2389", amount: 32_800, dueDate: "12 إبريل 2026", daysOverdue: 17, bucket: "1-30" },
  { id: "ap-6", supplierName: "البهارات الشرقية", poNumber: "#PO-2394", amount: 18_200, dueDate: "1 مايو 2026", daysOverdue: 0, bucket: "current" },
  { id: "ap-7", supplierName: "شركة برايم للحوم", poNumber: "#PO-2398", amount: 56_100, dueDate: "5 مايو 2026", daysOverdue: 0, bucket: "current" },
];

export const apAging = {
  current: payables.filter((p) => p.bucket === "current").reduce((s, p) => s + p.amount, 0),
  "1-30": payables.filter((p) => p.bucket === "1-30").reduce((s, p) => s + p.amount, 0),
  "31-60": payables.filter((p) => p.bucket === "31-60").reduce((s, p) => s + p.amount, 0),
  "61-90": payables.filter((p) => p.bucket === "61-90").reduce((s, p) => s + p.amount, 0),
  "90+": payables.filter((p) => p.bucket === "90+").reduce((s, p) => s + p.amount, 0),
};

export const apTotal = Object.values(apAging).reduce((s, v) => s + v, 0);
export const apOverdue = apAging["1-30"] + apAging["31-60"] + apAging["61-90"] + apAging["90+"];

/* Cash position */
export const cashAccounts = [
  { id: "ca-1", name: "الحساب الرئيسي — البنك الأهلي", type: "current", balance: 4_286_400, lastSync: "اليوم · 9:42 ص" },
  { id: "ca-2", name: "حساب الفروع — CIB", type: "current", balance: 1_142_800, lastSync: "اليوم · 9:42 ص" },
  { id: "ca-3", name: "حساب الرواتب — البنك التجاري الدولي", type: "payroll", balance: 884_000, lastSync: "اليوم · 9:42 ص" },
  { id: "ca-4", name: "كاش الفروع (يومي)", type: "cash", balance: 184_600, lastSync: "اليوم · 11:30 ص" },
];

export const cashTotal = cashAccounts.reduce((s, a) => s + a.balance, 0);

/* Tax compliance — Egypt ETA */
export interface TaxRecord {
  id: string;
  type: "vat" | "income" | "payroll-tax" | "social-insurance";
  period: string;
  amount: number;
  dueDate: string;
  status: "filed" | "due" | "overdue";
}

export const taxRecords: TaxRecord[] = [
  { id: "tx-1", type: "vat", period: "إبريل 2026", amount: 184_600, dueDate: "20 مايو 2026", status: "due" },
  { id: "tx-2", type: "vat", period: "مارس 2026", amount: 172_800, dueDate: "20 إبريل 2026", status: "filed" },
  { id: "tx-3", type: "income", period: "Q1 2026", amount: 386_400, dueDate: "30 إبريل 2026", status: "filed" },
  { id: "tx-4", type: "payroll-tax", period: "إبريل 2026", amount: 142_500, dueDate: "10 مايو 2026", status: "due" },
  { id: "tx-5", type: "social-insurance", period: "إبريل 2026", amount: 218_400, dueDate: "15 مايو 2026", status: "due" },
];

export const taxStatusMeta = {
  filed: { label: "تم الإيداع", intent: "success" as const },
  due: { label: "مستحق", intent: "warning" as const },
  overdue: { label: "متأخر", intent: "danger" as const },
};

export const taxTypeLabel: Record<TaxRecord["type"], string> = {
  vat: "ضريبة القيمة المضافة",
  income: "ضريبة الدخل",
  "payroll-tax": "ضريبة المرتبات",
  "social-insurance": "التأمينات الاجتماعية",
};

/* Reports library */
export const reports = [
  { id: "r-1", title: "قائمة الدخل (Income Statement)", titleEn: "Income Statement", description: "إيرادات وتكاليف وصافي الدخل", category: "financial", lastGenerated: "أمس", icon: "FileText" },
  { id: "r-2", title: "قائمة المركز المالي (Balance Sheet)", titleEn: "Balance Sheet", description: "الأصول والخصوم وحقوق الملكية", category: "financial", lastGenerated: "أمس", icon: "Scale" },
  { id: "r-3", title: "قائمة التدفقات النقدية (Cash Flow)", titleEn: "Cash Flow Statement", description: "تدفقات التشغيل والاستثمار والتمويل", category: "financial", lastGenerated: "أمس", icon: "TrendingUp" },
  { id: "r-4", title: "تقرير ربحية الفرع", titleEn: "Branch P&L", description: "أرباح كل فرع منفصلة + المقارنة", category: "operations", lastGenerated: "اليوم · 7 ص", icon: "Building2" },
  { id: "r-5", title: "تكلفة المنتج التفصيلية", titleEn: "Product Costing", description: "تكلفة كل وصفة لكل منتج", category: "operations", lastGenerated: "منذ 3 أيام", icon: "Calculator" },
  { id: "r-6", title: "تقرير الذمم المدينة (Aging)", titleEn: "AR Aging", description: "تحليل أعمار المستحقات", category: "ar-ap", lastGenerated: "اليوم", icon: "Clock" },
  { id: "r-7", title: "تقرير الذمم الدائنة (Aging)", titleEn: "AP Aging", description: "تحليل أعمار المدفوعات للموردين", category: "ar-ap", lastGenerated: "اليوم", icon: "Clock" },
  { id: "r-8", title: "إقرار ضريبة القيمة المضافة", titleEn: "VAT Return", description: "إقرار شهري متوافق مع ETA", category: "tax", lastGenerated: "20 إبريل", icon: "Receipt" },
  { id: "r-9", title: "كشف رواتب شهري", titleEn: "Payroll Summary", description: "رواتب وبدلات وخصومات الموظفين", category: "hr", lastGenerated: "30 إبريل", icon: "Users" },
];
