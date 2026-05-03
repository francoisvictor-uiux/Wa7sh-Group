"use client";

import { useState, useEffect, useCallback } from "react";
import { templates as mockTemplates, type Template } from "@/lib/mock/requests";

const STORAGE_KEY = "wahsh.templates";

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTemplates(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = useCallback((list: Template[]) => {
    setTemplates(list);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  }, []);

  const addTemplate = useCallback((tpl: Template) => {
    const withDate: Template = {
      ...tpl,
      createdAt: tpl.createdAt ?? new Date().toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" }),
    };
    persist([...templates, withDate]);
  }, [templates, persist]);

  const updateTemplate = useCallback((id: string, updates: Partial<Pick<Template, "name" | "description">>) => {
    setTemplates((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const removeTemplate = useCallback((id: string) => {
    setTemplates((prev) => {
      const next = prev.filter((t) => t.id !== id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const replaceTemplate = useCallback((id: string, tpl: Template) => {
    setTemplates((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...tpl, id } : t));
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { templates, addTemplate, updateTemplate, removeTemplate, replaceTemplate };
}
