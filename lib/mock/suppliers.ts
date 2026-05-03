/**
 * Suppliers mock data — vendors that supply the factory with raw materials.
 *
 * Extended for the Supplier Decision & Control System:
 *   - Health Score (0–100)
 *   - Multi-category support (`categories[]` alongside legacy `category`)
 *   - Issues & incidents log
 *   - Attachments (contracts, documents, invoices)
 *   - Activity timeline (edits / orders / issues / status changes)
 *   - Performance tag (high / stable / risky / inactive)
 *   - Smart alerts (cross-supplier signals shown on the index)
 */

export type SupplierStatus = "active" | "preferred" | "review" | "blocked";
export type PoStatus = "draft" | "sent" | "confirmed" | "received" | "paid" | "overdue";
export type SupplierCategory =
  | "meat"
  | "produce"
  | "dairy"
  | "dry-goods"
  | "beverages"
  | "packaging";
export type PerformanceTag = "high" | "stable" | "risky" | "inactive";
export type IssueType = "late" | "missing" | "quality" | "damage";
export type IssueSeverity = "low" | "medium" | "high";
export type AttachmentType = "contract" | "document" | "invoice";
export type ActivityType = "edit" | "order" | "issue" | "status" | "note" | "added";
export type AlertSeverity = "info" | "warning" | "danger";

export interface SupplierPo {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: PoStatus;
  itemCount: number;
}

export interface SupplierIssue {
  id: string;
  type: IssueType;
  severity: IssueSeverity;
  date: string;
  description: string;
  resolved: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: AttachmentType;
  size: string;
  date: string;
}

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  date: string;
  text: string;
  actor?: string;
}

export interface SmartAlert {
  id: string;
  severity: AlertSeverity;
  supplierId?: string;
  supplierName?: string;
  text: string;
  date: string;
}

export interface Supplier {
  id: string;
  name: string;
  nameEn: string;
  /** Primary category — kept for back-compat. Equals `categories[0]`. */
  category: SupplierCategory;
  /** Full multi-category list. Primary first. */
  categories: SupplierCategory[];
  city: string;
  address?: string;
  contact: string;
  phone: string;
  phoneSecondary?: string;
  email: string;
  taxId: string;
  status: SupplierStatus;
  performanceTag: PerformanceTag;

  /** Computed reputation 0–5 (auto-calculated from real performance). */
  rating: number;
  /** Composite reliability index 0–100. Drives the gauge + colour. */
  healthScore: number;
  onTimePercent: number;
  qualityScore: number;
  /** % of POs that ended in an issue. */
  issueRate: number;
  /** Mean delay in days across the last 12 months of POs. */
  avgDelayDays: number;

  totalSpend: number;
  payablesOwed: number;
  paymentTerms: string;
  joinedDate: string;
  lastOrderDate: string;
  /** Days since last order — drives the "no recent orders" filter. */
  daysSinceLastOrder: number;
  /** All-time PO count. */
  totalOrders: number;

  recentPos: SupplierPo[];
  issues: SupplierIssue[];
  attachments: Attachment[];
  activity: ActivityEntry[];
  notes?: string;
}

export const suppliers: Supplier[] = [
  {
    id: "sp-meat-prime",
    name: "شركة برايم للحوم",
    nameEn: "Prime Meat Company",
    category: "meat",
    categories: ["meat"],
    city: "القاهرة",
    address: "المنطقة الصناعية الأولى، 6 أكتوبر",
    contact: "محمد الديب",
    phone: "01023456789",
    phoneSecondary: "01098765432",
    email: "orders@primemeat.eg",
    taxId: "456-789-123",
    status: "preferred",
    performanceTag: "high",
    rating: 4.8,
    healthScore: 94,
    onTimePercent: 96.2,
    qualityScore: 9.4,
    issueRate: 1.2,
    avgDelayDays: 0.3,
    totalSpend: 1_842_000,
    payablesOwed: 142_500,
    paymentTerms: "صافي 30 يوم",
    joinedDate: "2023-04-15",
    lastOrderDate: "أمس",
    daysSinceLastOrder: 1,
    totalOrders: 142,
    recentPos: [
      { id: "po-2401", number: "#PO-2401", date: "أمس", amount: 86400, status: "received", itemCount: 4 },
      { id: "po-2398", number: "#PO-2398", date: "منذ 4 أيام", amount: 124200, status: "paid", itemCount: 6 },
      { id: "po-2392", number: "#PO-2392", date: "منذ 9 أيام", amount: 98000, status: "paid", itemCount: 5 },
    ],
    issues: [
      { id: "iss-prime-1", type: "late", severity: "low", date: "منذ 11 يوم", description: "تأخير 4 ساعات في توريد كسر اللحم", resolved: true },
    ],
    attachments: [
      { id: "at-prime-1", name: "Master-Contract-2024.pdf", type: "contract", size: "1.2 MB", date: "2024-01-08" },
      { id: "at-prime-2", name: "Tax-Card.pdf", type: "document", size: "240 KB", date: "2023-04-15" },
      { id: "at-prime-3", name: "Invoice-Apr-2026.pdf", type: "invoice", size: "180 KB", date: "2026-04-22" },
    ],
    activity: [
      { id: "ac-prime-1", type: "order", date: "أمس", text: "تم استلام أمر الشراء PO-2401", actor: "نظام الاستلام" },
      { id: "ac-prime-2", type: "edit", date: "منذ 3 أيام", text: "تم تحديث شروط الدفع إلى صافي 30 يوم", actor: "هدير ع." },
      { id: "ac-prime-3", type: "order", date: "منذ 4 أيام", text: "تم سداد PO-2398 بقيمة 124,200 ج.م", actor: "قسم الحسابات" },
      { id: "ac-prime-4", type: "added", date: "2023-04-15", text: "تم إضافة المورد إلى النظام", actor: "هدير ع." },
    ],
    notes: "مورد أساسي للحوم البقري — جودة ممتازة، توريد منتظم.",
  },
  {
    id: "sp-dairy-greenland",
    name: "ألبان جرين لاند",
    nameEn: "Green Land Dairy",
    category: "dairy",
    categories: ["dairy"],
    city: "الإسكندرية",
    address: "ميامي، الإسكندرية",
    contact: "سارة فؤاد",
    phone: "01187654321",
    email: "sara@greenland-dairy.eg",
    taxId: "234-567-890",
    status: "preferred",
    performanceTag: "high",
    rating: 4.6,
    healthScore: 88,
    onTimePercent: 92.5,
    qualityScore: 9.0,
    issueRate: 3.4,
    avgDelayDays: 0.6,
    totalSpend: 624_000,
    payablesOwed: 84_600,
    paymentTerms: "صافي 21 يوم",
    joinedDate: "2023-08-22",
    lastOrderDate: "منذ يومين",
    daysSinceLastOrder: 2,
    totalOrders: 86,
    recentPos: [
      { id: "po-2399", number: "#PO-2399", date: "منذ يومين", amount: 42800, status: "confirmed", itemCount: 3 },
      { id: "po-2391", number: "#PO-2391", date: "منذ 10 أيام", amount: 38400, status: "paid", itemCount: 2 },
    ],
    issues: [
      { id: "iss-gl-1", type: "quality", severity: "medium", date: "منذ شهر", description: "دفعة جبن قريش بحموضة زائدة — تم استبدالها", resolved: true },
    ],
    attachments: [
      { id: "at-gl-1", name: "Cold-Chain-Cert.pdf", type: "document", size: "640 KB", date: "2024-09-12" },
      { id: "at-gl-2", name: "Master-Contract.pdf", type: "contract", size: "980 KB", date: "2023-08-22" },
    ],
    activity: [
      { id: "ac-gl-1", type: "order", date: "منذ يومين", text: "تم تأكيد أمر الشراء PO-2399", actor: "سارة فؤاد" },
      { id: "ac-gl-2", type: "issue", date: "منذ شهر", text: "إغلاق بلاغ جودة #IS-118 (استبدال كامل)", actor: "وحدة الجودة" },
      { id: "ac-gl-3", type: "added", date: "2023-08-22", text: "تم إضافة المورد إلى النظام", actor: "هدير ع." },
    ],
  },
  {
    id: "sp-produce-fresh",
    name: "فريش جاردن للخضروات",
    nameEn: "Fresh Garden Produce",
    category: "produce",
    categories: ["produce"],
    city: "الإسماعيلية",
    address: "طريق الإسماعيلية الزراعي، كم 24",
    contact: "أحمد مصطفى",
    phone: "01298765432",
    email: "ahmed@freshgarden.eg",
    taxId: "678-901-234",
    status: "active",
    performanceTag: "stable",
    rating: 4.3,
    healthScore: 81,
    onTimePercent: 88.4,
    qualityScore: 8.6,
    issueRate: 5.8,
    avgDelayDays: 1.1,
    totalSpend: 312_000,
    payablesOwed: 24_800,
    paymentTerms: "كاش / 7 أيام",
    joinedDate: "2024-01-10",
    lastOrderDate: "اليوم",
    daysSinceLastOrder: 0,
    totalOrders: 64,
    recentPos: [
      { id: "po-2402", number: "#PO-2402", date: "اليوم", amount: 18400, status: "sent", itemCount: 8 },
      { id: "po-2395", number: "#PO-2395", date: "منذ 6 أيام", amount: 16200, status: "paid", itemCount: 7 },
    ],
    issues: [
      { id: "iss-fg-1", type: "missing", severity: "low", date: "منذ 6 أيام", description: "نقص 2 كرتون طماطم في PO-2395", resolved: true },
      { id: "iss-fg-2", type: "late", severity: "low", date: "منذ 14 يوم", description: "تأخير ساعتين في الشحنة الصباحية", resolved: true },
    ],
    attachments: [
      { id: "at-fg-1", name: "Supplier-Profile.pdf", type: "document", size: "320 KB", date: "2024-01-10" },
    ],
    activity: [
      { id: "ac-fg-1", type: "order", date: "اليوم", text: "تم إرسال أمر الشراء PO-2402", actor: "نظام الطلبات" },
      { id: "ac-fg-2", type: "issue", date: "منذ 6 أيام", text: "تم تسجيل بلاغ نقص — تم الاستلام التعويضي", actor: "وحدة الاستلام" },
      { id: "ac-fg-3", type: "added", date: "2024-01-10", text: "تم إضافة المورد إلى النظام", actor: "كريم ن." },
    ],
  },
  {
    id: "sp-bakery-italian",
    name: "المخبز الإيطالي",
    nameEn: "Italian Bakery Co.",
    category: "dry-goods",
    categories: ["dry-goods", "packaging"],
    city: "القاهرة",
    address: "شارع التسعين، التجمع الخامس",
    contact: "ماريو سامي",
    phone: "01012345678",
    email: "mario@italian-bakery.eg",
    taxId: "345-678-901",
    status: "preferred",
    performanceTag: "high",
    rating: 4.9,
    healthScore: 97,
    onTimePercent: 98.1,
    qualityScore: 9.7,
    issueRate: 0.4,
    avgDelayDays: 0.1,
    totalSpend: 486_000,
    payablesOwed: 0,
    paymentTerms: "كاش عند التسليم",
    joinedDate: "2023-06-01",
    lastOrderDate: "أمس",
    daysSinceLastOrder: 1,
    totalOrders: 218,
    recentPos: [
      { id: "po-2400", number: "#PO-2400", date: "أمس", amount: 28800, status: "paid", itemCount: 4 },
    ],
    issues: [],
    attachments: [
      { id: "at-ib-1", name: "Exclusivity-Agreement.pdf", type: "contract", size: "1.4 MB", date: "2023-06-01" },
      { id: "at-ib-2", name: "Tax-Card.pdf", type: "document", size: "210 KB", date: "2023-06-01" },
    ],
    activity: [
      { id: "ac-ib-1", type: "order", date: "أمس", text: "تم سداد PO-2400 (كاش عند التسليم)", actor: "سامي ر." },
      { id: "ac-ib-2", type: "edit", date: "منذ شهرين", text: "تم تمديد العقد الحصري حتى نهاية 2026", actor: "هدير ع." },
      { id: "ac-ib-3", type: "added", date: "2023-06-01", text: "تم إضافة المورد إلى النظام", actor: "هدير ع." },
    ],
    notes: "خبز برجر وعجين بيتزا — حصرية للمصنع.",
  },
  {
    id: "sp-poultry-cairo",
    name: "دواجن القاهرة",
    nameEn: "Cairo Poultry",
    category: "meat",
    categories: ["meat"],
    city: "القاهرة",
    address: "المنطقة الصناعية، السلام",
    contact: "سامح أحمد",
    phone: "01156789012",
    email: "samah@cairo-poultry.eg",
    taxId: "789-012-345",
    status: "active",
    performanceTag: "stable",
    rating: 4.2,
    healthScore: 78,
    onTimePercent: 86.3,
    qualityScore: 8.4,
    issueRate: 6.2,
    avgDelayDays: 1.4,
    totalSpend: 794_500,
    payablesOwed: 96_400,
    paymentTerms: "صافي 30 يوم",
    joinedDate: "2023-09-15",
    lastOrderDate: "منذ 3 أيام",
    daysSinceLastOrder: 3,
    totalOrders: 98,
    recentPos: [
      { id: "po-2397", number: "#PO-2397", date: "منذ 3 أيام", amount: 64200, status: "received", itemCount: 3 },
      { id: "po-2390", number: "#PO-2390", date: "منذ 11 يوم", amount: 58000, status: "paid", itemCount: 2 },
    ],
    issues: [
      { id: "iss-cp-1", type: "late", severity: "medium", date: "منذ 5 أيام", description: "تأخير 6 ساعات في شحنة الصدور", resolved: true },
    ],
    attachments: [
      { id: "at-cp-1", name: "Supplier-Profile.pdf", type: "document", size: "280 KB", date: "2023-09-15" },
    ],
    activity: [
      { id: "ac-cp-1", type: "order", date: "منذ 3 أيام", text: "تم استلام أمر الشراء PO-2397", actor: "نظام الاستلام" },
      { id: "ac-cp-2", type: "issue", date: "منذ 5 أيام", text: "تم تسجيل تأخير 6 ساعات", actor: "وحدة الاستلام" },
    ],
  },
  {
    id: "sp-beverages-coke",
    name: "كوكاكولا مصر",
    nameEn: "Coca-Cola Egypt",
    category: "beverages",
    categories: ["beverages"],
    city: "القاهرة",
    address: "المعادي، فرع الموزعين",
    contact: "هالة عبدالرحمن",
    phone: "0223456789",
    email: "h.abdelrahman@cocacola.eg",
    taxId: "012-345-678",
    status: "active",
    performanceTag: "stable",
    rating: 4.5,
    healthScore: 86,
    onTimePercent: 94.8,
    qualityScore: 9.0,
    issueRate: 2.1,
    avgDelayDays: 0.5,
    totalSpend: 462_000,
    payablesOwed: 38_400,
    paymentTerms: "صافي 45 يوم",
    joinedDate: "2023-05-01",
    lastOrderDate: "منذ 5 أيام",
    daysSinceLastOrder: 5,
    totalOrders: 76,
    recentPos: [
      { id: "po-2393", number: "#PO-2393", date: "منذ 5 أيام", amount: 42600, status: "received", itemCount: 6 },
    ],
    issues: [],
    attachments: [
      { id: "at-cc-1", name: "Distribution-Agreement.pdf", type: "contract", size: "2.1 MB", date: "2023-05-01" },
    ],
    activity: [
      { id: "ac-cc-1", type: "order", date: "منذ 5 أيام", text: "تم استلام PO-2393 (6 أصناف)", actor: "نظام الاستلام" },
    ],
  },
  {
    id: "sp-packaging-eco",
    name: "إيكو باك للتغليف",
    nameEn: "Eco Pack Solutions",
    category: "packaging",
    categories: ["packaging"],
    city: "6 أكتوبر",
    address: "المنطقة الصناعية الثالثة، 6 أكتوبر",
    contact: "كريم النجار",
    phone: "01087654321",
    email: "karim@eco-pack.eg",
    taxId: "567-890-123",
    status: "review",
    performanceTag: "risky",
    rating: 3.8,
    healthScore: 58,
    onTimePercent: 78.4,
    qualityScore: 7.6,
    issueRate: 12.4,
    avgDelayDays: 2.8,
    totalSpend: 184_500,
    payablesOwed: 32_800,
    paymentTerms: "صافي 30 يوم",
    joinedDate: "2024-02-20",
    lastOrderDate: "منذ 12 يوم",
    daysSinceLastOrder: 12,
    totalOrders: 28,
    recentPos: [
      { id: "po-2389", number: "#PO-2389", date: "منذ 12 يوم", amount: 24600, status: "overdue", itemCount: 5 },
    ],
    issues: [
      { id: "iss-ep-1", type: "quality", severity: "high", date: "منذ 8 أيام", description: "30% من علب الكرتون بمقاس خاطئ — رفض كامل", resolved: false },
      { id: "iss-ep-2", type: "late", severity: "high", date: "هذا الأسبوع", description: "تأخر 3 مرات هذا الأسبوع", resolved: false },
      { id: "iss-ep-3", type: "damage", severity: "medium", date: "منذ 18 يوم", description: "تلف في الغلاف الخارجي لـ 12 وحدة", resolved: true },
    ],
    attachments: [
      { id: "at-ep-1", name: "Quality-Notice.pdf", type: "document", size: "120 KB", date: "2026-04-26" },
      { id: "at-ep-2", name: "Master-Contract.pdf", type: "contract", size: "880 KB", date: "2024-02-20" },
    ],
    activity: [
      { id: "ac-ep-1", type: "status", date: "منذ 8 أيام", text: "تم تحويل المورد إلى وضع المراجعة", actor: "هدير ع." },
      { id: "ac-ep-2", type: "issue", date: "منذ 8 أيام", text: "بلاغ جودة جسيم — مقاس خاطئ", actor: "وحدة الجودة" },
      { id: "ac-ep-3", type: "issue", date: "هذا الأسبوع", text: "تكرار التأخير 3 مرات", actor: "وحدة الاستلام" },
    ],
    notes: "جودة متذبذبة — تحت المراجعة، نبحث بدائل.",
  },
  {
    id: "sp-spice-orient",
    name: "البهارات الشرقية",
    nameEn: "Orient Spices",
    category: "dry-goods",
    categories: ["dry-goods"],
    city: "الإسكندرية",
    address: "العطارين، الإسكندرية",
    contact: "وليد صابر",
    phone: "01234567890",
    email: "walid@orient-spices.eg",
    taxId: "890-123-456",
    status: "active",
    performanceTag: "high",
    rating: 4.7,
    healthScore: 91,
    onTimePercent: 95.4,
    qualityScore: 9.2,
    issueRate: 1.8,
    avgDelayDays: 0.4,
    totalSpend: 248_000,
    payablesOwed: 18_200,
    paymentTerms: "صافي 21 يوم",
    joinedDate: "2023-11-08",
    lastOrderDate: "منذ 6 أيام",
    daysSinceLastOrder: 6,
    totalOrders: 42,
    recentPos: [
      { id: "po-2394", number: "#PO-2394", date: "منذ 6 أيام", amount: 32400, status: "paid", itemCount: 8 },
    ],
    issues: [],
    attachments: [
      { id: "at-os-1", name: "Master-Contract.pdf", type: "contract", size: "720 KB", date: "2023-11-08" },
      { id: "at-os-2", name: "Lab-Test-Q1.pdf", type: "document", size: "1.8 MB", date: "2026-03-14" },
    ],
    activity: [
      { id: "ac-os-1", type: "order", date: "منذ 6 أيام", text: "تم سداد PO-2394 (8 أصناف بهارات)", actor: "قسم الحسابات" },
      { id: "ac-os-2", type: "edit", date: "منذ شهرين", text: "تم تحديث قائمة الأصناف الموردة (إضافة كمون مطحون)", actor: "هدير ع." },
    ],
  },
];

export const supplierStatusMeta: Record<
  SupplierStatus,
  { label: string; intent: "neutral" | "info" | "success" | "warning" | "danger" | "brand" }
> = {
  active: { label: "نشط", intent: "info" },
  preferred: { label: "مفضّل", intent: "brand" },
  review: { label: "تحت المراجعة", intent: "warning" },
  blocked: { label: "محظور", intent: "danger" },
};

export const poStatusMeta: Record<
  PoStatus,
  { label: string; intent: "neutral" | "info" | "success" | "warning" | "danger" | "brand" }
> = {
  draft: { label: "مسودة", intent: "neutral" },
  sent: { label: "أُرسل", intent: "info" },
  confirmed: { label: "مؤكَّد", intent: "info" },
  received: { label: "مستلم", intent: "brand" },
  paid: { label: "مدفوع", intent: "success" },
  overdue: { label: "متأخر السداد", intent: "danger" },
};

export const categoryMeta: Record<SupplierCategory, { label: string; tone: string }> = {
  meat: { label: "اللحوم والدواجن", tone: "danger" },
  produce: { label: "الخضروات", tone: "success" },
  dairy: { label: "الألبان", tone: "info" },
  "dry-goods": { label: "السلع الجافة", tone: "warning" },
  beverages: { label: "المشروبات", tone: "info" },
  packaging: { label: "التغليف", tone: "neutral" },
};

export const performanceTagMeta: Record<
  PerformanceTag,
  { label: string; intent: "success" | "info" | "warning" | "neutral" }
> = {
  high: { label: "أداء مرتفع", intent: "success" },
  stable: { label: "أداء مستقر", intent: "info" },
  risky: { label: "مورد مخاطر", intent: "warning" },
  inactive: { label: "خامل", intent: "neutral" },
};

export const issueTypeMeta: Record<IssueType, { label: string }> = {
  late: { label: "تأخير توريد" },
  missing: { label: "أصناف ناقصة" },
  quality: { label: "مشكلة جودة" },
  damage: { label: "تلف عبوات" },
};

export const issueSeverityMeta: Record<
  IssueSeverity,
  { label: string; intent: "info" | "warning" | "danger" }
> = {
  low: { label: "منخفضة", intent: "info" },
  medium: { label: "متوسطة", intent: "warning" },
  high: { label: "عالية", intent: "danger" },
};

export const attachmentTypeMeta: Record<AttachmentType, { label: string }> = {
  contract: { label: "عقد" },
  document: { label: "مستند" },
  invoice: { label: "فاتورة" },
};

export const supplierCounts = {
  total: suppliers.length,
  preferred: suppliers.filter((s) => s.status === "preferred").length,
  active: suppliers.filter((s) => s.status === "active").length,
  review: suppliers.filter((s) => s.status === "review").length,
  blocked: suppliers.filter((s) => s.status === "blocked").length,
  totalPayables: suppliers.reduce((sum, s) => sum + s.payablesOwed, 0),
  totalSpendYtd: suppliers.reduce((sum, s) => sum + s.totalSpend, 0),
  highPerformers: suppliers.filter((s) => s.performanceTag === "high").length,
  risky: suppliers.filter((s) => s.performanceTag === "risky").length,
  openIssues: suppliers.reduce((n, s) => n + s.issues.filter((i) => !i.resolved).length, 0),
};

/* ----------------------------------------------------------------------
 * Smart alerts — surfaced at the top of the index. Computed from the
 * supplier set, then frozen so consumers can render without recomputing.
 * -------------------------------------------------------------------- */

export const smartAlerts: SmartAlert[] = [
  {
    id: "alert-eco-1",
    severity: "danger",
    supplierId: "sp-packaging-eco",
    supplierName: "إيكو باك للتغليف",
    text: "تأخر التوريد 3 مرات هذا الأسبوع",
    date: "هذا الأسبوع",
  },
  {
    id: "alert-eco-2",
    severity: "warning",
    supplierId: "sp-packaging-eco",
    supplierName: "إيكو باك للتغليف",
    text: "نسبة بلاغات الجودة 12.4% (الحد المقبول 5%)",
    date: "آخر 30 يوم",
  },
  {
    id: "alert-cp-1",
    severity: "info",
    supplierId: "sp-poultry-cairo",
    supplierName: "دواجن القاهرة",
    text: "نسبة الالتزام بالموعد انخفضت إلى 86%",
    date: "آخر 14 يوم",
  },
];

export function getSupplier(id: string): Supplier | undefined {
  return suppliers.find((s) => s.id === id);
}

/** Bucket a 0-100 health score into a colour band. */
export function healthBand(score: number): "good" | "ok" | "risk" | "critical" {
  if (score >= 85) return "good";
  if (score >= 70) return "ok";
  if (score >= 55) return "risk";
  return "critical";
}
