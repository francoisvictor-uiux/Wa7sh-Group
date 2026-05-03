"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/lib/auth/types";

// ─── Mock users ──────────────────────────────────────────────────────────────
// Single-user demo. The owner has full module access; per-role users will be
// reintroduced after each user's screens are designed.

export const MOCK_USERS: AuthUser[] = [
  {
    id: "u-factory-manager",
    name: "بيشوي مجدي",
    email: "factory@wahshgroup.eg",
    role: "factory-manager",
    scope: "factory",
    pin: "5231",
    password: "Wahsh@2026",
  },
  {
    id: "u-branch-wahsh-asafra",
    name: "منى محمود",
    email: "branch@wahshgroup.eg",
    role: "branch-manager",
    scope: "branch",
    brandId: "wahsh",
    branchId: "br-wahsh-asafra",
    pin: "4892",
    password: "Branch@2026",
  },
];

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userId: string, pin: string) => boolean;
  loginByEmail: (email: string, password: string) => boolean;
  logout: () => void;
  updateCredentials: (next: { password?: string; pin?: string }) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "wahsh.session";
const BRAND_KEY   = "wahsh.brand";
const THEME_KEY   = "wahsh.theme";

/**
 * Resolve the brand + theme palette from the user's account.
 * Wahsh & Kababgy share the "wahsh" theme tokens.
 * Forno is its own theme.
 * Group / factory scope users (owner, HR, warehouse, dispatcher…) default
 * to "wahsh" — the parent group identity.
 */
function resolveBrandTheme(user: AuthUser | null): { brand: "wahsh" | "kababgy" | "forno"; theme: "wahsh" | "forno" } {
  const brand =
    user?.brandId === "kababgy" ? "kababgy" :
    user?.brandId === "forno"   ? "forno"   : "wahsh";
  const theme = brand === "forno" ? "forno" : "wahsh";
  return { brand, theme };
}

function applyBrandTheme(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  const { brand, theme } = resolveBrandTheme(user);
  window.localStorage.setItem(BRAND_KEY, brand);
  window.localStorage.setItem(THEME_KEY, theme);
  // Apply to <html> immediately so the active layout reflects the new
  // palette without waiting for useTheme to remount.
  document.documentElement.dataset.theme = theme;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        // Verify the stored user still exists in MOCK_USERS
        if (MOCK_USERS.find((u) => u.id === parsed.id)) {
          setUser(parsed);
          applyBrandTheme(parsed);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
      applyBrandTheme(u);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  };

  /** Read user-specific credential overrides written by Settings */
  function applyOverrides(u: AuthUser): AuthUser {
    try {
      const raw = localStorage.getItem("wahsh.credentials");
      if (!raw) return u;
      const overrides = JSON.parse(raw) as Record<string, { password?: string; pin?: string }>;
      const override = overrides[u.id];
      if (!override) return u;
      return { ...u, ...override };
    } catch { return u; }
  }

  /** PIN-based login (tablet / mobile) */
  const login = useCallback((userId: string, pin: string): boolean => {
    const candidate = MOCK_USERS.find((u) => u.id === userId);
    if (!candidate) return false;
    const effective = applyOverrides(candidate);
    if (effective.pin !== pin) return false;
    persist(effective);
    return true;
  }, []);

  /** Email+password login (desktop) */
  const loginByEmail = useCallback((email: string, password: string): boolean => {
    const candidate = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!candidate) return false;
    const effective = applyOverrides(candidate);
    if (effective.password !== password) return false;
    persist(effective);
    return true;
  }, []);

  const logout = useCallback(() => persist(null), []);

  const updateCredentials = useCallback((next: { password?: string; pin?: string }) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: AuthUser = {
        ...prev,
        ...(next.password !== undefined ? { password: next.password } : {}),
        ...(next.pin !== undefined ? { pin: next.pin } : {}),
      };
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
        // Also persist a per-user credential override so login works after refresh
        const overrides = JSON.parse(localStorage.getItem("wahsh.credentials") || "{}");
        overrides[updated.id] = {
          password: updated.password,
          pin: updated.pin,
        };
        localStorage.setItem("wahsh.credentials", JSON.stringify(overrides));
      } catch {}
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, loginByEmail, logout, updateCredentials }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
