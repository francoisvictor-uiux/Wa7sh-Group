/**
 * Disputes — financial disputes ready for admin settlement.
 *
 * Each dispute is born from a verification chain with a discrepancy.
 * The admin views evidence and clicks one of 3 settlement buttons:
 *   - Factory at fault (packing error)
 *   - Driver at fault (negligence/loss)
 *   - Branch at fault (receiving error)
 *
 * One click → posts accounting entry + closes ticket.
 */

import type { BrandId } from "@/lib/mock/branches";

export type DisputeStatus =
  | "open"            // newly raised
  | "investigating"   // admin reviewing
  | "settled-factory" // factory pays
  | "settled-driver"  // driver pays
  | "settled-branch"  // branch eats the loss
  | "closed";         // archived

export type SettlementParty = "factory" | "driver" | "branch";

export interface DisputeItem {
  name:        string;
  expectedQty: number;
  receivedQty: number;
  unit:        string;
  unitPrice:   number;        // EGP per unit
  shortage:    number;        // expectedQty - receivedQty
  loss:        number;        // shortage * unitPrice
}

export interface Dispute {
  id:              string;
  ticketNumber:    string;
  shipmentNumber:  string;
  brandId:         BrandId;
  branchName:      string;
  status:          DisputeStatus;
  totalLoss:       number;      // EGP
  createdAt:       string;
  reportedBy:      string;       // who flagged it (branch manager usually)
  driverName:      string;
  blameSuggestion: SettlementParty;  // chain-derived hint

  items:        DisputeItem[];
  photoCount:   number;
  driverNote?:  string;
  branchNote:   string;

  // Filled when settled
  settledAt?:        string;
  settledBy?:        string;
  settlementParty?:  SettlementParty;
  settlementNote?:   string;
}

const items1: DisputeItem[] = [
  { name: "جبنة شيدر شرائح", expectedQty: 12, receivedQty: 8, unit: "كجم", unitPrice: 190, shortage: 4, loss: 760 },
];

const items2: DisputeItem[] = [
  { name: "لحم برجر",  expectedQty: 50, receivedQty: 47, unit: "كجم",     unitPrice: 285, shortage: 3, loss: 855 },
  { name: "خبز برجر",  expectedQty: 6,  receivedQty: 5,  unit: "كرتونة",  unitPrice: 240, shortage: 1, loss: 240 },
];

const items3: DisputeItem[] = [
  { name: "صدر دجاج",  expectedQty: 15, receivedQty: 12, unit: "كجم", unitPrice: 195, shortage: 3, loss: 585 },
  { name: "طماطم",     expectedQty: 8,  receivedQty: 6,  unit: "كجم", unitPrice: 28,  shortage: 2, loss: 56 },
];

export const disputes: Dispute[] = [
  {
    id: "dsp-001",
    ticketNumber: "#DSP-2041",
    shipmentNumber: "#SHP-0088",
    brandId: "wahsh",
    branchName: "فرع جليم",
    status: "open",
    totalLoss: items1.reduce((s, i) => s + i.loss, 0),
    createdAt: "اليوم · 7:25 ص",
    reportedBy: "منى محمود",
    driverName: "عمرو سعيد",
    blameSuggestion: "driver",
    items: items1,
    photoCount: 3,
    driverNote: "وصلت الشحنة سليمة لما طلعت من المصنع — مش عارف فين الـ 4 كجم",
    branchNote: "ناقص 4 كجم جبنة شيدر — تم تصوير الكرتونة قبل الفك. السائق وقّع على 12 كجم في المصنع.",
  },
  {
    id: "dsp-002",
    ticketNumber: "#DSP-2040",
    shipmentNumber: "#SHP-0085",
    brandId: "kababgy",
    branchName: "فرع سموحة",
    status: "investigating",
    totalLoss: items2.reduce((s, i) => s + i.loss, 0),
    createdAt: "أمس · 4:00 م",
    reportedBy: "أنس فؤاد",
    driverName: "محمود علي",
    blameSuggestion: "factory",
    items: items2,
    photoCount: 5,
    driverNote: "الكرتونة كانت مفتوحة من المصنع، وقّعت بالثقة في الديسباتشر",
    branchNote: "وصل ناقص 3 كجم لحم + كرتونة خبز ناقصة 1. الكرتونة الكبيرة كانت Tape مكسور — يبدو خطأ تعبئة من المصنع.",
  },
  {
    id: "dsp-003",
    ticketNumber: "#DSP-2039",
    shipmentNumber: "#SHP-0084",
    brandId: "wahsh",
    branchName: "فرع المندرة",
    status: "settled-factory",
    totalLoss: items3.reduce((s, i) => s + i.loss, 0),
    createdAt: "منذ يومين",
    reportedBy: "كريم العشري",
    driverName: "حسام فاروق",
    blameSuggestion: "factory",
    items: items3,
    photoCount: 4,
    branchNote: "ناقص 3 كجم دجاج + 2 كجم طماطم",
    settledAt: "أمس · 11:30 ص",
    settledBy: "فرانسوا — الأونر",
    settlementParty: "factory",
    settlementNote: "خطأ تعبئة في المصنع — الكميات ناقصة من البداية. تم خصم القيمة من حساب المصنع.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const disputeCounts = {
  open:          disputes.filter((d) => d.status === "open").length,
  investigating: disputes.filter((d) => d.status === "investigating").length,
  settled:       disputes.filter((d) => d.status.startsWith("settled")).length,
  totalOpenLoss: disputes
    .filter((d) => d.status === "open" || d.status === "investigating")
    .reduce((s, d) => s + d.totalLoss, 0),
};

export const settlementMeta: Record<SettlementParty, { label: string; description: string; tone: "danger" | "warning" | "info" }> = {
  factory: { label: "تحميل العجز على المصنع", description: "خطأ تعبئة من المصنع — يخصم من حساب المصنع", tone: "info"    },
  driver:  { label: "تحميل العجز على السائق",  description: "إهمال أو فقد في النقل — يخصم من السائق",  tone: "danger"  },
  branch:  { label: "تحميل التكلفة على الفرع", description: "خطأ استلام أو تخزين — يتحمله الفرع",      tone: "warning" },
};

export const statusMeta: Record<DisputeStatus, { label: string; tone: "warning" | "info" | "success" | "neutral" }> = {
  open:              { label: "مفتوح",                tone: "warning" },
  investigating:     { label: "قيد المراجعة",          tone: "info"    },
  "settled-factory": { label: "محسوم — على المصنع",   tone: "success" },
  "settled-driver":  { label: "محسوم — على السائق",   tone: "success" },
  "settled-branch":  { label: "محسوم — على الفرع",    tone: "success" },
  closed:            { label: "مغلق",                  tone: "neutral" },
};
