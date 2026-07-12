import { cookies } from "next/headers";
import { InvestmentAllocationRecord } from "@/types/allocation";
import { MOCK_INVESTOR } from "@/lib/auth/mock";

const COOKIE_NAME = "avid_mock_investments";

/** Sample post-contract allocations for demo (used when cookie is empty). */
const SEED_ALLOCATIONS: InvestmentAllocationRecord[] = [
  {
    id: "seed-inv-1",
    investorId: MOCK_INVESTOR.id,
    investorName: MOCK_INVESTOR.fullName,
    projectId: "b2000000-0000-4000-8000-000000000001",
    projectTitle: "واردات فویل و لفاف بسته‌بندی — فروش به صنایع غذایی",
    projectSlug: "food-import-raw-materials",
    investmentRequestId: null,
    receiptId: null,
    verifiedAmount: 25000000000,
    ownershipPercent: 25000000000 / 90000000000,
    status: "active",
    allocatedAt: "2026-01-22T00:00:00Z",
    projectStatus: "in_execution",
    expectedReturnBase: 0.19,
    adminNote: "ثبت پس از قرارداد — واریز خارج از سامانه",
  },
  {
    id: "seed-inv-2",
    investorId: "mock-investor-2",
    investorName: "حسین کریمی",
    projectId: "b2000000-0000-4000-8000-000000000001",
    projectTitle: "واردات فویل و لفاف بسته‌بندی — فروش به صنایع غذایی",
    projectSlug: "food-import-raw-materials",
    investmentRequestId: null,
    receiptId: null,
    verifiedAmount: 20000000000,
    ownershipPercent: 20000000000 / 90000000000,
    status: "active",
    allocatedAt: "2026-01-22T00:00:00Z",
    projectStatus: "in_execution",
    expectedReturnBase: 0.19,
    adminNote: null,
  },
  {
    id: "seed-inv-3",
    investorId: MOCK_INVESTOR.id,
    investorName: MOCK_INVESTOR.fullName,
    projectId: "b2000000-0000-4000-8000-000000000002",
    projectTitle: "سرمایه در گردش تولید پوشاک کار — صادرات به عراق",
    projectSlug: "apparel-working-capital",
    investmentRequestId: null,
    receiptId: null,
    verifiedAmount: 15000000000,
    ownershipPercent: 15000000000 / 150000000000,
    status: "active",
    allocatedAt: "2026-02-20T00:00:00Z",
    projectStatus: "funding_in_progress",
    expectedReturnBase: 0.21,
    adminNote: null,
  },
  {
    id: "seed-inv-4",
    investorId: "mock-investor-3",
    investorName: "مریم احمدی",
    projectId: "b2000000-0000-4000-8000-000000000002",
    projectTitle: "سرمایه در گردش تولید پوشاک کار — صادرات به عراق",
    projectSlug: "apparel-working-capital",
    investmentRequestId: null,
    receiptId: null,
    verifiedAmount: 30000000000,
    ownershipPercent: 30000000000 / 150000000000,
    status: "active",
    allocatedAt: "2026-02-25T00:00:00Z",
    projectStatus: "funding_in_progress",
    expectedReturnBase: 0.21,
    adminNote: null,
  },
];

export async function getAllMockInvestments(): Promise<InvestmentAllocationRecord[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return [...SEED_ALLOCATIONS];
  try {
    const parsed = JSON.parse(raw) as InvestmentAllocationRecord[];
    return parsed.map((row) => ({
      ...row,
      investorName: row.investorName ?? null,
      investmentRequestId: row.investmentRequestId ?? null,
      receiptId: row.receiptId ?? null,
      adminNote: row.adminNote ?? null,
    }));
  } catch {
    return [...SEED_ALLOCATIONS];
  }
}

export async function getMockInvestmentsByInvestor(
  investorId: string
): Promise<InvestmentAllocationRecord[]> {
  const all = await getAllMockInvestments();
  return all
    .filter((i) => i.investorId === investorId && i.status === "active")
    .sort(
      (a, b) =>
        new Date(b.allocatedAt).getTime() - new Date(a.allocatedAt).getTime()
    );
}

export async function getMockInvestmentsByProject(
  projectId: string
): Promise<InvestmentAllocationRecord[]> {
  const all = await getAllMockInvestments();
  return all
    .filter((i) => i.projectId === projectId && i.status === "active")
    .sort(
      (a, b) =>
        new Date(b.allocatedAt).getTime() - new Date(a.allocatedAt).getTime()
    );
}

export async function saveMockInvestment(
  investment: InvestmentAllocationRecord
): Promise<void> {
  const cookieStore = await cookies();
  const all = await getAllMockInvestments();
  const index = all.findIndex((i) => i.id === investment.id);
  if (index >= 0) {
    all[index] = investment;
  } else {
    all.push(investment);
  }
  cookieStore.set(COOKIE_NAME, JSON.stringify(all), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });
}
