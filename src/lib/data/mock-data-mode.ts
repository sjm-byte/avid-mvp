import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Demo login and/or missing Supabase — use cookie-backed mock stores. */
export async function shouldUseMockData(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }
  const cookieStore = await cookies();
  return Boolean(cookieStore.get("avid_demo_role")?.value);
}

export const LEDGER_PAGE_DISCLAIMER =
  "این بخش فقط ثبت حسابداری رویدادهای مشارکت است. مبلغی نزد آوید نگهداری یا واریز نمی‌شود.";
