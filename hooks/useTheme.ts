"use client";

/**
 * useTheme — controls which of the 4 surfaces is active:
 *   wahsh-dark · wahsh-light · forno-dark · forno-light
 *
 * Writes to <html data-theme={theme} data-mode={mode}> which the CSS tokens
 * key off of (see globals.css). Persists choice to localStorage.
 *
 * Theme is decided by which brand the user is operating under.
 * Mode (dark/light) is independent — staff at branches usually pick once
 * and leave it; the toggle is mostly for desktop office staff who flip
 * during the day.
 */

import { useEffect, useState, useCallback } from "react";

export type Theme = "wahsh" | "forno";
export type Mode = "dark" | "light";

const THEME_KEY = "wahsh.theme";
const MODE_KEY = "wahsh.mode";

const DEFAULT_THEME: Theme = "wahsh";
const DEFAULT_MODE: Mode = "light";

function applyToDocument(theme: Theme, mode: Mode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.mode = mode;
}

function readStored<T extends string>(key: string, allowed: T[], fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(key);
  return (allowed as string[]).includes(stored ?? "")
    ? (stored as T)
    : fallback;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [mode, setModeState] = useState<Mode>(DEFAULT_MODE);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const t = readStored<Theme>(THEME_KEY, ["wahsh", "forno"], DEFAULT_THEME);
    const m = readStored<Mode>(MODE_KEY, ["dark", "light"], DEFAULT_MODE);
    setThemeState(t);
    setModeState(m);
    applyToDocument(t, m);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_KEY, next);
    }
    applyToDocument(next, mode);
  }, [mode]);

  const setMode = useCallback((next: Mode) => {
    setModeState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MODE_KEY, next);
    }
    applyToDocument(theme, next);
  }, [theme]);

  const toggleMode = useCallback(() => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
  }, [mode, setMode]);

  return { theme, mode, setTheme, setMode, toggleMode };
}
