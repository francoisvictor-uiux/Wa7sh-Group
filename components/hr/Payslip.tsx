"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Share2,
  CheckCircle2,
  TrendingUp,
  Minus,
  Plus,
  Calendar,
  Clock,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { currentPayslip, myEmployee } from "@/lib/mock/hr";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Payslip() {
  const device = useDevice();
  const isMobile = device === "mobile";

  const grossPay =
    currentPayslip.base + currentPayslip.overtime + currentPayslip.bonus;
  const totalDeductions =
    currentPayslip.deductions.socialInsurance +
    currentPayslip.deductions.incomeTax +
    currentPayslip.deductions.other;

  return (
    <div
      className={cn(
        "mx-auto",
        isMobile ? "px-4 pt-4 pb-20 max-w-md space-y-4" : "px-6 py-7 max-w-3xl space-y-5"
      )}
    >
      <Link
        href="/hr"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        الموارد البشرية
      </Link>

      <header>
        <p className="text-[10px] text-text-tertiary tracking-[0.18em] uppercase mb-1">
          Payslip
        </p>
        <h1 className={cn("font-bold tracking-tight", isMobile ? "text-xl" : "text-2xl")}>
          قسيمة الراتب
        </h1>
        <p className="text-xs text-text-tertiary mt-1">
          {currentPayslip.month} · {currentPayslip.monthEn}
        </p>
      </header>

      {/* Status banner */}
      {currentPayslip.status === "paid" && (
        <Card padding="md" className="bg-status-success/8 border-status-success/30">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium tracking-tight">تم صرف الراتب</p>
              <p className="text-xs text-text-secondary mt-0.5">
                صُرف في {currentPayslip.paidOn} · في حسابك البنكي
              </p>
            </div>
            <Badge intent="success" size="sm">
              مدفوع
            </Badge>
          </div>
        </Card>
      )}

      {/* Net pay hero */}
      <Card padding="lg" className="text-center">
        <p className="text-[11px] tracking-[0.18em] uppercase text-text-tertiary mb-2">
          صافي الراتب
        </p>
        <p className="text-5xl font-bold tabular tracking-tight">
          {currentPayslip.netPay.toLocaleString("en-US")}
          <span className="text-base text-text-tertiary font-medium mr-2">ج.م</span>
        </p>
        <p className="text-xs text-text-tertiary mt-3">
          {myEmployee.name} · {myEmployee.role}
        </p>

        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border-subtle">
          <Stat label="أيام العمل" value={`${currentPayslip.workedDays}`} unit="يوم" />
          <Stat
            label="ساعات إضافية"
            value={`${currentPayslip.overtimeHours}`}
            unit="ساعة"
            accent="brand"
          />
          <Stat label="إجازات" value={`${currentPayslip.leavesTaken}`} unit="يوم" />
        </div>
      </Card>

      {/* Breakdown */}
      <Card padding="none">
        <div className="px-5 pt-5 pb-3 border-b border-border-subtle">
          <h2 className="text-base font-medium tracking-tight">تفصيل الراتب</h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            كل البنود التي تكوّن الصافي
          </p>
        </div>

        <ul>
          {/* Earnings */}
          <SectionLabel>المضاف</SectionLabel>
          <Row label="الراتب الأساسي" amount={currentPayslip.base} type="add" />
          {currentPayslip.overtime > 0 && (
            <Row label="ساعات إضافية" amount={currentPayslip.overtime} type="add" subLabel={`${currentPayslip.overtimeHours} ساعة × معدل الإضافي`} />
          )}
          {currentPayslip.bonus > 0 && (
            <Row label="حافز شهري" amount={currentPayslip.bonus} type="add" subLabel="مكافأة الأداء" />
          )}
          <Row label="إجمالي الدخل" amount={grossPay} type="total" />

          {/* Deductions */}
          <SectionLabel>الخصومات</SectionLabel>
          <Row label="التأمينات الاجتماعية" amount={currentPayslip.deductions.socialInsurance} type="deduct" />
          <Row label="ضريبة الدخل" amount={currentPayslip.deductions.incomeTax} type="deduct" />
          {currentPayslip.deductions.other > 0 && (
            <Row label="خصومات أخرى" amount={currentPayslip.deductions.other} type="deduct" />
          )}
          <Row label="إجمالي الخصومات" amount={totalDeductions} type="total" />

          {/* Net */}
          <li className="px-5 py-4 bg-brand-primary/8 border-t border-border">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-bold tracking-tight">صافي الراتب</p>
              <p className="text-2xl font-bold tabular tracking-tight text-brand-primary">
                {currentPayslip.netPay.toLocaleString("en-US")}
                <span className="text-xs text-text-tertiary font-normal mr-1">ج.م</span>
              </p>
            </div>
          </li>
        </ul>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" size="md" fullWidth>
          <Download className="w-4 h-4" strokeWidth={1.75} />
          تحميل PDF
        </Button>
        <Button variant="ghost" size="md" fullWidth>
          <Share2 className="w-4 h-4" strokeWidth={1.75} />
          مشاركة
        </Button>
      </div>

      <p className="text-[10px] text-text-tertiary text-center leading-relaxed pt-2">
        قسيمة الراتب رسمية · مُعتمدة من إدارة الموارد البشرية لمجموعة الوحش الغذائية
      </p>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <li className="px-5 py-2 bg-bg-surface-raised/40 border-b border-border-subtle">
      <p className="text-[10px] tracking-[0.18em] uppercase text-text-tertiary font-medium">
        {children}
      </p>
    </li>
  );
}

function Row({
  label,
  amount,
  type,
  subLabel,
}: {
  label: string;
  amount: number;
  type: "add" | "deduct" | "total";
  subLabel?: string;
}) {
  const isTotal = type === "total";
  const isAdd = type === "add";
  const isDeduct = type === "deduct";

  return (
    <li
      className={cn(
        "flex items-center justify-between gap-3 px-5 py-3 border-b border-border-subtle last:border-0",
        isTotal && "bg-bg-surface-raised/40 font-medium"
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {!isTotal && (
          <span
            className={cn(
              "shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
              isAdd ? "bg-status-success/15 text-status-success" : "bg-status-danger/15 text-status-danger"
            )}
          >
            {isAdd ? <Plus className="w-3 h-3" strokeWidth={2.5} /> : <Minus className="w-3 h-3" strokeWidth={2.5} />}
          </span>
        )}
        <div className="min-w-0">
          <p className={cn("text-sm tracking-tight truncate", isTotal && "font-medium")}>{label}</p>
          {subLabel && <p className="text-[10px] text-text-tertiary truncate">{subLabel}</p>}
        </div>
      </div>
      <p
        className={cn(
          "tabular tracking-tight shrink-0",
          isTotal ? "text-base font-bold" : "text-sm font-medium",
          isAdd && !isTotal && "text-status-success",
          isDeduct && !isTotal && "text-status-danger"
        )}
      >
        {isAdd && !isTotal && "+"}
        {isDeduct && !isTotal && "-"}
        {amount.toLocaleString("en-US")}
        <span className="text-[10px] text-text-tertiary font-normal mr-1">ج.م</span>
      </p>
    </li>
  );
}

function Stat({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: "brand";
}) {
  return (
    <div>
      <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-1">{label}</p>
      <div className="flex items-baseline justify-center gap-1">
        <p className={cn("text-xl font-bold tabular tracking-tight", accent === "brand" && "text-brand-primary")}>
          {value}
        </p>
        {unit && <span className="text-[10px] text-text-tertiary font-medium">{unit}</span>}
      </div>
    </div>
  );
}
