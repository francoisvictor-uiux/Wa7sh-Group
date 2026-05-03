"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon?:        LucideIcon;
  title:        string;
  description?: string;
  actions?:     React.ReactNode;
  meta?:        React.ReactNode;
  className?:   string;
}

/**
 * PageHeader — single source of truth for page headers across the app.
 *
 * Layout:
 *   [icon]  title              [actions]
 *           description
 *           meta
 *
 * Use at the top of every full-page module (Verification, Users, Inventory, etc.).
 * Don't put inside lists or split panes — use SectionHeader for those.
 */
export function PageHeader({
  icon: Icon, title, description, actions, meta, className,
}: Props) {
  return (
    <header className={cn(
      "px-6 py-5 bg-bg-surface border-b border-border-subtle",
      className
    )}>
      <div className="flex items-start justify-between gap-4">

        {/* Left — title + icon */}
        <div className="flex items-start gap-3 min-w-0">
          {Icon && (
            <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-primary/12 text-brand-primary flex items-center justify-center">
              <Icon className="w-5 h-5" strokeWidth={1.75} />
            </div>
          )}
          <div className="min-w-0 pt-0.5">
            <h1 className="text-base font-bold tracking-tight leading-snug">
              {title}
            </h1>
            {description && (
              <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">
                {description}
              </p>
            )}
            {meta && <div className="mt-1.5">{meta}</div>}
          </div>
        </div>

        {/* Right — actions */}
        {actions && (
          <div className="shrink-0 flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
