"use client";

import { IncomingRequestDetail } from "./IncomingRequestDetail";
import { RequestListPanel, EmptyDetail, type FactoryRequestsProps } from "./shared";

/**
 * Tablet layout — 45/55 split.
 * List on the right, detail on the left. Same split-view as desktop
 * but with proportional widths instead of fixed pixel widths.
 */
export function FactoryRequestsTablet({ p }: { p: FactoryRequestsProps }) {
  const liveSelected = p.requests.find((r) => r.id === p.selected?.id) ?? p.selected;

  return (
    <div className="flex h-[calc(100vh-64px)]">

      {/* List — 45% width */}
      <div className="w-[45%] border-l border-border-subtle flex flex-col shrink-0 bg-bg-canvas">
        <RequestListPanel p={p} compact />
      </div>

      {/* Detail — 55% */}
      <div className="flex-1 min-w-0 bg-bg-surface">
        {liveSelected ? (
          <IncomingRequestDetail
            key={liveSelected.id}
            request={liveSelected}
            onApprove={p.handleApprove}
            onReject={p.handleReject}
          />
        ) : (
          <EmptyDetail />
        )}
      </div>
    </div>
  );
}
