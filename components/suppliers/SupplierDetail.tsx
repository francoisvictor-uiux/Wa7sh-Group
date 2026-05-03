"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  Star,
  MapPin,
  User,
  Award,
  Plus,
  Download,
  AlertCircle,
  AlertTriangle,
  Pencil,
  Power,
  Trash2,
  PackagePlus,
  RotateCw,
  X,
  Check,
  FileText,
  FileSpreadsheet,
  Receipt,
  CheckCircle2,
  Edit3,
  Package,
  type LucideIcon,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import {
  getSupplier,
  suppliers,
  supplierStatusMeta,
  categoryMeta,
  performanceTagMeta,
  poStatusMeta,
  issueTypeMeta,
  issueSeverityMeta,
  attachmentTypeMeta,
  healthBand,
  type Supplier,
  type SupplierCategory,
  type SupplierIssue,
  type Attachment,
  type ActivityEntry,
  type PoStatus,
} from "@/lib/mock/suppliers";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HealthGauge } from "@/components/ui/HealthGauge";
import { Dropdown } from "@/components/ui/Dropdown";
import { useToastContext } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

type ToastApi = ReturnType<typeof useToastContext>;

const ALL_CATEGORIES: SupplierCategory[] = [
  "meat", "produce", "dairy", "dry-goods", "beverages", "packaging",
];

export function SupplierDetail({ supplierId }: { supplierId: string }) {
  const device = useDevice();
  const router = useRouter();
  const toast = useToastContext();
  const sourceSupplier = getSupplier(supplierId) ?? suppliers[0];
  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";

  // Local mutable categories so the inline edit feels real.
  const [categories, setCategories] = useState<SupplierCategory[]>(sourceSupplier.categories);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const supplier: Supplier = useMemo(
    () => ({ ...sourceSupplier, categories }),
    [sourceSupplier, categories]
  );

  const status = supplierStatusMeta[supplier.status];
  const perf = performanceTagMeta[supplier.performanceTag];
  const openIssues = supplier.issues.filter((i) => !i.resolved).length;

  function handleDelete() {
    toast.error("تم حذف المورد", supplier.name);
    setTimeout(() => router.push("/suppliers"), 300);
  }

  function toggleStatus() {
    const isActivating = supplier.status === "blocked";
    if (isActivating) toast.success("تم تفعيل المورد", supplier.name);
    else toast.success("تم إيقاف المورد", supplier.name);
  }

  return (
    <div
      className={cn(
        "mx-auto",
        isMobile ? "px-4 pt-4 pb-20 space-y-4" : isDesktop ? "px-8 py-7 max-w-[1500px] space-y-6" : "px-6 py-6 max-w-[1200px] space-y-5"
      )}
    >
      {/* Breadcrumb */}
      <Link
        href="/suppliers"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        كل الموردين
      </Link>

      {/* HEADER */}
      <header className={cn("flex items-start gap-5 flex-wrap", isMobile && "flex-col items-stretch")}>
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div
            className={cn(
              "shrink-0 rounded-md flex items-center justify-center font-bold relative",
              supplier.status === "preferred"
                ? "bg-brand-primary/15 text-brand-primary"
                : supplier.status === "review"
                ? "bg-status-warning/15 text-status-warning"
                : "bg-bg-surface-raised text-text-secondary",
              isDesktop ? "w-24 h-24 text-4xl" : isMobile ? "w-16 h-16 text-2xl" : "w-20 h-20 text-3xl"
            )}
          >
            {supplier.name.charAt(0)}
            {supplier.status === "preferred" && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary text-text-on-brand">
                <Award className="w-3.5 h-3.5" strokeWidth={2.25} />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-1">
              {categoryMeta[supplier.category].label}
            </p>
            <h1 className={cn("font-bold tracking-tight leading-tight", isDesktop ? "text-3xl" : isMobile ? "text-xl" : "text-2xl")}>
              {supplier.name}
            </h1>
            <p className="text-sm text-text-tertiary mt-1">{supplier.nameEn}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge intent={status.intent} size="md">{status.label}</Badge>
              <Badge intent={perf.intent} size="md" dot pulse={supplier.performanceTag === "risky"}>
                {perf.label}
              </Badge>
              <Badge intent="neutral" size="md">
                <Star className="w-3 h-3 fill-current" strokeWidth={1.5} />
                {supplier.rating.toFixed(1)}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-text-tertiary">
                <MapPin className="w-3 h-3" strokeWidth={1.75} />
                {supplier.city}
              </span>
            </div>
          </div>
        </div>

        {/* Header actions */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" leadingIcon={<Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />}
              onClick={() => router.push(`/suppliers/${supplier.id}/edit`)}>
              تعديل
            </Button>
            <Button size="md" leadingIcon={<PackagePlus className="w-4 h-4" strokeWidth={2} />}
              onClick={() => toast.info("بدء أمر شراء جديد", supplier.name)}>
              أمر شراء جديد
            </Button>
          </div>
        )}
      </header>

      {/* GRID */}
      <div
        className={cn(
          "grid gap-5",
          isDesktop ? "grid-cols-[1fr_380px]" : isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 lg:grid-cols-[1fr_340px]"
        )}
      >
        {/* MAIN COLUMN */}
        <div className={cn("space-y-5 min-w-0", isMobile && "space-y-4")}>
          {/* PERFORMANCE OVERVIEW */}
          <PerformanceCard supplier={supplier} />

          {/* ORDER HISTORY */}
          <OrderHistoryCard supplier={supplier} />

          {/* ISSUES & INCIDENTS */}
          <IssuesCard issues={supplier.issues} openCount={openIssues} />

          {/* NOTES */}
          {supplier.notes && (
            <Card padding="md" className="bg-status-info/[0.06] border-status-info/30">
              <div className="flex items-start gap-3">
                <div className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-status-info/15">
                  <AlertCircle className="w-4 h-4 text-status-info" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-medium tracking-tight mb-1">ملاحظات داخلية</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{supplier.notes}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* SIDE RAIL */}
        <aside className="space-y-5 min-w-0">
          {/* BASIC INFO + CONTACT */}
          <ContactCard supplier={supplier} />

          {/* CATEGORIES (editable) */}
          <CategoriesCard
            categories={categories}
            onChange={setCategories}
          />

          {/* ATTACHMENTS */}
          <AttachmentsCard attachments={supplier.attachments} />

          {/* ACTIONS PANEL */}
          <ActionsPanel
            supplier={supplier}
            confirmingDelete={confirmingDelete}
            setConfirmingDelete={setConfirmingDelete}
            onDelete={handleDelete}
            onToggleStatus={toggleStatus}
          />

          {/* ACTIVITY TIMELINE */}
          <ActivityCard activity={supplier.activity} />
        </aside>
      </div>

      {/* Mobile sticky action bar */}
      {isMobile && (
        <div className="fixed bottom-[80px] inset-x-3 z-20 flex items-center gap-2 p-2 rounded-md bg-bg-surface-raised border border-border-subtle shadow-lg">
          <Button variant="secondary" size="sm" fullWidth
            leadingIcon={<Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />}
            onClick={() => router.push(`/suppliers/${supplier.id}/edit`)}>
            تعديل
          </Button>
          <Button size="sm" fullWidth
            leadingIcon={<PackagePlus className="w-3.5 h-3.5" strokeWidth={2} />}
            onClick={() => toast.info("بدء أمر شراء جديد", supplier.name)}>
            أمر جديد
          </Button>
        </div>
      )}
    </div>
  );
}

/* ======================================================================
 * Performance overview — gauge + 4 metrics
 * ==================================================================== */

function PerformanceCard({ supplier }: { supplier: Supplier }) {
  const band = healthBand(supplier.healthScore);
  const onTimeAccent = supplier.onTimePercent >= 95 ? "good" : supplier.onTimePercent >= 85 ? "ok" : "warning";
  const issueAccent = supplier.issueRate <= 2 ? "good" : supplier.issueRate <= 5 ? "ok" : "warning";
  const delayAccent = supplier.avgDelayDays <= 0.5 ? "good" : supplier.avgDelayDays <= 1.5 ? "ok" : "warning";

  return (
    <Card padding="lg">
      <header className="flex items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">أداء المورد</p>
          <h2 className="text-base font-medium tracking-tight">آخر 12 شهر</h2>
        </div>
        <div className="text-left">
          <p className="text-[10px] tracking-[0.14em] uppercase text-text-tertiary mb-1">ينعكس في</p>
          <p className="text-xs font-medium text-text-secondary">المؤشر · التقييم · التنبيهات</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr] items-center">
        {/* Gauge */}
        <div className="flex flex-col items-center gap-2">
          <HealthGauge value={supplier.healthScore} size="lg" />
          <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary">المؤشر العام (من 100)</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Metric
            label="الالتزام بالموعد"
            value={`${supplier.onTimePercent.toFixed(1)}%`}
            tone={onTimeAccent}
          />
          <Metric
            label="نسبة البلاغات"
            value={`${supplier.issueRate.toFixed(1)}%`}
            tone={issueAccent}
            invert
          />
          <Metric
            label="متوسط التأخير"
            value={`${supplier.avgDelayDays.toFixed(1)} يوم`}
            tone={delayAccent}
            invert
          />
          <Metric
            label="جودة الفحص"
            value={`${supplier.qualityScore.toFixed(1)}/10`}
            tone={supplier.qualityScore >= 9 ? "good" : supplier.qualityScore >= 8 ? "ok" : "warning"}
          />
        </div>
      </div>

      {/* Trend bar — last 12 months on-time signal */}
      <div className="mt-6 pt-5 border-t border-border-subtle">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary">
            مؤشر الالتزام شهرياً
          </p>
          <p className="text-[11px] text-text-tertiary tabular">آخر 12 شهر</p>
        </div>
        <TrendBars supplier={supplier} />
      </div>
    </Card>
  );
}

function Metric({
  label, value, tone, invert,
}: {
  label: string;
  value: string;
  tone: "good" | "ok" | "warning";
  invert?: boolean;
}) {
  const color =
    tone === "good"   ? "text-status-success" :
    tone === "ok"     ? "text-brand-primary" :
                        "text-status-warning";
  return (
    <div>
      <p className="text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-1.5">{label}</p>
      <p className={cn("text-2xl font-bold tabular tracking-tight leading-none", color)}>
        {value}
      </p>
      {invert && (
        <p className="text-[10px] text-text-tertiary mt-1">كلما أقل، أفضل</p>
      )}
    </div>
  );
}

/** Generates a stable 12-bar trend per supplier id for the small tracker. */
function TrendBars({ supplier }: { supplier: Supplier }) {
  // Pseudo-random but deterministic from supplier id + onTime baseline.
  const bars = useMemo(() => {
    const seed = [...supplier.id].reduce((a, c) => a + c.charCodeAt(0), 0);
    const baseline = supplier.onTimePercent;
    return Array.from({ length: 12 }).map((_, i) => {
      const noise = ((seed * (i + 3)) % 23) - 11;
      const v = Math.max(60, Math.min(100, baseline + noise));
      return v;
    });
  }, [supplier.id, supplier.onTimePercent]);
  const months = ["م5", "م6", "م7", "م8", "م9", "م10", "م11", "م12", "م1", "م2", "م3", "م4"];
  return (
    <div className="flex items-end gap-1 h-14">
      {bars.map((v, i) => {
        const tone =
          v >= 95 ? "bg-status-success/70" :
          v >= 85 ? "bg-brand-primary/70" :
                    "bg-status-warning/70";
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
            <div className="w-full relative" style={{ height: "100%" }}>
              <div
                className={cn("w-full rounded-t-[3px] absolute bottom-0", tone)}
                style={{ height: `${(v - 50) * 2}%` }}
              />
            </div>
            <span className="text-[9px] text-text-tertiary tabular">{months[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ======================================================================
 * Order history — with status filter + reorder
 * ==================================================================== */

function OrderHistoryCard({ supplier }: { supplier: Supplier }) {
  const toast = useToastContext();
  const [filter, setFilter] = useState<PoStatus | "all">("all");
  const list = filter === "all" ? supplier.recentPos : supplier.recentPos.filter((p) => p.status === filter);

  return (
    <Card padding="none">
      <div className="px-5 pt-5 pb-3 border-b border-border-subtle flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">سجل الطلبات</p>
          <h2 className="text-base font-medium tracking-tight">{supplier.totalOrders} أمر شراء إجمالاً</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[160px]">
            <Dropdown
              value={filter}
              onChange={(v) => setFilter(v as PoStatus | "all")}
              options={[
                { value: "all",       label: "كل الحالات" },
                { value: "received",  label: "مستلم" },
                { value: "confirmed", label: "مؤكَّد" },
                { value: "paid",      label: "مدفوع" },
                { value: "overdue",   label: "متأخر السداد" },
              ]}
            />
          </div>
          <Button size="sm" leadingIcon={<RotateCw className="w-3 h-3" strokeWidth={2} />}
            onClick={() => toast.info("جارٍ تحضير إعادة الطلب", `بناءً على آخر طلب: ${supplier.recentPos[0]?.number ?? ""}`)}>
            إعادة آخر طلب
          </Button>
          <Button variant="secondary" size="sm" leadingIcon={<Plus className="w-3 h-3" strokeWidth={2.5} />}
            onClick={() => toast.info("بدء أمر شراء جديد", supplier.name)}>
            أمر جديد
          </Button>
        </div>
      </div>
      {list.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-text-tertiary">
          لا توجد أوامر شراء بهذه الحالة
        </div>
      ) : (
        <ul>
          {list.map((po) => {
            const meta = poStatusMeta[po.status];
            return (
              <li
                key={po.id}
                className={cn(
                  "relative flex items-center justify-between gap-3 px-5 py-3.5",
                  "border-b border-border-subtle last:border-0",
                  "transition-shadow duration-fast group",
                  "hover:[box-shadow:inset_3px_0_0_0_var(--brand-primary)]"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-sm bg-bg-surface-raised text-text-tertiary shrink-0">
                    <Package className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium tabular tracking-tight">{po.number}</p>
                    <p className="text-[11px] text-text-tertiary tabular mt-0.5">
                      {po.date} · {po.itemCount} صنف
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium tabular tracking-tight text-left">
                    {po.amount.toLocaleString("en-US")}
                    <span className="text-[10px] text-text-tertiary font-normal mr-1">ج.م</span>
                  </p>
                  <Badge intent={meta.intent} size="sm">{meta.label}</Badge>
                  <button
                    type="button"
                    onClick={() => toast.info("تكرار الطلب", po.number)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast inline-flex items-center justify-center w-7 h-7 rounded-sm text-text-tertiary hover:text-brand-primary hover:bg-bg-surface-raised"
                    title="إعادة الطلب"
                    aria-label="إعادة الطلب"
                  >
                    <RotateCw className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

/* ======================================================================
 * Issues & incidents
 * ==================================================================== */

function IssuesCard({ issues, openCount }: { issues: SupplierIssue[]; openCount: number }) {
  if (issues.length === 0) {
    return (
      <Card padding="lg" className="bg-status-success/[0.05] border-status-success/30">
        <div className="flex items-start gap-3">
          <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-status-success/15">
            <CheckCircle2 className="w-5 h-5 text-status-success" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-base font-medium tracking-tight mb-1">لا بلاغات مسجّلة</p>
            <p className="text-sm text-text-secondary">سجل نظيف على آخر 12 شهر — استمرار التميّز.</p>
          </div>
        </div>
      </Card>
    );
  }
  return (
    <Card padding="none">
      <div className="px-5 pt-5 pb-3 border-b border-border-subtle flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">البلاغات والحوادث</p>
          <h2 className="text-base font-medium tracking-tight">
            {issues.length} بلاغ
            {openCount > 0 && (
              <span className="text-status-warning"> · {openCount} مفتوح</span>
            )}
          </h2>
        </div>
        {openCount > 0 && (
          <Badge intent="warning" size="md" dot pulse>
            تحت المتابعة
          </Badge>
        )}
      </div>
      <ul>
        {issues.map((iss) => {
          const sev = issueSeverityMeta[iss.severity];
          const type = issueTypeMeta[iss.type];
          return (
            <li
              key={iss.id}
              className="relative flex items-start gap-3 px-5 py-4 border-b border-border-subtle last:border-0"
            >
              <span
                className={cn(
                  "absolute right-0 top-0 bottom-0 w-1",
                  iss.severity === "high" && "bg-status-danger",
                  iss.severity === "medium" && "bg-status-warning",
                  iss.severity === "low" && "bg-status-info",
                )}
                aria-hidden
              />
              <div className="shrink-0 mt-0.5">
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-8 h-8 rounded-full",
                    iss.severity === "high" && "bg-status-danger/12 text-status-danger",
                    iss.severity === "medium" && "bg-status-warning/12 text-status-warning",
                    iss.severity === "low" && "bg-status-info/12 text-status-info",
                  )}
                >
                  <AlertTriangle className="w-4 h-4" strokeWidth={1.75} />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium tracking-tight">{type.label}</span>
                  <Badge intent={sev.intent} size="sm">{sev.label}</Badge>
                  {iss.resolved ? (
                    <Badge intent="success" size="sm">
                      <Check className="w-2.5 h-2.5" strokeWidth={2.5} />
                      مغلق
                    </Badge>
                  ) : (
                    <Badge intent="warning" size="sm" dot pulse>مفتوح</Badge>
                  )}
                </div>
                <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                  {iss.description}
                </p>
                <p className="text-[11px] text-text-tertiary mt-1.5">{iss.date}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ======================================================================
 * Contact / basic info card
 * ==================================================================== */

function ContactCard({ supplier }: { supplier: Supplier }) {
  const toast = useToastContext();
  return (
    <Card padding="md">
      <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">معلومات أساسية</p>
      <div className="space-y-3">
        <Row icon={<User className="w-3.5 h-3.5" strokeWidth={1.75} />} label="جهة الاتصال" value={supplier.contact} />
        <Row icon={<Phone className="w-3.5 h-3.5" strokeWidth={1.75} />} label="هاتف رئيسي" value={supplier.phone} mono />
        {supplier.phoneSecondary && (
          <Row icon={<Phone className="w-3.5 h-3.5" strokeWidth={1.75} />} label="هاتف ثانوي" value={supplier.phoneSecondary} mono />
        )}
        <Row icon={<Mail className="w-3.5 h-3.5" strokeWidth={1.75} />} label="بريد إلكتروني" value={supplier.email} />
        {supplier.address && (
          <Row icon={<MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />} label="العنوان" value={supplier.address} />
        )}
        <Row icon={<Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />} label="رقم ضريبي" value={supplier.taxId} mono />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button variant="secondary" size="sm" fullWidth leadingIcon={<Phone className="w-3.5 h-3.5" strokeWidth={1.75} />}
          onClick={() => toast.info("جاري الاتصال", supplier.phone)}>
          اتصل
        </Button>
        <Button variant="secondary" size="sm" fullWidth leadingIcon={<Mail className="w-3.5 h-3.5" strokeWidth={1.75} />}
          onClick={() => toast.info("بريد إلكتروني", supplier.email)}>
          إيميل
        </Button>
      </div>
    </Card>
  );
}

function Row({
  icon, label, value, mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-text-tertiary mt-0.5">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium tracking-tight leading-tight truncate", mono && "tabular")}>{value}</p>
        <p className="text-[10px] text-text-tertiary tracking-[0.14em] uppercase">{label}</p>
      </div>
    </div>
  );
}

/* ======================================================================
 * Categories — editable inline
 * ==================================================================== */

function CategoriesCard({
  categories,
  onChange,
}: {
  categories: SupplierCategory[];
  onChange: (next: SupplierCategory[]) => void;
}) {
  const toast = useToastContext();
  const [picking, setPicking] = useState(false);
  const remaining = ALL_CATEGORIES.filter((c) => !categories.includes(c));

  function remove(c: SupplierCategory) {
    if (categories.length === 1) {
      toast.error("لا يمكن حذف الفئة الأخيرة");
      return;
    }
    onChange(categories.filter((x) => x !== c));
    toast.success("تم تحديث الفئات");
  }

  function add(c: SupplierCategory) {
    onChange([...categories, c]);
    setPicking(false);
    toast.success("تم تحديث الفئات");
  }

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary">الفئات الموردة</p>
        {!picking && remaining.length > 0 && (
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-text-tertiary hover:text-brand-primary hover:bg-bg-surface-raised transition-colors duration-fast"
            aria-label="إضافة فئة"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {categories.map((c) => (
          <span
            key={c}
            className={cn(
              "group inline-flex items-center gap-1 h-6 px-2 rounded-full text-[10px] font-medium tracking-tight",
              "bg-bg-surface-raised text-text-secondary border border-border-subtle",
              "transition-colors duration-fast hover:border-border-strong"
            )}
          >
            {categoryMeta[c].label}
            <button
              type="button"
              onClick={() => remove(c)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast text-text-tertiary hover:text-status-danger w-3 h-3 inline-flex items-center justify-center"
              aria-label="حذف"
            >
              <X className="w-2.5 h-2.5" strokeWidth={2.5} />
            </button>
          </span>
        ))}
      </div>
      {picking && (
        <div className="mt-3 pt-3 border-t border-border-subtle animate-slide-up">
          <p className="text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-2">إضافة فئة</p>
          <div className="flex items-center gap-1 flex-wrap">
            {remaining.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => add(c)}
                className="inline-flex items-center gap-1 h-6 px-2 rounded-full text-[10px] font-medium tracking-tight bg-bg-surface border border-border-subtle hover:border-brand-primary hover:text-brand-primary transition-all duration-fast active:scale-[1.05]"
              >
                <Plus className="w-2.5 h-2.5" strokeWidth={2} />
                {categoryMeta[c].label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPicking(false)}
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-text-tertiary hover:text-text-primary"
              aria-label="إغلاق"
            >
              <X className="w-3 h-3" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ======================================================================
 * Attachments
 * ==================================================================== */

const attachmentIcon: Record<Attachment["type"], LucideIcon> = {
  contract: FileText,
  document: FileSpreadsheet,
  invoice: Receipt,
};

function AttachmentsCard({ attachments }: { attachments: Attachment[] }) {
  const toast = useToastContext();
  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary">المرفقات</p>
        <button
          type="button"
          onClick={() => toast.info("اختر ملفًا للرفع")}
          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-text-tertiary hover:text-brand-primary hover:bg-bg-surface-raised transition-colors duration-fast"
          aria-label="إضافة مرفق"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>
      {attachments.length === 0 ? (
        <p className="text-sm text-text-tertiary text-center py-4">لا توجد مرفقات</p>
      ) : (
        <ul className="space-y-2">
          {attachments.map((att) => {
            const Icon = attachmentIcon[att.type];
            return (
              <li
                key={att.id}
                className={cn(
                  "relative flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-sm group",
                  "transition-shadow duration-fast",
                  "hover:[box-shadow:inset_3px_0_0_0_var(--brand-primary)]"
                )}
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-sm bg-bg-surface-raised text-text-tertiary shrink-0">
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium tracking-tight tabular truncate">{att.name}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5 tabular">
                    {attachmentTypeMeta[att.type].label} · {att.size} · {att.date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("جاري التحميل", att.name)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast inline-flex items-center justify-center w-7 h-7 rounded-sm text-text-tertiary hover:text-text-primary hover:bg-bg-surface"
                  aria-label="تحميل"
                  title="تحميل"
                >
                  <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

/* ======================================================================
 * Actions panel — Edit / Activate-Deactivate / Delete
 * ==================================================================== */

function ActionsPanel({
  supplier,
  confirmingDelete,
  setConfirmingDelete,
  onDelete,
  onToggleStatus,
}: {
  supplier: Supplier;
  confirmingDelete: boolean;
  setConfirmingDelete: (v: boolean) => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  return (
    <Card padding="md">
      <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">إجراءات</p>
      <div className="space-y-2">
        <Link
          href={`/suppliers/${supplier.id}/edit`}
          className={cn(
            "flex items-center justify-between gap-3 h-10 px-3 rounded-sm text-sm font-medium tracking-tight",
            "bg-bg-surface border border-border hover:border-border-strong transition-all duration-fast"
          )}
        >
          <span className="inline-flex items-center gap-2">
            <Pencil className="w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />
            تعديل المورد
          </span>
          <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-text-tertiary" strokeWidth={1.75} />
        </Link>
        <button
          type="button"
          onClick={onToggleStatus}
          className={cn(
            "w-full flex items-center justify-between gap-3 h-10 px-3 rounded-sm text-sm font-medium tracking-tight",
            "bg-bg-surface border border-border hover:border-status-warning/60 hover:text-status-warning transition-all duration-fast"
          )}
        >
          <span className="inline-flex items-center gap-2">
            <Power className="w-3.5 h-3.5" strokeWidth={1.75} />
            {supplier.status === "blocked" ? "إعادة تفعيل" : "إيقاف المورد"}
          </span>
        </button>
        {!confirmingDelete ? (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className={cn(
              "w-full flex items-center justify-between gap-3 h-10 px-3 rounded-sm text-sm font-medium tracking-tight",
              "bg-bg-surface border border-border hover:border-status-danger/60 hover:text-status-danger transition-all duration-fast"
            )}
          >
            <span className="inline-flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
              حذف
            </span>
          </button>
        ) : (
          <div className="rounded-sm border border-status-danger/40 bg-status-danger/[0.06] p-3 animate-slide-up">
            <p className="text-xs text-status-danger font-medium mb-2">
              هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDelete}
                className="flex-1 h-9 rounded-sm bg-status-danger text-white text-xs font-medium tracking-tight hover:brightness-110 active:brightness-95 transition-all duration-fast"
              >
                نعم، احذف
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="flex-1 h-9 rounded-sm border border-border bg-bg-surface text-text-secondary text-xs font-medium tracking-tight hover:border-border-strong transition-all duration-fast"
              >
                تراجع
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ======================================================================
 * Activity timeline
 * ==================================================================== */

const activityIcon: Record<ActivityEntry["type"], LucideIcon> = {
  edit: Edit3,
  order: Package,
  issue: AlertTriangle,
  status: Power,
  note: AlertCircle,
  added: Plus,
};

const activityTone: Record<ActivityEntry["type"], string> = {
  edit:   "bg-status-info/15 text-status-info",
  order:  "bg-brand-primary/15 text-brand-primary",
  issue:  "bg-status-warning/15 text-status-warning",
  status: "bg-status-warning/15 text-status-warning",
  note:   "bg-bg-surface-raised text-text-secondary",
  added:  "bg-status-success/15 text-status-success",
};

function ActivityCard({ activity }: { activity: ActivityEntry[] }) {
  return (
    <Card padding="md">
      <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-4">النشاط الأخير</p>
      <ol className="relative space-y-4">
        <span
          className="absolute right-[15px] top-3 bottom-3 w-px bg-border-subtle"
          aria-hidden
        />
        {activity.map((a) => {
          const Icon = activityIcon[a.type];
          return (
            <li key={a.id} className="relative flex items-start gap-3">
              <span
                className={cn(
                  "shrink-0 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-bg-surface",
                  activityTone[a.type]
                )}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-xs leading-relaxed text-text-primary">{a.text}</p>
                <p className="text-[10px] text-text-tertiary mt-1 tabular">
                  {a.date}{a.actor ? ` · ${a.actor}` : ""}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
