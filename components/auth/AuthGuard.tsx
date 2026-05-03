"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { canAccess, moduleIdFromPath } from "@/lib/permissions";

/**
 * AuthGuard — wraps authenticated routes.
 *
 * Rules:
 *   1. Not logged in          → redirect to /login
 *   2. Logged in, no access   → redirect to /dashboard (403 fallback)
 *   3. Logged in, has access  → render children
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until localStorage rehydration completes before deciding
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user) {
      const moduleId = moduleIdFromPath(pathname);
      if (moduleId !== "dashboard" && moduleId !== "settings") {
        if (!canAccess(user.role, moduleId)) {
          router.replace("/dashboard");
        }
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  // Show spinner only during initial hydration, not on every unauthenticated check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-canvas">
        <div className="flex flex-col items-center gap-4">
          <span className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
          <span className="text-sm text-text-tertiary">جارٍ التحقق...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
