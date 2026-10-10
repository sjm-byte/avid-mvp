import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * Consultation / "اعلام آمادگی" form.
 *
 * Each phone number is:
 *  1. sent to the Avid team on Bale (bale.ai bot API — reachable from Iranian servers,
 *     unlike Telegram), and
 *  2. appended to a backup file + the server log, so a lead is never lost even if
 *     the Bale message fails.
 *
 * Env vars (set in the ParsPack panel, never in git):
 *  - BALE_BOT_TOKEN  token from @botfather in Bale
 *  - BALE_CHAT_ID    chat id of the person or group that receives the leads
 *  - LEADS_DIR       optional; folder for the backup file (default: ./data)
 */

const BALE_API = "https://tapi.bale.ai";

function normalizeIranPhone(raw: string): string {
  return raw
    .trim()
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - "۰".charCodeAt(0)))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - "٠".charCodeAt(0)))
    .replace(/[\s\-()]/g, "")
    .replace(/^(\+98|0098|98)(9\d{9})$/, "0$2");
}

function isValidIranMobile(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}

function tehranTime(date: Date): string {
  return date.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" });
}

async function notifyBale(phone: string, at: Date): Promise<boolean> {
  const token = process.env.BALE_BOT_TOKEN;
  const chatId = process.env.BALE_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[Avid] BALE_BOT_TOKEN / BALE_CHAT_ID not set — lead kept in backup only.");
    return false;
  }

  const text = [
    "📞 درخواست مشاوره و اعلام آمادگی — آوید",
    `شماره: ${phone}`,
    `زمان: ${tehranTime(at)}`,
  ].join("\n");

  try {
    const response = await fetch(`${BALE_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error("[Avid] Bale sendMessage failed:", response.status, await response.text());
    }
    return response.ok;
  } catch (error) {
    console.error("[Avid] Bale sendMessage error:", error);
    return false;
  }
}

async function saveBackup(phone: string, at: Date): Promise<boolean> {
  try {
    const dir = process.env.LEADS_DIR || path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    const line = JSON.stringify({ phone, at: at.toISOString(), tehran: tehranTime(at) });
    await appendFile(path.join(dir, "consultation-requests.jsonl"), line + "\n", "utf8");
    return true;
  } catch (error) {
    console.error("[Avid] could not write lead backup:", error);
    return false;
  }
}

export async function POST(request: Request) {
  let phone: string;
  try {
    const body = (await request.json()) as { phone?: string };
    phone = normalizeIranPhone(body.phone ?? "");
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  if (!isValidIranMobile(phone)) {
    return NextResponse.json({ error: "شماره موبایل معتبر نیست." }, { status: 400 });
  }

  const at = new Date();
  // Always visible in the ParsPack app logs, whatever else happens.
  console.info("[Avid] consultation-request:", phone, at.toISOString());

  const [notified, saved] = await Promise.all([notifyBale(phone, at), saveBackup(phone, at)]);

  if (!notified && !saved) {
    return NextResponse.json(
      {
        error:
          "ثبت درخواست در حال حاضر ممکن نشد. لطفاً دوباره تلاش کنید یا با شماره ۰۲۱۹۱۰۳۵۹۱۴ تماس بگیرید.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
