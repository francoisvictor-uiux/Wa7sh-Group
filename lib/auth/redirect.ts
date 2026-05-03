import type { Role } from "@/lib/permissions";

/**
 * Where to land after login.
 * Single-user mode for now — everyone goes to the dashboard.
 */
export function getPostLoginRoute(_role: Role): string {
  return "/dashboard";
}
