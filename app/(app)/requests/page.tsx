"use client";

import { useAuth } from "@/hooks/useAuth";
import { FactoryRequests } from "@/components/factory/requests/FactoryRequests";
import { BranchRequests } from "@/components/branch/requests/BranchRequests";

export default function RequestsPage() {
  const { user } = useAuth();
  if (user?.scope === "branch") return <BranchRequests />;
  return <FactoryRequests />;
}
