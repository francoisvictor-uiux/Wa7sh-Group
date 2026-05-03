/**
 * Factory Suppliers mock data.
 * Suppliers provide raw materials to the factory.
 */

export type SupplierStatus = "active" | "inactive" | "on-hold";
export type OrderStatus    = "draft" | "sent" | "confirmed" | "received" | "disputed" | "cancelled";

export interface Supplier {
  id:          string;
  name:        string;
  nameEn?:     string;
  category:    string;      // what they supply
  phone:       string;
  email?:      string;
  address:     string;
  contactPerson: string;
  status:      SupplierStatus;
  rating:      number;      // 1–5
  onTimeRate:  number;      // %
  lastOrder?:  string;
  totalOrders: number;
  paymentTerms: string;
  notes?:      string;
}

export interface PurchaseOrderItem {
  itemId:    string;
  name:      string;
  unit:      string;
  qty:       number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id:          string;
  orderNumber: string;
  supplierId:  string;
  supplierName: string;
  status:      OrderStatus;
  items:       PurchaseOrderItem[];
  totalValue:  number;
  createdAt:   string;
  expectedAt?: string;
  receivedAt?: string;
  note?:       string;
}

// ─── Suppliers ────────────────────────────────────────────────────────────────

export const suppliers: Supplier[] = [
  {
    id: "sup-001",
    name: "مزارع النيل للحوم",
    category: "لحوم ودواجن",
    phone: "010-1111-2222",
    email: "nile@farms.eg",
    address: "منطقة الإنتاج الحيواني، الإسكندرية",
    contactPerson: "محمد السيد",
    status: "active",
    rating: 4,
    onTimeRate: 92,
    lastOrder: "منذ 3 أيام",
    totalOrders: 48,
    paymentTerms: "30 يوم",
  },
  {
    id: "sup-002",
    name: "الإسكندرية للألبان",
    category: "ألبان وأجبان",
    phone: "011-2222-3333",
    email: "alex@dairy.eg",
    address: "المنطقة الصناعية، برج العرب",
    contactPerson: "سمير جمال",
    status: "active",
    rating: 5,
    onTimeRate: 97,
    lastOrder: "أمس",
    totalOrders: 72,
    paymentTerms: "15 يوم",
  },
  {
    id: "sup-003",
    name: "الوادي للخضروات",
    category: "خضروات وفاكهة",
    phone: "012-3333-4444",
    address: "سوق الجملة، المحطة",
    contactPerson: "أحمد وادي",
    status: "active",
    rating: 3,
    onTimeRate: 78,
    lastOrder: "اليوم",
    totalOrders: 95,
    paymentTerms: "نقدي",
    notes: "يتأخر أحياناً في الصباح الباكر",
  },
  {
    id: "sup-004",
    name: "ميلانو للمنتجات الإيطالية",
    category: "دقيق وعجائن",
    phone: "010-4444-5555",
    email: "milano@italy.eg",
    address: "الميناء الغربي، الإسكندرية",
    contactPerson: "ماريو روسي",
    status: "active",
    rating: 5,
    onTimeRate: 99,
    lastOrder: "منذ أسبوع",
    totalOrders: 24,
    paymentTerms: "45 يوم",
  },
  {
    id: "sup-005",
    name: "النيل للمشروبات",
    category: "مشروبات وعصائر",
    phone: "011-5555-6666",
    address: "المنطقة الصناعية، الإسكندرية",
    contactPerson: "كريم ناصر",
    status: "active",
    rating: 4,
    onTimeRate: 88,
    lastOrder: "منذ أسبوعين",
    totalOrders: 31,
    paymentTerms: "30 يوم",
  },
  {
    id: "sup-006",
    name: "الفجر للتوريدات",
    category: "مواد تعبئة وتغليف",
    phone: "012-6666-7777",
    address: "منطقة محرم بك",
    contactPerson: "هاني فجر",
    status: "on-hold",
    rating: 2,
    onTimeRate: 65,
    lastOrder: "منذ شهر",
    totalOrders: 12,
    paymentTerms: "نقدي",
    notes: "موقوف مؤقتاً — جودة التغليف كانت رديئة في آخر 3 طلبيات",
  },
];

// ─── Purchase Orders ───────────────────────────────────────────────────────────

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "po-001",
    orderNumber: "#PO-2041",
    supplierId: "sup-003",
    supplierName: "الوادي للخضروات",
    status: "sent",
    createdAt: "اليوم · 6:00 ص",
    expectedAt: "اليوم · 10:00 ص",
    items: [
      { itemId: "fi-010", name: "طماطم",    unit: "كجم", qty: 200, unitPrice: 28 },
      { itemId: "fi-012", name: "خس",       unit: "كجم", qty: 50,  unitPrice: 35 },
      { itemId: "fi-011", name: "بصل",      unit: "كجم", qty: 150, unitPrice: 22 },
    ],
    totalValue: 10150,
  },
  {
    id: "po-002",
    orderNumber: "#PO-2040",
    supplierId: "sup-001",
    supplierName: "مزارع النيل للحوم",
    status: "confirmed",
    createdAt: "أمس · 2:00 م",
    expectedAt: "غداً · 7:00 ص",
    items: [
      { itemId: "fi-001", name: "لحم برجر",  unit: "كجم", qty: 200, unitPrice: 285 },
      { itemId: "fi-002", name: "لحم مفروم", unit: "كجم", qty: 100, unitPrice: 245 },
      { itemId: "fi-005", name: "صدر دجاج",  unit: "كجم", qty: 150, unitPrice: 195 },
    ],
    totalValue: 115250,
  },
  {
    id: "po-003",
    orderNumber: "#PO-2039",
    supplierId: "sup-002",
    supplierName: "الإسكندرية للألبان",
    status: "received",
    createdAt: "منذ يومين",
    receivedAt: "أمس · 9:00 ص",
    items: [
      { itemId: "fi-007", name: "موزاريلا",    unit: "كجم", qty: 80, unitPrice: 215 },
      { itemId: "fi-008", name: "شيدر شرائح",  unit: "كجم", qty: 40, unitPrice: 190 },
    ],
    totalValue: 24800,
  },
  {
    id: "po-004",
    orderNumber: "#PO-2038",
    supplierId: "sup-004",
    supplierName: "ميلانو للمنتجات الإيطالية",
    status: "received",
    createdAt: "منذ أسبوع",
    receivedAt: "منذ 5 أيام",
    items: [
      { itemId: "fi-014", name: "عجينة بيتزا", unit: "كرتونة", qty: 30, unitPrice: 180 },
      { itemId: "fi-015", name: "دقيق إيطالي", unit: "كيس",    qty: 20, unitPrice: 420 },
      { itemId: "fi-009", name: "كريمة طبخ",   unit: "لتر",    qty: 60, unitPrice: 75  },
    ],
    totalValue: 18300,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const supplierStatusMeta: Record<SupplierStatus, { label: string; color: string; bg: string }> = {
  active:   { label: "نشط",      color: "text-status-success", bg: "bg-status-success/10 border-status-success/30" },
  inactive: { label: "غير نشط",  color: "text-text-tertiary",  bg: "bg-bg-surface-raised border-border-subtle"     },
  "on-hold":{ label: "موقوف",    color: "text-status-danger",  bg: "bg-status-danger/10  border-status-danger/30"  },
};

export const orderStatusMeta: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  draft:     { label: "مسودة",     color: "text-text-tertiary",  bg: "bg-bg-surface-raised border-border-subtle"     },
  sent:      { label: "أُرسل",     color: "text-status-info",    bg: "bg-status-info/10    border-status-info/30"    },
  confirmed: { label: "مؤكد",      color: "text-brand-primary",  bg: "bg-brand-primary/10  border-brand-primary/30"  },
  received:  { label: "استُلم",    color: "text-status-success", bg: "bg-status-success/10 border-status-success/30" },
  disputed:  { label: "متنازع",    color: "text-status-danger",  bg: "bg-status-danger/10  border-status-danger/30"  },
  cancelled: { label: "ملغى",      color: "text-text-tertiary",  bg: "bg-bg-surface-raised border-border-subtle"     },
};

export const supplierCategories = [...new Set(suppliers.map((s) => s.category))];
