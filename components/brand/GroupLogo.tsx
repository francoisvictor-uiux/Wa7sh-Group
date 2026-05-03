"use client";

import { cn } from "@/lib/utils";
import { asset } from "@/lib/basePath";

/**
 * GroupLogo — the El Wahsh Group identity. Mirrors the lockup used on the
 * login screen: circular logo image + Arabic name "مجموعة الوحش" stacked
 * over the English wordmark "EL WAHSH GROUP".
 *
 * Used for users that span multiple brands — owner, HR, and every factory
 * role. Branch / brand users keep seeing their specific brand mark.
 */
export function GroupLogo({
  size = 32,
  withWordmark = false,
  variant = "auto",
  className,
}: {
  size?: number;
  withWordmark?: boolean;
  /**
   * "auto" — picks border + text colors from the surrounding theme tokens
   *          (use inside the topbar / light surfaces).
   * "dark" — fixed colors for placement on the dark sidebar.
   */
  variant?: "auto" | "dark";
  className?: string;
}) {
  const isDarkVariant = variant === "dark";

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div
        className={cn(
          "shrink-0 rounded-full overflow-hidden",
          isDarkVariant
            ? "bg-white/5 ring-1 ring-white/15"
            : "bg-bg-surface border border-border-subtle"
        )}
        style={{ width: size, height: size }}
      >
        <img
          src={asset("/login/logo.webp")}
          alt="مجموعة الوحش"
          width={size}
          height={size}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      {withWordmark && (
        <div className="flex flex-col leading-none min-w-0">
          <span
            className={cn(
              "font-bold tracking-tight truncate",
              size >= 40 ? "text-lg" : "text-sm",
              isDarkVariant ? "text-white" : "text-text-primary"
            )}
          >
            مجموعة الوحش
          </span>
          <span
            className={cn(
              "tracking-[0.18em] uppercase mt-1 truncate",
              size >= 40 ? "text-[11px]" : "text-[9px]",
              isDarkVariant ? "text-white/55" : "text-text-tertiary"
            )}
          >
            EL WAHSH GROUP
          </span>
        </div>
      )}
    </div>
  );
}
