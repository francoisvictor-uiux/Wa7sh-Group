/**
 * Module list — shared across all 3 nav variants (mobile/tablet/desktop).
 *
 * `mobile`      → appears in mobile bottom-tabs
 * `desktopOnly` → hidden in mobile/tablet nav
 * `hidden`      → exists in code but never shown in any nav
 *                 Use for modules under development or temporarily disabled.
 *
 * PHASE 1 FOCUS: مخزون · طلبات · شحن · استلام · موردون
 * HIDDEN (phase 2): المالية
 */

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Building2,
  Users,
  Wallet,
  Settings,
  UserPlus,
  Scale,
} from "lucide-react";

export interface NavItem {
  id: string;
  href: string;
  label: string;
  labelEn: string;
  icon: LucideIcon;
  mobile?: boolean;
  desktopOnly?: boolean;
  hidden?: boolean;   // ← hides from all navs, keeps routes alive
  badge?: number;
}

export const navItems: NavItem[] = [
  {
    id: "dashboard",
    href: "/dashboard",
    label: "الرئيسية",
    labelEn: "Dashboard",
    icon: LayoutDashboard,
    mobile: true,
  },
  {
    id: "inventory",
    href: "/inventory",
    label: "المخزون",
    labelEn: "Inventory",
    icon: Package,
    mobile: true,
  },
  {
    id: "requests",
    href: "/requests",
    label: "الطلبات",
    labelEn: "Requests",
    icon: ClipboardList,
    mobile: true,
    badge: 4,
  },
  {
    id: "disputes",
    href: "/disputes",
    label: "فض المنازعات",
    labelEn: "Disputes",
    icon: Scale,
  },
  {
    id: "suppliers",
    href: "/suppliers",
    label: "الموردون",
    labelEn: "Suppliers",
    icon: Building2,
  },
  {
    id: "hr",
    href: "/hr",
    label: "الموارد البشرية",
    labelEn: "HR",
    icon: Users,
  },
  {
    id: "finance",
    href: "/finance",
    label: "المالية",
    labelEn: "Finance",
    icon: Wallet,
    hidden: true,   // ← Phase 2 — code kept, nav hidden
  },
  {
    id: "users",
    href: "/users",
    label: "المستخدمين",
    labelEn: "Users",
    icon: UserPlus,
  },
  {
    id: "settings",
    href: "/settings",
    label: "الإعدادات",
    labelEn: "Settings",
    icon: Settings,
  },
];

// Filter out hidden items before passing to any nav
const visibleItems = navItems.filter((i) => !i.hidden);

export const mobileTabItems  = visibleItems.filter((i) => i.mobile);
export const tabletNavItems  = visibleItems.filter((i) => !i.desktopOnly);
export const desktopNavItems = visibleItems;

/**
 * Filter by role — applied on top of visibility filter.
 */
import { moduleAccess, type Role } from "@/lib/permissions";

export function filterByRole(items: NavItem[], role: Role): NavItem[] {
  const allowed = moduleAccess[role];
  return items.filter((i) => allowed.includes(i.id));
}
