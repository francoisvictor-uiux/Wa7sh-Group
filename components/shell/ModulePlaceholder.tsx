"use client";

import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useDevice } from "@/hooks/useDevice";
import { cn } from "@/lib/utils";

interface ModulePlaceholderProps {
  icon: LucideIcon;
  title: string;
  titleEn: string;
  description: string;
  features: string[];
  sprintNumber: number;
}

/**
 * ModulePlaceholder — used for the 7 modules not yet built. Shows
 * the planned scope and roadmap position so the navigation still
 * feels real and reviewable end-to-end.
 */
export function ModulePlaceholder({
  icon: Icon,
  title,
  titleEn,
  description,
  features,
  sprintNumber,
}: ModulePlaceholderProps) {
  const device = useDevice();
  const padding =
    device === "mobile" ? "px-4 py-6" : device === "tablet" ? "px-6 py-8" : "px-8 py-10";
  const maxWidth = device === "desktop" ? "max-w-[960px]" : "";

  return (
    <div className={cn(padding, maxWidth, "mx-auto")}>
      <div className="mb-6">
        <p className="text-xs text-text-tertiary tracking-[0.18em] uppercase mb-2">
          {titleEn}
        </p>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-md bg-brand-primary/12 text-brand-primary flex items-center justify-center">
            <Icon className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {title}
          </h1>
        </div>
        <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      <Card padding="lg" className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] text-text-tertiary tracking-[0.18em] uppercase mb-1">
              قيد البناء
            </p>
            <h2 className="text-lg font-medium tracking-tight">
              هذه الوحدة قادمة في{" "}
              <span className="text-brand-primary">السبرنت {sprintNumber}</span>
            </h2>
          </div>
          <Badge intent="warning" size="md">
            مخططة
          </Badge>
        </div>

        <div className="gold-hairline mb-5" />

        <p className="text-xs text-text-tertiary tracking-[0.18em] uppercase mb-3">
          الشاشات المخططة
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {features.map((feature, i) => (
            <li
              key={i}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-md",
                "bg-bg-surface-raised/40 border border-border-subtle"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
              <span className="text-sm text-text-secondary tracking-tight">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-text-tertiary">
          الوحدة المبنيّة الوحيدة حاليًا هي لوحة التحكم — مثال على النمط الكامل لكل الوحدات القادمة.
        </p>
        <Link href="/dashboard">
          <Button variant="secondary" size="md">
            <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
            العودة للوحة التحكم
          </Button>
        </Link>
      </div>
    </div>
  );
}
