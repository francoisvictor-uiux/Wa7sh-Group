"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Clock, FileText, Users, ChevronLeft } from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import {
  employees,
  employeeCounts,
  employeeStatusMeta,
  attendanceStateMeta,
  departmentMeta,
  type Employee,
  type EmployeeStatus,
} from "@/lib/mock/hr";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "clocked-in" | EmployeeStatus;

const filterOptions: Array<{ k: StatusFilter; label: string; count: number }> = [
  { k: "all", label: "كل الموظفين", count: employeeCounts.total },
  { k: "clocked-in", label: "في الوردية الآن", count: employeeCounts.clockedIn },
  { k: "active", label: "نشط", count: employeeCounts.active },
  { k: "on-leave", label: "في إجازة", count: employeeCounts.onLeave },
  { k: "probation", label: "تحت التجربة", count: employeeCounts.probation },
];

export function Hr() {
  const device = useDevice();
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filtered = employees.filter((e) => {
    if (filter === "all") return true;
    if (filter === "clocked-in") return e.attendance === "clocked-in";
    return e.status === filter;
  });

  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";

  return (
    <div
      className={cn(
        "mx-auto",
        isMobile ? "px-4 pt-4 pb-20 space-y-4" : isDesktop ? "px-8 py-7 max-w-[1600px] space-y-6" : "px-6 py-6 max-w-[1280px] space-y-5"
      )}
    >
      <header className={cn("flex items-end gap-4 flex-wrap", !isMobile && "justify-between")}>
        <div>
          <p className={cn("text-text-tertiary tracking-[0.18em] uppercase mb-1", isMobile ? "text-[10px]" : "text-xs")}>
            Human Resources
          </p>
          <h1 className={cn("font-bold tracking-tight", isDesktop ? "text-3xl" : isMobile ? "text-xl" : "text-2xl")}>
            الموارد البشرية
          </h1>
          <p className={cn("text-text-tertiary mt-1", isMobile ? "text-xs" : "text-sm")}>
            {employeeCounts.total} موظف · {employeeCounts.clockedIn} في الوردية الآن
          </p>
        </div>
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Link href="/hr/payslip">
              <Button variant="secondary" size="md">
                <FileText className="w-4 h-4" strokeWidth={1.75} />
                قسيمتي
              </Button>
            </Link>
            <Link href="/hr/attendance">
              <Button variant="secondary" size="md">
                <Clock className="w-4 h-4" strokeWidth={1.75} />
                الحضور
              </Button>
            </Link>
            <Button size="md">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              موظف جديد
            </Button>
          </div>
        )}
      </header>

      {!isMobile && <div className="gold-hairline" />}

      {/* KPI strip — tablet/desktop */}
      {!isMobile && (
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <KpiTile label="إجمالي" value={employeeCounts.total} />
          <KpiTile label="في الوردية" value={employeeCounts.clockedIn} accent="success" />
          <KpiTile label="استراحة" value={employeeCounts.onBreak} accent="warning" />
          <KpiTile label="إجازة" value={employeeCounts.onLeave} accent="info" />
          <KpiTile label="تحت التجربة" value={employeeCounts.probation} accent="warning" />
        </section>
      )}

      {/* Mobile self-service shortcuts */}
      {isMobile && (
        <div className="grid grid-cols-2 gap-3">
          <Link href="/hr/attendance" className="group">
            <Card padding="md" className="h-full group-hover:border-border-strong group-hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-md bg-brand-primary/15 text-brand-primary flex items-center justify-center mb-2.5">
                <Clock className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <p className="text-sm font-medium tracking-tight mb-0.5">الحضور والانصراف</p>
              <p className="text-[11px] text-text-tertiary leading-relaxed">
                سجّل دخولك وانصرافك
              </p>
            </Card>
          </Link>
          <Link href="/hr/payslip" className="group">
            <Card padding="md" className="h-full group-hover:border-border-strong group-hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-md bg-status-success/15 text-status-success flex items-center justify-center mb-2.5">
                <FileText className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <p className="text-sm font-medium tracking-tight mb-0.5">قسيمة الراتب</p>
              <p className="text-[11px] text-text-tertiary leading-relaxed">
                عرض راتب الشهر الحالي
              </p>
            </Card>
          </Link>
        </div>
      )}

      {/* Filter chips */}
      <div className={cn(isMobile ? "-mx-4 px-4 overflow-x-auto" : "")}>
        <div className={cn("flex items-center gap-2", isMobile && "min-w-max")}>
          {filterOptions.map((opt) => (
            <button
              key={opt.k}
              type="button"
              onClick={() => setFilter(opt.k)}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full",
                "text-xs font-medium tracking-tight transition-all duration-fast border",
                filter === opt.k
                  ? "bg-brand-primary text-text-on-brand border-brand-primary"
                  : "bg-bg-surface/40 text-text-secondary border-border-subtle hover:border-border-strong"
              )}
            >
              <span>{opt.label}</span>
              <span className={cn("tabular text-[10px] font-bold", filter === opt.k ? "opacity-90" : "text-text-tertiary")}>
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Employee directory */}
      {isDesktop ? (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-surface-raised/40 border-b border-border-subtle">
                <tr className="text-right text-[11px] tracking-[0.16em] uppercase text-text-tertiary">
                  <th className="px-5 py-3 font-medium">الموظف</th>
                  <th className="px-3 py-3 font-medium">الدور</th>
                  <th className="px-3 py-3 font-medium">الفرع</th>
                  <th className="px-3 py-3 font-medium">الوردية</th>
                  <th className="px-3 py-3 font-medium">الحضور</th>
                  <th className="px-3 py-3 font-medium">الحالة</th>
                  <th className="px-5 py-3 font-medium text-left"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <EmployeeRow key={e.id} employee={e} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}>
          {filtered.map((e) => (
            <EmployeeCard key={e.id} employee={e} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Card variant ---------------- */

function EmployeeCard({ employee }: { employee: Employee }) {
  const statusMeta = employeeStatusMeta[employee.status];
  const attendanceMeta = attendanceStateMeta[employee.attendance];

  return (
    <Link href={`/hr/${employee.id}`} className="block group">
      <Card padding="md" className="h-full transition-all group-hover:border-border-strong group-hover:shadow-md group-hover:-translate-y-0.5">
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 w-11 h-11 rounded-full bg-brand-primary/12 text-brand-primary flex items-center justify-center font-medium text-base">
            {employee.firstName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium tracking-tight truncate">{employee.name}</p>
            <p className="text-[11px] text-text-tertiary tracking-tight truncate">
              {employee.role} · {employee.branchName}
            </p>
          </div>
          <Badge intent={attendanceMeta.intent} size="sm" dot pulse={employee.attendance === "clocked-in"}>
            {attendanceMeta.label}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border-subtle">
          <span className="text-[11px] text-text-tertiary tabular tracking-tight truncate">
            {employee.todayShift === "off" ? "خارج الوردية" : `${employee.shiftStart} – ${employee.shiftEnd}`}
            {employee.clockedInAt && ` · دخل ${employee.clockedInAt.replace("اليوم · ", "")}`}
          </span>
          <Badge intent={statusMeta.intent} size="sm">
            {statusMeta.label}
          </Badge>
        </div>
      </Card>
    </Link>
  );
}

/* ---------------- Table row ---------------- */

function EmployeeRow({ employee }: { employee: Employee }) {
  const statusMeta = employeeStatusMeta[employee.status];
  const attendanceMeta = attendanceStateMeta[employee.attendance];
  return (
    <tr className="border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised/40 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 w-8 h-8 rounded-full bg-brand-primary/12 text-brand-primary flex items-center justify-center text-xs font-medium">
            {employee.firstName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-tight">{employee.name}</p>
            <p className="text-[11px] text-text-tertiary tabular">{employee.phone}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3.5">
        <p className="text-sm tracking-tight">{employee.role}</p>
        <p className="text-[11px] text-text-tertiary">
          {departmentMeta[employee.department].label}
        </p>
      </td>
      <td className="px-3 py-3.5">
        <p className="text-sm tracking-tight">{employee.branchName}</p>
      </td>
      <td className="px-3 py-3.5">
        <p className="text-xs tabular tracking-tight">
          {employee.todayShift === "off" ? "—" : `${employee.shiftStart} – ${employee.shiftEnd}`}
        </p>
        {employee.clockedInAt && (
          <p className="text-[11px] text-text-tertiary tabular">
            دخل {employee.clockedInAt.replace("اليوم · ", "")}
          </p>
        )}
      </td>
      <td className="px-3 py-3.5">
        <Badge intent={attendanceMeta.intent} size="sm" dot pulse={employee.attendance === "clocked-in"}>
          {attendanceMeta.label}
        </Badge>
      </td>
      <td className="px-3 py-3.5">
        <Badge intent={statusMeta.intent} size="sm">
          {statusMeta.label}
        </Badge>
      </td>
      <td className="px-5 py-3.5 text-left">
        <Link
          href={`/hr/${employee.id}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
        >
          عرض
          <ChevronLeft className="w-3 h-3" strokeWidth={2.5} />
        </Link>
      </td>
    </tr>
  );
}

/* ---------------- KPI tile ---------------- */

function KpiTile({
  label,
  value,
  accent = "neutral",
}: {
  label: string;
  value: number;
  accent?: "neutral" | "info" | "warning" | "success" | "danger";
}) {
  const accentClass =
    accent === "info"
      ? "text-status-info"
      : accent === "warning"
      ? "text-status-warning"
      : accent === "success"
      ? "text-status-success"
      : accent === "danger"
      ? "text-status-danger"
      : "text-text-primary";
  return (
    <Card padding="md" className="min-w-0">
      <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-2 truncate">
        {label}
      </p>
      <p className={cn("text-3xl font-bold tabular tracking-tight", accentClass)}>{value}</p>
    </Card>
  );
}
