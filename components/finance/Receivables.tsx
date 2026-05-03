"use client";

import Link from "next/link";
import { ArrowLeft, Download, AlertCircle, Mail } from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import {
  receivables,
  arAging,
  arTotal,
  arOverdue,
  type AgingBucket,
} from "@/lib/mock/finance";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DesktopOnlyNotice } from "./DesktopOnlyNotice";
import { cn } from "@/lib/utils";

const bucketMeta: Record<AgingBucket, { label: string; intent: "success" | "info" | "warning" | "danger" }> = {
  current: { label: "في الموعد", intent: "success" },
  "1-30": { label: "1-30 يوم", intent: "info" },
  "31-60": { label: "31-60 يوم", intent: "warning" },
  "61-90": { label: "61-90 يوم", intent: "warning" },
  "90+": { label: "+90 يوم", intent: "danger" },
};

const customerTypeLabel: Record<string, string> = {
  corporate: "عميل مؤسسي",
  catering: "كيترنج",
  "branch-transfer": "تسوية فرع",
  "credit-card-batch": "بطاقات ائتمان",
};

export function Receivables() {
  const device = useDevice();
  if (device !== "desktop") return <DesktopOnlyNotice moduleName="الذمم المدينة" />;

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
            Accounts Receivable · AR Aging
          </p>
          <h1 className="text-3xl font-bold tracking-tight">الذمم المدينة</h1>
          <p className="text-sm text-text-secondary mt-2 max-w-2xl">
            مستحقات على العملاء المؤسسيين، الكيترنج، والبنوك. التحليل العمري للفواتير غير المسددة.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md">
            <Mail className="w-4 h-4" strokeWidth={1.75} />
            إرسال تذكير دفعة
          </Button>
          <Button variant="secondary" size="md">
            <Download className="w-4 h-4" strokeWidth={1.75} />
            تصدير
          </Button>
        </div>
      </header>

      <div className="gold-hairline" />

      {/* Aging buckets */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {(Object.keys(arAging) as AgingBucket[]).map((b) => {
          const amount = arAging[b];
          const pct = (amount / arTotal) * 100;
          const meta = bucketMeta[b];
          return (
            <Card
              key={b}
              padding="md"
              className={cn(
                "min-w-0",
                b === "90+" && amount > 0 && "border-status-danger/40 bg-status-danger/6"
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase truncate">
                  {meta.label}
                </p>
                <Badge intent={meta.intent} size="sm">
                  {pct.toFixed(0)}%
                </Badge>
              </div>
              <p className="text-2xl font-bold tabular tracking-tight mb-1">
                {(amount / 1000).toFixed(0)}ك
                <span className="text-xs text-text-tertiary font-normal mr-1">ج.م</span>
              </p>
              <div className="h-1.5 rounded-full bg-bg-surface-raised overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    meta.intent === "success" && "bg-status-success",
                    meta.intent === "info" && "bg-status-info",
                    meta.intent === "warning" && "bg-status-warning",
                    meta.intent === "danger" && "bg-status-danger"
                  )}
                  style={{ width: `${Math.max(pct, 4)}%` }}
                />
              </div>
            </Card>
          );
        })}
      </section>

      {/* Overall summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card padding="md">
          <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-2">
            إجمالي الذمم المدينة
          </p>
          <p className="text-3xl font-bold tabular tracking-tight">
            {(arTotal / 1000).toFixed(0)}ك
            <span className="text-xs text-text-tertiary font-normal mr-1">ج.م</span>
          </p>
        </Card>
        <Card padding="md" className={cn(arOverdue > 0 && "border-status-warning/40 bg-status-warning/6")}>
          <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-2">
            متأخرات
          </p>
          <p className="text-3xl font-bold tabular tracking-tight text-status-warning">
            {(arOverdue / 1000).toFixed(0)}ك
            <span className="text-xs text-text-tertiary font-normal mr-1">ج.م</span>
          </p>
          <p className="text-[11px] text-text-tertiary mt-1">
            {((arOverdue / arTotal) * 100).toFixed(0)}% من الإجمالي
          </p>
        </Card>
        <Card padding="md">
          <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-2">
            متوسط أيام التحصيل (DSO)
          </p>
          <p className="text-3xl font-bold tabular tracking-tight">
            32 <span className="text-xs text-text-tertiary font-normal">يوم</span>
          </p>
          <p className="text-[11px] text-status-success mt-1 tabular">
            -3 يوم vs الشهر الماضي
          </p>
        </Card>
      </div>

      {/* Detail table */}
      <Card padding="none">
        <div className="px-6 pt-6 pb-4 border-b border-border-subtle">
          <h2 className="text-lg font-medium tracking-tight">الفواتير غير المسددة</h2>
          <p className="text-xs text-text-tertiary mt-0.5">{receivables.length} فاتورة</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-bg-surface-raised/40 border-b border-border-subtle">
            <tr className="text-right text-[11px] tracking-[0.16em] uppercase text-text-tertiary">
              <th className="px-6 py-3 font-medium">الفاتورة</th>
              <th className="px-3 py-3 font-medium">العميل</th>
              <th className="px-3 py-3 font-medium">النوع</th>
              <th className="px-3 py-3 font-medium">الاستحقاق</th>
              <th className="px-3 py-3 font-medium">العمر</th>
              <th className="px-3 py-3 font-medium text-left">المبلغ</th>
              <th className="px-6 py-3 font-medium text-left"></th>
            </tr>
          </thead>
          <tbody>
            {receivables.map((r) => {
              const meta = bucketMeta[r.bucket];
              return (
                <tr
                  key={r.id}
                  className="border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised/40 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <p className="text-sm font-medium tabular tracking-tight">{r.invoiceNumber}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="text-sm font-medium tracking-tight">{r.customer}</p>
                  </td>
                  <td className="px-3 py-3.5 text-xs text-text-secondary">
                    {customerTypeLabel[r.customerType]}
                  </td>
                  <td className="px-3 py-3.5 text-xs tabular text-text-secondary">
                    {r.dueDate}
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge intent={meta.intent} size="sm">
                      {r.daysOverdue > 0 ? `${r.daysOverdue} يوم` : meta.label}
                    </Badge>
                  </td>
                  <td className="px-3 py-3.5 text-left tabular tracking-tight font-medium">
                    {r.amount.toLocaleString("en-US")}
                    <span className="text-[10px] text-text-tertiary font-normal mr-1">ج.م</span>
                  </td>
                  <td className="px-6 py-3.5 text-left">
                    <Button variant="ghost" size="sm">
                      <Mail className="w-3 h-3" strokeWidth={1.75} />
                      تذكير
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
