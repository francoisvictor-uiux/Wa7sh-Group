"use client";

import { useState } from "react";
import { Plus, Search, Mail, Shield, Trash2, X, User as UserIcon, Users as UsersIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { roles, roleMap, type Role } from "@/lib/permissions";
import { brandMeta, allBranches, branchMap } from "@/lib/mock/branches";
import { MOCK_USERS } from "@/context/AuthContext";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { Button } from "@/components/ui/Button";
import { PageHeader, EmptyState } from "@/components/ui/page";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/auth/types";

export function UserManagement() {
  const toast = useToast();
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  if (!me) return null;
  const myMeta = roleMap[me.role];
  if (!myMeta.canAddUsers) {
    return (
      <EmptyState
        icon={Shield}
        title="صلاحية إدارة المستخدمين غير متاحة"
        description="هذه الشاشة للأدوار المخوّلة فقط (الأونر، مدير HR، مديري الفروع)"
        size="lg"
        className="h-full"
      />
    );
  }

  // Scope filter — show only users this admin can see
  const visibleUsers = users.filter((u) => {
    if (me.scope === "group")  return true;
    if (me.scope === "factory") return u.scope === "factory";
    if (me.scope === "brand")   return u.brandId === me.brandId;
    if (me.scope === "branch")  return u.branchId === me.branchId;
    return false;
  });

  const filtered = visibleUsers.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const handleAdd = (newUser: Omit<AuthUser, "id">) => {
    const id = `u-${Date.now()}`;
    setUsers((prev) => [...prev, { ...newUser, id } as AuthUser]);
    toast.success("تمت إضافة المستخدم", `${newUser.name} · ${roleMap[newUser.role].label}`);
    setShowAdd(false);
  };

  const handleDelete = (userId: string, userName: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast.error("تم حذف المستخدم", userName);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-bg-canvas">

      <PageHeader
        icon={UsersIcon}
        title="إدارة المستخدمين"
        description={`${filtered.length} مستخدم في نطاقك (${myMeta.label})`}
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAdd(true)}
            trailingIcon={<Plus className="w-4 h-4" strokeWidth={2} />}
          >
            إضافة مستخدم
          </Button>
        }
        meta={
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو البريد..."
              className="w-full h-9 pr-9 pl-3 text-sm rounded-lg bg-bg-surface-raised border border-border-subtle focus:outline-none focus:border-border-focus"
            />
          </div>
        }
      />

      {/* Users list */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-4 px-5 py-3 bg-bg-surface-raised border-b border-border-subtle">
            <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wide">الاسم</span>
            <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wide">الدور</span>
            <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wide">النطاق</span>
            <span className="w-8" />
          </div>

          {filtered.map((u, idx) => (
            <UserRow
              key={u.id}
              user={u}
              isMe={u.id === me.id}
              canDelete={myMeta.canAddUsers && u.id !== me.id}
              onDelete={() => handleDelete(u.id, u.name)}
              isLast={idx === filtered.length - 1}
            />
          ))}

          {filtered.length === 0 && (
            <EmptyState
              icon={UsersIcon}
              title="لا يوجد مستخدمين"
              description={search ? "جرب مصطلح بحث آخر" : "اضغط 'إضافة مستخدم' لبدء الفريق"}
              size="sm"
            />
          )}
        </div>
      </div>

      {/* Add user dialog */}
      {showAdd && (
        <AddUserDialog
          adminUser={me}
          onAdd={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}

// ─── User row ─────────────────────────────────────────────────────────────────

function UserRow({
  user, isMe, canDelete, onDelete, isLast,
}: {
  user: AuthUser;
  isMe: boolean;
  canDelete: boolean;
  onDelete: () => void;
  isLast: boolean;
}) {
  const role   = roleMap[user.role];
  const branch = user.branchId ? branchMap[user.branchId] : null;
  const brand  = user.brandId ? brandMeta[user.brandId] : null;

  const scopeLabel = branch?.name ?? brand?.name ?? (user.scope === "factory" ? "المصنع" : "المجموعة");

  return (
    <div className={cn(
      "grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-4 px-5 py-3 items-center hover:bg-bg-surface-raised transition-colors",
      !isLast && "border-b border-border-subtle"
    )}>
      {/* Name + email */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center font-semibold text-sm shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium tracking-tight truncate">{user.name}</p>
            {isMe && (
              <span className="text-[9px] font-semibold text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded">
                أنت
              </span>
            )}
          </div>
          <p className="text-[11px] text-text-tertiary truncate">{user.email}</p>
        </div>
      </div>

      {/* Role */}
      <div>
        <p className="text-xs font-medium">{role.label}</p>
        <p className="text-[11px] text-text-tertiary">{role.labelEn}</p>
      </div>

      {/* Scope */}
      <div className="flex items-center gap-1.5 min-w-0">
        {brand && <BrandIcon brandId={brand.id} size="xs" />}
        <span className="text-xs text-text-secondary truncate">{scopeLabel}</span>
      </div>

      {/* Actions */}
      <div className="w-8 flex justify-end">
        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-md text-text-tertiary hover:text-status-danger hover:bg-status-danger/10 transition-colors"
            title="حذف"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Add user dialog ──────────────────────────────────────────────────────────

function AddUserDialog({
  adminUser, onAdd, onClose,
}: {
  adminUser: AuthUser;
  onAdd: (u: Omit<AuthUser, "id">) => void;
  onClose: () => void;
}) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState<Role>("warehouse-manager");

  // Available roles depend on admin's scope
  const availableRoles = roles.filter((r) => {
    if (adminUser.role === "owner") return true;
    if (adminUser.role === "hr-manager") return true;
    if (adminUser.role === "warehouse-manager") {
      return r.scope === "factory" && r.id !== "warehouse-manager";
    }
    return false;
  });

  const selectedRoleMeta = roleMap[role];
  const needsBrand  = selectedRoleMeta.scope === "brand" || selectedRoleMeta.scope === "branch";
  const needsBranch = selectedRoleMeta.scope === "branch";

  const [brandId, setBrandId]   = useState(adminUser.brandId ?? "wahsh");
  const [branchId, setBranchId] = useState(adminUser.branchId ?? "");

  const availableBranches = needsBranch
    ? allBranches.filter((b) => b.brandId === brandId)
    : [];

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || pin.length !== 4) {
      toast.warning("بيانات ناقصة", "أكمل جميع الحقول والـ PIN يجب 4 أرقام");
      return;
    }
    if (needsBranch && !branchId) {
      toast.warning("اختر فرعاً");
      return;
    }

    onAdd({
      name,
      email,
      pin,
      role,
      scope: selectedRoleMeta.scope,
      brandId: needsBrand ? brandId as any : undefined,
      branchId: needsBranch ? branchId : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl bg-bg-surface border border-border-subtle shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <div>
            <h2 className="text-base font-bold tracking-tight">إضافة مستخدم جديد</h2>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              في نطاق: {roleMap[adminUser.role].label}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary p-1.5 rounded-md hover:bg-bg-surface-raised"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">الاسم الكامل</label>
            <div className="relative">
              <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أحمد محمد"
                className="w-full h-10 pr-9 pl-3 text-sm rounded-lg border border-border bg-bg-surface focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.75} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmed@wahshgroup.eg"
                className="w-full h-10 pr-9 pl-3 text-sm rounded-lg border border-border bg-bg-surface focus:outline-none focus:border-brand-primary font-mono"
              />
            </div>
          </div>

          {/* PIN */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">PIN (4 أرقام)</label>
            <input
              type="text"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="0000"
              className="w-full h-10 px-3 text-sm tracking-widest text-center rounded-lg border border-border bg-bg-surface focus:outline-none focus:border-brand-primary font-mono"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">الدور</label>
            <div className="grid grid-cols-1 gap-1.5">
              {availableRoles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={cn(
                    "text-right rounded-lg border p-3 transition-colors",
                    role === r.id
                      ? "border-brand-primary bg-brand-primary/8"
                      : "border-border-subtle bg-bg-surface hover:border-border-strong"
                  )}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={cn("text-sm font-medium", role === r.id && "text-brand-primary")}>
                      {r.label}
                    </p>
                    <span className="text-[10px] text-text-tertiary uppercase tracking-wide">
                      {r.scope}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-tertiary">{r.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Brand picker (if needed) */}
          {needsBrand && adminUser.role === "owner" && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">البراند</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["wahsh", "kababgy", "forno"] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => { setBrandId(b); setBranchId(""); }}
                    className={cn(
                      "rounded-lg border p-2.5 text-center transition-colors",
                      brandId === b
                        ? "border-brand-primary bg-brand-primary/8"
                        : "border-border-subtle hover:border-border-strong"
                    )}
                  >
                    <BrandIcon brandId={b} size="sm" className="mx-auto mb-1" />
                    <p className="text-[10px] font-medium">{brandMeta[b].name.split(" ")[0]}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Branch picker */}
          {needsBranch && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">الفرع</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-bg-surface focus:outline-none focus:border-brand-primary"
              >
                <option value="">— اختر فرعاً —</option>
                {availableBranches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name} · {b.address}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="border-t border-border-subtle px-5 py-3.5 flex gap-2.5">
          <Button variant="ghost" size="md" onClick={onClose}>إلغاء</Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleSubmit}
            trailingIcon={<Plus className="w-4 h-4" strokeWidth={2} />}
          >
            إضافة المستخدم
          </Button>
        </div>
      </div>
    </div>
  );
}
