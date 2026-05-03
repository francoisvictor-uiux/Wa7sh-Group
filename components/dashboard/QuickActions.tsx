import Link from "next/link";
import {
  ClipboardList,
  Package,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface QuickAction {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  accent?: "brand" | "warning" | "info";
}

const actions: QuickAction[] = [
  {
    href: "/requests",
    label: "طلب جديد للمصنع",
    description: "اطلب أصناف من المصنع",
    icon: ClipboardList,
    accent: "brand",
  },
  {
    href: "/inventory",
    label: "جرد دوري",
    description: "ابدأ جلسة جرد",
    icon: Package,
  },
];

export function QuickActions({
  layout = "grid",
  className,
}: {
  layout?: "grid" | "row";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        layout === "grid"
          ? "grid-cols-2"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.href} href={action.href} className="group">
            <Card
              padding="md"
              className={cn(
                "h-full transition-all duration-fast ease-out-expo cursor-pointer",
                "group-hover:border-border-strong group-hover:shadow-md",
                "group-hover:-translate-y-0.5"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-md flex items-center justify-center mb-3",
                  action.accent === "brand"
                    ? "bg-brand-primary/15 text-brand-primary"
                    : action.accent === "warning"
                    ? "bg-status-warning/15 text-status-warning"
                    : action.accent === "info"
                    ? "bg-status-info/15 text-status-info"
                    : "bg-bg-surface-raised text-text-secondary"
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <p className="text-sm font-medium tracking-tight mb-0.5">
                {action.label}
              </p>
              <p className="text-[11px] text-text-tertiary leading-relaxed">
                {action.description}
              </p>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
