"use client";

import { cn } from "@/lib/utils";

interface Props {
  children:  React.ReactNode;
  count?:    number | string;
  action?:   React.ReactNode;
  className?: string;
}

/**
 * SectionLabel — small caps section divider.
 * Use to label groups within a page (e.g. "الأصناف المطلوبة", "آخر الطلبيات").
 */
export function SectionLabel({ children, count, action, className }: Props) {
  return (
    <div className={cn("flex items-center justify-between mb-3", className)}>
      <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.2em]">
        {children}
        {count !== undefined && (
          <span className="font-normal mr-1.5 text-text-tertiary/70 tabular">
            ({count})
          </span>
        )}
      </p>
      {action}
    </div>
  );
}
