"use client";

import { useState, useMemo, useEffect, useDeferredValue } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  LayoutGrid,
  Rows3,
  SlidersHorizontal,
  X,
  ClipboardList,
  Clock,
  ChefHat,
  Truck,
  PackageCheck,
  AlertTriangle,
  ChevronUp,
  ChevronLeft,
  Zap,
  Boxes,
  RotateCw,
  CheckCircle2,
  UserCircle2,
  Route,
  Send,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useDevice } from "@/hooks/useDevice";
import { type FactoryRequest } from "@/lib/mock/factoryRequests";
import { DispatchPanel } from "./DispatchPanel";
import type { RequestStatus } from "@/lib/mock/requests";
import { useRequestsDB } from "@/lib/db/requests";
import { allBranches, brandMeta, type BrandId } from "@/lib/mock/branches";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToastContext } from "@/context/ToastContext";
import { Highlight } from "@/components/suppliers/SupplierHighlight";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "table";
type SortKey = "createdAt" | "branch" | "items" | "delivery";
type SortDir = "asc" | "desc";
type StatusGroup = "all" | "pending" | "preparing" | "in-transit" | "delivered" | "issues";

const STATUS_GROUPS: { key: StatusGroup; label: string; statuses: RequestStatus[]; tone: "neutral" | "info" | "warning" | "success" | "danger"; Icon: LucideIcon }[] = [
  { key: "all",        label: "الكل",          statuses: [],                                                 tone: "neutral", Icon: ClipboardList },
  { key: "pending",    label: "بانتظار",       statuses: ["requested"],                                      tone: "warning", Icon: Clock },
  { key: "preparing",  label: "قيد التحضير",  statuses: ["approved", "preparing"],                          tone: "info",    Icon: ChefHat },
  { key: "in-transit", label: "في الطريق",     statuses: ["in-transit"],                                     tone: "info",    Icon: Truck },
  { key: "delivered",  label: "تم التسليم",   statuses: ["delivered", "confirmed", "closed"],               tone: "success", Icon: PackageCheck },
  { key: "issues",     label: "نزاعات",        statuses: ["disputed", "rejected", "on-hold", "cancelled"],   tone: "danger",  Icon: AlertTriangle },
];

const statusMeta: Record<RequestStatus, { label: string; intent: "neutral" | "info" | "success" | "warning" | "danger" | "brand" }> = {
  requested:    { label: "بانتظار موافقة", intent: "warning" },
  approved:     { label: "تمت الموافقة",   intent: "info" },
  preparing:    { label: "قيد التحضير",    intent: "info" },
  loaded:       { label: "محمّل",            intent: "brand" },
  "in-transit": { label: "في الطريق",       intent: "info" },
  delivered:    { label: "تم التسليم",      intent: "success" },
  confirmed:    { label: "مُؤكَّد",            intent: "success" },
  closed:       { label: "مُغلَق",             intent: "neutral" },
  "on-hold":    { label: "متوقف مؤقتاً",     intent: "warning" },
  disputed:     { label: "متنازع عليه",     intent: "danger" },
  rejected:     { label: "مرفوض",            intent: "danger" },
  cancelled:    { label: "مُلغى",              intent: "neutral" },
};

const STATUS_ADVANCE_OPTIONS: { label: string; status: RequestStatus; Icon: LucideIcon; tone: string }[] = [
  { label: "موافقة على الطلب", status: "approved",   Icon: CheckCircle2,  tone: "text-status-success" },
  { label: "بدء التحضير",      status: "preparing",  Icon: ChefHat,       tone: "text-status-info"    },
  { label: "إرسال للفرع",      status: "in-transit", Icon: Truck,         tone: "text-status-info"    },
];

interface MockDriver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: "available" | "on-route" | "off-shift";
}

const DRIVERS: MockDriver[] = [
  { id: "d-1", name: "محمود علي",   phone: "01001234567", vehicle: "فان مبرّد · 3201", status: "available" },
  { id: "d-2", name: "كريم سعيد",   phone: "01112345678", vehicle: "فان مبرّد · 3202", status: "available" },
  { id: "d-3", name: "أحمد فتحي",   phone: "01023456789", vehicle: "فان كبير · 3105",  status: "on-route" },
  { id: "d-4", name: "إسلام منير",  phone: "01234567890", vehicle: "فان متوسط · 3198", status: "available" },
];

export function FactoryRequests() {
  const device = useDevice();
  const isMobile = device === "mobile";
  const isDesktop = device === "desktop";
  const toast = useToastContext();

  const { requests: factoryRequests, bulkUpdateStatus } = useRequestsDB();

  const [ready, setReady] = useState(false);
  const [view, setView] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const [statusGroup, setStatusGroup] = useState<StatusGroup>("all");
  const [branchFilters, setBranchFilters] = useState<Set<string>>(new Set());
  const [brandFilters, setBrandFilters] = useState<Set<BrandId>>(new Set());
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tripPanelOpen, setTripPanelOpen] = useState(false);
  const [dispatchRequest, setDispatchRequest] = useState<FactoryRequest | null>(null);
  const [rejectConfirm, setRejectConfirm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 240);
    return () => clearTimeout(t);
  }, []);

  /* ---------- filtering ---------- */
  const filtered = useMemo(() => {
    let list = factoryRequests;
    const q = deferredSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((r) =>
        r.requestNumber.toLowerCase().includes(q) ||
        r.branchName.toLowerCase().includes(q) ||
        r.items.some((i) => i.name.toLowerCase().includes(q)) ||
        (r.note?.toLowerCase().includes(q) ?? false)
      );
    }
    if (statusGroup !== "all") {
      const grp = STATUS_GROUPS.find((g) => g.key === statusGroup);
      if (grp) list = list.filter((r) => grp.statuses.includes(r.status));
    }
    if (branchFilters.size > 0) list = list.filter((r) => branchFilters.has(r.branchId));
    if (brandFilters.size > 0) list = list.filter((r) => brandFilters.has(r.brandId));
    if (urgentOnly) list = list.filter((r) => r.priority === "urgent");
    return list;
  }, [factoryRequests, deferredSearch, statusGroup, branchFilters, brandFilters, urgentOnly]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      switch (sortKey) {
        case "branch":   return a.branchName.localeCompare(b.branchName, "ar") * dir;
        case "items":    return (a.items.length - b.items.length) * dir;
        case "delivery": return a.requestedDeliveryDate.localeCompare(b.requestedDeliveryDate, "ar") * dir;
        case "createdAt":
        default:         return (a.createdAtDate.getTime() - b.createdAtDate.getTime()) * dir;
      }
    });
    return list;
  }, [filtered, sortKey, sortDir]);

  /* ---------- counts ---------- */
  const counts = useMemo(() => {
    const c: Record<StatusGroup, number> = {
      all: factoryRequests.length,
      pending: 0, preparing: 0, loaded: 0, "in-transit": 0, delivered: 0, issues: 0,
    };
    factoryRequests.forEach((r) => {
      STATUS_GROUPS.forEach((g) => {
        if (g.key !== "all" && g.statuses.includes(r.status)) c[g.key]++;
      });
    });
    return c;
  }, [factoryRequests]);

  /* ---------- selection helpers ---------- */
  const selectedRequests = useMemo(
    () => sorted.filter((r) => selected.has(r.id)),
    [sorted, selected]
  );
  const selectedBranches = useMemo(
    () => new Set(selectedRequests.map((r) => r.branchId)),
    [selectedRequests]
  );
  const selectedTotalItems = selectedRequests.reduce((s, r) => s + r.items.length, 0);

  function toggleSet<T>(set: Set<T>, value: T): Set<T> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value); else next.add(value);
    return next;
  }
  function clearAll() {
    setStatusGroup("all"); setBranchFilters(new Set()); setBrandFilters(new Set());
    setUrgentOnly(false); setSearch("");
  }
  function setSort(key: SortKey) {
    if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }
  function startPrep() {
    bulkUpdateStatus([...selected], "preparing");
    toast.success(`بدء تحضير ${selected.size} طلب`, `${selectedBranches.size} فرع · ${selectedTotalItems} صنف`);
    setSelected(new Set());
  }

  function advanceStatus(status: RequestStatus) {
    bulkUpdateStatus([...selected], status);
    const label = STATUS_ADVANCE_OPTIONS.find((o) => o.status === status)?.label ?? status;
    toast.success(`تم تحديث ${selected.size} طلب إلى: ${label}`, `${selectedBranches.size} فرع`);
    setStatusDropdownOpen(false);
    setSelected(new Set());
  }

  function confirmReject() {
    bulkUpdateStatus([...selected], "rejected", { rejectionReason: rejectReason.trim() || undefined });
    toast.success(`تم رفض ${selected.size} طلب`, rejectReason.trim() || undefined);
    setSelected(new Set());
    setRejectConfirm(false);
    setRejectReason("");
  }

  const activeFilterCount =
    branchFilters.size + brandFilters.size + (urgentOnly ? 1 : 0);

  return (
    <div
      className={cn(
        "mx-auto",
        isMobile ? "px-4 pt-4 pb-20 space-y-4" : isDesktop ? "px-8 py-7 max-w-[1600px] space-y-6" : "px-6 py-6 max-w-[1280px] space-y-5"
      )}
    >
      <header className="flex items-end gap-4 flex-wrap justify-between">
        <div>
          <p className={cn("text-text-tertiary tracking-[0.18em] uppercase mb-1", isMobile ? "text-[10px]" : "text-xs")}>
            REQUESTS · طلبات الفروع
          </p>
          <h1 className={cn("font-bold tracking-tight", isDesktop ? "text-3xl" : isMobile ? "text-xl" : "text-2xl")}>
            الطلبات الواردة
          </h1>
          <p className={cn("text-text-tertiary mt-1", isMobile ? "text-xs" : "text-sm")}>
            {factoryRequests.length} طلب · {counts.pending} بانتظار موافقة · {counts.preparing} قيد التحضير · {counts["in-transit"]} في الطريق
          </p>
        </div>
      </header>

      {!isMobile && (
        <>
          <div className="gold-hairline" />
          <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {STATUS_GROUPS.filter((g) => g.key !== "all" && g.key !== "issues").map((g) => (
              <KpiTile key={g.key} icon={g.Icon} label={g.label} value={counts[g.key]} tone={g.tone} active={statusGroup === g.key} onClick={() => setStatusGroup(statusGroup === g.key ? "all" : g.key)} />
            ))}
          </section>
        </>
      )}

      {/* TOOLBAR */}
      <div className={cn("flex items-center gap-3 flex-wrap", isMobile && "flex-col-reverse items-stretch")}>
        <SearchBox value={search} onChange={setSearch} />
        <div className={cn("flex items-center gap-2", isMobile && "justify-between")}>
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 h-10 px-3.5 rounded-sm text-sm font-medium tracking-tight",
              "transition-all duration-fast ease-out-expo border",
              advancedOpen
                ? "bg-brand-primary/12 text-brand-primary border-brand-primary/40"
                : "bg-bg-surface text-text-secondary border-border hover:border-border-strong"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>فلاتر متقدمة</span>
            {activeFilterCount > 0 && (
              <span className={cn(
                "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold tabular",
                advancedOpen ? "bg-brand-primary text-text-on-brand" : "bg-brand-primary/20 text-brand-primary"
              )}>
                {activeFilterCount}
              </span>
            )}
          </button>
          {!isMobile && <ViewToggle value={view} onChange={setView} />}
        </div>
      </div>

      {/* QUICK CHIPS */}
      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="flex items-center gap-2 min-w-max px-1">
          {STATUS_GROUPS.map((g) => (
            <Chip key={g.key} active={statusGroup === g.key} tone={g.tone} onClick={() => setStatusGroup(g.key)}>
              <g.Icon className="w-3 h-3" strokeWidth={2} />
              {g.label} ({counts[g.key]})
            </Chip>
          ))}
          <span className="w-px h-5 bg-border-subtle mx-1" />
          <Chip active={urgentOnly} tone="danger" onClick={() => setUrgentOnly((v) => !v)}>
            <Zap className="w-3 h-3 fill-current" strokeWidth={2} />
            عاجل فقط
          </Chip>
        </div>
      </div>

      {/* ADVANCED PANEL — branch + brand filters */}
      {advancedOpen && (
        <Card padding="lg" className="animate-slide-up">
          <div className="grid gap-6 md:grid-cols-2">
            <FilterGroup label="الفرع">
              <div className="flex items-center gap-1.5 flex-wrap max-h-[140px] overflow-y-auto">
                {allBranches.map((b) => (
                  <Chip
                    key={b.id}
                    active={branchFilters.has(b.id)}
                    tone="brand"
                    onClick={() => setBranchFilters(toggleSet(branchFilters, b.id))}
                  >
                    {b.name}
                  </Chip>
                ))}
              </div>
            </FilterGroup>
            <FilterGroup label="البراند">
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["wahsh", "kababgy", "forno"] as BrandId[]).map((b) => (
                  <Chip
                    key={b}
                    active={brandFilters.has(b)}
                    tone="brand"
                    onClick={() => setBrandFilters(toggleSet(brandFilters, b))}
                  >
                    {brandMeta[b].name}
                  </Chip>
                ))}
              </div>
            </FilterGroup>
          </div>
        </Card>
      )}

      {/* ACTIVE FILTERS */}
      {(branchFilters.size + brandFilters.size + (urgentOnly ? 1 : 0) > 0) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] uppercase tracking-[0.16em] text-text-tertiary me-1">مفعّل:</span>
          {[...branchFilters].map((id) => {
            const b = allBranches.find((x) => x.id === id);
            return b ? <RemovableChip key={`b-${id}`} onRemove={() => setBranchFilters(toggleSet(branchFilters, id))}>{b.name}</RemovableChip> : null;
          })}
          {[...brandFilters].map((b) => (
            <RemovableChip key={`brand-${b}`} onRemove={() => setBrandFilters(toggleSet(brandFilters, b))}>
              {brandMeta[b].name}
            </RemovableChip>
          ))}
          {urgentOnly && <RemovableChip onRemove={() => setUrgentOnly(false)}>عاجل فقط</RemovableChip>}
          <button onClick={clearAll} className="text-xs text-text-tertiary hover:text-status-danger transition-colors duration-fast underline-offset-4 hover:underline">
            مسح الكل
          </button>
        </div>
      )}

      {/* SELECTION BAR */}
      {selected.size > 0 && (
        <div className="sticky top-2 z-20 animate-slide-up">
          <Card padding="md" className="bg-brand-primary/[0.08] border-brand-primary/40">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-primary text-text-on-brand text-sm font-bold tabular">
                  {selected.size}
                </span>
                <div>
                  <p className="text-sm font-medium tracking-tight">
                    {selected.size} طلب محدد · {selectedBranches.size} {selectedBranches.size === 1 ? "فرع" : "فروع"}
                  </p>
                  <p className="text-[11px] text-text-tertiary tabular">
                    {selectedTotalItems} صنف إجمالي
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={startPrep}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm text-xs font-medium tracking-tight bg-bg-surface border border-border hover:border-status-info/60 hover:text-status-info transition-all duration-fast"
                >
                  <ChefHat className="w-3.5 h-3.5" strokeWidth={2} />
                  بدء التحضير
                </button>
                {selected.size === 1 && (() => {
                  const req = selectedRequests[0];
                  const canDispatch = ["approved","preparing"].includes(req?.status ?? "");
                  return canDispatch ? (
                    <button
                      type="button"
                      onClick={() => setDispatchRequest(req)}
                      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm text-xs font-medium tracking-tight bg-status-success text-white hover:bg-status-success/85 transition-all duration-fast active:scale-[0.985]"
                    >
                      <Truck className="w-3.5 h-3.5" strokeWidth={2} />
                      إرسال للفرع
                    </button>
                  ) : null;
                })()}
                {(() => {
                  const allApproved = selectedRequests.length > 0 && selectedRequests.every((r) => r.status === "approved");
                  return (
                    <button
                      type="button"
                      onClick={() => allApproved && setTripPanelOpen(true)}
                      disabled={!allApproved}
                      title={!allApproved ? "يمكن تجميع الطلبات المُوافَق عليها فقط" : ""}
                      className={cn(
                        "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm text-xs font-medium tracking-tight transition-all duration-fast",
                        allApproved
                          ? "bg-brand-primary text-text-on-brand hover:bg-brand-primary-hover active:scale-[0.985]"
                          : "bg-bg-surface-raised text-text-tertiary border border-border-subtle cursor-not-allowed"
                      )}
                    >
                      <Route className="w-3.5 h-3.5" strokeWidth={2} />
                      تجميع كرحلة
                    </button>
                  );
                })()}
                {/* Status advance dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStatusDropdownOpen((v) => !v)}
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm text-xs font-medium tracking-tight bg-bg-surface border border-border hover:border-status-success/60 hover:text-status-success transition-all duration-fast"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                    تقدم الحالة
                    <ChevronUp className={cn("w-3 h-3 transition-transform duration-fast", statusDropdownOpen ? "" : "rotate-180")} strokeWidth={2} />
                  </button>
                  {statusDropdownOpen && (
                    <>
                      <button
                        type="button"
                        className="fixed inset-0 z-30"
                        aria-label="إغلاق"
                        onClick={() => setStatusDropdownOpen(false)}
                      />
                      <div className="absolute left-0 top-full mt-1.5 z-40 w-56 rounded-md bg-bg-canvas border border-border-subtle shadow-xl py-1.5 animate-slide-up overflow-hidden">
                        <p className="px-3 py-2 text-[10px] tracking-[0.16em] uppercase text-text-tertiary font-semibold border-b border-border-subtle mb-1">
                          تحديث الحالة لـ {selected.size} طلب
                        </p>
                        {STATUS_ADVANCE_OPTIONS.map((opt) => {
                          const OptIcon = opt.Icon;
                          return (
                            <button
                              key={opt.status}
                              type="button"
                              onClick={() => advanceStatus(opt.status)}
                              className="w-full inline-flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium tracking-tight text-text-secondary hover:bg-bg-surface-raised hover:text-text-primary transition-colors duration-fast group"
                            >
                              <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-sm bg-bg-surface-raised group-hover:bg-bg-canvas transition-colors", opt.tone)}>
                                <OptIcon className="w-3.5 h-3.5" strokeWidth={2} />
                              </span>
                              <span className="flex-1 text-right">{opt.label}</span>
                              <ChevronLeft className="w-3 h-3 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                {/* Reject button */}
                <button
                  type="button"
                  onClick={() => setRejectConfirm(true)}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm text-xs font-medium tracking-tight bg-status-danger/10 text-status-danger border border-status-danger/30 hover:bg-status-danger/20 transition-all duration-fast"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                  رفض
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-sm text-text-tertiary hover:text-text-primary hover:bg-bg-surface border border-border-subtle transition-all duration-fast"
                  aria-label="مسح التحديد"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* BODY */}
      {!ready ? (
        <LoadingState view={view} isMobile={isMobile} />
      ) : sorted.length === 0 ? (
        <EmptyState onClear={clearAll} hasFilters={activeFilterCount > 0 || statusGroup !== "all" || !!search.trim()} />
      ) : (
        <div className="animate-fade-in">
          {view === "grid" || isMobile ? (
            <GridView requests={sorted} query={deferredSearch} selected={selected} setSelected={setSelected} isMobile={isMobile} isDesktop={isDesktop} />
          ) : (
            <TableView requests={sorted} query={deferredSearch} selected={selected} setSelected={setSelected} sortKey={sortKey} sortDir={sortDir} setSort={setSort} />
          )}
        </div>
      )}

      {/* TRIP PLANNER PANEL */}
      {tripPanelOpen && (
        <TripPlanner
          requests={selectedRequests}
          onClose={() => setTripPanelOpen(false)}
          onDispatch={(driver, vehicle) => {
            toast.success(`تم إرسال الرحلة إلى ${driver.name}`, `${selectedRequests.length} طلب · ${selectedBranches.size} فرع · ${vehicle}`);
            setTripPanelOpen(false);
            setSelected(new Set());
          }}
        />
      )}

      {/* DISPATCH PANEL */}
      {dispatchRequest && (
        <DispatchPanel
          request={dispatchRequest}
          onClose={() => { setDispatchRequest(null); setSelected(new Set()); }}
        />
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {rejectConfirm && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadein" onClick={() => setRejectConfirm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-bg-canvas border border-status-danger/40 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4 pointer-events-auto animate-slide-up">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-12 h-12 rounded-full bg-status-danger/15 text-status-danger flex items-center justify-center">
                  <X className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold tracking-tight text-status-danger">رفض الطلبات</h3>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    سيتم رفض {selected.size} طلب · {selectedBranches.size} {selectedBranches.size === 1 ? "فرع" : "فروع"}.
                    لا يمكن التراجع عن هذا الإجراء.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-1.5">
                  سبب الرفض (اختياري)
                </label>
                <textarea
                  autoFocus
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="مثال: مخزون اللحم غير كافٍ — يرجى إعادة الطلب يوم الإثنين"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-sm text-sm bg-bg-surface border border-border focus:border-status-danger outline-none tracking-tight resize-none transition-all placeholder:text-text-tertiary"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={confirmReject}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-sm bg-status-danger text-white text-sm font-medium tracking-tight hover:bg-status-danger/90 active:scale-[0.98] transition-all"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                  نعم، ارفض الطلبات
                </button>
                <button
                  type="button"
                  onClick={() => { setRejectConfirm(false); setRejectReason(""); }}
                  className="flex-1 h-11 rounded-sm border border-border bg-bg-surface text-text-secondary text-sm font-medium tracking-tight hover:border-border-strong transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ======================================================================
 * Toolbar primitives
 * ==================================================================== */

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative flex items-center h-12 flex-1 min-w-[240px] rounded-sm bg-bg-surface border border-border focus-within:border-border-focus focus-within:shadow-glow-brand transition-all duration-fast">
      <Search className="absolute right-4 w-4 h-4 text-text-tertiary pointer-events-none" strokeWidth={1.75} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ابحث برقم الطلب، الفرع، أو الصنف..."
        className="w-full h-full bg-transparent outline-none px-12 text-base text-text-primary placeholder:text-text-tertiary"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} className="absolute left-3 inline-flex items-center justify-center w-6 h-6 rounded-full text-text-tertiary hover:text-text-primary transition-colors duration-fast" aria-label="مسح">
          <X className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="inline-flex items-center h-10 p-0.5 rounded-sm bg-bg-surface border border-border">
      {[
        { v: "grid", label: "شبكة", Icon: LayoutGrid },
        { v: "table", label: "جدول", Icon: Rows3 },
      ].map((opt) => (
        <button
          key={opt.v}
          type="button"
          onClick={() => onChange(opt.v as ViewMode)}
          className={cn(
            "inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-[10px] text-xs font-medium tracking-tight transition-all duration-fast",
            value === opt.v ? "bg-bg-surface-raised text-text-primary shadow-xs" : "text-text-tertiary hover:text-text-secondary"
          )}
        >
          <opt.Icon className="w-3.5 h-3.5" strokeWidth={2} />
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function Chip({
  active, tone, onClick, children,
}: {
  active: boolean;
  tone: "neutral" | "info" | "success" | "warning" | "danger" | "brand";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const activeBg: Record<string, string> = {
    brand:   "bg-brand-primary text-text-on-brand border-brand-primary",
    success: "bg-status-success text-white border-status-success",
    warning: "bg-status-warning text-white border-status-warning",
    danger:  "bg-status-danger text-white border-status-danger",
    info:    "bg-status-info text-white border-status-info",
    neutral: "bg-text-primary text-text-inverse border-text-primary",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-medium tracking-tight border",
        "transition-all duration-fast ease-out-expo active:scale-[1.05]",
        active ? activeBg[tone] : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary"
      )}
    >
      {children}
    </button>
  );
}

function RemovableChip({ onRemove, children }: { onRemove: () => void; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/30 text-xs font-medium tracking-tight animate-fade-in">
      {children}
      <button type="button" onClick={onRemove} className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-brand-primary/20 transition-colors duration-fast" aria-label="إزالة">
        <X className="w-2.5 h-2.5" strokeWidth={2.5} />
      </button>
    </span>
  );
}

/* ======================================================================
 * KPI tile (pressable)
 * ==================================================================== */

function KpiTile({
  icon: Icon, label, value, tone, active, onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: "neutral" | "info" | "success" | "warning" | "danger";
  active: boolean;
  onClick: () => void;
}) {
  const toneText = {
    neutral: "text-text-primary",
    info: "text-status-info",
    success: "text-status-success",
    warning: "text-status-warning",
    danger: "text-status-danger",
  }[tone];
  const toneBg = {
    neutral: "bg-bg-surface-raised text-text-secondary",
    info: "bg-status-info/15 text-status-info",
    success: "bg-status-success/15 text-status-success",
    warning: "bg-status-warning/15 text-status-warning",
    danger: "bg-status-danger/15 text-status-danger",
  }[tone];
  return (
    <button type="button" onClick={onClick} className="text-right">
      <Card
        padding="md"
        className={cn(
          "min-w-0 transition-all duration-fast ease-out-expo",
          "hover:border-border-strong hover:-translate-y-0.5",
          active && "border-brand-primary/60 [box-shadow:inset_3px_0_0_0_var(--brand-primary)]"
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-[10px] text-text-tertiary tracking-[0.18em] uppercase font-semibold truncate">{label}</p>
          <div className={cn("w-8 h-8 rounded-sm flex items-center justify-center", toneBg)}>
            <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
          </div>
        </div>
        <p className={cn("text-3xl font-bold tabular tracking-tight leading-none", toneText)}>{value}</p>
      </Card>
    </button>
  );
}

/* ======================================================================
 * Grid + RequestCard
 * ==================================================================== */

function GridView({
  requests, query, selected, setSelected, isMobile, isDesktop,
}: {
  requests: FactoryRequest[];
  query: string;
  selected: Set<string>;
  setSelected: (next: Set<string>) => void;
  isMobile: boolean;
  isDesktop: boolean;
}) {
  function toggle(id: string) {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id); else n.add(id);
    setSelected(n);
  }
  return (
    <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : isDesktop ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 md:grid-cols-2")}>
      {requests.map((r) => (
        <RequestCard key={r.id} request={r} query={query} selected={selected.has(r.id)} onToggle={() => toggle(r.id)} />
      ))}
    </div>
  );
}

function RequestCard({ request, query, selected, onToggle }: { request: FactoryRequest; query: string; selected: boolean; onToggle: () => void }) {
  const status = statusMeta[request.status];
  const brand = brandMeta[request.brandId];
  const urgent = request.priority === "urgent";

  return (
    <div className={cn("relative group", selected && "ring-2 ring-brand-primary/40 rounded-md")}>
      <Card
        padding="md"
        className="h-full relative transition-all duration-fast ease-out-expo group-hover:border-border-strong group-hover:-translate-y-0.5"
      >
        {/* Top: select + number + branch */}
        <div className="flex items-start gap-3 mb-3">
          <Checkbox checked={selected} onChange={onToggle} ariaLabel={`تحديد ${request.requestNumber}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-base font-bold tabular tracking-tight">
                <Highlight text={request.requestNumber} query={query} />
              </p>
              {urgent && (
                <Badge intent="danger" size="sm" dot pulse>
                  <Zap className="w-3 h-3 fill-current" strokeWidth={2} />
                  عاجل
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full" style={{ background: brand.accent }} aria-hidden />
              <span className="text-sm font-medium tracking-tight truncate">
                <Highlight text={request.branchName} query={query} />
              </span>
              <span className="text-text-tertiary text-xs">·</span>
              <span className="text-[11px] text-text-tertiary truncate">{brand.name}</span>
            </div>
          </div>
          <Badge intent={status.intent} size="sm">{status.label}</Badge>
        </div>

        {/* Items count + sample */}
        <div className="pt-3 border-t border-border-subtle">
          <p className="text-[11px] text-text-tertiary tracking-[0.14em] uppercase mb-2">الأصناف ({request.items.length})</p>
          <ul className="space-y-1">
            {request.items.slice(0, 3).map((it) => (
              <li key={it.catalogId} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-text-secondary truncate">
                  <Highlight text={it.name} query={query} />
                </span>
                <span className="shrink-0 tabular text-text-tertiary">
                  {it.requestedQty} {it.unit}
                </span>
              </li>
            ))}
            {request.items.length > 3 && (
              <li className="text-[11px] text-text-tertiary">+ {request.items.length - 3} أصناف</li>
            )}
          </ul>
        </div>

        {/* Pipeline progress — 4 stages of the factory flow */}
        <div className="pt-3 mt-3 border-t border-border-subtle">
          <PipelineProgress status={request.status} />
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 pt-3 mt-3 border-t border-border-subtle text-[11px] text-text-tertiary">
          <span className="tabular shrink-0">{request.createdAt}</span>
          <span className="text-text-tertiary">·</span>
          <span className="truncate flex-1">التسليم: {request.requestedDeliveryDate}</span>
          <Link
            href={`/requests/${request.id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-brand-primary hover:underline underline-offset-4"
          >
            تفاصيل
            <ChevronLeft className="w-3 h-3" strokeWidth={2.5} />
          </Link>
        </div>

        {request.note && (
          <p className="mt-3 pt-3 border-t border-border-subtle text-[11px] text-text-secondary leading-relaxed line-clamp-2">
            <Highlight text={request.note} query={query} />
          </p>
        )}
      </Card>
    </div>
  );
}

/* ----------------------------------------------------------------------
 * Pipeline progress — 4-step factory flow stepper rendered inside each
 * card. Shows where the order sits between branch request and driver
 * handover (الطلب → الموافقة → التحضير → الإرسال).
 * -------------------------------------------------------------------- */

const PIPELINE_STEPS: Array<{ label: string; Icon: LucideIcon }> = [
  { label: "الطلب",     Icon: ClipboardList },
  { label: "الموافقة",  Icon: CheckCircle2  },
  { label: "التحضير",   Icon: ChefHat       },
  { label: "الإرسال",   Icon: Truck         },
];

function activePipelineStep(status: RequestStatus): number {
  switch (status) {
    case "requested":             return 0;
    case "approved":              return 1;
    case "preparing":             return 2;
    case "loaded":
    case "in-transit":            return 3;
    case "delivered":
    case "confirmed":
    case "closed":                return 4;
    case "on-hold":               return 0;
    case "disputed":              return 4;
    case "rejected":
    case "cancelled":             return -1;
  }
}

function PipelineProgress({ status }: { status: RequestStatus }) {
  const active = activePipelineStep(status);

  if (active === -1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-status-danger/8 border border-status-danger/30">
        <Trash2 className="w-3.5 h-3.5 text-status-danger shrink-0" strokeWidth={2} />
        <span className="text-[11px] font-medium text-status-danger">
          {status === "cancelled" ? "أُلغي قبل الإرسال" : "تم رفض الطلب"}
        </span>
      </div>
    );
  }

  const passedFactory = active === 4;

  return (
    <div className="flex items-center gap-1">
      {PIPELINE_STEPS.map((step, i) => {
        const isDone = i < active || passedFactory;
        const isActive = i === active && !passedFactory;
        const StepIcon = step.Icon;
        return (
          <div key={i} className="flex items-center gap-1 flex-1 min-w-0">
            <span
              className={cn(
                "shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-colors duration-fast",
                isDone
                  ? "bg-status-success/15 border-status-success/40 text-status-success"
                  : isActive
                  ? "bg-brand-primary/15 border-brand-primary/50 text-brand-primary ring-2 ring-brand-primary/20"
                  : "bg-bg-surface-raised border-border-subtle text-text-tertiary"
              )}
              aria-hidden
            >
              {isDone ? (
                <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
              ) : (
                <StepIcon className="w-2.5 h-2.5" strokeWidth={2} />
              )}
            </span>
            <span
              className={cn(
                "text-[10px] tracking-tight truncate",
                isActive ? "text-brand-primary font-semibold" :
                isDone   ? "text-status-success font-medium"  :
                           "text-text-tertiary"
              )}
            >
              {step.label}
            </span>
            {i < PIPELINE_STEPS.length - 1 && (
              <span
                className={cn(
                  "h-px flex-1 min-w-2",
                  isDone ? "bg-status-success/40" : "bg-border-subtle"
                )}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ======================================================================
 * Table view
 * ==================================================================== */

function TableView({
  requests, query, selected, setSelected, sortKey, sortDir, setSort,
}: {
  requests: FactoryRequest[];
  query: string;
  selected: Set<string>;
  setSelected: (next: Set<string>) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  setSort: (k: SortKey) => void;
}) {
  const allSelected = requests.length > 0 && requests.every((r) => selected.has(r.id));
  const someSelected = !allSelected && requests.some((r) => selected.has(r.id));
  function toggleAll() {
    if (allSelected) {
      const n = new Set(selected); requests.forEach((r) => n.delete(r.id)); setSelected(n);
    } else {
      const n = new Set(selected); requests.forEach((r) => n.add(r.id)); setSelected(n);
    }
  }
  function toggleOne(id: string) {
    const n = new Set(selected); if (n.has(id)) n.delete(id); else n.add(id); setSelected(n);
  }

  const cols: Array<{ key: SortKey | "select" | "status" | "items" | "actions" | "priority"; label: string; sortable?: boolean; align?: "start" | "end" | "center"; width?: string }> = [
    { key: "select", label: "", width: "40px" },
    { key: "createdAt", label: "رقم / الوقت", sortable: true },
    { key: "branch", label: "الفرع", sortable: true },
    { key: "items", label: "الأصناف", sortable: true, align: "center", width: "100px" },
    { key: "priority", label: "الأولوية", align: "center", width: "100px" },
    { key: "status", label: "الحالة", align: "center", width: "140px" },
    { key: "delivery", label: "التسليم", sortable: true, align: "center", width: "140px" },
    { key: "actions", label: "", align: "end", width: "100px" },
  ];

  return (
    <div className="rounded-md border border-border-subtle bg-bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm tabular">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-muted/40 sticky top-0 z-10 backdrop-blur">
              {cols.map((c) => {
                const active = c.sortable && sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    style={{ width: c.width }}
                    className={cn(
                      "h-11 px-3 text-[11px] font-medium tracking-[0.14em] uppercase text-text-tertiary",
                      c.align === "end" && "text-left",
                      c.align === "center" && "text-center",
                      !c.align && "text-right",
                      c.sortable && "cursor-pointer hover:text-text-secondary transition-colors duration-fast"
                    )}
                    onClick={c.sortable ? () => setSort(c.key as SortKey) : undefined}
                  >
                    {c.key === "select" ? (
                      <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} ariaLabel="تحديد الكل" />
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        {c.label}
                        {c.sortable && (
                          <ChevronUp
                            className={cn(
                              "w-3 h-3 transition-all duration-fast",
                              active ? "text-brand-primary opacity-100" : "opacity-30",
                              active && sortDir === "desc" && "rotate-180"
                            )}
                            strokeWidth={2.5}
                          />
                        )}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <RequestRow key={r.id} request={r} query={query} selected={selected.has(r.id)} onToggle={() => toggleOne(r.id)} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RequestRow({ request, query, selected, onToggle }: { request: FactoryRequest; query: string; selected: boolean; onToggle: () => void }) {
  const status = statusMeta[request.status];
  const brand = brandMeta[request.brandId];
  const urgent = request.priority === "urgent";
  return (
    <tr
      className={cn(
        "group relative border-b border-border-subtle transition-shadow duration-fast",
        selected ? "bg-brand-primary/[0.06]" : "hover:[box-shadow:inset_3px_0_0_0_var(--brand-primary)]"
      )}
    >
      <td className="px-3 align-middle">
        <Checkbox checked={selected} onChange={onToggle} ariaLabel={`تحديد ${request.requestNumber}`} />
      </td>
      <td className="px-3 py-3 align-middle">
        <p className="text-sm font-medium tabular tracking-tight"><Highlight text={request.requestNumber} query={query} /></p>
        <p className="text-[11px] text-text-tertiary tabular mt-0.5">{request.createdAt}</p>
      </td>
      <td className="px-3 align-middle">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: brand.accent }} aria-hidden />
          <span className="text-sm font-medium truncate"><Highlight text={request.branchName} query={query} /></span>
        </div>
        <p className="text-[10px] text-text-tertiary mt-0.5">{brand.name}</p>
      </td>
      <td className="px-3 align-middle text-center">
        <span className="text-sm font-medium tabular">{request.items.length}</span>
        <span className="text-[10px] text-text-tertiary"> صنف</span>
      </td>
      <td className="px-3 align-middle text-center">
        {urgent ? (
          <Badge intent="danger" size="sm" dot pulse>
            <Zap className="w-3 h-3 fill-current" strokeWidth={2} />
            عاجل
          </Badge>
        ) : (
          <span className="text-[11px] text-text-tertiary">عادي</span>
        )}
      </td>
      <td className="px-3 align-middle text-center">
        <Badge intent={status.intent} size="sm">{status.label}</Badge>
      </td>
      <td className="px-3 align-middle text-center">
        <span className="text-xs text-text-secondary">{request.requestedDeliveryDate}</span>
      </td>
      <td className="px-2 align-middle text-left">
        <Link href={`/requests/${request.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast inline-flex items-center justify-center w-8 h-8 rounded-sm text-text-tertiary hover:text-text-primary hover:bg-bg-surface-raised">
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
        </Link>
      </td>
    </tr>
  );
}

/* ======================================================================
 * Checkbox (custom tri-state)
 * ==================================================================== */

function Checkbox({ checked, indeterminate, onChange, ariaLabel }: { checked: boolean; indeterminate?: boolean; onChange: () => void; ariaLabel: string }) {
  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      <span className="sr-only">{ariaLabel}</span>
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <span
        className={cn(
          "inline-flex items-center justify-center w-4 h-4 rounded-[5px] border transition-all duration-fast",
          "border-border-strong bg-bg-surface",
          "peer-focus-visible:shadow-glow-brand",
          (checked || indeterminate) && "bg-brand-primary border-brand-primary scale-105"
        )}
        onClick={(e) => { e.preventDefault(); onChange(); }}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="w-3 h-3 text-text-on-brand" fill="none">
            <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {indeterminate && !checked && <span className="block w-2 h-0.5 bg-text-on-brand rounded-full" />}
      </span>
    </label>
  );
}

/* ======================================================================
 * Trip Planner Panel — slide-in modal
 * ==================================================================== */

function TripPlanner({
  requests, onClose, onDispatch,
}: {
  requests: FactoryRequest[];
  onClose: () => void;
  onDispatch: (driver: MockDriver, vehicle: string) => void;
}) {
  const [driverId, setDriverId] = useState<string>(DRIVERS.find(d => d.status === "available")?.id ?? DRIVERS[0].id);
  const [vehicleNote, setVehicleNote] = useState("");

  const driver = DRIVERS.find((d) => d.id === driverId)!;
  const grouped = useMemo(() => {
    const map = new Map<string, FactoryRequest[]>();
    requests.forEach((r) => {
      const arr = map.get(r.branchId) ?? [];
      arr.push(r);
      map.set(r.branchId, arr);
    });
    return [...map.entries()].map(([branchId, list]) => {
      const b = allBranches.find((x) => x.id === branchId);
      return { branchId, branchName: b?.name ?? "—", brandId: b?.brandId, list };
    });
  }, [requests]);

  const totalItems = requests.reduce((s, r) => s + r.items.length, 0);
  const estimatedHours = (grouped.length * 0.5 + 0.5).toFixed(1); // 30 min per stop + 30 min buffer

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-bg-canvas border-l border-border-subtle overflow-y-auto animate-slide-up"
        style={{ animationDuration: "320ms" }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 z-10 bg-bg-canvas border-b border-border-subtle px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.18em] uppercase text-text-tertiary">PLAN TRIP</p>
            <h2 className="text-lg font-bold tracking-tight">تخطيط رحلة</h2>
          </div>
          <button type="button" onClick={onClose} className="inline-flex items-center justify-center w-9 h-9 rounded-sm text-text-tertiary hover:text-text-primary hover:bg-bg-surface-raised transition-all duration-fast" aria-label="إغلاق">
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </header>

        <div className="p-5 space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2">
            <SummaryStat value={requests.length} label="طلب" />
            <SummaryStat value={grouped.length} label={grouped.length === 1 ? "فرع" : "فروع"} />
            <SummaryStat value={totalItems} label="صنف" />
          </div>

          {/* Stops grouped by branch */}
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-2">المحطات</p>
            <ol className="relative space-y-3">
              <span className="absolute right-[15px] top-3 bottom-3 w-px bg-border-subtle" aria-hidden />
              {grouped.map((g, idx) => (
                <li key={g.branchId} className="relative flex items-start gap-3">
                  <span className="shrink-0 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-bg-canvas font-bold text-xs tabular bg-brand-primary text-text-on-brand">
                    {idx + 1}
                  </span>
                  <Card padding="sm" className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {g.brandId && (
                        <span className="w-2 h-2 rounded-full" style={{ background: brandMeta[g.brandId].accent }} aria-hidden />
                      )}
                      <p className="text-sm font-medium tracking-tight truncate">{g.branchName}</p>
                    </div>
                    <ul className="space-y-1">
                      {g.list.map((r) => (
                        <li key={r.id} className="flex items-center justify-between text-[11px]">
                          <span className="tabular text-text-secondary">{r.requestNumber}</span>
                          <span className="text-text-tertiary">{r.items.length} صنف</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </li>
              ))}
            </ol>
          </div>

          {/* Driver selection — dropdown */}
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-2">السائق</p>
            <DriverDropdown
              drivers={DRIVERS}
              selectedId={driverId}
              onSelect={setDriverId}
            />
          </div>

          {/* Notes */}
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-text-tertiary mb-2">ملاحظات للسائق (اختياري)</p>
            <textarea
              value={vehicleNote}
              onChange={(e) => setVehicleNote(e.target.value)}
              placeholder="مثال: جدول الفروع، تعليمات خاصة، إلخ"
              rows={2}
              className="w-full bg-bg-surface border border-border focus:border-border-focus focus:shadow-glow-brand outline-none rounded-sm px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-fast resize-y"
            />
          </div>

          {/* Estimate */}
          <Card padding="sm" className="bg-bg-muted/40 border-border-subtle">
            <div className="flex items-center gap-2 text-xs">
              <Route className="w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />
              <span className="text-text-secondary">الوقت المقدّر للرحلة:</span>
              <span className="font-bold tabular text-text-primary">{estimatedHours} ساعة</span>
              <span className="text-text-tertiary">·</span>
              <span className="text-text-secondary">{grouped.length} {grouped.length === 1 ? "محطة" : "محطات"}</span>
            </div>
          </Card>
        </div>

        {/* Sticky footer */}
        <footer className="sticky bottom-0 z-10 bg-bg-canvas border-t border-border-subtle p-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-sm border border-border bg-bg-surface text-text-secondary text-sm font-medium tracking-tight hover:border-border-strong transition-all duration-fast"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => onDispatch(driver, driver.vehicle)}
            className="flex-[2] inline-flex items-center justify-center gap-2 h-11 rounded-sm bg-brand-primary text-text-on-brand text-sm font-medium tracking-tight hover:bg-brand-primary-hover hover:shadow-md active:scale-[0.985] transition-all duration-fast"
          >
            <Send className="w-3.5 h-3.5" strokeWidth={2} />
            إرسال للسائق
          </button>
        </footer>
      </div>
    </div>
  );
}

function SummaryStat({ value, label }: { value: number; label: string }) {
  return (
    <Card padding="sm" className="text-center">
      <p className="text-2xl font-bold tabular tracking-tight">{value}</p>
      <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mt-0.5">{label}</p>
    </Card>
  );
}

/* ── Driver dropdown for trip planner ───────────────────────────────────── */

function DriverDropdown({
  drivers,
  selectedId,
  onSelect,
}: {
  drivers: MockDriver[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = drivers.find((d) => d.id === selectedId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-3 px-3 h-12 rounded-sm border bg-bg-surface text-right transition-all duration-fast",
          open ? "border-brand-primary shadow-glow-brand" : "border-border hover:border-border-strong"
        )}
      >
        <span className="shrink-0 w-8 h-8 rounded-full bg-brand-primary/12 text-brand-primary flex items-center justify-center">
          <UserCircle2 className="w-4 h-4" strokeWidth={1.75} />
        </span>
        <div className="flex-1 min-w-0 text-right">
          {selected ? (
            <>
              <p className="text-sm font-medium tracking-tight truncate">{selected.name}</p>
              <p className="text-[11px] text-text-tertiary tabular truncate">{selected.vehicle}</p>
            </>
          ) : (
            <p className="text-sm text-text-tertiary">اختر سائقاً</p>
          )}
        </div>
        {selected && (
          selected.status === "available"
            ? <Badge intent="success" size="sm" dot>متاح</Badge>
            : <Badge intent="warning" size="sm">في رحلة</Badge>
        )}
        <ChevronUp className={cn("w-3.5 h-3.5 text-text-tertiary transition-transform duration-fast", open ? "" : "rotate-180")} strokeWidth={2} />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="إغلاق"
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full inset-x-0 mt-1.5 z-40 rounded-md bg-bg-canvas border border-border-subtle shadow-xl py-1 animate-slide-up max-h-[280px] overflow-y-auto">
            {drivers.map((d) => {
              const active = d.id === selectedId;
              const available = d.status === "available";
              return (
                <button
                  key={d.id}
                  type="button"
                  disabled={!available}
                  onClick={() => { if (available) { onSelect(d.id); setOpen(false); } }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-right transition-colors duration-fast",
                    active && "bg-brand-primary/8",
                    available
                      ? "hover:bg-bg-surface-raised cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className={cn(
                    "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    active ? "bg-brand-primary text-text-on-brand" : "bg-bg-surface-raised text-text-tertiary"
                  )}>
                    <UserCircle2 className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-sm font-medium tracking-tight truncate">{d.name}</p>
                    <p className="text-[11px] text-text-tertiary tabular truncate">{d.vehicle}</p>
                  </div>
                  {available
                    ? <Badge intent="success" size="sm" dot>متاح</Badge>
                    : <Badge intent="warning" size="sm">في رحلة</Badge>}
                  {active && <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ======================================================================
 * Loading + empty
 * ==================================================================== */

function LoadingState({ view, isMobile }: { view: ViewMode; isMobile: boolean }) {
  if (view === "table" && !isMobile) {
    return (
      <div className="rounded-md border border-border-subtle bg-bg-surface overflow-hidden">
        <div className="h-11 bg-bg-muted/40 border-b border-border-subtle" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 px-3 flex items-center gap-3 border-b border-border-subtle last:border-0">
            <div className="w-4 h-4 rounded bg-bg-muted animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-40 rounded-full bg-bg-muted animate-pulse" />
              <div className="h-2 w-24 rounded-full bg-bg-muted/60 animate-pulse" />
            </div>
            <div className="w-16 h-6 rounded-full bg-bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3")}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} padding="md" className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded bg-bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded-full bg-bg-muted animate-pulse" />
              <div className="h-3 w-1/2 rounded-full bg-bg-muted/60 animate-pulse" />
            </div>
            <div className="w-14 h-6 rounded-full bg-bg-muted animate-pulse" />
          </div>
          <div className="h-12 w-full rounded bg-bg-muted/40 animate-pulse" />
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6 animate-fade-in">
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute inset-0 rounded-full bg-brand-primary/8 animate-pulse-dot" />
        <div className="absolute inset-3 rounded-full bg-brand-primary/12" />
        <div className="absolute inset-6 rounded-full border border-brand-primary/30 flex items-center justify-center">
          <ClipboardList className="w-10 h-10 text-brand-primary" strokeWidth={1.25} />
        </div>
      </div>
      <h3 className="text-lg font-bold tracking-tight mb-1">
        {hasFilters ? "لا توجد طلبات تطابق الفلاتر" : "لا توجد طلبات حالياً"}
      </h3>
      <p className="text-sm text-text-tertiary max-w-sm mb-6">
        {hasFilters ? "جرّب تخفيف معايير البحث أو ابدأ من جديد بمسح الفلاتر." : "ستظهر الطلبات هنا فور وصولها من الفروع."}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-sm text-sm font-medium tracking-tight bg-bg-surface border border-border hover:border-border-strong text-text-secondary transition-all duration-fast"
        >
          <RotateCw className="w-3.5 h-3.5" strokeWidth={2} />
          مسح الفلاتر
        </button>
      )}
    </div>
  );
}
