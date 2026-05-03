"use client";

import { useAuth } from "@/hooks/useAuth";
import { FactoryDashboard } from "@/components/factory/dashboard/FactoryDashboard";
import { BranchDashboard } from "@/components/branch/dashboard/BranchDashboard";

export function Dashboard() {
  const { user } = useAuth();
  if (user?.scope === "branch") return <BranchDashboard />;
  return <FactoryDashboard />;
}
