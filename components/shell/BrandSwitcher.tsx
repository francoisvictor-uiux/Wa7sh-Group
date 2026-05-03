"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { brandMeta, type BrandId as Brand } from "@/lib/mock/branches";
import { cn } from "@/lib/utils";

const brands: Brand[] = ["wahsh", "kababgy", "forno"];

export function BrandSwitcher({
  variant = "full",
  className,
}: {
  variant?: "full" | "compact";
  className?: string;
}) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Brand>(
    theme === "forno" ? "forno" : "wahsh"
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSelect = (b: Brand) => {
    setSelected(b);
    setTheme(brandMeta[b].theme);
    setOpen(false);
  };

  const selectedMeta = brandMeta[selected];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-2 rounded-md",
          "border border-border-subtle bg-bg-surface/60",
          "hover:border-border-strong hover:bg-bg-surface",
          "transition-all duration-fast ease-out-expo",
          "focus-visible:outline-none",
          variant === "full" ? "h-10 px-3 pl-2" : "h-9 px-2.5"
        )}
      >
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ background: selectedMeta.accent }}
        />
        {variant === "full" && (
          <>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-xs font-medium tracking-tight truncate max-w-[120px]">
                {selectedMeta.name}
              </span>
              <span className="text-[10px] text-text-tertiary truncate">
                {selectedMeta.nameEn}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-text-tertiary transition-transform duration-fast",
                open && "rotate-180"
              )}
              strokeWidth={2}
            />
          </>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 left-0 mt-2 w-64",
            "rounded-lg bg-bg-surface border border-border shadow-lg",
            "py-1.5",
            "animate-fadein"
          )}
        >
          <div className="px-3 py-2 text-[10px] tracking-[0.18em] uppercase text-text-tertiary">
            تبديل العلامة التجارية
          </div>
          {brands.map((b) => {
            const meta = brandMeta[b];
            const isSelected = b === selected;
            return (
              <button
                key={b}
                type="button"
                onClick={() => handleSelect(b)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-right",
                  "hover:bg-bg-surface-raised transition-colors duration-fast",
                  isSelected && "bg-bg-surface-raised"
                )}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: meta.accent }}
                />
                <div className="flex-1 min-w-0 flex flex-col items-start">
                  <span className="text-sm font-medium tracking-tight">
                    {meta.name}
                  </span>
                  <span className="text-[11px] text-text-tertiary">
                    {meta.nameEn}
                  </span>
                </div>
                {isSelected && (
                  <Check
                    className="w-4 h-4 text-brand-primary shrink-0"
                    strokeWidth={2.5}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
