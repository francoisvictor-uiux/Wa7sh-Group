"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { RequestDetail } from "@/components/requests/RequestDetail";

/**
 * Single static detail page that reads the request id from the query
 * string. Used in place of the dynamic /requests/[id] route so the page
 * works for runtime-created requests under static export (GitHub Pages).
 */
function DetailInner() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  return <RequestDetail requestId={id} />;
}

export default function RequestDetailPage() {
  return (
    <Suspense fallback={null}>
      <DetailInner />
    </Suspense>
  );
}
