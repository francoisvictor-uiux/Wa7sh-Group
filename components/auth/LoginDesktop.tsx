"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { getPostLoginRoute } from "@/lib/auth/redirect";
import { useToast } from "@/hooks/useToast";
import { LoginCarousel } from "./LoginCarousel";
import { asset } from "@/lib/basePath";
import { cn } from "@/lib/utils";

/**
 * Source: public/login/ — auto-fades every 4.5s with a 1s crossfade.
 * Add/remove files in that folder, then update this list.
 *
 * URLs run through `asset()` so they pick up the basePath when the app
 * is served from a subpath (GitHub Pages /Wa7sh-Group/).
 */
const CAROUSEL_IMAGES: string[] = [
  asset("/login/01.webp"),
  asset("/login/02.webp"),
  asset("/login/03.webp"),
  asset("/login/04.webp"),
  asset("/login/05.webp"),
  asset("/login/06.webp"),
];
const CAROUSEL_CAPTIONS: string[] = [];

function DemoCredentials({ label, email, password, pin }: {
  label: string; email: string; password: string; pin: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-text-tertiary">{label}</span>
        <span className="font-mono text-[10px] text-brand-primary/80 truncate">{email}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-between flex-1">
          <span className="text-[10px] text-text-tertiary">كلمة المرور:</span>
          <code className="text-[10px] font-mono text-brand-primary/80 bg-bg-surface-raised px-1.5 py-0.5 rounded">{password}</code>
        </div>
        <div className="flex items-center justify-between flex-1">
          <span className="text-[10px] text-text-tertiary">PIN:</span>
          <code className="text-[10px] font-mono text-brand-primary/80 bg-bg-surface-raised px-1.5 py-0.5 rounded tracking-widest">{pin}</code>
        </div>
      </div>
    </div>
  );
}

export function LoginDesktop() {
  const router = useRouter();
  const { loginByEmail, user } = useAuth();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [rememberMe, setRememberMe]     = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("بيانات ناقصة", "أدخل البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      const success = loginByEmail(email, password);
      setLoading(false);

      if (success) {
        toast.success("مرحباً بك", "جارٍ تحميل النظام...");
        const route = user ? getPostLoginRoute(user.role) : "/dashboard";
        window.setTimeout(() => router.push(route), 600);
      } else {
        toast.error("بيانات غير صحيحة", "البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setPassword("");
      }
    }, 900);
  };

  return (
    <div className="min-h-screen w-full bg-[#FBF8F4] grid grid-cols-1 lg:grid-cols-[minmax(380px,35%)_1fr]">
      {/* Right (RTL: first child) — Login form, ~35% of width */}
      <section className="relative flex flex-col px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
        <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md space-y-7">
          {/* Logo + brand wordmark */}
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden bg-bg-surface border border-border-subtle">
              <img
                src={asset("/login/logo.webp")}
                alt="مجموعة الوحش"
                width={48}
                height={48}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg tracking-tight">مجموعة الوحش</span>
              <span className="text-[11px] text-text-tertiary tracking-[0.18em] uppercase mt-1">
                El Wahsh Group
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <p className="text-[11px] tracking-[0.24em] text-brand-primary uppercase font-semibold">
              تسجيل الدخول
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
              ابدأ بإدارة مخزونك
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              كل فروعك في مكان واحد يمكنك متابعته من هنا!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ahmed@wahshgroup.eg"
              autoComplete="email"
              required
              leadingIcon={<Mail className="w-4 h-4" strokeWidth={1.75} />}
            />

            <Input
              label="كلمة المرور"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              leadingIcon={<Lock className="w-4 h-4" strokeWidth={1.75} />}
              trailingIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="hover:text-brand-primary transition-colors"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                    : <Eye className="w-4 h-4" strokeWidth={1.75} />
                  }
                </button>
              }
            />

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-text-secondary group">
                <span className="relative inline-flex items-center justify-center w-4 h-4 shrink-0">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={cn(
                      "peer absolute inset-0 appearance-none rounded-sm border border-border-strong bg-bg-surface",
                      "checked:bg-brand-primary checked:border-brand-primary",
                      "transition-colors duration-fast cursor-pointer",
                      "focus-visible:outline-none focus-visible:shadow-glow-brand",
                    )}
                  />
                  <Check
                    className="relative w-3 h-3 text-text-on-brand opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-fast"
                    strokeWidth={3}
                  />
                </span>
                <span className="group-hover:text-text-primary transition-colors">
                  تذكرني
                </span>
              </label>
              <Link href="/forgot-password" className="text-brand-primary hover:text-brand-primary-hover transition-colors">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              trailingIcon={<ArrowLeft className="w-4 h-4" strokeWidth={2} />}
              className="mt-2"
            >
              تسجيل الدخول
            </Button>
          </form>

          {/* Demo hint */}
          <div className="rounded-xl border border-border-subtle bg-bg-surface p-3.5 space-y-3">
            <p className="text-[10px] text-text-tertiary tracking-[0.18em] uppercase font-semibold">
              حسابات تجريبية
            </p>
            <DemoCredentials
              label="مدير المصنع — بيشوي مجدي"
              email="factory@wahshgroup.eg"
              password="Wahsh@2026"
              pin="5231"
            />
            <div className="border-t border-border-subtle" />
            <DemoCredentials
              label="مدير الفرع — منى محمود"
              email="branch@wahshgroup.eg"
              password="Branch@2026"
              pin="4892"
            />
          </div>

          <div className="flex items-center justify-center">
            <Link
              href="/login/pin"
              className="text-sm text-brand-primary hover:text-brand-primary-hover transition-colors font-medium"
            >
              أو دخول بالـ PIN
            </Link>
          </div>

        </div>

        </div>

        <footer className="text-center text-[10px] text-text-tertiary tracking-[0.22em] uppercase pt-6">
          © 2026 · El Wahsh Group · الإسكندرية
        </footer>
      </section>

      {/* Left (RTL: second child) — Image carousel, full-bleed edge to edge */}
      <aside className="hidden lg:block relative">
        <LoginCarousel images={CAROUSEL_IMAGES} captions={CAROUSEL_CAPTIONS} />
      </aside>
    </div>
  );
}

