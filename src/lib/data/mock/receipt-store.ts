import { cookies } from "next/headers";
import { PaymentReceiptRecord } from "@/types/receipt";

const COOKIE_NAME = "avid_mock_payment_receipts";

export async function getAllMockPaymentReceipts(): Promise<PaymentReceiptRecord[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as PaymentReceiptRecord[];
  } catch {
    return [];
  }
}

export async function getMockPaymentReceiptsByInvestor(
  investorId: string
): Promise<PaymentReceiptRecord[]> {
  const all = await getAllMockPaymentReceipts();
  return all
    .filter((r) => r.investorId === investorId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getMockReceiptByRequestId(
  investmentRequestId: string
): Promise<PaymentReceiptRecord | null> {
  return getActiveMockReceiptForRequest(investmentRequestId);
}

export async function getMockReceiptById(
  receiptId: string
): Promise<PaymentReceiptRecord | null> {
  const all = await getAllMockPaymentReceipts();
  return all.find((r) => r.id === receiptId) ?? null;
}

/** Returns the current actionable receipt (submitted/verified), not rejected history. */
export async function getActiveMockReceiptForRequest(
  investmentRequestId: string
): Promise<PaymentReceiptRecord | null> {
  const all = await getAllMockPaymentReceipts();
  const forRequest = all
    .filter((r) => r.investmentRequestId === investmentRequestId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const active = forRequest.find((r) =>
    ["submitted", "under_review", "verified"].includes(r.status)
  );
  return active ?? null;
}

export async function getBlockingMockReceiptForRequest(
  investmentRequestId: string
): Promise<PaymentReceiptRecord | null> {
  const all = await getAllMockPaymentReceipts();
  return (
    all.find(
      (r) =>
        r.investmentRequestId === investmentRequestId &&
        ["submitted", "under_review", "verified"].includes(r.status)
    ) ?? null
  );
}

export async function saveMockPaymentReceipt(
  receipt: PaymentReceiptRecord
): Promise<void> {
  const cookieStore = await cookies();
  const all = await getAllMockPaymentReceipts();
  const index = all.findIndex((r) => r.id === receipt.id);
  if (index >= 0) {
    all[index] = receipt;
  } else {
    all.push(receipt);
  }
  cookieStore.set(COOKIE_NAME, JSON.stringify(all), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });
}
