import type { Role, Scope } from "@/lib/permissions";
import type { BrandId } from "@/lib/mock/branches";

export type { Role, Scope, BrandId };

/**
 * The authenticated user — single source of truth for identity.
 *
 * scope determines what data this user can see:
 *   group   → all brands + factory (owner, hr-manager)
 *   factory → factory only + cross-brand logistics (warehouse roles, driver)
 *   brand   → all branches within brandId only
 *   branch  → single branchId only
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  scope: Scope;

  /** Set for brand + branch scoped users */
  brandId?: BrandId;

  /** Set for branch scoped users only */
  branchId?: string;

  /** Demo only — in production this comes from the server */
  pin?: string;

  /** Demo only — plain-text password for desktop login simulation */
  password?: string;
}
