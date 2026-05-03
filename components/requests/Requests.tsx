"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus, ArrowLeft, Download, Inbox, Zap, ClipboardList,
  Clock, Check, ChefHat, Package, Truck, CheckCircle2, PauseCircle,
  AlertCircle, XCircle, Archive, type LucideIcon,
} from "lucide-react";
import {
  requests, statusCounts, pendingApprovals, statusMeta,
  type RequestStatus, type RequestRecord,
} from "@/lib/mock/requests";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { KpiTile } from "@/components/ui/KpiTile";
import {
  PageShell, PageHeader, SearchInput, FilterTabs, StatusPill, EmptyState,
  type FilterTab,
} from "@/components/ui/page";
import { useDevice } from "@/hooks/useDevice";

type Tab = "all" | "pending" | "in-progress" | "delivered" | "issues";

const tabs: FilterTab<Tab>[] = [
  { k: "all",         label: "الكل",        count: statusCounts.total },
  { k: "pending",     label: "بانتظار موافقة", count: statusCounts.pending },
  { k: "in-progress", label: "قيد التنفيذ",  count: statusCounts.inProgress },
  { k: "delivered",   label: "تم التسليم",    count: statusCounts.delivered },
  { k: "issues",      label: "نزاعات",        count: statusCounts.issues },
];

const inProgressStatuses: RequestStatus[] = ["approved", "preparing", "loaded", "in-transit"];
const deliveredStatuses:  RequestStatus[] = ["delivered", "confirmed", "closed"];
const issueStatuses:      RequestStatus[] = ["disputed", "rejected", "on-hold"];

export const statusIcon: Record<RequestStatus, LucideIcon> = {
  requested:    Clock,
  approved:     Check,
  preparing:    ChefHat,
  loaded:       Package,
  "in-transit": Truck,
  delivered:    CheckCircle2,
  confirmed:    CheckCircle2,
  closed:       Archive,
  "on-hold":    PauseCircle,
  disputed:     AlertCircle,
  rejected:     XCircle,
  cancelled:    XCircle,
};

export function Requests() {
  const device = useDevice();
  const [tab, setTab]       = useState<Tab>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      if (tab === "pending"     && r.status !== "requested")             return false;
      if (tab === "in-progress" && !inProgressStatuses.includes(r.status)) return false;
      if (tab === "delivered"   && !deliveredStatuses.includes(r.status))  return false;
      if (tab === "issues"      && !issueStatuses.includes(r.status))      return false;
      if (q && !(
        r.number.toLowerCase().includes(q) ||
        r.fromBranchName.toLowerCase().includes(q) ||
        r.createdBy.toLowerCase().includes(q)
      )) return false;
      return true;
    });
  }, [tab, search]);

  const useTable = device !== "mobile";

  return (
    <PageShell
      header={
        <PageHeader
          icon={ClipboardList}
          title="الطلبات"
          description="تتبع كل طلبات الفروع للمصنع — من الإنشاء للموافقة للتسليم"
          actions={
            <>
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<Download className="w-3.5 h-3.5" strokeWidth={1.75} />}
                className="hidden md:inline-flex"
              >
                تصدير
              </Button>
              <Link href="/requests/new" className="hidden md:block">
                <Button size="sm" leadingIcon={<Plus className="w-3.5 h-3.5" strokeWidth={2.5} />}>
                  طلب جديد
                </Button>
              </Link>
            </>
          }
          meta={
            <div className="flex flex-col md:flex-row md:items-center gap-3 mt-3 w-full">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="ابحث برقم الطلب، الفرع، أو الموظف…"
                size="md"
                className="md:max-w-xs"
              />
              <div className="flex-1 min-w-0">
                <FilterTabs options={tabs} active={tab} onChange={setTab} size="md" />
              </div>
            </div>
          }
        />
      }
    >
      {/* KPI strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiTile
          label="بانتظار موافقة"
          value={statusCounts.pending}
          tone="warning"
          emphasis={statusCounts.pending > 0}
          hint={statusCounts.pending > 0 ? "راجع الآن" : "كل شيء على ما يرام"}
        />
        <KpiTile label="قيد التنفيذ" value={statusCounts.inProgress} tone="brand" />
        <KpiTile label="مكتمل" value={statusCounts.delivered} tone="success" />
        <KpiTile label="نزاعات" value={statusCounts.issues} tone="danger" emphasis={statusCounts.issues > 0} />
      </section>

      {/* Pending approvals callout */}
      {pendingApprovals.length > 0 && <PendingCallout />}

      {/* List / Table */}
      {filtered.length > 0 ? (
        useTable ? (
          <RequestsTable rows={filtered} />
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => <RequestRow key={r.id} request={r} />)}
          </div>
        )
      ) : (
        <Card padding="none">
          <EmptyState
            icon={Inbox}
            title="لا توجد طلبات بهذه المرشّحات"
            description="جرّب فلترة مختلفة أو ابدأ طلبًا جديدًا."
            action={
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setTab("all"); setSearch(""); }}
                >
                  إعادة الضبط
                </Button>
                <Link href="/requests/new">
                  <Button size="sm" leadingIcon={<Plus className="w-3.5 h-3.5" strokeWidth={2.5} />}>
                    طلب جديد
                  </Button>
                </Link>
              </div>
            }
          />
        </Card>
      )}

      {/* Mobile FAB */}
      <Link
        href="/requests/new"
        aria-label="طلب جديد"
        className={
          "md:hidden fixed bottom-[88px] right-4 z-20 " +
          "w-14 h-14 rounded-full bg-brand-primary text-text-on-brand " +
          "shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        }
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </Link>
    </PageShell>
  );
}

/* ---------------- Pending callout ---------------- */

function PendingCallout() {
  const oldest = pendingApprovals[0];
  return (
    <Card padding="md" className="border-status-warning/40 bg-status-warning/8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-status-warning/15 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-status-warning" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight">
              {pendingApprovals.length} طلب ينتظر موافقتك
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              أقدمها {oldest.number} من {oldest.fromBranchName}
            </p>
          </div>
        </div>
        <Link
          href={`/requests/detail?id=${oldest.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-status-warning hover:text-status-warning/80 transition-colors shrink-0"
        >
          راجع الآن
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
        </Link>
      </div>
    </Card>
  );
}

/* ---------------- Desktop / tablet table ---------------- */

function RequestsTable({ rows }: { rows: RequestRecord[] }) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-surface-raised/60 border-b border-border-subtle">
            <tr className="text-right text-[10px] tracking-[0.18em] uppercase text-text-tertiary font-semibold">
              <th className="px-5 py-3">رقم الطلب</th>
              <th className="px-3 py-3">الفرع</th>
              <th className="px-3 py-3">الأصناف</th>
              <th className="px-3 py-3">الأولوية</th>
              <th className="px-3 py-3">الحالة</th>
              <th className="px-3 py-3">الإنشاء</th>
              <th className="px-5 py-3 text-left" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const meta  = statusMeta[r.status];
              const SIcon = statusIcon[r.status];
              return (
                <tr
                  key={r.id}
                  className="border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised/40 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-medium tabular tracking-tight">{r.number}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="text-sm tracking-tight">{r.fromBranchName}</p>
                    <p className="text-[11px] text-text-tertiary mt-0.5">{r.createdBy}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="text-sm tabular tracking-tight">{r.itemCount} صنف</p>
                    <p className="text-[11px] text-text-tertiary line-clamp-1 max-w-[260px]">
                      {r.items.slice(0, 3).map((i) => i.name).join(" · ")}
                    </p>
                  </td>
                  <td className="px-3 py-3.5">
                    {r.priority === "rush" ? (
                      <StatusPill tone="danger" icon={Zap} label="طارئ" size="sm" />
                    ) : r.priority === "scheduled" ? (
                      <StatusPill tone="info" label="مجدول" size="sm" />
                    ) : (
                      <span className="text-xs text-text-tertiary">عادي</span>
                    )}
                  </td>
                  <td className="px-3 py-3.5">
                    <StatusPill tone={meta.intent} icon={SIcon} label={meta.label} size="sm" />
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="text-xs text-text-tertiary tabular whitespace-nowrap">{r.createdAt}</p>
                  </td>
                  <td className="px-5 py-3.5 text-left">
                    <Link
                      href={`/requests/detail?id=${r.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors"
                    >
                      عرض
                      <ArrowLeft className="w-3 h-3" strokeWidth={2.5} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ---------------- Mobile row card ---------------- */

function RequestRow({ request }: { request: RequestRecord }) {
  const meta  = statusMeta[request.status];
  const SIcon = statusIcon[request.status];
  const isPending = request.status === "requested";
  const isUrgent  = request.priority === "rush";

  return (
    <Link href={`/requests/detail?id=${request.id}`} className="block group">
      <Card
        padding="md"
        className="group-hover:border-border-strong group-hover:shadow-md transition-all duration-fast"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="text-sm font-semibold tabular tracking-tight">{request.number}</span>
            {isUrgent && <StatusPill tone="danger" icon={Zap} label="طارئ" size="sm" />}
          </div>
          <StatusPill tone={meta.intent} icon={SIcon} label={meta.label} size="sm" />
        </div>

        <div className="text-xs text-text-tertiary mb-3 tracking-tight">
          {request.fromBranchName} · {request.createdBy}
        </div>

        <div className="mb-3">
          <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-0.5 font-semibold">
            {request.itemCount} صنف
          </p>
          <p className="text-sm text-text-secondary tracking-tight leading-relaxed line-clamp-2">
            {request.items.slice(0, 3).map((i) => i.name).join(" · ")}
            {request.items.length > 3 && ` +${request.items.length - 3}`}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border-subtle">
          <p className="text-[11px] text-text-tertiary truncate">{request.createdAt}</p>
          {isPending && (
            <span className="text-[11px] font-semibold text-status-warning shrink-0">
              ينتظر موافقتك
            </span>
          )}
          {request.scheduledDelivery && !isPending && (
            <p className="text-[11px] text-brand-primary font-semibold tabular shrink-0">
              {request.scheduledDelivery.replace("اليوم · ", "")}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
