import {
  Truck,
  CheckCircle2,
  ClipboardList,
  Inbox,
  ArrowLeftRight,
  ClipboardCheck,
  UserCheck,
  AlertOctagon,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { recentActivity, type ActivityType } from "@/lib/mock/activity";
import { cn } from "@/lib/utils";

const typeIcon: Record<ActivityType, LucideIcon> = {
  "shipment.dispatched": Truck,
  "shipment.delivered": CheckCircle2,
  "request.created": ClipboardList,
  "request.approved": ClipboardCheck,
  "receipt.confirmed": Inbox,
  "receipt.disputed": AlertOctagon,
  "stock.transferred": ArrowLeftRight,
  "stock.counted": ClipboardCheck,
  "employee.clocked-in": UserCheck,
};

const typeIntent: Record<ActivityType, string> = {
  "shipment.dispatched": "text-status-info bg-status-info/12",
  "shipment.delivered": "text-status-success bg-status-success/12",
  "request.created": "text-text-secondary bg-bg-surface-raised",
  "request.approved": "text-status-success bg-status-success/12",
  "receipt.confirmed": "text-status-success bg-status-success/12",
  "receipt.disputed": "text-status-danger bg-status-danger/12",
  "stock.transferred": "text-text-secondary bg-bg-surface-raised",
  "stock.counted": "text-brand-primary bg-brand-primary/12",
  "employee.clocked-in": "text-text-secondary bg-bg-surface-raised",
};

export function ActivityFeed({
  limit = 6,
  className,
}: {
  limit?: number;
  className?: string;
}) {
  const items = recentActivity.slice(0, limit);

  return (
    <Card padding="none" className={cn("overflow-hidden", className)}>
      <div className="px-5 pt-5 pb-3 border-b border-border-subtle">
        <h3 className="text-base font-medium tracking-tight">النشاط الأخير</h3>
        <p className="text-xs text-text-tertiary mt-0.5">
          آخر العمليات في النظام
        </p>
      </div>

      <ul className="py-1">
        {items.map((item) => {
          const Icon = typeIcon[item.type];
          return (
            <li
              key={item.id}
              className="flex items-start gap-3 px-5 py-3 hover:bg-bg-surface-raised/40 transition-colors duration-fast"
            >
              <div
                className={cn(
                  "shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5",
                  typeIntent[item.type]
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed">
                  <span className="font-medium tracking-tight">
                    {item.actor}
                  </span>{" "}
                  <span className="text-text-secondary">
                    {item.description}
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {item.branch && (
                    <span className="text-[11px] text-text-tertiary">
                      {item.branch}
                    </span>
                  )}
                  <span className="text-[11px] text-text-tertiary">
                    · {item.timestamp}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
