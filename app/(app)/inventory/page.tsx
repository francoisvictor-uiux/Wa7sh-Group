"use client";

import { Inventory } from "@/components/inventory/Inventory";

/**
 * Inventory — single canonical screen.
 * (Previously this route forked to FactoryInventory for factory roles. The
 * new module replaces both — same UX as the new Suppliers list, with view
 * toggle, smart search, advanced filters, KPI tiles, and per-item stock
 * fill cards.)
 */
export default function InventoryPage() {
  return <Inventory />;
}
