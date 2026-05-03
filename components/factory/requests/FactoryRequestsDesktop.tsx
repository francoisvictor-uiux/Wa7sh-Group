"use client";

import { IncomingRequestDetail } from "./IncomingRequestDetail";
import { RequestListPanel, EmptyDetail, type FactoryRequestsProps } from "./shared";

export function FactoryRequestsDesktop({ p }: { p: FactoryRequestsProps }) {
  const liveSelected = p.requests.find((r) => r.id === p.selected?.id) ?? p.selected;

  return (
    <div className="flex h-[calc(100vh-64px)]">

      {/* List — right side (RTL primary), fixed width */}
      <div className="w-[380px] xl:w-[420px] border-l border-border-subtle flex flex-col shrink-0 bg-bg-canvas">
        <RequestListPanel p={p} />
      </div>

      {/* Detail — left side, fills remaining */}
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
