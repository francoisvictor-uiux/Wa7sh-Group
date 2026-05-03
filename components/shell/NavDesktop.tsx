"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { desktopNavItems, filterByRole } from "./navItems";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GroupLogo } from "@/components/brand/GroupLogo";
import { asset } from "@/lib/basePath";
import { BrandBadge } from "./BrandBadge";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { NotificationBell } from "./NotificationBell";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

/** Roles that span multiple brands — they see the El Wahsh Group identity
 *  in the sidebar + topbar instead of a single brand mark. */
const GROUP_SCOPES = new Set(["group", "factory"]);

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72;
const STORAGE_KEY = "wahsh.sidebar.collapsed";

/* SSR-safe initial read */
function getInitialCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

export function NavDesktop({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useRole();
  const { user } = useAuth();
  const visibleNav = filterByRole(desktopNavItems, role);
  const settings = visibleNav.filter((i) => i.id === "settings");
  const modules  = visibleNav.filter((i) => i.id !== "settings");
  const isGroupScope = !!user && GROUP_SCOPES.has(user.scope);

  // Collapse state — start false (server) then sync to localStorage on mount
  // so SSR/CSR markup matches and we don't get a hydration warning.
  const [collapsed, setCollapsed] = React.useState(false);
  React.useEffect(() => {
    setCollapsed(getInitialCollapsed());
  }, []);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <div className="flex min-h-screen">

      {/* ── Main content area ── */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-[margin] duration-normal ease-out-expo"
        style={{ marginRight: `${width}px` }}
      >

        {/* Top bar */}
        <header className={cn(
          "sticky top-0 z-20 flex items-center justify-between gap-6 px-8 h-16",
          "bg-bg-canvas/85 backdrop-blur-md border-b border-border-subtle"
        )}>
          <div className="flex items-center gap-4 min-w-0">
            <BrandBadge variant="full" />
            <div className="gold-hairline-vert h-6" />
            <CurrentRoute pathname={pathname} />
          </div>

          <div className={cn(
            "flex-1 max-w-md mx-auto h-9 px-3 rounded-md",
            "border border-border-subtle bg-bg-surface/40",
            "hover:border-border-strong hover:bg-bg-surface",
            "transition-colors duration-fast flex items-center gap-2 cursor-pointer"
          )}>
            <Search className="w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />
            <span className="text-xs text-text-tertiary flex-1">
              ابحث في كل النظام...
            </span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] text-text-tertiary font-mono">
              <span className="px-1 py-0.5 rounded bg-bg-canvas border border-border-subtle">⌘</span>
              <span className="px-1 py-0.5 rounded bg-bg-canvas border border-border-subtle">K</span>
            </kbd>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
            <UserMenu variant="full" />
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      {/* ── Sidebar — collapsible ── */}
      <aside
        className="fixed top-0 bottom-0 right-0 z-30 flex flex-col border-l border-white/10 transition-[width] duration-normal ease-out-expo"
        style={{ width: `${width}px`, backgroundColor: "#212121" }}
      >

        {/* Collapse toggle — floating on the inner (leading) edge */}
        <CollapseToggle collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

        {/* Brand / Group identity header */}
        <div
          className={cn(
            "h-16 flex items-center shrink-0 border-b border-white/15 transition-[padding] duration-normal ease-out-expo",
            collapsed ? "justify-center px-0" : "px-[20px]"
          )}
        >
          {isGroupScope ? (
            <GroupLogo size={36} withWordmark={!collapsed} variant="dark" />
          ) : (
            <BrandSidebarLogo brandId={user?.brandId ?? "wahsh"} collapsed={collapsed} />
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 flex flex-col gap-2">

          {/* Modules section */}
          <div className={cn("flex flex-col gap-0.5", collapsed ? "px-2" : "px-3")}>
            {!collapsed && (
              <p className="px-3 mb-1 text-[10px] tracking-[0.18em] uppercase text-white/50">
                الوحدات
              </p>
            )}
            {modules.map((item) => (
              <NavItem key={item.id} item={item} pathname={pathname} collapsed={collapsed} />
            ))}
          </div>

          {/* Section divider when collapsed (instead of label) */}
          {collapsed && settings.length > 0 && (
            <div className="mx-3 my-1 h-px bg-white/10" />
          )}

          {/* System section */}
          {settings.length > 0 && (
            <div className={cn("flex flex-col gap-0.5", collapsed ? "px-2" : "px-3", !collapsed && "mt-2")}>
              {!collapsed && (
                <p className="px-3 mb-1 text-[10px] tracking-[0.18em] uppercase text-white/50">
                  النظام
                </p>
              )}
              {settings.map((item) => (
                <NavItem key={item.id} item={item} pathname={pathname} collapsed={collapsed} />
              ))}
            </div>
          )}
        </nav>

        {/* Footer — متصل بالإنترنت (RTL: pulsing dot first, text after) */}
        <div
          className={cn(
            "shrink-0 flex items-center gap-2 transition-[padding] duration-normal ease-out-expo",
            collapsed ? "justify-center py-3.5" : "justify-start px-5 py-3.5"
          )}
          style={{ borderTop: "1px solid #3c3c3c" }}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 animate-pulse-dot"
            style={{ backgroundColor: "#8fff53", boxShadow: "0 0 8px #8fff53" }}
            aria-hidden
          />
          {!collapsed && (
            <span className="text-[11px] text-white/70">متصل بالإنترنت</span>
          )}
        </div>
      </aside>
    </div>
  );
}

/* ── Collapse toggle button ───────────────────────────────────────────────── */

function CollapseToggle({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  // Sits on the inner (leading in RTL = left physical) edge of the sidebar,
  // floating half-out so it reads as a hinge between sidebar and content.
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}
      title={collapsed ? "توسيع" : "طي"}
      className={cn(
        "absolute top-[34px] -left-3 z-40",
        "inline-flex items-center justify-center w-6 h-6 rounded-full",
        "bg-[#212121] border border-white/15",
        "text-white/70 hover:text-white hover:bg-[#2a2a2a]",
        "shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
        "transition-all duration-fast ease-out-expo",
        "active:scale-90"
      )}
    >
      {/* In RTL the visual leading edge is the right side; the chevron points
          INTO the content area when expanded (= will collapse), and INTO the
          sidebar when collapsed (= will expand). */}
      {collapsed
        ? <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        : <ChevronLeft  className="w-3.5 h-3.5" strokeWidth={2.5} />}
    </button>
  );
}

/* ── Nav Item ─────────────────────────────────────────────────────────────── */

function NavItem({
  item,
  pathname,
  collapsed,
}: {
  item: (typeof desktopNavItems)[number];
  pathname: string;
  collapsed: boolean;
}) {
  const Icon   = item.icon;
  const active = pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "relative flex items-center rounded-2xl",
        "transition-all duration-fast ease-out-expo focus-visible:outline-none",
        collapsed
          ? "justify-center w-14 h-14 mx-auto"
          : "gap-3 px-3 py-2.5",
        active
          ? "text-[#cdac4d]"
          : "text-white/75 hover:text-white hover:bg-white/6"
      )}
    >
      {/* Active marker — Figma: 2px gold bar on right edge in RTL */}
      {active && !collapsed && (
        <span
          aria-hidden
          className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
          style={{ backgroundColor: "#cdac4d" }}
        />
      )}

      {/* In collapsed mode active item gets a soft gold fill instead of a bar */}
      {active && collapsed && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl"
          style={{ backgroundColor: "rgba(205, 172, 77, 0.12)" }}
        />
      )}

      {/* Icon */}
      <div className="relative shrink-0">
        <Icon
          className={cn(collapsed ? "w-5 h-5" : "w-[18px] h-[18px]")}
          strokeWidth={active ? 2 : 1.75}
          style={active ? { color: "#cdac4d" } : {}}
        />
        {/* When collapsed: badge becomes a tiny corner dot */}
        {collapsed && item.badge && item.badge > 0 && (
          <span
            aria-hidden
            className="absolute -top-1 -left-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold inline-flex items-center justify-center leading-none tabular ring-2 ring-[#212121]"
            style={{ backgroundColor: "#cdac4d", color: "#2f2300" }}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* Label — only when expanded */}
      {!collapsed && (
        <>
          <span className={cn(
            "flex-1 text-[13px] tracking-tight relative",
            active ? "font-bold" : "font-medium"
          )}>
            {item.label}
          </span>
          {item.badge && item.badge > 0 && (
            <span
              className="min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold inline-flex items-center justify-center leading-none tabular relative"
              style={{ backgroundColor: "#cdac4d", color: "#2f2300" }}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

/* ── Brand sidebar logo — for brand/branch scope users ───────────────────── */

const BRAND_SIDEBAR_META = {
  wahsh:   { name: "الوحش برجر",    nameEn: "WAHSH BURGER",      accent: "#2563EB", letter: "و" },
  kababgy: { name: "كبابجي الوحش",  nameEn: "KABABGY ELWAHSH",   accent: "#C8A75A", letter: "ك" },
  forno:   { name: "فورنو بيتزا",   nameEn: "FORNO PIZZA",       accent: "#2A6B41", letter: "ف" },
} as const;

function BrandSidebarLogo({
  brandId,
  collapsed,
}: {
  brandId: "wahsh" | "kababgy" | "forno";
  collapsed: boolean;
}) {
  const meta = BRAND_SIDEBAR_META[brandId] ?? BRAND_SIDEBAR_META.wahsh;

  return (
    <div className={cn("inline-flex items-center gap-3", collapsed && "justify-center")}>
      <div
        className="shrink-0 w-9 h-9 rounded-full ring-1 ring-white/20 overflow-hidden bg-white/5"
      >
        <img
          src={asset(`/brands/${brandId}.webp`)}
          alt={meta.name}
          width={36}
          height={36}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-none min-w-0">
          <span className="font-bold text-sm text-white tracking-tight truncate">
            {meta.name}
          </span>
          <span className="text-[10px] text-white/60 tracking-tight mt-0.5 truncate">
            مجموعة الوحش
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Current route breadcrumb ─────────────────────────────────────────────── */

function CurrentRoute({ pathname }: { pathname: string }) {
  const match = desktopNavItems.find(
    (i) => i.href === pathname || pathname.startsWith(i.href + "/")
  );
  if (!match) return null;
  return (
    <div className="hidden lg:flex flex-col leading-none">
      <span className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase">
        {match.labelEn}
      </span>
      <span className="text-sm font-medium tracking-tight mt-1">
        {match.label}
      </span>
    </div>
  );
}
