import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";

/**
 * Shared chrome for tablet/mobile auth screens.
 * Solid #FBF8F4 background — no textures, gradients, or decorative
 * patterns. Just the brand mark, the form, and a quiet signature.
 */
export function AuthShell({
  children,
  branchTag,
  className,
}: {
  children: React.ReactNode;
  branchTag?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col bg-[#FBF8F4]",
        className,
      )}
    >
      {/* Top bar — brand on the right (RTL), optional branch tag on the left */}
      <header className="flex items-center justify-between px-5 sm:px-8 pt-6 sm:pt-8">
        <BrandLogo size={36} withWordmark />
        {branchTag && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg-surface border border-border-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
            <span className="text-xs text-text-secondary tracking-tight">
              {branchTag}
            </span>
          </div>
        )}
      </header>

      {/* Main content — centered */}
      <main className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-[1100px]">{children}</div>
      </main>

      {/* Footer signature */}
      <footer className="text-center pb-6">
        <p className="text-[10px] text-text-tertiary tracking-[0.22em] uppercase">
          © 2026 · El Wahsh Group · الإسكندرية
        </p>
      </footer>
    </div>
  );
}
