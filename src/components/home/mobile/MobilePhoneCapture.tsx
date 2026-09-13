"use client";

import { FormEvent, useState } from "react";
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

export function MobilePhoneCapture({
  title,
  submitLabel = "ثبت",
  className,
}: {
  title: string;
  submitLabel?: string;
  className?: string;
}) {
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
    <div className={cn("rounded-2xl bg-white p-4 shadow-lg shadow-black/10", className)}>
      <p className="text-base font-bold leading-snug text-yas-ink">{title}</p>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          dir="ltr"
          placeholder="شماره موبایل"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setError(null);
            setFeedback(null);
          }}
          className="h-11 min-w-0 flex-1 rounded-xl border border-black/10 bg-yas-mist px-3 text-left text-sm outline-none ring-yas-purple/30 focus:ring-2"
        />
        <button
          type="submit"
          disabled={submitting}
          className="h-11 shrink-0 rounded-xl bg-yas-purple px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "…" : submitLabel}
        </button>
      </form>
      {error ? (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      ) : feedback ? (
        <p className="mt-2 text-xs text-emerald-700">{feedback}</p>
      ) : null}
    </div>
  );
}
