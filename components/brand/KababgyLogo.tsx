import { cn } from "@/lib/utils";

interface KababgyLogoProps {
  className?: string;
  size?: number;
  withWordmark?: boolean;
}

/**
 * Kababgy Elwahsh logo — sister brand to Wahsh Burger.
 * Visual: same gold-on-dark family, but the mark is a stylized
 * skewer + flame instead of the Waw glyph.
 */
export function KababgyLogo({
  className,
  size = 48,
  withWordmark = false,
}: KababgyLogoProps) {
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
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.35"
        />

        {/* Flame */}
        <path
          d="M32 8
             C 36 14, 40 16, 40 24
             C 40 30, 36 33, 32 33
             C 28 33, 24 30, 24 24
             C 24 16, 28 14, 32 8 Z"
          fill="currentColor"
          opacity="0.95"
        />
        <path
          d="M32 14
             C 33.5 18, 35 20, 35 24
             C 35 27, 33.5 28, 32 28
             C 30.5 28, 29 27, 29 24
             C 29 20, 30.5 18, 32 14 Z"
          fill="var(--bg-canvas)"
          opacity="0.9"
        />

        {/* Skewer + meat triangles */}
        <line
          x1="14"
          y1="42"
          x2="50"
          y2="42"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* meat pieces */}
        <rect x="18" y="38" width="6" height="8" rx="1" fill="currentColor" opacity="0.85" />
        <rect x="29" y="38" width="6" height="8" rx="1" fill="currentColor" opacity="0.85" />
        <rect x="40" y="38" width="6" height="8" rx="1" fill="currentColor" opacity="0.85" />

        {/* Base bar */}
        <path
          d="M22 52 L42 52 L40 56 L24 56 Z"
          fill="currentColor"
          opacity="0.7"
        />
      </svg>
      {withWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-bold text-lg tracking-tight">كبابجي الوحش</span>
          <span className="text-[11px] text-text-tertiary tracking-[0.18em] uppercase mt-1">
            Kababgy Elwahsh
          </span>
        </div>
      )}
    </div>
  );
}
