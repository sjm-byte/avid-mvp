import { cookies } from "next/headers";
import { InvestorSettlementPayoutRecord } from "@/types/settlement";

const COOKIE_NAME = "avid_mock_settlement_payouts";

export async function getAllMockSettlementPayouts(): Promise<
  InvestorSettlementPayoutRecord[]
> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as InvestorSettlementPayoutRecord[];
  } catch {
    return [];
  }
}

export async function getMockSettlementPayout(
  settlementId: string,
  investorId: string
): Promise<InvestorSettlementPayoutRecord | null> {
  const all = await getAllMockSettlementPayouts();
  return (
    all.find(
      (p) => p.settlementId === settlementId && p.investorId === investorId
    ) ?? null
  );
}

export async function saveMockSettlementPayout(
  record: InvestorSettlementPayoutRecord
): Promise<void> {
  const cookieStore = await cookies();
  const all = await getAllMockSettlementPayouts();
  const index = all.findIndex(
    (p) =>
      p.settlementId === record.settlementId &&
      p.investorId === record.investorId
  );
  if (index >= 0) {
    all[index] = record;
  } else {
    all.push(record);
  }
  cookieStore.set(COOKIE_NAME, JSON.stringify(all), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });
}
