"use client";

import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  unit,
  min = 0,
  max = 9999,
  step = 1,
  size = "md",
  className,
}: QuantityStepperProps) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  const sizes = {
    sm: { btn: "w-7 h-7", input: "h-7 text-xs min-w-[44px]", label: "text-[10px]" },
    md: { btn: "w-9 h-9", input: "h-9 text-sm min-w-[52px]", label: "text-[11px]" },
    lg: { btn: "w-11 h-11", input: "h-11 text-base min-w-[64px]", label: "text-xs" },
  };
  const s = sizes[size];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-bg-surface overflow-hidden",
        className
      )}
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="نقص"
        className={cn(
          s.btn,
          "flex items-center justify-center text-text-secondary",
          "hover:bg-bg-surface-raised hover:text-brand-primary",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
          "transition-colors duration-fast"
        )}
      >
        <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>

      <div
        className={cn(
          s.input,
          "flex flex-col items-center justify-center px-2 border-x border-border-subtle",
          "tabular font-medium tracking-tight"
        )}
      >
        <span>{value}</span>
        {unit && (
          <span className={cn("text-text-tertiary leading-none mt-0.5", s.label)}>
            {unit}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="زيادة"
        className={cn(
          s.btn,
          "flex items-center justify-center text-text-secondary",
          "hover:bg-bg-surface-raised hover:text-brand-primary",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
          "transition-colors duration-fast"
        )}
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
