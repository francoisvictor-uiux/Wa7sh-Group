import { BrandDetail } from "@/components/factory/dashboard/BrandDetail";
import type { BrandId } from "@/lib/mock/branches";

export function generateStaticParams() {
  return (["wahsh", "kababgy", "forno"] as BrandId[]).map((brandId) => ({ brandId }));
}

export default function BrandDetailPage({
  params,
}: {
  params: { brandId: BrandId };
}) {
  return <BrandDetail brandId={params.brandId} />;
}
