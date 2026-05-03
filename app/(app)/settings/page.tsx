"use client";

import { useEffect, useState } from "react";
import {
  Type, KeyRound, Lock, Download, Eye, EyeOff,
  Check, AlertCircle, Database, FileSpreadsheet,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToastContext } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

const FONT_KEY = "wahsh.fontScale";

/* Apply font scale to root.
 * Tailwind classes in this project compile to px values (not rem), so changing
 * html { font-size } does nothing. CSS `zoom` scales everything proportionally
 * (text, spacing, icons) which is the desired behaviour for an accessibility
 * font-size slider. Supported in all major browsers. */
function applyFontScale(scale: number) {
  if (typeof document === "undefined") return;
  (document.documentElement.style as any).zoom = String(scale);
  document.documentElement.style.fontSize = `${scale * 16}px`;
}

/* ── CSV utilities ── */
function csvEscape(value: any): string {
  if (value === null || value === undefined) return "";
  const str = typeof value === "string" ? value : JSON.stringify(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function rowsToCSV(rows: any[][]): string {
  return rows.map((r) => r.map(csvEscape).join(",")).join("\n");
}

function downloadFile(filename: string, content: string, mime: string) {
  // UTF-8 BOM so Excel reads Arabic correctly
  const bom = "﻿";
  const blob = new Blob([bom + content], { type: mime + ";charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ════════════════════════════════════════════════════════════════════════ */

export default function SettingsPage() {
  const { user, updateCredentials } = useAuth();
  const toast = useToastContext();

  /* ── Font scale ── */
  const [fontScale, setFontScale] = useState(1);
  useEffect(() => {
    const saved = parseFloat(localStorage.getItem(FONT_KEY) || "1");
    if (!isNaN(saved) && saved >= 0.8 && saved <= 1.4) {
      setFontScale(saved);
      applyFontScale(saved);
    }
  }, []);
  function changeFontScale(s: number) {
    setFontScale(s);
    applyFontScale(s);
    localStorage.setItem(FONT_KEY, String(s));
  }

  /* ── Password change ── */
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdError, setPwdError] = useState("");

  function handleChangePassword() {
    setPwdError("");
    if (!user) return;
    if (currentPwd !== user.password) {
      setPwdError("كلمة المرور الحالية غير صحيحة");
      return;
    }
    if (newPwd.length < 6) {
      setPwdError("كلمة المرور الجديدة يجب أن تكون ٦ أحرف على الأقل");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("كلمتا المرور الجديدتان غير متطابقتين");
      return;
    }
    updateCredentials({ password: newPwd });
    toast.success("تم تغيير كلمة المرور", "استخدم كلمة المرور الجديدة في تسجيل الدخول التالي");
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
  }

  /* ── PIN change ── */
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");

  function handleChangePin() {
    setPinError("");
    if (!user) return;
    if (currentPin !== user.pin) {
      setPinError("رقم PIN الحالي غير صحيح");
      return;
    }
    if (!/^\d{4}$/.test(newPin)) {
      setPinError("رقم PIN الجديد يجب أن يكون ٤ أرقام");
      return;
    }
    if (newPin !== confirmPin) {
      setPinError("رقما PIN الجديدان غير متطابقين");
      return;
    }
    updateCredentials({ pin: newPin });
    toast.success("تم تغيير رقم PIN", "استخدم رقم PIN الجديد في تسجيل الدخول التالي");
    setCurrentPin(""); setNewPin(""); setConfirmPin("");
  }

  /* ── Backup export ── */
  function handleExportBackup() {
    const now = new Date();
    const stamp = now.toLocaleDateString("ar-EG", { day: "2-digit", month: "2-digit", year: "numeric" })
      + "_" + now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", hour12: false });

    // Pull all data from localStorage
    const requests   = JSON.parse(localStorage.getItem("wahsh.db.requests")  || "[]");
    const templates  = JSON.parse(localStorage.getItem("wahsh.templates")    || "[]");
    const session    = JSON.parse(localStorage.getItem("wahsh.session")      || "null");

    /* Section header helper */
    const section = (title: string, headers: string[], rows: any[][]) => [
      [`# ${title}`],
      headers,
      ...rows,
      [],
    ];

    const allRows: any[][] = [
      [`نسخة احتياطية لنظام مجموعة الوحش — ${stamp}`],
      [`المستخدم: ${session?.name ?? "غير معروف"} (${session?.role ?? "—"})`],
      [],
      ...section(
        `الطلبات (${requests.length})`,
        ["رقم الطلب", "الفرع", "البراند", "الحالة", "الأولوية", "تاريخ الإنشاء", "تاريخ التسليم", "عدد الأصناف", "ملاحظة"],
        requests.map((r: any) => [
          r.requestNumber, r.branchName, r.brandId, r.status, r.priority,
          r.createdAt, r.requestedDeliveryDate, r.items?.length ?? 0, r.note ?? "",
        ])
      ),
      ...section(
        `أصناف الطلبات (${requests.reduce((s: number, r: any) => s + (r.items?.length ?? 0), 0)})`,
        ["رقم الطلب", "الصنف", "الكود", "الكمية المطلوبة", "الكمية المُرسَلة", "الوحدة"],
        requests.flatMap((r: any) =>
          (r.items ?? []).map((it: any) => {
            const dispatched = r.dispatchItems?.find((d: any) => d.catalogId === it.catalogId);
            return [r.requestNumber, it.name, it.catalogId, it.requestedQty, dispatched?.dispatchedQty ?? "—", it.unit];
          })
        )
      ),
      ...section(
        `القوالب (${templates.length})`,
        ["الاسم", "الوصف", "عدد الأصناف", "تاريخ الإنشاء", "آخر استخدام"],
        templates.map((t: any) => [t.name, t.description, t.itemCount, t.createdAt ?? "—", t.lastUsed])
      ),
    ];

    const csv = rowsToCSV(allRows);
    const filename = `wahsh_backup_${stamp.replace(/[\/:\s]/g, "-")}.csv`;
    downloadFile(filename, csv, "text/csv");

    toast.success("تم تصدير النسخة الاحتياطية", `${requests.length} طلب · ${templates.length} قالب`);
  }

  if (!user) return null;

  return (
    <div className="mx-auto px-8 py-7 max-w-[900px] space-y-6">
      {/* HEADER */}
      <header>
        <p className="text-xs text-text-tertiary tracking-[0.18em] uppercase mb-1">SETTINGS · الإعدادات</p>
        <h1 className="text-3xl font-bold tracking-tight">إعدادات النظام</h1>
        <p className="text-sm text-text-tertiary mt-1">{user.name} · {user.email}</p>
      </header>

      <div className="gold-hairline" />

      {/* ── FONT SIZE ── */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-md bg-brand-primary/12 text-brand-primary flex items-center justify-center shrink-0">
            <Type className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">حجم الخط</h2>
            <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">
              تحكّم في حجم الخط على مستوى النظام بالكامل
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-tertiary tabular shrink-0">صغير</span>
            <input
              type="range"
              min={0.85}
              max={1.30}
              step={0.05}
              value={fontScale}
              onChange={(e) => changeFontScale(parseFloat(e.target.value))}
              className="flex-1 h-2 rounded-full bg-bg-surface-raised accent-brand-primary cursor-pointer"
            />
            <span className="text-xs text-text-tertiary tabular shrink-0">كبير</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-tertiary tabular">{Math.round(fontScale * 100)}%</span>
            <button
              type="button"
              onClick={() => changeFontScale(1)}
              className="text-[11px] text-brand-primary hover:underline"
            >
              إعادة الافتراضي
            </button>
          </div>
          <Card padding="md" className="bg-bg-surface-raised/40 border-border-subtle">
            <p className="text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-1">معاينة</p>
            <p className="text-sm">هذا نص تجريبي لمعاينة حجم الخط الحالي في النظام.</p>
            <p className="text-base font-bold mt-1">عنوان النص بحجم أكبر</p>
          </Card>
        </div>
      </Card>

      {/* ── CHANGE PASSWORD ── */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-md bg-status-info/12 text-status-info flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">تغيير كلمة المرور</h2>
            <p className="text-xs text-text-tertiary mt-0.5">للدخول من شاشة سطح المكتب</p>
          </div>
        </div>

        <div className="space-y-3 max-w-md">
          <div>
            <label className="block text-[11px] text-text-tertiary mb-1.5">كلمة المرور الحالية</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="w-full h-10 px-3 pr-10 rounded-sm bg-bg-surface border border-border focus:border-brand-primary outline-none text-sm tracking-tight transition-all"
              />
              <button type="button" onClick={() => setShowPwd((v) => !v)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-sm flex items-center justify-center text-text-tertiary hover:text-text-primary">
                {showPwd ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.75} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-text-tertiary mb-1.5">كلمة المرور الجديدة</label>
            <input
              type={showPwd ? "text" : "password"}
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="w-full h-10 px-3 rounded-sm bg-bg-surface border border-border focus:border-brand-primary outline-none text-sm tracking-tight transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] text-text-tertiary mb-1.5">تأكيد كلمة المرور</label>
            <input
              type={showPwd ? "text" : "password"}
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="w-full h-10 px-3 rounded-sm bg-bg-surface border border-border focus:border-brand-primary outline-none text-sm tracking-tight transition-all"
            />
          </div>
          {pwdError && (
            <div className="flex items-center gap-2 text-xs text-status-danger">
              <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
              {pwdError}
            </div>
          )}
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={!currentPwd || !newPwd || !confirmPwd}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-sm bg-brand-primary text-text-on-brand text-sm font-medium disabled:opacity-40 hover:bg-brand-primary-hover transition-all"
          >
            <Check className="w-4 h-4" strokeWidth={2.5} />
            حفظ كلمة المرور
          </button>
        </div>
      </Card>

      {/* ── CHANGE PIN ── */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-md bg-brand-warm/15 text-brand-warm flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">تغيير رقم PIN</h2>
            <p className="text-xs text-text-tertiary mt-0.5">٤ أرقام للدخول السريع من التابلت أو الموبايل</p>
          </div>
        </div>

        <div className="space-y-3 max-w-md">
          <div>
            <label className="block text-[11px] text-text-tertiary mb-1.5">رقم PIN الحالي</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
              className="w-32 h-10 px-3 rounded-sm bg-bg-surface border border-border focus:border-brand-primary outline-none text-center text-lg tabular tracking-widest transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] text-text-tertiary mb-1.5">PIN الجديد</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              className="w-32 h-10 px-3 rounded-sm bg-bg-surface border border-border focus:border-brand-primary outline-none text-center text-lg tabular tracking-widest transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] text-text-tertiary mb-1.5">تأكيد PIN الجديد</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
              className="w-32 h-10 px-3 rounded-sm bg-bg-surface border border-border focus:border-brand-primary outline-none text-center text-lg tabular tracking-widest transition-all"
            />
          </div>
          {pinError && (
            <div className="flex items-center gap-2 text-xs text-status-danger">
              <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
              {pinError}
            </div>
          )}
          <button
            type="button"
            onClick={handleChangePin}
            disabled={!currentPin || !newPin || !confirmPin}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-sm bg-brand-primary text-text-on-brand text-sm font-medium disabled:opacity-40 hover:bg-brand-primary-hover transition-all"
          >
            <Check className="w-4 h-4" strokeWidth={2.5} />
            حفظ PIN
          </button>
        </div>
      </Card>

      {/* ── BACKUP EXPORT ── */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-md bg-status-success/12 text-status-success flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold tracking-tight">نسخة احتياطية</h2>
              <Badge intent="success" size="sm">Excel متوافق</Badge>
            </div>
            <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">
              تصدير كل بيانات النظام (الطلبات، الأصناف، القوالب) في ملف Excel واحد بختم الوقت الحالي
            </p>
          </div>
        </div>

        <Card padding="md" className="bg-bg-surface-raised/40 border-border-subtle mb-4">
          <p className="text-[10px] tracking-[0.16em] uppercase text-text-tertiary mb-2">يحتوي الملف على</p>
          <ul className="space-y-1.5 text-xs">
            <li className="flex items-center gap-2"><Check className="w-3 h-3 text-status-success" strokeWidth={2.5} /> كل الطلبات بالحالات والأولويات</li>
            <li className="flex items-center gap-2"><Check className="w-3 h-3 text-status-success" strokeWidth={2.5} /> أصناف كل طلب مع الكميات المطلوبة والمُرسَلة</li>
            <li className="flex items-center gap-2"><Check className="w-3 h-3 text-status-success" strokeWidth={2.5} /> القوالب المحفوظة</li>
            <li className="flex items-center gap-2"><Check className="w-3 h-3 text-status-success" strokeWidth={2.5} /> ختم وقت التصدير وبيانات المستخدم</li>
          </ul>
        </Card>

        <button
          type="button"
          onClick={handleExportBackup}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-sm bg-status-success text-white text-sm font-medium hover:bg-status-success/85 active:scale-[0.98] transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" strokeWidth={2} />
          تصدير النسخة الاحتياطية الآن
          <Download className="w-4 h-4" strokeWidth={2} />
        </button>
      </Card>
    </div>
  );
}
