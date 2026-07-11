import { cookies } from "next/headers";
import { InvestmentAllocationRecord } from "@/types/allocation";

const COOKIE_NAME = "avid_mock_investments";

export async function getAllMockInvestments(): Promise<InvestmentAllocationRecord[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as InvestmentAllocationRecord[];
  } catch {
    return [];
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
