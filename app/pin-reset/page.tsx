"use client";

import { useState } from "react";
import { ArrowLeft, KeyRound, Shield, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { PinDots } from "@/components/auth/PinDots";
import { PinKeypad } from "@/components/auth/PinKeypad";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Stage = "current" | "new" | "confirm" | "done";

const stageMeta: Record<
  Stage,
  { eyebrow: string; title: string; helper: string }
> = {
  current: {
    eyebrow: "الخطوة 1 من 3",
    title: "أكّد هويتك أولاً",
    helper: "أدخل رقم PIN الحالي للمتابعة",
  },
  new: {
    eyebrow: "الخطوة 2 من 3",
    title: "اختر رقم PIN جديد",
    helper: "4 أرقام · لا تستخدم سنة ميلادك أو 1234",
  },
  confirm: {
    eyebrow: "الخطوة 3 من 3",
    title: "أكّد الرقم الجديد",
    helper: "أدخل نفس الأربعة أرقام مرة أخرى",
  },
  done: {
    eyebrow: "اكتمل التغيير",
    title: "تم تغيير PIN بنجاح",
    helper: "ستحتاج الرقم الجديد في تسجيل الدخول التالي",
  },
};

const STORED_PIN = "1234";

export default function PinResetPage() {
  const [stage, setStage] = useState<Stage>("current");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const meta = stageMeta[stage];

  const handleDigit = (d: string) => {
    if (pin.length >= 4 || stage === "done") return;
    setError(null);
    setPin((p) => {
      const next = p + d;
      if (next.length === 4) {
        window.setTimeout(() => evaluate(next), 180);
      }
      return next;
    });
  };

  const handleBackspace = () => {
    if (stage === "done") return;
    setError(null);
    setPin((p) => p.slice(0, -1));
  };

  const evaluate = (entered: string) => {
    if (stage === "current") {
      if (entered === STORED_PIN) {
        setStage("new");
        setPin("");
      } else {
        setError("PIN الحالي غير صحيح");
        window.setTimeout(() => {
          setPin("");
          setError(null);
        }, 600);
      }
    } else if (stage === "new") {
      if (entered === STORED_PIN) {
        setError("لا يمكن استخدام نفس الرقم القديم");
        window.setTimeout(() => {
          setPin("");
          setError(null);
        }, 700);
        return;
      }
      if (entered === "1234" || entered === "0000" || entered === "1111") {
        setError("اختر رقمًا أكثر صعوبة");
        window.setTimeout(() => {
          setPin("");
          setError(null);
        }, 700);
        return;
      }
      setNewPin(entered);
      setStage("confirm");
      setPin("");
    } else if (stage === "confirm") {
      if (entered === newPin) {
        setStage("done");
      } else {
        setError("الأرقام لا تتطابق — حاول مرة أخرى");
        window.setTimeout(() => {
          setPin("");
          setError(null);
        }, 700);
      }
    }
  };

  return (
    <AuthShell branchTag="إدارة الحساب · الفرع: مصر الجديدة">
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4 text-center reveal reveal-1">
          <div
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-md",
              "bg-bg-surface-raised border border-border-subtle"
            )}
          >
            {stage === "done" ? (
              <CheckCircle2
                className="w-6 h-6 text-status-success"
                strokeWidth={1.75}
              />
            ) : (
              <KeyRound
                className="w-6 h-6 text-brand-primary"
                strokeWidth={1.75}
              />
            )}
          </div>
          <span className="text-xs tracking-[0.24em] text-brand-primary uppercase">
            {meta.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {meta.title}
          </h1>
          <p className="text-sm text-text-secondary max-w-md">{meta.helper}</p>
        </div>

        <div className="flex items-center gap-2 reveal reveal-2">
          {(["current", "new", "confirm"] as Stage[]).map((s, i) => {
            const isActive = stage === s;
            const isComplete =
              (s === "current" &&
                (stage === "new" || stage === "confirm" || stage === "done")) ||
              (s === "new" && (stage === "confirm" || stage === "done")) ||
              (s === "confirm" && stage === "done");
            return (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && (
                  <div
                    className={cn(
                      "h-px w-8 transition-colors duration-fast",
                      isComplete ? "bg-brand-primary/60" : "bg-border"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-normal ease-out-expo",
                    isActive
                      ? "w-10 bg-brand-primary"
                      : isComplete
                      ? "w-2 bg-brand-primary/60"
                      : "w-2 bg-border"
                  )}
                />
              </div>
            );
          })}
        </div>

        <div
          className={cn(
            "w-full max-w-md rounded-2xl",
            "bg-bg-surface/80 backdrop-blur-md border border-border-subtle shadow-lg",
            "p-8 sm:p-10 reveal reveal-3"
          )}
        >
          {stage === "done" ? (
            <DoneState />
          ) : (
            <div className="flex flex-col items-center gap-8">
              <PinDots
                length={4}
                filled={pin.length}
                error={Boolean(error)}
                size="lg"
              />
              <p
                className={cn(
                  "text-sm min-h-[20px] transition-colors duration-fast",
                  error ? "text-status-danger" : "text-text-tertiary"
                )}
              >
                {error || meta.helper}
              </p>
              <PinKeypad
                onDigit={handleDigit}
                onBackspace={handleBackspace}
                size="tablet"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 reveal reveal-4">
          {stage !== "done" ? (
            <>
              <a
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-brand-primary transition-colors"
              >
                <ArrowLeft
                  className="w-4 h-4 rotate-180"
                  strokeWidth={1.75}
                />
                العودة لتسجيل الدخول
              </a>
              <span className="w-1 h-1 rounded-full bg-border" />
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-brand-primary transition-colors"
              >
                <Shield className="w-4 h-4" strokeWidth={1.75} />
                إعادة تعيين عبر المدير
              </button>
            </>
          ) : (
            <Button
              size="lg"
              onClick={() => (window.location.href = "/login")}
            >
              العودة لتسجيل الدخول
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            </Button>
          )}
        </div>
      </div>
    </AuthShell>
  );
}

function DoneState() {
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-[-12px] rounded-full border border-status-success/30 animate-pulse-dot"
        />
        <div className="relative w-20 h-20 rounded-full bg-status-success/10 flex items-center justify-center">
          <CheckCircle2
            className="w-10 h-10 text-status-success"
            strokeWidth={1.75}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-base font-medium">تم تحديث رقم PIN</p>
        <p className="text-sm text-text-tertiary">
          الرقم الجديد فعّال من الآن — حافظ عليه سرّيًا.
        </p>
      </div>
    </div>
  );
}
