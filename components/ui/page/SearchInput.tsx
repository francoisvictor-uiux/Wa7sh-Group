"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value:        string;
  onChange:     (v: string) => void;
  placeholder?: string;
  size?:        "sm" | "md";
  className?:   string;
}

/**
 * SearchInput — single source of truth for search inputs.
 * Use inside PageHeader's `meta` slot or above lists.
 */
export function SearchInput({
  value, onChange, placeholder = "بحث…", size = "md", className,
}: Props) {
  const sizes = {
    sm: "h-8  text-xs  pr-8  pl-7",
    md: "h-10 text-sm  pr-10 pl-9",
  };
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const iconRight = size === "sm" ? "right-2.5" : "right-3";
  const iconLeft  = size === "sm" ? "left-2"    : "left-2.5";

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none",
          iconSize, iconRight,
        )}
        strokeWidth={1.75}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-full border border-border-subtle bg-bg-surface-raised",
          "text-text-primary placeholder:text-text-tertiary tracking-tight",
          "focus:bg-bg-surface focus:border-brand-primary/40",
          "transition-colors duration-fast",
          sizes[size],
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="مسح"
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-text-tertiary",
            "hover:text-text-primary transition-colors",
            iconLeft,
          )}
        >
          <X className={iconSize} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
