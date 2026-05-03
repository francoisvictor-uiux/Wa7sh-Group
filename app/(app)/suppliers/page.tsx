"use client";

import { Suppliers } from "@/components/suppliers/Suppliers";

/**
 * Suppliers — single canonical screen for the new Decision & Control System.
 * (Previously this route forked to FactorySuppliers for factory roles. The
 * new module is the default for everyone with the "suppliers" permission.)
 */
export default function SuppliersPage() {
  return <Suppliers />;
}
