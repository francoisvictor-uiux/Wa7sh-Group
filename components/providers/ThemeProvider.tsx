"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

/**
 * ThemeProvider — empty wrapper whose only job is to mount the useTheme hook
 * so that the document data-attributes get synced with localStorage on
 * first paint. The actual theme state lives in `useTheme` and any consumer
 * can read it directly.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, mode } = useTheme();

  // Sync once on hydrate to avoid SSR/CSR mismatch flashes
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.mode = mode;
  }, [theme, mode]);

  // Apply saved font scale on app load so the user's preference persists
  // across refreshes for every route, not just the Settings page.
  useEffect(() => {
    try {
      const saved = parseFloat(localStorage.getItem("wahsh.fontScale") || "1");
      if (!isNaN(saved) && saved >= 0.8 && saved <= 1.4) {
        (document.documentElement.style as any).zoom = String(saved);
        document.documentElement.style.fontSize = `${saved * 16}px`;
      }
    } catch {}
  }, []);

  return <>{children}</>;
}
