import { requests } from "@/lib/mock/requests";
import { factoryRequests } from "@/lib/mock/factoryRequests";
import { RequestDetail } from "@/components/requests/RequestDetail";

export function generateStaticParams() {
  const ids = new Set<string>();
  requests.forEach((r) => ids.add(r.id));
  factoryRequests.forEach((r) => ids.add(r.id));
  return [...ids].map((id) => ({ id }));
}

export default function RequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <RequestDetail requestId={params.id} />;
}
