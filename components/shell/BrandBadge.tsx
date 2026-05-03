"use client";

import { useBrand, type BrandId } from "@/components/brand/BrandLogo";
import { useAuth } from "@/hooks/useAuth";
import { asset } from "@/lib/basePath";
import { cn } from "@/lib/utils";

const brandLabels: Record<BrandId, { name: string; nameEn: string; accent: string }> = {
  wahsh: { name: "الوحش برجر", nameEn: "Wahsh Burger", accent: "#2563EB" },
  kababgy: { name: "كبابجي الوحش", nameEn: "Kababgy Elwahsh", accent: "#C8A75A" },
  forno: { name: "فورنو بيتزا", nameEn: "Forno Pizza", accent: "#2A6B41" },
};

const groupLabel = { name: "مجموعة الوحش", nameEn: "El Wahsh Group", accent: "#C8A75A" };
const GROUP_SCOPES = new Set(["group", "factory"]);

/**
 * BrandBadge — read-only display of the current brand or the group identity.
 *
 * - Group / factory scope users → "مجموعة الوحش" with the group logo.
 * - Brand / branch scope users   → their specific brand mark.
 *
 * Identity follows the logged-in user — there is no UI switcher.
 */
export function BrandBadge({
  variant = "full",
  className,
}: {
  variant?: "full" | "compact";
  className?: string;
}) {
  const { brand } = useBrand();
  const { user } = useAuth();
  const isGroup = !!user && GROUP_SCOPES.has(user.scope);
  const meta = isGroup ? groupLabel : brandLabels[brand];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-md",
        "border border-border-subtle bg-bg-surface/40",
        variant === "full" ? "h-10 px-2 pe-3" : "h-9 px-1.5 pe-2.5",
        className
      )}
    >
      {isGroup ? (
        <span
          className={cn(
            "shrink-0 rounded-full overflow-hidden border border-border-subtle bg-bg-surface",
            variant === "full" ? "w-7 h-7" : "w-6 h-6"
          )}
        >
          <img
            src={asset("/login/logo.webp")}
            alt="مجموعة الوحش"
            width={28}
            height={28}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </span>
      ) : (
        <span
          className={cn(
            "shrink-0 rounded-full overflow-hidden border border-border-subtle bg-bg-surface",
            variant === "full" ? "w-7 h-7" : "w-6 h-6"
          )}
        >
          <img
            src={asset(`/brands/${brand}.webp`)}
            alt={meta.name}
            width={28}
            height={28}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </span>
      )}
      {variant === "full" && (
        <div className="flex flex-col items-start min-w-0 leading-none">
          <span className="text-xs font-bold tracking-tight truncate max-w-[160px]">
            {meta.name}
          </span>
          <span className="text-[10px] text-text-tertiary tracking-[0.14em] uppercase truncate mt-1">
            {meta.nameEn}
          </span>
        </div>
      )}
    </div>
  );
}
