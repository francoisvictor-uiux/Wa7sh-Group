"use client";

import { NavDesktop } from "./NavDesktop";

/**
 * Shell — app chrome. Desktop-only for now.
 * Tablet and mobile shells will be added in a future phase.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  return <NavDesktop>{children}</NavDesktop>;
}
