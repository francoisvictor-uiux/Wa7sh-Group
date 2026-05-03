"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { AvatarTile } from "@/components/auth/AvatarTile";
import { PinDots } from "@/components/auth/PinDots";
import { PinKeypad } from "@/components/auth/PinKeypad";
import { useAuth } from "@/hooks/useAuth";
import { getPostLoginRoute } from "@/lib/auth/redirect";
import { useToast } from "@/hooks/useToast";
import { MOCK_USERS } from "@/context/AuthContext";
import { roleMap } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const PIN_LENGTH = 4;

export default function PinLoginPage() {
  const router  = useRouter();
  const { login } = useAuth();
  const toast   = useToast();

  const [selected, setSelected] = useState<string | null>(null);
  const [pin,      setPin]      = useState("");
  const [error,    setError]    = useState(false);
  const [attempts, setAttempts] = useState(0);

  const selectedUser = MOCK_USERS.find((u) => u.id === selected) ?? null;
  const locked = attempts >= 3;

  // ── Auto-submit when 4 digits entered ─────────────────────────────────────
  useEffect(() => {
    if (pin.length !== PIN_LENGTH || !selected) return;
    const t = window.setTimeout(() => {
      const success = login(selected, pin);
      if (success) {
        const user = MOCK_USERS.find((u) => u.id === selected);
        toast.success(`أهلاً ${user?.name.split(" ")[0] ?? ""}`, "جارٍ تحميل النظام...");
        const route = user ? getPostLoginRoute(user.role) : "/dashboard";
        window.setTimeout(() => router.push(route), 500);
      } else {
        const next = attempts + 1;
        setAttempts(next);
        setError(true);
        if (next >= 3) {
          toast.error("تم تجاوز عدد المحاولات", "تواصل مع مدير النظام");
        } else {
          toast.warning("PIN غير صحيح", `${3 - next} محاولات متبقية`);
        }
        window.setTimeout(() => { setPin(""); setError(false); }, 600);
      }
    }, 180);
    return () => window.clearTimeout(t);
  }, [pin]);

  const handleDigit    = (d: string) => { if (!locked && pin.length < PIN_LENGTH) { setError(false); setPin((p) => p + d); } };
  const handleBackspace = ()         => { setError(false); setPin((p) => p.slice(0, -1)); };

  return (
    <AuthShell branchTag="تسجيل الدخول بـ PIN">
      <div className="flex flex-col items-center gap-10">

        {/* Heading */}
        <div className="flex flex-col items-center gap-3 text-center reveal reveal-1">
          <p className="text-[11px] tracking-[0.28em] text-brand-primary uppercase font-semibold">
            {selected ? "أدخل رقم PIN السرّي" : "اختر حسابك"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {selected
              ? <>مرحباً، <span className="text-brand-primary">{selectedUser?.name}</span></>
              : "أهلاً بك في نظام الوحش"}
          </h1>
          <p className="text-sm text-text-secondary max-w-md">
            {selected
              ? "أدخل رقم الـ PIN الخاص بك للمتابعة إلى لوحة التحكم."
              : "اختر حسابك لبدء الجلسة."}
          </p>
        </div>

        {/* Card */}
        <div className={cn(
          "w-full max-w-lg rounded-2xl reveal reveal-2",
          "bg-bg-surface/80 backdrop-blur-md border border-border-subtle shadow-lg",
          "p-8 sm:p-10"
        )}>
          {!selected ? (
            /* ── User picker ── */
            <div className="flex flex-col items-center gap-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full justify-items-center">
                {MOCK_USERS.map((u, i) => {
                  const role = roleMap[u.role];
                  return (
                    <div key={u.id} className="reveal" style={{ animationDelay: `${200 + i * 60}ms` }}>
                      <AvatarTile
                        name={u.name}
                        subtitle={role?.label ?? u.role}
                        onClick={() => setSelected(u.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── PIN entry ── */
            <div className="flex flex-col items-center gap-8">
              {/* Avatar */}
              <AvatarTile
                name={selectedUser?.name ?? ""}
                subtitle={roleMap[selectedUser?.role ?? "owner"]?.label ?? ""}
                selected
              />

              {/* Dots + hint */}
              <div className="flex flex-col items-center gap-3">
                <PinDots length={4} filled={pin.length} error={error} size="lg" />
                <p className={cn(
                  "text-sm min-h-[20px] transition-colors duration-fast text-center",
                  error ? "text-status-danger" : "text-text-tertiary"
                )}>
                  {locked
                    ? "تم تجاوز عدد المحاولات — تواصل مع المدير"
                    : error
                    ? `PIN غير صحيح — ${3 - attempts} محاولات متبقية`
                    : "أدخل رقم PIN السرّي"}
                </p>
              </div>

              {/* Keypad */}
              <PinKeypad
                onDigit={handleDigit}
                onBackspace={handleBackspace}
                onSubmit={() => {}}
                size="tablet"
                disabled={locked}
              />

              {/* Back to user picker */}
              <button
                type="button"
                onClick={() => { setSelected(null); setPin(""); setError(false); setAttempts(0); }}
                className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-brand-primary transition-colors duration-fast"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={1.75} />
                تغيير الحساب
              </button>
            </div>
          )}
        </div>

        {/* Footer links */}
        <div className="flex items-center gap-6 text-sm text-text-tertiary reveal reveal-3">
          <a href="/login" className="hover:text-brand-primary transition-colors duration-fast">
            تسجيل دخول بالبريد الإلكتروني
          </a>
          <span className="w-1 h-1 rounded-full bg-border" />
          <a href="/pin-reset" className="hover:text-brand-primary transition-colors duration-fast">
            نسيت PIN؟
          </a>
        </div>

      </div>
    </AuthShell>
  );
}
