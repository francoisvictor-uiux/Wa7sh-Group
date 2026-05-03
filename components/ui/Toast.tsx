"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  BadgeCheck,
  X,
} from "lucide-react";
import { useToastContext, type Toast, type ToastType } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

// ─── Type config ──────────────────────────────────────────────────────────────
// Each state gets a clearly distinct solid background. Text + icons sit on
// top of that color in white, white-bordered icon chip for added contrast.

const config: Record<
  ToastType,
  {
    icon: typeof CheckCircle2;
    bg:   string;
  }
> = {
  success: { icon: CheckCircle2,  bg: "bg-status-success" },
  error:   { icon: XCircle,       bg: "bg-status-danger"  },
  warning: { icon: AlertTriangle, bg: "bg-status-warning" },
  info:    { icon: Info,          bg: "bg-status-info"    },
  confirm: { icon: BadgeCheck,    bg: "bg-brand-primary"  },
};

// ─── Single Toast item ────────────────────────────────────────────────────────

function ToastItem({ toast }: { toast: Toast }) {
  const { dismiss } = useToastContext();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const duration = toast.duration ?? 4000;
  const { icon: Icon, bg } = config[toast.type];

  // Entrance
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (duration <= 0) return;
    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => dismiss(toast.id), 280);
    }, duration - 280);
    return () => clearTimeout(timerRef.current);
  }, [duration, toast.id, dismiss]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => dismiss(toast.id), 280);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        // Solid colored rectangle with rounded corners — clear state at a glance
        "relative w-full max-w-sm overflow-hidden rounded-lg shadow-lg",
        "text-white",
        bg,
        // Smooth entrance — slide UP from below + fade
        "transition-all duration-[280ms] ease-out-expo",
        visible && !exiting
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3"
      )}
    >
      {/* Content */}
      <div className="flex items-start gap-3 px-4 py-3.5">

        {/* Icon — white on subtle white-translucent backdrop */}
        <div className="shrink-0 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
          <Icon className="w-4 h-4 text-white" strokeWidth={2.25} />
        </div>

        {/* Title + description */}
        <div className="flex-1 min-w-0 py-0.5">
          <p className="text-sm font-semibold tracking-tight leading-snug">
            {toast.title}
          </p>
          {toast.description && (
            <p className="text-xs text-white/85 mt-0.5 leading-relaxed">
              {toast.description}
            </p>
          )}
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="إغلاق"
          className={cn(
            "shrink-0 w-7 h-7 rounded-md flex items-center justify-center",
            "text-white/80 hover:text-white",
            "hover:bg-white/15 transition-colors duration-fast"
          )}
        >
          <X className="w-3.5 h-3.5" strokeWidth={2.25} />
        </button>
      </div>

      {/* Progress bar — bottom edge, white at low opacity over the colored bg */}
      {duration > 0 && (
        <span
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/45 origin-right"
          style={{
            animation: `toast-shrink ${duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────

export function ToastContainer() {
  const { toasts } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <>
      {/* Keyframe — shrink horizontally from full width to 0 */}
      <style>{`
        @keyframes toast-shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>

      <div
        aria-label="الإشعارات"
        className={cn(
          "fixed bottom-6 z-[9999] pointer-events-none",
          // RTL: stick to visual right edge (= start of reading flow)
          "right-6",
          // Stack: newest on top, growing upward
          "flex flex-col-reverse gap-2.5 items-stretch",
          "w-full max-w-sm"
        )}
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} />
          </div>
        ))}
      </div>
    </>
  );
}
