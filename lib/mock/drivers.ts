/**
 * Registered drivers in the system. The DispatchPanel pulls from this list
 * so the factory can pick a driver and auto-fill phone, vehicle, and
 * national ID. Names/phones overlap with hr.ts entries (department:
 * "delivery") but this file is the canonical source for dispatch.
 */

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;     // e.g. "ج ص ر · 3201"
  vehicleType: string;        // e.g. "فان مبرّد"
  nationalId: string;         // 14 digits
  status: "available" | "on-route" | "off-shift";
}

export const drivers: Driver[] = [
  {
    id: "drv-1",
    name: "محمود علي",
    phone: "01001234567",
    vehicleNumber: "ج ص ر · 3201",
    vehicleType: "فان مبرّد",
    nationalId: "28701151111222",
    status: "available",
  },
  {
    id: "drv-2",
    name: "كريم سعيد",
    phone: "01112345678",
    vehicleNumber: "ب د ل · 3202",
    vehicleType: "فان مبرّد",
    nationalId: "28912084455667",
    status: "available",
  },
  {
    id: "drv-3",
    name: "أحمد فتحي",
    phone: "01023456789",
    vehicleNumber: "ع ق ن · 3105",
    vehicleType: "فان كبير",
    nationalId: "27503127788991",
    status: "on-route",
  },
  {
    id: "drv-4",
    name: "إسلام منير",
    phone: "01234567890",
    vehicleNumber: "س ل م · 3198",
    vehicleType: "فان متوسط",
    nationalId: "29005221122334",
    status: "available",
  },
  {
    id: "drv-5",
    name: "طارق إبراهيم",
    phone: "01112345670",
    vehicleNumber: "ج ص ر · 3210",
    vehicleType: "فان مبرّد",
    nationalId: "26611054433221",
    status: "available",
  },
  {
    id: "drv-6",
    name: "رامي حسن",
    phone: "01098765432",
    vehicleNumber: "ب د ل · 3215",
    vehicleType: "فان متوسط",
    nationalId: "29006154321987",
    status: "off-shift",
  },
];
