"use client";

import { useAuth } from "@/hooks/useAuth";
import { type Role, DEFAULT_ROLE } from "@/lib/permissions";

/**
 * useRole — derives the current user's role from AuthContext.
 * Kept as a thin wrapper so existing shell/nav components need
 * minimal changes.
 */
export function useRole(): { role: Role } {
  const { user } = useAuth();
  return { role: (user?.role ?? DEFAULT_ROLE) as Role };
}
