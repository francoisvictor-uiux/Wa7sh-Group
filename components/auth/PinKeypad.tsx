"use client";

import { Delete, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PinKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onSubmit?: () => void;
  size?: "tablet" | "mobile";
  disabled?: boolean;
}

const tabletKey =
  "h-20 w-20 sm:h-[88px] sm:w-[88px] text-3xl rounded-md";
const mobileKey = "h-[68px] w-[68px] text-2xl rounded-md";

/**
 * PIN keypad — sized for gloved/wet-hand use on tablet, tighter on mobile.
 * Each key has a tactile press response: scale-down + warm gold ring.
 *
 * Layout reads naturally for both LTR and RTL since digits are universal —
 * 1-2-3 / 4-5-6 / 7-8-9 / ⌫-0-✓
 */
export function PinKeypad({
  onDigit,
  onBackspace,
  onSubmit,
  size = "tablet",
  disabled,
}: PinKeypadProps) {
  const k = size === "tablet" ? tabletKey : mobileKey;
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const KeyShell = ({
    children,
    onClick,
    label,
    intent = "neutral",
  }: {
    children: React.ReactNode;
    onClick: () => void;
    label: string;
    intent?: "neutral" | "primary" | "danger";
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        k,
        "group relative flex items-center justify-center",
        "font-medium tabular",
        "bg-bg-surface-raised border border-border-subtle",
        "transition-all duration-fast ease-out-expo",
        "hover:border-brand-primary hover:bg-bg-surface-overlay",
        "active:scale-95 active:bg-brand-primary active:text-text-on-brand",
        "focus-visible:border-brand-primary focus-visible:bg-bg-surface-overlay",
        "disabled:pointer-events-none disabled:opacity-40",
        intent === "primary" &&
          "text-brand-primary hover:text-brand-primary-hover",
        intent === "danger" &&
          "text-text-secondary hover:text-status-danger hover:border-status-danger",
        intent === "neutral" && "text-text-primary"
      )}
    >
      {/* Subtle gold halo on hover */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-md opacity-0 transition-opacity duration-fast",
          "group-hover:opacity-100"
        )}
        style={{
          boxShadow: "inset 0 0 0 1px rgba(200, 167, 90, 0.25)",
        }}
      />
      <span className="relative">{children}</span>
    </button>
  );

  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-3",
        size === "tablet" ? "sm:gap-4" : "gap-3"
      )}
    >
      {digits.map((d) => (
        <KeyShell key={d} onClick={() => onDigit(d)} label={`الرقم ${d}`}>
          {d}
        </KeyShell>
      ))}

      <KeyShell onClick={onBackspace} label="حذف" intent="danger">
        <Delete strokeWidth={1.75} className="w-6 h-6" />
      </KeyShell>

      <KeyShell onClick={() => onDigit("0")} label="الرقم 0">
        0
      </KeyShell>

      <KeyShell
        onClick={() => onSubmit?.()}
        label="تأكيد"
        intent="primary"
      >
        <Check strokeWidth={2} className="w-6 h-6" />
      </KeyShell>
    </div>
  );
}
