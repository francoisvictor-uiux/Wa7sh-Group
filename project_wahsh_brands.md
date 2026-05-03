---
name: El Wahsh Group brand architecture
description: Three-brand food group structure with confirmed palettes — Wahsh Burger + Kababgy share an identity, Forno Pizza is distinct
type: project
originSessionId: 00459328-b1f7-436c-a8e7-1975b29d9dee
---
El Wahsh Group operates three F&B brands under one operational ERP system (working dir: `D:\Wa7sh Burger`).

**Brand structure:**
1. **الوحش برجر (Wahsh Burger)** — Premium Burger — Lion+crown crest, gold-on-dark
2. **كبابجي الوحش (Kababgy Elwahsh)** — Premium Kebab — Same lion crest family, gold-on-dark
3. **Forno Pizza** — Milano Style — Italian flag identity, neon-sign aesthetic

**Confirmed palettes (user-supplied 28/04/2026, refined 01/05/2026):**

- **Wahsh · Light (default surface)** — Brand primary `#212121` (warm-black, AAA on canvas), canvas `#FBF8F4`, surface `#FFFFFF`, gold `#C8A75A` demoted to **accent only** (icons, focus rings, decorative hairlines)
- **Wahsh · Dark** — Canvas `#0F0E0D`, surface `#161413`, brand primary stays gold `#C8A75A`, cream text `#F5EDE0`
- **Forno · Light/Dark** — Italian green `#2A6B41` primary across both modes, red `#E64001` accent, amber `#FD9D04`

**Strategy decision:** ONE design system, 2 themes (Wahsh / Forno), 2 modes per theme (Dark / Light) = 4 surfaces. Wahsh + Kababgy share the Wahsh theme since they're a brand family. Operational ERP staff see the parent "El Wahsh Group" identity by default; theme shifts contextually based on which branch the user is logged into.

**Why:** Asked. User explicitly confirmed: "Wa7shBurger and Kababgy same color palette, Forno separate." The light-mode shift to `#212121` (commit `0a36781`, 01/05/2026) was a deliberate move to make the ERP daylight-friendly: AAA contrast 16.5:1 on the warm canvas, gold reserved for premium-feel accents (focus rings, hairlines, brand iconography).

**How to apply:** Any UI work for this project must respect these palettes. Earlier wireframes used `#C8102E` red as Wahsh primary — that was wrong. **Light mode primary is `#212121` (black); gold is accent-only.** Dark mode primary remains gold `#C8A75A`. Use CSS tokens (`--brand-primary`, `--brand-accent`) — never hardcode. Status colors stay universal across themes (success/warning/danger/info don't shift).

**Files:**
- `01_UX_Strategy.md` — strategy doc
- `02_Wireframes.md` — screen-level wireframes (color refs need updating to match `03_Design_System.md`)
- `03_Design_System.md` — token + component spec
