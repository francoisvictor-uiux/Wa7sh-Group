import { factoryStock } from "@/lib/mock/factoryInventory";
import { ItemDetail } from "@/components/inventory/ItemDetail";

export function generateStaticParams() {
  return factoryStock.map((i) => ({ id: i.id }));
}

export default function ItemDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ItemDetail itemId={params.id} />;
}
