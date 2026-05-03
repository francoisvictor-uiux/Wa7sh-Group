"use client";

import { branchKpis } from "@/lib/mock/kpis";
import { currentUser, branches } from "@/lib/mock/branches";
import { KpiGrid } from "./KpiGrid";
import { AlertFeed } from "./AlertFeed";
import { ActivityFeed } from "./ActivityFeed";
import { QuickActions } from "./QuickActions";
import { Badge } from "@/components/ui/Badge";

export function DashboardMobile() {
  const branch = branches.find((b) => b.id === currentUser.branchId);
  const greeting = getGreeting();

  return (
    <div className="px-4 pt-4 pb-6 space-y-5">
      {/* Greeting block */}
      <section className="space-y-1.5">
        <p className="text-xs text-text-tertiary tracking-tight">
          {greeting} ·{" "}
          {new Intl.DateTimeFormat("ar-EG", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }).format(new Date())}
        </p>
        <h1 className="text-xl font-bold tracking-tight">
          أهلاً، {currentUser.name.split(" ")[0]}
        </h1>
        {branch && (
          <div className="flex items-center gap-2">
            <Badge intent="success" size="sm" dot pulse>
              متصل
            </Badge>
            <span className="text-xs text-text-tertiary">
              {branch.name} · {currentUser.role}
            </span>
          </div>
        )}
      </section>

      {/* Branch KPIs */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium tracking-tight">
            مؤشرات الفرع اليوم
          </h2>
          <span className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase">
            مباشر
          </span>
        </div>
        <KpiGrid kpis={branchKpis} cols={2} />
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-sm font-medium tracking-tight mb-3">
          إجراءات سريعة
        </h2>
        <QuickActions layout="grid" />
      </section>

      {/* Alerts */}
      <section>
        <AlertFeed limit={4} density="compact" />
      </section>

      {/* Activity */}
      <section>
        <ActivityFeed limit={4} />
      </section>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "ليلة هادئة";
  if (h < 12) return "صباح الخير";
  if (h < 17) return "نهارك سعيد";
  if (h < 21) return "مساء الخير";
  return "ليلة طيبة";
}
