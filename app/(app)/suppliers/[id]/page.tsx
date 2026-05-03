import { suppliers } from "@/lib/mock/suppliers";
import { suppliers as factorySuppliers } from "@/lib/mock/factorySuppliers";
import { SupplierDetail } from "@/components/suppliers/SupplierDetail";

export function generateStaticParams() {
  const ids = new Set<string>();
  suppliers.forEach((s) => ids.add(s.id));
  factorySuppliers.forEach((s) => ids.add(s.id));
  return [...ids].map((id) => ({ id }));
}

export default function SupplierDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <SupplierDetail supplierId={params.id} />;
}
