"use client";

import { IncomingRequestDetail } from "./IncomingRequestDetail";
import { RequestListPanel, type FactoryRequestsProps } from "./shared";

/**
 * Mobile layout — full-screen stack.
 * Shows the list by default.
 * Tapping a request slides to the detail view (full screen).
 * Back button returns to list.
 */
export function FactoryRequestsMobile({ p }: { p: FactoryRequestsProps }) {
  const liveSelected = p.requests.find((r) => r.id === p.selected?.id) ?? p.selected;
  const showDetail   = !!liveSelected;

  return (
    <div className="relative h-[calc(100vh-56px)] overflow-hidden bg-bg-canvas">

      {/* ── List screen ── */}
      <div
        className={[
          "absolute inset-0 transition-transform duration-300 ease-out-expo",
          showDetail ? "-translate-x-full" : "translate-x-0",
        ].join(" ")}
      >
        <RequestListPanel
          p={{ ...p, setSelected: (r) => p.setSelected(r) }}
          compact
        />
      </div>

      {/* ── Detail screen ── */}
      <div
        className={[
          "absolute inset-0 bg-bg-surface transition-transform duration-300 ease-out-expo",
          showDetail ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {liveSelected && (
          <IncomingRequestDetail
            key={liveSelected.id}
            request={liveSelected}
            onApprove={p.handleApprove}
            onReject={p.handleReject}
            onClose={() => p.setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}
