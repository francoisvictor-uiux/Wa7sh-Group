"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  User,
  AlertCircle,
  Check,
  X,
  Edit,
  Zap,
  MessageSquare,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { useAuth } from "@/hooks/useAuth";
import { requests, type RequestRecord } from "@/lib/mock/requests";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RequestStatusPill } from "./RequestStatusPill";
import { RequestTimeline } from "./RequestTimeline";
import { SwipeApproval } from "./SwipeApproval";
import { cn } from "@/lib/utils";

export function RequestDetail({ requestId }: { requestId: string }) {
  const device = useDevice();
  const router = useRouter();
  const { user } = useAuth();
  const request = requests.find((r) => r.id === requestId) ?? requests[0];
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);

  // Only factory-scope users can approve/reject — branch users cannot
  const isFactory = user?.scope === "factory" || user?.scope === "group";
  const canApprove = isFactory && Boolean(request.isForMyApproval) && !approved && !rejected;

  const handleApprove = () => {
    setApproved(true);
    window.setTimeout(() => router.push("/requests"), 700);
  };

  const handleReject = () => {
    setRejected(true);
    window.setTimeout(() => router.push("/requests"), 700);
  };

  const props = { request, canApprove, isFactory, approved, rejected, onApprove: handleApprove, onReject: handleReject };

  if (device === "mobile")  return <RequestDetailMobile  {...props} />;
  if (device === "desktop") return <RequestDetailDesktop {...props} />;
  return <RequestDetailTablet {...props} />;
}

/* =======================================================================
   Mobile — single column, vertical timeline, swipe approval
   ======================================================================= */

interface DetailViewProps {
  request: RequestRecord;
  canApprove: boolean;
  isFactory: boolean;
  approved: boolean;
  rejected: boolean;
  onApprove: () => void;
  onReject: () => void;
}

function RequestDetailMobile({ request, canApprove, isFactory, approved, rejected, onApprove, onReject }: DetailViewProps) {
  return (
    <div className="px-4 pt-4 pb-24 space-y-4">
      <Link href="/requests" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors">
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        كل الطلبات
      </Link>

      {/* Header */}
      <Card padding="md">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase mb-1">رقم الطلب</p>
            <p className="text-xl font-bold tabular tracking-tight">{request.number}</p>
          </div>
          <RequestStatusPill status={request.status} size="md" pulse={request.status === "requested"} />
        </div>
        {request.priority === "rush" && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-status-danger/12 border border-status-danger/30">
            <Zap className="w-3 h-3 text-status-danger" strokeWidth={2.5} />
            <span className="text-xs font-medium text-status-danger tracking-tight">طلب طارئ — أولوية قصوى</span>
          </div>
        )}
        {/* Meta only for factory */}
        {isFactory && (
          <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-border-subtle">
            <Meta icon={<Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />} label="من" value={request.fromBranchName} />
            <Meta icon={<User className="w-3.5 h-3.5" strokeWidth={1.75} />} label="بواسطة" value={request.createdBy} />
            <Meta icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />} label="الإنشاء" value={request.createdAt} />
            {request.scheduledDelivery && <Meta icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />} label="التسليم" value={request.scheduledDelivery} accent />}
          </div>
        )}
      </Card>

      {/* Note — factory only */}
      {isFactory && request.note && (
        <Card padding="md" className="bg-status-info/8 border-status-info/30">
          <div className="flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 text-status-info shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="text-xs font-medium tracking-tight mb-1">ملاحظة من المُرسِل</p>
              <p className="text-xs text-text-secondary leading-relaxed">{request.note}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Timeline */}
      <Card padding="md">
        <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">
          مسار الطلب
        </p>
        <RequestTimeline request={request} orientation="vertical" />
      </Card>

      {/* Items */}
      <Card padding="none">
        <div className="px-4 pt-4 pb-2 border-b border-border-subtle">
          <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">
            الأصناف ({request.itemCount})
          </p>
        </div>
        <ul>
          {request.items.map((it) => (
            <li
              key={it.catalogId}
              className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border-subtle last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium tracking-tight truncate">
                  {it.name}
                </p>
                <p className="text-[11px] text-text-tertiary tabular">
                  /{it.unit}
                </p>
              </div>
              <div className="text-left shrink-0">
                <p className="text-sm font-bold tabular tracking-tight">
                  {it.quantity} {it.unit}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="px-4 py-3 border-t border-border-subtle bg-bg-surface-raised/40">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-text-secondary">الإجمالي</span>
            <span className="text-xl font-bold tabular tracking-tight">
              {request.itemCount}
              <span className="text-xs text-text-tertiary font-normal mr-1">صنف</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Approval actions — sticky bottom */}
      {canApprove && (
        <div
          className={cn(
            "fixed bottom-[68px] inset-x-0 z-20",
            "bg-bg-canvas/95 backdrop-blur-md border-t border-border-subtle",
            "px-4 py-4"
          )}
        >
          <p className="text-xs text-text-secondary text-center mb-3 tracking-tight">
            اسحب للموافقة ⏶ أو الرفض ⏷
          </p>
          <SwipeApproval onApprove={onApprove} onReject={onReject} />
        </div>
      )}

      {/* Confirmation overlays */}
      {(approved || rejected) && (
        <Confirmation type={approved ? "approve" : "reject"} />
      )}
    </div>
  );
}

/* =======================================================================
   Tablet
   ======================================================================= */

function RequestDetailTablet({ request, canApprove, isFactory, approved, rejected, onApprove, onReject }: DetailViewProps) {
  return (
    <div className="px-6 py-6 max-w-[1280px] mx-auto space-y-6">
      <Link
        href="/requests"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        كل الطلبات
      </Link>

      {/* Header */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase">
              رقم الطلب
            </p>
            {request.priority === "rush" && (
              <Badge intent="danger" size="sm">
                <Zap className="w-3 h-3" strokeWidth={2.5} />
                طلب طارئ
              </Badge>
            )}
            {request.isForMyApproval && (
              <Badge intent="warning" size="sm" pulse dot>
                ينتظر موافقتك
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tabular tracking-tight">
            {request.number}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {request.fromBranchName} ← {request.toFactory}
          </p>
        </div>
        <RequestStatusPill
          status={request.status}
          size="md"
          pulse={request.status === "requested"}
        />
      </header>

      {/* Meta strip — factory only */}
      {isFactory && (
        <Card padding="md">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Meta icon={<User className="w-3.5 h-3.5" strokeWidth={1.75} />} label="بواسطة" value={request.createdBy} />
            <Meta icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />} label="الإنشاء" value={request.createdAt} />
            {request.approvedBy && <Meta icon={<Check className="w-3.5 h-3.5" strokeWidth={1.75} />} label="وافق" value={`${request.approvedBy} · ${request.approvedAt}`} />}
            {request.scheduledDelivery && <Meta icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />} label="موعد التسليم" value={request.scheduledDelivery} accent />}
          </div>
        </Card>
      )}

      {/* Timeline */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">مسار الطلب</p>
            <h2 className="text-base font-medium tracking-tight">تتبع كامل من الإنشاء للإغلاق</h2>
          </div>
        </div>
        <RequestTimeline request={request} orientation="horizontal" />
      </Card>

      {/* Note — factory only */}
      {isFactory && request.note && (
        <Card padding="md" className="bg-status-info/8 border-status-info/30">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-4 h-4 text-status-info shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-medium tracking-tight mb-1">ملاحظة من المُرسِل</p>
              <p className="text-sm text-text-secondary leading-relaxed">{request.note}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Items — full width for branch, with action panel for factory */}
      <div className={cn("grid gap-5", isFactory && canApprove ? "grid-cols-1 lg:grid-cols-[1fr_320px]" : "grid-cols-1")}>
        <Card padding="none">
          <div className="px-5 pt-5 pb-3 border-b border-border-subtle">
            <h2 className="text-base font-medium tracking-tight">الأصناف ({request.itemCount})</h2>
            <p className="text-xs text-text-tertiary mt-0.5">{request.items.reduce((s, i) => s + i.quantity, 0)} وحدة إجمالية</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-bg-surface-raised/40 border-b border-border-subtle">
              <tr className="text-right text-[11px] tracking-[0.16em] uppercase text-text-tertiary">
                <th className="px-5 py-2.5 font-medium">الصنف</th>
                <th className="px-5 py-2.5 font-medium text-left">الكمية</th>
              </tr>
            </thead>
            <tbody>
              {request.items.map((it) => (
                <tr key={it.catalogId} className="border-b border-border-subtle last:border-0">
                  <td className="px-5 py-3"><p className="font-medium tracking-tight">{it.name}</p></td>
                  <td className="px-5 py-3 tabular text-sm font-medium text-left">{it.quantity} {it.unit}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-bg-surface-raised/30">
                <td className="px-5 py-3 text-sm text-text-secondary">إجمالي الكميات</td>
                <td className="px-5 py-3 text-left text-lg font-bold tabular">
                  {request.items.reduce((s, i) => s + i.quantity, 0)}
                  <span className="text-xs text-text-tertiary font-normal mr-1">وحدة</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </Card>

        {/* Action panel — factory only */}
        {isFactory && canApprove && (
          <Card padding="md" className="bg-status-warning/8 border-status-warning/40">
            <p className="text-[11px] tracking-[0.16em] uppercase text-status-warning mb-2">ينتظر قرارك</p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">هذا الطلب من فرع {request.fromBranchName}. راجع الكميات، ثم وافق أو ارفض.</p>
            <div className="space-y-2">
              <Button onClick={onApprove} size="lg" fullWidth><Check className="w-4 h-4" strokeWidth={2.5} />وافق على الطلب</Button>
              <Button onClick={onReject} variant="danger" size="md" fullWidth><X className="w-4 h-4" strokeWidth={2.5} />ارفض</Button>
              <Button variant="ghost" size="md" fullWidth><Edit className="w-4 h-4" strokeWidth={1.75} />عدّل قبل الموافقة</Button>
            </div>
          </Card>
        )}
      </div>

      {(approved || rejected) && (
        <Confirmation type={approved ? "approve" : "reject"} />
      )}
    </div>
  );
}

/* =======================================================================
   Desktop
   ======================================================================= */

function RequestDetailDesktop({ request, canApprove, isFactory, approved, rejected, onApprove, onReject }: DetailViewProps) {
  return (
    <div className="px-8 py-7 max-w-[1600px] mx-auto space-y-6">
      <Link
        href="/requests"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
        كل الطلبات
      </Link>

      {/* Header */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <p className="text-[11px] text-text-tertiary tracking-[0.16em] uppercase">
              رقم الطلب · #{request.id.toUpperCase()}
            </p>
            {request.priority === "rush" && (
              <Badge intent="danger" size="sm">
                <Zap className="w-3 h-3" strokeWidth={2.5} />
                طلب طارئ
              </Badge>
            )}
            {request.isForMyApproval && (
              <Badge intent="warning" size="sm" pulse dot>
                ينتظر موافقتك
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold tabular tracking-tight">
            {request.number}
          </h1>
          <p className="text-sm text-text-secondary mt-2">
            {request.fromBranchName} ← {request.toFactory}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <RequestStatusPill
            status={request.status}
            size="md"
            pulse={request.status === "requested"}
          />
          <p className="text-3xl font-bold tabular tracking-tight">
            {request.itemCount}
            <span className="text-sm text-text-tertiary font-normal mr-1.5">صنف</span>
          </p>
        </div>
      </header>

      <div className="gold-hairline" />

      {/* Timeline strip */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-1">
              مسار الطلب
            </p>
            <h2 className="text-base font-medium tracking-tight">
              تتبع كامل من الإنشاء للإغلاق
            </h2>
          </div>
          <Badge intent="brand" size="sm">
            8 خطوات
          </Badge>
        </div>
        <RequestTimeline request={request} orientation="horizontal" />
      </Card>

      <div className={cn("grid gap-6", isFactory ? "grid-cols-1 xl:grid-cols-[1fr_400px]" : "grid-cols-1")}>
        {/* Main column */}
        <div className="space-y-5 min-w-0">
          {/* Note — factory only */}
          {isFactory && request.note && (
            <Card padding="md" className="bg-status-info/8 border-status-info/30">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-status-info shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="text-sm font-medium tracking-tight mb-1">ملاحظة من المُرسِل</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{request.note}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Items table */}
          <Card padding="none">
            <div className="px-6 pt-6 pb-4 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium tracking-tight">الأصناف</h2>
                <p className="text-xs text-text-tertiary mt-0.5">
                  {request.itemCount} صنف · {request.items.reduce((s, i) => s + i.quantity, 0)} وحدة
                </p>
              </div>
              {isFactory && (
                <Button variant="secondary" size="sm">
                  <Edit className="w-3.5 h-3.5" strokeWidth={1.75} />
                  تعديل
                </Button>
              )}
            </div>
            <table className="w-full text-sm">
              <thead className="bg-bg-surface-raised/40 border-b border-border-subtle">
                <tr className="text-right text-[11px] tracking-[0.16em] uppercase text-text-tertiary">
                  <th className="px-6 py-3 font-medium">الصنف</th>
                  <th className="px-3 py-3 font-medium">SKU</th>
                  <th className="px-6 py-3 font-medium text-left">الكمية</th>
                </tr>
              </thead>
              <tbody>
                {request.items.map((it) => (
                  <tr
                    key={it.catalogId}
                    className="border-b border-border-subtle last:border-0 hover:bg-bg-surface-raised/40 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <p className="font-medium tracking-tight">{it.name}</p>
                    </td>
                    <td className="px-3 py-3.5 tabular text-xs text-text-tertiary">
                      {it.catalogId}
                    </td>
                    <td className="px-6 py-3.5 tabular font-medium text-left">
                      {it.quantity} {it.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-bg-surface-raised/30">
                  <td colSpan={2} className="px-6 py-4 text-sm text-text-secondary">
                    إجمالي الكميات
                  </td>
                  <td className="px-6 py-4 text-left text-xl font-bold tabular tracking-tight">
                    {request.items.reduce((s, i) => s + i.quantity, 0)}
                    <span className="text-xs text-text-tertiary font-normal mr-1">
                      وحدة
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </Card>
        </div>

        {/* Right rail — factory only */}
        {isFactory && <aside className="space-y-5 min-w-0">
          <Card padding="md">
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">
              تفاصيل الطلب
            </p>
            <ul className="space-y-3">
              <MetaRow label="الفرع المُرسل" value={request.fromBranchName} icon={<Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />} />
              <MetaRow label="الوجهة" value={request.toFactory} icon={<Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />} />
              <MetaRow label="بواسطة" value={request.createdBy} icon={<User className="w-3.5 h-3.5" strokeWidth={1.75} />} />
              <MetaRow label="الإنشاء" value={request.createdAt} icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />} />
              {request.approvedBy && (
                <MetaRow label="وافق عليه" value={`${request.approvedBy}`} icon={<Check className="w-3.5 h-3.5" strokeWidth={1.75} />} />
              )}
              {request.scheduledDelivery && (
                <MetaRow
                  label="موعد التسليم"
                  value={request.scheduledDelivery}
                  icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />}
                  accent
                />
              )}
            </ul>
          </Card>

          {canApprove ? (
            <Card padding="md" className="bg-status-warning/8 border-status-warning/40">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-status-warning" strokeWidth={2} />
                <p className="text-sm font-medium tracking-tight text-status-warning">
                  ينتظر قرارك
                </p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                راجع الكميات، ثم وافق أو ارفض الطلب. الموافقة تنشئ تلقائيًا أمر تحضير في المصنع.
              </p>
              <div className="space-y-2">
                <Button onClick={onApprove} size="lg" fullWidth>
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  وافق على الطلب
                </Button>
                <Button onClick={onReject} variant="danger" size="md" fullWidth>
                  <X className="w-4 h-4" strokeWidth={2.5} />
                  ارفض
                </Button>
                <Button variant="ghost" size="md" fullWidth>
                  <Edit className="w-4 h-4" strokeWidth={1.75} />
                  عدّل قبل الموافقة
                </Button>
              </div>
            </Card>
          ) : (
            <Card padding="md">
              <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-3">
                إجراءات
              </p>
              <div className="space-y-2">
                <Button variant="secondary" size="md" fullWidth>
                  طباعة الفاتورة
                </Button>
                <Button variant="ghost" size="md" fullWidth>
                  نسخ كقالب جديد
                </Button>
                <Button variant="ghost" size="md" fullWidth>
                  تصدير PDF
                </Button>
              </div>
            </Card>
          )}
        </aside>}
      </div>

      {(approved || rejected) && (
        <Confirmation type={approved ? "approve" : "reject"} />
      )}
    </div>
  );
}

/* =======================================================================
   Shared subcomponents
   ======================================================================= */

function Meta({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary tracking-[0.14em] uppercase mb-1">
        <span className="text-text-tertiary">{icon}</span>
        {label}
      </div>
      <p
        className={cn(
          "text-sm font-medium tracking-tight truncate",
          accent && "text-brand-primary tabular"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-[11px] text-text-tertiary tracking-tight">
        <span>{icon}</span>
        {label}
      </div>
      <span
        className={cn(
          "text-xs font-medium tracking-tight text-left truncate",
          accent && "text-brand-primary tabular"
        )}
      >
        {value}
      </span>
    </li>
  );
}

function Confirmation({ type }: { type: "approve" | "reject" }) {
  const isApprove = type === "approve";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fadein">
      <Card
        padding="lg"
        className={cn(
          "max-w-sm mx-4 text-center",
          isApprove
            ? "border-status-success/40 bg-status-success/8"
            : "border-status-danger/40 bg-status-danger/8"
        )}
      >
        <div
          className={cn(
            "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
            isApprove
              ? "bg-status-success text-white"
              : "bg-status-danger text-white"
          )}
        >
          {isApprove ? (
            <Check className="w-8 h-8" strokeWidth={2.5} />
          ) : (
            <X className="w-8 h-8" strokeWidth={2.5} />
          )}
        </div>
        <p className="text-base font-medium tracking-tight">
          {isApprove ? "تمت الموافقة" : "تم الرفض"}
        </p>
        <p className="text-sm text-text-secondary mt-1">
          {isApprove
            ? "أمر التحضير أُرسل للمصنع تلقائيًا"
            : "سيُبلَّغ المُرسِل بالقرار"}
        </p>
      </Card>
    </div>
  );
}
