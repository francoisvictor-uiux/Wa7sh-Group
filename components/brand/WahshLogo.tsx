import { cn } from "@/lib/utils";

interface WahshLogoProps {
  className?: string;
  size?: number;
  withWordmark?: boolean;
}

/**
 * Wahsh logo — abstracted as a stylised "و" (Arabic Waw)
 * combined with a flame mark. Renders in currentColor so it
 * adapts to whatever foreground the parent provides.
 */
export function WahshLogo({
  className,
  size = 48,
  withWordmark = false,
}: WahshLogoProps) {
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
        {/* Outer ring — fine, almost invisible */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.35"
        />
        {/* Inner mark — abstracted Waw with flame top */}
        <path
          d="M32 14
             C 38 14, 42 18, 42 24
             C 42 30, 36 34, 32 34
             C 28 34, 22 30, 22 24
             C 22 18, 26 14, 32 14 Z"
          fill="currentColor"
          opacity="0.95"
        />
        <path
          d="M32 8
             C 33 11, 34 13, 35 15
             C 33.5 14, 32.5 14, 32 14
             C 31.5 14, 30.5 14, 29 15
             C 30 13, 31 11, 32 8 Z"
          fill="currentColor"
        />
        <path
          d="M22 38
             L 42 38
             L 38 50
             L 26 50 Z"
          fill="currentColor"
          opacity="0.85"
        />
        {/* Centre dot */}
        <circle cx="32" cy="24" r="2" fill="var(--bg-canvas)" />
      </svg>
      {withWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-bold text-sm tracking-tight">الوحش برجر</span>
          <span className="text-[10px] text-text-tertiary tracking-[0.18em] uppercase mt-1">
            WAHSH BURGER
          </span>
        </div>
      )}
    </div>
  );
}
