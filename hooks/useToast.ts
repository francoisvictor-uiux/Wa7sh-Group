"use client";

import { useToastContext } from "@/context/ToastContext";

/**
 * useToast — the single import for firing toasts anywhere in the app.
 *
 * Usage:
 *   const toast = useToast();
 *
 *   toast.success("تم الحفظ بنجاح");
 *   toast.error("فشل الاتصال", "تحقق من الإنترنت وحاول مرة أخرى");
 *   toast.warning("المخزون منخفض", "أقل من 10 وحدات متبقية");
 *   toast.info("تحديث جديد متاح");
 *   toast.confirm("تم إرسال الطلب", "رقم الطلب: #1042");
 *   toast.dismiss("toast-id");
 *   toast.dismissAll();
 */
export function useToast() {
  return useToastContext();
}
