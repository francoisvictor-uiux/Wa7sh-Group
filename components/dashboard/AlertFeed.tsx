import Link from "next/link";
import { ChevronLeft, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { alertsFeed } from "@/lib/mock/alerts";
import { cn } from "@/lib/utils";

const priorityIntent = {
  p0: "danger",
  p1: "warning",
  p2: "info",
  p3: "neutral",
} as const;

const priorityLabel = {
  p0: "حرج",
  p1: "مهم",
  p2: "عادي",
  p3: "معلوماتي",
} as const;

const priorityIcon = {
  p0: AlertCircle,
  p1: AlertTriangle,
  p2: Info,
  p3: Info,
} as const;

export function AlertFeed({
  limit = 5,
  density = "comfortable",
  className,
}: {
  limit?: number;
  density?: "compact" | "comfortable";
  className?: string;
}) {
  const items = alertsFeed.slice(0, limit);

  return (
    <Card padding="none" className={cn("overflow-hidden", className)}>
      <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-4 border-b border-border-subtle">
        <div>
          <h3 className="text-base font-medium tracking-tight">
            التنبيهات الذكية
          </h3>
          <p className="text-xs text-text-tertiary mt-0.5">
            كل ما يحتاج انتباهك الآن
          </p>
        </div>
        <Link
          href="#"
          className="text-xs text-brand-primary hover:text-brand-primary-hover transition-colors flex items-center gap-1 shrink-0"
        >
          الكل
          <ChevronLeft className="w-3 h-3" strokeWidth={2} />
        </Link>
      </div>

      <ul>
        {items.map((alert) => {
          const Icon = priorityIcon[alert.priority];
          return (
            <li
              key={alert.id}
              className={cn(
                "border-b border-border-subtle last:border-0",
                "hover:bg-bg-surface-raised/40 transition-colors duration-fast"
              )}
            >
              <Link
                href={alert.ctaHref ?? "#"}
                className={cn(
                  "block px-5",
                  density === "compact" ? "py-3" : "py-4"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center",
                      alert.priority === "p0" &&
                        "bg-status-danger/15 text-status-danger",
                      alert.priority === "p1" &&
                        "bg-status-warning/15 text-status-warning",
                      alert.priority === "p2" &&
                        "bg-status-info/15 text-status-info",
                      alert.priority === "p3" &&
                        "bg-bg-surface-raised text-text-tertiary"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-medium tracking-tight truncate">
                        {alert.title}
                      </p>
                      <span className="text-[11px] text-text-tertiary shrink-0">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {alert.body}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge intent={priorityIntent[alert.priority]} size="sm">
                        {priorityLabel[alert.priority]}
                      </Badge>
                      <span className="text-[11px] text-text-tertiary">
                        · {alert.source}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
