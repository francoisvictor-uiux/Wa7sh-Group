# نظام الوحش — Wireframes & Screen Specifications
## Screen-Level UX Documentation (Tablet · Mobile · Desktop)

> **Companion to:** `01_UX_Strategy.md`
> **Reading order:** Patterns Reference → Tablet Screens → Mobile Screens → Desktop Screens → Component Library → State Specifications
> **All wireframes are RTL.** The visual right edge in every diagram below is what the user sees first.

---

## Table of Contents

- [0. Wireframe Legend & Conventions](#0-wireframe-legend--conventions)
- [1. Design Patterns Reference](#1-design-patterns-reference)
- [2. Tablet Wireframes (Primary Operational Surface)](#2-tablet-wireframes-primary-operational-surface)
- [3. Mobile Wireframes (Quick Execution Surface)](#3-mobile-wireframes-quick-execution-surface)
- [4. Desktop Wireframes (Full Power Surface)](#4-desktop-wireframes-full-power-surface)
- [5. Component Library](#5-component-library)
- [6. State Specifications (Empty / Loading / Error / Success)](#6-state-specifications)
- [7. Accessibility & Interaction Specs](#7-accessibility--interaction-specs)

---

## 0. Wireframe Legend & Conventions

### 0.1 Symbol Legend

| Symbol | Meaning |
|---|---|
| `┌─┐ │ └─┘` | Container / panel boundary |
| `═══` | Header / strong divider |
| `───` | Subdivider |
| `[ نص ]` | Button (primary or secondary) |
| `[ ✓ نص ]` | Checked / selected state |
| `[ 📷 ]` | Icon button |
| `( ◉ )` | Radio / selected option |
| `( ○ )` | Radio / unselected |
| `[░░░░░]` | Progress bar / loading state |
| `▼` | Dropdown indicator |
| `«` `»` | Pagination / step navigation (RTL: » = newer/forward) |
| `⚠` `🔴` `🟢` `✅` | Status indicators |
| `*` | Required field |

### 0.2 RTL Layout Convention

Every wireframe is drawn **as the user would see it in Arabic**:
- The **right edge** is where the eye lands first
- Primary navigation lives on the **right**
- Primary action buttons sit on the **bottom-right** of forms
- "Next/Forward" arrows point **left** (←)
- "Back" arrows point **right** (→)

### 0.3 Spacing & Sizing Tokens (Used in Specs)

| Token | Tablet | Mobile | Desktop |
|---|---|---|---|
| `space-xs` | 4px | 4px | 4px |
| `space-sm` | 8px | 8px | 8px |
| `space-md` | 16px | 12px | 16px |
| `space-lg` | 24px | 16px | 24px |
| `space-xl` | 32px | 24px | 32px |
| `target-min` | 56px | 48px | 36px |
| `target-primary` | 64px | 56px | 40px |

### 0.4 Color Semantics (Universal)

| Token | Hex (suggested) | Use |
|---|---|---|
| `brand-primary` | `#C8102E` (Wahsh red) | Primary CTAs, active states |
| `success` | `#1B873F` | Confirmed, matched, on-time |
| `warning` | `#E8A317` | Near-expiry, partial, attention |
| `danger` | `#D52B1E` | Mismatch, dispute, late |
| `info` | `#1E6FCC` | Informational, in-progress |
| `neutral-900` | `#1A1A1A` | Primary text |
| `neutral-600` | `#5C5C5C` | Secondary text |
| `neutral-200` | `#E8E8E8` | Borders, dividers |
| `surface` | `#FFFFFF` | Cards, panels |
| `surface-alt` | `#F7F7F8` | Page background |

---

## 1. Design Patterns Reference

These patterns are referenced across multiple screens. Define once, apply consistently.

### Pattern P-01: RTL Split-View (Tablet)

```
┌────────────────────────────────────────────────────────────┐
│                       Header (Top)                         │
├──────────────────────┬─────────────────────────────────────┤
│                      │                                     │
│  Detail / Action     │  Source / List (RIGHT = primary)    │
│  (LEFT)              │                                     │
│  40-30%              │  60-70%                             │
│                      │                                     │
│                      │                                     │
├──────────────────────┴─────────────────────────────────────┤
│              Persistent Action Bar (Bottom)                │
└────────────────────────────────────────────────────────────┘
```

**Use when:** any task with a list + detail relationship (catalog + basket, items + edit, employees + detail).

**Why right-side list:** Arabic readers scan right-first. The list is the working surface; the detail panel responds to selection.

---

### Pattern P-02: Bottom Sheet Action (Mobile)

```
       ┌─────────────────────┐
       │       Content       │
       │       (dimmed)      │
       │                     │
       ├─────────────────────┤
       │  ━━━ (drag handle)  │
       │                     │
       │   عنوان الإجراء    │
       │                     │
       │   نص توضيحي         │
       │                     │
       │   [   إجراء أساسي ] │ ← thumb-zone right
       │   [   إلغاء       ] │
       └─────────────────────┘
```

**Use when:** any modal action on mobile. Never use centered alert dialogs — they break thumb ergonomics in RTL.

---

### Pattern P-03: Status Pill (Universal)

```
🟢 [ في الطريق ]   ← color + icon + label
✅ [ تم التسليم ]
🔴 [ متنازع عليه ]
🟡 [ معلق      ]
⚪ [ تم الإغلاق ]
```

**Specs:**
- Border-radius: 999px (full pill)
- Padding: 4px 12px
- Font: 14px tablet/desktop, 13px mobile, weight 500
- Always pair color with icon (color-blind safety)
- Never abbreviate the label — always full word

---

### Pattern P-04: RTL Timeline

Horizontal timeline reads **right-to-left** (newest → leftmost on completed steps).

```
كل خطوة → ✅ → 🟢 (current) → ⚪ → ⚪
الأقدم                            الأحدث
(يمين)                           (يسار)
```

Wait — this needs to flip. In RTL, the "first" step in time reads on the right (where reading starts), and progress moves LEFT toward "next".

```
RIGHT (oldest, completed)              LEFT (newest, pending)
   ✅ ── ✅ ── ✅ ── 🟢 ── ⚪ ── ⚪ ── ⚪ ── ⚪
   1     2     3     4     5     6     7     8
```

Each node on tap expands a panel below showing actor, time, location, evidence.

---

### Pattern P-05: Scan-First Input Field

```
┌────────────────────────────────────────┐
│  📷 امسح الباركود                      │   ← primary CTA
│                                        │
│  ─── أو ───                            │
│                                        │
│  🔢 أدخل الكود يدويًا                  │   ← secondary
└────────────────────────────────────────┘
```

**Use when:** any item identification step. Camera scan is always primary; manual entry is the fallback, not the equal option.

---

### Pattern P-06: Quantity Stepper (Touch-Optimized)

```
┌────────────────────────────────────┐
│   [  −  ]    [  50  ]    [  +  ]   │
│   60×60      60×60       60×60     │
└────────────────────────────────────┘
```

**Specs:**
- Buttons ≥60px on tablet (gloves)
- Long-press on `+`/`−` accelerates (×5, then ×10)
- Tap on the number opens numeric keypad for direct entry
- Validation runs on blur, not keystroke

---

### Pattern P-07: Discrepancy Row

```
┌──────────────────────────────────────────────────────┐
│ 🔴 جبن شيدر شرائح          المتوقع: 30   المستلم: 28 │
│   ⚠ ناقص 2 وحدة                                     │
│   [📷 صورة]  [🎤 ملاحظة صوتية]  [توثيق ←]          │
└──────────────────────────────────────────────────────┘
```

**Behavior:**
- Tap on row → expands to evidence capture
- Cannot proceed past receiving until each red row has at least one piece of evidence
- Voice note transcribes locally (Arabic STT) for searchability

---

### Pattern P-08: Empty State

```
┌────────────────────────────────────┐
│                                    │
│           [ illustration ]         │
│                                    │
│       لا توجد طلبات حاليًا       │
│                                    │
│   كل الطلبات تمت معالجتها — تمام!  │
│                                    │
│      [ إنشاء طلب جديد + ]          │
│                                    │
└────────────────────────────────────┘
```

**Rule:** every empty state has (1) reassuring message, (2) clear next action. Never just "لا يوجد بيانات".

---

### Pattern P-09: Confirmation (Destructive)

```
       ┌─────────────────────────────┐
       │ ⚠ تأكيد رفض الشحنة          │
       │                             │
       │ سيتم إرجاع الشحنة بالكامل  │
       │ وإشعار المصنع. هذا الإجراء │
       │ لا يمكن التراجع عنه.       │
       │                             │
       │ السبب (مطلوب):              │
       │ ┌─────────────────────────┐ │
       │ │                         │ │
       │ └─────────────────────────┘ │
       │                             │
       │ [ إلغاء ]    [ رفض الشحنة ] │
       │              (red, primary) │
       └─────────────────────────────┘
```

**Rule:** destructive confirmations require typed reason; the destructive button uses `danger` color and stays in primary thumb-zone position so the action is intentional, not accidental (the reason field is the friction).

---

## 2. Tablet Wireframes (Primary Operational Surface)

> Tablet target: iPad 10.9" / Samsung Tab A 10.5" — 1024×768 to 1280×800 — landscape primary
> Touch targets: ≥56px
> Typography: 16px body, 24px numerals, 28px headings

---

### T-01 — Login / PIN Sign-In (Tablet)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                       [شعار الوحش]                          │
│                                                              │
│                  مرحبًا بك في نظام الوحش                    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │                                                    │     │
│  │         اختر حسابك (الفرع: مصر الجديدة)            │     │
│  │                                                    │     │
│  │    [👤]      [👤]      [👤]      [👤]              │     │
│  │   منى       أحمد      كريم     [+ آخر]            │     │
│  │                                                    │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│              ─── اختيار: منى محمود ───                      │
│                                                              │
│         أدخلي رقم PIN السري                                  │
│       ┌───┐ ┌───┐ ┌───┐ ┌───┐                                │
│       │ • │ │ • │ │   │ │   │                                │
│       └───┘ └───┘ └───┘ └───┘                                │
│                                                              │
│            [1] [2] [3]                                       │
│            [4] [5] [6]                                       │
│            [7] [8] [9]                                       │
│            [⌫] [0] [✓]                                      │
│                                                              │
│                                                              │
│   [نسيت PIN؟]                       [تسجيل دخول مختلف]      │
└──────────────────────────────────────────────────────────────┘
```

**Purpose:** Fast shift-based sign-in. Tablets are shared; users select their face/avatar then PIN — far faster than typing email + password each shift.

**Key UX decisions:**
- **Avatar grid** of recent users on this device (last 5)
- **PIN over password**: 4-digit PIN is enough security paired with biometric on initial enrollment
- **Numeric keypad on screen**, not OS keyboard — bigger, faster, no accidental email keyboard
- **Branch identifier visible**: prevents wrong-branch login (a common error)

**States:**
- Empty (first launch): full email + password, biometric enrollment
- Recent users (default): avatar grid + PIN
- Wrong PIN: shake animation, "PIN غير صحيح — حاولي مرة أخرى" (3 tries → admin unlock required)

**Touch targets:** PIN keys 80×80px (over-sized for wet/gloved hands).

---

### T-02 — Home / Dashboard (Branch Manager — Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🔔 (3)   [الفرع: مصر الجديدة ▼]    منى محمود    [⚙ إعدادات] │ Top bar
├──┬──────────────────────────────────────────────────────────────────┤
│🏠│  الرئيسية   ‹  مصر الجديدة                                       │ Breadcrumb
│  │                                                                  │
│📦│  ┌──────────────────────────────────────────────────────────┐   │
│  │  │ 🔴  شحنة وصلت — في انتظار الاستلام                       │   │
│📋│  │     من المصنع المركزي · #2847 · منذ 4 دقائق              │   │
│  │  │                                  [استلم الآن ←]          │   │
│🚚│  └──────────────────────────────────────────────────────────┘   │
│  │                                                                  │
│📥│  مهامك اليوم                                                     │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│🏢│  │  📋 طلبات   │ │ 📥 استلام   │ │ ⏰ ورديات  │                │
│  │  │             │ │             │ │             │                │
│👥│  │     2       │ │     1       │ │     6       │                │
│  │  │  معلقة      │ │  وارد       │ │  حاضرون     │                │
│💰│  │ [مراجعة ←] │ │ [استلم ←]   │ │ [تفقد ←]   │                │
│  │  └─────────────┘ └─────────────┘ └─────────────┘                │
│  │                                                                  │
│  │  المخزون — تنبيهات                                               │
│  │  ┌────────────────────────────────────────────────────────┐     │
│  │  │ ⚠ 4 أصناف قاربت الانتهاء (خلال 3 أيام)               │     │
│  │  │ ⚠ 2 أصناف تحت نقطة إعادة الطلب                       │     │
│  │  │ ✅ كل المنتجات بدرجة الحرارة المطلوبة                  │     │
│  │  │                                  [عرض كل التنبيهات ←] │     │
│  │  └────────────────────────────────────────────────────────┘     │
│  │                                                                  │
│  │  أداء الأسبوع                                                   │
│  │  ┌────────────────┬────────────────┬─────────────────────┐      │
│  │  │ تكلفة الطعام % │  الهدر %       │  استلام في الموعد   │      │
│  │  │     28.4%      │     2.1%       │      96%            │      │
│  │  │  ▼ 0.6 ✅      │  ▲ 0.3 ⚠       │   ▲ 4 ✅             │      │
│  │  └────────────────┴────────────────┴─────────────────────┘      │
│  │                                                                  │
├──┴──────────────────────────────────────────────────────────────────┤
│  [+ طلب جديد ]      [🔍 بحث ]      [📷 مسح سريع ]                   │ Action bar
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Mona opens her tablet — within 2 seconds she sees what needs her attention right now (top alert), then her tasks, then context.

**Layout decisions:**
- **Right-edge nav rail** with icon+label for the 8 modules — always visible, always one tap
- **Top alert area** for P0 events (incoming shipment, dispute, urgent approval) — uses red banner style only when truly urgent
- **3-card task summary** — count + label + CTA. Cards are tap targets, not just numbers
- **Bottom action bar** persistent: "طلب جديد" is the most-used action, lives in thumb zone

**RTL specifics:**
- Nav rail on the **right** (not left)
- Cards align right-to-left
- KPI deltas (▲▼) — green-up is good for recovery metrics, but for cost % green-down is good. **Always pair with ✅/⚠ icon**, not just arrow direction.

**Personalization per role:**
- Branch Manager: this layout (operations-forward)
- Factory Manager: dispatch board takes top slot
- Driver: never sees this — they see route directly
- Admin: executive KPI grid replaces task cards

**Empty state:** if no alerts/tasks, hero card shows "كل شيء على ما يرام ✅ — لا يوجد ما يحتاج انتباهك الآن"

---

### T-03 — Inventory Live View (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🔔  المخزون — جرد حي · مصر الجديدة          منى محمود    [⚙]      │
├──┬──────────────────────────────────────────────────────────────────┤
│🏠│  الرئيسية ‹ المخزون                            [📷 مسح] [+ صنف] │
│  │  ───────────────────────────────────────────────────────────────│
│📦│                                                                  │
│  │  [🔍 ابحث عن صنف...                                          ]  │
│📋│                                                                  │
│  │  [الكل] [اللحوم] [الخضروات] [المخبوزات] [الصلصات] [التغليف]     │ Filter chips
│🚚│           ▼ معبأ                                                 │
│  │                                                                  │
│📥│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│  │  │   🥩    │ │   🥩    │ │   🧀    │ │   🥖    │                │
│🏢│  │         │ │         │ │         │ │         │                │
│  │  │بقر مفروم │ │دجاج صدور│ │جبن شيدر │ │خبز برجر │                │
│👥│  │  200جم  │ │  معلب   │ │ شرائح   │ │ متوسط   │                │
│  │  │         │ │         │ │         │ │         │                │
│💰│  │ المخزون │ │ المخزون │ │ المخزون │ │ المخزون │                │
│  │  │  47     │ │  120    │ │  18 ⚠   │ │  240    │                │
│  │  │ صلاحية: │ │ صلاحية: │ │ صلاحية: │ │ صلاحية: │                │
│  │  │ 5 أيام  │ │ 12 يوم  │ │ 2 يوم 🔴│ │ 4 أيام  │                │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘                │
│  │                                                                  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│  │  │   🍅    │ │   🥬    │ │   🧅    │ │   🥒    │                │
│  │  │طماطم    │ │خس روماني│ │بصل أحمر │ │خيار     │                │
│  │  │  ...    │ │  ...    │ │  ...    │ │  ...    │                │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘                │
│  │                                                                  │
├──┴──────────────────────────────────────────────────────────────────┤
│  📊 إحصائيات: 84 صنف · 4 منخفض · 6 قارب الانتهاء                    │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** see everything in stock at a glance — image-led, expiry-aware, immediately scannable.

**Card design (per item):**
- Image (60% of card height) — recognition over recall
- Item name + size — name in 16px bold, size in 13px
- Quantity number — 28px tabular, weight 600
- Expiry indicator — colored chip; 🔴 ≤2 days, 🟠 3–7 days, 🟢 >7 days
- Tap → opens item detail (T-04)
- Long-press → quick actions (adjust qty, mark waste, transfer)

**Filter behavior:**
- Chips sticky on scroll
- Multi-select for "ناقص" + "قارب الانتهاء" combined view
- Active filter shows count: "اللحوم (12)"

**Density:** 4-column grid on landscape iPad, 3-column on smaller tablets. Each card 220×260px on 10.9" iPad.

**Bottom strip:** live counts — passive context, not interactive.

**Scan FAB:** top-right (RTL primary corner) — tapping opens camera in continuous-scan mode for quick lookups.

---

### T-04 — Item Detail Card (Tablet — Drawer/Modal)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ✕ إغلاق                                              [⚙ إجراءات ▼] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    جبن شيدر شرائح                              │
│  │                 │    SKU: WSH-CHE-001                            │
│  │     [صورة]      │                                                │
│  │                 │    ┌────────────────────────────────────┐     │
│  │                 │    │  🔴  المخزون منخفض — يحتاج طلب    │     │
│  │                 │    │  المخزون: 18  ·  نقطة الطلب: 25    │     │
│  └─────────────────┘    └────────────────────────────────────┘     │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  المعلومات الأساسية                                                 │
│  ┌────────────────────────────┬──────────────────────────────┐     │
│  │ التصنيف     │ ألبان         │ المورد الرئيسي  │ ألبان النيل │     │
│  │ الوحدة      │ علبة (24 شريحة)│ السعر/الوحدة    │ 145 ج.م    │     │
│  │ الموقع      │ ثلاجة B-3     │ آخر تحديث       │ منذ 12 د   │     │
│  └────────────────────────────┴──────────────────────────────┘     │
│                                                                     │
│  الكميات والصلاحية                                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  الدفعة #4471 (وصلت 24/04)                                │    │
│  │   12 علبة · ينتهي خلال 2 يوم 🔴                           │    │
│  │  الدفعة #4502 (وصلت 26/04)                                │    │
│  │   6 علب · ينتهي خلال 9 أيام 🟢                            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  آخر الحركات                                                        │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ 28/04 14:32  استهلاك مطبخ      −3   كريم محمود            │    │
│  │ 28/04 09:15  استهلاك مطبخ      −5   أحمد علي              │    │
│  │ 26/04 11:00  استلام شحنة      +20  منى محمود              │    │
│  │ 25/04 13:45  هدر / تالف         −2   كريم محمود            │    │
│  │                              [عرض السجل الكامل ←]          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  [ إضافة لطلب جديد ]   [ تعديل المخزون ]   [ تسجيل هدر ]           │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** answer every question Mona has about an item in one screen.

**Information hierarchy:**
1. Image + name — recognition
2. Status banner — urgent context (low/expiring)
3. Specs grid — facts
4. Batch breakdown — **food-specific, critical**: separates inventory by FIFO batch with per-batch expiry
5. Movement history — recent activity, who did what
6. Action bar — what to do about it

**Why batch breakdown matters:** for food, "18 units" hides the truth — if 12 expire tomorrow and 6 in 9 days, the urgent action is to use the old batch first. Generic ERPs collapse this; Wahsh shows it.

**Action priority (right to left in RTL bottom bar):**
1. Primary: "إضافة لطلب جديد" (most likely action when stock is low)
2. Secondary: "تعديل المخزون" (manual adjustment — requires reason)
3. Tertiary: "تسجيل هدر" (waste — requires photo + reason)

---

### T-05 — New Request: Template Selection (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ✕                طلب جديد للمصنع                          الخطوة 1/3│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                  كيف تريدين بدء الطلب؟                             │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ 🔄  نفس الطلب الأسبوع الماضي                              │    │
│  │     الأحد 21/04 · 24 صنف · أُرسل في 6:35 ص                │    │
│  │                                          [اختيار ←]        │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ 📋  قالب: الطلب اليومي الصباحي                            │    │
│  │     14 صنف أساسي · يستخدم 5 مرات أسبوعيًا                 │    │
│  │                                          [اختيار ←]        │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ 📋  قالب: نهاية الأسبوع                                    │    │
│  │     32 صنف · للاستعداد للجمعة والسبت                       │    │
│  │                                          [اختيار ←]        │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ─────────────── أو ───────────────                                 │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ ➕  ابدأ من الصفر                                           │    │
│  │     اختاري الأصناف من الكتالوج                             │    │
│  │                                          [بدء ←]           │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ 📋  انسخي من فرع آخر                                        │    │
│  │     استلهمي من طلب فرع مشابه                                │    │
│  │                                          [اختيار ←]        │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ [ → السابق ]                                  [إلغاء]              │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** **Recognition over recall.** Mona doesn't need to remember what she ordered last week — the system shows her.

**Why this is the most important screen in the request flow:**
- 80% of requests are repetitions. Optimizing this saves 80% of all data entry across the system.
- "نفس الطلب الأسبوع الماضي" is the killer feature — single tap → step 3 (review).

**Step indicator (top right):** "الخطوة 1/3" — RTL shows progress with a tiny progress bar.

**Card hierarchy:**
- Recent (last week) — most likely choice, top
- Saved templates — common patterns
- New from scratch — escape hatch
- Copy from peer branch — collaborative

---

### T-06 — New Request: Catalog + Basket (Tablet, Split-View)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ✕  طلب جديد ‹ بناء الطلب                                الخطوة 2/3 │
├──────────────────────────────────┬──────────────────────────────────┤
│   كتالوج المصنع                  │    سلة الطلب (12)        [مسح]  │
│   ────────────────                │   ────────────────                │
│  [🔍 ابحث...           ]         │                                  │
│                                  │   اللحوم                          │
│  [اللحوم] [الخضروات] [الألبان]   │   ┌──────────────────────────┐    │
│  [المخبوزات] [الصلصات] [أخرى]    │   │ 🥩 بقر مفروم 200جم       │    │
│                                  │   │ [−] [ 50 ] [+] علبة      │    │
│  ┌─────────────┐┌─────────────┐  │   │                  [✕]     │    │
│  │  🥩         ││  🥩         │  │   └──────────────────────────┘    │
│  │ بقر مفروم   ││ بقر مفروم   │  │   ┌──────────────────────────┐    │
│  │  200جم      ││  150جم      │  │   │ 🥩 دجاج صدور             │    │
│  │             ││             │  │   │ [−] [ 20 ] [+] كجم       │    │
│  │ [+ أضف]     ││ [+ أضف]     │  │   │                  [✕]     │    │
│  │   ✓ مضاف    ││             │  │   └──────────────────────────┘    │
│  └─────────────┘└─────────────┘  │                                  │
│                                  │   الألبان                         │
│  ┌─────────────┐┌─────────────┐  │   ┌──────────────────────────┐    │
│  │  🥩         ││  🐟         │  │   │ 🧀 جبن شيدر شرائح        │    │
│  │ دجاج صدور   ││ سمك         │  │   │ [−] [ 30 ] [+] علبة      │    │
│  │  معلب       ││  فيليه      │  │   │                  [✕]     │    │
│  │             ││             │  │   └──────────────────────────┘    │
│  │   ✓ مضاف    ││ [+ أضف]     │  │                                  │
│  └─────────────┘└─────────────┘  │   ... 9 أصناف أخرى ▼              │
│                                  │                                  │
│                                  │   ─────────────────────────       │
│                                  │   إجمالي: 12 صنف · 240 وحدة      │
│                                  │   تكلفة تقديرية: 4,820 ج.م       │
│                                  │                                  │
├──────────────────────────────────┴──────────────────────────────────┤
│ [ → السابق ]                              [التالي: مراجعة ←]       │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** This is the heart of P-01 split-view. Catalog on the right (browse), basket on the left (working list).

**Why right is catalog:** Mona's eye lands right first. She needs to *find* items first; the basket is the destination.

**Card states:**
- Default: `[+ أضف]` button
- Added: `✓ مضاف` chip + qty stepper appears in basket
- Out of stock: card grays out + label "غير متاح حاليًا"

**Quantity behavior:**
- Default qty when added = last-ordered qty (from history)
- Stepper in basket allows immediate adjustment
- `[✕]` removes from basket

**Basket sticky behavior:**
- Total bar always visible at bottom of basket
- Cost is **estimated** based on last-known prices — labeled "تقديرية" so users know it's not final

**Search:**
- Searches across name, SKU, category
- Recent searches shown when input is focused
- Returns 0 → suggests creating an inquiry to the factory

---

### T-07 — New Request: Review & Submit (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ✕  طلب جديد ‹ مراجعة وإرسال                            الخطوة 3/3 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ✅ راجعي الطلب قبل الإرسال                                        │
│                                                                     │
│  من:    فرع مصر الجديدة (منى محمود)                                 │
│  إلى:   المصنع المركزي                                              │
│  أولوية: ( ◉ عادي )  ( ○ عاجل )                                    │
│  وقت التسليم المطلوب: ▼ غدًا 6:00 ص                                │
│  ملاحظات: ┌──────────────────────────────────────────────────┐     │
│           │ يفضل إرسال جبن شيدر طازج (الدفعة الأقدم لدينا   │     │
│           │ تنتهي غدًا)                                       │     │
│           └──────────────────────────────────────────────────┘     │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  الأصناف (12)                                            [✏ تعديل] │
│                                                                     │
│  اللحوم (3)                                                        │
│   • 🥩 بقر مفروم 200جم                              50 علبة         │
│   • 🥩 دجاج صدور معلب                               20 كجم          │
│   • 🐟 سمك فيليه                                    8 كجم           │
│                                                                     │
│  الألبان (2)                                                        │
│   • 🧀 جبن شيدر شرائح                              30 علبة          │
│   • 🥛 لبن كامل الدسم                              15 لتر           │
│                                                                     │
│  الخضروات (4) ...                                          [توسيع ▼]│
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  📌 سيُرسل هذا الطلب لـ: أحمد محمود (مدير المصنع)                  │
│  ⏰ الوقت المتوقع للموافقة: خلال 30 دقيقة                          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ [ → السابق ]    [حفظ كقالب]              [إرسال للموافقة ✓]        │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Last chance to verify. The "Send" button is a one-way door — make this moment confident.

**Critical UX:**
- **Show who will receive the request** + their typical response time → builds trust ("I know it'll be looked at soon")
- **Editable summary fields** without going back: priority, time, notes
- **Save as template** for repeated use
- **Submit button** uses success-green; primary thumb-zone position (bottom-right in RTL)

**Validation before submit:**
- Quantity sanity (no qty = 0, no qty > soft cap)
- Required: at least 1 item
- Date sanity: not in the past

**Optimistic UX:** on submit, immediately show success animation + status timeline starting at "تم الطلب 🟢".

---

### T-08 — Pick List (Factory — Tablet, CRITICAL)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🔔  تحضير الطلب #2847                            عمر سعد · المخزن │
├─────────────────────────────────────────────────────────────────────┤
│  الفرع: مصر الجديدة (منى محمود)        الأولوية: 🟡 عادي           │
│  الموعد: 6:00 ص غدًا                    الوقت المتاح: 14 س        │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  التقدم:  [████████████████░░░░░░░] 12/16 صنف                     │
│                                                                     │
│                                                                     │
│  ┌─ اللحوم ─────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │ ✅ بقر مفروم 200جم            50 / 50  ✓                     │   │
│  │ ✅ دجاج صدور معلب             20 / 20  ✓ (كجم)               │   │
│  │ 🔄 سمك فيليه                  6 / 8   ⚠ ناقص 2              │   │
│  │     ┌─ تفاصيل ────────────────────────────────────┐         │   │
│  │     │ المتاح في المخزن: 6 كجم فقط                 │         │   │
│  │     │ [ ⚠ تأكيد كمية أقل ]  [ ⏸ إيقاف للمراجعة ] │         │   │
│  │     └──────────────────────────────────────────────┘         │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─ الألبان ────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │ ✅ جبن شيدر شرائح             30 / 30  ✓                    │   │
│  │ ✅ لبن كامل الدسم             15 / 15  ✓                    │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─ الخضروات ──────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │ ⬜ طماطم                       0 / 25                        │   │
│  │ ⬜ خس                          0 / 10                        │   │
│  │ ⬜ بصل                         0 / 8                         │   │
│  │ ⬜ خيار                        0 / 12                        │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ [📷 امسح الصنف التالي]              [إيقاف]    [التالي: تحميل ←]   │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Omar (warehouse worker) picks items for shipment. The screen guides him; he should never have to think about *what's next*.

**Interaction flow:**
1. Big primary button: `[📷 امسح الصنف التالي]` opens camera
2. Camera scans barcode → matches against pick list
3. Quantity stepper appears in modal (P-06)
4. Worker confirms → item flips to ✅ green
5. Repeat until list complete

**Out-of-stock handling (the 🔄 row above):**
- System detects shortage on scan
- Inline panel offers: confirm partial, or pause for manager review
- Pausing notifies factory manager via mobile
- Cannot complete pick list with unresolved 🔄 rows

**Quantity validation:**
- Scanning the barcode auto-detects unit (kg vs pcs)
- Stepper respects unit increments (0.5 kg / 1 pcs)
- Soft-cap warning if pick > requested (e.g., "تم تحضير 52 — المطلوب 50. تأكيد؟")

**Audit trail per scan:**
- timestamp, worker, item, scanned vs entered qty, batch number — all written immediately

**Cannot proceed to dispatch until:**
- Every line resolved (✅ matched, ⚠ confirmed-partial, or ⏸ paused-resolved)
- Mandatory: photo of staged shipment area before dispatch

---

### T-09 — Assign Driver (Factory — Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ✕  تعيين سائق ‹ الطلب #2847                                       │
├─────────────────────────────────────────────────────────────────────┤
│  الوجهة: فرع مصر الجديدة                                            │
│  حجم الشحنة: 16 صنف · ~120 كجم · يحتاج تبريد                       │
│  المسافة: 24 كم · الوقت المقدر: 45 دقيقة                            │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  السائقون المتاحون                                                  │
│                                                                     │
│  ( ◉ ) محمود حسن                                       ⭐ 98%      │
│         🚚 مبرد · سيارة #B-12 · متاح الآن                           │
│         ✅ يعرف المنطقة (12 توصيلة لمصر الجديدة)                    │
│         📍 على بُعد 2 كم من المصنع                                   │
│                                                                     │
│  ( ○ ) سامي إبراهيم                                   ⭐ 92%      │
│         🚚 مبرد · سيارة #B-08 · يعود من توصيلة (15 د)              │
│         ✅ يعرف المنطقة                                              │
│                                                                     │
│  ( ○ ) كريم عبدالله                                   ⭐ 85%      │
│         🚛 عادي (بدون تبريد) · ⚠ غير مناسب لهذه الشحنة              │
│         📍 على بُعد 8 كم                                             │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  الموعد المقترح للانطلاق:  ( ◉ الآن )  ( ○ في وقت محدد )           │
│                                                                     │
│  ملاحظات للسائق:                                                    │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ تجنب طريق صلاح سالم — هناك أعمال إصلاح حتى الساعة 5 ص       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ [إلغاء]                                       [تعيين والإرسال ✓]   │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** dispatcher picks the right driver in seconds, with full context.

**Smart sorting:** drivers ranked by:
1. Vehicle type match (refrigerated needed → refrigerated drivers first)
2. Region familiarity (drivers who've delivered here before)
3. Performance score
4. Proximity to factory
5. Current availability

**Visual disqualification:** Karim above shows ⚠ because his vehicle isn't refrigerated. Selectable but warning prevents accidental wrong-pick.

**On confirm:**
- Driver's mobile app receives push within 3 seconds
- Status flips to "تم التحميل" → "في الطريق" upon driver tap-confirm
- Branch tablet (Mona's) gets a heads-up notification

---

### T-10 — Receive Shipment (Branch — Tablet, CRITICAL)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🔔  استلام الشحنة #2847                          منى محمود        │
├─────────────────────────────────────────────────────────────────────┤
│  من: المصنع المركزي         السائق: محمود حسن (تأكيد OTP: 4471)   │
│  وصلت: الآن (8:24 ص)        الموعد المقرر: 8:00 ص (تأخر 24د)      │
│                                                                     │
│  التقدم:  [████████████████░░░░] 14/16 تم فحصها                   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 🔍 امسحي الصندوق التالي                                     │   │
│  │                                                              │   │
│  │              [ 📷  مسح ]                                    │   │
│  │                                                              │   │
│  │                — أو —                                        │   │
│  │                                                              │   │
│  │              [أدخل الكود يدويًا]                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  الأصناف                                                            │
│                                                                     │
│  ✅ بقر مفروم 200جم            متوقع: 50    مستلم: 50              │
│  ✅ دجاج صدور معلب              متوقع: 20    مستلم: 20              │
│  🔴 جبن شيدر شرائح              متوقع: 30    مستلم: 28  ⚠ ناقص 2   │
│                                              [📷 صورة] [🎤] [توثيق]│
│  ✅ خبز برجر متوسط              متوقع: 100   مستلم: 100             │
│  🟠 بطاطس مجمدة                 متوقع: 15    مستلم: 14 (1 تالف)    │
│                                              [📷 صورة] [🎤] [توثيق]│
│  ✅ صلصة خاصة 1لتر              متوقع: 20    مستلم: 20              │
│  ⬜ طماطم                       متوقع: 25    لم تُفحص بعد           │
│  ⬜ خس روماني                   متوقع: 10    لم تُفحص بعد           │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ [📷 مسح التالي]   [📋 رفض الشحنة]   [↪]   [التالي: التوقيع ←]      │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** This is **the most critical screen in the system**. The receiving moment is where trust is built or broken.

**Layout decisions:**
- **Big scan CTA at top** — primary action, takes 30% of vertical space
- **Auto-loaded expected list** when driver geo-arrives (no "open shipment" friction)
- **Discrepancies highlighted in real-time** — red row for shortage, orange for damage, yellow for excess
- **Per-row evidence requirement** — cannot proceed without [📷] or [🎤] for any flagged row

**Scan flow:**
1. Tap [📷 مسح] → camera opens full-screen
2. Scan barcode → quantity stepper appears (P-06) pre-filled with expected qty
3. Worker counts physically and confirms or adjusts
4. Match → ✅ green check, line flips to "مستلم: X"
5. Mismatch → 🔴 red banner appears immediately, evidence buttons activate

**Discrepancy behavior:**
- Tap on red row → opens evidence drawer (full-width modal)
- Drawer requires: type (ناقص/تالف/منتهي/زائد) + at least one photo OR voice note
- Cannot dismiss drawer without saving evidence
- Voice note auto-transcribes Arabic for searchability

**OTP confirmation (top bar):**
- 4-digit OTP shown to driver on his app, recited to receiver
- Receiver enters; mismatch blocks the receive flow
- Prevents fraudulent deliveries (someone else picking up shipment)

**Reject button (bottom):**
- Triggers P-09 destructive confirmation
- Requires manager approval if stock-critical
- Driver gets immediate notification, returns to factory with full shipment

---

### T-11 — Discrepancy Drawer (Tablet — Modal)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ✕                توثيق فرق — جبن شيدر شرائح                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  المتوقع: 30 علبة          المستلم: 28 علبة          الفرق: −2     │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  نوع الفرق *                                                        │
│                                                                     │
│  ( ◉ ناقص في العدد )  ( ○ تالف / مكسور )                            │
│  ( ○ منتهي الصلاحية )  ( ○ زائد عن المطلوب )                        │
│  ( ○ خطأ في الصنف )    ( ○ آخر )                                    │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  الإثبات * (مطلوب إثبات واحد على الأقل)                            │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   📷 صورة 1  │  │  ➕ إضافة    │  │              │              │
│  │              │  │              │  │              │              │
│  │  [thumbnail] │  │              │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │ 🎤 ملاحظة صوتية                                          │       │
│  │ "الصندوق رقم 4 وصل بعدد 4 علب فقط بدلًا من 6..."         │       │
│  │ (مدة 0:24)                              [▶ تشغيل] [✕]   │       │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ملاحظة كتابية (اختياري)                                           │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                                                          │       │
│  │                                                          │       │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  الإجراء                                                            │
│  ( ◉ قبول مع تحفظ — تسجيل الفرق )                                  │
│  ( ○ رفض هذا الصنف فقط )                                            │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ [إلغاء]                                       [حفظ التوثيق ✓]      │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** capture irrefutable evidence. This drawer is the difference between "his word vs hers" and "settled."

**Required vs optional:**
- Type: required
- Evidence (photo OR voice note): required (at least one)
- Written note: optional supplement
- Action: required (default to "accept with reservation" — most common)

**Voice note UX:**
- Hold-to-record on the [🎤] button (mobile metaphor familiar to all users)
- Auto-transcribed locally using Arabic STT
- Transcript searchable, audio retained as evidence

**Photo capture:**
- Camera opens full-screen with grid overlay (forces well-framed evidence)
- Up to 5 photos per discrepancy
- Each photo timestamped + GPS-stamped automatically (invisible to user, embedded in metadata)

**On save:**
- Drawer closes
- Row in T-10 stays red but now shows ✓ next to "توثيق" — meaning evidence captured
- Receive flow can proceed once all flagged rows have evidence

---

### T-12 — Signature & Final Confirmation (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ✕  استلام الشحنة #2847 ‹ التوقيع                          الخطوة 4│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ملخص الاستلام                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ الإجمالي: 16 صنف                                            │    │
│  │ ✅ مطابق:    14 صنف                                         │    │
│  │ 🔴 فروقات:   2 صنف (موثقة)                                  │    │
│  │ التكلفة المعدلة: 4,560 ج.م (بدلًا من 4,820)                │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  توقيع المستلم *                                                    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                             │    │
│  │                                                             │    │
│  │              ✍ وقّعي هنا بالإصبع                            │    │
│  │                                                             │    │
│  │                                                             │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                              [مسح وإعادة]          │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  توقيع السائق *                                                     │
│  محمود حسن وقّع على جهازه الساعة 8:23 ص ✅                         │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ✅ توقيع النظام (تلقائي)                                          │
│  📅 28/04/2026  ⏰ 8:31 ص  📍 30.0900° N, 31.3245° E              │
│  📱 جهاز: Tablet-Heliop-01                                          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ [→ السابق]                          [إقرار الاستلام والتأكيد ✓]    │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** ceremonial close-out that creates a tamper-proof receipt.

**Three signatures = bulletproof evidence:**
1. **Receiver signature** — captured here, visual confirmation of acknowledgement
2. **Driver signature** — already captured on his mobile when he tapped "تسليم"
3. **System signature** — automatic timestamp + GPS + device fingerprint, immutable

**Receiver signature pad:**
- Full-width canvas, 200px height
- Smooth ink rendering with pressure (where supported)
- "Clear & redo" if not satisfied
- Cannot proceed without signature

**Adjusted cost shown:**
- Auto-calculated based on confirmed quantities (not requested)
- Builds trust: "I'm being charged for what I actually got"

**On final tap:**
- Status flips: تم التسليم → تم التأكيد
- Inventory auto-updates with confirmed quantities
- Notifications fire: factory manager, ops admin, finance
- Discrepancies auto-create dispute tickets if any
- Driver's mobile app updates to "رحلة منتهية"

---

### T-13 — Cycle Count / Periodic Inventory (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ✕  جرد دوري — الثلاجة B (الألبان)              منى + كريم          │
├─────────────────────────────────────────────────────────────────────┤
│  وضع الجرد المزدوج: شخصان يعدّان بشكل مستقل                         │
│  التقدم: 8 / 14 صنف                                                 │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  الصنف الحالي                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │      [صورة]                                                 │    │
│  │                                                             │    │
│  │      جبن شيدر شرائح                                         │    │
│  │      الموقع: ثلاجة B-3                                      │    │
│  │      المسجل في النظام: 18 علبة                              │    │
│  │                                                             │    │
│  │      عدّ منى:    [ 18 ]                                     │    │
│  │      عدّ كريم:    في انتظار...                              │    │
│  │                                                             │    │
│  │      [ تأكيد العدّ ]                                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  العدّ السابق (مطابق ✅)                                            │
│  • لبن كامل الدسم — 12 لتر (مطابق)                                 │
│  • زبادي طبيعي — 24 علبة (مطابق)                                   │
│                                                                     │
│  العدّ السابق (فرق ⚠)                                               │
│  • زبدة — النظام: 8، عدّ: 6 → فرق 2 (يحتاج مراجعة)                  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  [⏸ إيقاف]                                    [انتقل للصنف التالي] │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** **paired-count cycle inventory** — two people count independently, system reconciles. Reduces fraud and error.

**Why paired:**
- Single-person counts in F&B are notoriously unreliable (boredom, theft, miscounts)
- Paired counts catch both honest errors and dishonest under-reporting
- Both counters' identities + counts are recorded

**Behavior:**
- Both counters see current item simultaneously on shared tablet (or on two synced tablets)
- They count physically, then enter their number
- System hides the other person's count until both submit (no peer influence)
- Match → green ✅ → next item
- Mismatch → both recount → if still different, supervisor escalation

**Variance handling:**
- Differences logged with both counts
- If aggregate variance >threshold (e.g., 2%), full investigation triggered
- Inventory only updates after supervisor sign-off

---

### T-14 — Suppliers List (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🔔  الموردون                              أحمد محمود (المصنع)     │
├──┬──────────────────────────────────────────────────────────────────┤
│🏠│  المصنع ‹ الموردون                          [+ مورد جديد]       │
│  │  ───────────────────────────────────────────────────────────────│
│📦│                                                                  │
│  │  [🔍 ابحث عن مورد...                                          ] │
│📋│  [الكل] [نشط] [معلق] [اللحوم] [الألبان] [الخضروات]              │
│  │                                                                  │
│🚚│  ┌────────────────────────────────────────────────────────────┐ │
│  │  │ 🏢 ألبان النيل                            ⭐ 96% ✅       │ │
│📥│  │ التصنيف: ألبان · المنتجات: 24                              │ │
│  │  │ آخر طلب: قبل 3 أيام · المستحق: 12,400 ج.م                 │ │
│🏢│  │ ────────────────────────────────────────────────────────── │ │
│  │  │ في الموعد: 98%    الجودة: 95%    معدل النزاع: 0.4%       │ │
│👥│  │                                          [بطاقة المورد ←] │ │
│  │  └────────────────────────────────────────────────────────────┘ │
│💰│                                                                  │
│  │  ┌────────────────────────────────────────────────────────────┐ │
│  │  │ 🏢 مزارع الدلتا                           ⭐ 87% ✅       │ │
│  │  │ التصنيف: خضروات · المنتجات: 36                             │ │
│  │  │ آخر طلب: أمس · المستحق: 24,800 ج.م                        │ │
│  │  │ ────────────────────────────────────────────────────────── │ │
│  │  │ في الموعد: 92%    الجودة: 88%    معدل النزاع: 1.2%       │ │
│  │  │                                          [بطاقة المورد ←] │ │
│  │  └────────────────────────────────────────────────────────────┘ │
│  │                                                                  │
│  │  ┌────────────────────────────────────────────────────────────┐ │
│  │  │ 🏢 لحوم القاهرة                           ⭐ 72% ⚠       │ │
│  │  │ التصنيف: لحوم · المنتجات: 18                               │ │
│  │  │ آخر طلب: قبل أسبوع · المستحق: 0                            │ │
│  │  │ ────────────────────────────────────────────────────────── │ │
│  │  │ في الموعد: 68% ⚠   الجودة: 79%    معدل النزاع: 4.2% 🔴   │ │
│  │  │ ⚠ تنبيه: تأخر متكرر آخر شهر — يحتاج مراجعة العقد        │ │
│  │  │                                          [بطاقة المورد ←] │ │
│  │  └────────────────────────────────────────────────────────────┘ │
│  │                                                                  │
├──┴──────────────────────────────────────────────────────────────────┤
│  📊 إجمالي: 14 مورد · 12 نشط · 2 يحتاج مراجعة                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Ahmed sees supplier health at a glance — score, trend, outstanding amount, alerts.

**Score visualization:**
- Single composite score (weighted: 50% on-time, 35% quality, 15% dispute rate)
- Color-coded: green ≥90%, yellow 80–89%, red <80%
- Trend indicator (▲▼) vs last month

**Inline alerts** under cards highlight specific issues — "تأخر متكرر" — without making the user dig.

---

### T-15 — Audit Log View (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🔔  سجل التدقيق — الطلب #2847                                     │
├─────────────────────────────────────────────────────────────────────┤
│  [🔍 بحث في السجل...]   [التاريخ ▼] [الفاعل ▼]   [📥 تصدير]       │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 🕐 8:31 ص    📥 إقرار الاستلام                              │    │
│  │ منى محمود (مدير فرع — مصر الجديدة)                          │    │
│  │ Tablet-Heliop-01 · 30.09°N, 31.32°E                         │    │
│  │ 14 صنف مطابق · 2 صنف بفروقات موثقة                          │    │
│  │ توقيع رقمي: ✅                                              │    │
│  │                                              [عرض التفاصيل ▼]│    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 🕐 8:24 ص    🚚 وصول الشحنة                                 │    │
│  │ محمود حسن (سائق)                                            │    │
│  │ Mobile-Driver-12 · GPS auto: 30.09°N, 31.32°E              │    │
│  │ مدة الرحلة: 47 د (تأخر 24 د عن المتوقع)                    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 🕐 7:37 ص    🛣 انطلاق                                      │    │
│  │ محمود حسن (سائق)                                            │    │
│  │ من المصنع المركزي · GPS: 29.95°N, 30.92°E                   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 🕐 7:30 ص    📋 إكمال التحضير                               │    │
│  │ عمر سعد (مخزن)                                              │    │
│  │ Tablet-Factory-03                                           │    │
│  │ 16 صنف · سمك فيليه: تحضير جزئي (6 من 8) — موافقة المدير    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 🕐 6:48 ص    ✅ موافقة                                      │    │
│  │ أحمد محمود (مدير المصنع)                                    │    │
│  │ Mobile · بسرعة (3 ثواني من فتح الإشعار)                    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 🕐 6:35 ص    📝 إنشاء الطلب                                 │    │
│  │ منى محمود (مدير فرع — مصر الجديدة)                          │    │
│  │ Tablet-Heliop-01 · 16 صنف · من قالب الأسبوع                │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** complete provenance of every action on a record. Read-only, immutable, exportable.

**Each entry shows:**
- Timestamp (local + UTC tooltip on desktop)
- Action type with icon
- Actor (name + role)
- Device + GPS
- Quick context summary
- Expandable for full evidence (photos, signatures, notes)

**Filters** for compliance audits and dispute investigations.

---

## 3. Mobile Wireframes (Quick Execution Surface)

> Mobile target: 360–414px width — portrait primary
> Touch targets: ≥48px
> Typography: 15px body, 18px numerals, 22px headings

---

### M-01 — Mobile Home (Driver — Mahmoud)

```
┌─────────────────────────────┐
│ 🚚 محمود حسن       [⚙]      │
│ متاح للرحلات                │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │ 🔴 رحلة جديدة معينة    │ │
│ │                         │ │
│ │ من: المصنع المركزي     │ │
│ │ إلى: 3 فروع (مصر       │ │
│ │       الجديدة + 2)     │ │
│ │ موعد الانطلاق: الآن    │ │
│ │                         │ │
│ │ [ ابدأ الرحلة ←]        │ │
│ └─────────────────────────┘ │
│                             │
│                             │
│ ───── إحصاءاتك اليوم ─────  │
│                             │
│ ┌─────────┐ ┌─────────┐     │
│ │ التوصيل │ │ الوقت   │     │
│ │   3     │ │  4:24   │     │
│ │ مكتمل   │ │  ساعات  │     │
│ └─────────┘ └─────────┘     │
│                             │
│ ┌─────────┐ ┌─────────┐     │
│ │ الكفاءة │ │ الأخطاء │     │
│ │   98%   │ │   0     │     │
│ │  ⭐     │ │   ✅    │     │
│ └─────────┘ └─────────┘     │
│                             │
│                             │
├─────────────────────────────┤
│ 🏠   📦   🗺   🔔   👤      │
└─────────────────────────────┘
   home  ship maps alert prof
```

**Purpose:** Driver sees one thing — his next trip. Everything else is secondary.

**Single-task focus:** the new-trip card dominates. Dismissed only when user starts the trip.

**Bottom nav:** 5 icons, but 4 of them are rarely used. Driver lives in this home + the trip flow.

**Trust indicators:** stats below build self-image — "I'm a 98% efficiency driver" matters for retention.

---

### M-02 — Driver Trip Detail (Mobile)

```
┌─────────────────────────────┐
│ → عودة          الرحلة #389 │
├─────────────────────────────┤
│                             │
│ المحطة الحالية              │
│ ┌─────────────────────────┐ │
│ │ 🟢 المحطة 1 من 3        │ │
│ │                         │ │
│ │ 📍 فرع مصر الجديدة     │ │
│ │ شارع الطيران، أمام...  │ │
│ │                         │ │
│ │ المدير المستقبل:        │ │
│ │ 👤 منى محمود            │ │
│ │ 📞 +20-123-456-7890    │ │
│ │                         │ │
│ │ الوقت المقدر: 25 د     │ │
│ │ ─────────────────────── │ │
│ │ [ 🗺 افتح في الخريطة ] │ │
│ └─────────────────────────┘ │
│                             │
│ تقدمك                       │
│ ┌─────────────────────────┐ │
│ │ ●═══════○ ──────○ ──────○│ │
│ │ خرج     محطة 1 محطة 2  3│ │
│ └─────────────────────────┘ │
│                             │
│ المحطات التالية             │
│  ⚪ المحطة 2: فرع المعادي  │
│  ⚪ المحطة 3: فرع التجمع   │
│                             │
├─────────────────────────────┤
│   [ وصلت للموقع ✓ ]         │
└─────────────────────────────┘
```

**Purpose:** linear, simple. Driver knows where he is, where he's going, and what to tap.

**Key UX:**
- **Single primary action** at bottom: changes contextually ("ابدأ الرحلة" → "وصلت" → "تسليم" → "ابدأ التالية")
- **Click-to-call** the receiver — common pattern when driver is lost
- **One-tap to map** — opens Google Maps / Waze with Arabic directions
- **Visual progress** line at bottom: where am I in this trip

**Offline behavior:** entire screen works offline. Map opens last cached version + waze link if online.

---

### M-03 — Proof of Delivery Capture (Mobile)

```
┌─────────────────────────────┐
│ ✕  تسليم الشحنة            │
├─────────────────────────────┤
│ المحطة 1: فرع مصر الجديدة  │
│ ─────────────────────────── │
│                             │
│ الخطوة 1: صورة الشحنة *    │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │     [📷  التقط صورة]    │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ الخطوة 2: OTP من المستقبل   │
│ ─────────────────────────── │
│ اطلبي OTP من منى:           │
│                             │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐    │
│ │ 4 │ │ 4 │ │ 7 │ │   │    │
│ └───┘ └───┘ └───┘ └───┘    │
│                             │
│   [1] [2] [3]               │
│   [4] [5] [6]               │
│   [7] [8] [9]               │
│   [⌫] [0] [✓]              │
│                             │
│ الخطوة 3: توقيعي           │
│ ─────────────────────────── │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │    ✍ وقّع هنا          │ │
│ │                         │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                  [مسح]      │
│                             │
├─────────────────────────────┤
│ [ → السابق ]   [ تسليم ✓ ]  │
└─────────────────────────────┘
```

**Purpose:** capture irrefutable POD in one screen. Photo + OTP + driver signature.

**OTP exchange:**
- Mona's tablet shows 4-digit code
- Mahmoud asks her for it, types into his app
- Match → tablet flips into receive mode automatically
- Mismatch → 3 retries, then dispatcher escalation

**Why OTP not just signature:**
- Prevents fraud (someone in branch uniform tricking driver)
- Creates dual-confirmation: tablet generates, driver enters → cryptographic proof of mutual presence

**Offline:**
- Photo, OTP, signature all captured locally
- Sync when network returns
- Status remains "في الطريق" on dashboards until sync — but driver's app shows "تم محليًا — في انتظار المزامنة"

---

### M-04 — Quick Approval (Manager Mobile — Ahmed)

```
┌─────────────────────────────┐
│ 🔔 طلب موافقة جديد         │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │ من: فرع مصر الجديدة    │ │
│ │ بواسطة: منى محمود       │ │
│ │ منذ: 4 دقائق            │ │
│ │                         │ │
│ │ الأولوية: 🟡 عادي       │ │
│ │ ─────────────────────── │ │
│ │                         │ │
│ │ 16 صنف · ~120 كجم      │ │
│ │ تكلفة: 4,820 ج.م        │ │
│ │                         │ │
│ │ المطلوب التسليم:        │ │
│ │ غدًا 6:00 ص              │ │
│ │                         │ │
│ │ ملاحظات:                │ │
│ │ "يفضل إرسال جبن شيدر    │ │
│ │ طازج..."                │ │
│ │                         │ │
│ │ [عرض الأصناف ▼]         │ │
│ └─────────────────────────┘ │
│                             │
│                             │
│   اسحب لاتخاذ قرار:         │
│                             │
│  ←──────[ ✓ موافقة ]──────→ │
│  ← رفض                تعديل│
│                             │
├─────────────────────────────┤
│  [📞 اتصل بمنى] [💬 رسالة]   │
└─────────────────────────────┘
```

**Purpose:** Ahmed approves in <15s while walking the factory floor.

**Swipe interaction:**
- Swipe right (←) → approve (most common, fastest path)
- Swipe left (→) → reject (requires reason)
- Tap → expand to edit quantities

**Why swipe not buttons:** thumb-zone optimization. Buttons would force precise targeting; swipe is forgiving and fast.

**Communication shortcuts:** if Ahmed has a question, one-tap call or in-app chat with Mona — no phone-number-lookup friction.

**Approve flow:**
- Swipe right → confirmation toast "تمت الموافقة ✅"
- Auto-fires notification to Mona + factory dispatch
- Returns to Ahmed's home or queues next pending approval

**Reject flow:**
- Swipe left → opens reason picker (preset reasons + custom field)
- Common reasons: "نفاد المخزون مؤقتًا", "خطأ في الكميات", "أولوية أخرى"
- Branch gets immediate notification with reason

---

### M-05 — Mobile Branch Manager Home (Mona — On the Floor)

```
┌─────────────────────────────┐
│ 🏪 منى محمود   [الفرع ▼]   │
│ مصر الجديدة                 │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │ 🔴 شحنة وصلت!          │ │
│ │ المصنع المركزي · #2847 │ │
│ │ منذ دقيقتين             │ │
│ │ [ افتح للاستلام ←]      │ │
│ └─────────────────────────┘ │
│                             │
│ مهام تحتاج انتباهك          │
│ ─────────────────────────── │
│                             │
│ ┌─────────────────────────┐ │
│ │ ⚠ 4 أصناف قاربت        │ │
│ │   الانتهاء (3 أيام)     │ │
│ │                    [←]  │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 📋 طلب إجازة من كريم   │ │
│ │   3 أيام (أول مايو)     │ │
│ │   [موافقة] [رفض] [عرض] │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 📊 الحضور اليوم         │ │
│ │   18 / 22 موظف          │ │
│ │   2 متأخر · 2 إجازة    │ │
│ │                    [←]  │ │
│ └─────────────────────────┘ │
│                             │
│ ─────────────────────────── │
│   إجراءات سريعة             │
│                             │
│ [+ طلب جديد]  [📊 تقرير]    │
│                             │
├─────────────────────────────┤
│ 🏠   📦   📋   🔔   👤      │
└─────────────────────────────┘
```

**Purpose:** Mona is walking the floor — she needs quick situational awareness without sitting at the tablet.

**Information triage:**
- 🔴 P0 alert at top (action-required)
- 🟠 P1 mid section (attention)
- 🟢 Informational at bottom

**Inline actions:** small approvals (leave requests) handled directly without opening detail view — saves taps.

---

### M-06 — Employee Self-Service (Karim — Mobile)

```
┌─────────────────────────────┐
│ 👤 كريم محمود              │
│ طاهي · مصر الجديدة          │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │ ⏰ ورديتك القادمة      │ │
│ │                         │ │
│ │ غدًا 29/04              │ │
│ │ من: 8:00 ص             │ │
│ │ إلى: 4:00 م             │ │
│ │                         │ │
│ │ [📍 سجل الحضور]         │ │
│ └─────────────────────────┘ │
│                             │
│ القائمة الرئيسية            │
│ ─────────────────────────── │
│                             │
│ ┌─────────────────────────┐ │
│ │ 📅 جدولي                │ │
│ │ 22 ساعة هذا الأسبوع     │ │
│ │                    [←]  │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🏖 الإجازات             │ │
│ │ رصيد: 12 يوم            │ │
│ │ [+ طلب إجازة]           │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 💰 الراتب               │ │
│ │ آخر قسيمة: مارس 2026   │ │
│ │ [📥 تحميل]              │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 📚 التدريب              │ │
│ │ سلامة الغذاء (مكتمل ✅) │ │
│ │ HACCP (مكتمل ✅)        │ │
│ └─────────────────────────┘ │
│                             │
├─────────────────────────────┤
│ 🏠   📅   🏖   💰   👤      │
└─────────────────────────────┘
```

**Purpose:** Karim has 4 needs — clock in, see schedule, request leave, view payslip. Nothing else.

**Design discipline:**
- Only 4 modules visible (no inventory, no reports, no admin)
- Each card has one action
- Arabic-only UI; no English fallback

**Clock-in flow** (next screen):
- Tap "سجل الحضور" → checks GPS + selfie or QR-from-tablet
- Confirms branch + time + identity
- Sub-30-second flow

---

### M-07 — Leave Request (Mobile, Bottom-Sheet Wizard)

```
┌─────────────────────────────┐
│       Content (dimmed)      │
├─────────────────────────────┤
│         ━━━ (drag)          │
│                             │
│   طلب إجازة                 │
│   الخطوة 1/3                │
│   ──────────────────────    │
│                             │
│   نوع الإجازة *             │
│   ( ◉ سنوية )               │
│   ( ○ مرضية )               │
│   ( ○ طارئة )               │
│   ( ○ بدون أجر )            │
│                             │
│   الفترة *                  │
│   ┌─────────────────────┐   │
│   │ من: 01/05/2026 ▼    │   │
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │ إلى: 03/05/2026 ▼   │   │
│   └─────────────────────┘   │
│                             │
│   عدد الأيام: 3            │
│   رصيدك بعد الإجازة: 9     │
│                             │
│   ───────────────────────   │
│                             │
│   [ ← السابق ] [ التالي ← ] │
│                             │
└─────────────────────────────┘
```

**Purpose:** simple bottom-sheet wizard — 3 steps, no scroll.

**Steps:**
1. Type + dates
2. Reason (optional, free-text)
3. Review + submit

**Auto-calculations** prevent errors: days count, balance after.

**On submit:** Mona (manager) gets push approval, response within minutes typically. Karim sees status in his app (طلب → في انتظار الموافقة → موافقة/رفض).

---

## 4. Desktop Wireframes (Full Power Surface)

> Desktop target: 1440px+ standard, 1080p supported
> Touch targets: ≥36px (mouse precision)
> Typography: 14px body, 24px numerals, 32px headings

---

### D-01 — Executive Dashboard (Sarah — Operations Director)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ نظام الوحش    [البحث...]                    🔔 (12)   سارة عبدالله    [⚙]          │
├──┬───────────────────────────────────────────────────────────────────────────────────┤
│🏠│  لوحة الإدارة                              [🗓 اليوم ▼]  [🌍 جميع الفروع ▼]  [📥]│
│📦│  ─────────────────────────────────────────────────────────────────────────────────│
│📋│                                                                                   │
│🚚│  ┌────────────────┬────────────────┬────────────────┬────────────────────────┐   │
│📥│  │  المبيعات       │  تكلفة الطعام  │  الهدر         │  استلام في الموعد     │   │
│🏢│  │  اليومية        │      %         │     %          │           %           │   │
│👥│  │                 │                │                │                       │   │
│💰│  │  248,400 ج.م    │     27.8%      │     1.9%       │        94%            │   │
│  │  │  ▲ 12% ✅      │  ▼ 0.4 ✅      │  ▼ 0.2 ✅      │   ▲ 3 ✅              │   │
│  │  │  مقابل أمس     │  هدف: <30%     │  هدف: <2.5%    │   هدف: >90%           │   │
│  │  └────────────────┴────────────────┴────────────────┴────────────────────────┘   │
│  │                                                                                   │
│  │  ┌──────────────────────────────────────┬────────────────────────────────────┐   │
│  │  │  المبيعات بالساعة (12 فرع)           │  أداء الفروع — اليوم               │   │
│  │  │                                      │                                    │   │
│  │  │      ▁▁▂▃▄▆█▆▄▃▂▂▃▄▅▇█▇▅▄▃▂        │  مصر الجديدة      96% ✅           │   │
│  │  │  6   8  10  12  14  16  18  20      │  المعادي          94% ✅           │   │
│  │  │                                      │  التجمع           91% ✅           │   │
│  │  │  ── الفعلي  ── المتوقع              │  الزمالك          88% 🟡           │   │
│  │  │                                      │  مدينة نصر        85% 🟡           │   │
│  │  │                                      │  6 أكتوبر          73% 🔴           │   │
│  │  │                                      │  ... 6 فروع أخرى ▼                  │   │
│  │  └──────────────────────────────────────┴────────────────────────────────────┘   │
│  │                                                                                   │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  │  🔔 تنبيهات تحتاج انتباهًا                                                │   │
│  │  │                                                                          │   │
│  │  │  🔴 فرع 6 أكتوبر: نزاع مفتوح بشأن شحنة #2841 (منذ ساعتين)               │   │
│  │  │     → [مراجعة]                                                            │   │
│  │  │                                                                          │   │
│  │  │  🟠 فرع المعادي: تأخر في استلام الشحنة #2843 (45 د)                      │   │
│  │  │     → [تتبع الشحنة]                                                       │   │
│  │  │                                                                          │   │
│  │  │  🟠 المصنع: انخفاض شديد في مخزون البقر المفروم (يكفي ليومين)             │   │
│  │  │     → [مراجعة المورد]                                                     │   │
│  │  │                                                                          │   │
│  │  │  🟡 الموارد البشرية: 4 شهادات صحية ستنتهي خلال أسبوع                     │   │
│  │  │     → [عرض الموظفين]                                                      │   │
│  │  └──────────────────────────────────────────────────────────────────────────┘   │
│  │                                                                                   │
│  │  ┌──────────────────────────────────────┬────────────────────────────────────┐   │
│  │  │  الشحنات النشطة (الآن)               │  مؤشرات الأسبوع                    │   │
│  │  │                                      │                                    │   │
│  │  │  📦 8 شحنات في الطريق                │  • معدل الموافقة: 18 د ✅           │   │
│  │  │  ⚠ 1 متأخرة                         │  • معدل الاستلام: 92 ث ✅          │   │
│  │  │  ✅ 14 تم تسليمها اليوم              │  • معدل النزاع: 1.4% ✅            │   │
│  │  │                                      │  • رضا الموظفين: 87% ✅            │   │
│  │  │  [خريطة حية ←]                       │  [تقرير كامل ←]                    │   │
│  │  └──────────────────────────────────────┴────────────────────────────────────┘   │
│  │                                                                                   │
└──┴───────────────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Sarah's morning ritual. 30 seconds to know if everything is okay; 5 minutes if not.

**Layout philosophy:**
- **KPI strip top** — answer "is today good?" instantly
- **Dual chart row** — left contextual (where), right comparative (who)
- **Alert center** — what needs me specifically
- **Bottom contextual** — operations at-a-glance

**Drill-down:** every number is clickable. Click "27.8% food cost" → opens analysis with branch/category breakdown.

**Cross-filtering:** click a branch row in the right panel → top KPIs filter to that branch only. Click again → reset.

**Time selector:** اليوم / هذا الأسبوع / هذا الشهر / مخصص — Sarah can pivot easily.

**Branch filter:** all 12 / single / region grouping.

**Export:** generates PDF report styled for board meetings.

---

### D-02 — Dispatch Board (Factory Manager — Desktop, Kanban)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ نظام الوحش    [بحث...]                       🔔 (5)    أحمد محمود     [⚙]          │
├──┬───────────────────────────────────────────────────────────────────────────────────┤
│🏠│  لوحة الشحنات — المصنع المركزي                       [🔄 تحديث] [+ شحنة طارئة]   │
│📦│  ─────────────────────────────────────────────────────────────────────────────────│
│📋│                                                                                   │
│🚚│  ┌────────────┬────────────┬────────────┬────────────┬────────────────────────┐  │
│📥│  │ في الانتظار│ التحضير    │ جاهز للشحن │ في الطريق  │ تم التسليم اليوم       │  │
│🏢│  │    (3)     │    (4)     │    (2)     │    (5)     │       (12)             │  │
│👥│  ├────────────┼────────────┼────────────┼────────────┼────────────────────────┤  │
│💰│  │            │            │            │            │                        │  │
│  │  │ ┌────────┐ │ ┌────────┐ │ ┌────────┐ │ ┌────────┐ │  ✅ #2820  6 أكتوبر   │  │
│  │  │ │ #2853  │ │ │ #2847  │ │ │ #2851  │ │ │ #2843  │ │  ✅ #2821  المعادي    │  │
│  │  │ │ مدينة  │ │ │ مصر    │ │ │ التجمع │ │ │ المعادي│ │  ✅ #2822  التجمع     │  │
│  │  │ │ نصر    │ │ │ الجديدة│ │ │ 12 صنف │ │ │ 18 صنف │ │  ✅ #2823  الزمالك    │  │
│  │  │ │ 14 صنف │ │ │ 16 صنف │ │ │        │ │ │ 🚛 سامي│ │  ... ▼                 │  │
│  │  │ │ 🟡 عادي│ │ │ 🟡 عادي│ │ │ 🟡 عادي│ │ │ ⚠ تأخر│ │                        │  │
│  │  │ │        │ │ │ 87% ███│ │ │        │ │ │   45د │ │  [عرض الكل ←]          │  │
│  │  │ │ [ابدأ] │ │ │ [متابعة]│ │ │[سائق→] │ │ │[متابعة]│ │                        │  │
│  │  │ └────────┘ │ └────────┘ │ └────────┘ │ └────────┘ │                        │  │
│  │  │            │            │            │            │                        │  │
│  │  │ ┌────────┐ │ ┌────────┐ │ ┌────────┐ │ ┌────────┐ │                        │  │
│  │  │ │ #2854  │ │ │ #2848  │ │ │ #2852  │ │ │ #2845  │ │                        │  │
│  │  │ │ ...    │ │ │ ...    │ │ │ ...    │ │ │ ...    │ │                        │  │
│  │  │ └────────┘ │ └────────┘ │ └────────┘ │ └────────┘ │                        │  │
│  │  │            │            │            │            │                        │  │
│  │  │ ┌────────┐ │            │            │ ┌────────┐ │                        │  │
│  │  │ │ #2855  │ │            │            │ │ #2846  │ │                        │  │
│  │  │ │ ...    │ │            │            │ │ ...    │ │                        │  │
│  │  │ └────────┘ │            │            │ └────────┘ │                        │  │
│  │  │            │            │            │            │                        │  │
│  │  └────────────┴────────────┴────────────┴────────────┴────────────────────────┘  │
│  │                                                                                   │
│  │  ────────────── السائقون المتاحون ──────────────                                  │
│  │  🚚 محمود حسن (في الطريق)   🚚 سامي إبراهيم (في الطريق)                            │
│  │  🚚 كريم عبدالله (متاح)     🚚 أحمد سعيد (متاح)     🚚 محمد علي (استراحة 45د)    │
│  │                                                                                   │
└──┴───────────────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Ahmed sees his entire dispatch operation in one Kanban board. Drag-drop, click-through, real-time.

**Card states by column:**
- في الانتظار — approved, awaiting picker assignment
- التحضير — being picked; shows progress %
- جاهز للشحن — picking complete, awaiting driver
- في الطريق — dispatched; shows ETA + driver + delay flag
- تم التسليم — collapsed list (only shown if expanded)

**Card interaction:**
- Click → detail panel slides from left
- Drag between columns → status update (with confirmation for backwards moves)
- Right-click → context menu (assign driver, change priority, escalate)

**Live updates:** new shipments appear with brief animation; column counts update real-time; delays auto-escalate to red.

**Driver pool at bottom:** see who's available at a glance, drag a card to a driver to assign.

---

### D-03 — Live Tracking Map (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ نظام الوحش    [بحث...]                          🔔   أحمد محمود      [⚙]            │
├──┬───────────────────────────────────────────────────────────────────────────────────┤
│🏠│  الخريطة الحية                                                  [🔄] [⛶ ملء الشاشة]│
│📦│  ─────────────────────────────────────────────────────────────────────────────────│
│📋│  ┌──────────────────────────────────────────┬─────────────────────────────────┐  │
│🚚│  │                                          │  الشحنات النشطة (8)             │  │
│📥│  │           [ خريطة Cairo                 │                                 │  │
│🏢│  │             مع علامات                   │  🚚 محمود — #2843               │  │
│👥│  │             الشحنات                     │     المعادي · ⚠ تأخر 45 د       │  │
│💰│  │             والفروع                     │     ──────────────              │  │
│  │  │             والمصنع ]                   │                                 │  │
│  │  │                                          │  🚚 سامي — #2847                │  │
│  │  │                                          │     مصر الجديدة · 8 د           │  │
│  │  │       🏭                                 │     ──────────────              │  │
│  │  │     المصنع                               │                                 │  │
│  │  │      المركزي                             │  🚚 خالد — #2849                │  │
│  │  │                                          │     التجمع · 22 د               │  │
│  │  │       🚚                                 │     ──────────────              │  │
│  │  │     #2843                                │                                 │  │
│  │  │     ⚠ تأخر                                │  🚚 أحمد س — #2851              │  │
│  │  │                                          │     الزمالك · 12 د              │  │
│  │  │       🚚                                 │     ──────────────              │  │
│  │  │     #2847                                │                                 │  │
│  │  │                                          │  🚚 محمد ع — #2853              │  │
│  │  │       🏪 (مغلق)                          │     مدينة نصر · 35 د            │  │
│  │  │     فرع المعادي                          │                                 │  │
│  │  │                                          │  ... 3 أخرى ▼                   │  │
│  │  │       🏪 (مفتوح)                         │                                 │  │
│  │  │     فرع مصر الجديدة                      │  ─────────────────              │  │
│  │  │                                          │                                 │  │
│  │  │                                          │  🔍 تصفية:                       │  │
│  │  │                                          │  [الكل] [في الموعد] [متأخر]     │  │
│  │  └──────────────────────────────────────────┴─────────────────────────────────┘  │
│  │                                                                                   │
│  │  ─────────── قاع الصفحة ───────────                                              │
│  │  ✅ تم تسليم 14 شحنة اليوم  ·  ⏱ متوسط الوقت: 38 د  ·  🎯 الالتزام: 94%        │
│  │                                                                                   │
└──┴───────────────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** spatial awareness of the entire fleet at once.

**Map markers:**
- 🏭 Factory (single, fixed)
- 🏪 Branches (12, color-coded by current operational state — open/closed/issue)
- 🚚 Drivers (live GPS, refresh every 15s)

**Interactions:**
- Click 🚚 → driver popover (current shipment, ETA, contact)
- Click 🏪 → branch popover (today's shipments in/out)
- Click trail line → shipment detail
- Pinch / scroll → zoom (Arabic place labels at all zoom levels)

**Layers (toggleable):**
- Live drivers
- Today's completed routes (faded)
- Branch heat (sales intensity)
- Traffic overlay

**Right panel:** sortable list of active shipments — clicking jumps map view to that driver.

---

### D-04 — Reports Library (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ نظام الوحش                                       🔔   سارة عبدالله    [⚙]          │
├──┬───────────────────────────────────────────────────────────────────────────────────┤
│🏠│  التقارير                              [+ تقرير مخصص] [🗓 الفترة ▼] [🌍 الفرع ▼]│
│📦│  ─────────────────────────────────────────────────────────────────────────────────│
│📋│                                                                                   │
│🚚│  [📊 العمليات] [💰 المالية] [👥 الموارد البشرية] [📦 المخزون] [🚚 الشحن]          │
│📥│                                                                                   │
│🏢│  ─────────────── العمليات ───────────────                                         │
│👥│                                                                                   │
│💰│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │  │ 📋 الاستلام والشحن                                                         │  │
│  │  │  ─────────────────                                                         │  │
│  │  │  • تقرير الشحنات اليومية                       [▶ تشغيل] [⭐ مفضل] [📥]   │  │
│  │  │  • تقرير الفروقات والنزاعات                    [▶ تشغيل]         [📥]    │  │
│  │  │  • تقرير الالتزام بالمواعيد                    [▶ تشغيل]         [📥]    │  │
│  │  │  • تقرير أداء السائقين                         [▶ تشغيل]         [📥]    │  │
│  │  └────────────────────────────────────────────────────────────────────────────┘  │
│  │                                                                                   │
│  │  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │  │ 📊 الأداء العام                                                            │  │
│  │  │  ─────────────────                                                         │  │
│  │  │  • مقارنة الفروع — KPIs                        [▶ تشغيل] [⭐ مفضل] [📥]   │  │
│  │  │  • تكلفة الطعام بالفرع                          [▶ تشغيل]         [📥]    │  │
│  │  │  • معدلات الهدر                                 [▶ تشغيل]         [📥]    │  │
│  │  │  • مؤشرات الجودة                                [▶ تشغيل]         [📥]    │  │
│  │  └────────────────────────────────────────────────────────────────────────────┘  │
│  │                                                                                   │
│  │  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │  │ 🔍 تقاريرك المخصصة                                                         │  │
│  │  │  ─────────────────                                                         │  │
│  │  │  • أداء فرع 6 أكتوبر — أسبوعي                  [▶ تشغيل]   [✏ تعديل]     │  │
│  │  │  • مقارنة الموردين — شهري                      [▶ تشغيل]   [✏ تعديل]     │  │
│  │  │                                                                            │  │
│  │  │  [+ إنشاء تقرير مخصص]                                                      │  │
│  │  └────────────────────────────────────────────────────────────────────────────┘  │
│  │                                                                                   │
│  │  ────────── جدولة تلقائية ──────────                                             │
│  │  📧 5 تقارير ترسل تلقائيًا (يومي/أسبوعي/شهري)         [إدارة الجدولة ←]         │
│  │                                                                                   │
└──┴───────────────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** finance and ops users can find or build any report they need.

**Categories:** organized by domain, not by chronology.

**Per-report actions:**
- ▶ Run — opens the report viewer
- ⭐ Favorite — pins to home
- 📥 Export — direct PDF/Excel without running viewer

**Custom reports:** drag-drop builder (separate spec) for power users.

**Scheduled reports:** automated email delivery. Critical for finance who get monthly closes auto-delivered.

---

### D-05 — Employee Management (HR — Desktop)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ نظام الوحش                                       🔔   هدى عبدالحميد   [⚙]          │
├──┬───────────────────────────────────────────────────────────────────────────────────┤
│🏠│  الموارد البشرية ‹ الموظفون                            [+ موظف جديد] [📥 تصدير] │
│📦│  ─────────────────────────────────────────────────────────────────────────────────│
│📋│                                                                                   │
│🚚│  [🔍 ابحث بالاسم، الكود، الفرع...                                              ]│
│📥│                                                                                   │
│🏢│  [الكل ▼] [الفرع ▼] [القسم ▼] [الحالة ▼]   عرض: [قائمة] [بطاقات]                │
│👥│                                                                                   │
│💰│  ┌──────────────────────────────────────────────────────────────────────────────┐│
│  │  │ ☐│ الكود  │ الاسم          │ الفرع       │ القسم   │ الحالة │ إجراءات    ││
│  │  ├──┼────────┼────────────────┼─────────────┼─────────┼────────┼───────────┤│
│  │  │ ☐│ E-001 │ كريم محمود     │ مصر الجديدة │ المطبخ  │ ✅ نشط │ [✏] [👁] ││
│  │  │ ☐│ E-002 │ سامية إبراهيم  │ مصر الجديدة │ الكاشير │ ✅ نشط │ [✏] [👁] ││
│  │  │ ☐│ E-003 │ أحمد علي       │ مصر الجديدة │ المطبخ  │ ⚠ متأخر│ [✏] [👁] ││
│  │  │ ☐│ E-004 │ منى محمود      │ مصر الجديدة │ الإدارة │ ✅ نشط │ [✏] [👁] ││
│  │  │ ☐│ E-005 │ محمود حسن      │ المصنع      │ السائقون│ ✅ نشط │ [✏] [👁] ││
│  │  │ ☐│ E-006 │ ...            │ ...         │ ...     │ ...    │ ...       ││
│  │  │  │       │                │             │         │        │           ││
│  │  │  │       │  ... 412 موظف   │             │         │        │           ││
│  │  └──────────────────────────────────────────────────────────────────────────────┘│
│  │                                                                                   │
│  │  ─── إجراءات جماعية على المختارين (3) ───                                         │
│  │  [💼 تغيير القسم] [📅 جدولة وردية] [📚 تعيين تدريب] [✉ إرسال إشعار]              │
│  │                                                                                   │
│  │  ─────────── تنبيهات HR ───────────                                                │
│  │  ⚠ 4 شهادات صحية ستنتهي خلال أسبوع           [مراجعة ←]                          │
│  │  ⚠ 2 موظفين بدون عقد محدّث                    [مراجعة ←]                          │
│  │  🔔 12 طلب إجازة في انتظار الموافقة            [مراجعة ←]                          │
│  │                                                                                   │
└──┴───────────────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** HR manages 400+ employees. Density matters.

**Table behavior:**
- Sort any column (click header)
- Multi-filter combos
- Row hover shows quick actions
- Multi-select for bulk operations

**Bulk actions** save HR hours per week — assigning training to 50 people in seconds.

---

### D-06 — Payroll Run (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ نظام الوحش                                       🔔   فؤاد سالم      [⚙]            │
├──┬───────────────────────────────────────────────────────────────────────────────────┤
│🏠│  المالية ‹ الرواتب ‹ مسير شهر إبريل 2026                                          │
│📦│  ─────────────────────────────────────────────────────────────────────────────────│
│📋│                                                                                   │
│🚚│  حالة المسير: 🟡 مسودة — 78% مكتمل                                                │
│📥│  ─────────────────────────────────────────────────────────────────────────────────│
│🏢│                                                                                   │
│👥│  الخطوات:                                                                         │
│💰│  ✅ 1. تجميع الحضور والوقت                                                       │
│  │  ✅ 2. حساب الرواتب الأساسية                                                     │
│  │  🟢 3. مراجعة الإضافي والخصومات     ← خطوة حالية                                │
│  │  ⚪ 4. التأمينات والضرائب                                                        │
│  │  ⚪ 5. الموافقة النهائية                                                         │
│  │  ⚪ 6. توليد القسائم                                                             │
│  │  ⚪ 7. إرسال للبنك                                                               │
│  │                                                                                   │
│  │  ────────── الموظفون (412) ──────────                  [🔍 بحث] [📥 تصدير]       │
│  │                                                                                   │
│  │  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │  │ الكود │ الاسم        │ أساسي  │ إضافي │ خصم │ صافي    │ الحالة          ││
│  │  ├──────┼─────────────┼────────┼───────┼─────┼─────────┼─────────────────┤  │
│  │  │ E-001│ كريم محمود  │ 6,500  │  240  │ 120 │ 6,620   │ ✅ مراجع         ││
│  │  │ E-002│ سامية...    │ 5,800  │  180  │  80 │ 5,900   │ 🟢 يحتاج مراجعة  ││
│  │  │ E-003│ أحمد علي    │ 6,500  │   0   │ 350 │ 6,150   │ ⚠ خصم استثنائي  ││
│  │  │ E-004│ منى محمود   │ 12,000 │  600  │ 200 │ 12,400  │ ✅ مراجع         ││
│  │  │ E-005│ محمود حسن   │ 7,200  │  920  │ 100 │ 8,020   │ 🟢 يحتاج مراجعة  ││
│  │  │ ...  │             │        │       │     │         │                 ││
│  │  └────────────────────────────────────────────────────────────────────────────┘  │
│  │                                                                                   │
│  │  ──────── الإجمالي ────────                                                      │
│  │  إجمالي الرواتب: 2,840,500 ج.م        التأمينات: 312,455 ج.م                     │
│  │  الضرائب: 184,225 ج.م                  الصافي للبنك: 2,343,820 ج.م              │
│  │                                                                                   │
│  │  ─────── الإجراءات ───────                                                       │
│  │  [💾 حفظ كمسودة]    [👁 معاينة قسيمة عينة]    [التالي: التأمينات والضرائب ←]   │
│  │                                                                                   │
└──┴───────────────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** stepwise payroll run. Cannot skip steps; cannot run without explicit approval.

**Step indicator:** progress is the source of truth for what's done and what remains.

**Per-row review:** every employee row tappable to drill into individual breakdown — for handling exceptional cases (the ⚠ row).

**Audit:** each step records who did it, when, with what data. Cannot reverse without admin override.

---

### D-07 — Audit Log Search (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ نظام الوحش                                       🔔   سارة عبدالله    [⚙]          │
├──┬───────────────────────────────────────────────────────────────────────────────────┤
│🏠│  سجل التدقيق                                                                      │
│📦│  ─────────────────────────────────────────────────────────────────────────────────│
│📋│                                                                                   │
│🚚│  ┌─────────── فلاتر البحث ───────────┐                                            │
│📥│  │ التاريخ:                            │                                          │
│🏢│  │  من [01/04/2026] إلى [28/04/2026]  │                                          │
│👥│  │                                     │                                          │
│💰│  │ الفاعل:                             │                                          │
│  │  │  ▼ الكل / [محدد]                   │                                          │
│  │  │                                     │                                          │
│  │  │ نوع الإجراء:                        │                                          │
│  │  │  ☑ إنشاء طلب                       │                                          │
│  │  │  ☑ موافقة                          │                                          │
│  │  │  ☑ استلام                          │                                          │
│  │  │  ☑ تعديل مخزون                     │                                          │
│  │  │  ☐ نزاع                             │                                          │
│  │  │  ☐ تسجيل دخول                      │                                          │
│  │  │                                     │                                          │
│  │  │ الفرع:                              │                                          │
│  │  │  ▼ الكل                             │                                          │
│  │  │                                     │                                          │
│  │  │ رقم السجل:                          │                                          │
│  │  │  [             ]                    │                                          │
│  │  │                                     │                                          │
│  │  │ [مسح] [تطبيق الفلاتر]               │                                          │
│  │  └─────────────────────────────────────┘                                          │
│  │                                                                                   │
│  │  ─────── النتائج (1,247 سجل) ───────              [📥 تصدير CSV] [📥 PDF]        │
│  │                                                                                   │
│  │  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │  │ التوقيت        │ الفاعل      │ الإجراء       │ السجل   │ التفاصيل  ││
│  │  ├────────────────┼─────────────┼───────────────┼─────────┼──────────┤  │
│  │  │ 28/04 8:31 ص  │ منى محمود   │ إقرار استلام  │ #2847   │ [👁 عرض] │  │
│  │  │ 28/04 8:24 ص  │ محمود حسن   │ وصول الشحنة   │ #2847   │ [👁 عرض] │  │
│  │  │ 28/04 7:37 ص  │ محمود حسن   │ انطلاق        │ #2847   │ [👁 عرض] │  │
│  │  │ 28/04 7:30 ص  │ عمر سعد     │ إكمال التحضير │ #2847   │ [👁 عرض] │  │
│  │  │ 28/04 6:48 ص  │ أحمد محمود  │ موافقة        │ #2847   │ [👁 عرض] │  │
│  │  │ 28/04 6:35 ص  │ منى محمود   │ إنشاء طلب     │ #2847   │ [👁 عرض] │  │
│  │  │ ...                                                                        │  │
│  │  └────────────────────────────────────────────────────────────────────────────┘  │
│  │                                                                                   │
│  │  « الصفحة 1 من 84 »                                                              │
│  │                                                                                   │
└──┴───────────────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** discoverable, exportable, immutable log for compliance, disputes, internal investigations.

**Filter combinations** are stored — Sarah can save "إجراءات أحمد على الموافقات في إبريل" as a saved view.

**Export formats:**
- CSV (analysis)
- PDF (legal evidence — includes Arabic-aware formatting + digital signature of export)

**Drill-in:** click a row → opens full record card with all evidence (T-15 equivalent on desktop).

---

## 5. Component Library

Reusable building blocks referenced across screens.

### 5.1 Buttons

| Variant | Usage | Tablet | Mobile | Desktop |
|---|---|---|---|---|
| Primary | Main CTA per screen | 56px h | 48px h | 40px h |
| Secondary | Alternative action | 56px h | 48px h | 40px h |
| Tertiary (text) | Less weight | 44px h | 40px h | 32px h |
| Destructive | Delete, reject, cancel order | 56px h, danger color | 48px h | 40px h |
| Icon | Quick actions | 56×56 | 48×48 | 36×36 |
| FAB | Floating quick-create | 64×64 | 56×56 | n/a |

**RTL rule:** primary CTA always lives in **bottom-right** of forms/modals. Secondary to its left. Destructive separated by space or different region.

### 5.2 Form Inputs

| Component | Notes |
|---|---|
| Text input | Right-aligned text by default; LTR for SKU/numbers wrapped with bidi marks |
| Numeric stepper | P-06 — touch-optimized |
| Date picker | Gregorian default; Hijri toggle |
| Time picker | 12-hour with ص/م |
| Dropdown | Searchable when >7 options |
| Search | Always with `🔍` leading icon (right side in RTL = leading) |
| Toggle | Right-on, left-off (matches RTL reading) |
| Checkbox | ☐ ☑ — 24×24 minimum |
| Radio | ○ ◉ — 24×24 minimum |

### 5.3 Status Pills

P-03 reference. 6 statuses + 4 edge states. Color + icon + label always together.

### 5.4 Cards

| Card type | Use |
|---|---|
| Item card (T-03) | Inventory grid — image-led |
| Action card (T-02 home) | Dashboard summary tiles |
| Detail card (T-04) | Drawer-opened item detail |
| Notification card (M-01) | Mobile push representation |
| Audit entry (T-15) | Log row with expandable detail |

### 5.5 Navigation

| Component | Tablet | Mobile | Desktop |
|---|---|---|---|
| Right rail | Always visible, icons + labels | n/a | Always visible, can collapse to icons |
| Bottom tab bar | n/a | 5 tabs max | n/a |
| Top bar | Title + actions + user | Title + back | Search + notifications + user |
| Breadcrumb | Always visible | Hidden (use back gesture) | Always visible |

### 5.6 Modals & Sheets

| Type | Tablet | Mobile | Desktop |
|---|---|---|---|
| Drawer | Right-side, 480px wide | Full-screen modal | Right-side, 560px wide |
| Bottom sheet | Edge-anchored, 60–80% h | P-02 standard | Avoid (use modal) |
| Centered modal | Avoid for actions, ok for info | Avoid | Standard for forms |
| Toast | Top-center, auto-dismiss 4s | Top, auto-dismiss 4s | Top-right, auto-dismiss 4s |

---

## 6. State Specifications

Every screen must handle 5 states. Skipping any state = bug.

### 6.1 Empty State

- Reassuring message in Arabic
- Clear next action (button)
- Friendly illustration optional, never required
- Never show "لا يوجد بيانات" alone

### 6.2 Loading State

- Skeleton loaders preferred over spinners (perceived speed)
- Use the actual layout structure with shimmer effect
- For >3s loads, show progress indicator with step description
- Never block the entire screen — partial loading allowed

### 6.3 Error State

- Specific Arabic error message: "تعذّر الاتصال بالخادم — تأكد من اتصال الإنترنت" not "Error 500"
- Always offer a retry action
- Never blame the user
- Log error context invisibly for debugging

### 6.4 Success State

- Brief confirmation toast (4s auto-dismiss)
- For consequential actions, show inline success that persists
- Optimistic UI: assume success, revert if server fails
- Sound feedback acceptable on tablet (operational confirmation)

### 6.5 Offline State

- Visible offline indicator (top of screen, persistent)
- Greyed-out actions that need network
- Queued actions counter ("3 إجراءات في انتظار المزامنة")
- Auto-sync on reconnection with summary toast

---

## 7. Accessibility & Interaction Specs

### 7.1 Touch Targets (Hard Floors)

- Tablet: 56px (gloves, wet hands)
- Mobile: 48px (pocket use, motion)
- Desktop: 36px (mouse precision)
- Spacing between targets: ≥8px

### 7.2 Color Contrast

- Body text on background: 7:1 minimum (AAA)
- Status colors paired with icons (color-blind safe)
- Never use color alone to convey information

### 7.3 Typography

- Minimum readable size: 14px desktop, 15px mobile, 16px tablet
- Line height: 1.6 for Arabic body
- Maximum line length: 70ch
- Tabular numerals for prices/quantities

### 7.4 Motion

- Respect prefers-reduced-motion
- Avoid animations >300ms on operational flows
- Never animate critical alerts (no celebration on a P0)

### 7.5 Voice & Tone (Arabic)

- Formal but not stiff (no مولانا-style; no slang)
- Active voice over passive
- Verbs in 2nd-person feminine OR masculine — system detects from user profile and uses gendered Arabic appropriately
  - Ex: for Mona — "وقّعي هنا" / "أرسلي الطلب"
  - For Ahmed — "وقّع هنا" / "أرسل الطلب"
- Errors: empathetic, never blaming
- Confirmations: brief and action-oriented

### 7.6 Notifications

- Critical (P0): push + sound + SMS fallback
- Important (P1): push + in-app
- Normal (P2): in-app only
- Informational (P3): email digest

---

## 8. Cross-Reference Index

| Screen | Strategy Section | User Flow | Persona |
|---|---|---|---|
| T-01 Login | §3 RTL | n/a | All |
| T-02 Home (Branch) | §1.A IA | All | Mona |
| T-03 Inventory | §1.B Module 1 | n/a | Mona, Ahmed |
| T-04 Item Detail | §1.B Module 1 | n/a | Mona, Ahmed |
| T-05 Request Templates | §6 Journey 1 | Flow 1 | Mona |
| T-06 Request Catalog | §6 Journey 1 | Flow 1 | Mona |
| T-07 Request Review | §6 Journey 1 | Flow 1 | Mona |
| T-08 Pick List | §11 Sending | Flow 3 | Factory worker |
| T-09 Assign Driver | §11 Sending | Flow 3 | Dispatcher |
| T-10 Receive | §11 Receiving | Flow 5 | Mona |
| T-11 Discrepancy | §11 Receiving | Flow 5 | Mona |
| T-12 Signature | §11 Receiving | Flow 5 | Mona |
| T-13 Cycle Count | §1.B Module 1 | n/a | Mona + helper |
| T-14 Suppliers | §1.B Module 5 | n/a | Ahmed |
| T-15 Audit Log | §10.F | n/a | All |
| M-01 Driver Home | §5 Persona 3 | Flow 4 | Mahmoud |
| M-02 Trip Detail | §5 Persona 3 | Flow 4 | Mahmoud |
| M-03 POD | §5 Persona 3, §11 | Flow 4 | Mahmoud |
| M-04 Quick Approval | §6 Journey 1 | Flow 2 | Ahmed |
| M-05 Mobile Branch | §5 Persona 2 | n/a | Mona |
| M-06 Employee Self | §5 Persona 5 | n/a | Karim |
| M-07 Leave Request | §1.B Module 6 | n/a | Karim |
| D-01 Exec Dashboard | §5 Persona 4 | n/a | Sarah |
| D-02 Dispatch Board | §1.B Module 3 | n/a | Ahmed |
| D-03 Live Map | §1.B Module 3 | n/a | Ahmed, Sarah |
| D-04 Reports | §1.B Module 8 | n/a | Sarah, Finance |
| D-05 Employees | §1.B Module 6 | n/a | HR |
| D-06 Payroll | §1.B Module 6 | n/a | Finance |
| D-07 Audit Search | §10.F | n/a | Admin |

---

## 9. Additional Screens — Phase 2

> These 53 screens complete the full 82-screen system. All RTL conventions from §0 apply. New screens use module-prefixed IDs.

---

## Auth Screens

### A-02 — Login (Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                        [شعار الوحش]                                │
│                                                                     │
│             ┌────────────────────────────────────────┐             │
│             │                                        │             │
│             │   تسجيل الدخول                         │             │
│             │                                        │             │
│             │  البريد الإلكتروني *                   │             │
│             │  ┌──────────────────────────────────┐  │             │
│             │  │ ahmed@wahshgroup.com              │  │             │
│             │  └──────────────────────────────────┘  │             │
│             │                                        │             │
│             │  كلمة المرور *                         │             │
│             │  ┌──────────────────────────────────┐  │             │
│             │  │ ••••••••••••  [👁]               │  │             │
│             │  └──────────────────────────────────┘  │             │
│             │                                        │             │
│             │  [ تسجيل الدخول ← ]   (full-width)    │             │
│             │                                        │             │
│             │  ─────────── أو ───────────            │             │
│             │                                        │             │
│             │  [🔐 تسجيل عبر Microsoft SSO]          │             │
│             │                                        │             │
│             │        [ نسيت كلمة المرور؟ ]           │             │
│             │                                        │             │
│             └────────────────────────────────────────┘             │
│                                                                     │
│                   v2.0  ·  © مجموعة الوحش                         │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Primary entry for desktop users (finance, HR, admin, ops directors). Single personal workstation — full credentials, not PIN.

**Key UX decisions:**
- SSO option for Microsoft 365 — common in Egyptian enterprises, reduces password fatigue
- No avatar grid — desktop is personal, not shift-shared
- Post-login redirect is role-aware: Sarah → D-01, HR admin → D-05, finance → FN-02
- 2FA TOTP overlay appears after password if enabled on the account

**States:** Default · Wrong credentials (shake + red border, 3 attempts → 15-min lockout) · 2FA prompt · Forgot password (email OTP)

---

### A-03 — Login (Mobile)

```
       ┌─────────────────────────┐
       │                         │
       │       [شعار الوحش]      │
       │                         │
       │                         │
       │    مرحبًا، محمود         │
       │    [avatar — 72×72]     │
       │                         │
       │  ┌─────────────────────┐│
       │  │  [🖐 فتح ببصمتك  ] ││
       │  │   TouchID / FaceID  ││
       │  └─────────────────────┘│
       │                         │
       │      ─── أو ───         │
       │                         │
       │     أدخل رقم PIN        │
       │  ┌──┐ ┌──┐ ┌──┐ ┌──┐   │
       │  │• │ │• │ │  │ │  │   │
       │  └──┘ └──┘ └──┘ └──┘   │
       │                         │
       │    [1] [2] [3]          │
       │    [4] [5] [6]          │
       │    [7] [8] [9]          │
       │    [⌫] [0] [✓]         │
       │                         │
       │ [ دخول بحساب آخر ]      │
       └─────────────────────────┘
```

**Purpose:** Personal-device login for drivers, field managers. Biometric is primary — fastest when hands are occupied.

**Key UX decisions:**
- Single-user device assumption: one profile per phone
- Biometric auto-triggers on screen open — no tap needed
- PIN fallback when biometric fails (wet hands, mask, etc.)
- First launch goes through A-04 enrollment flow

**States:** Returning user (biometric auto) · Wrong PIN 3× → full credentials required · Biometric unavailable → falls to PIN silently

---

### A-04 — First-time Enrollment / Biometric Setup (Tablet)

```
┌──────────────────────────────────────────────────────────────┐
│  الإعداد الأولي                                              │
│                                                              │
│  ●──○──○   الخطوة 1 من 3: ربط الجهاز بالفرع                │
│                                                              │
│  ┌────────────────────────────────────────────────────┐      │
│  │                                                    │      │
│  │    [ 📷  امسح رمز QR الخاص بفرعك ]               │      │
│  │                                                    │      │
│  │         [  viewfinder — 240×240px  ]               │      │
│  │                                                    │      │
│  │    ─── أو أدخل رمز الفرع يدويًا ───               │      │
│  │    ┌──────────────────────────────┐                │      │
│  │    │  WH-MASR-001                 │                │      │
│  │    └──────────────────────────────┘                │      │
│  │                                  [ التالي ← ]      │      │
│  └────────────────────────────────────────────────────┘      │
│                                                              │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─      │
│                                                              │
│  ●──●──○   الخطوة 2 من 3: تسجيل بياناتك                    │
│                                                              │
│  اختر حسابك وأدخل كلمة المرور مرة واحدة فقط                 │
│  [نموذج بريد إلكتروني + كلمة مرور]         [ التالي ← ]    │
│                                                              │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─      │
│                                                              │
│  ●──●──●   الخطوة 3 من 3: تسجيل بصمتك                      │
│                                                              │
│  [ 👆 ضع إصبعك على زر الهوم ]                               │
│                                                              │
│  ✅ تم تسجيل البصمة بنجاح                                   │
│                                          [ ابدأ ← ]         │
└──────────────────────────────────────────────────────────────┘
```

**Purpose:** One-time device setup when a tablet is deployed to a branch. Done by admin or branch manager.

**Key UX decisions:**
- Branch QR code is generated from ST-03 (Branch Config) by admin — prevents wrong-branch enrollment
- Biometric enrollment is optional — can skip and PIN-only
- Step 1 completes silently if device is already linked (re-enrollment scenario)
- After step 3: direct redirect to user's role home screen

---

### A-05 — PIN Change / Reset (Tablet / Mobile)

```
       ┌─────────────────────────┐
       │                         │
       │    تغيير رقم PIN         │
       │                         │
       │   PIN الحالي *           │
       │  ┌──┐ ┌──┐ ┌──┐ ┌──┐   │
       │  │• │ │• │ │• │ │• │   │
       │  └──┘ └──┘ └──┘ └──┘   │
       │                         │
       │   PIN الجديد *           │
       │  ┌──┐ ┌──┐ ┌──┐ ┌──┐   │
       │  │  │ │  │ │  │ │  │   │
       │  └──┘ └──┘ └──┘ └──┘   │
       │                         │
       │   تأكيد PIN الجديد *     │
       │  ┌──┐ ┌──┐ ┌──┐ ┌──┐   │
       │  │  │ │  │ │  │ │  │   │
       │  └──┘ └──┘ └──┘ └──┘   │
       │                         │
       │   [1] [2] [3]           │
       │   [4] [5] [6]           │
       │   [7] [8] [9]           │
       │   [⌫] [0] [✓]          │
       │                         │
       │   [ تغيير PIN ← ]       │
       │                         │
       │   ─── أو ───            │
       │   [ إعادة تعيين عبر المدير ] │
       └─────────────────────────┘
```

**Purpose:** Self-service PIN change, or admin-assisted reset when user has forgotten their PIN.

**States:**
- Wrong current PIN: red border, "PIN غير صحيح"
- New PINs don't match: highlight confirm field, "الأرقام لا تتطابق"
- Success: toast "تم تغيير PIN بنجاح", auto-dismiss and return

---

## Dashboard Screens

### DA-04 — Factory Manager Dashboard (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🔔(5)   [المصنع المركزي ▼]    أحمد رضا    [⚙]             Top bar │
├──┬──────────────────────────────────────────────────────────────────┤
│🏠│  الرئيسية ‹ المصنع                                               │
│  ├────────────────────────────────┬─────────────────────────────────┤
│📦│  قوائم التحضير اليوم           │  الشحنات الصادرة                │
│  │  ──────────────────────────    │  ─────────────────────────────  │
│📋│  🔴 #3042 — مصر الجديدة        │  🟢 في الطريق         3         │
│  │     23 صنف · يستحق 9:00ص      │  🟡 قيد التحضير       2         │
│🚚│     [ ابدأ التحضير ← ]        │  ⚪ مجدولة اليوم       5         │
│  │                                │                                 │
│📥│  🟡 #3041 — الدقي              │  [ عرض لوحة الشحن ← ]          │
│  │     18 صنف · يستحق 9:30ص      │                                 │
│🏢│     [ ابدأ التحضير ← ]        │  ─────────────────────────────  │
│  │                                │  طلبات تحتاج موافقة              │
│👥│  ✅ #3040 — المعادي             │  🔴 طلب #3055 — العجوزة          │
│  │     تم الانتهاء ✓              │     [ راجع واعتمد ← ]           │
│💰│                                │  🟡 طلب #3054 — السلام           │
│  │                                │     [ راجع واعتمد ← ]           │
│  ├────────────────────────────────┤                                 │
│  │  تنبيهات المخزون               │                                 │
│  │  🔴 لحم بقري — 12 كجم متبقية  │                                 │
│  │  🟠 جبن شيدر — 8 كجم          │                                 │
│  │  [ تفاصيل المخزون ← ]         │                                 │
├──┴────────────────────────────────┴─────────────────────────────────┤
│    [+ قائمة تحضير جديدة]     [عرض الخريطة]     [التقارير]          │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Factory manager's shift command view. Primary concerns: pick lists ready on time, shipments dispatched, incoming requests reviewed.

**Key UX decisions:**
- Pick lists sorted by urgency (earliest cutoff first)
- Dual-panel: operational tasks (right panel, primary) / status + approvals (left)
- Inventory alerts surfaced inline — no separate drill-down for quick awareness
- Bottom bar: persistent shortcuts for the three most common factory actions

---

### DA-05 — Factory Dashboard (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🔔(7)   [المصنع المركزي]   أحمد رضا   [الفترة: اليوم ▼]   [⚙]          │
├──────────────────┬───────────────────────────────────────────────────────┤
│  🏠 الرئيسية    │                                                         │
│  📦 المخزون     │  ┌─────────────┐ ┌─────────────┐ ┌──────────┐ ┌─────┐ │
│  📋 الطلبات     │  │قوائم التحضير│ │شحنات صادرة  │ │ توريدات  │ │طلبات│ │
│  🚚 الشحن       │  │  8 نشطة    │ │  5 طريق     │ │  2 اليوم │ │  4  │ │
│  📥 الاستلام    │  │  3 متأخرة  │ │  2 متأخرة   │ │  1 غداً  │ │معلقة│ │
│  🏢 الموردون    │  └─────────────┘ └─────────────┘ └──────────┘ └─────┘ │
│  👥 الموارد     │                                                         │
│  💰 المالية     │  المخزون — المستويات الحالية                            │
│  ⚙ الإعدادات   │  ┌─────────────────────────────────────────────────┐   │
│                 │  │ الصنف           المتاح   نقطة الإعادة   الحالة │   │
│                 │  │ لحم بقري مفروم   45كجم      60كجم       🔴     │   │
│                 │  │ جبن شيدر        120كجم      80كجم        🟢     │   │
│                 │  │ خبز برجر         300         200          🟢     │   │
│                 │  │ طماطم طازجة      18كجم       25كجم        🟠     │   │
│                 │  └─────────────────────────────────────────────────┘   │
│                 │                                                         │
│                 │  أداء الشحن — آخر 7 أيام                               │
│                 │  في الوقت  ████████████████░░  87%                     │
│                 │  متأخر     ████░░  13%                                  │
│                 │                                                         │
│                 │  [ تفاصيل الأداء ← ]    [ تقرير مفصل ← ]              │
└──────────────────┴───────────────────────────────────────────────────────┘
```

**Purpose:** Full-power desktop overview for factory manager reviewing production, dispatch, inventory health, and supplier deliveries in one pane.

**Key UX decisions:**
- 4 KPI cards at top provide instant health-check — each is clickable to its module
- Inventory table highlights critical items inline
- Shipping adherence bar chart: quick %-at-a-glance without needing a report
- Left nav persists across all desktop screens (RTL-docked, icon + label)

---

## Inventory Screens

### IN-04 — Factory Inventory View (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ المخزون ‹ المصنع المركزي                                            │
│  [مواد خام ●] [قيد الإنتاج] [منتج نهائي]   🔍 بحث   [+تسجيل وارد]│
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐           │
│  │  🥩            │ │  🧀            │ │  🍅            │           │
│  │ لحم بقري مفروم │ │ جبن شيدر      │ │ طماطم طازجة    │           │
│  │  45 كجم        │ │  120 كجم       │ │  18 كجم        │           │
│  │ دفعة: B-2407   │ │ دفعة: B-2405   │ │ دفعة: B-2408   │           │
│  │ إنتاج: 27/04   │ │ إنتاج: 25/04   │ │ إنتاج: 28/04   │           │
│  │ ينتهي: 30/04   │ │ ينتهي: 02/05   │ │ ينتهي: 01/05   │           │
│  │ 🔴 دون الحد    │ │ 🟢 كافٍ        │ │ 🟠 قريب        │           │
│  └────────────────┘ └────────────────┘ └────────────────┘           │
│                                                                      │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐           │
│  │  🍞            │ │  🧅            │ │  🥫            │           │
│  │ خبز برجر       │ │ بصل            │ │ صلصة خاصة      │           │
│  │  300 رغيف      │ │  35 كجم        │ │  22 لتر        │           │
│  │ دفعة: B-2406   │ │ دفعة: B-2409   │ │ دفعة: B-2403   │           │
│  │ ينتهي: 05/05   │ │ ينتهي: 03/05   │ │ ينتهي: 10/05   │           │
│  │ 🟢 كافٍ        │ │ 🟢 كافٍ        │ │ 🟢 كافٍ        │           │
│  └────────────────┘ └────────────────┘ └────────────────┘           │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  [تحويل داخلي]  [تسجيل هدر]  [جرد دوري]  [تقرير المخزون]           │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Factory-specific inventory with batch/lot tracking and production-date visibility — essential for FIFO and HACCP compliance.

**Key UX decisions:**
- Three tabs separate raw materials / WIP / finished goods — matches factory mental model
- Batch number on every card — required for recall traceability
- Expiry color-coding: 🔴 expired or <24h, 🟠 1–3 days, 🟢 safe
- `+تسجيل وارد` logs a supplier delivery directly from this view (links to RC-06)
- Tapping a card opens IN-02 (Item Detail) adapted to show batch history

---

### IN-05 — Internal Transfer (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ المخزون ‹ تحويل داخلي جديد                       [↗ حفظ مسودة]    │
├─────────────────────────────┬───────────────────────────────────────┤
│                             │                                       │
│  من *                       │  أصناف التحويل                        │
│  [المصنع المركزي ▼]         │  ──────────────────────────────────   │
│                             │  الصنف          الكمية   الوحدة       │
│  إلى *                      │  لحم بقري مفروم  [−][20][+]  كجم ▼  │
│  [اختر الفرع ▼]             │  جبن شيدر         [−][15][+]  كجم ▼  │
│                             │                                       │
│  سبب التحويل *              │  [+ إضافة صنف]                       │
│  ┌─────────────────────────┐│                                       │
│  │ طلب فرع رقم #3042      ││  ────────────────────────────────     │
│  └─────────────────────────┘│  الإجمالي: 35 كجم                    │
│                             │                                       │
│  تاريخ الشحن *              │  ⚠ الكمية تتجاوز 50% من المتاح       │
│  ┌─────────────────────────┐│  للحم البقري. هل تريد المتابعة؟      │
│  │ 28/04/2026   📅         ││                                       │
│  └─────────────────────────┘│                                       │
│                             │                                       │
│  ملاحظات                    │                                       │
│  ┌─────────────────────────┐│                                       │
│  │                         ││                                       │
│  └─────────────────────────┘│                                       │
│                             │                                       │
├─────────────────────────────┴───────────────────────────────────────┤
│        [ إلغاء ]                          [ إنشاء التحويل ← ]      │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Create an internal stock movement between factory and branch, or branch to branch. Auto-creates a shipment record.

**Key UX decisions:**
- P-01 split-view: form fields (right) / items list with quantity steppers (left)
- Inline warning fires when transfer would drop source below reorder point
- On submit: creates pending record in LG-08 (Active Shipments) automatically
- Transfers above a configurable value threshold require manager second-approval

---

### IN-06 — Expiry Alerts Dashboard (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ المخزون ‹ تنبيهات الصلاحية        [الفرع: الكل ▼]   [📅 اليوم ▼]  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🔴 منتهي الصلاحية — 3 أصناف                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 🔴 طماطم مجففة · فرع الدقي · انتهى 26/04 · 2 كجم           │   │
│  │      [ تسجيل كهدر ]    [ تحويل ]                             │   │
│  │ ────────────────────────────────────────────────────────── │   │
│  │ 🔴 صلصة حارة · فرع السلام · انتهى 27/04 · 3 لتر             │   │
│  │      [ تسجيل كهدر ]    [ تحويل ]                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  🟠 تنتهي خلال 3 أيام — 7 أصناف                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 🟠 لحم بقري مفروم · المصنع · ينتهي 30/04 · 45 كجم           │   │
│  │      [ أعطِ الأولوية ]   [ طلب إضافي ]                       │   │
│  │ ────────────────────────────────────────────────────────── │   │
│  │ 🟠 جبن شيدر · فرع العجوزة · ينتهي 01/05 · 8 كجم             │   │
│  │      [ أعطِ الأولوية ]   [ طلب إضافي ]                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  🟡 تنتهي خلال 7 أيام — 12 صنفًا          [ عرض الكل ]             │
│  🟢 سليم (الباقي)                          [ عرض الكل ]             │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│    [ تسجيل هدر جماعي ]              [ إنشاء طلب تعويضي ]            │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** HACCP-critical alert center for expiry-sensitive items across all locations.

**Key UX decisions:**
- 🔴 expired rows cannot be dismissed without a documented action (P-09 pattern)
- "أعطِ الأولوية" moves the item to front of next dispatch queue to use it fastest
- "طلب إضافي" pre-fills a new request (RQ-01 flow) with the replacement item
- Cross-branch view is default — admin sees the full picture; branch manager sees only their branch

---

### IN-07 — Waste & Spoilage Log (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ المخزون ‹ تسجيل الهدر والتالف                      [28/04/2026]    │
├─────────────────────────────┬───────────────────────────────────────┤
│                             │                                       │
│  صنف *                      │  سجل اليوم                            │
│  [اختر الصنف ▼]             │  ──────────────────────────────────   │
│                             │  جبن شيدر    2 كجم   تلف تخزيني ✓    │
│  الكمية *                   │  خبز برجر    12 رغيف  حريق طهي   ✓   │
│  [ − ]  [ 2.5 كجم ]  [ + ] │                                       │
│                             │  ────────────────────────────────     │
│  الوحدة [كجم ▼]             │  إجمالي الهدر اليوم                   │
│                             │  4.5 كجم / 12 رغيف                   │
│  سبب الهدر *                │                                       │
│  ○ هدر الإعداد              │  مقارنة بالأمس  ▲ 8%                 │
│  ○ تلف التخزين              │  متوسط الأسبوع  3.2 كجم/يوم           │
│  ○ منتهي الصلاحية           │                                       │
│  ○ تلف الشحن                │  [ تقرير الأسبوع ← ]                 │
│  ○ أخرى — حدد:              │                                       │
│    [ _________________ ]    │                                       │
│                             │                                       │
│  ملاحظة إضافية              │                                       │
│  ┌─────────────────────────┐│                                       │
│  │                         ││                                       │
│  └─────────────────────────┘│                                       │
│                             │                                       │
│  [📷 صورة كدليل (مطلوب للتالف)] │                                   │
│                             │                                       │
├─────────────────────────────┴───────────────────────────────────────┤
│                                    [ تسجيل الهدر ← ]               │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Daily waste entry by kitchen/warehouse staff. Feeds food-cost % tracking and expiry compliance.

**Key UX decisions:**
- Split: entry form (right) / today's running log + trend line (left) — immediate feedback lowers waste
- Photo evidence mandatory for damaged-goods category, optional for prep waste
- Reason codes map directly to accounting categories for automatic COGS posting
- Weekly comparison gives staff context without requiring them to run a report

---

### IN-08 — Reorder Points Management (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ المخزون ‹ نقاط إعادة الطلب                  [+ إضافة قاعدة]  [تصدير]   │
├──────────────────────────────────────────────────────────────────────────┤
│ بحث: [__________________]   الفرع: [الكل ▼]   الفئة: [الكل ▼]          │
├──────────────────────────────────────────────────────────────────────────┤
│ الصنف           الفرع         المتاح   نقطة الإعادة   كمية الطلب  المورد│
│ ─────────────────────────────────────────────────────────────────────── │
│ لحم بقري مفروم  المصنع        45كجم   [60كجم ✏]       [20كجم ✏]  [✏] │
│ ← 🔴 أقل من نقطة الإعادة حاليًا                                        │
│ ─────────────────────────────────────────────────────────────────────── │
│ جبن شيدر شرائح  المصنع       120كجم   [80كجم ✏]       [30كجم ✏]  [✏] │
│ ─────────────────────────────────────────────────────────────────────── │
│ خبز برجر        مصر الجديدة   300     [200   ✏]       [100   ✏]  [✏] │
│ ─────────────────────────────────────────────────────────────────────── │
│ طماطم طازجة     المصنع         18كجم   [25كجم ✏]       [15كجم ✏]  [✏] │
│ ← 🟠 قريب من نقطة الإعادة                                              │
│ ─────────────────────────────────────────────────────────────────────── │
├──────────────────────────────────────────────────────────────────────────┤
│  ⚠ صنفان حاليًا أقل من نقطة الإعادة.   [ إنشاء طلبات شراء تلقائية ← ]│
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Configure and monitor reorder rules per SKU per location. Enables auto-PO generation when stock crosses the threshold.

**Key UX decisions:**
- Inline `[✏]` editing — no modal for simple value changes; save on blur
- Items currently breaching threshold are flagged inline with a row-level callout
- Bottom-bar action generates draft POs in SP-03 for all breaching items simultaneously
- Clicking a row expands movement history for that SKU in an inline panel

---

### IN-09 — Inventory Reports & Variance (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ المخزون ‹ تقارير الجرد والفروقات                                        │
├──────────────────────────────────────────────────────────────────────────┤
│ الفترة: [ 01/04/2026 ] → [ 28/04/2026 ]   الفرع: [الكل ▼]  [ تشغيل ] │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ إجمالي الوارد│ │إجمالي الصادر │ │ الهدر المسجل │ │ فروقات الجرد │   │
│  │  1,240 كجم  │ │  1,180 كجم  │ │   38 كجم     │ │   22 كجم    │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                                          │
│  تفاصيل فروقات الجرد                                                     │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ الصنف          المتوقع   الفعلي   الفرق    %الفرق    الفرع        │ │
│  │ لحم بقري مفروم  280كجم   272كجم   -8كجم    -2.9%   المصنع    🟡  │ │
│  │ جبن شيدر        195كجم   195كجم    0         0%     الكل      🟢  │ │
│  │ صلصة حارة        48لتر    34لتر   -14لتر  -29.2%   الدقي     🔴  │ │
│  │ خبز برجر         900       892     -8       -0.9%   مصر الجد. 🟢  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  [ 📊 رسم بياني: الهدر حسب الفئة ]   [📤 تصدير Excel]  [📄 تصدير PDF] │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Period variance report — expected vs actual stock. Identifies leakage, theft, or recording errors.

**Key UX decisions:**
- 4 KPI summary cards at top before the detail table
- Color coding: 🔴 variance > 10%, 🟡 5–10%, 🟢 < 5%
- Clicking a row expands the full movement log for that SKU in an inline panel
- Export to Excel for finance; PDF for audit trail submission

---

## Requests Screens

### RQ-05 — Request History / List (Tablet / Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ الطلبات ‹ سجل الطلبات                           [+ طلب جديد]       │
├──────────────────────────────────────────────────────────────────────┤
│ الحالة: [الكل ▼]   الفرع: [الكل ▼]   الفترة: [هذا الشهر ▼]   🔍   │
├──────────────────────────────────────────────────────────────────────┤
│ رقم الطلب  الفرع          التاريخ    الأصناف  الإجمالي  الحالة       │
│ ─────────────────────────────────────────────────────────────────── │
│ #3055     فرع العجوزة    28/04      12 صنف   850 كجم  🟡 معلق      │
│                                                   [ راجع ← ]       │
│ ─────────────────────────────────────────────────────────────────── │
│ #3054     فرع السلام     28/04       8 أصناف  420 كجم  🟡 معلق      │
│                                                   [ راجع ← ]       │
│ ─────────────────────────────────────────────────────────────────── │
│ #3042     مصر الجديدة   27/04      23 صنف  1,100 كجم ✅ تم التسليم │
│                                                   [ عرض ← ]        │
│ ─────────────────────────────────────────────────────────────────── │
│ #3041     الدقي          27/04      18 صنف   760 كجم  🚚 في الطريق  │
│                                                   [ تتبع ← ]       │
│ ─────────────────────────────────────────────────────────────────── │
│ #3038     المعادي        26/04      15 صنف   620 كجم  ✅ تم التسليم │
│                                                   [ عرض ← ]        │
│ ─────────────────────────────────────────────────────────────────── │
│                                                                      │
│                     « 1  2  3  4  5 »                               │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Filterable request history for branch managers (own requests) and factory managers (all branches). Entry point to RQ-06 (Request Detail).

**Key UX decisions:**
- Status pill drives the action label: معلق → راجع, في الطريق → تتبع, تم التسليم → عرض
- Each row is a single tap to open — no separate "details" link needed
- Filter bar collapses to icon row on tablet to save vertical space
- RTL table: rightmost column is رقم الطلب (identifier — where eye lands first)

---

### RQ-06 — Request Detail + RTL Timeline (Tablet / Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ الطلبات ‹ سجل الطلبات ‹ طلب #3042                                  │
├─────────────────────────────┬───────────────────────────────────────┤
│                             │                                       │
│  طلب #3042                  │  خط الحالة (RTL)                      │
│  فرع مصر الجديدة            │                                       │
│  27/04/2026 · 08:15 ص      │  ✅──✅──✅──✅──✅──⚪──⚪              │
│  منى محمود                  │  إنشاء موافقة تحضير شحن  استلام       │
│                             │  → يقرأ من اليمين لليسار             │
│  الحالة: ✅ تم التسليم       │                                       │
│                             │  آخر تحديث: تم الاستلام 09:48 ص      │
│  ─────────────────────────  │                                       │
│  الأصناف المطلوبة           │  ────────────────────────────────     │
│  ─────────────────────────  │  الملاحظات والمناقشة                  │
│  الصنف        المطلوب المُرسَل│  ────────────────────────────────     │
│  لحم بقري     20كجم   20كجم │  ✅ أحمد: تمت الموافقة 08:20 ص       │
│  جبن شيدر     15كجم   15كجم │  ✅ منى: تم الاستلام 09:48 ص         │
│  خبز برجر     100     100   │                                       │
│  صلصة حارة    5لتر    4لتر  │  ⚠ فرق: صلصة حارة — 1 لتر ناقص      │
│  ← 🔴 فرق مُسجَّل           │  سبب: تلف أثناء الشحن                 │
│                             │  [ عرض الإثباتات ← ]                 │
│                             │                                       │
│                             │  [ طباعة ← ]   [ تصدير PDF ← ]       │
├─────────────────────────────┴───────────────────────────────────────┤
│              [ طلب تكرار هذا الطلب ]   [ رفع نزاع ]                │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Full audit view of a single request — from creation through delivery — with every item's status and the complete discussion thread.

**Key UX decisions:**
- RTL timeline (P-04 pattern) across top of right panel — visual progress at a glance
- Items table highlights discrepancies in red inline — no separate screen needed for context
- "طلب تكرار" pre-fills a new basket with the same items (connects to RQ-08)
- "رفع نزاع" only enabled when a discrepancy exists — opens RC-05

---

### RQ-07 — Approval — Full Detail (Factory Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ الطلبات ‹ طلب #3055 — فرع العجوزة            [⏱ معلق منذ 2 ساعة]  │
├─────────────────────────────┬───────────────────────────────────────┤
│                             │                                       │
│  إجراء الموافقة             │  تفاصيل الطلب                         │
│  ──────────────────────     │  ──────────────────────────────────   │
│                             │  الصنف       المطلوب  المتاح  الفرق  │
│  [ ✅ قبول الكل ]            │  لحم بقري     25كجم   45كجم    +20   │
│                             │  جبن شيدر     20كجم  120كجم    +100  │
│  ─── أو اضبط الكميات ───    │  بطاطس مجمدة  30كجم    8كجم    -22  │
│                             │  ← 🔴 كمية غير كافية                 │
│  الصنف        الكمية المُرسَلة│  خبز برجر    150      300      +150  │
│  لحم بقري     [−][25كجم][+] │  صلصة خاصة    10لتر   22لتر    +12   │
│  جبن شيدر     [−][20كجم][+] │                                       │
│  بطاطس مجمدة  [−][ 8كجم][+] │                                       │
│  ← تعديل تلقائي للمتاح      │  ────────────────────────────────     │
│  خبز برجر     [−][150][+]   │  ملاحظة لمدير الفرع                  │
│  صلصة خاصة    [−][10لتر][+] │  ┌──────────────────────────────┐    │
│                             │  │ بطاطس ستصل غداً — سنرسل الباقي│    │
│                             │  └──────────────────────────────┘    │
│                             │                                       │
├─────────────────────────────┴───────────────────────────────────────┤
│   [ رفض الطلب ]              [ موافقة مع التعديلات ← ]              │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Factory manager's full-context approval screen. Shows availability vs requested, allows per-item quantity adjustments before approving.

**Key UX decisions:**
- Right panel shows the full request; left panel is the approval action — natural RTL reading order
- Red row (بطاطس) shows available quantity auto-filled — manager adjusts with stepper
- Note field pre-populates the "counter-offer" message sent back to branch
- "رفض الطلب" requires reason (P-09 pattern)

---

### RQ-08 — Recurring Orders / Saved Baskets (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ الطلبات ‹ الطلبات المتكررة                     [+ حفظ سلة جديدة]   │
├──────────────────────────────────────────────────────────────────────┤
│ 🔍 بحث في القوالب                                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────┐  ┌───────────────────────┐               │
│  │                       │  │                       │               │
│  │  طلب الأسبوع العادي   │  │  طلب نهاية الأسبوع    │               │
│  │  22 صنف · ~1,200 كجم │  │  18 صنف · ~950 كجم   │               │
│  │                       │  │                       │               │
│  │  آخر استخدام: 21/04  │  │  آخر استخدام: 19/04  │               │
│  │  تكرار: أسبوعي       │  │  تكرار: كل جمعة       │               │
│  │                       │  │                       │               │
│  │  [ استخدم الآن ]      │  │  [ استخدم الآن ]      │               │
│  │  [ تعديل ] [ حذف ]   │  │  [ تعديل ] [ حذف ]   │               │
│  └───────────────────────┘  └───────────────────────┘               │
│                                                                      │
│  ┌───────────────────────┐  ┌───────────────────────┐               │
│  │  طلب رمضان            │  │  [+ إضافة قالب]       │               │
│  │  30 صنف · ~1,800 كجم │  │                       │               │
│  │  آخر استخدام: —      │  │                       │               │
│  │  تكرار: موسمي        │  │                       │               │
│  │  [ استخدم الآن ]      │  │                       │               │
│  │  [ تعديل ] [ حذف ]   │  │                       │               │
│  └───────────────────────┘  └───────────────────────┘               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Saved order templates for branch managers — eliminates repetitive basket-building for regular weekly orders.

**Key UX decisions:**
- Card grid matches inventory card grid — consistent visual language
- "استخدم الآن" opens T-06 Catalog+Basket with items pre-filled — user can still edit
- Templates show last-used date so managers can judge if quantities are still appropriate
- Deleting a template requires P-09 confirmation (destructive)

---

### RQ-09 — Counter-offer / Edit & Resubmit (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ الطلبات ‹ طلب #3055 ‹ مراجعة العرض المعدّل       [⚠ عرض معدّل]     │
├─────────────────────────────┬───────────────────────────────────────┤
│                             │                                       │
│  ملاحظة من المصنع           │  مقارنة الكميات                       │
│  ──────────────────────     │  ──────────────────────────────────   │
│  "بطاطس ستصل غداً —         │  الصنف      طلبتِ   المصنع يُرسِل    │
│   سنرسل الباقي يوم غد"      │  لحم بقري   25كجم     25كجم    ✅    │
│                             │  جبن شيدر   20كجم     20كجم    ✅    │
│                             │  بطاطس مجمدة 30كجم     8كجم    🔴    │
│  ردّ مدير الفرع              │  ← ناقص 22 كجم                      │
│  ──────────────────────     │  خبز برجر   150       150      ✅    │
│  ┌─────────────────────────┐│  صلصة خاصة  10لتر    10لتر    ✅    │
│  │                         ││                                       │
│  └─────────────────────────┘│  ────────────────────────────────     │
│                             │  الإجمالي المعدّل: 213 كجم            │
│                             │  (بدلاً من 235 كجم)                   │
│                             │                                       │
│                             │                                       │
├─────────────────────────────┴───────────────────────────────────────┤
│   [ رفض العرض ]      [ قبول العرض المعدّل ← ]                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Branch manager reviews the factory's modified quantities and decides to accept or reject the counter-offer.

**Key UX decisions:**
- Side-by-side comparison — branch sees exactly what changed and by how much
- Factory's note is prominent — context for the discrepancy
- "قبول العرض المعدّل" triggers pick list generation at the factory immediately
- "رفض العرض" requires reason and re-opens the request for re-submission or escalation

---

## Logistics Screens

### LG-08 — Active Shipments List (Tablet / Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ الشحن والتتبع ‹ الشحنات النشطة              [ + شحنة جديدة ]        │
├──────────────────────────────────────────────────────────────────────┤
│ الحالة: [الكل ▼]   السائق: [الكل ▼]   الفرع: [الكل ▼]   🔍         │
├──────────────────────────────────────────────────────────────────────┤
│ الشحنة   الفرع          السائق     المركبة  الحالة        الوصول    │
│ ─────────────────────────────────────────────────────────────────── │
│ #SH-889  مصر الجديدة   محمود علي  TRK-04   🚚 في الطريق   09:30ص  │
│          مبادر · منذ 18 دقيقة                    [ تتبع ← ]         │
│ ─────────────────────────────────────────────────────────────────── │
│ #SH-888  الدقي         سامي فريد  TRK-02   🟡 تحضير        —       │
│          قائمة التحضير مكتملة 80%            [ متابعة ← ]           │
│ ─────────────────────────────────────────────────────────────────── │
│ #SH-887  المعادي        حسن عمر   TRK-01   ✅ تم التسليم   08:55ص  │
│          تسليم مؤكد · 5 دقيقة مبكرًا        [ عرض ← ]              │
│ ─────────────────────────────────────────────────────────────────── │
│ #SH-886  العجوزة        —         —        ⏳ بانتظار سائق   —      │
│          أُنشئ منذ 35 دقيقة                 [ تعيين ← ]             │
│ ─────────────────────────────────────────────────────────────────── │
│                                                                      │
│                     « 1  2  3 »                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Live operations board showing all active shipments at a glance. Dispatcher's primary working view throughout the shift.

**Key UX decisions:**
- Status pill drives inline action label — "بانتظار سائق" → تعيين (opens T-09 flow)
- Delay indicator: any shipment past ETA turns row background amber automatically
- Clicking any row opens LG-09 (Shipment Detail)
- "شحنة جديدة" creates a transfer record linked to an approved request

---

### LG-09 — Shipment Detail + Audit Trail (Tablet / Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ الشحن ‹ شحنات نشطة ‹ #SH-889                                        │
├─────────────────────────────┬───────────────────────────────────────┤
│                             │                                       │
│  شحنة #SH-889               │  مسار الشحنة (RTL)                    │
│  فرع مصر الجديدة            │  ✅──✅──🟢──⚪──⚪                     │
│  السائق: محمود علي          │  إنشاء  تحضير  انطلق  وصل   تأكيد    │
│  المركبة: TRK-04            │                                       │
│  انطلق: 09:12 ص             │  آخر موقع: 15 دقيقة من الفرع        │
│  الوصول المتوقع: 09:30 ص    │  تحديث الموقع: منذ 2 دقيقة          │
│                             │                                       │
│  ────────────────────────   │  ────────────────────────────────     │
│  الأصناف                    │  الإثباتات                            │
│  الصنف        الكمية        │  📷 صورة التحميل — 09:10 ص           │
│  لحم بقري     20 كجم        │  📝 توقيع المصنع — 09:11 ص           │
│  جبن شيدر     15 كجم        │                                       │
│  خبز برجر     100 رغيف      │  ────────────────────────────────     │
│  صلصة حارة    5 لتر         │  [ 📞 اتصال بالسائق ]                │
│                             │  [ ⚠ الإبلاغ عن تأخير ]             │
│                             │                                       │
├─────────────────────────────┴───────────────────────────────────────┤
│  [ تعديل الشحنة ]    [ إعادة التوجيه ]    [ إلغاء الشحنة ]          │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Full detail view for a single shipment — items, driver, live position, evidence, and the complete event audit trail.

**Key UX decisions:**
- RTL shipment trail mirrors P-04 (timeline pattern)
- "اتصال بالسائق" dials directly — no need to look up number
- "إلغاء الشحنة" requires P-09 confirmation with reason
- Evidence thumbnails are tappable to full-screen view

---

### LG-10 — Delay & Deviation Alerts (Mobile / Desktop)

```
       ┌─────────────────────────┐
       │                         │
       │ الشحن ‹ تنبيهات التأخير  │
       │                         │
       │  🔴 #SH-889 — تأخير     │
       │  مصر الجديدة            │
       │  متوقع 09:30 · الآن 09:48│
       │  تأخر 18 دقيقة          │
       │  السائق: محمود علي      │
       │  [ 📞 اتصال ]  [ عرض ← ]│
       │  ─────────────────────  │
       │  🟡 #SH-885 — انحراف    │
       │  الدقي                  │
       │  خرج عن المسار المحدد   │
       │  [ عرض الخريطة ← ]      │
       │  ─────────────────────  │
       │  🟡 #SH-883 — تأخير     │
       │  السلام                  │
       │  تأخر 8 دقائق           │
       │  [ 📞 اتصال ]  [ عرض ← ]│
       │                         │
       │  [ تعليم الكل مقروء ]   │
       └─────────────────────────┘
```

**Purpose:** Push-notification destination screen — dispatcher or manager taps a delay notification and lands here to triage.

**Key UX decisions:**
- P-02 bottom-sheet pattern on mobile; full table on desktop
- 🔴 = past ETA by more than 15 min, 🟡 = deviation or 5–15 min late
- "اتصال بالسائق" is the most common action — must be one tap
- Acknowledging an alert doesn't resolve it — it stays visible until shipment is delivered

---

## Receiving Screens

### RC-04 — Receiving History (Tablet / Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ الاستلام ‹ سجل الاستلام                                             │
├──────────────────────────────────────────────────────────────────────┤
│ الحالة: [الكل ▼]   الفرع: [الكل ▼]   الفترة: [هذا الأسبوع ▼]  🔍  │
├──────────────────────────────────────────────────────────────────────┤
│ الشحنة    الفرع          التاريخ    السائق       الحالة              │
│ ─────────────────────────────────────────────────────────────────── │
│ #SH-887   المعادي        28/04      حسن عمر     ✅ مكتمل            │
│           23 صنف · لا فروقات                    [ عرض ← ]          │
│ ─────────────────────────────────────────────────────────────────── │
│ #SH-885   الدقي          27/04      محمود علي   ⚠ فروقات           │
│           18 صنف · فرق: صلصة حارة -2لتر         [ عرض ← ]          │
│ ─────────────────────────────────────────────────────────────────── │
│ #SH-882   مصر الجديدة   26/04      سامي فريد   🔴 متنازع عليه      │
│           15 صنف · نزاع مفتوح                   [ نزاع ← ]          │
│ ─────────────────────────────────────────────────────────────────── │
│ #SH-880   السلام         26/04      حسن عمر     ✅ مكتمل            │
│           20 صنف · لا فروقات                    [ عرض ← ]          │
│ ─────────────────────────────────────────────────────────────────── │
│                                                                      │
│                     « 1  2  3  4 »                                  │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Audit log of all receiving events. Finance and ops use this to reconcile deliveries against orders.

**Key UX decisions:**
- Discrepancy flag visible in the row subtitle — no need to open record to know there was an issue
- Active dispute rows show "نزاع ←" link to RC-05 instead of standard "عرض ←"
- Clicking any row opens the full receiving record with evidence (T-10/T-11/T-12 read-only replay)

---

### RC-05 — Dispute Management & Escalation (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الاستلام ‹ إدارة النزاعات                                               │
├──────────────────────────────────────────────────────────────────────────┤
│ الحالة: [مفتوح ▼]   الفرع: [الكل ▼]   الفترة: [هذا الشهر ▼]           │
├──────────────────────────────────────────────────────────────────────────┤
│ الشحنة   الفرع        النوع           القيمة   الأيام  الحالة          │
│ ──────────────────────────────────────────────────────────────────────  │
│ #SH-882  مصر الجديدة  كمية ناقصة       180 ج.م    2    🔴 مفتوح        │
│          صلصة حارة: متوقع 5لتر — مُستلَم 2لتر   [ تفاصيل ← ]           │
│ ──────────────────────────────────────────────────────────────────────  │
│ #SH-875  الدقي        صنف تالف         320 ج.م    5    🟡 قيد المراجعة  │
│          جبن شيدر: 3 كجم تالفة عند الاستلام   [ تفاصيل ← ]             │
│ ──────────────────────────────────────────────────────────────────────  │
├──────────┬───────────────────────────────────────────────────────────────┤
│ #SH-882  │  الفروقات                                                     │
│ مفتوح    │  صلصة حارة — متوقع: 5لتر · مُستلَم: 2لتر · فرق: 3لتر      │
│          │                                                               │
│          │  الإثباتات المقدمة                                            │
│          │  [📷 صورة الاستلام]  [📝 توقيع السائق]                       │
│          │                                                               │
│          │  سجل التواصل                                                  │
│          │  منى (28/04): "الصندوق وصل فارغًا جزئيًا"                    │
│          │  أحمد (28/04): "جارٍ التحقق مع سائق"                        │
│          │                                                               │
│          │  الحل                                                         │
│          │  ○ قبول الخسارة (شطب)                                        │
│          │  ○ خصم من المورد / الشحن التالي                              │
│          │  ○ طلب إعادة إرسال الكمية الناقصة                            │
│          │                                                               │
│          │  [ رفض ]           [ تطبيق الحل ← ]                          │
└──────────┴───────────────────────────────────────────────────────────────┘
```

**Purpose:** Central desktop view for ops/finance to resolve open discrepancies — see evidence, review communications, and apply a resolution.

**Key UX decisions:**
- Master-detail layout: dispute list (top) + active dispute detail (bottom)
- Three resolution options cover all real-world scenarios
- Resolution action posts automatically to finance (write-off or credit note)
- Age counter (الأيام) flags disputes over 7 days as escalation risk

---

### RC-06 — Goods Receipt at Factory from Supplier (Tablet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ الاستلام ‹ استلام من مورد — أمر شراء #PO-441                       │
├─────────────────────────────┬───────────────────────────────────────┤
│                             │                                       │
│  المورد: المزرعة الذهبية    │  عناصر أمر الشراء                     │
│  رقم الإيصال: [__________]  │  ──────────────────────────────────   │
│  التاريخ: 28/04/2026        │  الصنف       المطلوب  المُستلَم        │
│                             │  لحم بقري     50كجم   [−][50][+] كجم  │
│  📷 امسح باركود الصنف       │  جبن شيدر     40كجم   [−][40][+] كجم  │
│  ─── أو اختر من القائمة     │  طماطم طازجة  30كجم   [−][28][+] كجم  │
│                             │  ← 🟡 فرق: 2 كجم                     │
│  ملاحظة عامة               │                                       │
│  ┌─────────────────────────┐│  [ + إضافة صنف غير مدرج ]            │
│  │                         ││                                       │
│  └─────────────────────────┘│  ────────────────────────────────     │
│                             │  الإجمالي المستلَم: 118 كجم           │
│  [📷 صورة بوليصة الشحن]     │  من أصل 120 كجم مطلوبة              │
│                             │                                       │
├─────────────────────────────┴───────────────────────────────────────┤
│                      [ تأكيد الاستلام ← ]                           │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Factory-side goods receipt matching supplier delivery against a Purchase Order. Same UX pattern as T-10 (branch receiving) adapted for factory/supplier context.

**Key UX decisions:**
- Linked to PO — expected quantities pulled automatically (no manual entry)
- Scan-first input (P-05 pattern) for item identification; manual selection as fallback
- Discrepancies auto-flag for supplier dispute in RC-05
- Confirmed receipt updates IN-04 (Factory Inventory) immediately

---

## Supplier Screens

### SP-02 — Supplier Profile / Detail (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموردون ‹ المزرعة الذهبية                          [ تعديل ]  [⋮ المزيد]│
├──────────────────────────────────────────────────────────────────────────┤
│  [🏢 Logo]  المزرعة الذهبية للحوم                                        │
│             فئة: لحوم ومنتجات حيوانية · الحالة: 🟢 نشط                  │
│             📞 01001234567 · 📧 orders@goldfarm.eg                        │
│             📍 العاشر من رمضان، القاهرة                                  │
├──────────────────────────────────────────────────────────────────────────┤
│  [نظرة عامة] [الطلبات] [التسليمات] [الأداء] [المستندات] [المستحقات]      │
├──────────────────────────────────────────────────────────────────────────┤
│  نظرة عامة                                                               │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────┐│
│  │ الطلبات (90 يوم│ │ في الوقت       │ │ متوسط الجودة   │ │ مستحقات  ││
│  │   18 أمر       │ │     92%        │ │     4.3/5      │ │ 4,200 ج.م││
│  └────────────────┘ └────────────────┘ └────────────────┘ └────────────┘│
│                                                                          │
│  الطلبات الأخيرة                                                         │
│  #PO-441 · 28/04 · 120كجم · 3,600 ج.م · 🟡 قيد التسليم                 │
│  #PO-428 · 21/04 · 115كجم · 3,450 ج.م · ✅ مكتمل                       │
│  #PO-415 · 14/04 · 130كجم · 3,900 ج.م · ✅ مكتمل                       │
│                                                         [ عرض الكل ← ]  │
│                                                                          │
│  [ + إنشاء أمر شراء ]                                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** 360° supplier view — contact info, KPIs, order history, and direct link to create a new PO.

**Key UX decisions:**
- Tab navigation: Overview (default), Orders, Deliveries, Performance, Documents, Payables
- 4 KPI cards are clickable and navigate to the corresponding tab
- "+ إنشاء أمر شراء" opens SP-03 pre-filled with this supplier

---

### SP-03 — Purchase Order — Create (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموردون ‹ أوامر الشراء ‹ أمر شراء جديد                                │
├──────────────────────────────────────────────────────────────────────────┤
│  المورد *  [اختر مورد ▼]              شروط الدفع *  [30 يوم ▼]           │
│  تاريخ التسليم المتوقع * [__/__/____  📅]    الفرع المستلِم: [المصنع ▼]  │
├──────────────────────────────────────────────────────────────────────────┤
│  الصنف               الكمية   الوحدة   سعر الوحدة  إجمالي الصنف         │
│  ────────────────────────────────────────────────────────────────────── │
│  [اختر صنف ▼]        [____]   [كجم ▼]  [_______]   [________]           │
│  [+ إضافة صنف]                                                           │
│  ────────────────────────────────────────────────────────────────────── │
│  لحم بقري مفروم       50      كجم       72 ج.م      3,600 ج.م    [🗑]   │
│  طماطم طازجة          30      كجم       12 ج.م        360 ج.م    [🗑]   │
│ ────────────────────────────────────────────────────────────────────── │
│                                                    الإجمالي: 3,960 ج.م  │
│                                                    الضريبة (15%): 594  │
│                                                    الإجمالي مع الضريبة: 4,554 ج.م │
│                                                                          │
│  ملاحظات للمورد                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  [ حفظ كمسودة ]                     [ إرسال للموافقة ← ]                │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Create a purchase order to a supplier. Feeds into SP-04 list and RC-06 receiving flow.

**Key UX decisions:**
- VAT calculated live as line items are added
- Line items deletable with 🗑 — no confirmation needed (draft state, recoverable)
- "إرسال للموافقة" routes to finance/manager based on value threshold
- "حفظ كمسودة" saves without routing — for incomplete orders

---

### SP-04 — Purchase Order List & Status (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموردون ‹ أوامر الشراء                    [+ أمر شراء جديد]  [تصدير]  │
├──────────────────────────────────────────────────────────────────────────┤
│ بحث: [__________]  المورد: [الكل ▼]  الحالة: [الكل ▼]  الفترة: [▼]     │
├──────────────────────────────────────────────────────────────────────────┤
│  [ ] رقم الأمر  المورد           التاريخ  المبلغ     التسليم  الحالة     │
│ ─────────────────────────────────────────────────────────────────────── │
│  [ ] #PO-441    المزرعة الذهبية  28/04   4,554 ج.م  28/04   🟡 في الطريق│
│  [ ] #PO-440    مصنع الألبان     27/04   2,200 ج.م  29/04   ✅ مكتمل    │
│  [ ] #PO-439    المخبز الذهبي   26/04     880 ج.م  27/04   ✅ مكتمل    │
│  [ ] #PO-438    شركة البستان    25/04     560 ج.م  26/04   🔴 متأخر     │
│  [ ] #PO-435    المزرعة الذهبية  22/04   3,800 ج.م  24/04   ✅ مكتمل    │
│ ─────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  [ إجراء جماعي ▼ ]                           « 1  2  3  4  5 »          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Master list of all purchase orders. Procurement and finance track status, filter, and export.

**Key UX decisions:**
- Checkbox column enables bulk export or bulk status update
- 🔴 متأخر rows auto-surface at top of list when filter is "الكل"
- Clicking any row opens SP-05 (PO Detail)

---

### SP-05 — Purchase Order Detail (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموردون ‹ أوامر الشراء ‹ #PO-441                [تعديل]  [طباعة]       │
├──────────────────────────────────────────────────────────────────────────┤
│  #PO-441 · المزرعة الذهبية · 28/04/2026                                  │
│  الحالة: 🟡 في الطريق · الدفع: 30 يوم                                    │
├──────────────────────────────────────────────────────────────────────────┤
│  الصنف               الكمية    السعر        الإجمالي                      │
│  لحم بقري مفروم       50 كجم    72 ج.م       3,600 ج.م                   │
│  طماطم طازجة          30 كجم    12 ج.م         360 ج.م                   │
│  ──────────────────────────────────────────────────────────────────────  │
│  المجموع: 3,960 · الضريبة: 594 · الإجمالي: 4,554 ج.م                   │
├──────────────────────────────────────────────────────────────────────────┤
│  خط الحالة                                                                │
│  ✅ إنشاء 28/04 09:00 ·  ✅ موافقة 28/04 09:15 ·  🟢 شحن · ⚪ استلام  │
│                                                                          │
│  استلامات مرتبطة                                                          │
│  #RC-441 · 28/04 · قيد الاستلام في المصنع                                │
│                                                            [ عرض ← ]     │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Full PO record — line items, totals with VAT, status timeline, linked receiving records.

---

### SP-06 — Supplier Performance Scorecard (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموردون ‹ تقييم الموردين                الفترة: [آخر 3 أشهر ▼]         │
├──────────────────────────────────────────────────────────────────────────┤
│  المورد              التسليم في الوقت  الجودة  معدل النزاعات  التقييم    │
│ ─────────────────────────────────────────────────────────────────────── │
│  المزرعة الذهبية          92%           4.3/5       2%        ⭐⭐⭐⭐    │
│  مصنع الألبان             88%           4.1/5       4%        ⭐⭐⭐⭐    │
│  شركة البستان             76%           3.7/5      11%        ⭐⭐⭐     │
│  المخبز الذهبي            97%           4.8/5       0%        ⭐⭐⭐⭐⭐  │
│ ─────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  [ المزرعة الذهبية ← تفاصيل ]                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ أداء التسليم في الوقت — آخر 12 شهرًا                           │    │
│  │  يناير ████████████░ 89%                                        │    │
│  │  فبراير ██████████████ 94%                                      │    │
│  │  مارس  █████████████░ 91%                                       │    │
│  │  أبريل  ████████████░░ 88%                                      │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ملاحظات                                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ تأخر مستمر في أبريل — متابعة مطلوبة                            │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Comparative supplier KPI dashboard for procurement decisions — renegotiation, switching suppliers, or preferred-supplier designation.

---

### SP-07 — Payables Aging (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموردون ‹ الذمم الدائنة — مستحقات الموردين      [تصدير]  [سداد جماعي] │
├──────────────────────────────────────────────────────────────────────────┤
│  المورد            جاري    30 يوم    60 يوم    90+ يوم    الإجمالي       │
│ ─────────────────────────────────────────────────────────────────────── │
│  المزرعة الذهبية   4,554    3,200      —          —        7,754 ج.م    │
│  مصنع الألبان      2,200      —        800         —        3,000 ج.م    │
│  شركة البستان      1,120    1,400      600       1,200      4,320 ج.م   │
│  ← ⚠ 90+ أيام — مستحق الدفع فورًا                                      │
│  المخبز الذهبي       880      —          —          —          880 ج.م   │
│ ─────────────────────────────────────────────────────────────────────── │
│  الإجمالي          8,754    4,600     1,400      1,200     15,954 ج.م   │
│                                                                          │
│  [ سداد المستحقات الفورية (1,200 ج.م) ← ]                               │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Accounts payable aging for all suppliers. Finance team uses this to prioritize payments and avoid overdue penalties.

**Key UX decisions:**
- RTL table: supplier name (identifier) on right, amounts left-to-right in aging buckets
- 90+ rows auto-highlighted — overdue is a compliance risk
- "سداد المستحقات الفورية" creates a payment batch for finance approval

---

### SP-08 — Contracts & Documents (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموردون ‹ المزرعة الذهبية ‹ المستندات           [+ رفع مستند]          │
├──────────────────────────────────────────────────────────────────────────┤
│  نوع المستند        اسم الملف              انتهاء الصلاحية  الحالة       │
│ ─────────────────────────────────────────────────────────────────────── │
│  📄 عقد التوريد     contract-2026.pdf      31/12/2026        🟢 ساري     │
│                                                   [📥 تحميل] [👁 عرض]   │
│ ─────────────────────────────────────────────────────────────────────── │
│  📋 شهادة الجودة    quality-cert-2025.pdf  30/06/2026        🟡 ينتهي قريبًا│
│                                                   [📥 تحميل] [👁 عرض]   │
│ ─────────────────────────────────────────────────────────────────────── │
│  📋 سجل تجاري       commercial-reg.pdf     15/03/2026        🔴 منتهي    │
│                                          [ تنبيه أُرسل ]  [📥 تحميل]    │
│ ─────────────────────────────────────────────────────────────────────── │
│  📋 شهادة صحية      health-cert-2026.pdf   01/11/2026        🟢 ساري     │
│                                                   [📥 تحميل] [👁 عرض]   │
│ ─────────────────────────────────────────────────────────────────────── │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Document repository per supplier. Compliance-critical for food-safety audits — expired supplier certifications are a regulatory risk.

**Key UX decisions:**
- 🔴 منتهي rows auto-trigger notification to procurement (configurable in ST-04)
- Documents cannot be deleted, only superseded — audit trail of all versions
- "شهادة صحية" and "شهادة الجودة" have mandatory fields — a supplier cannot be set Active without them

---

## HR + Payroll Screens

### HR-05 — Employee Profile / Detail (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموارد البشرية ‹ الموظفون ‹ منى محمود              [تعديل]  [⋮ المزيد] │
├──────────────────────────────────────────────────────────────────────────┤
│  [📷 صورة]  منى محمود السيد                                              │
│             مديرة فرع · فرع مصر الجديدة · الحالة: 🟢 نشطة              │
│             📞 01234567890 · 📧 mona@wahshgroup.eg                        │
│             تاريخ التوظيف: 01/03/2021 · الكود: EMP-0042                 │
├──────────────────────────────────────────────────────────────────────────┤
│  [شخصي] [التوظيف] [الحضور] [الإجازات] [المستندات] [الرواتب]             │
├──────────────────────────────────────────────────────────────────────────┤
│  التوظيف                                                                 │
│  الوظيفة: مديرة فرع           القسم: العمليات                            │
│  الفرع: مصر الجديدة           المدير المباشر: أحمد رضا                   │
│  نوع العقد: دوام كامل         الراتب الأساسي: ████████ (مخفي)             │
│  ساعات العمل: 9 ساعات/يوم     أيام الإجازة المتبقية: 18 يوم             │
│                                                                          │
│  الحضور — آخر 30 يوم                                                     │
│  حضور: 22 يوم · غياب: 0 · إجازة: 2 · تأخر: 1                           │
│                                            [ عرض التفاصيل ← ]           │
│                                                                          │
│  [ إنشاء مراجعة أداء ]    [ إضافة تدريب ]    [ تعديل الراتب ]           │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** 360° employee record. HR admin primary; manager read-only for their direct reports.

**Key UX decisions:**
- Salary field masked by default — click-to-reveal for authorized roles only
- Tab navigation mirrors SP-02 supplier profile for consistency
- All changes are audit-logged (who changed what and when)
- "تعديل الراتب" requires second-approval from finance for changes above a threshold

---

### HR-06 — Attendance — Daily View (Tablet / Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ الموارد البشرية ‹ الحضور والانصراف     [28/04/2026 ▼]  [فرع ▼]    │
├──────────────────────────────────────────────────────────────────────┤
│  ملخص اليوم                                                          │
│  ✅ حاضر: 18    🕐 متأخر: 2    🔴 غائب: 1    🏖 إجازة: 2            │
├──────────────────────────────────────────────────────────────────────┤
│ الموظف          الوردية    الدخول   الخروج   الحالة     إجراء        │
│ ─────────────────────────────────────────────────────────────────── │
│ منى محمود       صباحية     08:02ص  —        🟢 حاضر     —           │
│ كريم مصطفى      صباحية     08:45ص  —        🕐 متأخر    [تنبيه]     │
│ سامي فريد       صباحية      —      —        🔴 غائب     [تواصل]     │
│ ليلى أحمد       مسائية     —      —        ⚪ لم يبدأ   —           │
│ هدى محمد        إجازة       —      —        🏖 إجازة    [عرض ←]     │
│ ─────────────────────────────────────────────────────────────────── │
│                                                                      │
│  [ تسجيل حضور يدوي ]    [ تصدير كشف الحضور ]                        │
└─────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Daily attendance roster for branch manager or HR. Single-pane view of who's in, late, absent, or on leave.

**Key UX decisions:**
- "تسجيل حضور يدوي" for when biometric fails — requires a reason and creates an audit note
- [تواصل] button on absent row dials or messages the employee directly
- Export generates a formatted sheet compatible with payroll input

---

### HR-07 — Shifts & Rotations Management (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموارد البشرية ‹ الورديات والجداول     الأسبوع: 28/04 – 04/05    [+]   │
├──────────────────────────────────────────────────────────────────────────┤
│ الفرع: [مصر الجديدة ▼]                                                   │
├─────────────────┬──────┬──────┬──────┬──────┬──────┬──────┬─────────────┤
│ الموظف          │ أحد  │ إثنين│ ثلاثاء│ أربعاء│ خميس│ جمعة │ السبت      │
├─────────────────┼──────┼──────┼──────┼──────┼──────┼──────┼─────────────┤
│ منى محمود       │ ص    │ ص    │ ص    │ ص    │ ص    │  —   │  —          │
│ كريم مصطفى      │ ص    │ ص    │  —   │ ص    │ ص    │ م    │  م          │
│ سامي فريد       │  —   │ م    │ م    │ م    │ م    │ م    │  —          │
│ ليلى أحمد       │ م    │  —   │ م    │ م    │  —   │ م    │  م          │
├─────────────────┴──────┴──────┴──────┴──────┴──────┴──────┴─────────────┤
│  ص = صباحية (08:00–17:00)  م = مسائية (15:00–00:00)  — = إجازة/عطلة   │
│                                                                          │
│  ⚠ الثلاثاء: فرع مصر الجديدة — وردية مسائية بموظف واحد فقط             │
│                                        [ حل التعارض ← ]                │
│                                                                          │
│  [ حفظ الجدول ]              [ نشر للفريق ← ]                           │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Weekly shift planner per branch. HR and branch managers assign rotations and detect staffing gaps.

**Key UX decisions:**
- Grid cells are clickable to toggle/change shift type — drag optional
- Inline conflict alert: minimum-staffing rule violation highlighted automatically
- "نشر للفريق" sends the finalized schedule to all affected employees via push notification
- Weekend/holiday columns are greyed out by default (configurable per branch)

---

### HR-08 — Leave Management — Manager View (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموارد البشرية ‹ الإجازات ‹ طلبات معلقة                 [سجل الإجازات] │
├──────────────────────────────────────────────────────────────────────────┤
│  الموظف        نوع الإجازة   من        إلى       أيام   الرصيد  إجراء   │
│ ─────────────────────────────────────────────────────────────────────── │
│  كريم مصطفى    سنوية         01/05     07/05      7      18     معلق    │
│  تقدم بالطلب: 26/04 · لا يوجد تعارض في الورديات                        │
│               [ رفض ] [ موافقة ← ]                                      │
│ ─────────────────────────────────────────────────────────────────────── │
│  سامي فريد     مرضية         28/04     29/04      2      12     معلق    │
│  تقدم بالطلب: 28/04 · ⚠ يوافق ورديته غداً — يحتاج بديل                │
│               [ رفض ] [ موافقة مع تعيين بديل ← ]                       │
│ ─────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  ✅ تمت الموافقة هذا الأسبوع: 3 طلبات                                   │
│  ❌ رُفض هذا الأسبوع: 1 طلب                                             │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Manager's approval queue for leave requests from their team.

**Key UX decisions:**
- Shift conflict warning appears inline — manager sees the risk without navigating away
- "موافقة مع تعيين بديل" opens HR-07 shift planner in a side panel pre-filtered to the conflict date
- Rejection requires a reason (sent to employee via notification)

---

### HR-09 — Leave Calendar (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموارد البشرية ‹ تقويم الإجازات          مايو 2026     [< >]  [فرع ▼] │
├──────────────────────────────────────────────────────────────────────────┤
│  أحد    إثنين   ثلاثاء  أربعاء  خميس    جمعة    سبت                     │
│ ─────────────────────────────────────────────────────────────────────── │
│   3       4       5       6       7       8       9                      │
│                 [كريم]  [كريم]  [كريم]  [كريم]  [كريم]                  │
│ ─────────────────────────────────────────────────────────────────────── │
│  10      11      12      13      14      15      16                      │
│                                                                          │
│ ─────────────────────────────────────────────────────────────────────── │
│  ⚠ مايو 3–7: كريم مصطفى إجازة سنوية · الغطاء: يلزم تعيينه             │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│  مفتاح الألوان                                                           │
│  🟦 سنوية   🟨 مرضية   🟧 طارئة   🟥 بدون راتب                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Visual calendar of approved leaves for scheduling and coverage planning. Prevents understaffing surprises.

**Key UX decisions:**
- Overlap alert fires when ≥ 40% of a branch team is on leave on the same day (threshold configurable)
- Hijri date overlay available as a toggle (for Ramadan/Eid leave planning)
- Clicking a leave block opens the employee's HR-05 profile leave tab

---

### HR-10 — Performance Reviews (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموارد البشرية ‹ مراجعات الأداء          [+ دورة مراجعة جديدة]         │
├──────────────────────────────────────────────────────────────────────────┤
│  الدورة النشطة: Q1 2026 · الموعد النهائي: 30/04/2026                    │
│  مكتمل: 12/18 موظف (67%)   [░░░░░░░░░░░░░░░░░░░░░░ 67%]               │
├──────────────────────────────────────────────────────────────────────────┤
│  الموظف          الدور          التقييم الذاتي  تقييم المدير   الحالة   │
│ ─────────────────────────────────────────────────────────────────────── │
│  منى محمود       مديرة فرع      ✅ مكتمل        ✅ مكتمل        ✅ مغلق  │
│                                                     [ عرض ← ]          │
│  كريم مصطفى      كاشير          ✅ مكتمل        ⏳ معلق         🟡 قيد   │
│                                                     [ أكمل ← ]         │
│  سامي فريد       سائق           ⏳ معلق         —              🔴 متأخر  │
│                                                     [ تذكير ] [ افتح ←]│
│ ─────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  [ تصدير نتائج الدورة ]                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Review cycle management — tracks completion of self-assessment and manager review for every employee.

**Key UX decisions:**
- Progress bar at top: HR can see the cycle completion at a glance
- "تذكير" sends a push notification to the employee or manager without any additional steps
- Review form (on click) scores against configurable KPIs: attendance, targets, behavior, food-safety compliance

---

### HR-11 — Training Records (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموارد البشرية ‹ التدريب والشهادات         [+ تسجيل تدريب]  [تصدير]   │
├──────────────────────────────────────────────────────────────────────────┤
│ الموظف: [الكل ▼]   نوع التدريب: [الكل ▼]   الحالة: [الكل ▼]            │
├──────────────────────────────────────────────────────────────────────────┤
│  الموظف        التدريب              التاريخ    النتيجة  الشهادة  الانتهاء│
│ ─────────────────────────────────────────────────────────────────────── │
│  منى محمود     سلامة غذائية HACCP   15/01/2026   ناجح    📋 PDF  15/01/2028│
│  منى محمود     مكافحة الحريق        20/03/2026   ناجح    📋 PDF  20/03/2027│
│  كريم مصطفى    سلامة غذائية         10/02/2026   ناجح    📋 PDF  10/02/2028│
│  سامي فريد     قيادة آمنة           05/12/2025   ناجح    📋 PDF  05/12/2026│
│  ← ⚠ سامي فريد: شهادة قيادة تنتهي خلال 2 أشهر                         │
│ ─────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  ⚠ 3 موظفين يحتاجون تجديد تدريب السلامة الغذائية قبل 01/06              │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Training compliance log. Food safety and HACCP certifications are legally mandatory — expiry tracking is critical.

**Key UX decisions:**
- Expiry alerts fire to HR and the employee's manager (configurable lead time in ST-04)
- Certificate PDF linked per row — directly downloadable for audit submission
- Aggregate compliance warning at bottom: flags approaching deadlines across the team

---

### HR-12 — Payslip View (Mobile / Desktop)

```
       ┌─────────────────────────┐
       │                         │
       │  راتب أبريل 2026         │
       │  كريم مصطفى             │
       │  كاشير · مصر الجديدة   │
       │                         │
       │  ─────────────────────  │
       │  الإيرادات              │
       │  الراتب الأساسي  3,500  │
       │  بدل المواصلات    300   │
       │  أوفر تايم (8 ساعة) 280 │
       │  ─────────────────────  │
       │  إجمالي الإيرادات 4,080  │
       │                         │
       │  الخصومات               │
       │  تأمينات اجتماعية  440   │
       │  ضريبة دخل        180   │
       │  ─────────────────────  │
       │  إجمالي الخصومات   620   │
       │                         │
       │  ══════════════════════  │
       │  صافي الراتب      3,460  │
       │  ══════════════════════  │
       │                         │
       │  [ 📥 تحميل PDF ]       │
       │  [ عرض الأشهر السابقة ] │
       └─────────────────────────┘
```

**Purpose:** Employee self-service payslip view. Accessible from M-06 (Employee Self-Service) and HR-05 (Employee Profile).

**Key UX decisions:**
- PDF download generates an Arabic-formatted payslip compliant with Egyptian labor law
- "عرض الأشهر السابقة" shows a list of past 12 payslips
- Salary figures always show after biometric/PIN re-authentication (privacy protection)

---

### HR-13 — Documents & Certifications (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الموارد البشرية ‹ منى محمود ‹ المستندات       [+ رفع مستند]             │
├──────────────────────────────────────────────────────────────────────────┤
│  نوع المستند          اسم الملف              انتهاء الصلاحية  الحالة    │
│ ─────────────────────────────────────────────────────────────────────── │
│  📄 عقد العمل         contract-mona-2024.pdf  31/12/2026       🟢 ساري  │
│                                                    [📥] [👁 عرض]        │
│  📋 بطاقة رقم قومي    national-id-mona.pdf    22/08/2028       🟢 ساري  │
│                                                    [📥] [👁 عرض]        │
│  📋 شهادة سلامة غذائية food-safety-mona.pdf   15/01/2028       🟢 ساري  │
│                                                    [📥] [👁 عرض]        │
│  📋 شهادة طبية         health-cert-mona.pdf   30/06/2026       🟡 تنتهي قريبًا│
│                                          [ إرسال تذكير ] [📥] [👁 عرض] │
│ ─────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  ✅ جميع المستندات الإلزامية موجودة                                      │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Per-employee compliance document store. Mandatory for food-safety audits and labor inspection.

**Key UX decisions:**
- Same pattern as SP-08 (Supplier Documents) — consistent mental model
- "الشهادة الطبية" is mandatory; employee cannot be set Active without a valid copy
- Documents are versioned — uploading a new copy archives the old one

---

## Finance Screens

### FN-02 — Receivables (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ المالية ‹ الذمم المدينة                    [تصدير]  [+ قيد جديد]        │
├──────────────────────────────────────────────────────────────────────────┤
│ بحث: [__________]   الفرع: [الكل ▼]   الفترة: [▼]                       │
├──────────────────────────────────────────────────────────────────────────┤
│  العميل/الفرع      جاري      30 يوم    60 يوم    90+ يوم    الإجمالي    │
│ ─────────────────────────────────────────────────────────────────────── │
│  فرع مصر الجديدة  12,400      —         —          —       12,400 ج.م  │
│  فرع الدقي         8,200     1,500       —          —        9,700 ج.م  │
│  فرع المعادي       9,100       800       300         —       10,200 ج.م │
│  فرع العجوزة       7,600     2,200       —         400       10,200 ج.م │
│  ← ⚠ فرع العجوزة: 400 ج.م مستحقة 90+ يوم                              │
│ ─────────────────────────────────────────────────────────────────────── │
│  الإجمالي         37,300     4,500       300        400      42,500 ج.م │
│                                                                          │
│  [ تسجيل مدفوعات وردية ]   [ كشف حساب بالبريد ]                         │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Inter-branch and inter-entity receivables aging. For a food group with multiple branches reporting to one finance function.

---

### FN-03 — Payables (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ المالية ‹ الذمم الدائنة                   [تصدير]  [سداد جماعي]         │
├──────────────────────────────────────────────────────────────────────────┤
│  المورد            جاري      30 يوم    60 يوم    90+ يوم    الإجمالي    │
│ ─────────────────────────────────────────────────────────────────────── │
│  المزرعة الذهبية   4,554     3,200       —          —        7,754 ج.م  │
│  مصنع الألبان      2,200       —         800         —        3,000 ج.م  │
│  شركة البستان      1,120     1,400       600       1,200      4,320 ج.م  │
│  المخبز الذهبي       880       —          —          —          880 ج.م  │
│ ─────────────────────────────────────────────────────────────────────── │
│  الإجمالي          8,754     4,600     1,400      1,200     15,954 ج.م  │
│                                                                          │
│  [ جدول المدفوعات القادمة ]   [ سداد مستحقات 90+ يوم ← ]               │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Supplier payables aging. Finance tracks cash-outflow obligations and prioritizes payments. Mirrors SP-07 but from finance's GL perspective.

---

### FN-04 — Cash & Bank (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ المالية ‹ الخزينة والبنوك                        [+ حساب جديد]          │
├──────────────────────────────────────────────────────────────────────────┤
│  الحسابات البنكية                                                        │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐         │
│  │ البنك الأهلي     │ │ بنك QNB          │ │ صندوق النقدية   │         │
│  │ ح/ج تشغيلي       │ │ ح/ج رواتب        │ │ المصنع + الفروع │         │
│  │                  │ │                  │ │                  │         │
│  │  284,500 ج.م     │ │   92,000 ج.م     │ │   18,400 ج.م    │         │
│  │ آخر تحديث: 08:00 │ │ آخر تحديث: 08:00│ │ آخر تحديث: يدوي│         │
│  │ [ مطابقة ← ]    │ │ [ مطابقة ← ]    │ │ [ إدخال ← ]    │         │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘         │
│                                                                          │
│  آخر المعاملات                                                           │
│  28/04 · رواتب أبريل · -42,000 ج.م · بنك QNB                           │
│  28/04 · دفعة المزرعة الذهبية · -7,754 ج.م · البنك الأهلي              │
│  27/04 · إيرادات الفروع · +31,200 ج.م · البنك الأهلي                   │
│                                              [ عرض الكل ← ]             │
│                                                                          │
│  حالة المطابقة: البنك الأهلي ✅ · QNB ✅ · النقدية 🟡 غير مكتمل          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Cash and bank position view. Finance monitors balances and reconciliation status daily.

**Key UX decisions:**
- Each account card shows last-sync time — stale data is flagged automatically
- Reconciliation status inline — "غير مكتمل" links directly to the unmatched transactions

---

### FN-05 — Branch P&L (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ المالية ‹ أرباح وخسائر الفروع          الفترة: [أبريل 2026 ▼]  [تصدير]│
├──────────────────────────────────────────────────────────────────────────┤
│                    مصر الجديدة   الدقي    المعادي   العجوزة   الإجمالي   │
│ ────────────────────────────────────────────────────────────────────── │
│  الإيرادات          84,200       62,400    71,800    55,600   274,000   │
│  تكلفة البضائع      30,312       22,464    25,848    22,240    100,864  │
│  نسبة تكلفة الغذاء  36%          36%       36%       40% 🔴    37%      │
│  ─────────────────────────────────────────────────────────────────────  │
│  مصاريف العمالة     18,000       16,000    17,500    16,000    67,500   │
│  مصاريف التشغيل      8,400        6,500     7,200     5,800    27,900   │
│  ─────────────────────────────────────────────────────────────────────  │
│  إجمالي المصاريف    56,712       44,964    50,548    44,040   196,264   │
│  ─────────────────────────────────────────────────────────────────────  │
│  صافي الربح         27,488       17,436    21,252    11,560    77,736   │
│  هامش الربح           33%          28%       30%       21% 🔴    28%     │
│                                                                          │
│  ⚠ فرع العجوزة: تكلفة غذاء مرتفعة (40%) وهامش ربح ضعيف (21%)         │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Comparative P&L across all branches for a given period. Immediately surfaces underperforming branches.

**Key UX decisions:**
- Side-by-side branch comparison is the primary view — clicking a branch name drills into its detailed transactions
- 🔴 flags auto-trigger on food cost > 38% or profit margin < 25% (configurable thresholds)
- Tapping the "مصر الجديدة" column header sorts all metrics by that branch for a per-branch deep-dive

---

### FN-06 — Inter-branch Settlements (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ المالية ‹ التسويات بين الفروع              [+ تسوية جديدة]  [تصدير]     │
├──────────────────────────────────────────────────────────────────────────┤
│  الفترة: [أبريل 2026 ▼]   الفرع: [الكل ▼]                              │
├──────────────────────────────────────────────────────────────────────────┤
│  التحويل      من            إلى            المبلغ    السبب    الحالة    │
│ ─────────────────────────────────────────────────────────────────────── │
│  #ST-201      المصنع المركزي فرع مصر الجديدة 12,400  بضائع    ✅ مرحّل  │
│  #ST-200      المصنع المركزي فرع الدقي         9,700  بضائع    ✅ مرحّل  │
│  #ST-199      فرع المعادي    مصر الجديدة         800  تسوية    ⏳ معلق   │
│                                               [ موافقة ]  [ رفض ]       │
│ ─────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  ملاحظة: التسويات المعلقة تؤثر على P&L الفروع حتى ترحيلها              │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Records and approves internal financial flows between branches and factory. Ensures accurate branch-level P&L.

---

### FN-07 — Product Costing (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ المالية ‹ تكلفة المنتجات              [الفرع: المصنع ▼]  [+ منتج جديد] │
├──────────────────────────────────────────────────────────────────────────┤
│  المنتج         تكلفة المواد  عمالة  عبء عام   الإجمالي  سعر البيع  الهامش│
│ ─────────────────────────────────────────────────────────────────────── │
│  وحش برجر كلاسيك   18.50      4.20    2.80      25.50      75.00   66%   │
│  وحش برجر دبل      28.40      4.20    2.80      35.40      99.00   64%   │
│  كبابجي مشكل       22.00      4.20    2.80      29.00      85.00   66%   │
│                                                                          │
│  [ وحش برجر كلاسيك ← تفاصيل الوصفة ]                                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ لحم بقري مفروم    150 جم × 80 ج.م/كجم   =  12.00 ج.م            │   │
│  │ خبز برجر           1 رغيف × 2.00         =   2.00 ج.م            │   │
│  │ جبن شيدر          30 جم × 120 ج.م/كجم    =   3.60 ج.م            │   │
│  │ مكونات أخرى                               =   0.90 ج.م            │   │
│  │ ─────────────────────────────────────────────────────────────    │   │
│  │ إجمالي المواد: 18.50 ج.م                                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Recipe-level product costing. Links ingredient prices from purchasing to per-unit COGS. Essential for pricing decisions.

**Key UX decisions:**
- Recipe detail expands inline — no separate screen needed for a quick check
- When ingredient prices change (new PO), costing auto-recalculates and flags margin changes
- Margin thresholds (< 55% flags 🔴) configurable in ST-01

---

### FN-08 — Budget & Forecast (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ المالية ‹ الميزانية والتوقعات          [Q2 2026 ▼]  [تعديل الميزانية]  │
├──────────────────────────────────────────────────────────────────────────┤
│               الميزانية    الفعلي    الفرق     %الفرق   التوقع Q3        │
│ ─────────────────────────────────────────────────────────────────────── │
│  الإيرادات     280,000    274,000   -6,000    -2.1%     295,000          │
│  تكلفة غذاء    100,800     100,864     +64     +0.1%     104,000         │
│  عمالة          68,000      67,500    -500     -0.7%      69,000         │
│  تشغيل          28,000      27,900    -100     -0.4%      28,500         │
│ ─────────────────────────────────────────────────────────────────────── │
│  صافي الربح     83,200      77,736   -5,464    -6.6% 🔴   93,500         │
│                                                                          │
│  ⚠ الإيرادات أقل من الميزانية بـ 2.1% — راجع أداء فرع العجوزة           │
│                                                                          │
│  [ تحديث التوقع ← ]    [ تصدير للإدارة ← ]                              │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Budget vs actual tracking with rolling Q3 forecast. Used by CFO and finance manager for monthly business review.

---

### FN-09 — Financial Reports (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ المالية ‹ التقارير المالية                                               │
├──────────────────────────────────────────────────────────────────────────┤
│  نوع التقرير *          الفترة *              الفرع                      │
│  ○ قائمة الدخل          [ من: __ إلى: __ ]    [الكل ▼]                  │
│  ○ الميزانية العمومية                                                    │
│  ○ التدفقات النقدية                                                      │
│                                             [ تشغيل التقرير ]            │
│ ─────────────────────────────────────────────────────────────────────── │
│  قائمة الدخل — أبريل 2026 — جميع الفروع                                 │
│                                                                          │
│  الإيرادات                           274,000 ج.م                        │
│    مبيعات الطعام                     268,500 ج.م                        │
│    إيرادات أخرى                        5,500 ج.م                        │
│  تكلفة البضائع المباعة              -100,864 ج.م                        │
│  ─────────────────────────────────────────────────────────              │
│  مجمل الربح                          173,136 ج.م       63%              │
│  مصاريف التشغيل                      -95,400 ج.م                        │
│  ─────────────────────────────────────────────────────────              │
│  صافي الربح                           77,736 ج.م        28%             │
│                                                                          │
│  [📤 تصدير Excel]    [📄 تصدير PDF]    [📧 إرسال بالبريد]               │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** On-demand financial statement generator. Finance manager and CFO use this for monthly closes and board reporting.

---

### FN-10 — VAT & Tax (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ المالية ‹ الضرائب وضريبة القيمة المضافة      الفترة: [أبريل 2026 ▼]    │
├──────────────────────────────────────────────────────────────────────────┤
│  ملخص الفترة                                                             │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐         │
│  │ المبيعات الخاضعة │ │ ضريبة المخرجات   │ │ ضريبة المدخلات  │         │
│  │    268,500 ج.م   │ │    40,275 ج.م    │ │    18,340 ج.م   │         │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘         │
│                                                                          │
│  صافي الضريبة المستحقة: 21,935 ج.م                                      │
│  موعد التقديم لهيئة الضرائب: 30/05/2026                                 │
│  الحالة: 🟡 تحت الإعداد                                                  │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│  فاتورة إلكترونية — تكامل e-invoice (ETA)                               │
│  الفواتير المُصدَرة هذا الشهر: 4,218 فاتورة · آخر مزامنة: 08:00 ص      │
│  الحالة: 🟢 متصل                                                         │
│                                                                          │
│  [ تقرير ضريبة VAT الكامل ]   [📤 تصدير بصيغة ETA]   [تقديم ←]        │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** VAT period summary with ETA (Egyptian Tax Authority) e-invoice integration status. Finance submits directly from this screen.

**Key UX decisions:**
- ETA integration status visible — any sync failure alerts immediately via ST-04 notifications
- "تصدير بصيغة ETA" generates the XML format required for the e-invoice portal
- Countdown to filing deadline auto-displayed when < 15 days away

---

## Settings Screens

### ST-01 — System Settings (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الإعدادات ‹ إعدادات النظام                                               │
├──────────────────────────────────────────────────────────────────────────┤
│  [عام] [التخصيص] [التوطين] [الإشعارات] [الأمان] [الفواتير]              │
├──────────────────────────────────────────────────────────────────────────┤
│  عام                                                                     │
│                                                                          │
│  اسم الشركة            [مجموعة الوحش للأغذية            ]               │
│  العملة الرئيسية        [ج.م — جنيه مصري ▼]                             │
│  المنطقة الزمنية        [Africa/Cairo UTC+3 ▼]                          │
│  تنسيق التاريخ          [DD/MM/YYYY ▼]                                   │
│  نوع الأرقام            [● غربية (0–9)  ○ عربية (٠–٩)]                  │
│  اللغة الافتراضية       [● عربية  ○ English]                             │
│  تقويم العرض            [● ميلادي  ○ هجري  ○ كلاهما]                    │
│                                                                          │
│  حدود الموافقة (التحويلات الداخلية)                                      │
│  يتطلب موافقة عند تجاوز: [5,000 ج.م ]                                   │
│                                                                          │
│  حدود الموافقة (الطلبات)                                                 │
│  يتطلب موافقة ثانية عند تجاوز: [10,000 ج.م ]                            │
│                                                                          │
│                                         [ حفظ الإعدادات ← ]             │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Global system configuration. Admin-only. Settings here cascade to all branches unless overridden at branch level.

---

### ST-02 — User & Roles Management (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الإعدادات ‹ المستخدمون والصلاحيات         [+ مستخدم جديد]  [+ دور جديد]│
├──────────────────────────────────────────────────────────────────────────┤
│  [المستخدمون] [الأدوار]                                                  │
├──────────────────────────────────────────────────────────────────────────┤
│  المستخدمون                                                               │
│  الاسم          البريد               الدور          الفرع    الحالة       │
│ ─────────────────────────────────────────────────────────────────────── │
│  منى محمود      mona@wahsh.eg        مدير فرع       مصر الجديدة 🟢 نشط  │
│                                         [ تعديل ] [ إيقاف ]              │
│  أحمد رضا       ahmed@wahsh.eg       مدير عمليات    المصنع     🟢 نشط   │
│                                         [ تعديل ] [ إيقاف ]              │
│  محمود علي      mahmoud@wahsh.eg     سائق           —          🟢 نشط   │
│                                         [ تعديل ] [ إيقاف ]              │
│  كريم مصطفى    karim@wahsh.eg        موظف           مصر الجديدة 🟢 نشط  │
│                                         [ تعديل ] [ إيقاف ]              │
│ ─────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  الأدوار المتاحة                                                          │
│  مدير فرع · مدير عمليات · سائق · موظف · مسؤول HR · محاسب · مدير عام    │
│                                          [ إدارة الصلاحيات ← ]          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** User provisioning and role-based access control. Admin assigns roles that control module visibility and action permissions.

**Key UX decisions:**
- "إيقاف" deactivates immediately — employee leaves the company; account locked, data preserved
- Role permissions matrix (on "إدارة الصلاحيات"): grid of modules × roles with read/write/approve toggles

---

### ST-03 — Branch Configuration (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الإعدادات ‹ إدارة الفروع                     [+ إضافة فرع]              │
├──────────────────────────────────────────────────────────────────────────┤
│  الاسم              النوع        الحالة   آخر نشاط    إجراء              │
│ ─────────────────────────────────────────────────────────────────────── │
│  المصنع المركزي     مصنع         🟢 نشط   28/04 09:00  [ إعداد ← ]      │
│  فرع مصر الجديدة   فرع          🟢 نشط   28/04 08:52  [ إعداد ← ]      │
│  فرع الدقي          فرع          🟢 نشط   28/04 08:45  [ إعداد ← ]      │
│  فرع المعادي        فرع          🟢 نشط   28/04 08:30  [ إعداد ← ]      │
│  فرع العجوزة        فرع          🟢 نشط   28/04 08:38  [ إعداد ← ]      │
│  فرع السلام         فرع          🟡 إعداد 22/04         [ أكمل ← ]      │
│ ─────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  [فرع مصر الجديدة ← تفاصيل]                                              │
│  العنوان: مدينة نصر، القاهرة                                             │
│  ساعات الاستلام: 07:00 – 10:00 ص                                        │
│  حد الطلب اليومي: 2,000 ج.م                                              │
│  المورد الافتراضي: المزرعة الذهبية                                       │
│  رمز QR للجهاز: [ إنشاء QR ← ] (يُستخدم في A-04)                       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Add and configure branches. Each branch has its own operational settings; the QR code generated here links tablets to the branch (used in A-04).

---

### ST-04 — Notification Preferences (Tablet / Mobile / Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الإعدادات ‹ الإشعارات                     [ الدور: مدير فرع ▼ ]         │
├──────────────────────────────────────────────────────────────────────────┤
│  الحدث                         إشعار فوري   SMS   بريد   داخل التطبيق  │
│ ─────────────────────────────────────────────────────────────────────── │
│  شحنة وصلت للاستلام            [✓]          [✓]   [ ]    [✓]           │
│  طلب مرفوض من المصنع           [✓]          [ ]   [✓]    [✓]           │
│  صنف قريب من انتهاء الصلاحية   [✓]          [ ]   [ ]    [✓]           │
│  موافقة مطلوبة (طلب معلق)      [✓]          [ ]   [ ]    [✓]           │
│  فروقات مسجلة عند الاستلام     [✓]          [✓]   [ ]    [✓]           │
│  موظف غائب دون إشعار          [✓]          [ ]   [ ]    [✓]           │
│ ─────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  ساعات الصمت                                                             │
│  من [11:00 م] إلى [07:00 ص]  — (P0 الطارئة تُرسَل دائمًا)              │
│                                                                          │
│  ملاحظة: هذه هي الإعدادات الافتراضية للدور.                              │
│  يمكن لكل موظف تعديل إعداداته الشخصية من ملفه.                          │
│                                         [ حفظ ← ]                       │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Per-role notification routing configuration. Controls which events trigger which channel for each role type.

**Key UX decisions:**
- P0 critical alerts (expired goods, shipment dispute) ignore quiet hours — always delivered
- Individual employee overrides are in their profile (HR-05) not here — this sets role defaults
- SMS is opt-in per event — cost consideration for the group

---

### ST-05 — Integrations & API Config (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ الإعدادات ‹ التكاملات والـ API                                           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐                     │
│  │ 🧾 هيئة الضرائب ETA  │  │ 📊 نظام POS           │                    │
│  │ e-invoice Portal     │  │ Foodics / iKhata      │                    │
│  │ الحالة: 🟢 متصل     │  │ الحالة: 🟡 غير مُعدّ  │                    │
│  │ آخر مزامنة: 08:00ص  │  │                       │                    │
│  │ [ إعداد ] [ سجل ]   │  │ [ ربط الآن ← ]        │                    │
│  └──────────────────────┘  └──────────────────────┘                     │
│                                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐                     │
│  │ 💳 بوابة الدفع       │  │ 📦 نظام المحاسبة      │                    │
│  │ Paymob / Fawry       │  │ QuickBooks / Odoo     │                    │
│  │ الحالة: 🟢 متصل     │  │ الحالة: 🔴 خطأ        │                    │
│  │ [ إعداد ] [ سجل ]   │  │ [ تشخيص ← ]          │                    │
│  └──────────────────────┘  └──────────────────────┘                     │
│                                                                          │
│  مفاتيح API الخارجية                                                     │
│  [+ إضافة مفتاح]                                                        │
│  wahsh-mobile-app  ·  أُنشئ 01/01/2026  ·  آخر استخدام: منذ دقيقة     │
│                                              [ تجديد ] [ إلغاء ]        │
│                                                                          │
│  سجل Webhook — آخر 10 أحداث        [ عرض الكل ← ]                       │
└──────────────────────────────────────────────────────────────────────────┘
```

**Purpose:** Admin-level integration management. Connects the ERP to ETA tax portal, POS systems, payment gateways, and external accounting.

**Key UX decisions:**
- Card per integration: status, last-sync, and primary action all visible without opening a detail page
- 🔴 خطأ card surfaces at top of the page automatically
- Webhook log for debugging integration failures without needing developer access

---

## Updated Cross-Reference Index

| Screen | Module | Surface | Strategy Section | Persona |
|---|---|---|---|---|
| T-01 Login | Auth | T | §3 RTL | All |
| T-02 Home (Branch) | Dashboard | T | §1.A IA | Mona |
| T-03 Inventory | Inventory | T | §1.B Module 1 | Mona, Ahmed |
| T-04 Item Detail | Inventory | T | §1.B Module 1 | Mona, Ahmed |
| T-05 Request Templates | Requests | T | §6 Journey 1 | Mona |
| T-06 Request Catalog | Requests | T | §6 Journey 1 | Mona |
| T-07 Request Review | Requests | T | §6 Journey 1 | Mona |
| T-08 Pick List | Logistics | T | §11 Sending | Factory |
| T-09 Assign Driver | Logistics | T | §11 Sending | Dispatcher |
| T-10 Receive | Receiving | T | §11 Receiving | Mona |
| T-11 Discrepancy | Receiving | T | §11 Receiving | Mona |
| T-12 Signature | Receiving | T | §11 Receiving | Mona |
| T-13 Cycle Count | Inventory | T | §1.B Module 1 | Mona |
| T-14 Suppliers | Suppliers | T | §1.B Module 5 | Ahmed |
| T-15 Audit Log | Audit | T | §10.F | All |
| M-01 Driver Home | Logistics | M | §5 Persona 3 | Mahmoud |
| M-02 Trip Detail | Logistics | M | §5 Persona 3 | Mahmoud |
| M-03 POD | Logistics | M | §5 Persona 3 | Mahmoud |
| M-04 Quick Approval | Requests | M | §6 Journey 1 | Ahmed |
| M-05 Mobile Branch | Dashboard | M | §5 Persona 2 | Mona |
| M-06 Employee Self | HR | M | §5 Persona 5 | Karim |
| M-07 Leave Request | HR | M | §1.B Module 6 | Karim |
| D-01 Exec Dashboard | Dashboard | D | §5 Persona 4 | Sarah |
| D-02 Dispatch Board | Logistics | D | §1.B Module 3 | Ahmed |
| D-03 Live Map | Logistics | D | §1.B Module 3 | Ahmed, Sarah |
| D-04 Reports | Finance | D | §1.B Module 8 | Sarah, Finance |
| D-05 Employees | HR | D | §1.B Module 6 | HR |
| D-06 Payroll | HR | D | §1.B Module 6 | Finance |
| D-07 Audit Search | Audit | D | §10.F | Admin |
| A-02 Login Desktop | Auth | D | §3 RTL | All |
| A-03 Login Mobile | Auth | M | §3 RTL | All |
| A-04 Enrollment | Auth | T/M | §2.A Tablet | Admin |
| A-05 PIN Reset | Auth | T/M | §2.A Tablet | All |
| DA-04 Factory Dashboard | Dashboard | T | §1.B Module 8 | Ahmed |
| DA-05 Factory Desktop | Dashboard | D | §1.B Module 8 | Ahmed |
| IN-04 Factory Inventory | Inventory | T | §1.B Module 1 | Factory |
| IN-05 Internal Transfer | Inventory | T | §1.B Module 1 | Ahmed |
| IN-06 Expiry Alerts | Inventory | T/D | §1.B Module 1 | All |
| IN-07 Waste Log | Inventory | T | §1.B Module 1 | Kitchen Staff |
| IN-08 Reorder Points | Inventory | D | §1.B Module 1 | Ahmed |
| IN-09 Inventory Reports | Inventory | D | §1.B Module 1 | Ahmed, Sarah |
| RQ-05 Request History | Requests | T/D | §6 Journey 1 | Mona, Ahmed |
| RQ-06 Request Detail | Requests | T/D | §6 Journey 1 | All |
| RQ-07 Full Approval | Requests | T | §6 Journey 1 | Ahmed |
| RQ-08 Recurring Orders | Requests | T | §6 Journey 1 | Mona |
| RQ-09 Counter-offer | Requests | T | §6 Journey 1 | Mona |
| LG-08 Shipments List | Logistics | T/D | §1.B Module 3 | Dispatcher |
| LG-09 Shipment Detail | Logistics | T/D | §1.B Module 3 | Dispatcher |
| LG-10 Delay Alerts | Logistics | M/D | §1.B Module 3 | Ahmed |
| RC-04 Receiving History | Receiving | T/D | §11 Receiving | Mona, Finance |
| RC-05 Dispute Mgmt | Receiving | D | §11 Receiving | Ahmed, Finance |
| RC-06 Factory Receipt | Receiving | T | §1.B Module 5 | Factory |
| SP-02 Supplier Profile | Suppliers | D | §1.B Module 5 | Procurement |
| SP-03 PO Create | Suppliers | D | §1.B Module 5 | Procurement |
| SP-04 PO List | Suppliers | D | §1.B Module 5 | Procurement |
| SP-05 PO Detail | Suppliers | D | §1.B Module 5 | Procurement |
| SP-06 Supplier KPIs | Suppliers | D | §1.B Module 5 | Ahmed |
| SP-07 Payables Aging | Suppliers | D | §1.B Module 5 | Finance |
| SP-08 Contracts | Suppliers | D | §1.B Module 5 | Procurement |
| HR-05 Employee Profile | HR | D | §1.B Module 6 | HR |
| HR-06 Attendance | HR | T/D | §1.B Module 6 | Manager |
| HR-07 Shifts | HR | D | §1.B Module 6 | HR, Manager |
| HR-08 Leave Mgmt | HR | D | §1.B Module 6 | Manager |
| HR-09 Leave Calendar | HR | D | §1.B Module 6 | HR |
| HR-10 Performance | HR | D | §1.B Module 6 | HR, Manager |
| HR-11 Training | HR | D | §1.B Module 6 | HR |
| HR-12 Payslip | HR | M/D | §1.B Module 6 | Karim |
| HR-13 Documents | HR | D | §1.B Module 6 | HR |
| FN-02 Receivables | Finance | D | §1.B Module 7 | Finance |
| FN-03 Payables | Finance | D | §1.B Module 7 | Finance |
| FN-04 Cash & Bank | Finance | D | §1.B Module 7 | Finance |
| FN-05 Branch P&L | Finance | D | §1.B Module 7 | Sarah, Finance |
| FN-06 Settlements | Finance | D | §1.B Module 7 | Finance |
| FN-07 Product Costing | Finance | D | §1.B Module 7 | Finance |
| FN-08 Budget | Finance | D | §1.B Module 7 | Sarah |
| FN-09 Financial Reports | Finance | D | §1.B Module 7 | Sarah, Finance |
| FN-10 VAT & Tax | Finance | D | §1.B Module 7 | Finance |
| ST-01 System Settings | Settings | D | §10 | Admin |
| ST-02 Users & Roles | Settings | D | §10 | Admin |
| ST-03 Branch Config | Settings | D | §10 | Admin |
| ST-04 Notifications | Settings | T/M/D | §10 | Admin |
| ST-05 Integrations | Settings | D | §10 | Admin |

---

**Total screens: 82 across 3 surfaces (Tablet · Mobile · Desktop)**


*End of Wireframes Document — pair with `01_UX_Strategy.md` for full context.*
