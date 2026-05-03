"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MOCK_USERS } from "@/context/AuthContext";
import { asset } from "@/lib/basePath";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "email" | "otp" | "password" | "done";

// Simulated OTP for the demo
const DEMO_OTP = "847261";

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS: { id: Step; label: string }[] = [
  { id: "email",    label: "البريد" },
  { id: "otp",      label: "الكود"  },
  { id: "password", label: "كلمة المرور" },
  { id: "done",     label: "تم"     },
];

function StepBar({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center gap-0 w-full max-w-xs mx-auto">
      {STEPS.map((s, i) => {
        const done   = i < idx;
        const active = i === idx;
        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-normal",
                  done   && "bg-brand-primary text-text-on-brand",
                  active && "bg-brand-primary text-text-on-brand ring-4 ring-brand-primary/20",
                  !done && !active && "bg-bg-surface-raised text-text-tertiary border border-border"
                )}
              >
                {done ? <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[9px] tracking-[0.18em] uppercase whitespace-nowrap transition-colors duration-fast",
                  active ? "text-brand-primary font-semibold" : done ? "text-text-secondary" : "text-text-tertiary"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-1 mb-5 transition-colors duration-normal",
                  i < idx ? "bg-brand-primary/60" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const router  = useRouter();
  const [step,     setStep]     = useState<Step>("email");
  const [email,    setEmail]    = useState("");
  const [otp,      setOtp]      = useState("");
  const [otpError, setOtpError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showCf,   setShowCf]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [pwError,  setPwError]  = useState("");

  // ── Step 1: Email ─────────────────────────────────────────────────────────

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      const found = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (!found) {
        // Still proceed — don't leak which emails exist (UX best-practice)
      }
      setStep("otp");
    }, 900);
  };

  // ── Step 2: OTP ───────────────────────────────────────────────────────────

  const handleOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    if (otp.trim() !== DEMO_OTP) {
      setOtpError("الكود غير صحيح — تحقق من البريد الإلكتروني");
      return;
    }
    setStep("password");
  };

  const handleResendOtp = () => {
    setOtp("");
    setOtpError("");
  };

  // ── Step 3: New Password ──────────────────────────────────────────────────

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");

    if (password.length < 8) {
      setPwError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    if (password !== confirm) {
      setPwError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      // In a real app: call API to update password
      // Update mock user password in-memory
      const user = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (user) user.password = password;
      setLoading(false);
      setStep("done");
    }, 1000);
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen w-full bg-[#FBF8F4] flex flex-col">

      {/* Top nav */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden bg-bg-surface border border-border-subtle">
            <img
              src={asset("/login/logo.webp")}
              alt="مجموعة الوحش"
              width={36} height={36}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          <span className="font-bold text-sm tracking-tight">مجموعة الوحش</span>
        </div>

        {step !== "done" && (
          <a
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-brand-primary transition-colors duration-fast"
          >
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" strokeWidth={2} />
            العودة لتسجيل الدخول
          </a>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md space-y-8">

          {/* Step bar */}
          {step !== "done" && <StepBar current={step} />}

          {/* Card */}
          <div className="rounded-2xl border border-border-subtle bg-bg-surface shadow-lg p-8 sm:p-10 space-y-7">

            {/* ── Step 1: Email ── */}
            {step === "email" && (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 mb-4">
                    <Mail className="w-5 h-5 text-brand-primary" strokeWidth={1.75} />
                  </div>
                  <p className="text-[11px] tracking-[0.24em] text-brand-primary uppercase font-semibold">
                    استعادة كلمة المرور
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight">أدخل بريدك الإلكتروني</h1>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    هنبعتلك كود تحقق على البريد عشان تقدر تغير كلمة المرور.
                  </p>
                </div>

                <form onSubmit={handleEmail} className="space-y-5">
                  <Input
                    label="البريد الإلكتروني"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="factory@wahshgroup.eg"
                    autoComplete="email"
                    required
                    leadingIcon={<Mail className="w-4 h-4" strokeWidth={1.75} />}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={loading}
                    trailingIcon={<ArrowLeft className="w-4 h-4" strokeWidth={2} />}
                  >
                    إرسال كود التحقق
                  </Button>
                </form>
              </>
            )}

            {/* ── Step 2: OTP ── */}
            {step === "otp" && (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 mb-4">
                    <ShieldCheck className="w-5 h-5 text-brand-primary" strokeWidth={1.75} />
                  </div>
                  <p className="text-[11px] tracking-[0.24em] text-brand-primary uppercase font-semibold">
                    كود التحقق
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight">تحقق من هويتك</h1>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    تم إرسال كود مكوّن من 6 أرقام إلى{" "}
                    <span className="font-medium text-text-primary">{email}</span>
                  </p>
                </div>

                {/* Demo hint */}
                <div className="flex items-center justify-between rounded-lg bg-brand-primary/5 border border-brand-primary/20 px-4 py-3">
                  <span className="text-xs text-text-secondary">كود تجريبي:</span>
                  <code className="text-sm font-mono font-bold text-brand-primary tracking-[0.3em]">
                    {DEMO_OTP}
                  </code>
                </div>

                <form onSubmit={handleOtp} className="space-y-5">
                  {/* OTP boxes */}
                  <OtpInput value={otp} onChange={setOtp} error={!!otpError} />
                  {otpError && (
                    <p className="text-xs text-status-danger text-center -mt-2">{otpError}</p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    disabled={otp.length < 6}
                    trailingIcon={<ArrowLeft className="w-4 h-4" strokeWidth={2} />}
                  >
                    تأكيد الكود
                  </Button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-text-tertiary hover:text-brand-primary transition-colors duration-fast"
                  >
                    <RefreshCw className="w-3 h-3" strokeWidth={2} />
                    إعادة إرسال الكود
                  </button>
                </form>
              </>
            )}

            {/* ── Step 3: New Password ── */}
            {step === "password" && (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 mb-4">
                    <Lock className="w-5 h-5 text-brand-primary" strokeWidth={1.75} />
                  </div>
                  <p className="text-[11px] tracking-[0.24em] text-brand-primary uppercase font-semibold">
                    كلمة مرور جديدة
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight">اختر كلمة مرور قوية</h1>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    8 أحرف على الأقل — استخدم أرقام وحروف وعلامات.
                  </p>
                </div>

                <form onSubmit={handlePassword} className="space-y-4">
                  <Input
                    label="كلمة المرور الجديدة"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPwError(""); }}
                    placeholder="••••••••••••"
                    required
                    leadingIcon={<Lock className="w-4 h-4" strokeWidth={1.75} />}
                    trailingIcon={
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        className="hover:text-brand-primary transition-colors"
                        aria-label={showPw ? "إخفاء" : "إظهار"}
                      >
                        {showPw
                          ? <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                          : <Eye className="w-4 h-4" strokeWidth={1.75} />}
                      </button>
                    }
                  />

                  {/* Password strength bar */}
                  <PasswordStrength password={password} />

                  <Input
                    label="تأكيد كلمة المرور"
                    type={showCf ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setPwError(""); }}
                    placeholder="••••••••••••"
                    required
                    leadingIcon={<Lock className="w-4 h-4" strokeWidth={1.75} />}
                    trailingIcon={
                      <button
                        type="button"
                        onClick={() => setShowCf((s) => !s)}
                        className="hover:text-brand-primary transition-colors"
                        aria-label={showCf ? "إخفاء" : "إظهار"}
                      >
                        {showCf
                          ? <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                          : <Eye className="w-4 h-4" strokeWidth={1.75} />}
                      </button>
                    }
                  />

                  {pwError && (
                    <p className="text-xs text-status-danger">{pwError}</p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={loading}
                    trailingIcon={<ArrowLeft className="w-4 h-4" strokeWidth={2} />}
                    className="mt-2"
                  >
                    حفظ كلمة المرور
                  </Button>
                </form>
              </>
            )}

            {/* ── Step 4: Done ── */}
            {step === "done" && (
              <div className="flex flex-col items-center gap-6 py-4 text-center">
                <div className="relative">
                  <div
                    aria-hidden
                    className="absolute inset-[-14px] rounded-full border border-status-success/30 animate-pulse"
                  />
                  <div className="relative w-20 h-20 rounded-full bg-status-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-status-success" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight">تم تغيير كلمة المرور</h1>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
                    كلمة المرور الجديدة فعّالة الآن — يمكنك تسجيل الدخول بها مباشرة.
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => router.push("/login")}
                  trailingIcon={<ArrowLeft className="w-4 h-4" strokeWidth={2} />}
                >
                  تسجيل الدخول الآن
                </Button>
              </div>
            )}
          </div>

          {/* Help text */}
          {step !== "done" && (
            <p className="text-center text-xs text-text-tertiary">
              محتاج مساعدة؟{" "}
              <span className="text-brand-primary cursor-pointer hover:underline">
                تواصل مع مدير النظام
              </span>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── OTP input (6 boxes) ──────────────────────────────────────────────────────

function OtpInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error: boolean;
}) {
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  const handleKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    const key = e.key;
    if (key === "Backspace") {
      e.preventDefault();
      const next = value.slice(0, Math.max(0, idx === value.length ? idx - 1 : idx));
      onChange(next);
      const prev = document.getElementById(`otp-${Math.max(0, idx - 1)}`);
      (prev as HTMLInputElement)?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) return;
    const arr = digits.map((d, i) => (i === idx ? char : d));
    const joined = arr.join("").slice(0, 6);
    onChange(joined);
    const next = document.getElementById(`otp-${Math.min(5, idx + 1)}`);
    (next as HTMLInputElement)?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(text);
    const last = document.getElementById(`otp-${Math.min(5, text.length - 1)}`);
    (last as HTMLInputElement)?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          className={cn(
            "w-11 h-13 text-center text-lg font-mono font-bold rounded-xl border-2 bg-bg-surface",
            "transition-all duration-fast focus:outline-none",
            error
              ? "border-status-danger text-status-danger"
              : d
              ? "border-brand-primary text-brand-primary"
              : "border-border focus:border-brand-primary",
            "caret-brand-primary"
          )}
          style={{ height: "3.25rem" }}
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
}

// ─── Password strength meter ──────────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  const score = getStrength(password);
  const bars  = ["bg-status-danger", "bg-status-warning", "bg-yellow-400", "bg-status-success"];
  const label = ["ضعيفة جداً", "ضعيفة", "مقبولة", "قوية"];

  if (!password) return null;

  return (
    <div className="space-y-1.5 -mt-1">
      <div className="flex gap-1">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-normal",
              i < score ? bars[score - 1] : "bg-border"
            )}
          />
        ))}
      </div>
      <p className={cn("text-[10px] text-end", score <= 1 ? "text-status-danger" : score === 2 ? "text-status-warning" : score === 3 ? "text-yellow-500" : "text-status-success")}>
        {label[score - 1] ?? ""}
      </p>
    </div>
  );
}

function getStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8)  s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.max(1, s);
}
