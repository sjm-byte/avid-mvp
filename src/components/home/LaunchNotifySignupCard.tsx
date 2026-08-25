"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "avid-launch-notify-phones";

/** Iranian mobile: 09 followed by 9 digits (Persian/Arabic digits normalized). */
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

function savePhoneLocally(phone: string): void {
  try {
    const existing = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]"
    ) as string[];
    const list = Array.isArray(existing) ? existing : [];
    if (!list.includes(phone)) {
      list.push(phone);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([phone]));
  }
  console.info("[Avid] launch-notify signup:", phone);
}

type Feedback =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export function LaunchNotifySignupCard() {
  const [phone, setPhone] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedback(null);

    const normalized = normalizeIranPhone(phone);
    if (!isValidIranMobile(normalized)) {
      setFeedback({
        type: "error",
        message: "شماره موبایل معتبر وارد کنید (مثال: ۰۹۱۲۱۲۳۴۵۶۷).",
      });
      return;
    }

    setSubmitting(true);
    try {
      savePhoneLocally(normalized);
      setFeedback({
        type: "success",
        message: "ثبت شد. در صورت راه‌اندازی پروژه جدید با شما تماس می‌گیریم.",
      });
      setPhone("");
    } catch {
      setFeedback({
        type: "error",
        message: "ثبت موقت ممکن نشد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-gold/40 bg-navy p-6 text-white shadow-[0_8px_28px_-12px_rgba(13,27,62,0.55)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-gold via-gold-light to-gold/60"
        aria-hidden
      />
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-gold/15 text-sm font-bold text-gold">
        ۶
      </div>
      <h3 className="text-lg font-semibold text-white">
        اطلاع از راه‌اندازی پروژه
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/75">
        اگر می‌خواهید هنگام گشایش پروژه جدید مطلع شوید، شماره موبایل خود را ثبت
        کنید تا تیم آوید پیگیری کند.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-1 flex-col gap-3">
        <div className="space-y-2">
          <Label htmlFor="launch-notify-phone" className="text-white/90">
            شماره موبایل
          </Label>
          <Input
            id="launch-notify-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            dir="ltr"
            placeholder="09121234567"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (feedback) setFeedback(null);
            }}
            className="border-white/20 bg-white/10 text-left text-white placeholder:text-white/40 focus-visible:ring-gold"
            aria-invalid={feedback?.type === "error"}
            aria-describedby={
              feedback ? "launch-notify-feedback" : undefined
            }
          />
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="mt-auto w-full rounded-full bg-gold font-semibold text-navy hover:bg-gold-light"
        >
          {submitting ? "در حال ثبت…" : "ثبت شماره برای اطلاع‌رسانی"}
        </Button>
        {feedback ? (
          <p
            id="launch-notify-feedback"
            role="status"
            className={
              feedback.type === "success"
                ? "text-xs leading-relaxed text-emerald-300"
                : "text-xs leading-relaxed text-red-300"
            }
          >
            {feedback.message}
          </p>
        ) : (
          <p className="text-xs leading-relaxed text-white/50">
            ارسال پیامک خودکار انجام نمی‌شود؛ ثبت فقط برای پیگیری تیم است.
          </p>
        )}
      </form>
    </div>
  );
}
