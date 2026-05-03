import { cn } from "@/lib/utils";

interface FornoLogoProps {
  className?: string;
  size?: number;
  withWordmark?: boolean;
}

/**
 * Forno Pizza logo — Italian neon-sign aesthetic.
 * Visual: pizza slice with green crust + red base + cream center,
 * inside a hand-drawn "oven mouth" arch.
 */
export function FornoLogo({
  className,
  size = 48,
  withWordmark = false,
}: FornoLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer ring */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.35"
        />

        {/* Oven arch — "F" shaped negative space */}
        <path
          d="M14 48
             L14 26
             A 18 18 0 0 1 50 26
             L50 48
             Z"
          fill="currentColor"
          opacity="0.9"
        />

        {/* Pizza slice — main mark */}
        <g transform="translate(32, 30)">
          {/* slice triangle (cream) */}
          <path
            d="M0 -16
               L 14 14
               L -14 14 Z"
            fill="#f8f5ec"
          />
          {/* crust edge (green/red gradient simulation via two arcs) */}
          <path
            d="M -14 14 L 14 14"
            stroke="#e64001"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* tomato dots */}
          <circle cx="-4" cy="2" r="2.5" fill="#e64001" />
          <circle cx="5" cy="-3" r="2" fill="#e64001" />
          <circle cx="2" cy="7" r="2" fill="#e64001" />
          {/* basil dots — italian green */}
          <circle cx="-2" cy="-5" r="1.5" fill="#3a8856" />
          <circle cx="6" cy="5" r="1.5" fill="#3a8856" />
          <circle cx="-6" cy="6" r="1.5" fill="#3a8856" />
        </g>

        {/* Bottom flame line */}
        <path
          d="M22 50 Q 28 46 32 48 Q 36 50 42 47"
          stroke="#fd9d04"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
      {withWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-bold text-lg tracking-tight">فورنو بيتزا</span>
          <span className="text-[11px] text-text-tertiary tracking-[0.18em] uppercase mt-1">
            Forno Pizza
          </span>
        </div>
      )}
    </div>
  );
}
