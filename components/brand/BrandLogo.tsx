"use client";

import { useTheme } from "@/hooks/useTheme";
import { WahshLogo } from "./WahshLogo";
import { KababgyLogo } from "./KababgyLogo";
import { FornoLogo } from "./FornoLogo";

/**
 * BrandLogo — picks the right logo based on the active brand.
 * Used everywhere we'd previously hardcoded WahshLogo.
 *
 * Wahsh and Kababgy share the same theme tokens but ship different
 * marks. Forno has its own theme + mark.
 *
 * The active brand id is stored under `wahsh.brand` (set at entry).
 * The theme tokens follow from there (wahsh palette vs forno palette).
 */

import { useEffect, useState } from "react";

export type BrandId = "wahsh" | "kababgy" | "forno";

export function getStoredBrand(): BrandId {
  if (typeof window === "undefined") return "wahsh";
  const v = window.localStorage.getItem("wahsh.brand");
  if (v === "wahsh" || v === "kababgy" || v === "forno") return v;
  return "wahsh";
}

export function setStoredBrand(b: BrandId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("wahsh.brand", b);
}

export function BrandLogo({
  size = 48,
  withWordmark = false,
  className,
}: {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}) {
  const [brand, setBrand] = useState<BrandId>("wahsh");

  useEffect(() => {
    setBrand(getStoredBrand());
  }, []);

  if (brand === "kababgy") {
    return <KababgyLogo size={size} withWordmark={withWordmark} className={className} />;
  }
  if (brand === "forno") {
    return <FornoLogo size={size} withWordmark={withWordmark} className={className} />;
  }
  return <WahshLogo size={size} withWordmark={withWordmark} className={className} />;
}

/** Hook variant — gives caller the brand id directly. */
export function useBrand(): { brand: BrandId; setBrand: (b: BrandId) => void } {
  const [brand, setLocalBrand] = useState<BrandId>("wahsh");

  useEffect(() => {
    setLocalBrand(getStoredBrand());
  }, []);

  const setBrand = (b: BrandId) => {
    setLocalBrand(b);
    setStoredBrand(b);
  };

  return { brand, setBrand };
}
