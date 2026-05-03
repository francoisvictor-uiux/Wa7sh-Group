"use client";

import { cn } from "@/lib/utils";

interface Props {
  header?:    React.ReactNode;
  children:   React.ReactNode;
  /** Right-rail aside on xl+ screens (e.g. expiry alerts, reorder list). */
  rail?:      React.ReactNode;
  /** Max content width. Defaults to "screen-2xl" (1536px). */
  maxWidth?:  "screen-xl" | "screen-2xl" | "full";
  className?: string;
}

const widths = {
  "screen-xl":  "max-w-[1280px]",
  "screen-2xl": "max-w-[1600px]",
  full:         "",
};

/**
 * PageShell — single source of truth for page layout.
 *
 * Replaces hand-rolled `device === "mobile" ? "px-4" : "px-8"` ternaries.
 * Sticky header at top, fluid responsive padding, optional right rail on xl+.
 *
 *   <PageShell header={<PageHeader … />}>
 *     <section>…</section>
 *   </PageShell>
 *
 *   <PageShell header={…} rail={<ExpiryRail/>}>
 *     <section>…</section>
 *   </PageShell>
 */
export function PageShell({
  header, children, rail, maxWidth = "screen-2xl", className,
}: Props) {
  return (
    <div className={cn("min-h-full", className)}>
      {header && (
        <div className="sticky top-0 z-10 bg-bg-canvas/85 backdrop-blur-sm">
          <div className={cn("mx-auto", widths[maxWidth])}>
            {header}
          </div>
        </div>
      )}
      <div className={cn(
        "mx-auto px-4 md:px-6 xl:px-8 py-5 md:py-6",
        widths[maxWidth],
      )}>
        {rail ? (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
            <div className="space-y-5 min-w-0">{children}</div>
            <aside className="space-y-5 min-w-0">{rail}</aside>
          </div>
        ) : (
          <div className="space-y-5">{children}</div>
        )}
      </div>
    </div>
  );
}
