"use client";

import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Download,
  Receipt,
  Wallet,
  Building2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import {
  monthlyPnl,
  groupKpis,
  revenueTrend,
  costBreakdown,
  cashAccounts,
  cashTotal,
  arTotal,
  arOverdue,
  apTotal,
  apOverdue,
  taxRecords,
  taxStatusMeta,
  taxTypeLabel,
} from "@/lib/mock/finance";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DesktopOnlyNotice } from "./DesktopOnlyNotice";
import { cn } from "@/lib/utils";

export function Finance() {
  const device = useDevice();
  if (device !== "desktop") return <DesktopOnlyNotice moduleName="المالية" />;

  return (
    <div className="px-8 py-7 max-w-[1600px] mx-auto space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-text-tertiary tracking-[0.18em] uppercase mb-2">
            Finance · المالية والمحاسبة
          </p>
          <h1 className="text-3xl font-bold tracking-tight">المالية</h1>
          <p className="text-sm text-text-secondary mt-2 max-w-2xl">
            نظرة شاملة على ربحية المجموعة وكل فرع، الذمم المدينة والدائنة، النقدية، والامتثال الضريبي.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md">
            <Calendar className="w-4 h-4" strokeWidth={1.75} />
            إبريل 2026
          </Button>
          <Button variant="secondary" size="md">
            <Download className="w-4 h-4" strokeWidth={1.75} />
            تصدير الكل
          </Button>
        </div>
      </header>

      <div className="gold-hairline" />

      {/* Top KPIs — group totals */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <BigKpi
          label="الإيرادات"
          value={`${(groupKpis.revenue / 1_000_000).toFixed(2)}م`}
          unit="ج.م"
          delta={groupKpis.trendVsPrev}
          accent="brand"
          emphasize
        />
        <BigKpi
          label="تكلفة الطعام"
          value={`${groupKpis.foodCostPct.toFixed(1)}`}
          unit="%"
          hint={`${(groupKpis.cogs / 1_000_000).toFixed(2)}م ج.م`}
          delta={-1.2}
          accent={groupKpis.foodCostPct <= 33 ? "success" : "warning"}
        />
        <BigKpi
          label="إجمالي الربح"
          value={`${(groupKpis.grossProfit / 1_000_000).toFixed(2)}م`}
          unit="ج.م"
          hint={`هامش ${groupKpis.grossMarginPct.toFixed(1)}%`}
          delta={4.6}
          accent="success"
        />
        <BigKpi
          label="صافي الدخل"
          value={`${(groupKpis.netIncome / 1_000_000).toFixed(2)}م`}
          unit="ج.م"
          hint={`هامش ${groupKpis.netMarginPct.toFixed(1)}%`}
          delta={6.8}
          accent="success"
          emphasize
        />
        <BigKpi
          label="موظفين نشطين"
          value={`${groupKpis.staffCount}`}
          hint="6 فروع · المصنع"
          accent="neutral"
        />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
        {/* Main column */}
        <div className="space-y-6 min-w-0">
          {/* Revenue trend */}
          <Card padding="lg">
            <div className="flex items-end justify-between gap-3 mb-5">
              <div>
                <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">
                  Revenue Trend · آخر 6 أشهر
                </p>
                <h2 className="text-lg font-medium tracking-tight">اتجاه الإيرادات</h2>
              </div>
              <Badge intent="success" size="md">
                <TrendingUp className="w-3 h-3" strokeWidth={2} />
                +6.8% YoY
              </Badge>
            </div>
            <RevenueChart data={revenueTrend} />
          </Card>

          {/* Branch P&L table */}
          <Card padding="none">
            <div className="px-6 pt-6 pb-4 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium tracking-tight">ربحية الفروع</h2>
                <p className="text-xs text-text-tertiary mt-0.5">
                  مقارنة الفروع — إبريل 2026
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                Excel
              </Button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-bg-surface-raised/40 border-b border-border-subtle">
                <tr className="text-right text-[11px] tracking-[0.16em] uppercase text-text-tertiary">
                  <th className="px-6 py-3 font-medium">الفرع</th>
                  <th className="px-3 py-3 font-medium text-left">الإيرادات</th>
                  <th className="px-3 py-3 font-medium text-left">تكلفة الطعام</th>
                  <th className="px-3 py-3 font-medium text-left">إجمالي الربح</th>
                  <th className="px-3 py-3 font-medium text-left">صافي الدخل</th>
                  <th className="px-3 py-3 font-medium text-left">هامش صافي</th>
                  <th className="px-6 py-3 font-medium text-left">vs الشهر الماضي</th>
                </tr>
              </thead>
              <tbody>
                {monthlyPnl.map((p) => (
                  <tr
                    key={p.branchId}
                    className="border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised/40 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-medium tracking-tight">{p.branchName}</p>
                      <p className="text-[11px] text-text-tertiary">{p.staffCount} موظف</p>
                    </td>
                    <td className="px-3 py-3.5 text-left tabular tracking-tight">
                      {(p.revenue / 1000).toFixed(0)}ك
                    </td>
                    <td
                      className={cn(
                        "px-3 py-3.5 text-left tabular tracking-tight",
                        p.foodCostPct > 33 ? "text-status-warning font-medium" : "text-text-secondary"
                      )}
                    >
                      {p.foodCostPct.toFixed(1)}%
                    </td>
                    <td className="px-3 py-3.5 text-left tabular tracking-tight">
                      {(p.grossProfit / 1000).toFixed(0)}ك
                    </td>
                    <td className="px-3 py-3.5 text-left tabular tracking-tight font-medium">
                      {(p.netIncome / 1000).toFixed(0)}ك
                    </td>
                    <td className="px-3 py-3.5 text-left tabular tracking-tight">
                      <span
                        className={cn(
                          "font-medium",
                          p.netMarginPct >= 28
                            ? "text-status-success"
                            : p.netMarginPct >= 25
                            ? "text-text-primary"
                            : "text-status-warning"
                        )}
                      >
                        {p.netMarginPct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-left">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-medium tabular",
                          p.trendVsPrev > 0 ? "text-status-success" : "text-status-danger"
                        )}
                      >
                        {p.trendVsPrev > 0 ? (
                          <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
                        ) : (
                          <TrendingDown className="w-3 h-3" strokeWidth={2.5} />
                        )}
                        {p.trendVsPrev > 0 ? "+" : ""}
                        {p.trendVsPrev.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-brand-primary/8 font-medium">
                  <td className="px-6 py-4 text-sm">إجمالي المجموعة</td>
                  <td className="px-3 py-4 text-left tabular tracking-tight">
                    {(groupKpis.revenue / 1_000_000).toFixed(2)}م
                  </td>
                  <td className="px-3 py-4 text-left tabular tracking-tight">
                    {groupKpis.foodCostPct.toFixed(1)}%
                  </td>
                  <td className="px-3 py-4 text-left tabular tracking-tight">
                    {(groupKpis.grossProfit / 1_000_000).toFixed(2)}م
                  </td>
                  <td className="px-3 py-4 text-left tabular tracking-tight font-bold text-brand-primary">
                    {(groupKpis.netIncome / 1_000_000).toFixed(2)}م
                  </td>
                  <td className="px-3 py-4 text-left tabular tracking-tight font-bold text-status-success">
                    {groupKpis.netMarginPct.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-left text-sm font-medium text-status-success tabular">
                    +{groupKpis.trendVsPrev}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </Card>

          {/* Cost breakdown */}
          <Card padding="lg">
            <div className="flex items-end justify-between gap-3 mb-5">
              <div>
                <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">
                  Cost Breakdown
                </p>
                <h2 className="text-lg font-medium tracking-tight">توزيع التكاليف</h2>
              </div>
              <span className="text-sm text-text-tertiary tabular">
                إجمالي{" "}
                {(costBreakdown.reduce((s, c) => s + c.amount, 0) / 1_000_000).toFixed(2)}م ج.م
              </span>
            </div>
            <CostBreakdown />
          </Card>
        </div>

        {/* Right rail */}
        <aside className="space-y-5 min-w-0">
          {/* AR snapshot */}
          <Card padding="md">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">
                  الذمم المدينة
                </p>
                <h3 className="text-base font-medium tracking-tight">مستحق لنا</h3>
              </div>
              <ArrowDownLeft className="w-4 h-4 text-status-info" strokeWidth={2} />
            </div>
            <p className="text-2xl font-bold tabular tracking-tight">
              {(arTotal / 1000).toFixed(0)}ك
              <span className="text-xs text-text-tertiary font-normal mr-1">ج.م</span>
            </p>
            {arOverdue > 0 && (
              <p className="text-xs text-status-warning mt-1 tabular">
                منها {(arOverdue / 1000).toFixed(0)}ك متأخرة
              </p>
            )}
            <Link
              href="/finance/receivables"
              className="block mt-3 text-xs font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              عرض التحليل العمري ←
            </Link>
          </Card>

          {/* AP snapshot */}
          <Card padding="md">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">
                  الذمم الدائنة
                </p>
                <h3 className="text-base font-medium tracking-tight">مستحق علينا</h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-status-warning" strokeWidth={2} />
            </div>
            <p className="text-2xl font-bold tabular tracking-tight">
              {(apTotal / 1000).toFixed(0)}ك
              <span className="text-xs text-text-tertiary font-normal mr-1">ج.م</span>
            </p>
            {apOverdue > 0 && (
              <p className="text-xs text-status-danger mt-1 tabular">
                منها {(apOverdue / 1000).toFixed(0)}ك متأخر السداد
              </p>
            )}
            <Link
              href="/finance/payables"
              className="block mt-3 text-xs font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              عرض المدفوعات المعلّقة ←
            </Link>
          </Card>

          {/* Cash position */}
          <Card padding="md">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">
                  الخزينة والبنوك
                </p>
                <h3 className="text-base font-medium tracking-tight">المركز النقدي</h3>
              </div>
              <Wallet className="w-4 h-4 text-brand-primary" strokeWidth={2} />
            </div>
            <p className="text-2xl font-bold tabular tracking-tight mb-3">
              {(cashTotal / 1_000_000).toFixed(2)}م
              <span className="text-xs text-text-tertiary font-normal mr-1">ج.م</span>
            </p>
            <ul className="space-y-2 pt-3 border-t border-border-subtle">
              {cashAccounts.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-2 min-w-0">
                  <span className="text-[11px] text-text-secondary tracking-tight truncate">
                    {a.name}
                  </span>
                  <span className="text-xs font-medium tabular tracking-tight shrink-0">
                    {(a.balance / 1000).toFixed(0)}ك
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Tax compliance */}
          <Card padding="none">
            <div className="px-5 pt-5 pb-3 border-b border-border-subtle">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-medium tracking-tight">الالتزام الضريبي</h3>
                <Receipt className="w-4 h-4 text-text-tertiary" strokeWidth={1.75} />
              </div>
              <p className="text-xs text-text-tertiary mt-0.5">ETA · مصلحة الضرائب</p>
            </div>
            <ul>
              {taxRecords.map((t) => {
                const meta = taxStatusMeta[t.status];
                return (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-2 px-5 py-3 border-b border-border-subtle last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium tracking-tight truncate">
                        {taxTypeLabel[t.type]}
                      </p>
                      <p className="text-[11px] text-text-tertiary tabular">
                        {t.period} · {(t.amount / 1000).toFixed(0)}ك
                      </p>
                    </div>
                    <Badge intent={meta.intent} size="sm">
                      {meta.label}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- */
/*  Big KPI                                                     */
/* ----------------------------------------------------------- */

function BigKpi({
  label,
  value,
  unit,
  hint,
  delta,
  accent = "neutral",
  emphasize,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  delta?: number;
  accent?: "neutral" | "brand" | "success" | "warning" | "danger";
  emphasize?: boolean;
}) {
  const accentClass =
    accent === "brand"
      ? "text-brand-primary"
      : accent === "success"
      ? "text-status-success"
      : accent === "warning"
      ? "text-status-warning"
      : accent === "danger"
      ? "text-status-danger"
      : "text-text-primary";

  return (
    <Card
      padding="md"
      variant={emphasize ? "raised" : "default"}
      className={cn("relative overflow-hidden min-w-0", emphasize && "shadow-md")}
    >
      {emphasize && (
        <div
          aria-hidden
          className="absolute -top-12 -left-12 w-32 h-32 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--brand-primary)" }}
        />
      )}
      <div className="relative">
        <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-2 truncate">
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <p className={cn("text-3xl font-bold tabular tracking-tight", accentClass)}>
            {value}
          </p>
          {unit && <span className="text-sm text-text-tertiary font-medium">{unit}</span>}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          {typeof delta === "number" ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-medium tabular",
                delta > 0 ? "text-status-success" : "text-status-danger"
              )}
            >
              {delta > 0 ? (
                <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
              ) : (
                <TrendingDown className="w-3 h-3" strokeWidth={2.5} />
              )}
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)}%
            </span>
          ) : (
            <span />
          )}
          {hint && (
            <span className="text-[10px] text-text-tertiary truncate">{hint}</span>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ----------------------------------------------------------- */
/*  Revenue chart — pseudo bar+line                             */
/* ----------------------------------------------------------- */

function RevenueChart({ data }: { data: typeof revenueTrend }) {
  const max = Math.max(...data.map((d) => d.revenue));
  const min = Math.min(...data.map((d) => d.revenue));
  const range = max - min || 1;

  // Build polyline points
  const width = 100;
  const height = 100;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d.revenue - min) / range) * 80 - 10;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative h-56">
      <div className="absolute inset-0 flex items-end justify-between gap-2 px-2 pb-8">
        {data.map((d, i) => {
          const heightPct = ((d.revenue - min) / range) * 70 + 20;
          const isLast = i === data.length - 1;
          return (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-full rounded-t-md transition-all",
                  isLast ? "bg-brand-primary" : "bg-brand-primary/30"
                )}
                style={{ height: `${heightPct}%` }}
              />
              <span className="text-[11px] text-text-tertiary tracking-tight">{d.label}</span>
            </div>
          );
        })}
      </div>
      {/* Overlay line — stylized */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="var(--brand-primary)"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
      {/* Latest value label */}
      <div className="absolute top-0 left-0 px-3 py-1.5 rounded-md bg-bg-surface border border-border-subtle">
        <p className="text-[10px] text-text-tertiary tracking-tight">إبريل</p>
        <p className="text-sm font-bold tabular tracking-tight text-brand-primary">
          {(data[data.length - 1].revenue / 1_000_000).toFixed(2)}م ج.م
        </p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- */
/*  Cost breakdown                                              */
/* ----------------------------------------------------------- */

function CostBreakdown() {
  const total = costBreakdown.reduce((s, c) => s + c.amount, 0);
  return (
    <div className="space-y-4">
      {/* Stacked bar */}
      <div className="h-3 rounded-full overflow-hidden flex">
        {costBreakdown.map((c) => {
          const pct = (c.amount / total) * 100;
          return (
            <div
              key={c.category}
              className="h-full"
              style={{ width: `${pct}%`, background: c.color }}
              title={`${c.category}: ${pct.toFixed(1)}%`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {costBreakdown.map((c) => {
          const pct = (c.amount / total) * 100;
          return (
            <li key={c.category} className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ background: c.color }}
                />
                <span className="text-xs tracking-tight truncate">{c.category}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-[11px] tabular">
                <span className="text-text-tertiary">{pct.toFixed(1)}%</span>
                <span className="font-medium">{(c.amount / 1000).toFixed(0)}ك</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
