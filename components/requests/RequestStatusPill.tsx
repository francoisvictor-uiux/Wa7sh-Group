import {
  Clock,
  Check,
  ChefHat,
  Package,
  Truck,
  CheckCircle2,
  PauseCircle,
  AlertCircle,
  XCircle,
  Archive,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { statusMeta, type RequestStatus } from "@/lib/mock/requests";

const statusIcon: Record<RequestStatus, LucideIcon> = {
  requested: Clock,
  approved: Check,
  preparing: ChefHat,
  loaded: Package,
  "in-transit": Truck,
  delivered: CheckCircle2,
  confirmed: CheckCircle2,
  closed: Archive,
  "on-hold": PauseCircle,
  disputed: AlertCircle,
  rejected: XCircle,
  cancelled: XCircle,
};

export function RequestStatusPill({
  status,
  size = "sm",
  pulse = false,
}: {
  status: RequestStatus;
  size?: "sm" | "md";
  pulse?: boolean;
}) {
  const meta = statusMeta[status];
  const Icon = statusIcon[status];

  return (
    <Badge intent={meta.intent} size={size} pulse={pulse} dot={pulse}>
      <Icon className="w-3 h-3 shrink-0" strokeWidth={2.25} />
      {meta.label}
    </Badge>
  );
}
