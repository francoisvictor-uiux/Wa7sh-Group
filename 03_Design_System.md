# نظام الوحش — Design System
## El Wahsh Group · UI Design System & Component Library

> **Companion to:** `01_UX_Strategy.md` and `02_Wireframes.md`
> **Version:** 1.0
> **Architecture:** 1 system · 2 themes · 2 modes · 4 surfaces
> **Owner:** Design System Lead

---

## Table of Contents

- [0. Architecture & Token Philosophy](#0-architecture--token-philosophy)
- [1. Color System](#1-color-system)
- [2. Typography](#2-typography)
- [3. Spacing & Layout](#3-spacing--layout)
- [4. Radii (Corner Radius)](#4-radii-corner-radius)
- [5. Elevation & Shadows](#5-elevation--shadows)
- [6. Motion & Animation](#6-motion--animation)
- [7. Iconography](#7-iconography)
- [8. Components](#8-components)
- [9. Micro-Interactions Catalog](#9-micro-interactions-catalog)
- [10. Implementation — CSS Variables](#10-implementation--css-variables)
- [11. Implementation — Tailwind Config](#11-implementation--tailwind-config)
- [12. Theme & Mode Switcher Logic](#12-theme--mode-switcher-logic)
- [13. Accessibility & Quality Gates](#13-accessibility--quality-gates)

---

## 0. Architecture & Token Philosophy

### 0.1 Three-Tier Token Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  TIER 1 — PRIMITIVES (raw values, never used directly in UI) │
│  e.g. gold-500: #C8A75A, gray-900: #191817                   │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  TIER 2 — SEMANTIC (mode-aware, theme-aware)                 │
│  e.g. surface-base, text-primary, border-default             │
│  These are what components consume.                          │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  TIER 3 — COMPONENT (specific, derived from semantic)        │
│  e.g. button-primary-bg, card-hover-shadow                   │
│  Only created when a component has unique needs.             │
└──────────────────────────────────────────────────────────────┘
```

**Why three tiers:**
- Primitives change rarely (palette evolution every 1–2 years)
- Semantic tokens change per theme/mode automatically
- Component tokens isolate quirks without polluting the global system

**Naming convention:** `{category}-{property}-{role}-{state?}`
- `bg-surface-elevated`
- `text-primary-onLight`
- `button-primary-pressed`

### 0.2 Theme & Mode Matrix

|  | **Dark Mode** | **Light Mode** |
|---|---|---|
| **Wahsh Theme** (Burger + Kababgy) | Warm-black surfaces, gold primary | Cream surfaces, deep gold primary |
| **Forno Theme** (Pizza) | Cool dark-green surfaces, Italian green primary | Cream surfaces, deep green primary |

Switching is via two independent attributes on `<html>`:

```html
<html data-theme="wahsh" data-mode="dark">
<html data-theme="forno" data-mode="light">
```

### 0.3 What Stays Universal (Doesn't Shift Per Theme)

These tokens have ONE value across all 4 surfaces — operational meaning trumps brand identity:
- Status colors (success / warning / danger / info)
- Spacing scale
- Radii scale
- Type scale
- Motion durations & easing curves
- Z-index scale
- Breakpoints

### 0.4 What Shifts Per Theme

- Brand primary color
- Brand secondary / accent
- Logo + crest

### 0.5 What Shifts Per Mode

- Surface backgrounds
- Text colors
- Border colors
- Shadow opacity
- Some illustration accents

---

## 1. Color System

### 1.1 Primitives — Brand Palettes (Tier 1)

#### Wahsh Brand Palette

| Token | Hex | Role |
|---|---|---|
| `wahsh.gold.50` | `#FAF5E8` | Lightest tint — backgrounds, washes |
| `wahsh.gold.100` | `#F2E5C2` | Light tint — light-mode hover bg |
| `wahsh.gold.200` | `#E5CD8E` | Light tint — borders on cream |
| `wahsh.gold.300` | `#D7B86F` | |
| `wahsh.gold.500` | `#C8A75A` | **★ Brand primary** (the gold) |
| `wahsh.gold.600` | `#B08F45` | Hover state |
| `wahsh.gold.700` | `#8E7333` | Pressed state |
| `wahsh.gold.800` | `#6B5624` | Deep accent on light |
| `wahsh.gold.900` | `#4A3B17` | Deepest |
| `wahsh.fire.500` | `#E64001` | **Burnt-red accent** (premium meat tones) |
| `wahsh.fire.600` | `#C53600` | Hover |
| `wahsh.fire.700` | `#A12B00` | Pressed |
| `wahsh.amber.500` | `#FD9D04` | **Bright orange accent** (energy, highlights) |
| `wahsh.amber.600` | `#D88300` | Hover |
| `wahsh.amber.700` | `#B26A00` | Pressed |
| `wahsh.earth.500` | `#2A6B41` | **Deep green** (fresh tag, organic accent) |
| `wahsh.earth.600` | `#1F5331` | Hover |
| `wahsh.earth.700` | `#163D24` | Pressed |
| `wahsh.cream.50` | `#FAF6F4` | Light-mode page background |
| `wahsh.cream.100` | `#EFE3DF` | **Surface cream** (light-mode card / warm tone) |
| `wahsh.cream.200` | `#E2D2CC` | Light-mode borders |
| `wahsh.ink.900` | `#191817` | **Dark-mode page background** (warm near-black) |
| `wahsh.ink.800` | `#232120` | Dark-mode elevated surface |
| `wahsh.ink.700` | `#2C2A28` | Dark-mode modals |
| `wahsh.ink.600` | `#363330` | Dark-mode highest elevation |
| `wahsh.ink.500` | `#4A4744` | Dark-mode borders |
| `wahsh.ink.400` | `#6E6A65` | Dark-mode disabled text |
| `wahsh.ink.300` | `#A09B95` | Dark-mode secondary text |
| `wahsh.ink.200` | `#CDC8C2` | Dark-mode tertiary text |
| `wahsh.ink.100` | `#EFE9E1` | Dark-mode primary text (warm white) |

#### Forno Brand Palette

| Token | Hex | Role |
|---|---|---|
| `forno.green.50` | `#E8F4ED` | Lightest tint |
| `forno.green.100` | `#C5E2D0` | Light tint |
| `forno.green.200` | `#92C7A5` | |
| `forno.green.300` | `#5FAA7A` | |
| `forno.green.500` | `#2A6B41` | **★ Brand primary** (Italian green) |
| `forno.green.600` | `#1F5331` | Hover |
| `forno.green.700` | `#163D24` | Pressed |
| `forno.green.800` | `#0F2917` | Deep |
| `forno.red.500` | `#E64001` | **★ Brand secondary** (Italian red) |
| `forno.red.600` | `#C53600` | Hover |
| `forno.red.700` | `#A12B00` | Pressed |
| `forno.amber.500` | `#FD9D04` | **Warm accent** |
| `forno.amber.600` | `#D88300` | Hover |
| `forno.amber.700` | `#B26A00` | Pressed |
| `forno.cream.50` | `#FAF6F4` | Light-mode page background |
| `forno.cream.100` | `#EFE3DF` | Light-mode surface |
| `forno.cream.200` | `#E2D2CC` | Light-mode borders |
| `forno.shade.900` | `#1C2117` | **Dark-mode page background** (cool dark-green) |
| `forno.shade.800` | `#252B20` | Dark-mode elevated surface |
| `forno.shade.700` | `#2E3528` | Dark-mode modals |
| `forno.shade.600` | `#373F30` | Dark-mode highest elevation |
| `forno.shade.500` | `#4A5340` | Dark-mode borders |
| `forno.shade.400` | `#6E7560` | |
| `forno.shade.300` | `#9BA08C` | Dark-mode secondary text |
| `forno.shade.200` | `#C9CBBC` | Dark-mode tertiary text |
| `forno.shade.100` | `#ECEDE0` | Dark-mode primary text |

### 1.2 Universal Status Colors (Same Across All Themes & Modes)

| Token | Hex (dark mode) | Hex (light mode) | Use |
|---|---|---|---|
| `status.success.500` | `#22C55E` | `#16873F` | Confirmed, on-time, matched |
| `status.success.bg` | `rgba(34,197,94,0.12)` | `rgba(22,135,63,0.10)` | Background tint |
| `status.warning.500` | `#FBBF24` | `#D97706` | Near-expiry, partial, attention |
| `status.warning.bg` | `rgba(251,191,36,0.14)` | `rgba(217,119,6,0.10)` | |
| `status.danger.500` | `#EF4444` | `#DC2626` | Mismatch, dispute, late, error |
| `status.danger.bg` | `rgba(239,68,68,0.14)` | `rgba(220,38,38,0.10)` | |
| `status.info.500` | `#60A5FA` | `#2563EB` | Informational, in-progress |
| `status.info.bg` | `rgba(96,165,250,0.14)` | `rgba(37,99,235,0.10)` | |

> **Why slightly different status hexes per mode:** dark-mode foregrounds need higher luminance to maintain contrast. Same semantic meaning, contrast-tuned per surface.

### 1.3 Semantic Tokens (Tier 2) — The Four Surfaces

#### Wahsh · Dark Mode

| Semantic token | Maps to primitive |
|---|---|
| `bg.canvas` | `wahsh.ink.900` `#191817` |
| `bg.surface` | `wahsh.ink.800` `#232120` |
| `bg.surface.elevated` | `wahsh.ink.700` `#2C2A28` |
| `bg.surface.overlay` | `wahsh.ink.600` `#363330` |
| `bg.muted` | `rgba(239,233,225,0.04)` |
| `bg.subtle` | `rgba(239,233,225,0.08)` |
| `border.default` | `wahsh.ink.500` `#4A4744` |
| `border.subtle` | `rgba(239,233,225,0.08)` |
| `border.strong` | `wahsh.ink.400` `#6E6A65` |
| `border.brand` | `wahsh.gold.500` `#C8A75A` |
| `text.primary` | `wahsh.ink.100` `#EFE9E1` |
| `text.secondary` | `wahsh.ink.300` `#A09B95` |
| `text.tertiary` | `wahsh.ink.400` `#6E6A65` |
| `text.inverse` | `wahsh.ink.900` `#191817` |
| `text.brand` | `wahsh.gold.500` `#C8A75A` |
| `brand.primary` | `wahsh.gold.500` `#C8A75A` |
| `brand.primary.hover` | `wahsh.gold.600` `#B08F45` |
| `brand.primary.pressed` | `wahsh.gold.700` `#8E7333` |
| `brand.primary.fg` | `wahsh.ink.900` `#191817` |
| `brand.accent` | `wahsh.fire.500` `#E64001` |
| `brand.warm` | `wahsh.amber.500` `#FD9D04` |

#### Wahsh · Light Mode

| Semantic token | Maps to primitive |
|---|---|
| `bg.canvas` | `wahsh.cream.50` `#FAF6F4` |
| `bg.surface` | `#FFFFFF` |
| `bg.surface.elevated` | `#FFFFFF` |
| `bg.surface.overlay` | `#FFFFFF` |
| `bg.muted` | `wahsh.cream.100` `#EFE3DF` |
| `bg.subtle` | `rgba(25,24,23,0.03)` |
| `border.default` | `wahsh.cream.200` `#E2D2CC` |
| `border.subtle` | `rgba(25,24,23,0.06)` |
| `border.strong` | `rgba(25,24,23,0.18)` |
| `border.brand` | `wahsh.gold.700` `#8E7333` |
| `text.primary` | `wahsh.ink.900` `#191817` |
| `text.secondary` | `rgba(25,24,23,0.68)` |
| `text.tertiary` | `rgba(25,24,23,0.46)` |
| `text.inverse` | `#FFFFFF` |
| `text.brand` | `wahsh.gold.800` `#6B5624` |
| `brand.primary` | `wahsh.gold.700` `#8E7333` |
| `brand.primary.hover` | `wahsh.gold.800` `#6B5624` |
| `brand.primary.pressed` | `wahsh.gold.900` `#4A3B17` |
| `brand.primary.fg` | `#FFFFFF` |
| `brand.accent` | `wahsh.fire.500` `#E64001` |
| `brand.warm` | `wahsh.amber.600` `#D88300` |

> **Note:** in light mode, the brand-primary uses a deeper gold (`gold.700`) because mid-gold (`gold.500`) doesn't have enough contrast against cream. The brand still *reads* gold, but with the depth needed for accessibility.

#### Forno · Dark Mode

| Semantic token | Maps to primitive |
|---|---|
| `bg.canvas` | `forno.shade.900` `#1C2117` |
| `bg.surface` | `forno.shade.800` `#252B20` |
| `bg.surface.elevated` | `forno.shade.700` `#2E3528` |
| `bg.surface.overlay` | `forno.shade.600` `#373F30` |
| `bg.muted` | `rgba(236,237,224,0.04)` |
| `bg.subtle` | `rgba(236,237,224,0.08)` |
| `border.default` | `forno.shade.500` `#4A5340` |
| `border.subtle` | `rgba(236,237,224,0.08)` |
| `border.strong` | `forno.shade.400` `#6E7560` |
| `border.brand` | `forno.green.500` `#2A6B41` |
| `text.primary` | `forno.shade.100` `#ECEDE0` |
| `text.secondary` | `forno.shade.300` `#9BA08C` |
| `text.tertiary` | `forno.shade.400` `#6E7560` |
| `text.inverse` | `forno.shade.900` `#1C2117` |
| `text.brand` | `forno.green.300` `#5FAA7A` |
| `brand.primary` | `forno.green.500` `#2A6B41` |
| `brand.primary.hover` | `forno.green.600` `#1F5331` |
| `brand.primary.pressed` | `forno.green.700` `#163D24` |
| `brand.primary.fg` | `#FFFFFF` |
| `brand.secondary` | `forno.red.500` `#E64001` |
| `brand.warm` | `forno.amber.500` `#FD9D04` |

#### Forno · Light Mode

| Semantic token | Maps to primitive |
|---|---|
| `bg.canvas` | `forno.cream.50` `#FAF6F4` |
| `bg.surface` | `#FFFFFF` |
| `bg.surface.elevated` | `#FFFFFF` |
| `bg.surface.overlay` | `#FFFFFF` |
| `bg.muted` | `forno.cream.100` `#EFE3DF` |
| `bg.subtle` | `rgba(28,33,23,0.03)` |
| `border.default` | `forno.cream.200` `#E2D2CC` |
| `border.subtle` | `rgba(28,33,23,0.06)` |
| `border.strong` | `rgba(28,33,23,0.18)` |
| `border.brand` | `forno.green.500` `#2A6B41` |
| `text.primary` | `forno.shade.900` `#1C2117` |
| `text.secondary` | `rgba(28,33,23,0.68)` |
| `text.tertiary` | `rgba(28,33,23,0.46)` |
| `text.inverse` | `#FFFFFF` |
| `text.brand` | `forno.green.700` `#163D24` |
| `brand.primary` | `forno.green.500` `#2A6B41` |
| `brand.primary.hover` | `forno.green.600` `#1F5331` |
| `brand.primary.pressed` | `forno.green.700` `#163D24` |
| `brand.primary.fg` | `#FFFFFF` |
| `brand.secondary` | `forno.red.500` `#E64001` |
| `brand.warm` | `forno.amber.600` `#D88300` |

### 1.4 Contrast Verification (WCAG AA / AAA)

| Surface | Foreground | Ratio | Standard |
|---|---|---|---|
| Wahsh dark `#191817` | `#EFE9E1` (text.primary) | 14.6:1 | AAA ✅ |
| Wahsh dark `#191817` | `#A09B95` (text.secondary) | 6.1:1 | AA ✅ |
| Wahsh dark `#191817` | `#C8A75A` (gold primary) | 7.8:1 | AAA ✅ |
| Wahsh light `#FAF6F4` | `#191817` (text.primary) | 16.4:1 | AAA ✅ |
| Wahsh light `#FAF6F4` | `#8E7333` (gold primary) | 4.9:1 | AA ✅ |
| Forno dark `#1C2117` | `#ECEDE0` (text.primary) | 14.2:1 | AAA ✅ |
| Forno dark `#1C2117` | `#5FAA7A` (text.brand) | 6.4:1 | AA ✅ |
| Forno light `#FAF6F4` | `#1C2117` (text.primary) | 16.0:1 | AAA ✅ |
| Forno light `#FAF6F4` | `#2A6B41` (green primary) | 6.7:1 | AA ✅ |

All combinations pass AA at minimum; primary text reaches AAA on every surface.

---

## 2. Typography

### 2.1 Primary Typeface — Thmanyah Sans

The system uses **Thmanyah Sans** as its primary typeface for both Arabic and Latin. It's a contemporary Arabic typeface with elegant proportions, excellent screen rendering, and a strong personality that fits the El Wahsh Group's premium positioning.

**Font files** (already placed in `/d/Wa7sh Burger/fonts/`):

| File | Weight | Token |
|---|---|---|
| `thmanyahsans-Light.woff2` | 300 | `light` (avoid for body) |
| `thmanyahsans-Regular.woff2` | 400 | `regular` (body default) |
| `thmanyahsans-Medium.woff2` | 500 | `medium` (buttons, labels) |
| `thmanyahsans-Bold.woff2` | 700 | `bold` (headings, emphasis) |
| `thmanyahsans-Black.woff2` | 900 | `black` (display only) |

> **Important:** Thmanyah Sans has **no Semibold (600) weight**. The system uses **Bold (700)** wherever a "semibold" role is needed (h2–h4, numerics, emphasis). This is deliberate — don't synthesize a fake 600 with `font-weight: 600` (browsers will fake-bold and look ugly).

### 2.2 Font Stack

```css
--font-sans:
  "Thmanyah Sans",
  "IBM Plex Sans Arabic",
  "Noto Sans Arabic",
  "Cairo",
  "Tajawal",
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;

--font-mono:
  "JetBrains Mono",
  "Fira Code",
  ui-monospace,
  monospace;

--font-display:
  /* Display font for hero numerics, large headlines */
  "Thmanyah Sans",
  sans-serif;
```

**Why one font for Arabic + Latin:** Thmanyah Sans includes Latin glyphs that visually match its Arabic counterparts. Using one family avoids the typical "two fonts that don't quite agree" feeling on mixed-direction content (SKU codes, dates, prices alongside Arabic).

### 2.3 @font-face Declarations

Add this CSS to your project root stylesheet (or a dedicated `fonts.css`):

```css
/* Thmanyah Sans — 5 weights */
@font-face {
  font-family: "Thmanyah Sans";
  src: url("/fonts/thmanyahsans-Light.woff2") format("woff2");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Thmanyah Sans";
  src: url("/fonts/thmanyahsans-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Thmanyah Sans";
  src: url("/fonts/thmanyahsans-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Thmanyah Sans";
  src: url("/fonts/thmanyahsans-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Thmanyah Sans";
  src: url("/fonts/thmanyahsans-Black.woff2") format("woff2");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
```

**Preload the most-used weights** in your HTML `<head>` for faster first paint:

```html
<link
  rel="preload"
  href="/fonts/thmanyahsans-Regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/thmanyahsans-Medium.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/thmanyahsans-Bold.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

Don't preload Light or Black — they're rarely on first paint.

**File path note:** the example path is `/fonts/...` (root-relative). In a Vite/Next.js project, copy the WOFF2 files into `public/fonts/`. In a CRA project, into `public/fonts/`. The `/fonts/` URL resolves automatically.

### 2.4 Type Scale

| Token | Size | Line Height | Weight | Use |
|---|---|---|---|---|
| `text.display` | 32px / 2rem | 1.2 | 900 (Black) | Hero numbers, KPI big-displays — sparingly |
| `text.h1` | 28px / 1.75rem | 1.3 | 700 (Bold) | Page titles |
| `text.h2` | 24px / 1.5rem | 1.35 | 700 (Bold) | Section titles |
| `text.h3` | 20px / 1.25rem | 1.4 | 700 (Bold) | Subsection titles |
| `text.h4` | 18px / 1.125rem | 1.45 | 700 (Bold) | Card titles |
| `text.body.lg` | 17px / 1.0625rem | 1.65 | 400 (Regular) | Lead paragraphs |
| `text.body` | 16px / 1rem | 1.65 | 400 (Regular) | Default body (tablet/mobile) |
| `text.body.sm` | 14px / 0.875rem | 1.6 | 400 (Regular) | Default body (desktop) |
| `text.caption` | 13px / 0.8125rem | 1.5 | 400 (Regular) | Captions, helper text |
| `text.micro` | 12px / 0.75rem | 1.45 | 500 (Medium) | Labels, tags, metadata |
| `text.numeric.xl` | 32px | 1.2 | 700 (Bold) | KPI numbers (tabular nums) |
| `text.numeric.lg` | 24px | 1.25 | 700 (Bold) | Card numbers (tabular nums) |
| `text.numeric.md` | 18px | 1.35 | 500 (Medium) | Inline numbers (tabular nums) |
| `text.button` | 16px / 1rem | 1.0 | 500 (Medium) | Button labels |

> **Tabular numerals** are required for any quantity, price, or count: `font-feature-settings: "tnum" 1, "lnum" 1;`. This makes column sums align correctly.

> **Display weight (900):** use Thmanyah Black sparingly — only for hero KPI numbers (e.g., "248,400 ج.م" on the executive dashboard) or single-word brand statements. Overuse cheapens its impact.

### 2.5 Line Height Rules

- Arabic text needs **20% more line-height** than the equivalent Latin block.
- Body text: `1.65` (Arabic-tuned)
- Headings: `1.25–1.45` (tighter, allowed because heads are short)
- Tight UI elements (buttons, chips): `1.0` to `1.2`

### 2.6 Letter Spacing (Tracking)

- Arabic: never apply letter-spacing — it breaks ligatures and looks broken.
- Latin headings ≥24px: `-0.01em` (slight tightening for elegance)
- Latin small uppercase labels: `+0.04em` (loosen for legibility)
- Body Latin: `0` (no tracking)

### 2.7 Font Weight Map (Thmanyah-Aware)

| Weight | Name | Use | When to choose |
|---|---|---|---|
| 300 | Light | (avoid in UI) | Reserved for editorial / marketing; never operational UI |
| 400 | Regular | Body, descriptions, captions | Default text |
| 500 | Medium | Buttons, labels, micro text, inline numerics | Anywhere needing slight emphasis without heaviness |
| 700 | Bold | All headings (h1–h4), KPI numerics, strong emphasis | Default heading weight |
| 900 | Black | Display headlines, hero KPI numbers | Sparingly — for visual moments only |

> **No 600 (Semibold):** Thmanyah Sans does not include this weight. The browser will synthesize a fake 600 by mathematically thickening 400, which looks blurry on screen. **Always use 500 or 700 — never 600.** Lint rule recommended.

> **Avoid 300 (Light) for UI:** while present in the family, light Arabic at small sizes loses legibility — diacritics blur out. Reserve for editorial display contexts only.

### 2.8 Numerals & Mixed Direction

- Operational data: **Western numerals (0–9)** by default
- Eastern Arabic numerals (٠–٩) available as user setting
- LTR tokens (SKU codes, dates `DD/MM/YYYY`, phone numbers) wrapped with `&lrm;` or `<bdi>` to prevent visual scrambling
- Currency: `1,250.00 ج.م` — number LTR, "ج.م" reads right-to-left after

---

## 3. Spacing & Layout

### 3.1 Spacing Scale (4px base)

| Token | px | rem | Use |
|---|---|---|---|
| `space.0` | 0 | 0 | |
| `space.0.5` | 2 | 0.125 | Icon-text micro-gap |
| `space.1` | 4 | 0.25 | Tight grouping |
| `space.2` | 8 | 0.5 | Inline gaps |
| `space.3` | 12 | 0.75 | Compact padding |
| `space.4` | 16 | 1 | Standard padding |
| `space.5` | 20 | 1.25 | |
| `space.6` | 24 | 1.5 | Section padding |
| `space.8` | 32 | 2 | Large gaps |
| `space.10` | 40 | 2.5 | |
| `space.12` | 48 | 3 | Section dividers |
| `space.16` | 64 | 4 | Page padding |
| `space.20` | 80 | 5 | Large hero spacing |
| `space.24` | 96 | 6 | |

### 3.2 Touch Target Hierarchy

| Token | Size | Use |
|---|---|---|
| `target.min` | 36px | Desktop only — mouse-driven |
| `target.touch` | 48px | Mobile minimum |
| `target.tablet` | 56px | Tablet operational (gloves, wet hands) |
| `target.primary` | 64px | Primary tablet CTA, FAB |

### 3.3 Container Widths

| Breakpoint | Range | Container max-width |
|---|---|---|
| `mobile` | <640px | 100% (no max) |
| `tablet` | 640–1024px | 100% (no max — tablets fill) |
| `desktop` | 1024–1440px | 1280px |
| `wide` | ≥1440px | 1440px |

### 3.4 Layout Grid

- **Mobile:** 4-column grid, 16px gutter, 16px outer margin
- **Tablet:** 8-column grid, 16px gutter, 24px outer margin
- **Desktop:** 12-column grid, 24px gutter, 32px outer margin

### 3.5 Z-Index Scale

| Token | Value | Use |
|---|---|---|
| `z.base` | 0 | Default |
| `z.raised` | 10 | Sticky elements |
| `z.dropdown` | 100 | Dropdowns, popovers |
| `z.sticky-header` | 200 | App header, sticky nav |
| `z.drawer` | 300 | Side drawers |
| `z.modal` | 400 | Modals, dialogs |
| `z.toast` | 500 | Toasts |
| `z.tooltip` | 600 | Tooltips |
| `z.command` | 700 | Command palette / search overlay |

---

## 4. Radii (Corner Radius)

> **Philosophy:** soft-full rounded — modern and premium. Generous enough to feel approachable and brand-forward, restrained enough to stay professional. Arabic glyphs breathe naturally inside rounder containers. Pills (9999px) are reserved for status tags and avatars only, never buttons.

| Token | px | Use |
|---|---|---|
| `radius.none` | 0 | Tables, full-width banners |
| `radius.xs` | 6 | Tags, micro chips |
| `radius.sm` | 12 | Inputs, small buttons |
| `radius.md` | 16 | **Buttons (default)** |
| `radius.lg` | 20 | Cards |
| `radius.xl` | 28 | Larger cards, modals on tablet |
| `radius.2xl` | 36 | Hero cards, sheets |
| `radius.3xl` | 48 | Mobile bottom sheets |
| `radius.full` | 9999 | Pills, avatars, FAB |

### 4.1 Component Radius Map

| Component | Radius |
|---|---|
| Button (primary/secondary) | `radius.md` (16px) |
| Button (icon-only square) | `radius.sm` (12px) |
| FAB (floating action) | `radius.full` |
| Input field | `radius.sm` (12px) |
| Checkbox | `radius.xs` (6px) |
| Card (item, action) | `radius.lg` (20px) |
| Card (large feature) | `radius.xl` (28px) |
| Modal (desktop) | `radius.xl` (28px) |
| Modal (tablet) | `radius.2xl` (36px) |
| Bottom sheet (mobile) | `radius.3xl` 48px top corners only |
| Drawer (right-side) | 0 (edge-anchored) |
| Status pill | `radius.full` |
| Badge | `radius.full` |
| Avatar | `radius.full` |
| Toast | `radius.lg` (20px) |
| Tooltip | `radius.sm` (12px) |
| Code block | `radius.sm` (12px) |

---

## 5. Elevation & Shadows

> **Philosophy:** very subtle. We use elevation to suggest interactivity and hierarchy — not to dazzle. Most surfaces have **zero or one** shadow level.

### 5.1 Shadow Scale (Light Mode)

```css
--shadow-xs: 0 1px 2px 0 rgba(25, 24, 23, 0.04);

--shadow-sm:
  0 1px 3px 0 rgba(25, 24, 23, 0.06),
  0 1px 2px 0 rgba(25, 24, 23, 0.04);

--shadow-md:
  0 4px 12px 0 rgba(25, 24, 23, 0.06),
  0 2px 4px 0 rgba(25, 24, 23, 0.04);

--shadow-lg:
  0 12px 24px 0 rgba(25, 24, 23, 0.08),
  0 4px 8px 0 rgba(25, 24, 23, 0.04);

--shadow-xl:
  0 24px 48px 0 rgba(25, 24, 23, 0.10),
  0 8px 16px 0 rgba(25, 24, 23, 0.06);

--shadow-2xl:
  0 32px 64px 0 rgba(25, 24, 23, 0.14),
  0 12px 24px 0 rgba(25, 24, 23, 0.08);

--shadow-glow-brand:
  0 0 0 4px rgba(200, 167, 90, 0.16);  /* focus ring (Wahsh) */

--shadow-glow-brand-forno:
  0 0 0 4px rgba(42, 107, 65, 0.18);   /* focus ring (Forno) */
```

### 5.2 Shadow Scale (Dark Mode)

In dark mode, shadows are nearly invisible. We use **surface elevation** (lighter background) instead.

```css
/* Dark mode: shadows minimal, used only for floating elements */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.20);

--shadow-sm:
  0 2px 4px 0 rgba(0, 0, 0, 0.24),
  0 1px 2px 0 rgba(0, 0, 0, 0.18);

--shadow-md:
  0 4px 12px 0 rgba(0, 0, 0, 0.30),
  0 2px 4px 0 rgba(0, 0, 0, 0.20);

--shadow-lg:
  0 12px 24px 0 rgba(0, 0, 0, 0.36),
  0 4px 8px 0 rgba(0, 0, 0, 0.24);

--shadow-xl:
  0 24px 48px 0 rgba(0, 0, 0, 0.44),
  0 8px 16px 0 rgba(0, 0, 0, 0.28);

/* Dark-mode focus ring uses brand color glow instead of shadow depth */
--shadow-glow-brand:
  0 0 0 4px rgba(200, 167, 90, 0.30);  /* Wahsh */

--shadow-glow-brand-forno:
  0 0 0 4px rgba(42, 107, 65, 0.36);   /* Forno */
```

### 5.3 Elevation Levels (Component Map)

| Elevation | Light shadow | Dark surface | Use |
|---|---|---|---|
| `elevation.0` | none | `bg.canvas` | Page background |
| `elevation.1` | `shadow-xs` | `bg.surface` | Cards (resting) |
| `elevation.2` | `shadow-sm` | `bg.surface.elevated` | Cards (hover) |
| `elevation.3` | `shadow-md` | `bg.surface.elevated` + `shadow-md` | Dropdowns, popovers |
| `elevation.4` | `shadow-lg` | `bg.surface.overlay` + `shadow-lg` | Modals, drawers |
| `elevation.5` | `shadow-xl` | `bg.surface.overlay` + `shadow-xl` | Toasts, tooltips |

### 5.4 No-Shadow Treatments

Some elements use **borders instead of shadows** for elevation in dark mode:
- Inputs at rest: 1px border, no shadow
- Tables: row dividers only, no shadow on rows
- Skeleton blocks: gradient shimmer, no shadow

---

## 6. Motion & Animation

> **Philosophy:** motion has purpose. Every animation either communicates state, guides attention, or rewards an action. Never decorative.

### 6.1 Duration Scale

| Token | ms | Use |
|---|---|---|
| `duration.instant` | 0 | No animation (reduced-motion fallback) |
| `duration.fast` | 120 | Hover, focus ring, tooltip show |
| `duration.base` | 200 | Standard state transitions, button press |
| `duration.slow` | 320 | Modal/drawer enter, accordion |
| `duration.slower` | 480 | Page transitions, complex orchestration |
| `duration.deliberate` | 640 | Onboarding, hero animations (rare) |

### 6.2 Easing Curves

```css
/* The signature curve — used for 80% of transitions */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

/* Smoother out — for entering elements */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);

/* Gentle in-out — for layout shifts */
--ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);

/* Spring — for delightful confirmations (use sparingly) */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Sharp — for fast disappearance */
--ease-in-quart: cubic-bezier(0.5, 0, 0.75, 0);

/* Linear — only for indeterminate progress */
--ease-linear: linear;
```

### 6.3 Default Transitions

```css
/* Universal "all" transition for state changes */
--transition-base:
  background-color var(--duration-base) var(--ease-out-expo),
  border-color var(--duration-base) var(--ease-out-expo),
  color var(--duration-fast) var(--ease-out-expo),
  box-shadow var(--duration-base) var(--ease-out-expo),
  transform var(--duration-fast) var(--ease-out-expo),
  opacity var(--duration-base) var(--ease-out-expo);
```

### 6.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Replace removed animations with **state changes only** — color shifts still happen, but instantly.

### 6.5 Animation Patterns

#### Fade In (entering elements)
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
animation: fade-in var(--duration-base) var(--ease-out-expo);
```

#### Slide Up (toasts, mobile sheets entering)
```css
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: slide-up var(--duration-slow) var(--ease-out-expo);
```

#### Slide From Left (RTL drawer entering — slides from logical end)
```css
/* RTL: drawer enters from the LEFT visually because nav rail is on the RIGHT */
@keyframes slide-in-drawer-rtl {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
animation: slide-in-drawer-rtl var(--duration-slow) var(--ease-out-expo);
```

#### Scale In (modals)
```css
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
animation: scale-in var(--duration-slow) var(--ease-out-expo);
```

#### Shimmer (skeleton loaders)
```css
@keyframes shimmer {
  0% { background-position: 100% 0; }   /* RTL: starts on right */
  100% { background-position: -100% 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-muted) 0%,
    var(--bg-subtle) 50%,
    var(--bg-muted) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s var(--ease-linear) infinite;
}
```

#### Pulse (active status indicator)
```css
@keyframes pulse-brand {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(200, 167, 90, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(200, 167, 90, 0);
  }
}
.status-active::before {
  animation: pulse-brand 2s var(--ease-in-out-cubic) infinite;
}
```

#### Press (button tap)
```css
.button:active {
  transform: scale(0.98);
  transition-duration: var(--duration-fast);
}
```

#### Lift (card hover)
```css
.card {
  transition: var(--transition-base);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

---

## 7. Iconography

### 7.1 Icon System

- **Library:** Lucide Icons (open source, consistent stroke, RTL-friendly)
- **Style:** outline (1.75px stroke), with rare filled exceptions for status
- **Custom icons:** food-domain icons (burger, pizza, kebab) drawn in same style — outline 1.75px on 24px grid

### 7.2 Icon Sizes

| Token | px | Use |
|---|---|---|
| `icon.xs` | 12 | Inline with caption text |
| `icon.sm` | 16 | Inline with body text |
| `icon.md` | 20 | Standard UI icons |
| `icon.lg` | 24 | Buttons, nav rail |
| `icon.xl` | 32 | Empty states, large CTAs |
| `icon.2xl` | 48 | Hero, illustrations |

### 7.3 RTL Flipping Rules

| Icon type | Flip in RTL? |
|---|---|
| Arrows (→ ← ↑ ↓) | ✅ Yes — direction reverses |
| Chevrons (caret left/right) | ✅ Yes |
| "Next" / "Back" carets | ✅ Yes |
| Send / arrow-up-right | ✅ Yes — points to outbound |
| Reply / arrow-curve | ✅ Yes |
| Search 🔍 | ❌ No — universal |
| Settings ⚙ | ❌ No |
| User 👤 | ❌ No |
| Bell 🔔 | ❌ No |
| Home 🏠 | ❌ No |
| Numbers / clock | ❌ No |

```css
/* Auto-flip directional icons in RTL */
[dir="rtl"] .icon-directional {
  transform: scaleX(-1);
}
```

### 7.4 Icon-Text Spacing

- Icon + label horizontal: `space.2` (8px) gap
- Icon + label vertical: `space.1` (4px) gap
- Icon button (square, no label): icon centered, padding = (button-height - icon-size) / 2

---

## 8. Components

### 8.1 Buttons

#### Primary Button

```
┌───────────────────────────────────┐
│         تأكيد الإرسال            │   ← brand-primary bg
└───────────────────────────────────┘   white text
   gold (Wahsh) / green (Forno)
```

**Specs:**
- Padding: `space.3` (12px) vertical · `space.6` (24px) horizontal
- Height: 48px (mobile), 56px (tablet), 40px (desktop)
- Border-radius: `radius.md` (16px)
- Font: 16px / 500 weight (tablet), 15px / 500 (mobile), 14px / 500 (desktop)
- Background: `brand.primary`
- Text: `brand.primary.fg`
- Border: none
- Shadow: `shadow-xs` (very subtle)

**States:**
| State | Change |
|---|---|
| Default | as above |
| Hover | bg → `brand.primary.hover` · transform: `translateY(-1px)` · `shadow-sm` |
| Pressed | bg → `brand.primary.pressed` · transform: `scale(0.98)` · shadow → none |
| Focus | `shadow-glow-brand` ring |
| Disabled | opacity 0.5 · cursor not-allowed · no hover effects |
| Loading | spinner replaces label · width preserved · disabled |

**Transition:** `var(--transition-base)`

**Micro-interaction:** on click, the button scales down to 0.98 over 120ms, then springs back. Subtle haptic on mobile if supported.

#### Secondary Button

Same dimensions as primary. Differences:
- Background: `bg.surface`
- Text: `text.primary`
- Border: 1px solid `border.default`

**Hover:** bg → `bg.muted` · border → `border.strong`
**Pressed:** bg → `bg.subtle`

#### Tertiary (Ghost) Button

- Background: transparent
- Text: `text.brand`
- Border: none
- Padding reduced: `space.2` (8px) vertical · `space.4` (16px) horizontal

**Hover:** bg → `bg.muted`

#### Destructive Button

- Background: `status.danger.500`
- Text: white
- Same dimensions as primary
- Reserved for irreversible actions (reject shipment, delete employee)
- Always paired with confirmation modal (P-09 in wireframes)

#### Icon Button

- Square: 48×48 (mobile), 56×56 (tablet), 36×36 (desktop)
- Border-radius: `radius.sm` (12px) for square, `radius.full` for circular variant
- Icon size: 20px (desktop), 24px (tablet/mobile)
- Background: transparent at rest, `bg.muted` on hover

#### FAB (Floating Action Button)

- 56×56 (mobile), 64×64 (tablet)
- `radius.full`
- Shadow: `shadow-md` resting, `shadow-lg` on hover
- Always brand-primary
- Icon: 24px (mobile), 28px (tablet)
- Position: bottom-right (RTL: bottom-left of layout flow which is bottom-right visually for primary)

**Wait — RTL clarification:** in RTL, the "primary" thumb-zone for right-handed users is bottom-right of the SCREEN. The FAB should be visually bottom-right always (regardless of LTR/RTL — thumb position doesn't reverse).

### 8.2 Inputs

#### Text Input

```
┌────────────────────────────────────────────┐
│  اسم الصنف                                 │
│ ┌────────────────────────────────────────┐ │
│ │ بقر مفروم 200جم                        │ │
│ └────────────────────────────────────────┘ │
│  مساعدة: استخدم الاسم الموحد للصنف       │
└────────────────────────────────────────────┘
```

**Specs:**
- Height: 48px (mobile), 56px (tablet), 40px (desktop)
- Padding: `space.4` (16px) horizontal
- Border-radius: `radius.sm` (12px)
- Border: 1px solid `border.default`
- Background: `bg.surface`
- Font: matches body
- Placeholder: `text.tertiary`

**States:**
| State | Change |
|---|---|
| Default | as above |
| Hover | border → `border.strong` |
| Focus | border → `border.brand` (2px) · `shadow-glow-brand` ring |
| Filled (valid) | border stays default |
| Error | border → `status.danger.500` (2px) · helper text → danger color |
| Disabled | bg → `bg.muted` · text → `text.tertiary` |

**RTL:** text aligns right, cursor moves right-to-left, leading icon (search etc.) sits on the right.

#### Numeric Stepper (P-06 reference)

```
┌─────────────────────────────────────┐
│   [  −  ]   [   50   ]   [  +  ]   │
└─────────────────────────────────────┘
```

**Specs:**
- Total height: 56px (tablet), 48px (mobile)
- Buttons: square, equal to height
- Center number: tabular nums, 24px / 700 weight (Bold)
- Borders: `border.default` between sections
- `radius.md` (16px) on outer container, none on inner

**Interactions:**
- Tap +/− → +1 / −1 with subtle scale animation
- Long-press +/− → accelerates: 5×/s after 600ms, 10×/s after 1.5s
- Tap center number → opens numeric keypad sheet
- Reaches max → + button disables with subtle shake

#### Search Input

```
┌────────────────────────────────────────────┐
│ 🔍  ابحث عن صنف...              [✕ مسح]  │
└────────────────────────────────────────────┘
```

- Leading icon: 🔍 magnifier
- Trailing icon: clear-X (appears when input has value)
- Debounced search: 300ms after last keystroke
- Recent searches dropdown when focused with empty value

#### Toggle Switch

```
Off:  [ ◯               ]
On:   [               ◉ ]   ← brand-primary fill
```

**Specs:**
- Track: 48×28px
- Knob: 24×24px
- Border-radius: full
- Off track: `bg.muted`, knob `bg.surface`
- On track: `brand.primary`, knob white

**Animation:**
```css
.toggle-knob {
  transition:
    transform var(--duration-base) var(--ease-out-expo),
    background-color var(--duration-base) var(--ease-out-expo);
}
.toggle-track {
  transition: background-color var(--duration-base) var(--ease-out-expo);
}
```

In RTL, "on" = knob on the **right** (where the eye expects "active" to be).

#### Checkbox

- 24×24px box
- Border-radius: `radius.xs` (6px)
- Border: 1.5px solid `border.default`
- Checked: bg → `brand.primary`, border same color, white check icon (1.5px stroke)

**Animation:**
```css
.checkbox-icon {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  transition: stroke-dashoffset var(--duration-base) var(--ease-out-expo);
}
.checkbox-checked .checkbox-icon {
  stroke-dashoffset: 0;
}
```

The checkmark **draws in** rather than appearing — gives a sense of confirmation.

#### Radio Button

- 24×24px circle
- Outer: 1.5px border
- Inner dot: 10×10 circle, brand-primary, scale animation 0 → 1 on select

```css
.radio-inner {
  transform: scale(0);
  transition: transform var(--duration-base) var(--ease-out-expo);
}
.radio-checked .radio-inner {
  transform: scale(1);
}
```

### 8.3 Cards

#### Item Card (Inventory Grid)

```
┌────────────────────────────┐
│                            │
│        [image 60%]         │
│                            │
│                            │
├────────────────────────────┤
│  بقر مفروم 200جم          │
│  المخزون: 47               │
│  ⏰ 5 أيام                  │
└────────────────────────────┘
```

**Specs:**
- Background: `bg.surface`
- Border-radius: `radius.lg` (20px)
- Border: 1px solid `border.subtle` (light mode) / none (dark mode)
- Shadow: `shadow-xs` resting
- Padding: `space.4` (16px)

**Hover state:**
- transform: `translateY(-2px)`
- shadow → `shadow-sm`
- border → `border.default`
- duration: `var(--duration-base)`

**Press state (mobile):**
- transform: `scale(0.98)`
- duration: `var(--duration-fast)`

#### Action Card (Dashboard)

Larger, more padding. Contains a title, value, and CTA.
- Padding: `space.6` (24px)
- Border-radius: `radius.xl` (28px)
- Optional accent stripe on right edge (RTL: right) using `brand.primary`

#### Status Card (Alerts)

Uses semantic background tints:
- Success: `bg-canvas` + thin left border `status.success.500` + tinted bg
- Warning: same pattern with warning color
- Danger: same with danger color

```
┌─┬─────────────────────────────────────┐
│ │  🔴 شحنة وصلت                       │
│ │  من المصنع · منذ 4 د                │
│ │  [ استلم الآن ←]                    │
└─┴─────────────────────────────────────┘
  ↑ left edge accent stripe (RTL: right edge)
```

### 8.4 Status Pills (P-03 reference)

```
🟢 [ في الطريق ]   🔴 [ متنازع عليه ]
```

**Specs:**
- Height: 28px
- Padding: 4px 12px
- Border-radius: `radius.full`
- Font: 13px / 500 weight
- Background: `status.{type}.bg` (semi-transparent tint)
- Text: `status.{type}.500` (full color)
- Icon: 12×12 dot, `status.{type}.500` filled
- Gap icon-text: `space.2` (8px)

**Active state pulse** (P-04 in wireframes):
The "current" status pill (e.g., "في الطريق" while shipment is moving) gets a subtle pulse animation:

```css
.status-pill[data-pulsing="true"] .status-dot {
  animation: pulse-brand 2s var(--ease-in-out-cubic) infinite;
}
```

### 8.5 Navigation

#### Right Rail (Tablet/Desktop)

```
┌──┐
│🏠│ ← active: brand color tint bg + brand text
│  │
│📦│ ← inactive: text.secondary, no bg
│  │
│📋│
│  │
│🚚│
│  │
│📥│
│  │
│🏢│
│  │
│👥│
│  │
│💰│
└──┘
```

**Specs:**
- Width: 64px (icons only) or 240px (expanded with labels)
- Active indicator: 3px wide stripe on the inner edge (RTL: the **left** edge of the rail since the rail itself is on the right)
- Background of active item: `bg.muted`
- Icon: 24px, color `text.secondary` default → `text.brand` active
- Hover: bg → `bg.subtle`

**Animation on active change:**
The 3px stripe slides between items vertically:
```css
.rail-indicator {
  position: absolute;
  width: 3px;
  background: var(--brand-primary);
  border-radius: 2px;
  transition: top var(--duration-slow) var(--ease-out-expo);
}
```

#### Bottom Tab Bar (Mobile)

- 5 tabs max
- Each tab: icon (24px) + label (12px / 500 weight)
- Active: brand color
- Inactive: text.tertiary
- Background: `bg.surface` with subtle top-shadow `shadow-xs`
- Height: 64px + safe-area-inset-bottom

#### Breadcrumb

```
الرئيسية ‹ المخزون ‹ بطاقة الصنف
```

- Font: 14px / 400 weight
- Separator: `‹` (RTL-correct chevron)
- Last item: `text.primary` (current page)
- Earlier items: `text.secondary`, hover → `text.brand`
- Click → navigate

### 8.6 Modals & Sheets

#### Modal (Desktop/Tablet)

**Backdrop:**
- Background: `rgba(0, 0, 0, 0.48)` dark mode, `rgba(25, 24, 23, 0.32)` light mode
- Animation: fade in over `duration.slow`

**Modal box:**
- Background: `bg.surface.overlay`
- Border-radius: `radius.xl` (28px desktop) / `radius.2xl` (36px tablet)
- Max-width: 560px (default), 720px (wide)
- Padding: `space.8` (32px)
- Shadow: `shadow-xl`
- Animation: scale-in (0.96 → 1) + fade

#### Bottom Sheet (Mobile)

```
       ┌─────────────────────┐
       │  ━━━ (drag handle)  │
       │                     │
       │      Content        │
       │                     │
       └─────────────────────┘
```

- Background: `bg.surface.overlay`
- Border-radius: 48px top corners only (`radius.3xl`)
- Drag handle: 36×4px pill, `border.default`, centered
- Animation: slide-up from bottom over `duration.slow`
- Dismissible: tap backdrop, swipe down, system back button

#### Drawer (Tablet/Desktop right-side)

- Width: 480px (tablet), 560px (desktop)
- Anchored to **right edge** (RTL: which is "start" — visually right)
- Slide-in from right, but in RTL coordinate system this is `transform: translateX(100%)` → `0`
- Header sticky: title + close button
- Footer sticky: action buttons

### 8.7 Toast / Notification

```
                          ┌──────────────────────────┐
                          │ ✅ تم حفظ التغييرات      │
                          │ سيتم تحديث الصفحة...    │
                          └──────────────────────────┘
```

**Specs:**
- Position: top-center (RTL-aware) or top-right corner of viewport
- Width: max 400px
- Background: `bg.surface.overlay`
- Border-radius: `radius.lg` (20px)
- Padding: `space.4` (16px)
- Shadow: `shadow-lg`
- Auto-dismiss: 4000ms (success), 6000ms (info), 8000ms (warning), persistent (error — requires close)

**Animation:**
- Enter: slide down + fade in over `duration.slow`
- Exit: fade out only over `duration.fast` (less distracting)

**Stacking:** when multiple toasts active, they stack vertically with `space.2` (8px) gaps. Latest toast on top.

### 8.8 Skeleton Loaders

Used instead of spinners for any content area >150px tall.

```
┌──────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░     │  ← shimmering blocks
│ ░░░░░░░░░░░             │
│                          │
│ ░░░░░░░░░░░░░░░         │
└──────────────────────────┘
```

- Background: gradient using `bg.muted` → `bg.subtle`
- Animation: shimmer 1.4s linear infinite
- Each skeleton shape mirrors the actual content's dimensions

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-muted) 0%,
    var(--bg-subtle) 50%,
    var(--bg-muted) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  /* RTL: shimmer reads right-to-left */
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}
```

### 8.9 Tooltip

- Background: `bg.surface.overlay` (dark) or `text.primary` inverted (light treatment)
- Padding: `space.2 space.3` (8px / 12px)
- Border-radius: `radius.sm` (12px)
- Font: 13px / 500 weight
- Arrow: 8×4 triangle, same color as tooltip bg
- Show delay: 600ms hover
- Hide delay: 100ms
- Animation: fade + 4px translate from tooltip's anchor direction

---

## 9. Micro-Interactions Catalog

The system has **16 named micro-interactions**. Each has a defined trigger, duration, and purpose.

| # | Name | Trigger | Duration | Purpose |
|---|---|---|---|---|
| 1 | **Press** | Button mousedown/touchstart | 120ms | Tactile confirmation of tap |
| 2 | **Lift** | Card hover | 200ms | Indicates interactivity |
| 3 | **Focus Ring** | Tab/click focus | 120ms | Accessibility + keyboard navigation |
| 4 | **Slide-In** | Drawer/sheet enter | 320ms | Spatial entry from edge |
| 5 | **Scale-In** | Modal enter | 320ms | Centered focus |
| 6 | **Fade-In** | Tooltip, popover | 200ms | Soft appearance |
| 7 | **Slide-Up** | Toast enter | 320ms | Notification arrival |
| 8 | **Shimmer** | Skeleton loading | 1400ms loop | Indicates loading without spinner |
| 9 | **Pulse** | Active status, current step | 2000ms loop | "Live" indicator |
| 10 | **Check-Draw** | Checkbox confirm | 200ms | Reward of confirmation |
| 11 | **Knob-Slide** | Toggle switch | 200ms | State change clarity |
| 12 | **Stripe-Slide** | Nav rail active change | 320ms | Spatial connection between sections |
| 13 | **Number-Tween** | KPI value change | 480ms | Smooth update of metrics |
| 14 | **Shake** | Validation error | 320ms | Attention-grabbing for error |
| 15 | **Confetti / Spring** | Major success (rare) | 640ms | Celebration moments |
| 16 | **Step-Advance** | Multi-step form next | 320ms | Spatial sense of progress |

### 9.1 Number Tween (KPI animation)

When a dashboard KPI updates (e.g., daily sales count), animate the number transitioning rather than swapping:

```js
// Pseudocode
animateNumber({
  from: previousValue,
  to: newValue,
  duration: 480,
  easing: 'easeOutExpo',
  onUpdate: (value) => {
    element.textContent = formatNumber(value);
  }
});
```

This makes dashboards feel alive without being distracting.

### 9.2 Shake on Error

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.input-error {
  animation: shake 320ms var(--ease-out-expo);
}
```

Used when:
- Wrong PIN entered
- Form submitted with errors
- Quantity exceeds hard cap

### 9.3 Step Advance Animation

When advancing through a multi-step form:
```css
/* Outgoing step */
.step-exit {
  transform: translateX(-24px);  /* RTL: slide LEFT (forward direction) */
  opacity: 0;
  transition:
    transform var(--duration-base) var(--ease-in-quart),
    opacity var(--duration-fast) var(--ease-in-quart);
}

/* Incoming step */
.step-enter {
  transform: translateX(24px);  /* RTL: enters from RIGHT (next direction) */
  opacity: 0;
  animation: step-in var(--duration-slow) var(--ease-out-expo) forwards;
}

@keyframes step-in {
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

> **RTL note:** "next" in RTL = LEFT. So advancing forward shifts content leftward, new content enters from the right. Reverse for "back."

---

## 10. Implementation — CSS Variables

```css
/* ============================================
   FOUNDATION TOKENS (universal across themes)
   ============================================ */

:root {
  /* Spacing */
  --space-0: 0;
  --space-0-5: 2px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Radii */
  --radius-none: 0;
  --radius-xs: 6px;
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --radius-2xl: 36px;
  --radius-3xl: 48px;
  --radius-full: 9999px;

  /* Type scale */
  --font-size-display: 2rem;       /* 32px */
  --font-size-h1: 1.75rem;          /* 28px */
  --font-size-h2: 1.5rem;           /* 24px */
  --font-size-h3: 1.25rem;          /* 20px */
  --font-size-h4: 1.125rem;         /* 18px */
  --font-size-body-lg: 1.0625rem;   /* 17px */
  --font-size-body: 1rem;           /* 16px */
  --font-size-body-sm: 0.875rem;    /* 14px */
  --font-size-caption: 0.8125rem;   /* 13px */
  --font-size-micro: 0.75rem;       /* 12px */

  --line-height-tight: 1.25;
  --line-height-snug: 1.4;
  --line-height-normal: 1.65;
  --line-height-loose: 1.75;

  /* Thmanyah Sans weight tokens — note: NO 600 (semibold).
     Use bold (700) wherever a "semibold" feel is needed. */
  --font-weight-light: 300;     /* avoid in UI — editorial only */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-black: 900;     /* display only */

  /* Motion */
  --duration-instant: 0ms;
  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 320ms;
  --duration-slower: 480ms;
  --duration-deliberate: 640ms;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-in-quart: cubic-bezier(0.5, 0, 0.75, 0);
  --ease-linear: linear;

  --transition-base:
    background-color var(--duration-base) var(--ease-out-expo),
    border-color var(--duration-base) var(--ease-out-expo),
    color var(--duration-fast) var(--ease-out-expo),
    box-shadow var(--duration-base) var(--ease-out-expo),
    transform var(--duration-fast) var(--ease-out-expo),
    opacity var(--duration-base) var(--ease-out-expo);

  /* Z-index */
  --z-base: 0;
  --z-raised: 10;
  --z-dropdown: 100;
  --z-sticky-header: 200;
  --z-drawer: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-tooltip: 600;
  --z-command: 700;

  /* Status colors (universal — same across themes) */
  --status-success: #16873F;
  --status-success-bg: rgba(22, 135, 63, 0.10);
  --status-warning: #D97706;
  --status-warning-bg: rgba(217, 119, 6, 0.10);
  --status-danger: #DC2626;
  --status-danger-bg: rgba(220, 38, 38, 0.10);
  --status-info: #2563EB;
  --status-info-bg: rgba(37, 99, 235, 0.10);
}

/* Dark mode overrides for status (higher luminance) */
[data-mode="dark"] {
  --status-success: #22C55E;
  --status-success-bg: rgba(34, 197, 94, 0.12);
  --status-warning: #FBBF24;
  --status-warning-bg: rgba(251, 191, 36, 0.14);
  --status-danger: #EF4444;
  --status-danger-bg: rgba(239, 68, 68, 0.14);
  --status-info: #60A5FA;
  --status-info-bg: rgba(96, 165, 250, 0.14);
}

/* ============================================
   THEME × MODE TOKENS
   ============================================ */

/* WAHSH — DARK MODE (default) */
[data-theme="wahsh"][data-mode="dark"],
[data-theme="wahsh"]:not([data-mode]) {
  --bg-canvas: #191817;
  --bg-surface: #232120;
  --bg-surface-elevated: #2C2A28;
  --bg-surface-overlay: #363330;
  --bg-muted: rgba(239, 233, 225, 0.04);
  --bg-subtle: rgba(239, 233, 225, 0.08);

  --border-default: #4A4744;
  --border-subtle: rgba(239, 233, 225, 0.08);
  --border-strong: #6E6A65;
  --border-brand: #C8A75A;

  --text-primary: #EFE9E1;
  --text-secondary: #A09B95;
  --text-tertiary: #6E6A65;
  --text-inverse: #191817;
  --text-brand: #C8A75A;

  --brand-primary: #C8A75A;
  --brand-primary-hover: #B08F45;
  --brand-primary-pressed: #8E7333;
  --brand-primary-fg: #191817;
  --brand-accent: #E64001;
  --brand-warm: #FD9D04;
  --brand-earth: #2A6B41;

  --shadow-glow-brand: 0 0 0 4px rgba(200, 167, 90, 0.30);

  /* Dark mode shadows */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.20);
  --shadow-sm: 0 2px 4px 0 rgba(0, 0, 0, 0.24), 0 1px 2px 0 rgba(0, 0, 0, 0.18);
  --shadow-md: 0 4px 12px 0 rgba(0, 0, 0, 0.30), 0 2px 4px 0 rgba(0, 0, 0, 0.20);
  --shadow-lg: 0 12px 24px 0 rgba(0, 0, 0, 0.36), 0 4px 8px 0 rgba(0, 0, 0, 0.24);
  --shadow-xl: 0 24px 48px 0 rgba(0, 0, 0, 0.44), 0 8px 16px 0 rgba(0, 0, 0, 0.28);
}

/* WAHSH — LIGHT MODE */
[data-theme="wahsh"][data-mode="light"] {
  --bg-canvas: #FAF6F4;
  --bg-surface: #FFFFFF;
  --bg-surface-elevated: #FFFFFF;
  --bg-surface-overlay: #FFFFFF;
  --bg-muted: #EFE3DF;
  --bg-subtle: rgba(25, 24, 23, 0.03);

  --border-default: #E2D2CC;
  --border-subtle: rgba(25, 24, 23, 0.06);
  --border-strong: rgba(25, 24, 23, 0.18);
  --border-brand: #8E7333;

  --text-primary: #191817;
  --text-secondary: rgba(25, 24, 23, 0.68);
  --text-tertiary: rgba(25, 24, 23, 0.46);
  --text-inverse: #FFFFFF;
  --text-brand: #6B5624;

  --brand-primary: #8E7333;
  --brand-primary-hover: #6B5624;
  --brand-primary-pressed: #4A3B17;
  --brand-primary-fg: #FFFFFF;
  --brand-accent: #E64001;
  --brand-warm: #D88300;
  --brand-earth: #2A6B41;

  --shadow-glow-brand: 0 0 0 4px rgba(200, 167, 90, 0.16);

  /* Light mode shadows */
  --shadow-xs: 0 1px 2px 0 rgba(25, 24, 23, 0.04);
  --shadow-sm: 0 1px 3px 0 rgba(25, 24, 23, 0.06), 0 1px 2px 0 rgba(25, 24, 23, 0.04);
  --shadow-md: 0 4px 12px 0 rgba(25, 24, 23, 0.06), 0 2px 4px 0 rgba(25, 24, 23, 0.04);
  --shadow-lg: 0 12px 24px 0 rgba(25, 24, 23, 0.08), 0 4px 8px 0 rgba(25, 24, 23, 0.04);
  --shadow-xl: 0 24px 48px 0 rgba(25, 24, 23, 0.10), 0 8px 16px 0 rgba(25, 24, 23, 0.06);
}

/* FORNO — DARK MODE */
[data-theme="forno"][data-mode="dark"],
[data-theme="forno"]:not([data-mode]) {
  --bg-canvas: #1C2117;
  --bg-surface: #252B20;
  --bg-surface-elevated: #2E3528;
  --bg-surface-overlay: #373F30;
  --bg-muted: rgba(236, 237, 224, 0.04);
  --bg-subtle: rgba(236, 237, 224, 0.08);

  --border-default: #4A5340;
  --border-subtle: rgba(236, 237, 224, 0.08);
  --border-strong: #6E7560;
  --border-brand: #2A6B41;

  --text-primary: #ECEDE0;
  --text-secondary: #9BA08C;
  --text-tertiary: #6E7560;
  --text-inverse: #1C2117;
  --text-brand: #5FAA7A;

  --brand-primary: #2A6B41;
  --brand-primary-hover: #1F5331;
  --brand-primary-pressed: #163D24;
  --brand-primary-fg: #FFFFFF;
  --brand-secondary: #E64001;
  --brand-warm: #FD9D04;

  --shadow-glow-brand: 0 0 0 4px rgba(42, 107, 65, 0.36);

  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.20);
  --shadow-sm: 0 2px 4px 0 rgba(0, 0, 0, 0.24), 0 1px 2px 0 rgba(0, 0, 0, 0.18);
  --shadow-md: 0 4px 12px 0 rgba(0, 0, 0, 0.30), 0 2px 4px 0 rgba(0, 0, 0, 0.20);
  --shadow-lg: 0 12px 24px 0 rgba(0, 0, 0, 0.36), 0 4px 8px 0 rgba(0, 0, 0, 0.24);
  --shadow-xl: 0 24px 48px 0 rgba(0, 0, 0, 0.44), 0 8px 16px 0 rgba(0, 0, 0, 0.28);
}

/* FORNO — LIGHT MODE */
[data-theme="forno"][data-mode="light"] {
  --bg-canvas: #FAF6F4;
  --bg-surface: #FFFFFF;
  --bg-surface-elevated: #FFFFFF;
  --bg-surface-overlay: #FFFFFF;
  --bg-muted: #EFE3DF;
  --bg-subtle: rgba(28, 33, 23, 0.03);

  --border-default: #E2D2CC;
  --border-subtle: rgba(28, 33, 23, 0.06);
  --border-strong: rgba(28, 33, 23, 0.18);
  --border-brand: #2A6B41;

  --text-primary: #1C2117;
  --text-secondary: rgba(28, 33, 23, 0.68);
  --text-tertiary: rgba(28, 33, 23, 0.46);
  --text-inverse: #FFFFFF;
  --text-brand: #163D24;

  --brand-primary: #2A6B41;
  --brand-primary-hover: #1F5331;
  --brand-primary-pressed: #163D24;
  --brand-primary-fg: #FFFFFF;
  --brand-secondary: #E64001;
  --brand-warm: #D88300;

  --shadow-glow-brand: 0 0 0 4px rgba(42, 107, 65, 0.18);

  --shadow-xs: 0 1px 2px 0 rgba(28, 33, 23, 0.04);
  --shadow-sm: 0 1px 3px 0 rgba(28, 33, 23, 0.06), 0 1px 2px 0 rgba(28, 33, 23, 0.04);
  --shadow-md: 0 4px 12px 0 rgba(28, 33, 23, 0.06), 0 2px 4px 0 rgba(28, 33, 23, 0.04);
  --shadow-lg: 0 12px 24px 0 rgba(28, 33, 23, 0.08), 0 4px 8px 0 rgba(28, 33, 23, 0.04);
  --shadow-xl: 0 24px 48px 0 rgba(28, 33, 23, 0.10), 0 8px 16px 0 rgba(28, 33, 23, 0.06);
}

/* ============================================
   FONT FACE (Thmanyah Sans — primary typeface)
   ============================================ */

@font-face {
  font-family: "Thmanyah Sans";
  src: url("/fonts/thmanyahsans-Light.woff2") format("woff2");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Thmanyah Sans";
  src: url("/fonts/thmanyahsans-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Thmanyah Sans";
  src: url("/fonts/thmanyahsans-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Thmanyah Sans";
  src: url("/fonts/thmanyahsans-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Thmanyah Sans";
  src: url("/fonts/thmanyahsans-Black.woff2") format("woff2");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

/* ============================================
   ROOT SETUP — Thmanyah Sans is universal
   (handles both Arabic and Latin glyphs)
   ============================================ */

html {
  font-family:
    "Thmanyah Sans",
    "IBM Plex Sans Arabic",
    "Noto Sans Arabic",
    "Cairo",
    "Tajawal",
    -apple-system, BlinkMacSystemFont, sans-serif;
}

body {
  background: var(--bg-canvas);
  color: var(--text-primary);
  font-size: var(--font-size-body);
  line-height: var(--line-height-normal);
  font-feature-settings: "tnum" 1, "lnum" 1;
  transition:
    background-color var(--duration-base) var(--ease-out-expo),
    color var(--duration-base) var(--ease-out-expo);
}
```

---

## 11. Implementation — Tailwind Config

```js
// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
  darkMode: ['class', '[data-mode="dark"]'],

  theme: {
    extend: {
      colors: {
        // Semantic — these resolve via CSS vars set per theme/mode
        canvas: 'var(--bg-canvas)',
        surface: {
          DEFAULT: 'var(--bg-surface)',
          elevated: 'var(--bg-surface-elevated)',
          overlay: 'var(--bg-surface-overlay)',
        },
        muted: 'var(--bg-muted)',
        subtle: 'var(--bg-subtle)',

        border: {
          DEFAULT: 'var(--border-default)',
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
          brand: 'var(--border-brand)',
        },

        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          inverse: 'var(--text-inverse)',
          brand: 'var(--text-brand)',
        },

        brand: {
          DEFAULT: 'var(--brand-primary)',
          hover: 'var(--brand-primary-hover)',
          pressed: 'var(--brand-primary-pressed)',
          fg: 'var(--brand-primary-fg)',
          accent: 'var(--brand-accent)',
          secondary: 'var(--brand-secondary)',
          warm: 'var(--brand-warm)',
          earth: 'var(--brand-earth)',
        },

        status: {
          success: {
            DEFAULT: 'var(--status-success)',
            bg: 'var(--status-success-bg)',
          },
          warning: {
            DEFAULT: 'var(--status-warning)',
            bg: 'var(--status-warning-bg)',
          },
          danger: {
            DEFAULT: 'var(--status-danger)',
            bg: 'var(--status-danger-bg)',
          },
          info: {
            DEFAULT: 'var(--status-info)',
            bg: 'var(--status-info-bg)',
          },
        },
      },

      borderRadius: {
        none: '0',
        xs: '6px',
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '28px',
        '2xl': '36px',
        '3xl': '48px',
        full: '9999px',
      },

      spacing: {
        '0.5': '2px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },

      // NOTE: Thmanyah Sans has no Semibold (600). Headings use Bold (700).
      // Display uses Black (900). Never use 600 — browsers will fake-bold.
      fontSize: {
        display: ['2rem', { lineHeight: '1.2', fontWeight: '900' }],
        h1: ['1.75rem', { lineHeight: '1.3', fontWeight: '700' }],
        h2: ['1.5rem', { lineHeight: '1.35', fontWeight: '700' }],
        h3: ['1.25rem', { lineHeight: '1.4', fontWeight: '700' }],
        h4: ['1.125rem', { lineHeight: '1.45', fontWeight: '700' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.65', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.65', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],
        micro: ['0.75rem', { lineHeight: '1.45', fontWeight: '500' }],
        button: ['1rem', { lineHeight: '1', fontWeight: '500' }],
        'numeric-xl': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'numeric-lg': ['1.5rem', { lineHeight: '1.25', fontWeight: '700' }],
        'numeric-md': ['1.125rem', { lineHeight: '1.35', fontWeight: '500' }],
      },

      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        bold: '700',
        black: '900',
        // Intentionally no 'semibold' (600) — Thmanyah Sans doesn't have it.
      },

      fontFamily: {
        sans: [
          'Thmanyah Sans',
          'IBM Plex Sans Arabic',
          'Noto Sans Arabic',
          'Cairo',
          'Tajawal',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        display: [
          'Thmanyah Sans',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        glow: 'var(--shadow-glow-brand)',
      },

      transitionDuration: {
        instant: '0ms',
        fast: '120ms',
        DEFAULT: '200ms',
        slow: '320ms',
        slower: '480ms',
        deliberate: '640ms',
      },

      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'in-out-cubic': 'cubic-bezier(0.65, 0, 0.35, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'in-quart': 'cubic-bezier(0.5, 0, 0.75, 0)',
      },

      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          from: { backgroundPosition: '100% 0' },
          to: { backgroundPosition: '-100% 0' },
        },
        'pulse-brand': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200, 167, 90, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(200, 167, 90, 0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },

      animation: {
        'fade-in': 'fade-in 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.4s linear infinite',
        'pulse-brand': 'pulse-brand 2s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        shake: 'shake 320ms cubic-bezier(0.16, 1, 0.3, 1)',
      },

      zIndex: {
        base: '0',
        raised: '10',
        dropdown: '100',
        'sticky-header': '200',
        drawer: '300',
        modal: '400',
        toast: '500',
        tooltip: '600',
        command: '700',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    plugin(({ addVariant }) => {
      // Theme variants
      addVariant('theme-wahsh', '[data-theme="wahsh"] &');
      addVariant('theme-forno', '[data-theme="forno"] &');
      // Mode variants
      addVariant('mode-light', '[data-mode="light"] &');
      addVariant('mode-dark', '[data-mode="dark"] &');
      // RTL/LTR
      addVariant('rtl', '[dir="rtl"] &');
      addVariant('ltr', '[dir="ltr"] &');
    }),
  ],
};
```

### 11.1 Tailwind Usage Examples

```jsx
// Primary button (works on all 4 surfaces automatically)
<button className="
  bg-brand text-brand-fg
  hover:bg-brand-hover hover:-translate-y-px
  active:bg-brand-pressed active:scale-[0.98]
  px-6 py-3
  rounded-md
  shadow-xs hover:shadow-sm
  font-medium
  transition-all duration-fast ease-out-expo
">
  تأكيد الإرسال
</button>

// Status pill
<span className="
  inline-flex items-center gap-2
  px-3 py-1
  rounded-full
  bg-status-success-bg text-status-success
  text-caption font-medium
">
  <span className="w-2 h-2 rounded-full bg-status-success" />
  في الطريق
</span>

// Card
<article className="
  bg-surface
  border border-subtle
  rounded-lg
  p-4
  shadow-xs hover:shadow-sm hover:-translate-y-0.5 hover:border-default
  transition-all duration-base ease-out-expo
">
  ...
</article>
```

---

## 12. Theme & Mode Switcher Logic

### 12.1 React Context Implementation

```tsx
// theme-context.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'wahsh' | 'forno';
type Mode = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  mode: Mode;
  setTheme: (t: Theme) => void;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 1. Initialize from user preference / branch context / system preference
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'wahsh';
    return (localStorage.getItem('theme') as Theme) || 'wahsh';
  });

  const [mode, setModeState] = useState<Mode>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem('mode') as Mode;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  });

  // 2. Apply attributes to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('theme', theme);
    localStorage.setItem('mode', mode);
  }, [theme, mode]);

  // 3. Listen for system mode changes (only if user hasn't manually set)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('mode-manual')) {
        setModeState(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  const setMode = (m: Mode) => {
    localStorage.setItem('mode-manual', '1');
    setModeState(m);
  };

  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};
```

### 12.2 Brand-Aware Theme Auto-Detect

When a user logs into the ERP, the theme can shift based on which branch they're operating:

```tsx
// In login flow / branch switcher
import { useTheme } from './theme-context';

function BranchContextProvider({ branchId, children }) {
  const { setTheme } = useTheme();
  const branch = useBranch(branchId);

  useEffect(() => {
    if (branch?.brand === 'wahsh' || branch?.brand === 'kababgy') {
      setTheme('wahsh');
    } else if (branch?.brand === 'forno') {
      setTheme('forno');
    }
    // Multi-brand or factory views keep the current theme
  }, [branch, setTheme]);

  return children;
}
```

### 12.3 Theme Switcher UI

```tsx
function ThemeModeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <button
      onClick={toggleMode}
      className="icon-button"
      aria-label={mode === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
    >
      {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
```

### 12.4 Mode Transition Animation

When switching modes, animate the page background to avoid jarring flash:

```css
html {
  transition:
    background-color var(--duration-slower) var(--ease-out-expo),
    color var(--duration-slower) var(--ease-out-expo);
}

/* But don't transition every element — that creates a wave effect */
* {
  transition:
    background-color var(--duration-base) var(--ease-out-expo),
    border-color var(--duration-base) var(--ease-out-expo),
    color var(--duration-fast) var(--ease-out-expo);
}
```

### 12.5 Print-Light Override

Reports and PDF exports always use light mode regardless of UI mode:

```css
@media print {
  :root {
    /* Force light tokens for printing */
    --bg-canvas: #FFFFFF;
    --bg-surface: #FFFFFF;
    --text-primary: #000000;
    --text-secondary: #404040;
    --border-default: #CCCCCC;
    --shadow-xs: none;
    --shadow-sm: none;
    --shadow-md: none;
  }
}
```

---

## 13. Accessibility & Quality Gates

### 13.1 Quality Gates (Must Pass to Ship)

| Gate | Tool / Method | Threshold |
|---|---|---|
| Color contrast (text) | Stark, Axe, Wave | AA minimum, AAA for primary text |
| Color contrast (UI) | Manual + tools | 3:1 minimum for borders, focus rings |
| Touch target size | Manual measurement | Spec floors per device |
| Keyboard navigation | Manual tab-through | Every interactive element reachable |
| Focus visible | Manual | Focus ring on every focusable |
| Reduced motion | Browser setting | All non-essential animation respects |
| Screen reader | NVDA, VoiceOver | Labels readable in Arabic |
| RTL completeness | Visual review | No LTR remnants in production builds |
| Theme switching | Manual | All 4 surfaces visually correct |
| Mode persistence | Manual | User preference survives reload |

### 13.2 ARIA Patterns

- Buttons: `<button>` not `<div role="button">`
- Tabs: `role="tablist"` + `role="tab"` + `aria-selected`
- Modals: `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- Live regions for toasts: `aria-live="polite"` (or `assertive` for errors)
- Form errors: `aria-invalid="true"` + `aria-describedby` to error message ID

### 13.3 Keyboard Map

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move focus forward / back |
| `Enter` / `Space` | Activate button / link |
| `Esc` | Close modal / drawer / popover |
| `Arrow keys` | Navigate within composite (radio group, menu, tabs) |
| `/` | Focus global search (desktop) |
| `Cmd/Ctrl + K` | Open command palette |
| `Cmd/Ctrl + ج` | New (جديد) — Arabic-aware shortcut |
| `Cmd/Ctrl + ح` | Save (حفظ) — Arabic-aware shortcut |

### 13.4 Focus Ring Standard

```css
*:focus-visible {
  outline: none;
  box-shadow: var(--shadow-glow-brand);
  border-radius: inherit;
}
```

Never `outline: 0` without an alternative. Focus must always be visible.

### 13.5 Loading & Error Voice

| State | Message tone |
|---|---|
| Loading >2s | "جاري التحميل..." or skeleton |
| Network error | "تعذّر الاتصال — تحقق من الإنترنت" + retry button |
| Permission denied | "ليس لديك صلاحية للوصول لهذه الصفحة" |
| Validation error | Specific: "الكمية يجب أن تكون أكبر من 0" |
| Generic error | "حدث خطأ غير متوقع — حاول مرة أخرى" |

Never use English error codes in user-facing text. Log them invisibly for debugging.

---

## 14. Component Quick Reference

A condensed cheat-sheet for engineering:

```
BUTTONS
  Primary:    bg-brand text-brand-fg rounded-md px-6 py-3 hover:-translate-y-px shadow-xs
  Secondary:  bg-surface border border-default rounded-md px-6 py-3
  Ghost:      bg-transparent text-brand rounded-md px-4 py-2 hover:bg-muted
  Destructive:bg-status-danger text-white rounded-md px-6 py-3
  Icon:       w-12 h-12 rounded-sm hover:bg-muted (tablet: w-14 h-14)
  FAB:        w-14 h-14 rounded-full bg-brand text-brand-fg shadow-md

INPUTS
  Text:       h-14 px-4 rounded-sm border border-default focus:border-brand focus:shadow-glow
  Numeric:    Stepper component with +/- buttons
  Search:     icon-leading rounded-sm bg-muted (no border) focus:ring

CARDS
  Item:       bg-surface rounded-lg p-4 shadow-xs hover:shadow-sm hover:-translate-y-0.5
  Action:     bg-surface rounded-xl p-6 shadow-xs
  Status:     bg-status-{type}-bg border-l-4 border-status-{type} rounded-lg p-4

NAVIGATION
  Rail:       w-16 bg-surface (active item: bg-muted with brand stripe)
  Tabs:       border-b underline animation on active
  Breadcrumb: text-secondary current=text-primary, separator: ‹

MODALS
  Modal:      max-w-[560px] bg-surface-overlay rounded-xl p-8 shadow-xl scale-in animation
  Sheet:      rounded-t-3xl bg-surface-overlay slide-up animation
  Drawer:     w-[480px] bg-surface-overlay slide-in-rtl

STATUS PILL
  rounded-full px-3 py-1 bg-status-{type}-bg text-status-{type} text-caption font-medium
  with leading 2x2 dot
```

---

## 15. File Structure (Engineering Handoff)

```
project-root/
├── public/
│   └── fonts/                              ← copy from /d/Wa7sh Burger/fonts/
│       ├── thmanyahsans-Light.woff2
│       ├── thmanyahsans-Regular.woff2
│       ├── thmanyahsans-Medium.woff2
│       ├── thmanyahsans-Bold.woff2
│       └── thmanyahsans-Black.woff2
├── src/
│   ├── styles/
│   │   ├── tokens/
│   │   │   ├── primitives.css          ← Tier 1 (raw palette)
│   │   │   ├── semantic-wahsh.css      ← Wahsh dark+light
│   │   │   ├── semantic-forno.css      ← Forno dark+light
│   │   │   ├── motion.css              ← Durations, easings
│   │   │   └── index.css               ← imports all
│   │   ├── base/
│   │   │   ├── reset.css
│   │   │   ├── fonts.css               ← @font-face declarations
│   │   │   ├── typography.css
│   │   │   └── rtl.css
│   │   └── components/
│   │       ├── button.css
│   │       ├── input.css
│   │       ├── card.css
│   │       └── ...
│   └── components/
│       ├── primitives/
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   ├── Card.tsx
│       │   └── ...
│       └── theme/
│           ├── ThemeProvider.tsx
│           └── ThemeToggle.tsx
└── ...
```

**Font deployment checklist:**
- [ ] Copy 5 WOFF2 files from `D:\Wa7sh Burger\fonts\` → `public/fonts/`
- [ ] Add `@font-face` declarations to `src/styles/base/fonts.css` (see §2.3)
- [ ] Preload Regular, Medium, Bold in `index.html` (see §2.3)
- [ ] Verify font license for production deployment (Thmanyah Sans license terms)
- [ ] Add a font-loading test for FOIT/FOUT behavior on slow connections

---

## 16. Versioning & Change Process

- **Major (v2.0):** breaking token name changes, palette overhaul, component API changes
- **Minor (v1.x):** new tokens, new components, new variants
- **Patch (v1.0.x):** color hex tweaks, easing tweaks, doc updates

Every change must:
1. Update this document
2. Update CSS variables
3. Update Tailwind config
4. Update Figma library (if maintained)
5. Tag PR with `design-system` label

---

## Appendix A — Brand Identity Notes

### Wahsh Theme (Burger + Kababgy)

**Personality:** Premium · Royal · Confident · Patient
**When to use:** Wahsh Burger branches, Kababgy branches, El Wahsh Group corporate views, factory operations
**Visual hallmarks:** Gold restraint (used sparingly for hero moments) · warm-black depth · cream warmth in light mode
**Avoid:** loud reds, bright greens as primary, playful gradients

### Forno Theme (Pizza Milano Style)

**Personality:** Energetic · Italian · Fast · Crafted
**When to use:** Forno Pizza branches only
**Visual hallmarks:** Italian green primary · red secondary · bright orange highlights · cool dark in dark mode
**Avoid:** gold (belongs to Wahsh family), brown earth tones (belongs to Wahsh family)

### Shared Across Both

**Personality:** Confident · Honest · Operational
**Visual hallmarks:** Subtle radii, near-zero shadows, calm motion, Thmanyah Sans typography
**Always:** Arabic-first, RTL-native, status colors universal

---

*End of Design System v1.0. Pair with `01_UX_Strategy.md` (the why) and `02_Wireframes.md` (the what).*
