/**
 * Role-based access control for El Wahsh Group ERP.
 *
 * Currently a single role is active (owner — full access). The role
 * infrastructure is kept intact so additional roles can be re-introduced
 * once each user's screens are designed.
 */

import type { LucideIcon } from "lucide-react";
import { Crown, Users, Warehouse, Factory } from "lucide-react";

export type Role = "owner" | "hr-manager" | "warehouse-manager" | "factory-manager" | "branch-manager";

export type Scope = "group" | "factory" | "brand" | "branch";

export interface RoleMeta {
  id: Role;
  label: string;
  labelEn: string;
  description: string;
  icon: LucideIcon;
  scope: Scope;
  primaryDevice: "mobile" | "tablet" | "desktop" | "tablet+desktop";
  canAddUsers: boolean;
}

export const roles: RoleMeta[] = [
  {
    id: "owner",
    label: "الأونر",
    labelEn: "Owner",
    description: "وصول كامل لكل البراندات والمصنع — رؤية تنفيذية شاملة",
    icon: Crown,
    scope: "group",
    primaryDevice: "desktop",
    canAddUsers: true,
  },
  {
    id: "hr-manager",
    label: "مدير الموارد البشرية",
    labelEn: "HR Manager",
    description: "إدارة موظفي المجموعة كاملة",
    icon: Users,
    scope: "group",
    primaryDevice: "desktop",
    canAddUsers: true,
  },
  {
    id: "warehouse-manager",
    label: "مدير المخزن",
    labelEn: "Warehouse Manager",
    description: "إدارة مخزون المصنع، الطلبات، الموردين",
    icon: Warehouse,
    scope: "factory",
    primaryDevice: "tablet+desktop",
    canAddUsers: true,
  },
  {
    id: "factory-manager",
    label: "مدير المصنع",
    labelEn: "Factory Manager",
    description: "إدارة عمليات المصنع كاملة — الإنتاج، المخزون، الموردين، الموارد البشرية",
    icon: Factory,
    scope: "factory",
    primaryDevice: "desktop",
    canAddUsers: true,
  },
  {
    id: "branch-manager",
    label: "مدير الفرع",
    labelEn: "Branch Manager",
    description: "إدارة عمليات الفرع — المخزون، الطلبات، الحضور",
    icon: Warehouse,
    scope: "branch",
    primaryDevice: "tablet",
    canAddUsers: false,
  },
];

export const roleMap: Record<Role, RoleMeta> = roles.reduce(
  (acc, r) => { acc[r.id] = r; return acc; },
  {} as Record<Role, RoleMeta>
);

/**
 * Module access matrix.
 * IDs must match components/shell/navItems.ts
 */
export const moduleAccess: Record<Role, string[]> = {
  owner: [
    "dashboard", "inventory", "requests", "disputes",
    "suppliers", "hr", "finance", "brand",
    "users", "settings",
  ],
  "hr-manager": [
    "dashboard", "hr", "users", "settings",
  ],
  "warehouse-manager": [
    "dashboard", "inventory", "requests",
    "suppliers", "brand", "users", "settings",
  ],
  "factory-manager": [
    "dashboard", "inventory", "requests",
    "suppliers", "hr", "finance", "brand",
    "users", "settings",
  ],
  "branch-manager": [
    "dashboard", "inventory", "requests", "settings",
  ],
};

export function canAccess(role: Role, moduleId: string): boolean {
  return moduleAccess[role]?.includes(moduleId) ?? false;
}

export function moduleIdFromPath(path: string): string {
  const seg = path.split("/").filter(Boolean)[0];
  return seg ?? "dashboard";
}

export const DEFAULT_ROLE: Role = "owner";
