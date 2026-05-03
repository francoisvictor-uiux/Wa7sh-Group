"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Fingerprint,
  MapPin,
  Coffee,
  LogOut,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { myEmployee, recentAttendance, type AttendanceState } from "@/lib/mock/hr";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function AttendancePunch() {
  const device = useDevice();
  const [state, setState] = useState<AttendanceState>(myEmployee.attendance);
  const [scanning, setScanning] = useState(false);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000 * 30);
    return () => window.clearInterval(t);
  }, []);

  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";

  const action = (next: AttendanceState) => {
    setScanning(true);
    window.setTimeout(() => {
      setState(next);
      setScanning(false);
    }, 1200);
  };

  const time = now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div
      className={cn(
        "mx-auto",
        isMobile ? "px-4 pt-4 pb-20 max-w-md" : "px-6 py-6 max-w-2xl"
      )}
    >
      <Link
        href="/hr"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        الموارد البشرية
      </Link>

      <header className="text-center mb-5">
        <p className="text-[10px] text-text-tertiary tracking-[0.18em] uppercase mb-1">
          Attendance
        </p>
        <h1 className="text-xl font-bold tracking-tight">الحضور والانصراف</h1>
      </header>

      {/* Time card */}
      <Card padding="lg" className="text-center mb-4">
        <p className="text-xs text-text-tertiary tracking-tight mb-2">{date}</p>
        <p className="text-5xl font-bold tabular tracking-tight mb-1">
          {time}
        </p>
        <p className="text-xs text-text-tertiary tracking-tight">القاهرة · GMT+2</p>

        <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-border-subtle">
          <Stat
            label="بداية الوردية"
            value={myEmployee.shiftStart ?? "—"}
          />
          <Stat
            label="نهاية الوردية"
            value={myEmployee.shiftEnd ?? "—"}
          />
        </div>
      </Card>

      {/* Status card */}
      <Card padding="lg" className="text-center mb-5">
        <div className="flex justify-center mb-4">
          {state === "clocked-in" ? (
            <div className="relative">
              <span
                aria-hidden
                className="absolute inset-[-12px] rounded-full border border-status-success/30 animate-pulse-dot"
              />
              <div className="relative w-20 h-20 rounded-full bg-status-success/15 text-status-success flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" strokeWidth={1.5} />
              </div>
            </div>
          ) : state === "on-break" ? (
            <div className="w-20 h-20 rounded-full bg-status-warning/15 text-status-warning flex items-center justify-center">
              <Coffee className="w-10 h-10" strokeWidth={1.5} />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-bg-surface-raised text-text-tertiary flex items-center justify-center">
              <Clock className="w-10 h-10" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <p className="text-base font-medium tracking-tight">
          {state === "clocked-in"
            ? `حاضر منذ ${myEmployee.clockedInAt?.replace("اليوم · ", "")}`
            : state === "on-break"
            ? "في استراحة"
            : "لم تسجّل دخولك بعد"}
        </p>
        <p className="text-xs text-text-tertiary mt-1">
          {state === "clocked-in"
            ? "وردية الصباح · فرع مصر الجديدة"
            : "اضغط الزر أدناه لتسجيل الحضور"}
        </p>

        {/* Action buttons */}
        <div className="mt-5 space-y-2">
          {state === "clocked-out" && (
            <Button onClick={() => action("clocked-in")} size="lg" fullWidth loading={scanning}>
              <Fingerprint className="w-5 h-5" strokeWidth={1.75} />
              سجّل دخولك
            </Button>
          )}
          {state === "clocked-in" && (
            <>
              <Button onClick={() => action("on-break")} variant="secondary" size="lg" fullWidth>
                <Coffee className="w-4 h-4" strokeWidth={1.75} />
                ابدأ استراحة
              </Button>
              <Button onClick={() => action("clocked-out")} variant="danger" size="lg" fullWidth loading={scanning}>
                <LogOut className="w-4 h-4" strokeWidth={1.75} />
                سجّل انصراف
              </Button>
            </>
          )}
          {state === "on-break" && (
            <Button onClick={() => action("clocked-in")} size="lg" fullWidth loading={scanning}>
              <CheckCircle2 className="w-5 h-5" strokeWidth={1.75} />
              عُد للوردية
            </Button>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-text-tertiary">
          <MapPin className="w-3 h-3" strokeWidth={1.75} />
          <span>الموقع تم التحقق منه ✓</span>
        </div>
      </Card>

      {/* Recent attendance */}
      <Card padding="none">
        <div className="px-5 pt-5 pb-3 border-b border-border-subtle">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-medium tracking-tight">سجل آخر أيام</h2>
            <TrendingUp className="w-4 h-4 text-text-tertiary" strokeWidth={1.75} />
          </div>
          <p className="text-xs text-text-tertiary mt-0.5">آخر 6 أيام عمل</p>
        </div>
        <ul>
          {recentAttendance.map((rec, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border-subtle last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium tabular tracking-tight">{rec.date}</p>
                <p className="text-[11px] text-text-tertiary tabular">
                  {rec.in === "—" ? rec.note : `دخل ${rec.in} · خرج ${rec.out}`}
                </p>
              </div>
              <Badge intent={rec.hours === "0" ? "neutral" : rec.note.includes("إضافي") ? "brand" : "success"} size="sm">
                {rec.hours === "0" ? "إجازة" : `${rec.hours} س`}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-1">{label}</p>
      <p className="text-base font-bold tabular tracking-tight">{value}</p>
    </div>
  );
}
