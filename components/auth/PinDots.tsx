import { cn } from "@/lib/utils";

interface PinDotsProps {
  length: number;
  filled: number;
  error?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { gap: "gap-3", dot: "w-3 h-3", ring: "w-9 h-9" },
  md: { gap: "gap-4", dot: "w-3.5 h-3.5", ring: "w-12 h-12" },
  lg: { gap: "gap-5", dot: "w-4 h-4", ring: "w-14 h-14" },
};

/**
 * PIN dots — visual feedback for digits typed.
 * Each slot is an empty ring; when filled, a brand-coloured dot
 * animates into existence. On error the whole row shakes.
 */
export function PinDots({
  length,
  filled,
  error,
  size = "md",
}: PinDotsProps) {
  const s = sizes[size];
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        s.gap,
        error && "animate-shake"
      )}
      role="presentation"
      aria-label={`${filled} من ${length} أرقام`}
    >
      {Array.from({ length }).map((_, i) => {
        const isFilled = i < filled;
        return (
          <div
            key={i}
            className={cn(
              "relative flex items-center justify-center rounded-full",
              "border transition-colors duration-fast ease-out-expo",
              s.ring,
              isFilled
                ? error
                  ? "border-status-danger"
                  : "border-brand-primary"
                : "border-border"
            )}
          >
            {isFilled && (
              <span
                className={cn(
                  "rounded-full dot-fill",
                  s.dot,
                  error ? "bg-status-danger" : "bg-brand-primary"
                )}
                style={{
                  boxShadow: error
                    ? "none"
                    : "0 0 12px -2px var(--brand-primary)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
