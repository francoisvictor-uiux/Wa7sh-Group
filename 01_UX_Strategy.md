# نظام الوحش التشغيلي المتكامل
## El Wahsh Group Integrated Operating System
### UX Strategy & Information Architecture — Full Deliverable

> **Audience:** Product, design, engineering, and ops leadership
> **Scope:** Multi-branch food chain ERP — Arabic-first (RTL), tablet-primary, mobile-secondary, desktop-full
> **Status:** Strategy v1.0

---

## 0. Executive Framing

This is not an ERP with an Arabic translation layered on top. It is an **operations nervous system** designed natively for a food chain where a patty leaves the factory at 6:14 AM and must be confirmed in a branch fridge by 8:02 AM — with every gram, every hand, and every minute accountable.

The product has three concurrent realities:
- **Tablet** = the operational floor (warehouse, dispatch, receiving)
- **Mobile** = the moving body (drivers, managers in transit, approvals)
- **Desktop** = the brain (finance, HR, analytics, governance)

All three speak Arabic natively. All three share one mental model. None is an afterthought.

---

## 1. Information Architecture

### 1.A — High-Level Sitemap (RTL)

```
                        نظام الوحش (الجذر)
                              │
   ┌──────────┬──────────┬───┴────┬──────────┬──────────┬──────────┐
لوحة التحكم  المخزون   الطلبات   الشحن    الموردون   الموارد    المالية
                                  والتتبع              البشرية
```

Top-level navigation (8 modules, ordered by daily-use frequency, RTL):

| الترتيب (يمين←يسار) | الوحدة | English | الجمهور الأساسي |
|---|---|---|---|
| 1 | الرئيسية | Home/Dashboard | الجميع |
| 2 | المخزون | Inventory | المصنع، الفروع |
| 3 | الطلبات | Requests | مدير الفرع، المصنع |
| 4 | الشحن والتتبع | Logistics & Tracking | السائقون، الإدارة |
| 5 | الاستلام | Receiving | الفروع |
| 6 | الموردون | Suppliers | المشتريات، المصنع |
| 7 | الموارد البشرية | HR | الإدارة، الموظفون |
| 8 | المالية | Finance | الإدارة العليا |

**IA Principles applied:**
- **Frequency-weighted ordering** (right-to-left reading): the right edge — where the eye lands first in Arabic — holds the most-used module per role.
- **Role-adaptive navigation**: a driver opening the app sees الشحن at the right edge; a finance manager sees المالية. Same IA, role-tuned surfacing.
- **Two-deep rule**: any operational task must be reachable in ≤2 taps. Strategic tasks (reports, configuration) may go deeper.
- **No orphan screens**: every screen has a clear parent and breadcrumb (مسار التنقل) on tablet/desktop.

### 1.B — Module Breakdown

#### 1️⃣ المخزون / Inventory

**Sub-features:**
- جرد المصنع (Factory stock) — raw materials, semi-finished, finished goods
- جرد الفروع (Branch stock) — per-branch live counts
- التحويلات الداخلية (Internal transfers)
- الجرد الدوري (Periodic count / cycle count)
- التواريخ والصلاحيات (Expiry tracking) — **critical for food**
- الفاقد والهدر (Waste & spoilage log)
- نقاط إعادة الطلب (Reorder points)

**Key screens:**
- شاشة الجرد الحي (Live stock — tablet card grid by category)
- بطاقة الصنف (Item card — image, qty, expiry, location, last movement)
- شاشة الجرد الدوري (Count session — paired-scan mode, tablet)
- تنبيهات قرب الانتهاء (Expiry alerts — color-coded: أحمر/برتقالي/أخضر)

**Roles with access:** Admin, Factory Manager, Branch Manager, Warehouse Staff (read+update), Driver (read-only on assigned shipment items).

---

#### 2️⃣ الطلبات / Requests (Branch ↔ Factory)

**Sub-features:**
- إنشاء طلب فرع (Branch raises request)
- نموذج الطلب السريع (Quick-request from templates / "نفس الأسبوع الماضي")
- مراجعة وموافقة (Approval workflow — single or multi-step)
- تعديل ومناقشة (Counter-offer / edit-and-resubmit)
- سجل الطلبات (Request history per branch)
- الطلبات المتكررة (Recurring orders — saved baskets)

**Key screens:**
- سلة الطلب (Request basket — tablet split-view: catalog يمين / السلة يسار)
- شاشة الموافقة (Approval — mobile-optimized, swipe to approve/reject with reason)
- خط زمني الطلب (Request timeline — RTL flow with status pills)

**Roles:** Branch Manager (create), Factory Manager (approve/dispatch), Admin (oversight).

---

#### 3️⃣ الشحن والتتبع / Logistics & Tracking ⭐ CRITICAL

**Sub-features:**
- قائمة الشحنات النشطة (Active shipments)
- تعيين السائق (Assign driver + vehicle)
- خريطة حية (Live map — RTL labels, Arabic place names)
- التقاط الإثبات (Proof of dispatch / proof of delivery — photo + signature)
- مسار الشحنة (Shipment trail — geo + temporal)
- التنبيهات (Delay alerts, route deviations)
- سجل التتبع الكامل (Full audit trail per shipment)

**Key screens:**
- شاشة السائق (Driver screen — mobile, single-task focus)
- لوحة الشحنات (Dispatch board — desktop + tablet, kanban: تحضير / في الطريق / تم التسليم)
- خريطة المراقبة (Live tracking map — desktop primary, tablet supported)

**Roles:** Driver (mobile), Dispatcher (tablet/desktop), Branch Manager (incoming visibility), Admin (oversight).

---

#### 4️⃣ الاستلام / Receiving ⭐ CRITICAL

**Sub-features:**
- استلام شحنة (Receive shipment — scan/check)
- تطابق الكميات (Quantity match against dispatch)
- تسجيل الفروقات (Discrepancy logging — مفقود / تالف / زائد / منتهي الصلاحية)
- التوقيع الرقمي (Digital signature)
- صور الإثبات (Photo evidence — required for any discrepancy)
- النزاعات (Dispute escalation)

**Key screens:**
- شاشة الاستلام (Receive — tablet primary, scan-driven)
- شاشة الفروقات (Discrepancy — clear visual diff: المتوقع vs المستلم)
- إقرار الاستلام (Acknowledgement — signature pad on tablet)

**Roles:** Branch Manager / Receiving Staff (primary), Factory Manager (notified on dispute), Admin.

---

#### 5️⃣ الموردون / Suppliers

**Sub-features:**
- بطاقة المورد (Supplier profile — contact, terms, ratings)
- أوامر الشراء (Purchase orders)
- استلام من المورد (Goods receipt at factory)
- تقييم المورد (Performance score — on-time %, quality %, dispute rate)
- المستحقات (Payables aging)
- العقود والوثائق (Contracts & docs)

**Roles:** Procurement, Factory Manager, Finance, Admin.

---

#### 6️⃣ الموارد البشرية / HR

**Sub-features:**
- ملفات الموظفين (Employee profiles — 400+)
- الحضور والانصراف (Attendance — biometric/QR/PIN)
- الورديات (Shifts & rotations — branch/factory)
- الإجازات (Leave management — request → approve → balance)
- التقييم (Performance reviews)
- التدريب (Training records — food safety, HACCP)
- الوثائق (Documents — contracts, IDs, health certs — **critical for food**)

**Sub-module: الرواتب / Payroll**
- حساب الراتب (Salary calculation — base + overtime + deductions)
- مسير الرواتب (Payroll run)
- قسائم الرواتب (Payslips — Arabic, downloadable)
- التأمينات والضرائب (Social insurance & tax — Egypt-compliant)

**Roles:** HR Admin (full), Manager (team view), Employee (self-service).

---

#### 7️⃣ المالية / Finance

**Sub-features:**
- الذمم المدينة (Receivables)
- الذمم الدائنة (Payables)
- الخزينة والبنوك (Cash & bank)
- التسويات بين الفروع (Inter-branch settlements)
- التكلفة لكل فرع (Branch P&L)
- تكلفة المنتج (Product costing — per item, per recipe)
- الميزانية والتنبؤ (Budgets & forecasts)
- التقارير المالية (Financial reports — IS, BS, CF)
- الضرائب (VAT / income tax — ETA-compliant for Egypt)

**Roles:** CFO, Finance Manager, Accountant, Admin (read).

---

#### 8️⃣ لوحة التحكم / Dashboard & Analytics

**Sub-features:**
- لوحة الإدارة العليا (Executive dashboard)
- لوحة الفرع (Branch dashboard)
- لوحة المصنع (Factory dashboard)
- مؤشرات الأداء (KPIs — sales, food cost %, waste %, on-time delivery %)
- التقارير (Reports library)
- التنبيهات الذكية (Smart alerts — anomaly detection)

---

### 1.C — Cross-Module Relations (Seamless)

The modules are not silos. They share state through these key spines:

| Spine | Touches |
|---|---|
| **رقم الطلب الموحد** (unified request ID) | الطلبات → الشحن → الاستلام → المخزون → المالية |
| **الموظف** (employee entity) | HR → Payroll → جميع الإجراءات (audit trail) |
| **الصنف** (SKU entity) | الموردون → المخزون → الطلبات → الاستلام → التكلفة |
| **الفرع** (branch entity) | كل وحدة (every module filters by branch) |

A request in الطلبات auto-creates a tracking record in الشحن on approval, which auto-becomes a receiving task in الاستلام, which posts to المخزون and المالية on confirmation. **One ID, one truth.**

---

## 2. Device Strategy

### 2.A — Tablet (Primary Operational Core)

**Where it lives:** mounted in factory dispatch, branch receiving stations, kitchens, warehouses. iPad / Samsung Tab A class. Often shared across shifts.

**Design implications:**
- **Layout**: split-view by default (right = source/list, left = detail/action). 60/40 or 70/30 splits.
- **Card grids** for inventory items — image-led, minimal text, large numerals.
- **Step indicators** (RTL) for multi-step flows: receive → check → sign.
- **Scan-first**: barcode/QR scanning is the primary input, not typing. Camera permission handled once.
- **Touch targets**: ≥56px (above the 44px floor — gloves, wet hands, fast pace).
- **Persistent action bar** at bottom (not hidden in menus).
- **Multi-user awareness**: shift-based "who's logged in" indicator; quick PIN switch (no full re-auth between shifts).

**Anti-patterns blocked:** dense data tables (those go to desktop), tiny icons, hover states, right-click menus.

### 2.B — Mobile (Quick Execution)

**Where it lives:** in pockets — drivers, managers in the field, approvers between meetings.

**Design implications:**
- **Single task per screen** — no compound flows.
- **Bottom-sheet patterns** for actions (thumb reach in RTL means thumb-zone = bottom-right corner for right-handed users).
- **Push notifications as the entry point**, not menu navigation. A driver should never have to "find" their next task — it should arrive.
- **Offline-first** for drivers: delivery confirmation must work without signal; syncs on reconnection.
- **Voice notes** for discrepancies (faster than typing on the move, especially in Arabic).
- **One-thumb operation**: critical actions reachable without the second hand.

### 2.C — Desktop (Full Power)

**Where it lives:** finance, HR, admin, executive offices. 1440px+ standard, supports 1080p.

**Design implications:**
- **Dense, intentional data tables** with column-level filtering, multi-sort, saved views.
- **Multi-pane dashboards** with cross-filtering (click a branch in one chart → all charts update).
- **Keyboard-first**: shortcuts for power users (Arabic-aware: ج for جديد, ح for حفظ, etc.).
- **Bulk operations**: select 50 employees, apply a payroll adjustment.
- **Export everything** (Excel, PDF, CSV) — finance teams will demand this.
- **Reporting builder** for ad-hoc queries.

**Critical:** desktop is not "tablet stretched". The interaction model is fundamentally different — keyboard, multi-window, density tolerance.

### 2.D — Cross-Device Continuity

The same task can — and will — span devices. Examples:

| Journey | Tablet | Mobile | Desktop |
|---|---|---|---|
| Branch receiving | Scan & confirm shipment | Manager gets push, swipe-approves dispute | Finance reconciles end-of-day |
| Driver run | Dispatcher assigns route | Driver navigates, captures POD | Ops reviews route adherence |
| Inventory count | Counter performs count | Supervisor approves on the move | Admin reviews variance report |

**Continuity rules:**
- One account = one identity across devices.
- A shipment opened on tablet remains in "in progress" state if the user picks it up on mobile — no orphan sessions.
- Notifications are device-aware: critical alerts hit all devices; informational alerts hit the relevant one only.

---

## 3. Arabic UX Strategy (RTL — Native, Not Translated)

### 3.A — Layout Direction

- **All layouts mirror**: navigation right, content flowing right-to-left, primary action on the right.
- **Icons that imply direction are flipped**: arrows, chevrons, "next" icons. Universal icons (gear, search, user) are not flipped.
- **Numbers and Latin tokens** (SKU codes, phone numbers, dates in DD/MM/YYYY) remain LTR within their token, but their **placement** in the layout follows RTL.
- **Tables**: first column on the right is the identifier (e.g., اسم الصنف), action column on the left. Mirrored from English convention.

### 3.B — Navigation Behavior

- **Side navigation** docks to the **right edge** on tablet/desktop.
- **Back gesture** on mobile = swipe from **left** edge (mirroring iOS RTL convention).
- **Breadcrumbs** read right-to-left: الرئيسية ‹ المخزون ‹ بطاقة الصنف.

### 3.C — Button Hierarchy & Action Placement

- **Primary action**: bottom-**right** of forms / dialogs (closest to the thumb in RTL reading flow).
- **Secondary action**: to the **left** of primary.
- **Destructive action**: clearly separated, often in a different region or color, never adjacent to primary.

```
[ إلغاء ]   [ تأكيد ]   ← RTL: تأكيد is on the right
```

### 3.D — Typography

- **Recommended primary font**: IBM Plex Sans Arabic (open, modern, excellent screen rendering) or Noto Sans Arabic. Cairo and Tajawal are acceptable secondaries.
- **Avoid**: decorative naskh fonts for UI; they kill scannability at small sizes.
- **Line height**: 1.6–1.75 for Arabic body text (Arabic glyphs need more vertical breathing room than Latin).
- **Font sizes**:
  - Body: 16px tablet, 15px mobile, 14px desktop dense
  - Numerals (counts, prices): 18–24px, tabular figures, **slightly heavier weight**
  - Headings: 20/24/28/32 scale
- **Numerals**: use **Western Arabic numerals (0–9)** by default for operational data — they're more universally readable on receipts and invoices in Egypt. Offer Eastern Arabic (٠–٩) as a settings option, but not the default.
- **Mixed direction**: when a sentence contains an SKU code or a number, ensure the LTR token is wrapped with proper Unicode bidi marks (U+200E / U+200F) to prevent visual scrambling.

### 3.E — Handling Dense Arabic Content

Arabic words tend to be longer than English equivalents (translation expansion ~25%). Mitigations:
- **Don't constrain labels with English-sized columns.** Design from Arabic out, not English in.
- **Truncate with ellipsis (…) on the leading edge** (i.e., the right side, since text reads RTL).
- **Use icons + short labels** in navigation rather than long phrases.
- **Avoid all-caps**: Arabic has no case; bolding and color are the only emphasis tools.
- **No vertical text**: it's not a native Arabic pattern — never rotate Arabic text 90°.

### 3.F — Cultural Usability

- **Date formats**: Hijri calendar option alongside Gregorian (relevant for HR — leaves around Ramadan/Eid).
- **Time**: 12-hour with ص/م preferred over 24-hour for non-technical staff.
- **Currency**: ج.م (EGP) with proper RTL-aware formatting: `1,250.00 ج.م`.
- **Names**: support 4-part Arabic names (first/father/grandfather/family).
- **Salutations**: respectful formal Arabic for system messages — not casual MSA, not colloquial Egyptian.
- **Error tone**: avoid blame. "حدث خطأ غير متوقع، حاول مرة أخرى" not "أنت أدخلت خطأ".

---

## 4. Competitor Analysis

### 4.A — Odoo

**Strengths:**
- Modular architecture; you can buy only what you need
- Reasonable Arabic localization (community-driven, improving)
- Decent mobile companion app

**Weaknesses:**
- Generic UX — clearly designed for "any business," not food
- RTL is functional but not native: many screens look like LTR with mirrored CSS, not redesigned flows
- Tablet experience is essentially scaled mobile or shrunk desktop
- Tracking/dispatch flows are weak — built for goods, not perishables
- No real-time field operations focus

**Tablet/Mobile gaps:** Mobile app is reduced functionality, not parallel functionality. Tablet is not a first-class target.

**Arabic gaps:** Translations exist but reading flow feels secondary. Numerals and bidi handling inconsistent.

**Opportunity for Wahsh:** Be radically operational — design every screen for a specific moment in the food chain, not generic ERP transactions.

### 4.B — SAP Business One

**Strengths:**
- Deep financial and accounting capability
- Strong audit trails
- Mature in Egyptian market

**Weaknesses:**
- Heavy, slow UI; long learning curve
- Mobile is severely limited
- Tablet effectively non-existent for ops
- Arabic UX is enterprise-grade clunky — works but no one enjoys it
- Customization expensive; vendor-locked

**Tablet/Mobile gaps:** Massive. No real field-ops story.

**Arabic gaps:** RTL works but is not designed-in; layouts feel forced.

**Opportunity:** Wahsh can be the modern, touch-native, operations-first alternative — leave SAP for the giant manufacturers.

### 4.C — Zoho Inventory

**Strengths:**
- Clean, modern UX (best-in-class of the four for visual design)
- Good mobile companion
- Affordable

**Weaknesses:**
- Inventory-only — no factory production, no HR, no full finance
- Arabic support is partial; some screens fall back to English
- Limited multi-branch / multi-location depth
- No supplier-to-branch traceability for food

**Tablet/Mobile gaps:** Mobile ok; tablet is a stretched phone. No operational tablet patterns.

**Arabic gaps:** Inconsistent — some modules localized, others not.

**Opportunity:** Match Zoho's visual quality, exceed it in Arabic depth and operational specificity.

### 4.D — Oracle NetSuite

**Strengths:**
- Enterprise-scale; handles complex multi-entity
- Strong reporting

**Weaknesses:**
- Designed for accountants, hostile to operators
- UI feels late-2000s
- Arabic is afterthought
- Mobile/tablet a non-priority
- Cost prohibitive for a food chain

**Opportunity:** Wahsh occupies the gap NetSuite ignores: the front-line operator on a tablet at 6 AM.

### 4.E — Strategic Positioning

Wahsh System differentiates on **four axes** none of these competitors lead on:

1. **Arabic-native** (not localized)
2. **Tablet-first operational** (not desktop-only)
3. **Food-traceability native** (not generic SKU)
4. **Tracking transparency** (every step, every actor, every timestamp)

---

## 5. Personas (Role + Device + Context)

### Persona 1 — أحمد، مدير المصنع (Ahmed, Factory Manager)

- **العمر:** 42 | **الخبرة:** 15 سنة في الصناعات الغذائية
- **Devices:** Tablet (primary, 80% of day) + Desktop (reports, end-of-day)
- **Context:** Large factory in 6th of October City. On feet most of the day. Hands often gloved or wet.
- **Goals:**
  - Approve incoming branch requests within SLA
  - Maintain raw material supply against production schedule
  - Hit zero spoilage targets
- **Tasks:** Approve requests, supervise dispatch, manage suppliers, oversee production runs
- **Pain points:**
  - Currently uses WhatsApp + Excel — no traceability when things go wrong
  - Drivers call him for every dispute → constant interruption
  - End-of-month reconciliation takes 3 days because data is scattered
- **What he needs from Wahsh:** A dispatch board that tells him at a glance which branches are at risk, one-tap approvals, dispute resolution that doesn't require a phone call.

### Persona 2 — منى، مديرة فرع (Mona, Branch Manager — Heliopolis)

- **العمر:** 31 | **الخبرة:** 6 سنوات، آخر سنتين كمديرة
- **Devices:** Tablet (receiving, inventory) + Mobile (approvals on the floor)
- **Context:** Branch with 25 staff, 3 receiving windows per day from factory. Customer-facing during peak hours.
- **Goals:**
  - Never run out of fast-moving items during rush
  - Receive shipments quickly and accurately
  - Keep food cost % under target
- **Tasks:** Place daily/weekly factory requests, receive shipments, manage shifts, handle waste
- **Pain points:**
  - Receiving currently means counting against a paper invoice while customers wait
  - Disputes become "his word vs. hers" with the factory
  - She forgets to reorder slow-moving items until they run out
- **What she needs:** Template-based recurring requests ("نفس طلب الأسبوع الماضي"), tablet receive flow that takes <90 seconds for normal shipments, photo-based dispute that ends arguments.

### Persona 3 — محمود، السائق (Mahmoud, Driver)

- **العمر:** 38 | **التعليم:** ثانوي
- **Devices:** Mobile only (company-issued Android, mid-tier)
- **Context:** Behind the wheel. Often in areas with weak 4G. Doesn't read English. Limited tech comfort.
- **Goals:**
  - Complete route on time
  - Get clean handoff signature so he's not blamed for shortages
  - Get home on time
- **Tasks:** Confirm pickup at factory, navigate to branches, capture proof of delivery
- **Pain points:**
  - Currently calls dispatcher to confirm each handoff
  - Sometimes signs paper without recounting → blamed later for missing items
  - Loses paperwork
- **What he needs:** A 3-tap flow per stop. Big buttons. Voice or photo instead of typing. Works offline. Arabic only.

### Persona 4 — سارة، الإدارة (Sarah, Admin / Operations Director)

- **العمر:** 36 | **الخبرة:** MBA, 10 سنوات في retail/F&B
- **Devices:** Desktop (primary) + Mobile (alerts, on-call)
- **Context:** HQ office. Reviews 12 branches daily. Reports to CEO weekly.
- **Goals:**
  - Cross-branch visibility
  - Catch anomalies before they become crises
  - Drive operational KPIs
- **Tasks:** Dashboard review, exception management, policy changes, weekly reports
- **Pain points:**
  - Currently waits for branch managers to send Excel reports — 24h+ data lag
  - No way to compare branches on like-for-like metrics
  - Discovers problems after they cost money
- **What she needs:** Live executive dashboard, alert system that flags real anomalies (not noise), drill-down from any KPI to the underlying transaction.

### Persona 5 — كريم، موظف (Karim, Frontline Employee — Kitchen)

- **العمر:** 24 | **التعليم:** متوسط
- **Devices:** Mobile only (personal phone)
- **Context:** Works in branch kitchen. Limited time during shift. Basic Arabic literacy, no English.
- **Goals:**
  - Clock in correctly
  - Request leave when needed
  - See his payslip
- **Tasks:** Attendance, leave requests, view schedule, view payslip
- **Pain points:**
  - HR communication is paper-based; loses payslips
  - Leave requests get stuck in WhatsApp limbo
- **What he needs:** Self-service mobile app with three things: schedule, leave, payslip. Nothing more. Arabic-only. Loud notifications when shift changes.

---

## 6. User Journeys (Real Context)

### Journey 1 — Inventory Request from Branch to Factory

| الخطوة | الفاعل | الجهاز | الموقع | الإنترنت | الزمن |
|---|---|---|---|---|---|
| اكتشاف نقص المخزون | منى (مديرة فرع) | Tablet | المطبخ | جيد | 6:30 AM |
| إنشاء طلب من قالب | منى | Tablet | غرفة الإدارة | جيد | 6:35 AM |
| إرسال للموافقة | منى | Tablet | غرفة الإدارة | جيد | 6:36 AM |
| استلام إشعار | أحمد (مدير المصنع) | Mobile | المصنع | جيد | 6:36 AM |
| موافقة سريعة (swipe) | أحمد | Mobile | المصنع | جيد | 6:37 AM |
| تحضير الطلب | عامل المخزن | Tablet | المخزن | جيد | 7:00 AM |
| تعيين سائق | الديسباتشر | Tablet/Desktop | الإرسالية | جيد | 7:15 AM |

**UX moments of truth:** request creation must take <60s using a template; approval must be one swipe; status must propagate to منى's tablet without her refreshing.

### Journey 2 — Delivery Run (Driver's View)

| الخطوة | الجهاز | الإنترنت | اعتبارات UX |
|---|---|---|---|
| 7:30 — استلام إشعار "انت معين على رحلة" | Mobile | جيد | إشعار صوتي، مفتوح بضغطة |
| 7:35 — وصول للمصنع، تأكيد الاستلام بصورة | Mobile | جيد | كاميرا تفتح فورًا |
| 7:50 — انطلاق + التنقل لأول فرع | Mobile + خرائط | متغير | روابط لخرائط جوجل / Waze بالعربي |
| 8:20 — وصول الفرع، تسليم | Mobile | **ضعيف داخل المبنى** | يجب أن يعمل أوفلاين |
| 8:25 — صورة + توقيع منى | Mobile | ضعيف | حفظ محلي، sync لاحق |
| 9:30 — انتهاء الرحلة | Mobile | جيد | sync كامل، تحديث الحالات |

**Critical UX:** offline-first for the entire delivery flow. Sync indicator visible. No data loss possible.

### Journey 3 — Receiving at Branch

| الخطوة | الجهاز | UX |
|---|---|---|
| إشعار وصول الشحنة | Tablet (mounted) | Push tone + screen wake |
| فتح شاشة الاستلام | Tablet | One tap from notification |
| مسح صناديق بالكاميرا | Tablet | Continuous scan mode |
| مقارنة تلقائية مع قائمة التحضير | Tablet | الفرق يظهر مباشرة بالأحمر |
| تسجيل الفروقات بصور | Tablet | كاميرا + ملاحظة صوتية |
| توقيع رقمي | Tablet | إصبع على الشاشة |
| تأكيد + إشعار للمصنع والإدارة | Auto | Status flips to "تم التسليم" |

**Critical UX:** the receiving moment is where trust is built or broken. Photo + signature + timestamp + GPS = end of disputes.

---

## 7. User Flows (Touch-Optimized)

### Flow 1 — Branch Requests Inventory

```
[الرئيسية] → [الطلبات] → [طلب جديد]
                           │
              ┌────────────┼────────────┐
        [قالب سابق]   [طلب فارغ]   [نسخ من فرع آخر]
              │            │
         [اختيار]      [اختيار أصناف من الكتالوج]
              │            │
              └─────┬──────┘
              [مراجعة السلة]
                    │
              [تأكيد وإرسال]
                    │
              [إشعار: تم الإرسال - في انتظار الموافقة]
```

- Steps: 4–5 (template path) or 6–7 (custom)
- Typing required: zero (template) or quantities only (custom)
- Time target: <60s template, <3min custom

### Flow 2 — Approve Request (Mobile, Manager)

```
[Push notification] → [يفتح الطلب]
                              │
                  [مراجعة سريعة: من، ماذا، كم]
                              │
                ┌─────────────┼─────────────┐
          [← swipe رفض]   [موافقة ✓]   [تعديل ✎]
                │              │             │
          [سبب الرفض]    [إشعار للفرع]  [تعديل الكميات]
```

- One-thumb operation
- 3 actions, no deeper menus
- Time target: <15s for routine approval

### Flow 3 — Prepare Shipment (Factory, Tablet)

```
[لوحة الشحنات] → [اختيار طلب موافق عليه]
                          │
                  [قائمة التحضير - Pick list]
                          │
                  [مسح كل صنف بالكاميرا]
                          │
                  [إدخال الكمية الفعلية]
                          │
                  [التحقق: متطابق ✓ / فرق ⚠]
                          │
                  [تعيين سائق + سيارة]
                          │
                  [طباعة الفاتورة + التقاط صورة الشحنة]
                          │
                  [تأكيد الإرسال → الحالة: في الطريق]
```

- Scan-driven, minimal typing
- Quantity validation prevents dispatch errors

### Flow 4 — Deliver (Driver, Mobile)

```
[إشعار: رحلة جديدة]
        │
[فتح الرحلة]
        │
[محطات الرحلة - بترتيب]
        │
[الفرع 1: [انطلاق] → [وصلت] → [تسليم]]
                                   │
                          [صورة الشحنة]
                                   │
                          [توقيع المستلم]
                                   │
                          [تأكيد] → [الفرع التالي]
```

- Linear, no branching
- Each stop = same 3 actions
- Works offline; queues syncs

### Flow 5 — Receive (Branch, Tablet)

```
[إشعار: شحنة وصلت] → [فتح الشحنة]
                            │
                  [قائمة الأصناف المتوقعة]
                            │
                  [مسح صناديق وتأكيد كميات]
                            │
              ┌─────────────┴─────────────┐
        [كل شيء مطابق]              [يوجد فرق]
              │                            │
              │                  [تسجيل الفرق]
              │                            │
              │                  [نوع: مفقود/تالف/زائد]
              │                            │
              │                  [صور + ملاحظة]
              │                            │
              └──────────────┬─────────────┘
                      [توقيع رقمي]
                             │
                      [إقرار الاستلام]
                             │
                      [تحديث المخزون تلقائيًا]
```

- Discrepancy is a sub-flow, not a separate task
- Photo evidence is mandatory for any flagged item

---

## 8. Features Prioritization

### MUST HAVE (MVP — Phase 1)

| # | Feature | Why Critical |
|---|---|---|
| 1 | تتبع الطلب الكامل (End-to-end request tracking) | Core trust mechanism |
| 2 | استلام بالمسح + توقيع (Scan-receive + signature) | Eliminates disputes |
| 3 | جرد حي للفرع والمصنع (Live inventory) | Operational lifeblood |
| 4 | موافقات سريعة Mobile (Quick mobile approvals) | Removes biggest bottleneck |
| 5 | تنبيهات الانتهاء (Expiry alerts) | Food safety + waste reduction |
| 6 | شاشة السائق Offline (Driver offline mode) | Field reality |
| 7 | لوحة الإدارة Real-time (Real-time admin dashboard) | Cross-branch visibility |
| 8 | سجل التدقيق (Audit log per record) | Accountability |
| 9 | الحضور والانصراف (Attendance) | 400+ employees, daily need |
| 10 | الرواتب الأساسية (Basic payroll) | Monthly necessity |

### SHOULD HAVE (Phase 2)

- تكلفة المنتج التلقائية (Auto product costing)
- تقييم المورد (Supplier scorecards)
- التنبؤ بالطلب (Demand forecasting from history)
- تقارير مخصصة (Custom report builder)
- تكامل WhatsApp Business لإرسال إشعارات للموردين

### COULD HAVE (Phase 3)

- ذكاء اصطناعي للتنبؤ بالهدر (AI waste prediction)
- روبوت دردشة داخلي للموظفين (Internal employee chatbot)
- تكامل مع كاشير الفرع (POS integration if not already)
- بطاقة موظف رقمية (Digital employee card / QR badge)

### WON'T HAVE (For Now — Avoid Scope Creep)

- CRM للعملاء النهائيين
- E-commerce / تطبيق العميل النهائي
- نظام حجوزات
- Ledger blockchain (vanity feature, no real ROI)

---

## 9. Pain Points & UX Solutions

| الألم الحالي (Real Problem) | الجذر | الحل المصمم |
|---|---|---|
| فروقات الشحنات تؤدي لخلافات بين الفرع والمصنع | لا يوجد إثبات موضوعي | استلام بالمسح + صور + توقيع + GPS + timestamp = إثبات لا يقبل الجدل |
| السائق يتصل لكل تأكيد | لا يوجد قناة موحدة | تطبيق سائق Mobile مع تأكيد بضغطة |
| المخزون مختلف بين الفرع والنظام | تحديث متأخر / يدوي | تحديث فوري عند الاستلام / الصرف، scan-driven |
| تأخر الموافقات بسبب غياب المدير عن المكتب | الموافقات desktop فقط | Mobile push + swipe approve |
| فقدان فواتير الموردين | ورقية | التقاط الفاتورة بالكاميرا، OCR + ربط بأمر الشراء |
| نهاية الشهر = 3 أيام مطابقة | بيانات متفرقة في WhatsApp/Excel | كل عملية مسجلة في النظام، التقارير تتولد تلقائيًا |
| لا أحد يعرف من المسؤول عن خطأ | لا يوجد سجل تدقيق | كل إجراء مرتبط بمستخدم + توقيت + جهاز + موقع |
| الموظف لا يعرف راتبه قبل اليوم 5 | قسائم ورقية | قسيمة Mobile متاحة لحظة إقفال الراتب |
| تنتهي صلاحية مواد بدون تنبيه | لا يوجد تتبع تواريخ | بطاقة صنف بتاريخ + تنبيه 7/3/1 يوم |
| RTL في الأنظمة الحالية مكسور | تعريب بدون تصميم | تصميم RTL أصلي من الصفر |
| واجهات Desktop-only | تصميم لمحاسبين فقط | Tablet-first لكل عملية ميدانية |
| ضعف الإنترنت يوقف العمل | تصميم online-only | Offline-first للعمليات الحرجة |

---

## 10. Tracking System ⭐ CRITICAL

### 10.A — Status Lifecycle (Arabic UI)

Every shipment / request flows through a deterministic status chain:

```
1. تم الطلب          (Requested)        — by: مدير الفرع
2. تم الموافقة       (Approved)         — by: مدير المصنع
3. جاري التحضير     (Preparing)        — by: عامل المخزن
4. تم التحميل        (Loaded)           — by: المصنع
5. في الطريق         (In Transit)       — by: السائق
6. تم التسليم        (Delivered)        — by: السائق + GPS
7. تم التأكيد        (Confirmed)        — by: مدير الفرع
8. مغلق             (Closed)           — by: النظام (auto)
```

**Edge states (parallel):**
- معلق (On Hold)
- متنازع عليه (Disputed)
- مرفوض (Rejected)
- ملغى (Cancelled)

### 10.B — Visual Timeline (RTL)

Horizontal timeline reading right-to-left, with completed steps on the right and pending steps on the left:

```
[8 مغلق] ← [7 تأكيد] ← [6 تسليم] ← [5 طريق] ← [4 تحميل] ← [3 تحضير] ← [2 موافقة] ← [1 طلب]
   ⚪          ⚪          ⚪          🟢          ✅          ✅          ✅          ✅
```

- ✅ = completed (green)
- 🟢 = current (animated pulse)
- ⚪ = pending (gray)
- 🔴 = blocked / disputed (red)

Each node tap-expands to show: who, when, where (GPS), evidence (photo/signature), notes.

### 10.C — Owner per Step

| Step | Accountable | Backup |
|---|---|---|
| طلب | مدير الفرع | المساعد |
| موافقة | مدير المصنع | الإدارة |
| تحضير | رئيس المخزن | عامل المخزن |
| تحميل | الديسباتشر | رئيس المخزن |
| طريق | السائق المعين | — |
| تسليم | السائق + المستلم | — |
| تأكيد | مدير الفرع | المساعد |

If a step is overdue, the system escalates to the backup, then to the role above. **No silent stalls.**

### 10.D — Timestamps (Immutable)

- Every transition writes an **immutable record**: `{step, actor, timestamp_utc, timestamp_local, device, geo, evidence_hashes}`.
- Timestamps display in local Cairo time with a UTC tooltip on desktop.
- No edits; corrections require a **counter-entry** with reason — full audit preserved.

### 10.E — Notifications

| Tier | Trigger | Channel | Audience |
|---|---|---|---|
| 🔴 P0 — حرج | Shipment 30+ min late, dispute opened, expired item dispatched | Push + sound + SMS fallback | Direct owner + manager |
| 🟠 P1 — مهم | Approval pending >2h, low stock, shift no-show | Push + in-app | Direct owner |
| 🟡 P2 — عادي | Status update, normal completion | In-app only | Direct owner |
| 🔵 P3 — معلوماتي | Daily summary, weekly report | Email + in-app digest | Configurable |

Users can mute P2/P3 but **never P0/P1** — these are operational integrity guards.

### 10.F — Audit Log

A dedicated audit view (desktop-primary, tablet-supported) showing:
- Searchable by: shipment ID, branch, person, date range, status
- Exportable for compliance / disputes
- Cannot be edited or deleted by anyone — including admins
- Retained: 7 years (Egyptian tax law compliant)

---

## 11. Sending & Receiving UX (Tablet-First) ⭐ CRITICAL

### 11.A — Sending (Factory)

#### Pick List Screen

- Operator scans each item barcode → quantity field opens
- Visual progress: ✅ green when matched, 🔄 yellow when partial, ⚠ alert when below request
- Cannot mark "تم" until every item is fulfilled or explicitly flagged

#### Quantity Validation
- **Soft cap**: warn if >2x average historical for this SKU
- **Hard cap**: blocks impossible values
- **Decimal handling**: weight items 2 decimals, count items integers only

#### Assign Driver
- Dispatcher sees driver pool with current load, vehicle, region affinity
- One-tap assign + auto-route suggestion
- Driver's mobile app receives push within 3s

#### Confirm Dispatch
- Final screen: shipment summary + photo of loaded vehicle (mandatory)
- Single "تأكيد الإرسال" button → status flips to "في الطريق"

### 11.B — Receiving (Branch)

- Tablet auto-loads expected list when driver arrives (geo-fenced)
- Receiver scans / counts each item
- Differences highlighted **immediately, in red**
- Tapping a flagged row opens sub-sheet: نوع الفرق + photo + voice note option

#### Highlight اختلافات
- 🔴 Red row = quantity mismatch
- 🟠 Orange row = quality issue (visible damage, near-expiry)
- 🟡 Yellow row = unexpected addition (received more than requested)
- Each requires explicit acknowledgement before proceeding

#### Accept / Reject
- **قبول كامل** — everything matches
- **قبول مع تحفظات** — accept with documented discrepancies
- **رفض الشحنة** — full rejection (2-level approval required)

#### Signature
- Three signatures captured: receiver, driver, plus an automated system signature (timestamp + GPS + device)

### 11.C — Error & Dispute States

| Scenario | UX Response |
|---|---|
| السائق وصل بدون شحنة في النظام | Tablet shows "شحنة غير معروفة" + dispatcher escalation |
| الكمية المستلمة > المتوقع | Allow but flag, route to factory for verification |
| منتج منتهي الصلاحية | Auto-block, document, return to vehicle |
| فرع لا يعرف من السائق | OTP confirmation between driver app & branch tablet |
| نزاع غير قابل للحل | "تصعيد للإدارة" — both parties sign on what they agree on, system locks the rest pending review |

---

## 12. Seamless Cross-Device Experience

### 12.A — The "One Operation, Three Devices" Pattern

**Scenario:** Sarah (admin) gets a P0 alert at 9 PM that a shipment is disputed.

| Time | Device | Action |
|---|---|---|
| 21:01 | Mobile | Push notification, opens dispute summary, swipes "أحقق" |
| 21:03 | Mobile | Reviews photos, voice notes from both sides |
| 21:05 | Mobile | Calls branch manager via in-app — call is logged |
| 21:15 | Tablet (at home) | Reviews historical patterns for branch & supplier |
| 21:30 | Desktop (next morning) | Closes dispute, updates supplier score, exports report |

**State preserved across all three devices.**

### 12.B — Continuity Rules

1. **Session sync within 5 seconds** of device switch
2. **Last-viewed indicator**: "كنت تستعرض هذا على الهاتف منذ دقيقتين" prompt
3. **Drafts auto-save** every keystroke; resume on any device
4. **Critical actions confirm on the device they were initiated on** (re-auth required)

### 12.C — Device-Aware UI, Same Mental Model

| Concept | Tablet | Mobile | Desktop |
|---|---|---|---|
| طلب جديد | Split-view catalog + basket | Bottom-sheet wizard | Full-page form with side panel |
| تتبع شحنة | Card with timeline | Vertical step list | Map + table + timeline panels |
| موافقة | Action sheet with details | Swipe gesture | Inline button + bulk select |

### 12.D — Offline Behavior

| Device | Offline Capability |
|---|---|
| Tablet (factory/branch) | Full read of last 7 days, full write for receive/dispatch (queued) |
| Mobile (driver) | Full delivery flow offline |
| Mobile (manager) | Read-only of dashboards & approvals; new approvals queue |
| Desktop | Online-required (acceptable for HQ) |

---

## 13. UX Principles Applied

### 13.A — Simplicity
- One primary action per screen
- Defaults that match 80% of cases
- Progressive disclosure: advanced options behind toggle

### 13.B — Error Prevention
- Quantity sanity caps
- Confirmation only for irreversible actions
- Disabled buttons with explanatory tooltips
- Type-ahead and pickers instead of free-text

### 13.C — System Clarity
- Status always visible
- "Last sync: قبل ٣ ثواني" indicators
- No silent failures — every failure produces a visible Arabic message

### 13.D — Speed
- <90s receive, <60s request, <15s approval
- Skeleton loaders, not spinners
- Optimistic UI for status changes

### 13.E — Recognition Over Recall
- Item cards show photo + name + size — not just SKU codes
- Recent / frequent / suggested items always one tap away

### 13.F — Cognitive Load Reduction
- Group related fields with whitespace
- Limit choices to 5–7 per screen
- Numbers formatted readably (1,250.00 not 1250)

### 13.G — Touch Ergonomics
- ≥56px on tablet, ≥48px on mobile
- Thumb-zone primary actions
- Gesture support: swipe, long-press, pinch-zoom

### 13.H — Trust by Transparency
- Audit log accessible per actor
- "Why this approval?" traceability
- Visible system identity for every action

---

## 14. Final Strategy Summary

### 14.A — The Four Strategic Pillars

| Pillar | Manifestation |
|---|---|
| **الكفاءة** (Efficiency) | Tablet-first ops cut routine receive from ~7 min to <90s |
| **الدقة** (Accuracy) | Scan-driven workflows + immediate variance highlighting |
| **الثقة** (Trust) | Photo + signature + GPS + timestamp on every transaction |
| **القابلية للتوسع** (Scalability) | Module-based IA + role-aware navigation |

### 14.B — What Makes Wahsh Different

1. **Arabic-native**, not localized
2. **Tablet is the floor** — not a phone, not a desktop
3. **Tracking is the product** — not a feature
4. **The driver gets a real app**
5. **Receiving is sacred** — engineered to end disputes

### 14.C — Risks to Pre-Empt

| Risk | Mitigation |
|---|---|
| Staff resist new system | Role-specific quick-start cards, in-app walkthroughs in Arabic |
| Tablets get damaged in kitchens | Ruggedized cases; offline-first prevents data loss |
| Network drops during dispatch | Offline queue + retry + visible sync state |
| Senior staff prefer paper | 60-day parallel run, gradual cut-off |
| Arabic font rendering quirks on older Android | Bundle font with app |

### 14.D — Success Metrics (Year 1)

- Adoption: 95%+ daily active users by month 3
- Receive accuracy: dispute rate <2% by month 6
- Approval speed: median <20 minutes
- Inventory accuracy: monthly variance <1.5%
- Waste reduction: 30% reduction in expired write-offs
- Time-to-month-close: from 3 days to <1 day

### 14.E — One-Sentence Vision

> نظام الوحش هو الجهاز العصبي لسلسلة المطاعم — يربط كل علبة، كل سائق، كل فرع، كل ريال بخيط واحد من الثقة، يُقرأ من اليمين لليسار، ويعمل أينما كان فريقك.

---

*End of Strategy Document — see `02_Wireframes.md` for screen-by-screen wireframes.*
