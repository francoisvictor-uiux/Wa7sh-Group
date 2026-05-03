/**
 * Branches & brand master data for El Wahsh Group.
 *
 * Structure:
 *   Factory (1)  →  supplies all 3 brands
 *   Wahsh Burger (8 Alexandria branches)
 *   Kababgy Elwahsh (3 Alexandria branches)
 *   Forno Pizza (1 Alexandria branch)
 *
 * Brands are fully isolated — a user assigned to one brand cannot
 * see data from another brand. Only the factory and group-level
 * roles (owner, hr-manager) cross brand boundaries.
 */

export type BrandId = "wahsh" | "kababgy" | "forno";

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  brandId: BrandId;
  active: boolean;
}

export interface Factory {
  id: "factory";
  name: string;
  address: string;
  city: string;
}

// ─── Factory ────────────────────────────────────────────────────────────────

export const factory: Factory = {
  id: "factory",
  name: "المصنع الرئيسي",
  address: "المنطقة الصناعية",
  city: "الإسكندرية",
};

// ─── Wahsh Burger — 8 branches ──────────────────────────────────────────────

export const wahshBranches: Branch[] = [
  {
    id: "br-wahsh-asafra",
    name: "فرع العصافرة",
    address: "شارع 45",
    city: "الإسكندرية",
    brandId: "wahsh",
    active: true,
  },
  {
    id: "br-wahsh-gleem",
    name: "فرع جليم",
    address: "جليم",
    city: "الإسكندرية",
    brandId: "wahsh",
    active: true,
  },
  {
    id: "br-wahsh-zezenia",
    name: "فرع زيزينيا",
    address: "زيزينيا",
    city: "الإسكندرية",
    brandId: "wahsh",
    active: true,
  },
  {
    id: "br-wahsh-corniche",
    name: "فرع الكورنيش",
    address: "كورنيش الإسكندرية",
    city: "الإسكندرية",
    brandId: "wahsh",
    active: true,
  },
  {
    id: "br-wahsh-mandara",
    name: "فرع المندرة",
    address: "المندرة",
    city: "الإسكندرية",
    brandId: "wahsh",
    active: true,
  },
  {
    id: "br-wahsh-sidi-gaber",
    name: "فرع سيدي جابر",
    address: "سيدي جابر",
    city: "الإسكندرية",
    brandId: "wahsh",
    active: true,
  },
  {
    id: "br-wahsh-ras-el-tin",
    name: "فرع راس التين",
    address: "راس التين",
    city: "الإسكندرية",
    brandId: "wahsh",
    active: true,
  },
  {
    id: "br-wahsh-downtown",
    name: "فرع داون تاون",
    address: "وسط البلد",
    city: "الإسكندرية",
    brandId: "wahsh",
    active: true,
  },
];

// ─── Kababgy Elwahsh — 3 branches ───────────────────────────────────────────

export const kababgyBranches: Branch[] = [
  {
    id: "br-kababgy-smoha",
    name: "فرع سموحة",
    address: "أول شارع مسجد حاتم، سموحة",
    city: "الإسكندرية",
    brandId: "kababgy",
    active: true,
  },
  {
    id: "br-kababgy-raml",
    name: "فرع محطة الرمل",
    address: "9 شارع السلطان حسين، محطة الرمل",
    city: "الإسكندرية",
    brandId: "kababgy",
    active: true,
  },
  {
    id: "br-kababgy-sidi-gaber",
    name: "فرع سيدي جابر",
    address: "سيدي جابر",
    city: "الإسكندرية",
    brandId: "kababgy",
    active: true,
  },
];

// ─── Forno Pizza — 1 branch ─────────────────────────────────────────────────

export const fornoBranches: Branch[] = [
  {
    id: "br-forno-raml",
    name: "فرع محطة الرمل",
    address: "محطة الرمل",
    city: "الإسكندرية",
    brandId: "forno",
    active: true,
  },
];

// ─── Combined lookup ─────────────────────────────────────────────────────────

export const allBranches: Branch[] = [
  ...wahshBranches,
  ...kababgyBranches,
  ...fornoBranches,
];

export const branchMap: Record<string, Branch> = allBranches.reduce(
  (acc, b) => { acc[b.id] = b; return acc; },
  {} as Record<string, Branch>
);

export function getBranchesByBrand(brandId: BrandId): Branch[] {
  return allBranches.filter((b) => b.brandId === brandId);
}

// ─── Brand metadata ──────────────────────────────────────────────────────────

export interface BrandMeta {
  id: BrandId;
  name: string;
  nameEn: string;
  theme: "wahsh" | "forno";
  accent: string;
  branchCount: number;
}

export const brandMeta: Record<BrandId, BrandMeta> = {
  wahsh: {
    id: "wahsh",
    name: "الوحش برجر",
    nameEn: "Wahsh Burger",
    theme: "wahsh",
    accent: "#2563EB",
    branchCount: wahshBranches.length,
  },
  kababgy: {
    id: "kababgy",
    name: "كبابجي الوحش",
    nameEn: "Kababgy Elwahsh",
    theme: "wahsh",
    accent: "#C8A75A",
    branchCount: kababgyBranches.length,
  },
  forno: {
    id: "forno",
    name: "فورنو بيتزا",
    nameEn: "Forno Pizza",
    theme: "forno",
    accent: "#2A6B41",
    branchCount: fornoBranches.length,
  },
};

export const allBrands: BrandId[] = ["wahsh", "kababgy", "forno"];

// ─── Legacy compat shim (remove once all consumers use AuthContext) ──────────
// These existed in the old branches.ts; kept temporarily so existing
// components don't break before they're migrated.

/** @deprecated use allBranches */
export const branches = allBranches;

/** @deprecated use AuthContext */
export const currentUser = {
  id: "u-demo",
  name: "منى محمود",
  role: "مديرة الفرع",
  branchId: "br-wahsh-gleem",
  avatar: null,
  email: "mona@wahshgroup.eg",
};
