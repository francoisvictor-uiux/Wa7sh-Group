"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Star,
  Upload,
  Phone,
  User,
  Building2,
  MapPin,
  Mail,
  AlertTriangle,
  Check,
  CheckCircle2,
  FileText,
  Trash2,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import {
  getSupplier,
  suppliers,
  categoryMeta,
  type SupplierCategory,
  type SupplierStatus,
} from "@/lib/mock/suppliers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToastContext } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES: SupplierCategory[] = [
  "meat", "produce", "dairy", "dry-goods", "beverages", "packaging",
];

interface FormState {
  name: string;
  nameEn: string;
  phone: string;
  phoneSecondary: string;
  contact: string;
  email: string;
  address: string;
  city: string;
  taxId: string;
  categories: SupplierCategory[];
  notes: string;
  status: SupplierStatus;
  rating: number;
  attachments: { id: string; name: string; size: string }[];
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

function emptyState(): FormState {
  return {
    name: "",
    nameEn: "",
    phone: "",
    phoneSecondary: "",
    contact: "",
    email: "",
    address: "",
    city: "القاهرة",
    taxId: "",
    categories: [],
    notes: "",
    status: "active",
    rating: 0,
    attachments: [],
  };
}

export function SupplierForm({ supplierId }: { supplierId?: string }) {
  const router = useRouter();
  const device = useDevice();
  const toast = useToastContext();
  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";
  const isEdit = !!supplierId;

  const initial = useMemo<FormState>(() => {
    if (!isEdit) return emptyState();
    const s = getSupplier(supplierId!);
    if (!s) return emptyState();
    return {
      name: s.name,
      nameEn: s.nameEn,
      phone: s.phone,
      phoneSecondary: s.phoneSecondary ?? "",
      contact: s.contact,
      email: s.email,
      address: s.address ?? "",
      city: s.city,
      taxId: s.taxId,
      categories: [...s.categories],
      notes: s.notes ?? "",
      status: s.status,
      rating: s.rating,
      attachments: s.attachments.map(a => ({ id: a.id, name: a.name, size: a.size })),
    };
  }, [isEdit, supplierId]);

  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Set<keyof FormState>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">("idle");
  const lastSavedRef = useRef<string>(JSON.stringify(initial));

  const dirty = JSON.stringify(form) !== lastSavedRef.current;

  /* ---------- duplicate detection ---------- */
  const possibleDuplicate = useMemo(() => {
    if (!form.name.trim() || form.name.trim().length < 3) return null;
    const lower = form.name.trim().toLowerCase();
    return suppliers.find((s) => s.id !== supplierId && s.name.toLowerCase().includes(lower));
  }, [form.name, supplierId]);

  /* ---------- validation ---------- */
  function validate(state: FormState): FieldErrors {
    const out: FieldErrors = {};
    if (!state.name.trim()) out.name = "اسم المورد مطلوب";
    else if (state.name.trim().length < 2) out.name = "الاسم قصير جداً";

    if (!state.phone.trim()) out.phone = "رقم الهاتف مطلوب";
    else if (!/^[0-9+\-\s]{8,}$/.test(state.phone.trim())) out.phone = "صيغة الرقم غير صحيحة";

    if (state.phoneSecondary && !/^[0-9+\-\s]{8,}$/.test(state.phoneSecondary.trim()))
      out.phoneSecondary = "صيغة الرقم غير صحيحة";

    if (state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim()))
      out.email = "صيغة البريد الإلكتروني غير صحيحة";

    if (state.categories.length === 0) out.categories = "اختر فئة واحدة على الأقل";

    return out;
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setTouched((t) => {
      if (t.has(key)) return t;
      const next = new Set(t);
      next.add(key);
      return next;
    });
  }

  useEffect(() => {
    setErrors(validate(form));
  }, [form]);

  /* ---------- autosave (debounced) ---------- */
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

  /* ---------- submit ---------- */
  async function handleSubmit() {
    const errs = validate(form);
    setErrors(errs);
    setTouched(new Set(Object.keys(form) as (keyof FormState)[]));
    if (Object.keys(errs).length > 0) {
      toast.error("لم يكتمل النموذج", "أكمل الحقول المطلوبة قبل الحفظ");
      const firstErr = document.querySelector("[data-has-error='true']");
      firstErr?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast.success(isEdit ? "تم حفظ التغييرات" : "تم إضافة المورد بنجاح", form.name);
    setTimeout(() => router.push("/suppliers"), 250);
  }

  function visibleError(key: keyof FormState): string | undefined {
    if (!touched.has(key)) return undefined;
    return errors[key];
  }

  const sections: { id: string; label: string; sub: string }[] = [
    { id: "basic", label: "بيانات أساسية", sub: "الاسم، الهاتف، جهة الاتصال" },
    { id: "categories", label: "الفئات", sub: "ما يوفّره هذا المورد" },
    { id: "additional", label: "بيانات إضافية", sub: "ملاحظات ومرفقات" },
    { id: "system", label: "الإعدادات", sub: "الحالة والتقييم الأولي" },
  ];

  return (
    <div
      className={cn(
        "mx-auto",
        isMobile ? "px-4 pt-4 pb-24 space-y-4" : isDesktop ? "px-8 py-7 max-w-[1280px] space-y-6" : "px-6 py-6 max-w-[1100px] space-y-5"
      )}
    >
      {/* Breadcrumb */}
      <Link
        href={isEdit ? `/suppliers/${supplierId}` : "/suppliers"}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        {isEdit ? "العودة للمورد" : "كل الموردين"}
      </Link>

      {/* Header */}
      <header className="flex items-end gap-4 flex-wrap justify-between">
        <div>
          <p className="text-text-tertiary tracking-[0.18em] uppercase mb-1 text-xs">
            {isEdit ? "Edit Supplier" : "New Supplier"}
          </p>
          <h1 className={cn("font-bold tracking-tight", isDesktop ? "text-3xl" : isMobile ? "text-xl" : "text-2xl")}>
            {isEdit ? "تعديل بيانات المورد" : "إضافة مورد جديد"}
          </h1>
          <DraftIndicator status={draftStatus} dirty={dirty} />
        </div>
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={() => router.back()}>
              إلغاء
            </Button>
            <Button
              size="md"
              loading={submitting}
              onClick={handleSubmit}
              leadingIcon={<Save className="w-4 h-4" strokeWidth={2} />}
            >
              {isEdit ? "حفظ التغييرات" : "حفظ المورد"}
            </Button>
          </div>
        )}
      </header>

      {/* Body grid */}
      <div className={cn("grid gap-5", isDesktop ? "grid-cols-[1fr_280px]" : "grid-cols-1")}>
        {/* Form column */}
        <div className="space-y-5 min-w-0">

          {/* SECTION 1 — BASIC */}
          <Section id="basic" label="بيانات أساسية" badge="1" required>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="اسم المورد (عربي)"
                required
                error={visibleError("name")}
                hint="مثال: شركة برايم للحوم"
              >
                <TextInput
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  placeholder="اكتب اسم المورد..."
                  hasError={!!visibleError("name")}
                />
              </Field>
              <Field
                label="الاسم بالإنجليزية"
                hint="يظهر في المستندات والفواتير"
              >
                <TextInput
                  value={form.nameEn}
                  onChange={(v) => update("nameEn", v)}
                  placeholder="Prime Meat Company"
                />
              </Field>
            </div>

            {possibleDuplicate && form.name.trim().length >= 3 && (
              <div className="flex items-start gap-2 mt-3 px-3 py-2.5 rounded-sm bg-status-warning/[0.08] border border-status-warning/30 text-xs text-text-secondary animate-slide-up">
                <AlertTriangle className="w-3.5 h-3.5 text-status-warning shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-medium text-status-warning">قد يكون مكررًا — يوجد مورد مشابه</p>
                  <p className="mt-0.5">
                    <Link href={`/suppliers/${possibleDuplicate.id}`} className="text-text-primary hover:text-brand-primary transition-colors underline-offset-4 hover:underline">
                      {possibleDuplicate.name}
                    </Link>
                    {" "}— تأكد من البيانات قبل المتابعة.
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <Field
                label="رقم الهاتف الأساسي"
                required
                error={visibleError("phone")}
                icon={<Phone className="w-3.5 h-3.5" strokeWidth={1.75} />}
              >
                <TextInput
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                  placeholder="01234567890"
                  hasError={!!visibleError("phone")}
                  inputMode="tel"
                  mono
                />
              </Field>
              <Field
                label="رقم هاتف ثانوي (اختياري)"
                error={visibleError("phoneSecondary")}
                icon={<Phone className="w-3.5 h-3.5" strokeWidth={1.75} />}
              >
                <TextInput
                  value={form.phoneSecondary}
                  onChange={(v) => update("phoneSecondary", v)}
                  placeholder="—"
                  hasError={!!visibleError("phoneSecondary")}
                  inputMode="tel"
                  mono
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <Field
                label="جهة الاتصال"
                icon={<User className="w-3.5 h-3.5" strokeWidth={1.75} />}
              >
                <TextInput
                  value={form.contact}
                  onChange={(v) => update("contact", v)}
                  placeholder="اسم المسؤول"
                />
              </Field>
              <Field
                label="بريد إلكتروني"
                error={visibleError("email")}
                icon={<Mail className="w-3.5 h-3.5" strokeWidth={1.75} />}
              >
                <TextInput
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  placeholder="orders@example.eg"
                  hasError={!!visibleError("email")}
                  inputMode="email"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <Field
                label="المدينة"
                icon={<MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />}
              >
                <TextInput
                  value={form.city}
                  onChange={(v) => update("city", v)}
                  placeholder="القاهرة"
                />
              </Field>
              <Field
                label="رقم ضريبي"
                icon={<Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />}
              >
                <TextInput
                  value={form.taxId}
                  onChange={(v) => update("taxId", v)}
                  placeholder="000-000-000"
                  mono
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="العنوان">
                <TextInput
                  value={form.address}
                  onChange={(v) => update("address", v)}
                  placeholder="الشارع، الحي، المدينة"
                />
              </Field>
            </div>
          </Section>

          {/* SECTION 2 — CATEGORIES */}
          <Section id="categories" label="الفئات الموردة" badge="2" required>
            <p className="text-sm text-text-tertiary mb-4">
              اختر كل الفئات التي يوفّرها هذا المورد. يظهر اللون في القوائم والبطاقات للتمييز السريع.
            </p>
            <div
              data-has-error={!!visibleError("categories")}
              className="flex items-center gap-2 flex-wrap"
            >
              {ALL_CATEGORIES.map((c) => {
                const active = form.categories.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      const next = active
                        ? form.categories.filter((x) => x !== c)
                        : [...form.categories, c];
                      update("categories", next);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-medium tracking-tight border",
                      "transition-all duration-fast ease-out-expo active:scale-[1.05]",
                      active
                        ? "bg-brand-primary text-text-on-brand border-brand-primary"
                        : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary"
                    )}
                  >
                    {active && <Check className="w-3 h-3" strokeWidth={2.5} />}
                    {categoryMeta[c].label}
                  </button>
                );
              })}
            </div>
            {visibleError("categories") && (
              <p className="text-xs text-status-danger mt-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                {visibleError("categories")}
              </p>
            )}
          </Section>

          {/* SECTION 3 — ADDITIONAL */}
          <Section id="additional" label="بيانات إضافية" badge="3">
            <Field label="ملاحظات داخلية" hint="ملاحظات للفريق عن طريقة التعامل مع هذا المورد، المعرفة الضمنية، مخاطر، إلخ.">
              <Textarea
                value={form.notes}
                onChange={(v) => update("notes", v)}
                placeholder="اكتب ملاحظات تساعد الفريق..."
                rows={4}
              />
            </Field>

            <div className="mt-5">
              <p className="text-sm font-medium text-text-secondary tracking-tight mb-2.5">
                المرفقات
                <span className="text-text-tertiary font-normal mr-2">(عقود، شهادات، مستندات)</span>
              </p>
              <DropZone
                onAdd={(name) => update("attachments", [...form.attachments, { id: `att-${Date.now()}`, name, size: "—" }])}
              />
              {form.attachments.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {form.attachments.map((att) => (
                    <li
                      key={att.id}
                      className="flex items-center gap-3 px-3 h-11 rounded-sm border border-border-subtle bg-bg-surface group"
                    >
                      <FileText className="w-4 h-4 text-text-tertiary shrink-0" strokeWidth={1.75} />
                      <span className="text-sm tabular truncate flex-1">{att.name}</span>
                      <span className="text-[10px] text-text-tertiary tabular shrink-0">{att.size}</span>
                      <button
                        type="button"
                        onClick={() => update("attachments", form.attachments.filter(a => a.id !== att.id))}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast text-text-tertiary hover:text-status-danger"
                        aria-label="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Section>

          {/* SECTION 4 — SYSTEM */}
          <Section id="system" label="إعدادات النظام" badge="4">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-text-secondary tracking-tight mb-2.5">
                  الحالة
                </p>
                <div className="inline-flex items-center h-11 p-0.5 rounded-sm bg-bg-muted border border-border-subtle">
                  {[
                    { v: "active" as const, label: "نشط" },
                    { v: "preferred" as const, label: "مفضّل" },
                    { v: "review" as const, label: "تحت المراجعة" },
                    { v: "blocked" as const, label: "محظور" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => update("status", opt.v)}
                      className={cn(
                        "h-10 px-4 rounded-[10px] text-xs font-medium tracking-tight transition-all duration-fast",
                        form.status === opt.v
                          ? "bg-bg-surface text-text-primary shadow-xs"
                          : "text-text-tertiary hover:text-text-secondary"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary tracking-tight mb-2.5">
                  التقييم الأولي
                  <span className="text-text-tertiary font-normal mr-2 text-xs">(يتم احتسابه آلياً مع أول طلبات)</span>
                </p>
                <RatingInput value={form.rating} onChange={(v) => update("rating", v)} />
              </div>
            </div>
          </Section>
        </div>

        {/* Sticky right rail — TOC */}
        {isDesktop && (
          <aside className="space-y-3">
            <div className="sticky top-6">
              <Card padding="md">
                <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">في هذا النموذج</p>
                <ol className="space-y-1">
                  {sections.map((sec, i) => (
                    <li key={sec.id}>
                      <a
                        href={`#${sec.id}`}
                        className="flex items-start gap-3 px-2 py-2 -mx-2 rounded-sm hover:bg-bg-surface-raised/60 transition-colors duration-fast"
                      >
                        <span className="shrink-0 w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] font-bold tabular bg-bg-surface-raised text-text-secondary">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium tracking-tight leading-tight">{sec.label}</p>
                          <p className="text-[10px] text-text-tertiary mt-0.5 leading-snug">{sec.sub}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ol>
              </Card>
            </div>
          </aside>
        )}
      </div>

      {/* Mobile sticky save bar */}
      {isMobile && (
        <div className="fixed bottom-[80px] inset-x-3 z-20 flex items-center gap-2 p-2 rounded-md bg-bg-surface-raised border border-border-subtle shadow-lg">
          <Button variant="secondary" size="sm" fullWidth onClick={() => router.back()}>إلغاء</Button>
          <Button size="sm" fullWidth loading={submitting} onClick={handleSubmit} leadingIcon={<Save className="w-3.5 h-3.5" strokeWidth={2} />}>
            {isEdit ? "حفظ" : "إضافة"}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ======================================================================
 * Section
 * ==================================================================== */

function Section({
  id, label, badge, required, children,
}: {
  id: string;
  label: string;
  badge: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card padding="lg" id={id} className="scroll-mt-6">
      <header className="flex items-center gap-3 mb-5">
        <span className="shrink-0 w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold tabular bg-brand-primary/15 text-brand-primary">
          {badge}
        </span>
        <h2 className="text-base font-medium tracking-tight">
          {label}
          {required && <span className="text-status-danger mr-1">*</span>}
        </h2>
      </header>
      {children}
    </Card>
  );
}

/* ======================================================================
 * Field — wraps an input with label, hint, error
 * ==================================================================== */

function Field({
  label, required, error, hint, icon, children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2" data-has-error={!!error}>
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

/* ======================================================================
 * TextInput / Textarea
 * ==================================================================== */

function TextInput({
  value, onChange, placeholder, hasError, inputMode, mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hasError?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  mono?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center h-11 rounded-sm transition-all duration-fast ease-out-expo",
        "bg-bg-surface border border-border",
        "focus-within:border-border-focus focus-within:shadow-glow-brand",
        hasError && "border-status-danger focus-within:border-status-danger animate-shake"
      )}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className={cn(
          "w-full h-full bg-transparent outline-none px-3.5",
          "text-sm text-text-primary placeholder:text-text-tertiary",
          mono && "tabular"
        )}
      />
    </div>
  );
}

function Textarea({
  value, onChange, placeholder, rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div
      className={cn(
        "rounded-sm transition-all duration-fast ease-out-expo",
        "bg-bg-surface border border-border",
        "focus-within:border-border-focus focus-within:shadow-glow-brand"
      )}
    >
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none px-3.5 py-3 text-sm text-text-primary placeholder:text-text-tertiary resize-y min-h-[88px]"
      />
    </div>
  );
}

/* ======================================================================
 * Drop zone — fake file upload (stores name in form state)
 * ==================================================================== */

function DropZone({ onAdd }: { onAdd: (name: string) => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={() => onAdd(`Document-${Date.now().toString().slice(-4)}.pdf`)}
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        for (const f of Array.from(e.dataTransfer?.files ?? [])) onAdd(f.name);
      }}
      className={cn(
        "w-full flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-md border border-dashed",
        "transition-all duration-fast",
        hover
          ? "border-brand-primary bg-brand-primary/[0.06]"
          : "border-border bg-bg-muted/40 hover:border-border-strong"
      )}
    >
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-bg-surface border border-border-subtle">
        <Upload className="w-4 h-4 text-text-tertiary" strokeWidth={1.75} />
      </span>
      <p className="text-sm font-medium text-text-secondary tracking-tight">
        اسحب الملفات هنا أو <span className="text-brand-primary">اختر من جهازك</span>
      </p>
      <p className="text-xs text-text-tertiary">PDF, JPG, PNG · حتى 10 ميجا</p>
    </button>
  );
}

/* ======================================================================
 * Rating input (5 stars)
 * ==================================================================== */

function RatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onChange(n === value ? 0 : n)}
          className={cn(
            "p-1 rounded-sm transition-all duration-fast active:scale-[1.1]",
            "hover:bg-bg-surface-raised"
          )}
          aria-label={`${n} نجوم`}
        >
          <Star
            className={cn(
              "w-5 h-5 transition-colors duration-fast",
              n <= display ? "text-brand-primary fill-brand-primary" : "text-text-tertiary/40"
            )}
            strokeWidth={1.5}
          />
        </button>
      ))}
      <span className="text-xs text-text-tertiary tabular ms-2">
        {value > 0 ? `${value.toFixed(1)} / 5` : "—"}
      </span>
    </div>
  );
}

/* ======================================================================
 * Draft indicator (auto-save status)
 * ==================================================================== */

function DraftIndicator({ status, dirty }: { status: "idle" | "saving" | "saved"; dirty: boolean }) {
  return (
    <div className="flex items-center gap-1.5 mt-2 h-4">
      {status === "saving" && (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-status-warning animate-pulse-dot" />
          <span className="text-xs text-text-tertiary">يتم الحفظ...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <CheckCircle2 className="w-3 h-3 text-status-success" strokeWidth={2.5} />
          <span className="text-xs text-status-success">حُفظت المسودة تلقائياً</span>
        </>
      )}
      {status === "idle" && dirty && (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary/40" />
          <span className="text-xs text-text-tertiary">مسودة غير محفوظة</span>
        </>
      )}
    </div>
  );
}
