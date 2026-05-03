"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------
 * Dropdown — modern custom select.
 *
 * Replaces the native <select> with a proper popover panel that matches
 * the rest of the design system (rounded corners, soft shadow, hover/
 * selected states, smooth open animation, click-outside + ESC to close).
 *
 *   <Dropdown
 *     value={form.category}
 *     onChange={(v) => update("category", v)}
 *     options={[{ value: "meat", label: "اللحوم" }, …]}
 *     placeholder="اختر فئة"
 *   />
 * -------------------------------------------------------------------- */

export interface DropdownOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

interface DropdownProps {
  value: string;
  onChange: (next: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "اختر...",
  disabled,
  hasError,
  className,
}: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number>(() =>
    Math.max(0, options.findIndex((o) => o.value === value))
  );
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const current = options.find((o) => o.value === value);

  // Sync active index with current value when opening
  React.useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  }, [open, value, options]);

  // Click-outside + ESC to close
  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleTriggerKey(e: React.KeyboardEvent) {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function handlePanelKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      let next = activeIndex;
      for (let i = 0; i < options.length; i++) {
        next = (next + 1) % options.length;
        if (!options[next].disabled) break;
      }
      setActiveIndex(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      let next = activeIndex;
      for (let i = 0; i < options.length; i++) {
        next = (next - 1 + options.length) % options.length;
        if (!options[next].disabled) break;
      }
      setActiveIndex(next);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = options[activeIndex];
      if (opt && !opt.disabled) {
        onChange(opt.value);
        setOpen(false);
        triggerRef.current?.focus();
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    }
  }

  return (
    <div className={cn("relative", className)}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={handleTriggerKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "w-full flex items-center justify-between gap-2 h-11 px-3.5 rounded-sm",
          "text-right transition-all duration-fast ease-out-expo",
          "bg-bg-surface border border-border",
          "hover:border-border-strong",
          "focus:outline-none focus-visible:border-border-focus focus-visible:shadow-glow-brand",
          open && "border-border-focus shadow-glow-brand",
          hasError && "border-status-danger",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className={cn(
          "flex-1 min-w-0 truncate text-sm tracking-tight",
          current ? "text-text-primary" : "text-text-tertiary"
        )}>
          {current ? current.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "shrink-0 w-3.5 h-3.5 text-text-tertiary transition-transform duration-fast ease-out-expo",
            open && "rotate-180"
          )}
          strokeWidth={2}
        />
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="listbox"
          tabIndex={-1}
          onKeyDown={handlePanelKey}
          className={cn(
            "absolute z-50 mt-1.5 w-full",
            "bg-bg-surface-raised border border-border-subtle rounded-md",
            "shadow-lg overflow-hidden",
            "animate-scale-in origin-top"
          )}
          style={{ transformOrigin: "top center" }}
        >
          <ul className="max-h-[280px] overflow-y-auto py-1">
            {options.map((opt, i) => {
              const selected = opt.value === value;
              const active = i === activeIndex;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    disabled={opt.disabled}
                    onClick={() => {
                      if (opt.disabled) return;
                      onChange(opt.value);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3.5 py-2.5",
                      "text-right text-sm tracking-tight transition-colors duration-fast",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      selected
                        ? "text-brand-primary font-medium"
                        : "text-text-primary",
                      active && !opt.disabled && "bg-brand-primary/[0.08]",
                    )}
                  >
                    <span className="flex-1 min-w-0 truncate text-right">
                      {opt.label}
                      {opt.hint && (
                        <span className="block text-[11px] text-text-tertiary mt-0.5 truncate">
                          {opt.hint}
                        </span>
                      )}
                    </span>
                    {selected && (
                      <Check className="shrink-0 w-3.5 h-3.5 text-brand-primary" strokeWidth={2.5} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
