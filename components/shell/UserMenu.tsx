"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, User, Building2, ShieldCheck, Factory } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { roleMap } from "@/lib/permissions";
import { brandMeta, branchMap } from "@/lib/mock/branches";
import { cn } from "@/lib/utils";

export function UserMenu({
  variant = "full",
  className,
}: {
  variant?: "full" | "compact";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  const roleMeta = user ? roleMap[user.role] : null;
  const brand = user?.brandId ? brandMeta[user.brandId] : null;
  const branch = user?.branchId ? branchMap[user.branchId] : null;
  const initial = user?.name.split(" ")[0].charAt(0) ?? "؟";

  // Scope label shown under the name
  const scopeLabel = (() => {
    if (!user) return "";
    if (branch) return branch.name;
    if (brand) return brand.name;
    if (user.scope === "factory") return "المصنع الرئيسي";
    return "مجموعة الوحش";
  })();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-2.5 rounded-md",
          "border border-border-subtle bg-bg-surface shadow-sm",
          "hover:border-border-strong hover:shadow",
          "transition-all duration-fast ease-out-expo",
          variant === "full" ? "h-10 pr-2.5 pl-2" : "h-9 pr-2 pl-1.5"
        )}
      >
        <div
          className={cn(
            "rounded-full bg-brand-primary/15 text-brand-primary",
            "flex items-center justify-center font-medium shrink-0",
            "w-7 h-7 text-xs"
          )}
        >
          {initial}
        </div>
        {variant === "full" && (
          <>
            <div className="flex flex-col items-start min-w-0 max-w-[140px]">
              <span className="text-xs font-medium tracking-tight truncate w-full text-right">
                {user?.name ?? "غير مسجل"}
              </span>
              <span className="text-[10px] text-text-tertiary truncate w-full text-right">
                {scopeLabel}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-text-tertiary transition-transform duration-fast",
                open && "rotate-180"
              )}
              strokeWidth={2}
            />
          </>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 left-0 mt-2 w-72",
            "rounded-lg bg-bg-surface border border-border shadow-lg",
            "overflow-hidden"
          )}
        >
          {/* Identity block */}
          <div className="p-4 border-b border-border-subtle bg-bg-surface-raised/40">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center font-medium text-base shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium tracking-tight truncate">
                  {user?.name ?? "—"}
                </p>
                <p className="text-xs text-text-tertiary truncate">
                  {user?.email ?? "—"}
                </p>
              </div>
            </div>

            {/* Role badge */}
            {roleMeta && (
              <div className="flex items-center gap-2 mt-3 px-2.5 py-1.5 rounded-md bg-brand-primary/8 border border-brand-primary/30">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" strokeWidth={1.75} />
                <span className="text-[11px] font-medium text-brand-primary tracking-tight">
                  {roleMeta.label}
                </span>
                <span className="text-[10px] text-text-tertiary mr-auto">
                  {roleMeta.labelEn}
                </span>
              </div>
            )}

            {/* Brand badge */}
            {brand && (
              <div className="flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-md bg-bg-canvas/40 border border-border-subtle">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: brand.accent }}
                />
                <span className="text-[11px] text-text-secondary tracking-tight">
                  {brand.name}
                </span>
              </div>
            )}

            {/* Branch badge */}
            {branch && (
              <div className="flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-md bg-bg-canvas/40 border border-border-subtle">
                <Building2 className="w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />
                <span className="text-[11px] text-text-secondary tracking-tight">
                  {branch.name}
                </span>
                <span className="text-[10px] text-text-tertiary mr-auto">
                  {branch.city}
                </span>
              </div>
            )}

            {/* Factory badge */}
            {user?.scope === "factory" && !branch && (
              <div className="flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-md bg-bg-canvas/40 border border-border-subtle">
                <Factory className="w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />
                <span className="text-[11px] text-text-secondary tracking-tight">
                  المصنع الرئيسي
                </span>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="py-1.5">
            <MenuLink href="/settings" icon={<User className="w-4 h-4" strokeWidth={1.75} />}>
              الملف الشخصي
            </MenuLink>
          </div>

          <div className="border-t border-border-subtle py-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-sm text-right",
                "text-status-danger hover:bg-status-danger/8",
                "transition-colors duration-fast"
              )}
            >
              <LogOut className="w-4 h-4" strokeWidth={1.75} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 text-sm",
        "text-text-secondary hover:text-text-primary hover:bg-bg-surface-raised",
        "transition-colors duration-fast"
      )}
    >
      <span className="text-text-tertiary">{icon}</span>
      {children}
    </Link>
  );
}
