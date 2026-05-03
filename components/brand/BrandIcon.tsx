"use client";

import { Sandwich, Beef, Pizza } from "lucide-react";
import type { BrandId } from "@/lib/mock/branches";
import { brandMeta } from "@/lib/mock/branches";
import { cn } from "@/lib/utils";

const iconMap: Record<BrandId, typeof Sandwich> = {
  wahsh:   Sandwich,
  kababgy: Beef,
  forno:   Pizza,
};

interface Props {
  brandId: BrandId;
  size?: "xs" | "sm" | "md" | "lg";
  withColor?: boolean;
  className?: string;
}

const sizeMap = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function BrandIcon({ brandId, size = "sm", withColor = true, className }: Props) {
  const Icon  = iconMap[brandId];
  const brand = brandMeta[brandId];

  return (
    <Icon
      className={cn(sizeMap[size], className)}
      strokeWidth={1.75}
      style={withColor ? { color: brand.accent } : undefined}
    />
  );
}
