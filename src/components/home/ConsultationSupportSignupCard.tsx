"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

type Feedback =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export function ConsultationSupportSignupCard() {
  const [phone, setPhone] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
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
      const response = await fetch("/api/consultation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "خطا در ثبت");
      }

      setFeedback({
        type: "success",
        message: "درخواست شما ثبت شد. تیم آوید در اسرع وقت با شما تماس می‌گیرد.",
      });
      setPhone("");
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "ثبت ممکن نشد. لطفاً دوباره تلاش کنید.",
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
        درخواست مشاوره و پشتیبانی
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/75">
        اگر سؤالی دارید یا می‌خواهید قبل از مشارکت راهنمایی بگیرید، شماره
        موبایل خود را وارد کنید.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-1 flex-col gap-3">
        <div className="space-y-2">
          <Label htmlFor="consultation-phone" className="text-white/90">
            شماره موبایل
          </Label>
          <Input
            id="consultation-phone"
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
            aria-describedby={feedback ? "consultation-feedback" : undefined}
          />
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="mt-auto w-full rounded-full bg-gold font-semibold text-navy hover:bg-gold-light"
        >
          {submitting ? "در حال ثبت…" : "ثبت درخواست مشاوره"}
        </Button>
        {feedback ? (
          <p
            id="consultation-feedback"
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
            اطلاعات شما فقط برای تماس تیم آوید استفاده می‌شود.
          </p>
        )}
      </form>
    </div>
  );
}
