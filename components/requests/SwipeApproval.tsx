"use client";

import { useState, useRef, type PointerEvent } from "react";
import { Check, X, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeApprovalProps {
  onApprove: () => void;
  onReject: () => void;
}

/**
 * SwipeApproval — RTL swipe-to-decide control.
 * Swipe RIGHT (along the natural RTL forward direction) → approve.
 * Swipe LEFT  → reject.
 * Tap-and-drag on the central handle. Snaps if past 35% threshold.
 */
export function SwipeApproval({ onApprove, onReject }: SwipeApprovalProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState(0); // -1..+1
  const [decided, setDecided] = useState<"approve" | "reject" | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (decided) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!dragging || decided) return;
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const dx = e.clientX - center;
    const half = rect.width / 2 - 32; // 32 = handle radius
    const next = Math.max(-1, Math.min(1, dx / half));
    setOffset(next);
  };

  const onPointerUp = () => {
    if (!dragging || decided) return;
    setDragging(false);
    if (offset >= 0.45) {
      setDecided("approve");
      setOffset(1);
      window.setTimeout(() => onApprove(), 220);
    } else if (offset <= -0.45) {
      setDecided("reject");
      setOffset(-1);
      window.setTimeout(() => onReject(), 220);
    } else {
      setOffset(0);
    }
  };

  const tone =
    offset > 0.15
      ? "approve"
      : offset < -0.15
      ? "reject"
      : "idle";

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative w-full h-16 rounded-full overflow-hidden select-none",
        "border transition-colors duration-fast",
        tone === "approve"
          ? "bg-status-success/15 border-status-success/40"
          : tone === "reject"
          ? "bg-status-danger/15 border-status-danger/40"
          : "bg-bg-surface-raised border-border"
      )}
    >
      {/* Side hints */}
      <div className="absolute inset-y-0 right-5 flex items-center gap-1.5 text-status-success">
        <ChevronsRight className="w-4 h-4" strokeWidth={2.5} />
        <span className="text-xs font-medium tracking-tight">اسحب للموافقة</span>
      </div>
      <div className="absolute inset-y-0 left-5 flex items-center gap-1.5 text-status-danger">
        <span className="text-xs font-medium tracking-tight">اسحب للرفض</span>
        <ChevronsLeft className="w-4 h-4" strokeWidth={2.5} />
      </div>

      {/* Handle */}
      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label="اسحب للموافقة أو الرفض"
        disabled={!!decided}
        className={cn(
          "absolute top-1/2 left-1/2 -translate-y-1/2",
          "w-12 h-12 rounded-full",
          "flex items-center justify-center",
          "shadow-md cursor-grab active:cursor-grabbing",
          "transition-colors duration-fast",
          tone === "approve"
            ? "bg-status-success text-white"
            : tone === "reject"
            ? "bg-status-danger text-white"
            : "bg-brand-primary text-text-on-brand"
        )}
        style={{
          transform: `translate(calc(-50% + ${offset * 100}px), -50%)`,
          transition: dragging ? "none" : "transform 220ms cubic-bezier(0.16, 1, 0.3, 1), background-color 200ms ease",
        }}
      >
        {tone === "approve" ? (
          <Check className="w-5 h-5" strokeWidth={2.5} />
        ) : tone === "reject" ? (
          <X className="w-5 h-5" strokeWidth={2.5} />
        ) : (
          <div className="flex items-center gap-0.5">
            <span className="w-1 h-4 rounded-full bg-current opacity-60" />
            <span className="w-1 h-4 rounded-full bg-current opacity-60" />
          </div>
        )}
      </button>
    </div>
  );
}
