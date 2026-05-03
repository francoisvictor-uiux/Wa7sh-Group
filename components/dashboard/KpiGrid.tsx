import {
  TrendingUp,
  Beef,
  Trash2,
  Clock,
  Truck,
  Inbox,
  PackageCheck,
  AlertTriangle,
  Factory,
  Boxes,
  ShieldCheck,
  Users,
  PackageMinus,
  type LucideIcon,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import type { Kpi } from "@/lib/mock/kpis";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Beef,
  Trash2,
  Clock,
  Truck,
  Inbox,
  PackageCheck,
  AlertTriangle,
  Factory,
  Boxes,
  ShieldCheck,
  Users,
  PackageMinus,
};

export function KpiGrid({
  kpis,
  cols = "auto",
  emphasizeFirst,
  className,
}: {
  kpis: Kpi[];
  cols?: "auto" | 1 | 2 | 3 | 4;
  emphasizeFirst?: boolean;
  className?: string;
}) {
  const colsClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : cols === 3
      ? "grid-cols-2 lg:grid-cols-3"
      : cols === 4
      ? "grid-cols-2 lg:grid-cols-4"
      : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={cn("grid gap-3 sm:gap-4", colsClass, className)}>
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon ? iconMap[kpi.icon] : null;
        return (
          <StatCard
            key={kpi.id}
            kpi={kpi}
            icon={Icon ? <Icon className="w-4 h-4" strokeWidth={1.75} /> : null}
            emphasize={emphasizeFirst && i === 0}
          />
        );
      })}
    </div>
  );
}
