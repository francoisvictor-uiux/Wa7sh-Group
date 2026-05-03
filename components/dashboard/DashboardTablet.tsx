"use client";

import { branchKpis, todayKpis } from "@/lib/mock/kpis";
import { currentUser, branches } from "@/lib/mock/branches";
import { KpiGrid } from "./KpiGrid";
import { AlertFeed } from "./AlertFeed";
import { ActivityFeed } from "./ActivityFeed";
import { QuickActions } from "./QuickActions";
import { Badge } from "@/components/ui/Badge";

export function DashboardTablet() {
  const branch = branches.find((b) => b.id === currentUser.branchId);

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1280px] mx-auto">
      {/* Greeting */}
      <section className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-text-tertiary tracking-[0.18em] uppercase mb-1">
            {new Intl.DateTimeFormat("ar-EG", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            أهلاً بك، {currentUser.name.split(" ")[0]}
          </h1>
          {branch && (
            <div className="flex items-center gap-2 mt-2">
              <Badge intent="success" size="sm" dot pulse>
                متصل
              </Badge>
              <span className="text-sm text-text-secondary">
                {branch.name} · {currentUser.role}
              </span>
            </div>
          )}
        </div>

        <div className="text-left">
          <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-1">
            وردية اليوم
          </p>
          <p className="text-sm font-medium tabular tracking-tight">
            06:00 — 14:00
          </p>
          <p className="text-xs text-text-tertiary mt-0.5">
            12 موظف من 14 مجدول
          </p>
        </div>
      </section>

      <div className="gold-hairline" />

      {/* Quick actions row */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-medium tracking-tight">
            إجراءات سريعة
          </h2>
        </div>
        <QuickActions layout="row" />
      </section>

      {/* KPIs — branch */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-medium tracking-tight">
            مؤشرات الفرع
          </h2>
          <span className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase">
            تحديث مباشر
          </span>
        </div>
        <KpiGrid kpis={branchKpis} cols={4} />
      </section>

      {/* KPIs — group, second row */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-medium tracking-tight">
            مؤشرات المجموعة
          </h2>
          <span className="text-xs text-text-tertiary">
            6 فروع · مصنع مركزي
          </span>
        </div>
        <KpiGrid kpis={todayKpis.slice(0, 4)} cols={4} />
      </section>

      {/* Two-column rail: alerts + activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AlertFeed limit={5} />
        <ActivityFeed limit={6} />
      </section>
    </div>
  );
}
