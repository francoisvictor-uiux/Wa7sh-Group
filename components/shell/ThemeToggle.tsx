"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const { mode, toggleMode } = useTheme();
  const sizeClasses = size === "sm" ? "w-9 h-9" : "w-10 h-10";

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={mode === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
      className={cn(
        "inline-flex items-center justify-center rounded-md",
        "border border-border-subtle bg-bg-surface/60",
        "text-text-secondary hover:text-brand-primary hover:bg-bg-surface",
        "transition-all duration-fast ease-out-expo",
        "focus-visible:outline-none",
        sizeClasses,
        className
      )}
    >
      {mode === "dark" ? (
        <Sun className="w-4 h-4" strokeWidth={1.75} />
      ) : (
        <Moon className="w-4 h-4" strokeWidth={1.75} />
      )}
    </button>
  );
}
