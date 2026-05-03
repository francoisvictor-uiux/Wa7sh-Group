"use client";

import Link from "next/link";
import { Monitor, ArrowLeft, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useDevice, setDeviceOverride } from "@/hooks/useDevice";

/**
 * DesktopOnlyNotice — wrap finance routes. If the user is on mobile/tablet,
 * show a polite notice explaining this surface is desktop-primary,
 * with a button to force-preview on desktop layout.
 */
export function DesktopOnlyNotice({ moduleName }: { moduleName: string }) {
  const device = useDevice();
  if (device === "desktop") return null;

  return (
    <div className="px-4 py-8 max-w-md mx-auto min-h-[60vh] flex items-center">
      <Card padding="lg" className="w-full text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-brand-primary/12 text-brand-primary flex items-center justify-center mb-4">
          <Monitor className="w-7 h-7" strokeWidth={1.5} />
        </div>
        <p className="text-[10px] tracking-[0.18em] uppercase text-text-tertiary mb-1">
          Desktop only · سطح المكتب فقط
        </p>
        <h2 className="text-xl font-bold tracking-tight mb-2">
          {moduleName} — متاح على المكتب
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-5">
          هذه الوحدة مصمَّمة للعمل المركَّز — تقارير، تحليلات، وجداول كثيفة. الواجهة المثلى هي شاشة المكتب (≥1280px).
        </p>

        <div className="flex items-start gap-2.5 text-right p-3 rounded-md bg-bg-surface-raised/40 border border-border-subtle mb-5">
          <Lock className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5" strokeWidth={1.75} />
          <div className="text-[11px] text-text-secondary leading-relaxed">
            <p className="font-medium tracking-tight mb-1">لماذا فقط على المكتب؟</p>
            <p>
              الجداول المالية الكثيفة، المقارنات بين الفروع، وبناء التقارير المخصَّصة تحتاج مساحة. الكثافة المرئية المطلوبة تكسر الموبايل.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => {
              setDeviceOverride("desktop");
              window.location.reload();
            }}
            size="md"
            fullWidth
          >
            <Monitor className="w-4 h-4" strokeWidth={1.75} />
            تجاوز وعرض على المكتب
          </Button>
          <Link href="/dashboard">
            <Button variant="ghost" size="md" fullWidth>
              <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
              العودة للوحة التحكم
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
