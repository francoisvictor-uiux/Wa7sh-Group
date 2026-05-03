"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { factoryRequests, type FactoryRequest } from "@/lib/mock/factoryRequests";
import { brandMeta, allBrands, type BrandId } from "@/lib/mock/branches";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { IncomingRequestCard } from "./IncomingRequestCard";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/lib/mock/requests";

// ─── Shared props ─────────────────────────────────────────────────────────────

export interface FactoryRequestsProps {
  requests:        FactoryRequest[];
  filtered:        FactoryRequest[];
  selected:        FactoryRequest | null;
  setSelected:     (r: FactoryRequest | null) => void;
  statusFilter:    RequestStatus | "all";
  setStatusFilter: (s: RequestStatus | "all") => void;
  brandFilter:     BrandId | "all";
  setBrandFilter:  (b: BrandId | "all") => void;
  search:          string;
  setSearch:       (s: string) => void;
  pendingCount:    number;
  handleApprove:   (id: string) => void;
  handleReject:    (id: string, reason: string) => void;
}

// ─── Status tabs ──────────────────────────────────────────────────────────────

export const STATUS_TABS: { id: RequestStatus | "all"; label: string }[] = [
  { id: "all",         label: "الكل"       },
  { id: "requested",   label: "انتظار"     },
  { id: "approved",    label: "موافق"      },
  { id: "preparing",   label: "تحضير"      },
  { id: "in-transit",  label: "الطريق"    },
  { id: "confirmed",   label: "مكتمل"      },
  { id: "rejected",    label: "مرفوض"      },
];

// ─── Shared state hook ────────────────────────────────────────────────────────

export function useFactoryRequestsState(): FactoryRequestsProps {
  const [requests, setRequests] = useState<FactoryRequest[]>(factoryRequests);
  const [selected, setSelected] = useState<FactoryRequest | null>(requests[0] ?? null);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [brandFilter, setBrandFilter]   = useState<BrandId | "all">("all");
  const [search, setSearch]             = useState("");

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (brandFilter  !== "all" && r.brandId !== brandFilter)  return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.requestNumber.toLowerCase().includes(q) ||
          r.branchName.toLowerCase().includes(q) ||
          r.items.some((i) => i.name.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [requests, statusFilter, brandFilter, search]);

  const handleApprove = (id: string) => {
    setRequests((prev) => prev.map((r) =>
      r.id === id ? { ...r, status: "approved" as RequestStatus, approvedBy: "أحمد رضا", approvedAt: "الآن" } : r
    ));
    setSelected((prev) => prev?.id === id ? { ...prev, status: "approved" as RequestStatus } : prev);
  };

  const handleReject = (id: string, reason: string) => {
    setRequests((prev) => prev.map((r) =>
      r.id === id ? { ...r, status: "rejected" as RequestStatus, rejectedBy: "أحمد رضا", rejectedAt: "الآن", rejectionReason: reason } : r
    ));
    setSelected((prev) => prev?.id === id ? { ...prev, status: "rejected" as RequestStatus, rejectionReason: reason } : prev);
  };

  return {
    requests, filtered, selected, setSelected,
    statusFilter, setStatusFilter,
    brandFilter, setBrandFilter,
    search, setSearch,
    pendingCount: requests.filter((r) => r.status === "requested").length,
    handleApprove, handleReject,
  };
}

// ─── List Panel ───────────────────────────────────────────────────────────────

export function RequestListPanel({
  p, compact = false,
}: {
  p: FactoryRequestsProps;
  compact?: boolean;
}) {
  const toast = useToast();

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className={cn("border-b border-border-subtle", compact ? "px-4 py-3" : "px-5 py-4")}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-sm font-semibold tracking-tight">الطلبات الواردة</h1>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              {p.filtered.length} طلب
              {p.pendingCount > 0 && (
                <span className="text-status-warning font-medium"> · {p.pendingCount} انتظار</span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast.info("جارٍ التحديث...")}
            className="text-text-tertiary hover:text-text-primary transition-colors duration-fast p-1.5 rounded-md hover:bg-bg-surface-raised"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none" strokeWidth={1.75} />
          <input
            type="text"
            value={p.search}
            onChange={(e) => p.setSearch(e.target.value)}
            placeholder="فرع، رقم طلب، صنف..."
            className={cn(
              "w-full h-8 pr-9 pl-3 text-[12px] rounded-md",
              "bg-bg-surface-raised border border-border-subtle",
              "placeholder:text-text-tertiary text-text-primary",
              "focus:outline-none focus:border-brand-primary/40",
              "transition-colors duration-fast"
            )}
          />
        </div>

        {/* Brand chips */}
        <div className="flex gap-1.5 flex-wrap">
          <FilterChip
            label="الكل"
            active={p.brandFilter === "all"}
            onClick={() => p.setBrandFilter("all")}
          />
          {allBrands.map((b) => (
            <FilterChip
              key={b}
              label={brandMeta[b].name.split(" ")[0]}
              active={p.brandFilter === b}
              accent={p.brandFilter === b ? brandMeta[b].accent : undefined}
              onClick={() => p.setBrandFilter(b)}
            />
          ))}
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex overflow-x-auto border-b border-border-subtle px-2 shrink-0 gap-0.5 py-1.5">
        {STATUS_TABS.map((tab) => {
          const isPending = tab.id === "requested";
          const count = isPending ? p.pendingCount : undefined;
          const isActive = p.statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => p.setStatusFilter(tab.id)}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors duration-fast",
                isActive
                  ? "bg-brand-primary text-text-on-brand"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-raised"
              )}
            >
              {tab.label}
              {count !== undefined && count > 0 && (
                <span className={cn(
                  "min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold inline-flex items-center justify-center",
                  isActive ? "bg-white/20 text-white" : "bg-status-danger text-white"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {p.filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-sm text-text-secondary">لا توجد طلبات</p>
            <p className="text-xs text-text-tertiary mt-1">جرب تغيير الفلتر</p>
          </div>
        ) : (
          p.filtered.map((req) => (
            <IncomingRequestCard
              key={req.id}
              request={req}
              selected={p.selected?.id === req.id}
              onClick={() => p.setSelected(req)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Empty detail ─────────────────────────────────────────────────────────────

export function EmptyDetail() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-2">
      <SlidersHorizontal className="w-8 h-8 text-text-tertiary mb-2" strokeWidth={1.25} />
      <p className="text-sm font-medium text-text-secondary">اختر طلباً</p>
      <p className="text-xs text-text-tertiary">التفاصيل ستظهر هنا</p>
    </div>
  );
}

// ─── Filter chip (still used in dispatch/inventory) ───────────────────────────

export function FilterChip({
  label, active, accent, onClick,
}: {
  label: string;
  active: boolean;
  accent?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-[11px] font-medium h-7 px-3 rounded-md transition-all duration-fast",
        active
          ? "bg-brand-primary text-text-on-brand"
          : "text-text-tertiary hover:text-text-primary hover:bg-bg-surface-raised"
      )}
      style={active && accent ? { backgroundColor: accent, color: "#fff" } : {}}
    >
      {label}
    </button>
  );
}
