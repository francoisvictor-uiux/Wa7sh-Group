import { suppliers } from "@/lib/mock/suppliers";
import { suppliers as factorySuppliers } from "@/lib/mock/factorySuppliers";
import { SupplierForm } from "@/components/suppliers/SupplierForm";

export function generateStaticParams() {
  const ids = new Set<string>();
  suppliers.forEach((s) => ids.add(s.id));
  factorySuppliers.forEach((s) => ids.add(s.id));
  return [...ids].map((id) => ({ id }));
}

export default function EditSupplierPage({
  params,
}: {
  params: { id: string };
}) {
  return <SupplierForm supplierId={params.id} />;
}
