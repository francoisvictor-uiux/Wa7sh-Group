/**
 * Standardized page primitives.
 * Use these to keep all module pages visually consistent.
 *
 *   PageShell    — page layout (sticky header, fluid padding, optional rail)
 *   PageHeader   — top header with icon + title + actions + meta slot
 *   FilterTabs   — chip-tabs-with-counts row for filters
 *   SearchInput  — pill-shaped search field
 *   StatusPill   — status display (neutral/info/success/warning/danger/brand)
 *   EmptyState   — no-data placeholder with action
 *   SectionLabel — small-caps divider for groups within a page
 */

export { PageShell }    from "./PageShell";
export { PageHeader }   from "./PageHeader";
export { FilterTabs }   from "./FilterTabs";
export { SearchInput }  from "./SearchInput";
export { StatusPill }   from "./StatusPill";
export { EmptyState }   from "./EmptyState";
export { SectionLabel } from "./SectionLabel";
export type { StatusTone } from "./StatusPill";
export type { FilterTab }  from "./FilterTabs";
