"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { alertsFeed } from "@/lib/mock/alerts";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const priorityIntent = {
  p0: "danger",
  p1: "warning",
  p2: "info",
  p3: "neutral",
} as const;

const priorityLabel = {
  p0: "حرج",
  p1: "مهم",
  p2: "عادي",
  p3: "معلوماتي",
} as const;

export function NotificationBell({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = alertsFeed.filter((a) => a.unread).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="الإشعارات"
        className={cn(
          "relative inline-flex items-center justify-center w-10 h-10 rounded-md",
          "border border-border-subtle bg-bg-surface/60",
          "text-text-secondary hover:text-brand-primary hover:bg-bg-surface",
          "transition-all duration-fast ease-out-expo",
          "focus-visible:outline-none"
        )}
      >
        <Bell className="w-4 h-4" strokeWidth={1.75} />
        {unread > 0 && (
          <span
            className={cn(
              "absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full",
              "bg-status-danger text-white text-[10px] font-bold",
              "flex items-center justify-center leading-none tabular",
              "ring-2 ring-bg-canvas"
            )}
          >
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 left-0 mt-2 w-[360px] max-h-[480px]",
            "rounded-lg bg-bg-surface border border-border shadow-lg",
            "flex flex-col"
          )}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium tracking-tight">الإشعارات</h3>
              {unread > 0 && (
                <Badge intent="danger" size="sm">
                  {unread} جديد
                </Badge>
              )}
            </div>
            <button
              type="button"
              className="text-[11px] text-text-tertiary hover:text-brand-primary transition-colors"
            >
              تعليم الكل كمقروء
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {alertsFeed.slice(0, 6).map((alert) => (
              <Link
                key={alert.id}
                href={alert.ctaHref ?? "#"}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-3 border-b border-border-subtle last:border-0",
                  "hover:bg-bg-surface-raised transition-colors duration-fast",
                  alert.unread && "bg-bg-surface-raised/40"
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge intent={priorityIntent[alert.priority]} size="sm" dot pulse={alert.priority === "p0"}>
                      {priorityLabel[alert.priority]}
                    </Badge>
                    {alert.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-text-tertiary shrink-0">
                    {alert.timestamp}
                  </span>
                </div>
                <p className="text-sm font-medium tracking-tight mb-0.5">
                  {alert.title}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {alert.body}
                </p>
              </Link>
            ))}
          </div>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center justify-between px-4 py-2.5 border-t border-border-subtle",
              "text-xs text-brand-primary hover:bg-bg-surface-raised",
              "transition-colors duration-fast"
            )}
          >
            <span className="font-medium">عرض كل الإشعارات</span>
            <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
      )}
    </div>
  );
}
