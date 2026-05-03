"use client";

import Link from "next/link";
import { ArrowLeft, Download, Send, Calendar } from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import {
  payables,
  apAging,
  apTotal,
  apOverdue,
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

export function Payables() {
  const device = useDevice();
  if (device !== "desktop") return <DesktopOnlyNotice moduleName="الذمم الدائنة" />;

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
            Accounts Payable · AP Aging
          </p>
          <h1 className="text-3xl font-bold tracking-tight">الذمم الدائنة</h1>
          <p className="text-sm text-text-secondary mt-2 max-w-2xl">
            ما نحن مدينون به للموردين — مرتَّبًا حسب أعمار الفواتير وتاريخ الاستحقاق.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md">
            <Calendar className="w-4 h-4" strokeWidth={1.75} />
            جدولة الدفعات
          </Button>
          <Button size="md">
            <Send className="w-4 h-4" strokeWidth={1.75} />
            دفعة جديدة
          </Button>
        </div>
      </header>

      <div className="gold-hairline" />

      {/* Aging buckets */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {(Object.keys(apAging) as AgingBucket[]).map((b) => {
          const amount = apAging[b];
          const pct = apTotal > 0 ? (amount / apTotal) * 100 : 0;
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

      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card padding="md">
          <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-2">
            إجمالي الذمم الدائنة
          </p>
          <p className="text-3xl font-bold tabular tracking-tight">
            {(apTotal / 1000).toFixed(0)}ك
            <span className="text-xs text-text-tertiary font-normal mr-1">ج.م</span>
          </p>
        </Card>
        <Card padding="md" className={cn(apOverdue > 0 && "border-status-danger/40 bg-status-danger/6")}>
          <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-2">
            متأخر السداد
          </p>
          <p className="text-3xl font-bold tabular tracking-tight text-status-danger">
            {(apOverdue / 1000).toFixed(0)}ك
            <span className="text-xs text-text-tertiary font-normal mr-1">ج.م</span>
          </p>
          <p className="text-[11px] text-text-tertiary mt-1">
            خطر تجميد الموردين
          </p>
        </Card>
        <Card padding="md">
          <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-2">
            متوسط أيام السداد (DPO)
          </p>
          <p className="text-3xl font-bold tabular tracking-tight">
            28 <span className="text-xs text-text-tertiary font-normal">يوم</span>
          </p>
          <p className="text-[11px] text-status-success mt-1 tabular">
            داخل المتوسط الصناعي
          </p>
        </Card>
      </div>

      {/* Table */}
      <Card padding="none">
        <div className="px-6 pt-6 pb-4 border-b border-border-subtle">
          <h2 className="text-lg font-medium tracking-tight">الفواتير المُستحقة</h2>
          <p className="text-xs text-text-tertiary mt-0.5">{payables.length} فاتورة لـ {new Set(payables.map(p => p.supplierName)).size} مورد</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-bg-surface-raised/40 border-b border-border-subtle">
            <tr className="text-right text-[11px] tracking-[0.16em] uppercase text-text-tertiary">
              <th className="px-6 py-3 font-medium">PO</th>
              <th className="px-3 py-3 font-medium">المورد</th>
              <th className="px-3 py-3 font-medium">الاستحقاق</th>
              <th className="px-3 py-3 font-medium">العمر</th>
              <th className="px-3 py-3 font-medium text-left">المبلغ</th>
              <th className="px-6 py-3 font-medium text-left"></th>
            </tr>
          </thead>
          <tbody>
            {payables.map((p) => {
              const meta = bucketMeta[p.bucket];
              return (
                <tr
                  key={p.id}
                  className="border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised/40 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <p className="text-sm font-medium tabular tracking-tight">{p.poNumber}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="text-sm font-medium tracking-tight">{p.supplierName}</p>
                  </td>
                  <td className="px-3 py-3.5 text-xs tabular text-text-secondary">
                    {p.dueDate}
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge intent={meta.intent} size="sm">
                      {p.daysOverdue > 0 ? `${p.daysOverdue} يوم` : meta.label}
                    </Badge>
                  </td>
                  <td className="px-3 py-3.5 text-left tabular tracking-tight font-medium">
                    {p.amount.toLocaleString("en-US")}
                    <span className="text-[10px] text-text-tertiary font-normal mr-1">ج.م</span>
                  </td>
                  <td className="px-6 py-3.5 text-left">
                    <Button variant={p.daysOverdue > 0 ? "primary" : "ghost"} size="sm">
                      <Send className="w-3 h-3" strokeWidth={1.75} />
                      ادفع
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
