"use client";

/**
 * useDevice — single source of truth for which device class is rendering.
 *
 * Returns one of: 'mobile' | 'tablet' | 'desktop'
 *
 * Detection order:
 *   1. Manual override via ?device=mobile|tablet|desktop in URL (build/preview)
 *   2. localStorage override (sticky preview across navigation)
 *   3. Viewport width breakpoints
 *
 * Breakpoints (matching Tailwind defaults + tablet band):
 *   mobile:  < 768px
 *   tablet:  768px – 1279px
 *   desktop: ≥ 1280px
 */

import { useEffect, useState } from "react";

export type Device = "mobile" | "tablet" | "desktop";

const STORAGE_KEY = "wahsh.deviceOverride";

function detectFromViewport(): Device {
  if (typeof window === "undefined") return "tablet"; // SSR safe default
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1280) return "tablet";
  return "desktop";
}

function readOverride(): Device | null {
  if (typeof window === "undefined") return null;

  // 1. URL param wins (used by /preview links during design phase)
  const params = new URLSearchParams(window.location.search);
  const param = params.get("device");
  if (param === "mobile" || param === "tablet" || param === "desktop") {
    window.localStorage.setItem(STORAGE_KEY, param);
    return param;
  }

  // 2. Sticky localStorage override
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "mobile" || stored === "tablet" || stored === "desktop") {
    return stored;
  }

  return null;
}

export function useDevice(): Device {
  // Start with SSR-safe default, hydrate to real value on client
  const [device, setDevice] = useState<Device>("tablet");

  useEffect(() => {
    const update = () => {
      const override = readOverride();
      setDevice(override ?? detectFromViewport());
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return device;
}

/** Clear the manual override and return to viewport-based detection. */
export function clearDeviceOverride() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

/** Force a specific device (used by the device-switcher in dev). */
export function setDeviceOverride(d: Device) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, d);
  }
}
