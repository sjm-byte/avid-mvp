import { cookies } from "next/headers";
import { InvestmentRequestRecord } from "@/types/investment";

const COOKIE_NAME = "avid_mock_investment_requests";

export async function getAllMockInvestmentRequests(): Promise<
  InvestmentRequestRecord[]
> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as InvestmentRequestRecord[];
  } catch {
    return [];
  }
}

export async function getMockInvestmentRequestsByInvestor(
  investorId: string
): Promise<InvestmentRequestRecord[]> {
  const all = await getAllMockInvestmentRequests();
  return all
    .filter((r) => r.investorId === investorId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function saveMockInvestmentRequest(
  request: InvestmentRequestRecord
): Promise<void> {
  const cookieStore = await cookies();
  const all = await getAllMockInvestmentRequests();
  const index = all.findIndex((r) => r.id === request.id);
  if (index >= 0) {
    all[index] = request;
  } else {
    all.push(request);
  }
  cookieStore.set(COOKIE_NAME, JSON.stringify(all), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });
}

export async function findMockPendingRequest(
  investorId: string,
  projectId: string
): Promise<InvestmentRequestRecord | null> {
  const requests = await getMockInvestmentRequestsByInvestor(investorId);
  return (
    requests.find(
      (r) =>
        r.projectId === projectId &&
        !["rejected", "cancelled"].includes(r.status)
    ) ?? null
  );
}
