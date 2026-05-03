/**
 * HR mock data — employees, attendance, payroll snapshots.
 * Anchored to a roster of real-feeling F&B operations roles.
 */

export type EmployeeStatus = "active" | "on-leave" | "probation" | "former";
export type AttendanceState = "clocked-in" | "clocked-out" | "on-break" | "absent";
export type ShiftType = "morning" | "evening" | "night" | "off";

export interface Employee {
  id: string;
  name: string;
  firstName: string;
  role: string;
  department: "operations" | "kitchen" | "delivery" | "warehouse" | "management" | "office";
  branchId: string;
  branchName: string;
  status: EmployeeStatus;
  attendance: AttendanceState;
  todayShift: ShiftType;
  shiftStart?: string;
  shiftEnd?: string;
  clockedInAt?: string;
  hireDate: string;
  yearsOfService: number;
  phone: string;
  nationalId: string;
  baseSalary: number;
  email?: string;
  certificates?: string[];
  rating?: number;
  totalLeaveDays?: number;
  usedLeaveDays?: number;
}

export const employees: Employee[] = [
  { id: "e-mona", name: "منى محمود", firstName: "منى", role: "مديرة الفرع", department: "management", branchId: "br-heliopolis", branchName: "مصر الجديدة", status: "active", attendance: "clocked-in", todayShift: "morning", shiftStart: "06:00", shiftEnd: "14:00", clockedInAt: "اليوم · 5:54 ص", hireDate: "2020-03-15", yearsOfService: 6, phone: "01012345678", nationalId: "29903151234567", baseSalary: 12500, email: "mona@wahshgroup.eg", rating: 4.8, certificates: ["إدارة عمليات F&B", "HACCP — السلامة الغذائية"], totalLeaveDays: 21, usedLeaveDays: 8 },
  { id: "e-ahmed", name: "أحمد رضا", firstName: "أحمد", role: "مدير المصنع", department: "management", branchId: "fac-october", branchName: "مصنع 6 أكتوبر", status: "active", attendance: "clocked-in", todayShift: "morning", shiftStart: "05:30", shiftEnd: "13:30", clockedInAt: "اليوم · 5:28 ص", hireDate: "2018-06-01", yearsOfService: 8, phone: "01098765432", nationalId: "28006014321987", baseSalary: 18000, email: "ahmed@wahshgroup.eg", rating: 4.9 },
  { id: "e-mahmoud", name: "محمود علي", firstName: "محمود", role: "سائق توزيع أول", department: "delivery", branchId: "fac-october", branchName: "مصنع 6 أكتوبر", status: "active", attendance: "clocked-in", todayShift: "morning", shiftStart: "07:00", shiftEnd: "15:00", clockedInAt: "اليوم · 6:54 ص", hireDate: "2020-01-15", yearsOfService: 6, phone: "01001234567", nationalId: "28701151111222", baseSalary: 6800, rating: 4.8, totalLeaveDays: 21, usedLeaveDays: 12 },
  { id: "e-karim", name: "كريم مصطفى", firstName: "كريم", role: "كاشير رئيسي", department: "operations", branchId: "br-heliopolis", branchName: "مصر الجديدة", status: "active", attendance: "clocked-in", todayShift: "morning", shiftStart: "06:00", shiftEnd: "14:00", clockedInAt: "اليوم · 5:58 ص", hireDate: "2022-09-10", yearsOfService: 4, phone: "01211223344", nationalId: "30009101122334", baseSalary: 5200, totalLeaveDays: 21, usedLeaveDays: 5 },
  { id: "e-laila", name: "ليلى أحمد", firstName: "ليلى", role: "موظفة كاشير", department: "operations", branchId: "br-nasr", branchName: "مدينة نصر", status: "active", attendance: "clocked-in", todayShift: "morning", shiftStart: "06:00", shiftEnd: "14:00", clockedInAt: "اليوم · 6:02 ص", hireDate: "2023-02-20", yearsOfService: 3, phone: "01156789012", nationalId: "30202209876543", baseSalary: 4800, totalLeaveDays: 21, usedLeaveDays: 3 },
  { id: "e-tarek", name: "طارق إبراهيم", firstName: "طارق", role: "سائق توزيع", department: "delivery", branchId: "fac-october", branchName: "مصنع 6 أكتوبر", status: "active", attendance: "clocked-in", todayShift: "morning", shiftStart: "07:00", shiftEnd: "15:00", clockedInAt: "اليوم · 6:48 ص", hireDate: "2018-11-05", yearsOfService: 8, phone: "01112345678", nationalId: "26611054433221", baseSalary: 7200, rating: 4.9, totalLeaveDays: 21, usedLeaveDays: 14 },
  { id: "e-salma", name: "سلمى رشدي", firstName: "سلمى", role: "مديرة فرع", department: "management", branchId: "br-zamalek", branchName: "الزمالك", status: "active", attendance: "clocked-in", todayShift: "morning", shiftStart: "06:00", shiftEnd: "14:00", clockedInAt: "اليوم · 5:51 ص", hireDate: "2021-07-01", yearsOfService: 5, phone: "01244556677", nationalId: "29107017766554", baseSalary: 11800, rating: 4.7 },
  { id: "e-hesham", name: "هشام جمال", firstName: "هشام", role: "مدير فرع", department: "management", branchId: "br-maadi", branchName: "المعادي", status: "active", attendance: "on-break", todayShift: "morning", shiftStart: "06:00", shiftEnd: "14:00", clockedInAt: "اليوم · 5:55 ص", hireDate: "2021-03-12", yearsOfService: 5, phone: "01133445566", nationalId: "29103128765432", baseSalary: 11500 },
  { id: "e-anas", name: "أنس فؤاد", firstName: "أنس", role: "مدير فرع", department: "management", branchId: "br-alex", branchName: "سموحة", status: "active", attendance: "clocked-in", todayShift: "morning", shiftStart: "06:00", shiftEnd: "14:00", clockedInAt: "اليوم · 5:48 ص", hireDate: "2022-01-10", yearsOfService: 4, phone: "01266778899", nationalId: "29401105544332", baseSalary: 11200 },
  { id: "e-omar", name: "عمر يوسف", firstName: "عمر", role: "شيف رئيسي", department: "kitchen", branchId: "br-heliopolis", branchName: "مصر الجديدة", status: "active", attendance: "clocked-in", todayShift: "morning", shiftStart: "05:30", shiftEnd: "14:00", clockedInAt: "اليوم · 5:25 ص", hireDate: "2019-08-15", yearsOfService: 7, phone: "01087654321", nationalId: "27908152233445", baseSalary: 9800, certificates: ["HACCP", "السلامة الغذائية"] },
  { id: "e-noha", name: "نهى صلاح", firstName: "نهى", role: "محاسبة", department: "office", branchId: "fac-october", branchName: "المكتب الرئيسي", status: "on-leave", attendance: "absent", todayShift: "off", hireDate: "2020-05-20", yearsOfService: 6, phone: "01199887766", nationalId: "29105204455667", baseSalary: 10200, totalLeaveDays: 21, usedLeaveDays: 14 },
  { id: "e-yousra", name: "يسرا أحمد", firstName: "يسرا", role: "موظفة موارد بشرية", department: "office", branchId: "fac-october", branchName: "المكتب الرئيسي", status: "active", attendance: "clocked-in", todayShift: "morning", shiftStart: "08:30", shiftEnd: "16:30", clockedInAt: "اليوم · 8:24 ص", hireDate: "2023-04-01", yearsOfService: 3, phone: "01088776655", nationalId: "30404014433221", baseSalary: 8400, totalLeaveDays: 21, usedLeaveDays: 4 },
  { id: "e-essam", name: "عصام طارق", firstName: "عصام", role: "عامل مخزن", department: "warehouse", branchId: "fac-october", branchName: "مصنع 6 أكتوبر", status: "active", attendance: "clocked-in", todayShift: "morning", shiftStart: "06:00", shiftEnd: "14:00", clockedInAt: "اليوم · 5:57 ص", hireDate: "2024-01-15", yearsOfService: 2, phone: "01077665544", nationalId: "31201156677889", baseSalary: 5800 },
  { id: "e-hadeer", name: "هدير سعد", firstName: "هدير", role: "موظفة كاشير", department: "operations", branchId: "br-zamalek", branchName: "الزمالك", status: "probation", attendance: "clocked-in", todayShift: "morning", shiftStart: "06:00", shiftEnd: "14:00", clockedInAt: "اليوم · 5:59 ص", hireDate: "2026-02-15", yearsOfService: 1, phone: "01055443322", nationalId: "30502151122334", baseSalary: 4600, totalLeaveDays: 14, usedLeaveDays: 0 },
  { id: "e-ramy", name: "رامي حسن", firstName: "رامي", role: "سائق توزيع", department: "delivery", branchId: "fac-october", branchName: "مصنع 6 أكتوبر", status: "active", attendance: "clocked-out", todayShift: "off", hireDate: "2021-06-15", yearsOfService: 5, phone: "01098765432", nationalId: "29006154321987", baseSalary: 6800, totalLeaveDays: 21, usedLeaveDays: 9 },
];

/* Defaults to set if not specified above */
employees.forEach((e) => {
  if (e.totalLeaveDays === undefined) e.totalLeaveDays = 21;
  if (e.usedLeaveDays === undefined) e.usedLeaveDays = 0;
});

export const employeeStatusMeta: Record<
  EmployeeStatus,
  { label: string; intent: "success" | "warning" | "info" | "neutral" | "danger" | "brand" }
> = {
  active: { label: "نشط", intent: "success" },
  "on-leave": { label: "في إجازة", intent: "info" },
  probation: { label: "تحت التجربة", intent: "warning" },
  former: { label: "سابق", intent: "neutral" },
};

export const attendanceStateMeta: Record<
  AttendanceState,
  { label: string; intent: "success" | "warning" | "info" | "neutral" | "danger" | "brand" }
> = {
  "clocked-in": { label: "حاضر", intent: "success" },
  "clocked-out": { label: "منصرف", intent: "neutral" },
  "on-break": { label: "في استراحة", intent: "warning" },
  absent: { label: "غائب", intent: "danger" },
};

export const departmentMeta: Record<Employee["department"], { label: string }> = {
  operations: { label: "العمليات" },
  kitchen: { label: "المطبخ" },
  delivery: { label: "التوزيع" },
  warehouse: { label: "المخزن" },
  management: { label: "الإدارة" },
  office: { label: "المكتب" },
};

export function getEmployee(id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}

export const employeeCounts = {
  total: employees.length,
  active: employees.filter((e) => e.status === "active").length,
  onLeave: employees.filter((e) => e.status === "on-leave").length,
  probation: employees.filter((e) => e.status === "probation").length,
  clockedIn: employees.filter((e) => e.attendance === "clocked-in").length,
  onBreak: employees.filter((e) => e.attendance === "on-break").length,
  absent: employees.filter((e) => e.attendance === "absent").length,
};

/* Current user's payslip */
export const currentPayslip = {
  employeeId: "e-mona",
  month: "إبريل 2026",
  monthEn: "April 2026",
  base: 12500,
  overtime: 850,
  bonus: 1200,
  deductions: {
    socialInsurance: 1450,
    incomeTax: 1240,
    other: 0,
  },
  netPay: 11860,
  workedDays: 22,
  overtimeHours: 8.5,
  leavesTaken: 0,
  paidOn: "30 إبريل 2026",
  status: "paid" as "paid" | "pending",
};

/* Recent attendance logs for current user */
export const recentAttendance = [
  { date: "اليوم", in: "5:54 ص", out: "—", hours: "—", note: "وردية الصباح — جارٍ" },
  { date: "أمس", in: "5:58 ص", out: "2:08 م", hours: "8:10", note: "—" },
  { date: "منذ يومين", in: "5:51 ص", out: "2:02 م", hours: "8:11", note: "—" },
  { date: "منذ 3 أيام", in: "5:55 ص", out: "2:14 م", hours: "8:19", note: "+19 د إضافي" },
  { date: "منذ 4 أيام", in: "—", out: "—", hours: "0", note: "إجازة أسبوعية" },
  { date: "منذ 5 أيام", in: "5:50 ص", out: "1:58 م", hours: "8:08", note: "—" },
];

export const myEmployee = employees.find((e) => e.id === "e-mona")!;
