"use client";

import { useState } from "react";
import {
  QrCode,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Lock,
  Fingerprint,
  Camera,
} from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { StepIndicator } from "@/components/auth/StepIndicator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

const stepMeta: Record<Step, { eyebrow: string; title: string; subtitle: string }> = {
  1: {
    eyebrow: "الخطوة الأولى من ثلاث",
    title: "اربط الجهاز بفرعك",
    subtitle:
      "كل جهاز في النظام مربوط بفرع واحد بالاسم. امسح رمز QR الخاص بفرعك أو أدخل الرمز يدويًا.",
  },
  2: {
    eyebrow: "الخطوة الثانية من ثلاث",
    title: "سجّل بياناتك",
    subtitle:
      "أدخل بريدك وكلمة مرورك مرة واحدة فقط. بعدها ستستخدم PIN أو بصمة للدخول السريع في كل وردية.",
  },
  3: {
    eyebrow: "الخطوة الأخيرة",
    title: "سجّل بصمتك",
    subtitle:
      "اختياري لكن موصى به — يجعل الدخول لحظيًا في كل وردية، وأسرع من كتابة PIN كل مرة.",
  },
};

export default function EnrollmentWizard() {
  const [step, setStep] = useState<Step>(1);
  const [branchCode, setBranchCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bioEnrolled, setBioEnrolled] = useState(false);
  const [scanning, setScanning] = useState(false);

  const meta = stepMeta[step];

  const handleNext = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
    else {
      // eslint-disable-next-line no-alert
      alert("الإعداد مكتمل — مرحبًا بك في النظام");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleEnroll = () => {
    setScanning(true);
    window.setTimeout(() => {
      setScanning(false);
      setBioEnrolled(true);
    }, 1600);
  };

  const canProceed = () => {
    if (step === 1) return branchCode.trim().length >= 3;
    if (step === 2) return email.length > 3 && password.length >= 6;
    if (step === 3) return true;
    return false;
  };

  return (
    <AuthShell branchTag="جهاز جديد · غير مفعّل">
      <div className="flex flex-col items-center gap-10">
        <div className="reveal reveal-1">
          <StepIndicator current={step} total={3} label={meta.eyebrow} />
        </div>

        <div className="text-center max-w-xl space-y-3 reveal reveal-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {meta.title}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            {meta.subtitle}
          </p>
        </div>

        <div
          className={cn(
            "w-full max-w-xl rounded-2xl",
            "bg-bg-surface/80 backdrop-blur-md border border-border-subtle shadow-lg",
            "p-8 sm:p-12 reveal reveal-3"
          )}
        >
          {step === 1 && <Step1 branchCode={branchCode} onChange={setBranchCode} />}
          {step === 2 && (
            <Step2
              email={email}
              password={password}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
            />
          )}
          {step === 3 && (
            <Step3
              enrolled={bioEnrolled}
              scanning={scanning}
              onEnroll={handleEnroll}
            />
          )}
        </div>

        <div className="flex items-center gap-4 w-full max-w-xl reveal reveal-4">
          {step > 1 && (
            <Button variant="secondary" size="lg" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
              السابق
            </Button>
          )}
          <div className="flex-1" />
          {step === 3 && !bioEnrolled && (
            <Button variant="ghost" size="lg" onClick={handleNext}>
              تخطي وإنهاء
            </Button>
          )}
          <Button size="lg" onClick={handleNext} disabled={!canProceed()}>
            {step === 3 ? "إنهاء وابدأ" : "التالي"}
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}

/* ------- STEP 1 ------- */

function Step1({
  branchCode,
  onChange,
}: {
  branchCode: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-60 h-60 rounded-xl overflow-hidden bg-bg-canvas border border-border-subtle">
        {(["tl", "tr", "bl", "br"] as const).map((c) => (
          <span
            key={c}
            aria-hidden
            className={cn(
              "absolute w-8 h-8 border-brand-primary",
              c === "tl" && "top-3 left-3 border-t-2 border-l-2 rounded-tl-md",
              c === "tr" && "top-3 right-3 border-t-2 border-r-2 rounded-tr-md",
              c === "bl" && "bottom-3 left-3 border-b-2 border-l-2 rounded-bl-md",
              c === "br" &&
                "bottom-3 right-3 border-b-2 border-r-2 rounded-br-md"
            )}
          />
        ))}

        <span
          aria-hidden
          className="absolute left-3 right-3 h-0.5 bg-brand-primary/70"
          style={{
            top: "50%",
            boxShadow: "0 0 12px var(--brand-primary)",
            animation: "scanline 2.4s ease-in-out infinite",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="w-12 h-12 text-text-tertiary/60" strokeWidth={1} />
        </div>

        <style jsx>{`
          @keyframes scanline {
            0%,
            100% {
              top: 20%;
              opacity: 0.5;
            }
            50% {
              top: 80%;
              opacity: 1;
            }
          }
        `}</style>
      </div>

      <Button
        variant="primary"
        size="lg"
        leadingIcon={<QrCode className="w-4 h-4" strokeWidth={1.75} />}
      >
        امسح رمز QR للفرع
      </Button>

      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-[10px] text-text-tertiary tracking-[0.24em] uppercase">
          أو أدخل يدويًا
        </span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      <Input
        label="رمز الفرع"
        placeholder="مثال: WH-MASR-001"
        value={branchCode}
        onChange={(e) => onChange(e.target.value)}
        helper="ستجد رمز الفرع في الإيميل المُرسَل من المدير."
        className="font-mono tabular tracking-widest text-center"
      />
    </div>
  );
}

/* ------- STEP 2 ------- */

function Step2({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: {
  email: string;
  password: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Input
        label="البريد الإلكتروني"
        type="email"
        placeholder="ahmed@wahshgroup.eg"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        leadingIcon={<Mail className="w-4 h-4" strokeWidth={1.75} />}
        autoComplete="email"
      />
      <Input
        label="كلمة المرور"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        leadingIcon={<Lock className="w-4 h-4" strokeWidth={1.75} />}
        helper="6 أحرف على الأقل · يفضّل خلط أرقام وحروف"
        autoComplete="new-password"
      />

      <div className="rounded-md bg-bg-surface-raised/60 border border-border-subtle p-4 mt-2">
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="w-4 h-4 text-brand-primary mt-0.5 shrink-0"
            strokeWidth={2}
          />
          <p className="text-xs text-text-secondary leading-relaxed">
            ستُدخل هذه البيانات مرة واحدة فقط لربط حسابك بهذا الجهاز.
            في كل وردية بعدها — PIN أو بصمة، أسرع وأبسط.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------- STEP 3 ------- */

function Step3({
  enrolled,
  scanning,
  onEnroll,
}: {
  enrolled: boolean;
  scanning: boolean;
  onEnroll: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <button
        type="button"
        onClick={onEnroll}
        disabled={scanning || enrolled}
        aria-label="تسجيل البصمة"
        className={cn(
          "relative w-32 h-32 rounded-full",
          "border-2 transition-all duration-normal ease-out-expo",
          "focus-visible:outline-none",
          !enrolled &&
            !scanning &&
            "border-brand-primary/40 hover:border-brand-primary active:scale-95 bg-bg-surface-raised",
          scanning && "border-brand-primary bg-bg-surface-raised",
          enrolled && "border-status-success bg-status-success/10"
        )}
      >
        {!scanning && !enrolled && (
          <>
            <span
              aria-hidden
              className="absolute -inset-2 rounded-full border border-brand-primary/30 animate-pulse-dot"
            />
            <span
              aria-hidden
              className="absolute -inset-6 rounded-full border border-brand-primary/15 animate-pulse-dot"
              style={{ animationDelay: "300ms" }}
            />
          </>
        )}
        {scanning && (
          <span
            aria-hidden
            className="absolute -inset-2 rounded-full border-2 border-brand-primary border-l-transparent animate-spin"
          />
        )}
        {enrolled ? (
          <CheckCircle2
            className="w-14 h-14 mx-auto text-status-success"
            strokeWidth={1.5}
          />
        ) : (
          <Fingerprint
            className={cn(
              "w-14 h-14 mx-auto",
              scanning ? "text-brand-primary animate-pulse" : "text-brand-primary"
            )}
            strokeWidth={1.5}
          />
        )}
      </button>

      <div className="text-center min-h-[60px]">
        <p className="text-base font-medium tracking-tight">
          {enrolled
            ? "تم تسجيل البصمة بنجاح"
            : scanning
            ? "جارٍ التسجيل..."
            : "ضع إصبعك على المستشعر"}
        </p>
        <p className="text-sm text-text-tertiary mt-1">
          {enrolled
            ? "ستفتح الجهاز لمسة واحدة من الآن"
            : scanning
            ? "ضع إصبعك بثبات لـ 3 ثوانٍ"
            : "أو تخطي هذه الخطوة واستخدم PIN فقط"}
        </p>
      </div>
    </div>
  );
}
