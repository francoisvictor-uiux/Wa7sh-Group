import { cn } from "@/lib/utils";

/**
 * AmbientBackdrop — atmospheric layered background for auth screens.
 * Stack:
 *   1. Canvas color (from theme)
 *   2. Brand halo (radial gold/green glow at top)
 *   3. Mashrabiya pattern (very faint, masked to fade out at edges)
 *   4. Vignette (subtle darkening at corners)
 *
 * Children render above the stack at z-index 10.
 */
export function AmbientBackdrop({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "centered" | "split";
}) {
  return (
    <div
      className={cn(
        "relative isolate min-h-screen w-full overflow-hidden",
        className
      )}
    >
      {/* Layer 1 — Brand halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] -z-10"
        style={{ background: "var(--halo-brand)" }}
      />

      {/* Layer 2 — Mashrabiya pattern (cultural register) */}
      <div aria-hidden className="mashrabiya -z-10" />

      {/* Layer 3 — Edge vignette (theme-aware via --vignette) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--vignette)" }}
      />

      {/* Layer 4 — A single decorative gold ribbon at top, very fine */}
      {variant !== "split" && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(640px,80vw)] gold-hairline -z-10"
        />
      )}

      {/* Content */}
      <div className="relative z-10 min-h-screen w-full">{children}</div>
    </div>
  );
}
