"use client";

import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Scale,
  TrendingUp,
  Building2,
  Calculator,
  Clock,
  Receipt,
  Users,
  Download,
  ChevronLeft,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { reports } from "@/lib/mock/finance";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DesktopOnlyNotice } from "./DesktopOnlyNotice";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Scale,
  TrendingUp,
  Building2,
  Calculator,
  Clock,
  Receipt,
  Users,
};

const categoryMeta: Record<string, { label: string; intent: "brand" | "info" | "success" | "warning" | "neutral" }> = {
  financial: { label: "تقارير مالية", intent: "brand" },
  operations: { label: "تشغيلية", intent: "info" },
  "ar-ap": { label: "ذمم", intent: "warning" },
  tax: { label: "ضريبية", intent: "success" },
  hr: { label: "موارد بشرية", intent: "neutral" },
};

export function FinanceReports() {
  const device = useDevice();
  if (device !== "desktop") return <DesktopOnlyNotice moduleName="مكتبة التقارير" />;

  const grouped = reports.reduce((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {} as Record<string, typeof reports>);

  return (
    <div className="px-8 py-7 max-w-[1600px] mx-auto space-y-6">
      <Link
        href="/finance"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        المالية
      </Link>

      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-text-tertiary tracking-[0.18em] uppercase mb-2">
            Reports Library · مكتبة التقارير
          </p>
          <h1 className="text-3xl font-bold tracking-tight">التقارير</h1>
          <p className="text-sm text-text-secondary mt-2 max-w-2xl">
            تقارير مالية وتشغيلية مُحدَّثة تلقائيًا — جاهزة للتصدير بصيغ Excel و PDF و CSV. إقرارات ضريبية متوافقة مع ETA.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="md">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            تقرير مخصَّص
          </Button>
        </div>
      </header>

      <div className="gold-hairline" />

      {/* Quick filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mr-2">
          الفئات:
        </span>
        {Object.entries(categoryMeta).map(([k, meta]) => (
          <Badge key={k} intent={meta.intent} size="md">
            {meta.label} · {grouped[k]?.length ?? 0}
          </Badge>
        ))}
      </div>

      {/* Reports grid grouped by category */}
      {Object.entries(grouped).map(([category, items]) => {
        const meta = categoryMeta[category];
        return (
          <section key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium tracking-tight">{meta.label}</h2>
              <span className="text-xs text-text-tertiary tabular">({items.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((r) => {
                const Icon = iconMap[r.icon] ?? FileText;
                return (
                  <Card
                    key={r.id}
                    padding="md"
                    className="group transition-all duration-fast hover:border-border-strong hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="shrink-0 w-10 h-10 rounded-md bg-brand-primary/12 text-brand-primary flex items-center justify-center">
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium tracking-tight leading-tight line-clamp-2 mb-1">
                          {r.title}
                        </p>
                        <p className="text-[10px] text-text-tertiary tracking-[0.14em] uppercase truncate">
                          {r.titleEn}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 min-h-[32px] mb-3">
                      {r.description}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-border-subtle">
                      <span className="text-[11px] text-text-tertiary tracking-tight truncate">
                        تم توليده {r.lastGenerated}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          className="p-1.5 rounded text-text-tertiary hover:text-brand-primary hover:bg-bg-surface-raised transition-colors"
                          aria-label="تحميل"
                        >
                          <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                        </button>
                        <ChevronLeft className="w-3.5 h-3.5 text-text-tertiary group-hover:text-brand-primary transition-colors" strokeWidth={2} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
