"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  X,
  ClipboardCheck,
  Save,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { branchStock, type StockItem } from "@/lib/mock/inventory";
import { categoryMeta, type Category } from "@/lib/mock/requests";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { cn } from "@/lib/utils";

type Phase = "intro" | "counting" | "review" | "done";

interface CountEntry {
  itemId: string;
  expected: number;
  counted: number | null;
  variance: number;
}

export function CountSession() {
  const device = useDevice();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("intro");
  const [scope, setScope] = useState<Category | "all">("all");
  const [entries, setEntries] = useState<Map<string, CountEntry>>(new Map());
  const [activeIdx, setActiveIdx] = useState(0);

  const items =
    scope === "all"
      ? branchStock
      : branchStock.filter((s) => s.catalog.category === scope);

  const initEntries = () => {
    const next = new Map<string, CountEntry>();
    items.forEach((s) => {
      next.set(s.id, {
        itemId: s.id,
        expected: s.currentQty,
        counted: null,
        variance: 0,
      });
    });
    setEntries(next);
    setActiveIdx(0);
    setPhase("counting");
  };

  const countedCount = Array.from(entries.values()).filter((e) => e.counted !== null).length;
  const varianceCount = Array.from(entries.values()).filter((e) => e.counted !== null && e.variance !== 0).length;
  const totalVariance = Array.from(entries.values()).reduce((sum, e) => sum + Math.abs(e.variance), 0);

  const setCount = (id: string, counted: number) => {
    setEntries((prev) => {
      const next = new Map(prev);
      const entry = next.get(id);
      if (entry) {
        next.set(id, {
          ...entry,
          counted,
          variance: counted - entry.expected,
        });
      }
      return next;
    });
  };

  const skip = () => {
    if (activeIdx < items.length - 1) setActiveIdx(activeIdx + 1);
    else setPhase("review");
  };

  const next = () => {
    if (activeIdx < items.length - 1) setActiveIdx(activeIdx + 1);
    else setPhase("review");
  };

  const submit = () => {
    setPhase("done");
    window.setTimeout(() => router.push("/inventory"), 1200);
  };

  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";

  const wrapperClass = cn(
    "mx-auto",
    isMobile ? "px-4 pt-4 pb-20 max-w-md" : isDesktop ? "px-8 py-7 max-w-[1100px]" : "px-6 py-6 max-w-[900px]"
  );

  return (
    <div className={wrapperClass}>
      <Link
        href="/inventory"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        المخزون
      </Link>

      {phase === "intro" && (
        <IntroPhase scope={scope} setScope={setScope} itemCount={items.length} onStart={initEntries} />
      )}

      {phase === "counting" && (
        <CountingPhase
          item={items[activeIdx]}
          entry={entries.get(items[activeIdx].id)}
          progress={{ current: activeIdx + 1, total: items.length, counted: countedCount }}
          onCount={(n) => setCount(items[activeIdx].id, n)}
          onNext={next}
          onSkip={skip}
          onFinish={() => setPhase("review")}
        />
      )}

      {phase === "review" && (
        <ReviewPhase
          entries={entries}
          totalItems={items.length}
          counted={countedCount}
          varianceCount={varianceCount}
          totalVariance={totalVariance}
          onSubmit={submit}
          onContinue={() => setPhase("counting")}
        />
      )}

      {phase === "done" && <DonePhase counted={countedCount} varianceCount={varianceCount} />}
    </div>
  );
}

/* ============ Intro ============ */

function IntroPhase({
  scope,
  setScope,
  itemCount,
  onStart,
}: {
  scope: Category | "all";
  setScope: (s: Category | "all") => void;
  itemCount: number;
  onStart: () => void;
}) {
  const categories: Array<Category | "all"> = ["all", "lhom", "dawajen", "albaan", "khodar", "dakik", "moshtaqat", "mashroob"];

  return (
    <div className="space-y-5">
      <header className="text-center max-w-lg mx-auto">
        <div className="w-14 h-14 mx-auto mb-4 rounded-md bg-brand-primary/12 text-brand-primary flex items-center justify-center">
          <ScanLine className="w-7 h-7" strokeWidth={1.5} />
        </div>
        <p className="text-xs text-text-tertiary tracking-[0.18em] uppercase mb-1">
          Cycle Count
        </p>
        <h1 className="text-2xl font-bold tracking-tight">جلسة جرد دوري</h1>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed">
          سنمر على كل صنف، تدخل الكمية الفعلية، ونقارن مع الكمية المُسجَّلة. أي فرق سيُسجَّل تلقائيًا في سجل التدقيق.
        </p>
      </header>

      <Card padding="lg">
        <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">
          نطاق الجرد
        </p>
        <div className="flex items-center gap-2 flex-wrap mb-5">
          {categories.map((c) => {
            const isAll = c === "all";
            const meta = !isAll ? categoryMeta[c] : null;
            const Icon = meta?.icon;
            const count = isAll
              ? branchStock.length
              : branchStock.filter((s) => s.catalog.category === c).length;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setScope(c)}
                className={cn(
                  "inline-flex items-center gap-1.5 h-8 px-3 rounded-full",
                  "text-xs font-medium tracking-tight transition-all border",
                  scope === c
                    ? "bg-brand-primary text-text-on-brand border-brand-primary"
                    : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong"
                )}
              >
                {Icon && <Icon className="w-3 h-3" strokeWidth={2} />}
                <span>{isAll ? "كل الفئات" : meta!.label}</span>
                <span className={cn("tabular text-[10px] font-bold", scope === c ? "opacity-90" : "text-text-tertiary")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-3 pt-5 border-t border-border-subtle">
          <Stat label="عدد الأصناف" value={`${itemCount}`} />
          <Stat label="الوقت المتوقع" value={`~${Math.round(itemCount * 0.4)} د`} />
          <Stat label="آخر جرد" value="منذ 3 أيام" />
        </div>
      </Card>

      <Button onClick={onStart} size="lg" fullWidth>
        ابدأ الجرد
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
      </Button>
    </div>
  );
}

/* ============ Counting ============ */

function CountingPhase({
  item,
  entry,
  progress,
  onCount,
  onNext,
  onSkip,
  onFinish,
}: {
  item: StockItem;
  entry: CountEntry | undefined;
  progress: { current: number; total: number; counted: number };
  onCount: (n: number) => void;
  onNext: () => void;
  onSkip: () => void;
  onFinish: () => void;
}) {
  const Icon = item.catalog.icon;
  const counted = entry?.counted ?? null;
  const variance = entry?.variance ?? 0;
  const hasVariance = counted !== null && variance !== 0;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-text-tertiary tabular">
          <span>
            {progress.current} من {progress.total}
          </span>
          <span>{Math.round((progress.counted / progress.total) * 100)}% منجز</span>
        </div>
        <div className="h-1.5 rounded-full bg-bg-surface-raised overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-primary transition-all"
            style={{ width: `${(progress.counted / progress.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Item card */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-14 h-14 rounded-md bg-brand-primary/12 text-brand-primary flex items-center justify-center shrink-0">
            <Icon className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-1">
              {item.catalog.sku}
            </p>
            <p className="text-base font-medium tracking-tight">{item.catalog.name}</p>
            <p className="text-xs text-text-tertiary mt-1">{item.location}</p>
          </div>
        </div>

        {/* Expected vs counted */}
        <div className="grid grid-cols-2 gap-3 mb-5 pt-4 border-t border-border-subtle">
          <div>
            <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-1">
              المُسجَّل في النظام
            </p>
            <p className="text-3xl font-bold tabular tracking-tight">
              {item.currentQty}
              <span className="text-xs text-text-tertiary font-normal mr-1">
                {item.catalog.unit}
              </span>
            </p>
          </div>
          <div>
            <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-1">
              العدد الفعلي
            </p>
            <p
              className={cn(
                "text-3xl font-bold tabular tracking-tight",
                hasVariance ? "text-status-warning" : counted !== null ? "text-status-success" : "text-text-tertiary"
              )}
            >
              {counted ?? "—"}
              {counted !== null && (
                <span className="text-xs text-text-tertiary font-normal mr-1">
                  {item.catalog.unit}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Variance badge */}
        {hasVariance && (
          <div className="mb-4 px-3 py-2 rounded-md bg-status-warning/8 border border-status-warning/30 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-status-warning shrink-0" strokeWidth={2} />
            <p className="text-xs font-medium text-status-warning tabular tracking-tight">
              فرق {variance > 0 ? "+" : ""}{variance} {item.catalog.unit}
            </p>
          </div>
        )}
        {counted !== null && !hasVariance && (
          <div className="mb-4 px-3 py-2 rounded-md bg-status-success/8 border border-status-success/30 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" strokeWidth={2} />
            <p className="text-xs font-medium text-status-success tracking-tight">
              مطابق تمامًا
            </p>
          </div>
        )}

        {/* Quantity entry */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-text-tertiary">أدخل العدد المعدود</p>
          <QuantityStepper
            value={counted ?? 0}
            onChange={onCount}
            unit={item.catalog.unit}
            size="lg"
            max={item.maxQty * 2}
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button variant="ghost" size="lg" onClick={onSkip}>
          تخطي
        </Button>
        <Button variant="secondary" size="lg" onClick={onFinish}>
          إنهاء
        </Button>
        <Button onClick={onNext} disabled={counted === null} size="lg">
          التالي
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}

/* ============ Review ============ */

function ReviewPhase({
  entries,
  totalItems,
  counted,
  varianceCount,
  totalVariance,
  onSubmit,
  onContinue,
}: {
  entries: Map<string, CountEntry>;
  totalItems: number;
  counted: number;
  varianceCount: number;
  totalVariance: number;
  onSubmit: () => void;
  onContinue: () => void;
}) {
  const variances = Array.from(entries.values()).filter(
    (e) => e.counted !== null && e.variance !== 0
  );

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs text-text-tertiary tracking-[0.18em] uppercase mb-1">
          مراجعة الجرد
        </p>
        <h1 className="text-2xl font-bold tracking-tight">ملخص الجلسة</h1>
        <p className="text-sm text-text-secondary mt-1">
          راجع الفروقات قبل الحفظ — أي تعديل سيُسجَّل في سجل التدقيق
        </p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <KpiBig label="مفحوص" value={`${counted}/${totalItems}`} accent="info" />
        <KpiBig label="فروقات" value={`${varianceCount}`} accent={varianceCount > 0 ? "warning" : "success"} />
        <KpiBig
          label="إجمالي الانحراف"
          value={totalVariance > 0 ? `${totalVariance}` : "0"}
          accent={totalVariance > 0 ? "warning" : "success"}
        />
      </div>

      {variances.length > 0 ? (
        <Card padding="none">
          <div className="px-5 pt-5 pb-3 border-b border-border-subtle">
            <h2 className="text-base font-medium tracking-tight">الفروقات المُكتشَفة</h2>
            <p className="text-xs text-text-tertiary mt-0.5">
              {variances.length} صنف به انحراف
            </p>
          </div>
          <ul>
            {variances.map((entry) => {
              const item = branchStock.find((s) => s.id === entry.itemId);
              if (!item) return null;
              const Icon = item.catalog.icon;
              return (
                <li
                  key={entry.itemId}
                  className="flex items-center gap-3 px-5 py-3 border-b border-border-subtle last:border-0"
                >
                  <div className="w-9 h-9 rounded-md bg-status-warning/15 text-status-warning flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium tracking-tight truncate">
                      {item.catalog.name}
                    </p>
                    <p className="text-[11px] text-text-tertiary tabular">
                      المُسجَّل: {entry.expected} → الفعلي: {entry.counted}
                    </p>
                  </div>
                  <Badge intent="warning" size="md">
                    {entry.variance > 0 ? "+" : ""}{entry.variance} {item.catalog.unit}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : (
        <Card padding="lg" className="bg-status-success/8 border-status-success/30 text-center py-10">
          <CheckCircle2 className="w-12 h-12 mx-auto text-status-success mb-3" strokeWidth={1.75} />
          <p className="text-base font-medium tracking-tight">جرد مثالي — صفر انحراف</p>
          <p className="text-sm text-text-secondary mt-1">
            كل الأصناف مطابقة بين النظام والمخزن
          </p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        {counted < totalItems && (
          <Button variant="secondary" size="lg" onClick={onContinue}>
            تابع باقي الأصناف ({totalItems - counted})
          </Button>
        )}
        <Button onClick={onSubmit} size="lg" className={cn(counted >= totalItems && "col-span-2")}>
          <Save className="w-4 h-4" strokeWidth={2} />
          احفظ التعديلات
        </Button>
      </div>
    </div>
  );
}

/* ============ Done ============ */

function DonePhase({
  counted,
  varianceCount,
}: {
  counted: number;
  varianceCount: number;
}) {
  return (
    <Card padding="lg" className="text-center bg-status-success/8 border-status-success/30 py-10">
      <div className="relative inline-block mb-4">
        <div
          aria-hidden
          className="absolute inset-[-16px] rounded-full border border-status-success/30 animate-pulse-dot"
        />
        <div className="relative w-20 h-20 rounded-full bg-status-success text-white flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
        </div>
      </div>
      <p className="text-xl font-bold tracking-tight mb-1">تم حفظ الجرد</p>
      <p className="text-sm text-text-secondary">
        {counted} صنف مُحدَّث · {varianceCount} انحراف مُسجَّل في سجل التدقيق
      </p>
    </Card>
  );
}

/* helpers */

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-1">
        {label}
      </p>
      <p className="text-base font-bold tabular tracking-tight">{value}</p>
    </div>
  );
}

function KpiBig({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "info" | "warning" | "success";
}) {
  const tone =
    accent === "info"
      ? "text-status-info"
      : accent === "warning"
      ? "text-status-warning"
      : "text-status-success";
  return (
    <Card padding="md" className="text-center">
      <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-1.5">
        {label}
      </p>
      <p className={cn("text-2xl font-bold tabular tracking-tight", tone)}>{value}</p>
    </Card>
  );
}
