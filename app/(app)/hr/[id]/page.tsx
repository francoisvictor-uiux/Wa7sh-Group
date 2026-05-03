import { employees } from "@/lib/mock/hr";
import { EmployeeDetail } from "@/components/hr/EmployeeDetail";

export function generateStaticParams() {
  return employees.map((e) => ({ id: e.id }));
}

export default function EmployeeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <EmployeeDetail employeeId={params.id} />;
}
