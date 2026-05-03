"use client";

import { todayKpis, branchKpis, factoryKpis } from "@/lib/mock/kpis";
import { currentUser, branches } from "@/lib/mock/branches";
import { KpiGrid } from "./KpiGrid";
import { AlertFeed } from "./AlertFeed";
import { ActivityFeed } from "./ActivityFeed";
import { QuickActions } from "./QuickActions";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";

export function DashboardDesktop() {
  const branch = branches.find((b) => b.id === currentUser.branchId);

  return (
    <div className="px-8 py-8 max-w-[1600px] mx-auto space-y-8">
      {/* Greeting + meta */}
      <section className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-text-tertiary tracking-[0.18em] uppercase mb-2">
            لوحة التحكم التنفيذية ·{" "}
            {new Intl.DateTimeFormat("ar-EG", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </p>
          <h1 className="text-3xl font-bold tracking-tight leading-tight">
            صباح الخير، {currentUser.name.split(" ")[0]}
          </h1>
          {branch && (
            <div className="flex items-center gap-3 mt-3">
              <Badge intent="success" size="sm" dot pulse>
                النظام متصل
              </Badge>
              <span className="text-sm text-text-secondary">
                {branch.name} · {currentUser.role}
              </span>
              <span className="text-text-tertiary">·</span>
              <span className="text-sm text-text-tertiary">
                آخر مزامنة: قبل ٣ ثواني
              </span>
            </div>
          )}
        </div>

        <ShiftPill />
      </section>

      <div className="gold-hairline" />

      {/* Group KPIs — emphasised first row */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium tracking-tight">
              مؤشرات المجموعة اليوم
            </h2>
            <p className="text-xs text-text-tertiary mt-0.5">
              نظرة شاملة على 6 فروع + المصنع المركزي
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs px-3 h-8 rounded-md border border-border-subtle bg-bg-surface/40 hover:bg-bg-surface text-text-secondary tracking-tight transition-colors">
              اليوم
            </button>
            <button className="text-xs px-3 h-8 rounded-md border border-border-subtle bg-transparent hover:bg-bg-surface text-text-tertiary tracking-tight transition-colors">
              ٧ أيام
            </button>
            <button className="text-xs px-3 h-8 rounded-md border border-border-subtle bg-transparent hover:bg-bg-surface text-text-tertiary tracking-tight transition-colors">
              الشهر
            </button>
          </div>
        </div>
        <KpiGrid kpis={todayKpis} cols={4} />
      </section>

      {/* Two big columns: feeds + side rail */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Main column */}
        <div className="space-y-6 min-w-0">
          <QuickActions layout="row" />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* Branch sub-panel */}
            <Card padding="lg">
              <CardHeader
                title="فرع مصر الجديدة"
                subtitle="نشاط اليوم"
                action={
                  <Badge intent="success" size="sm">
                    نشط
                  </Badge>
                }
              />
              <KpiGrid kpis={branchKpis} cols={2} />
            </Card>

            {/* Factory sub-panel */}
            <Card padding="lg">
              <CardHeader
                title="المصنع — 6 أكتوبر"
                subtitle="إنتاج وشحن"
                action={
                  <Badge intent="info" size="sm">
                    وردية الصباح
                  </Badge>
                }
              />
              <KpiGrid kpis={factoryKpis} cols={2} />
            </Card>
          </div>

          <ActivityFeed limit={8} />
        </div>

        {/* Side rail */}
        <aside className="space-y-5 min-w-0">
          <AlertFeed limit={6} />
          <BranchHealth />
        </aside>
      </section>
    </div>
  );
}

/* ----------------------------------------------------- */

function ShiftPill() {
  return (
    <Card padding="md" className="flex items-center gap-4 min-w-[280px]">
      <div className="w-11 h-11 rounded-md bg-brand-primary/15 text-brand-primary flex items-center justify-center font-bold text-sm tabular">
        06
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-0.5">
          وردية الصباح
        </p>
        <p className="text-sm font-medium tabular tracking-tight">
          06:00 — 14:00
        </p>
        <p className="text-xs text-text-tertiary mt-0.5">
          ١٢ من ١٤ موظف · يبقى ٣ساعات
        </p>
      </div>
    </Card>
  );
}

function BranchHealth() {
  const items = [
    { name: "مصر الجديدة", status: "healthy", note: "تكلفة 31.2%" },
    { name: "المعادي", status: "warning", note: "شحنة متأخرة" },
    { name: "الزمالك", status: "healthy", note: "تكلفة 32.4%" },
    { name: "6 أكتوبر", status: "healthy", note: "تكلفة 30.8%" },
    { name: "مدينة نصر", status: "warning", note: "أصناف ناقصة" },
    { name: "سموحة", status: "healthy", note: "تكلفة 33.1%" },
  ];

  return (
    <Card padding="none">
      <div className="px-5 pt-5 pb-3 border-b border-border-subtle">
        <h3 className="text-base font-medium tracking-tight">
          صحة الفروع
        </h3>
        <p className="text-xs text-text-tertiary mt-0.5">
          نظرة سريعة على كل فرع
        </p>
      </div>
      <ul>
        {items.map((b) => (
          <li
            key={b.name}
            className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised/40 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={
                  b.status === "healthy"
                    ? "w-2 h-2 rounded-full bg-status-success shrink-0"
                    : "w-2 h-2 rounded-full bg-status-warning shrink-0"
                }
              />
              <span className="text-sm font-medium tracking-tight truncate">
                {b.name}
              </span>
            </div>
            <span className="text-[11px] text-text-tertiary tabular shrink-0">
              {b.note}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
