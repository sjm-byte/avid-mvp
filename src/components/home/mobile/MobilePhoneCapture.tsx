"use client";

import { FormEvent, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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

/** Compact consultation form — same content as desktop card, mobile Yas styling. */
export function MobilePhoneCapture({ className }: { className?: string }) {
  const [phone, setPhone] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedback(null);
    setError(null);
    const normalized = normalizeIranPhone(phone);
    if (!isValidIranMobile(normalized)) {
      setError("شماره موبایل معتبر وارد کنید.");
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
      setFeedback("درخواست ثبت شد. به‌زودی تماس می‌گیریم.");
      setPhone("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ثبت ممکن نشد.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-yas-purple/20 bg-white p-4 shadow-[0_16px_40px_-24px_rgba(72,56,85,0.35)]",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yas-purple/12 text-yas-purple">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <h3 className="pt-1.5 text-base font-semibold text-yas-ink">
          درخواست مشاوره و اعلام آمادگی
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div className="space-y-1.5">
          <label
            htmlFor="mobile-consultation-phone"
            className="block text-xs text-yas-ink/55"
          >
            شماره موبایل
          </label>
          <input
            id="mobile-consultation-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            dir="ltr"
            placeholder="09121234567"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError(null);
              setFeedback(null);
            }}
            className="h-11 w-full rounded-xl border border-yas-purple/20 bg-yas-mist/60 px-3 text-left text-sm text-yas-ink outline-none ring-yas-purple/25 placeholder:text-yas-ink/35 focus:ring-2"
            aria-invalid={error ? true : undefined}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="h-11 w-full rounded-full bg-yas-purple text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "در حال ثبت…" : "ثبت درخواست"}
        </button>
      </form>

      {error ? (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      ) : feedback ? (
        <p className="mt-2 text-xs text-emerald-700">{feedback}</p>
      ) : (
        <p className="mt-2 text-center text-[11px] leading-relaxed text-yas-ink/50">
          اطلاعات شما فقط برای تماس تیم آوید استفاده می‌شود.
        </p>
      )}
    </div>
  );
}
