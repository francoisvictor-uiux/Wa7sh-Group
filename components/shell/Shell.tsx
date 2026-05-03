"use client";

import { NavDesktop } from "./NavDesktop";
import { useLiveOrderEvents } from "@/hooks/useLiveOrderEvents";

/**
 * Shell — app chrome. Desktop-only for now.
 * Tablet and mobile shells will be added in a future phase.
 *
 * Mounts useLiveOrderEvents at the shell level so every authenticated page
 * gets toast notifications when the other side of a request changes state.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  useLiveOrderEvents();
  return <NavDesktop>{children}</NavDesktop>;
}
