"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info" | "confirm";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number; // ms — default 4000, 0 = persistent
}

interface ToastContextValue {
  toasts: Toast[];
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  confirm: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};
    setToasts([]);
  }, []);

  const add = useCallback(
    (type: ToastType, title: string, description?: string, duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const toast: Toast = { id, type, title, description, duration };

      setToasts((prev) => {
        // Max 5 toasts at once — drop oldest
        const next = [...prev, toast];
        return next.length > 5 ? next.slice(next.length - 5) : next;
      });

      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  const success = useCallback(
    (title: string, desc?: string) => add("success", title, desc),
    [add]
  );
  const error = useCallback(
    (title: string, desc?: string) => add("error", title, desc, 6000),
    [add]
  );
  const warning = useCallback(
    (title: string, desc?: string) => add("warning", title, desc, 5000),
    [add]
  );
  const info = useCallback(
    (title: string, desc?: string) => add("info", title, desc),
    [add]
  );
  const confirm = useCallback(
    (title: string, desc?: string) => add("confirm", title, desc, 5000),
    [add]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, success, error, warning, info, confirm, dismiss, dismissAll }}
    >
      {children}
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastContext must be used inside <ToastProvider>");
  return ctx;
}
