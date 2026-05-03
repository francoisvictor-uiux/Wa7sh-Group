"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  Clock,
  Calendar,
  Award,
  Briefcase,
  CreditCard,
  Star,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import {
  getEmployee,
  employees,
  employeeStatusMeta,
  attendanceStateMeta,
  departmentMeta,
} from "@/lib/mock/hr";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function EmployeeDetail({ employeeId }: { employeeId: string }) {
  const device = useDevice();
  const employee = getEmployee(employeeId) ?? employees[0];
  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";
  const statusMeta = employeeStatusMeta[employee.status];
  const attendanceMeta = attendanceStateMeta[employee.attendance];
  const totalLeave = employee.totalLeaveDays ?? 21;
  const usedLeave = employee.usedLeaveDays ?? 0;
  const remainingLeave = totalLeave - usedLeave;

  return (
    <div
      className={cn(
        "mx-auto",
        isMobile ? "px-4 pt-4 pb-20 space-y-4" : isDesktop ? "px-8 py-7 max-w-[1400px] space-y-6" : "px-6 py-6 max-w-[1200px] space-y-5"
      )}
    >
      <Link
        href="/hr"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        كل الموظفين
      </Link>

      <header className={cn("flex items-start gap-4 flex-wrap", isMobile && "flex-col items-stretch")}>
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div
            className={cn(
              "shrink-0 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center font-bold",
              isDesktop ? "w-24 h-24 text-4xl" : isMobile ? "w-16 h-16 text-2xl" : "w-20 h-20 text-3xl"
            )}
          >
            {employee.firstName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-1">
              {employee.role}
            </p>
            <h1 className={cn("font-bold tracking-tight leading-tight", isDesktop ? "text-3xl" : isMobile ? "text-xl" : "text-2xl")}>
              {employee.name}
            </h1>
            <p className="text-sm text-text-tertiary mt-1">
              {departmentMeta[employee.department].label} · {employee.branchName}
            </p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge intent={attendanceMeta.intent} size="md" dot pulse={employee.attendance === "clocked-in"}>
                {attendanceMeta.label}
              </Badge>
              <Badge intent={statusMeta.intent} size="md">
                {statusMeta.label}
              </Badge>
              {employee.rating && (
                <Badge intent="brand" size="md">
                  <Star className="w-3 h-3" strokeWidth={2} />
                  {employee.rating.toFixed(1)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "grid gap-5",
          isDesktop ? "grid-cols-[1fr_360px]" : isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 lg:grid-cols-[1fr_320px]"
        )}
      >
        <div className={cn("space-y-5 min-w-0", isMobile && "space-y-4")}>
          {/* Today's shift */}
          {employee.todayShift !== "off" && (
            <Card padding="lg">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">
                    وردية اليوم
                  </p>
                  <h2 className="text-base font-medium tracking-tight">
                    {employee.todayShift === "morning" ? "وردية الصباح" : employee.todayShift === "evening" ? "وردية المساء" : "وردية الليل"}
                  </h2>
                </div>
                {employee.clockedInAt && (
                  <Badge intent="success" size="sm" dot pulse>
                    دخل {employee.clockedInAt.replace("اليوم · ", "")}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Stat label="بداية" value={employee.shiftStart ?? "—"} />
                <Stat label="نهاية" value={employee.shiftEnd ?? "—"} />
                <Stat label="ساعات" value="8 س" />
              </div>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="سنوات الخدمة" value={`${employee.yearsOfService}`} unit="سنة" />
            <MetricCard label="رصيد الإجازة" value={`${remainingLeave}`} unit="يوم" accent={remainingLeave < 5 ? "warning" : undefined} />
            <MetricCard label="مستخدم" value={`${usedLeave}`} unit="يوم" />
            <MetricCard label="من إجمالي" value={`${totalLeave}`} unit="يوم" />
          </div>

          {/* Certificates */}
          {employee.certificates && employee.certificates.length > 0 && (
            <Card padding="md">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">
                    الشهادات والتدريب
                  </p>
                  <h2 className="text-base font-medium tracking-tight">
                    {employee.certificates.length} شهادة سارية
                  </h2>
                </div>
                <Award className="w-5 h-5 text-brand-primary" strokeWidth={1.75} />
              </div>
              <ul className="space-y-2">
                {employee.certificates.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-bg-surface-raised/40 border border-border-subtle"
                  >
                    <Award className="w-3.5 h-3.5 text-brand-primary shrink-0" strokeWidth={1.75} />
                    <span className="text-sm tracking-tight">{c}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Recent activity placeholder */}
          <Card padding="md">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary">
                ملاحظات الموظف
              </p>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {employee.role === "مديرة الفرع"
                ? "أداء ممتاز خلال الربع الأخير — حافظت على معدل تكلفة طعام أقل من 33% طوال الفترة."
                : employee.role.includes("سائق")
                ? "سائق منضبط — تقييم ممتاز وحوادث صفر منذ بداية الخدمة."
                : "موظف ملتزم بسياسات الفرع وحضور منتظم."}
            </p>
          </Card>
        </div>

        {/* Right rail */}
        <aside className="space-y-5 min-w-0">
          <Card padding="md">
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">
              التواصل
            </p>
            <div className="space-y-3">
              <ContactRow icon={<Phone className="w-3.5 h-3.5" strokeWidth={1.75} />} value={employee.phone} sub="الهاتف" />
              {employee.email && (
                <ContactRow icon={<Mail className="w-3.5 h-3.5" strokeWidth={1.75} />} value={employee.email} sub="البريد" />
              )}
              <ContactRow icon={<Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />} value={employee.branchName} sub="الفرع" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button variant="secondary" size="sm" fullWidth>
                <Phone className="w-3.5 h-3.5" strokeWidth={1.75} />
                اتصل
              </Button>
              <Button variant="ghost" size="sm" fullWidth>
                <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
                إيميل
              </Button>
            </div>
          </Card>

          <Card padding="md">
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">
              التوظيف
            </p>
            <ul className="space-y-3">
              <MetaRow icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />} label="تاريخ التعيين" value={employee.hireDate} />
              <MetaRow icon={<Briefcase className="w-3.5 h-3.5" strokeWidth={1.75} />} label="القسم" value={departmentMeta[employee.department].label} />
              <MetaRow icon={<Clock className="w-3.5 h-3.5" strokeWidth={1.75} />} label="نوع الوردية" value={employee.todayShift === "morning" ? "صباحي" : "متغير"} />
              <MetaRow icon={<CreditCard className="w-3.5 h-3.5" strokeWidth={1.75} />} label="الراتب الأساسي" value={`${employee.baseSalary.toLocaleString("en-US")} ج.م`} />
            </ul>
          </Card>

          <Card padding="md">
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">
              إجراءات
            </p>
            <div className="space-y-2">
              <Button variant="secondary" size="md" fullWidth>
                طلب إجازة
              </Button>
              <Button variant="secondary" size="md" fullWidth>
                عرض قسائم الراتب
              </Button>
              <Button variant="ghost" size="md" fullWidth>
                سجل الحضور
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-1">{label}</p>
      <p className="text-base font-bold tabular tracking-tight">{value}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: "warning";
}) {
  return (
    <Card padding="md" className="min-w-0">
      <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-2 truncate">{label}</p>
      <div className="flex items-baseline gap-1">
        <p className={cn("text-2xl font-bold tabular tracking-tight", accent === "warning" && "text-status-warning")}>
          {value}
        </p>
        {unit && <span className="text-xs text-text-tertiary font-medium">{unit}</span>}
      </div>
    </Card>
  );
}

function ContactRow({
  icon,
  value,
  sub,
}: {
  icon: React.ReactNode;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-text-tertiary mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-medium tabular tracking-tight truncate">{value}</p>
        <p className="text-[10px] text-text-tertiary tracking-[0.14em] uppercase">{sub}</p>
      </div>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 min-w-0">
      <div className="flex items-center gap-2 text-[11px] text-text-tertiary tracking-tight shrink-0">
        <span>{icon}</span>
        {label}
      </div>
      <span className="text-xs font-medium tracking-tight tabular truncate text-left">{value}</span>
    </li>
  );
}
