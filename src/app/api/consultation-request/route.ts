import { NextResponse } from "next/server";

function normalizeIranPhone(raw: string): string {
  return raw
    .trim()
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - "۰".charCodeAt(0)))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - "٠".charCodeAt(0)))
    .replace(/[\s\-()]/g, "");
}

function isValidIranMobile(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}

async function notifyTelegram(phone: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const text = [
    "📞 درخواست مشاوره و پشتیبانی — آوید",
    `شماره: ${phone}`,
    `زمان: ${new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}`,
  ].join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    },
  );

  return response.ok;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string };
    const phone = normalizeIranPhone(body.phone ?? "");

    if (!isValidIranMobile(phone)) {
      return NextResponse.json(
        { error: "شماره موبایل معتبر نیست." },
        { status: 400 },
      );
    }

    const notified = await notifyTelegram(phone);
    console.info("[Avid] consultation-request:", phone, { notified });

    return NextResponse.json({
      ok: true,
      notified,
    });
  } catch {
    return NextResponse.json(
      { error: "ثبت درخواست ممکن نشد." },
      { status: 500 },
    );
  }
}
