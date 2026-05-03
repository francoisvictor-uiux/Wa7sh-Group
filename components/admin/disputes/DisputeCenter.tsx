"use client";

import { useState, useMemo } from "react";
import {
  AlertTriangle, Search, Camera, User, ChevronLeft,
  Factory, Truck, Building2, Scale, MessageSquare, Clock,
} from "lucide-react";
import {
  disputes as initialDisputes, disputeCounts, statusMeta, settlementMeta,
  type Dispute, type DisputeStatus, type SettlementParty,
} from "@/lib/mock/disputes";
import { brandMeta } from "@/lib/mock/branches";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { Button } from "@/components/ui/Button";
import { PageHeader, EmptyState, StatusPill } from "@/components/ui/page";
import { useDevice } from "@/hooks/useDevice";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

type Tab = "all" | "open" | "investigating" | "settled";

const TABS: { id: Tab; label: string; count: number }[] = [
  { id: "all",           label: "الكل",        count: disputeCounts.open + disputeCounts.investigating + disputeCounts.settled },
  { id: "open",          label: "مفتوح",       count: disputeCounts.open },
  { id: "investigating", label: "قيد المراجعة", count: disputeCounts.investigating },
  { id: "settled",       label: "محسوم",       count: disputeCounts.settled },
];

const partyIcons = {
  factory: Factory,
  driver:  Truck,
  branch:  Building2,
};

export function DisputeCenter() {
  const device = useDevice();
  const toast  = useToast();
  const [list, setList]         = useState<Dispute[]>(initialDisputes);
  const [selected, setSelected] = useState<Dispute | null>(initialDisputes.find((d) => d.status === "open") ?? null);
  const [tab, setTab]           = useState<Tab>("all");
  const [search, setSearch]     = useState("");

  const filtered = useMemo(() => {
    return list.filter((d) => {
      if (tab === "open")          return d.status === "open";
      if (tab === "investigating") return d.status === "investigating";
      if (tab === "settled")       return d.status.startsWith("settled");
      if (search) {
        const q = search.toLowerCase();
        return d.ticketNumber.toLowerCase().includes(q) ||
               d.branchName.toLowerCase().includes(q) ||
               d.driverName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [list, tab, search]);

  const liveSelected = selected ? list.find((d) => d.id === selected.id) ?? selected : null;

  const handleSettle = (party: SettlementParty, note: string) => {
    if (!liveSelected) return;
    const newStatus: DisputeStatus =
      party === "factory" ? "settled-factory" :
      party === "driver"  ? "settled-driver"  : "settled-branch";

    setList((prev) => prev.map((d) =>
      d.id === liveSelected.id
        ? {
            ...d,
            status: newStatus,
            settledAt: "الآن",
            settledBy: "الأونر",
            settlementParty: party,
            settlementNote: note,
          }
        : d
    ));
    toast.success("تم تسوية النزاع", `${liveSelected.ticketNumber} · ${settlementMeta[party].label}`);
  };

  // ── Mobile: stacked navigation ──────────────────────────────────────────
  if (device === "mobile") {
    return (
      <div className="relative h-[calc(100vh-56px)] overflow-hidden bg-bg-canvas">
        <div className={cn(
          "absolute inset-0 transition-transform duration-300 ease-out-expo overflow-y-auto",
          liveSelected ? "-translate-x-full" : "translate-x-0"
        )}>
          <DisputeListView
            list={list}
            filtered={filtered}
            tab={tab}
            setTab={setTab}
            search={search}
            setSearch={setSearch}
            selected={null}
            setSelected={setSelected}
          />
        </div>
        <div className={cn(
          "absolute inset-0 bg-bg-canvas transition-transform duration-300 ease-out-expo overflow-y-auto",
          liveSelected ? "translate-x-0" : "translate-x-full"
        )}>
          {liveSelected && (
            <DisputeDetailView
              dispute={liveSelected}
              onSettle={handleSettle}
              onBack={() => setSelected(null)}
            />
          )}
        </div>
      </div>
    );
  }

  // ── Tablet/Desktop: master-detail ──────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-64px)] bg-bg-canvas">
      <aside className="w-[400px] xl:w-[440px] shrink-0 border-l border-border-subtle bg-bg-surface flex flex-col">
        <DisputeListView
          list={list}
          filtered={filtered}
          tab={tab}
          setTab={setTab}
          search={search}
          setSearch={setSearch}
          selected={liveSelected}
          setSelected={setSelected}
          compact
        />
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto">
        {liveSelected ? (
          <DisputeDetailView dispute={liveSelected} onSettle={handleSettle} />
        ) : (
          <EmptyState
            icon={Scale}
            title="اختر تذكرة نزاع"
            description="ستظهر التفاصيل وأزرار التسوية هنا"
            size="lg"
            className="h-full"
          />
        )}
      </main>
    </div>
  );
}

/* ─── List view (right pane on desktop, full screen on mobile) ─────────── */

function DisputeListView({
  list, filtered, tab, setTab, search, setSearch, selected, setSelected, compact,
}: {
  list: Dispute[];
  filtered: Dispute[];
  tab: Tab;
  setTab: (t: Tab) => void;
  search: string;
  setSearch: (s: string) => void;
  selected: Dispute | null;
  setSelected: (d: Dispute | null) => void;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        icon={Scale}
        title="مركز فض المنازعات"
        description={
          disputeCounts.open + disputeCounts.investigating > 0
            ? `${disputeCounts.open + disputeCounts.investigating} نزاع نشط · ${disputeCounts.totalOpenLoss.toLocaleString()} ج.م قيد التسوية`
            : "لا توجد نزاعات نشطة"
        }
        meta={
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث برقم تذكرة، فرع، أو سائق..."
              className="w-full max-w-md h-9 pr-9 pl-3 text-sm rounded-lg bg-bg-surface-raised border border-border-subtle focus:outline-none focus:border-border-focus"
            />
          </div>
        }
      />

      {/* Status tabs */}
      <div className="flex overflow-x-auto border-b border-border-subtle px-2 gap-0.5 py-1.5 shrink-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors duration-fast",
              tab === t.id
                ? "bg-brand-primary text-text-on-brand"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-raised"
            )}
          >
            {t.label}
            {t.count > 0 && (
              <span className={cn(
                "min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold inline-flex items-center justify-center",
                tab === t.id ? "bg-white/20 text-white" : "bg-status-danger text-white"
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Scale}
            title="لا توجد نزاعات في هذه الفئة"
            size="sm"
          />
        ) : (
          filtered.map((d) => (
            <DisputeCard
              key={d.id}
              dispute={d}
              selected={selected?.id === d.id}
              onClick={() => setSelected(d)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Dispute card ────────────────────────────────────────────────────── */

function DisputeCard({ dispute, selected, onClick }: { dispute: Dispute; selected: boolean; onClick: () => void }) {
  const brand = brandMeta[dispute.brandId];
  const meta  = statusMeta[dispute.status];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-right rounded-xl border p-3.5 transition-all duration-fast",
        "hover:border-border-strong hover:bg-bg-surface-raised focus-visible:outline-none",
        selected
          ? "border-brand-primary bg-brand-primary/6 shadow-glow-brand"
          : "border-border-subtle bg-bg-surface"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BrandIcon brandId={dispute.brandId} size="xs" />
          <span className="text-[11px] text-text-tertiary font-mono">{dispute.ticketNumber}</span>
        </div>
        <StatusPill tone={meta.tone} label={meta.label} size="sm" />
      </div>

      <p className="text-sm font-semibold tracking-tight">{dispute.branchName}</p>
      <p className="text-[11px] text-text-tertiary mt-0.5">
        {brand.name} · شحنة {dispute.shipmentNumber}
      </p>

      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-border-subtle">
        <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
          <Truck className="w-3 h-3" strokeWidth={1.75} />
          {dispute.driverName}
        </div>
        <p className="text-base font-bold tabular text-status-danger">
          {dispute.totalLoss.toLocaleString()}
          <span className="text-[10px] text-text-tertiary font-medium mr-1">ج.م</span>
        </p>
      </div>
    </button>
  );
}

/* ─── Detail view (right pane / mobile detail) ─────────────────────────── */

function DisputeDetailView({
  dispute, onSettle, onBack,
}: {
  dispute: Dispute;
  onSettle: (party: SettlementParty, note: string) => void;
  onBack?: () => void;
}) {
  const brand    = brandMeta[dispute.brandId];
  const meta     = statusMeta[dispute.status];
  const isSettled = dispute.status.startsWith("settled");

  return (
    <div className="flex flex-col min-h-full">

      {/* Sub-header */}
      <div className="px-6 py-4 bg-bg-surface border-b border-border-subtle flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 -mr-1 rounded-xl flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-surface-raised transition-colors"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <BrandIcon brandId={dispute.brandId} size="xs" />
            <span className="text-[11px] text-text-tertiary font-mono">{dispute.ticketNumber}</span>
          </div>
          <h2 className="text-base font-bold tracking-tight">
            {dispute.branchName}
          </h2>
          <p className="text-[11px] text-text-tertiary">
            {brand.name} · شحنة {dispute.shipmentNumber}
          </p>
        </div>
        <StatusPill tone={meta.tone} label={meta.label} />
      </div>

      <div className="flex-1 px-6 py-5 space-y-5">

        {/* Loss summary card */}
        <div className="rounded-2xl bg-status-danger/8 border border-status-danger/25 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-status-danger font-semibold">
              قيمة العجز
            </p>
            <Clock className="w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />
          </div>
          <p className="text-3xl font-bold tabular text-status-danger leading-none">
            {dispute.totalLoss.toLocaleString()}
            <span className="text-base text-text-tertiary font-medium mr-1.5">ج.م</span>
          </p>
          <p className="text-[11px] text-text-tertiary mt-1.5">
            {dispute.createdAt} · بلغ بواسطة {dispute.reportedBy}
          </p>
        </div>

        {/* Items table */}
        <section>
          <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.2em] mb-3">
            الأصناف الناقصة
          </p>
          <div className="rounded-2xl bg-bg-surface border border-border-subtle overflow-hidden">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3 px-4 py-2.5 bg-bg-surface-raised border-b border-border-subtle">
              <span className="text-[10px] uppercase tracking-wide text-text-tertiary">الصنف</span>
              <span className="text-[10px] uppercase tracking-wide text-text-tertiary text-center">مطلوب</span>
              <span className="text-[10px] uppercase tracking-wide text-text-tertiary text-center">مستلم</span>
              <span className="text-[10px] uppercase tracking-wide text-text-tertiary text-left">الخسارة</span>
            </div>
            {dispute.items.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3 px-4 py-3 items-center",
                  idx < dispute.items.length - 1 && "border-b border-border-subtle"
                )}
              >
                <div>
                  <p className="text-xs font-medium">{item.name}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">
                    {item.unitPrice} ج.م / {item.unit}
                  </p>
                </div>
                <span className="text-xs text-center tabular">{item.expectedQty} {item.unit}</span>
                <span className="text-xs text-center tabular text-status-warning font-semibold">{item.receivedQty} {item.unit}</span>
                <span className="text-sm text-left font-bold tabular text-status-danger">
                  {item.loss.toLocaleString()} ج.م
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Evidence */}
        <section>
          <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.2em] mb-3">
            الأدلة المتاحة
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-bg-surface border border-border-subtle p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs font-semibold">{dispute.photoCount} صور</p>
                <p className="text-[11px] text-text-tertiary">من الفرع والسائق</p>
              </div>
            </div>
            <div className="rounded-2xl bg-bg-surface border border-border-subtle p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs font-semibold">{dispute.driverName}</p>
                <p className="text-[11px] text-text-tertiary">السائق</p>
              </div>
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="space-y-2.5">
          <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.2em]">
            الملاحظات
          </p>
          <NoteCard
            icon={Building2}
            label={`الفرع · ${dispute.reportedBy}`}
            text={dispute.branchNote}
            tone="warning"
          />
          {dispute.driverNote && (
            <NoteCard
              icon={Truck}
              label={`السائق · ${dispute.driverName}`}
              text={dispute.driverNote}
              tone="info"
            />
          )}
        </section>

        {/* Settlement (if already settled) */}
        {isSettled && dispute.settlementParty && (
          <section className="rounded-2xl bg-status-success/8 border border-status-success/25 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-status-success" strokeWidth={1.75} />
              <p className="text-xs font-semibold text-status-success">
                {settlementMeta[dispute.settlementParty].label}
              </p>
            </div>
            {dispute.settlementNote && (
              <p className="text-xs text-text-secondary">{dispute.settlementNote}</p>
            )}
            <p className="text-[11px] text-text-tertiary">
              {dispute.settledAt} · بواسطة {dispute.settledBy}
            </p>
          </section>
        )}
      </div>

      {/* Settlement bar — only when not yet settled */}
      {!isSettled && (
        <SettlementBar
          dispute={dispute}
          onSettle={onSettle}
        />
      )}
    </div>
  );
}

function NoteCard({
  icon: Icon, label, text, tone,
}: {
  icon: typeof Building2;
  label: string;
  text: string;
  tone: "warning" | "info";
}) {
  const styles = tone === "warning"
    ? "bg-status-warning/8 border-status-warning/25"
    : "bg-status-info/8 border-status-info/25";
  const iconStyle = tone === "warning" ? "text-status-warning" : "text-status-info";

  return (
    <div className={cn("rounded-2xl border p-3 flex gap-2.5", styles)}>
      <div className={cn("w-9 h-9 rounded-xl bg-bg-surface flex items-center justify-center shrink-0", iconStyle)}>
        <Icon className="w-4 h-4" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-text-tertiary mb-1 font-semibold">
          {label}
        </p>
        <p className="text-xs text-text-secondary leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

/* ─── Settlement bar — the 3 decision buttons ──────────────────────────── */

function SettlementBar({
  dispute, onSettle,
}: {
  dispute: Dispute;
  onSettle: (party: SettlementParty, note: string) => void;
}) {
  const [confirming, setConfirming] = useState<SettlementParty | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    if (!confirming) return;
    setLoading(true);
    setTimeout(() => {
      onSettle(confirming, note);
      setLoading(false);
      setConfirming(null);
      setNote("");
    }, 800);
  };

  return (
    <div className="border-t border-border-subtle bg-bg-surface px-6 py-4 space-y-3">
      {confirming ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-status-warning" strokeWidth={2} />
            <p className="text-text-secondary">
              تأكيد: <span className="font-semibold text-text-primary">{settlementMeta[confirming].label}</span>
            </p>
          </div>
          <p className="text-[11px] text-text-tertiary">{settlementMeta[confirming].description}</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ملاحظة (اختياري) — تظهر في السجل المحاسبي..."
            rows={2}
            className="w-full resize-none rounded-xl border border-border-subtle bg-bg-surface-raised px-3 py-2 text-xs focus:outline-none focus:border-brand-primary transition-colors"
          />
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
              onClick={handleConfirm}
            >
              تأكيد التسوية
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => { setConfirming(null); setNote(""); }}
            >
              إلغاء
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.2em]">
            قرار التسوية
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(Object.entries(settlementMeta) as [SettlementParty, typeof settlementMeta[SettlementParty]][])
              .map(([party, meta]) => {
                const Icon = partyIcons[party];
                const suggested = dispute.blameSuggestion === party;
                return (
                  <button
                    key={party}
                    type="button"
                    onClick={() => setConfirming(party)}
                    className={cn(
                      "rounded-xl border p-3 text-right transition-all duration-fast",
                      "hover:border-border-strong hover:bg-bg-surface-raised",
                      suggested
                        ? "border-brand-primary/40 bg-brand-primary/5"
                        : "border-border-subtle bg-bg-surface"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon className={cn(
                        "w-4 h-4",
                        meta.tone === "danger"  && "text-status-danger",
                        meta.tone === "warning" && "text-status-warning",
                        meta.tone === "info"    && "text-status-info",
                      )} strokeWidth={1.75} />
                      {suggested && (
                        <span className="text-[9px] font-semibold text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded-full">
                          مرشّح
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold tracking-tight mb-0.5">{meta.label}</p>
                    <p className="text-[10px] text-text-tertiary leading-relaxed line-clamp-2">
                      {meta.description}
                    </p>
                  </button>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
