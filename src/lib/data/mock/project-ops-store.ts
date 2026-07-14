import { cookies } from "next/headers";
import { MOCK_INVESTOR } from "@/lib/auth/mock";
import {
  ProjectOpsRecord,
  ProjectOpsReport,
  ProjectOpsInvestor,
  ProjectOpsLifecycle,
  SettlementTimingStatus,
} from "@/types/project-ops";

const COOKIE_NAME = "avid_mock_project_ops_v2";

const DEMO = MOCK_INVESTOR.fullName;

/** Five demo investors reused across projects with different amounts. */
const INV = {
  ali: DEMO,
  hossein: "حسین کریمی",
  maryam: "مریم احمدی",
  reza: "رضا نوری",
  sara: "سارا جعفری",
} as const;

export const SEED_PROJECT_OPS: ProjectOpsRecord[] = [
  {
    id: "ops-1",
    slug: "electronics-import-closed",
    title: "واردات قطعات الکترونیکی مصرفی",
    totalCapital: 45000000000,
    investors: [
      {
        name: INV.ali,
        amount: 18000000000,
        isDemoInvestor: true,
        newCapital: 18000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: 19728000000,
      },
      {
        name: INV.hossein,
        amount: 12000000000,
        newCapital: 12000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: 13152000000,
      },
      {
        name: INV.maryam,
        amount: 8000000000,
        newCapital: 8000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: 8768000000,
      },
      {
        name: INV.reza,
        amount: 5000000000,
        newCapital: 5000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: 5480000000,
      },
      {
        name: INV.sara,
        amount: 2000000000,
        newCapital: 2000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: 2192000000,
      },
    ],
    profitDue: 3072000000,
    startDate: "2025-12-01",
    endDate: "2026-03-22",
    predictedReturn: 0.22,
    collateral: "چک تضمین‌شده",
    commissionPercent: 0.02,
    commissionStatus: "پروژه پایان‌یافته — کارمزد دریافت شد",
    lifecycle: "settled",
    actualResult: "نتیجه واقعی پروژه حدود ۹.۶٪ پس از تسویه ثبت شد.",
    settlementDate: "2026-04-15",
    settlementTiming: "settled_late",
    reports: [],
  },
  {
    id: "ops-2",
    slug: "food-import-raw-materials",
    title: "واردات فویل و لفاف بسته‌بندی — فروش به صنایع غذایی",
    totalCapital: 65000000000,
    investors: [
      {
        name: INV.ali,
        amount: 25000000000,
        isDemoInvestor: true,
        newCapital: 12000000000,
        transferredFromPrevious: 13000000000,
        settledPaidAmount: null,
      },
      {
        name: INV.hossein,
        amount: 15000000000,
        newCapital: 15000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
      {
        name: INV.maryam,
        amount: 10000000000,
        newCapital: 10000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
      {
        name: INV.reza,
        amount: 9000000000,
        newCapital: 9000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
      {
        name: INV.sara,
        amount: 6000000000,
        newCapital: 6000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
    ],
    profitDue: null,
    startDate: "2026-01-20",
    endDate: "2026-05-20",
    predictedReturn: 0.19,
    collateral: "چک ضمانت + سفته",
    commissionPercent: 0.02,
    commissionStatus: "در انتها",
    lifecycle: "active",
    actualResult: null,
    settlementDate: null,
    settlementTiming: null,
    reports: [
      {
        id: "ops-rep-1",
        title: "ترخیص بخش اول محموله در بندر",
        reportDate: "2026-04-28",
        shortStatus: "اجرا طبق برنامه — ترخیص مرحله‌ای آغاز شد",
        settlementOutlook: "on_schedule",
        adminNote:
          "پس از تکمیل فروش به خریداران داخلی، زمان‌بندی تسویه مطابق قرارداد حفظ می‌شود. جزئیات مالی نهایی پس از وصول مطالبات اعلام خواهد شد.",
        mediaKind: "image",
        mediaLabel: "تصویر نمونه از محموله در انبار (نمایشی)",
      },
    ],
  },
  {
    id: "ops-3",
    slug: "apparel-working-capital",
    title: "سرمایه در گردش تولید پوشاک کار — صادرات به عراق",
    totalCapital: 54000000000,
    investors: [
      {
        name: INV.ali,
        amount: 15000000000,
        isDemoInvestor: true,
        newCapital: 15000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
      {
        name: INV.hossein,
        amount: 7000000000,
        newCapital: 7000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
      {
        name: INV.maryam,
        amount: 12000000000,
        newCapital: 12000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
      {
        name: INV.reza,
        amount: 14000000000,
        newCapital: 14000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
      {
        name: INV.sara,
        amount: 6000000000,
        newCapital: 6000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
    ],
    profitDue: null,
    startDate: "2026-03-15",
    endDate: "2026-08-15",
    predictedReturn: 0.21,
    collateral: "ضمانت‌نامه بانکی",
    commissionPercent: 0.025,
    commissionStatus: "دریافت شد",
    lifecycle: "active",
    actualResult: null,
    settlementDate: null,
    settlementTiming: null,
    reports: [
      {
        id: "ops-rep-2",
        title: "پیشرفت خط تولید و آماده‌سازی صادرات",
        reportDate: "2026-05-12",
        shortStatus: "تولید جلوتر از برنامه هفتگی است",
        settlementOutlook: "possibly_earlier",
        adminNote:
          "در صورت تأیید کیفیت توسط خریدار عراقی در موعد فعلی، امکان تسویه زودتر از تاریخ پایان پیش‌بینی‌شده وجود دارد. این صرفاً برآورد مدیریتی است.",
        mediaKind: "report",
        mediaLabel: "گزارش پیشرفت تولید (پیوست نمایشی)",
      },
    ],
  },
  {
    id: "ops-4",
    slug: "date-export-uae",
    title: "صادرات خرمای مضافتی به امارات",
    totalCapital: 20000000000,
    investors: [
      {
        name: INV.ali,
        amount: 8000000000,
        isDemoInvestor: true,
        newCapital: 8000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
      {
        name: INV.hossein,
        amount: 3000000000,
        newCapital: 3000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
      {
        name: INV.maryam,
        amount: 2500000000,
        newCapital: 2500000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
      {
        name: INV.reza,
        amount: 4500000000,
        newCapital: 4500000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
      {
        name: INV.sara,
        amount: 2000000000,
        newCapital: 2000000000,
        transferredFromPrevious: 0,
        settledPaidAmount: null,
      },
    ],
    profitDue: null,
    startDate: "2026-02-10",
    endDate: "2026-04-25",
    predictedReturn: 0.15,
    collateral: "سفته + وثیقه انبار",
    commissionPercent: 0.02,
    commissionStatus: "در انتها",
    lifecycle: "completed",
    actualResult: null,
    settlementDate: null,
    settlementTiming: null,
    reports: [],
  },
];

function normalize(row: ProjectOpsRecord): ProjectOpsRecord {
  return {
    ...row,
    profitDue: row.profitDue ?? null,
    startDate: row.startDate ?? null,
    endDate: row.endDate ?? null,
    actualResult: row.actualResult ?? null,
    settlementDate: row.settlementDate ?? null,
    settlementTiming: row.settlementTiming ?? null,
    reports: Array.isArray(row.reports) ? row.reports : [],
    investors: (row.investors ?? []).map((inv) => ({
      ...inv,
      settledPaidAmount: inv.settledPaidAmount ?? null,
      newCapital: inv.newCapital ?? inv.amount,
      transferredFromPrevious: inv.transferredFromPrevious ?? 0,
    })),
  };
}

export async function getAllProjectOps(): Promise<ProjectOpsRecord[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return SEED_PROJECT_OPS.map(normalize);
  try {
    const parsed = JSON.parse(raw) as ProjectOpsRecord[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return SEED_PROJECT_OPS.map(normalize);
    }
    return parsed.map(normalize);
  } catch {
    return SEED_PROJECT_OPS.map(normalize);
  }
}

export async function getProjectOpsBySlug(
  slug: string,
): Promise<ProjectOpsRecord | null> {
  const all = await getAllProjectOps();
  return all.find((p) => p.slug === slug) ?? null;
}

async function saveAll(projects: ProjectOpsRecord[]): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(projects), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });
}

export async function updateProjectOpsFields(
  slug: string,
  patch: Partial<
    Pick<
      ProjectOpsRecord,
      | "totalCapital"
      | "profitDue"
      | "startDate"
      | "endDate"
      | "predictedReturn"
      | "collateral"
      | "commissionPercent"
      | "commissionStatus"
      | "investors"
    >
  >,
): Promise<ProjectOpsRecord | null> {
  const all = await getAllProjectOps();
  const index = all.findIndex((p) => p.slug === slug);
  if (index < 0) return null;

  const current = all[index];
  let investors = current.investors;
  if (patch.investors) {
    investors = patch.investors;
  }

  const totalCapital =
    patch.totalCapital ??
    investors.reduce((s, i) => s + i.amount, 0) ??
    current.totalCapital;

  all[index] = normalize({
    ...current,
    ...patch,
    investors,
    totalCapital,
  });
  await saveAll(all);
  return all[index];
}

export async function addProjectOpsReport(
  slug: string,
  report: Omit<ProjectOpsReport, "id">,
): Promise<ProjectOpsRecord | null> {
  const all = await getAllProjectOps();
  const index = all.findIndex((p) => p.slug === slug);
  if (index < 0) return null;

  const entry: ProjectOpsReport = {
    ...report,
    id: `ops-rep-${Date.now()}`,
  };
  all[index] = normalize({
    ...all[index],
    reports: [entry, ...all[index].reports],
  });
  await saveAll(all);
  return all[index];
}

export async function settleProjectOps(
  slug: string,
  input: {
    actualResult: string;
    settlementDate: string;
    settlementTiming: SettlementTimingStatus;
    investorSettlements: { name: string; settledPaidAmount: number }[];
    markCompletedOnly?: boolean;
  },
): Promise<ProjectOpsRecord | null> {
  const all = await getAllProjectOps();
  const index = all.findIndex((p) => p.slug === slug);
  if (index < 0) return null;

  const current = all[index];
  const paidMap = new Map(
    input.investorSettlements.map((i) => [i.name, i.settledPaidAmount]),
  );

  const investors: ProjectOpsInvestor[] = current.investors.map((inv) => ({
    ...inv,
    settledPaidAmount: paidMap.has(inv.name)
      ? (paidMap.get(inv.name) ?? null)
      : inv.settledPaidAmount,
  }));

  const lifecycle: ProjectOpsLifecycle = input.markCompletedOnly
    ? "completed"
    : "settled";

  all[index] = normalize({
    ...current,
    investors,
    lifecycle,
    actualResult: input.actualResult,
    settlementDate: input.settlementDate,
    settlementTiming: input.markCompletedOnly ? null : input.settlementTiming,
  });
  await saveAll(all);
  return all[index];
}
