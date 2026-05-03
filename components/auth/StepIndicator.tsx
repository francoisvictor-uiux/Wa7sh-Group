import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  current: number;
  total: number;
  label?: string;
}

export function StepIndicator({ current, total, label }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i + 1 === current;
          const isComplete = i + 1 < current;
          return (
            <div
              key={i}
              className="flex items-center gap-2"
              aria-current={isActive ? "step" : undefined}
            >
              <div
                className={cn(
                  "h-1.5 rounded-full transition-all duration-normal ease-out-expo",
                  isActive
                    ? "w-12 bg-brand-primary"
                    : isComplete
                    ? "w-6 bg-brand-primary/60"
                    : "w-6 bg-border"
                )}
              />
            </div>
          );
        })}
      </div>
      {label && (
        <span className="text-xs text-text-tertiary tracking-[0.18em] uppercase">
          {label}
        </span>
      )}
    </div>
  );
}
