"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Package,
  AlertTriangle,
  CheckCircle2,
  Hash,
  Tags,
  Ruler,
  MapPin,
  CalendarDays,
  Coins,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { categories, type StockLevel } from "@/lib/mock/factoryInventory";
import { brandMeta, type BrandId } from "@/lib/mock/branches";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { useToastContext } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

type BrandValue = BrandId | "shared";

interface FormState {
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentQty: number;
  minQty: number;
  maxQty: number;
  location: string;
  brand: BrandValue;
  expiryDate: string;
  pricePerUnit: number;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

function emptyState(): FormState {
  return {
    name: "",
    sku: "",
    category: categories[0] ?? "",
    unit: "كجم",
    currentQty: 0,
    minQty: 0,
    maxQty: 0,
    location: "",
    brand: "shared",
    expiryDate: "",
    pricePerUnit: 0,
  };
}

const UNITS = ["كجم", "لتر", "كرتونة", "كيس", "علبة", "وحدة"];

export function InventoryForm() {
  const router = useRouter();
  const device = useDevice();
  const toast = useToastContext();
  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";

  const [form, setForm] = useState<FormState>(emptyState());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Set<keyof FormState>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">("idle");
  const lastSavedRef = useRef<string>(JSON.stringify(emptyState()));
  const dirty = JSON.stringify(form) !== lastSavedRef.current;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setTouched((t) => { if (t.has(key)) return t; const n = new Set(t); n.add(key); return n; });
  }

  function validate(state: FormState): FieldErrors {
    const out: FieldErrors = {};
    if (!state.name.trim()) out.name = "اسم الصنف مطلوب";
    if (!state.sku.trim()) out.sku = "كود SKU مطلوب";
    if (!state.category.trim()) out.category = "الفئة مطلوبة";
    if (!state.unit.trim()) out.unit = "الوحدة مطلوبة";
    if (state.maxQty <= 0) out.maxQty = "السقف يجب أن يكون أكبر من صفر";
    if (state.minQty < 0) out.minQty = "الحد الأدنى لا يمكن أن يكون سالباً";
    if (state.minQty >= state.maxQty) out.minQty = "الحد الأدنى يجب أن يكون أقل من السقف";
    if (state.currentQty < 0) out.currentQty = "الكمية لا يمكن أن تكون سالبة";
    return out;
  }

  useEffect(() => { setErrors(validate(form)); }, [form]);

  // autosave
  useEffect(() => {
    if (!dirty) return;
    setDraftStatus("saving");
    const t = setTimeout(() => {
      lastSavedRef.current = JSON.stringify(form);
      setDraftStatus("saved");
      setTimeout(() => setDraftStatus("idle"), 1400);
    }, 900);
    return () => clearTimeout(t);
  }, [form, dirty]);

  async function handleSubmit() {
    const errs = validate(form);
    setErrors(errs);
    setTouched(new Set(Object.keys(form) as (keyof FormState)[]));
    if (Object.keys(errs).length > 0) {
      toast.error("لم يكتمل النموذج", "أكمل الحقول المطلوبة");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast.success("تم إضافة الصنف", form.name);
    setTimeout(() => router.push("/inventory"), 250);
  }

  const visible = (k: keyof FormState) => touched.has(k) ? errors[k] : undefined;
  const level: StockLevel = useMemo(() => {
    const min = form.minQty;
    if (form.currentQty === 0) return "out";
    if (form.currentQty <= min * 0.5) return "critical";
    if (form.currentQty <= min) return "low";
    return "good";
  }, [form.currentQty, form.minQty]);

  return (
    <div className={cn("mx-auto", isMobile ? "px-4 pt-4 pb-24 space-y-4" : isDesktop ? "px-8 py-7 max-w-[1280px] space-y-6" : "px-6 py-6 max-w-[1100px] space-y-5")}>
      <Link
        href="/inventory"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        كل الأصناف
      </Link>

      <header className="flex items-end gap-4 flex-wrap justify-between">
        <div>
          <p className="text-text-tertiary tracking-[0.18em] uppercase mb-1 text-xs">New Item</p>
          <h1 className={cn("font-bold tracking-tight", isDesktop ? "text-3xl" : isMobile ? "text-xl" : "text-2xl")}>
            إضافة صنف جديد
          </h1>
          <DraftIndicator status={draftStatus} dirty={dirty} />
        </div>
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={() => router.back()}>إلغاء</Button>
            <Button size="md" loading={submitting} onClick={handleSubmit} leadingIcon={<Save className="w-4 h-4" strokeWidth={2} />}>
              حفظ الصنف
            </Button>
          </div>
        )}
      </header>

      <div className={cn("grid gap-5", isDesktop ? "grid-cols-[1fr_320px]" : "grid-cols-1")}>
        <div className="space-y-5 min-w-0">
          {/* Basic Info */}
          <Section badge="1" label="بيانات الصنف" required>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="الاسم" required error={visible("name")} icon={<Package className="w-3.5 h-3.5" strokeWidth={1.75} />}>
                <TextInput value={form.name} onChange={(v) => update("name", v)} placeholder="مثال: لحم برجر — قطعة 150ج" hasError={!!visible("name")} />
              </Field>
              <Field label="كود SKU" required error={visible("sku")} icon={<Hash className="w-3.5 h-3.5" strokeWidth={1.75} />}>
                <TextInput value={form.sku} onChange={(v) => update("sku", v.toUpperCase())} placeholder="WB-B-001" hasError={!!visible("sku")} mono />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <Field label="الفئة" required error={visible("category")} icon={<Tags className="w-3.5 h-3.5" strokeWidth={1.75} />}>
                <Dropdown
                  value={form.category}
                  onChange={(v) => update("category", v)}
                  options={categories.map(c => ({ value: c, label: c }))}
                  placeholder="اختر فئة"
                  hasError={!!visible("category")}
                />
              </Field>
              <Field label="الوحدة" required icon={<Ruler className="w-3.5 h-3.5" strokeWidth={1.75} />}>
                <Dropdown
                  value={form.unit}
                  onChange={(v) => update("unit", v)}
                  options={UNITS.map(u => ({ value: u, label: u }))}
                  placeholder="اختر وحدة"
                />
              </Field>
            </div>
          </Section>

          {/* Stock settings */}
          <Section badge="2" label="إعدادات المخزون" required>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="الكمية الحالية" required error={visible("currentQty")}>
                <NumberInput value={form.currentQty} onChange={(v) => update("currentQty", v)} hasError={!!visible("currentQty")} />
              </Field>
              <Field label="الحد الأدنى" required error={visible("minQty")} hint="عند الوصول إليه يصبح المخزون منخفض">
                <NumberInput value={form.minQty} onChange={(v) => update("minQty", v)} hasError={!!visible("minQty")} />
              </Field>
              <Field label="السقف" required error={visible("maxQty")}>
                <NumberInput value={form.maxQty} onChange={(v) => update("maxQty", v)} hasError={!!visible("maxQty")} />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <Field label="الموقع في المخزن" icon={<MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />}>
                <TextInput value={form.location} onChange={(v) => update("location", v)} placeholder="ثلاجة 1 / تخزين بارد / إلخ" />
              </Field>
              <Field label="السعر للوحدة" icon={<Coins className="w-3.5 h-3.5" strokeWidth={1.75} />}>
                <div className="flex items-center gap-2">
                  <NumberInput value={form.pricePerUnit} onChange={(v) => update("pricePerUnit", v)} />
                  <span className="text-sm text-text-tertiary">ج.م</span>
                </div>
              </Field>
            </div>
          </Section>

          {/* Brand + expiry */}
          <Section badge="3" label="بيانات إضافية">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="البراند">
                <div className="inline-flex items-center h-11 p-0.5 rounded-sm bg-bg-muted border border-border-subtle flex-wrap">
                  {(["shared", "wahsh", "kababgy", "forno"] as BrandValue[]).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => update("brand", b)}
                      className={cn(
                        "h-10 px-3 rounded-[10px] text-xs font-medium tracking-tight transition-all duration-fast",
                        form.brand === b ? "bg-bg-surface text-text-primary shadow-xs" : "text-text-tertiary hover:text-text-secondary"
                      )}
                    >
                      {b === "shared" ? "مشترك" : brandMeta[b].name}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="تاريخ الصلاحية (اختياري)" icon={<CalendarDays className="w-3.5 h-3.5" strokeWidth={1.75} />}>
                <TextInput value={form.expiryDate} onChange={(v) => update("expiryDate", v)} placeholder="2026-12-31" />
              </Field>
            </div>
          </Section>
        </div>

        {/* Right rail — preview */}
        {isDesktop && (
          <aside className="space-y-3">
            <div className="sticky top-6 space-y-3">
              <Card padding="md">
                <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">معاينة المستوى</p>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-md flex items-center justify-center",
                    level === "good" ? "bg-status-success/12 text-status-success"
                    : level === "low" ? "bg-status-warning/12 text-status-warning"
                    : "bg-status-danger/12 text-status-danger"
                  )}>
                    <Package className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium tracking-tight truncate">
                      {form.name || "اسم الصنف"}
                    </p>
                    <p className="text-[11px] text-text-tertiary tabular truncate">
                      {form.sku || "—"}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-text-tertiary tracking-[0.14em] uppercase">المخزون</span>
                    <span className="text-sm tabular">
                      <span className={cn("font-bold", level === "good" ? "text-status-success" : level === "low" ? "text-status-warning" : "text-status-danger")}>
                        {form.currentQty}
                      </span>
                      <span className="text-text-tertiary"> / {form.maxQty || "—"}</span>
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-bg-muted overflow-hidden">
                    {form.maxQty > 0 && (
                      <>
                        <span aria-hidden className="absolute top-0 bottom-0 w-px bg-text-tertiary/40" style={{ right: `${(form.minQty / form.maxQty) * 100}%` }} />
                        <span
                          className={cn(
                            "absolute top-0 bottom-0 right-0 rounded-full transition-all duration-slow ease-out-expo",
                            level === "good" ? "bg-status-success/80" : level === "low" ? "bg-status-warning/80" : "bg-status-danger/80"
                          )}
                          style={{ width: `${Math.min(100, Math.max(2, (form.currentQty / form.maxQty) * 100))}%` }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </aside>
        )}
      </div>

      {isMobile && (
        <div className="fixed bottom-[80px] inset-x-3 z-20 flex items-center gap-2 p-2 rounded-md bg-bg-surface-raised border border-border-subtle shadow-lg">
          <Button variant="secondary" size="sm" fullWidth onClick={() => router.back()}>إلغاء</Button>
          <Button size="sm" fullWidth loading={submitting} onClick={handleSubmit} leadingIcon={<Save className="w-3.5 h-3.5" strokeWidth={2} />}>
            حفظ
          </Button>
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */

function Section({ badge, label, required, children }: { badge: string; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <Card padding="lg">
      <header className="flex items-center gap-3 mb-5">
        <span className="shrink-0 w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold tabular bg-brand-primary/15 text-brand-primary">{badge}</span>
        <h2 className="text-base font-medium tracking-tight">
          {label}
          {required && <span className="text-status-danger mr-1">*</span>}
        </h2>
      </header>
      {children}
    </Card>
  );
}

function Field({ label, required, error, hint, icon, children }: { label: string; required?: boolean; error?: string; hint?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-1.5 text-sm font-medium text-text-secondary tracking-tight">
        {icon && <span className="text-text-tertiary">{icon}</span>}
        {label}
        {required && <span className="text-status-danger">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-status-danger flex items-center gap-1.5 animate-slide-up">
          <AlertTriangle className="w-3 h-3" strokeWidth={2} />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-text-tertiary">{hint}</p>
      ) : null}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, hasError, mono }: { value: string; onChange: (v: string) => void; placeholder?: string; hasError?: boolean; mono?: boolean }) {
  return (
    <div className={cn(
      "flex items-center h-11 rounded-sm transition-all duration-fast ease-out-expo",
      "bg-bg-surface border border-border",
      "focus-within:border-border-focus focus-within:shadow-glow-brand",
      hasError && "border-status-danger focus-within:border-status-danger animate-shake"
    )}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("w-full h-full bg-transparent outline-none px-3.5 text-sm text-text-primary placeholder:text-text-tertiary", mono && "tabular")}
      />
    </div>
  );
}

function NumberInput({ value, onChange, hasError }: { value: number; onChange: (v: number) => void; hasError?: boolean }) {
  return (
    <div className={cn(
      "flex items-center h-11 rounded-sm transition-all duration-fast ease-out-expo",
      "bg-bg-surface border border-border",
      "focus-within:border-border-focus focus-within:shadow-glow-brand",
      hasError && "border-status-danger focus-within:border-status-danger"
    )}>
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        placeholder="0"
        className="w-full h-full bg-transparent outline-none px-3.5 text-sm text-text-primary placeholder:text-text-tertiary tabular"
      />
    </div>
  );
}

function DraftIndicator({ status, dirty }: { status: "idle" | "saving" | "saved"; dirty: boolean }) {
  return (
    <div className="flex items-center gap-1.5 mt-2 h-4">
      {status === "saving" && <><span className="w-1.5 h-1.5 rounded-full bg-status-warning animate-pulse-dot" /><span className="text-xs text-text-tertiary">يتم الحفظ...</span></>}
      {status === "saved" && <><CheckCircle2 className="w-3 h-3 text-status-success" strokeWidth={2.5} /><span className="text-xs text-status-success">حُفظت المسودة تلقائياً</span></>}
      {status === "idle" && dirty && <><span className="w-1.5 h-1.5 rounded-full bg-text-tertiary/40" /><span className="text-xs text-text-tertiary">مسودة غير محفوظة</span></>}
    </div>
  );
}
