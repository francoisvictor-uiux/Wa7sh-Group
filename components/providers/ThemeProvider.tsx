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

  return <>{children}</>;
}
