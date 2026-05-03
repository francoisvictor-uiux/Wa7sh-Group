"use client";

import { useDevice } from "@/hooks/useDevice";
import { useTheme } from "@/hooks/useTheme";
import { useRole } from "@/hooks/useRole";
import { useBrand } from "@/components/brand/BrandLogo";
import { roles } from "@/lib/permissions";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Sun,
  Moon,
  Palette,
  ShieldCheck,
  Check,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";

const brandLabels = {
  wahsh: { name: "الوحش برجر", nameEn: "Wahsh Burger", accent: "#2563EB" },
  kababgy: { name: "كبابجي الوحش", nameEn: "Kababgy Elwahsh", accent: "#C8A75A" },
  forno: { name: "فورنو بيتزا", nameEn: "Forno Pizza", accent: "#2A6B41" },
} as const;

const deviceLabels = {
  mobile: { label: "جوّال", labelEn: "Mobile", icon: Smartphone },
  tablet: { label: "تابلت", labelEn: "Tablet", icon: Tablet },
  desktop: { label: "سطح المكتب", labelEn: "Desktop", icon: Monitor },
} as const;

export function FullSettings() {
  const device = useDevice();
  const { mode, setMode } = useTheme();
  const { role, setRole } = useRole();
  const { brand } = useBrand();

  const padding =
    device === "mobile" ? "px-4 py-5" : device === "tablet" ? "px-6 py-7" : "px-8 py-9";
  const brandMeta = brandLabels[brand];
  const deviceMeta = deviceLabels[device];
  const DeviceIcon = deviceMeta.icon;

  return (
    <div className={cn(padding, "max-w-[900px] mx-auto space-y-6")}>
      <header>
        <p className="text-xs text-text-tertiary tracking-[0.18em] uppercase mb-1">
          Settings
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">الإعدادات</h1>
        <p className="text-sm text-text-secondary mt-2">
          تفضيلات الحساب والمظهر، ومراجعة سياق الجلسة الحالية.
        </p>
      </header>

      {/* Session context — read-only */}
      <Card padding="lg">
        <CardHeader
          title="سياق الجلسة"
          subtitle="هذه القيم محدَّدة تلقائيًا — لا تُبدَّل من هنا."
          action={
            <Badge intent="brand" size="sm">
              <ShieldCheck className="w-3 h-3" strokeWidth={2} />
              مُؤمَّن
            </Badge>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Brand — auto-detected from the logged-in user */}
          <div className="flex items-start gap-3 p-3.5 rounded-md bg-bg-surface-raised/40 border border-border-subtle">
            <div
              className="shrink-0 w-9 h-9 rounded-md flex items-center justify-center"
              style={{ background: `${brandMeta.accent}20`, color: brandMeta.accent }}
            >
              <Palette className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-0.5">
                العلامة التجارية · من حسابك
              </p>
              <p className="text-sm font-medium tracking-tight truncate">
                {brandMeta.name}
              </p>
              <p className="text-[11px] text-text-tertiary tracking-tight truncate">
                {brandMeta.nameEn}
              </p>
            </div>
          </div>

          {/* Device — auto-detected */}
          <div className="flex items-start gap-3 p-3.5 rounded-md bg-bg-surface-raised/40 border border-border-subtle">
            <div className="shrink-0 w-9 h-9 rounded-md bg-bg-surface text-text-secondary flex items-center justify-center">
              <DeviceIcon className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-text-tertiary tracking-[0.16em] uppercase mb-0.5">
                الجهاز · مكتشف تلقائيًا
              </p>
              <p className="text-sm font-medium tracking-tight truncate">
                {deviceMeta.label}
              </p>
              <p className="text-[11px] text-text-tertiary tracking-tight truncate">
                {deviceMeta.labelEn} · يتغير مع نوع الجهاز
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Mode — actually adjustable */}
      <Card padding="lg">
        <CardHeader
          title="الوضع"
          subtitle="اختر بين الوضع الفاتح والداكن — تفضيلك يُحفظ على هذا الجهاز."
        />
        <div className="grid grid-cols-2 gap-3">
          <ModeOption
            icon={<Moon className="w-4 h-4" strokeWidth={1.75} />}
            name="داكن"
            nameEn="Dark"
            active={mode === "dark"}
            onClick={() => setMode("dark")}
          />
          <ModeOption
            icon={<Sun className="w-4 h-4" strokeWidth={1.75} />}
            name="فاتح"
            nameEn="Light"
            active={mode === "light"}
            onClick={() => setMode("light")}
          />
        </div>
      </Card>

      {/* Role switcher — demo */}
      <Card padding="lg">
        <CardHeader
          title="الدور (للعرض)"
          subtitle="بدِّل الدور لرؤية النظام من زاوية كل وظيفة — التنقل والوصول يتغيران تلقائيًا."
          action={
            <Badge intent="brand" size="sm">
              <ShieldCheck className="w-3 h-3" strokeWidth={2} />
              RBAC نشط
            </Badge>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setRole(r.id);
                  window.setTimeout(() => window.location.reload(), 80);
                }}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-md text-right transition-all duration-fast",
                  "border focus-visible:outline-none",
                  isActive
                    ? "border-brand-primary bg-brand-primary/8"
                    : "border-border-subtle bg-bg-surface-raised/40 hover:border-border-strong hover:bg-bg-surface-raised/70"
                )}
              >
                <div
                  className={cn(
                    "shrink-0 w-9 h-9 rounded-md flex items-center justify-center",
                    isActive
                      ? "bg-brand-primary text-text-on-brand"
                      : "bg-bg-surface text-text-secondary"
                  )}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p
                      className={cn(
                        "text-sm font-medium tracking-tight truncate",
                        isActive && "text-brand-primary"
                      )}
                    >
                      {r.label}
                    </p>
                    {isActive && (
                      <Check
                        className="w-3.5 h-3.5 text-brand-primary shrink-0"
                        strokeWidth={2.5}
                      />
                    )}
                  </div>
                  <p className="text-[10px] text-text-tertiary tracking-[0.14em] uppercase mb-1.5 truncate">
                    {r.labelEn}
                  </p>
                  <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                    {r.description}
                  </p>
                  <p className="text-[10px] text-text-tertiary mt-1.5 truncate">
                    مثال: {r.examplePerson}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

    </div>
  );
}

/* ----------------------------------------------------------- */

function ModeOption({
  icon,
  name,
  nameEn,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  name: string;
  nameEn: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-md transition-all duration-fast",
        "border text-right",
        active
          ? "border-brand-primary bg-brand-primary/8"
          : "border-border-subtle bg-bg-surface-raised/40 hover:border-border-strong"
      )}
    >
      <span
        className={cn(
          "w-9 h-9 rounded-md flex items-center justify-center shrink-0",
          active ? "bg-brand-primary/15 text-brand-primary" : "bg-bg-surface text-text-tertiary"
        )}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium tracking-tight truncate">{name}</p>
        <p className="text-[10px] text-text-tertiary truncate">{nameEn}</p>
      </div>
      {active && (
        <span className="text-[10px] tracking-[0.16em] uppercase text-brand-primary font-medium shrink-0">
          نشط
        </span>
      )}
    </button>
  );
}
