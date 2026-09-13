"use client";

import { FormEvent, useState } from "react";
import { Phone } from "lucide-react";
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
  highlight,
  subtitle,
  submitLabel = "ثبت",
  className,
}: {
  title: string;
  /** Word inside title rendered in purple (Yas “یاس” treatment). */
  highlight?: string;
  subtitle?: string;
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

  const titleNode =
    highlight && title.includes(highlight) ? (
      <>
        {title.slice(0, title.indexOf(highlight))}
        <span className="text-yas-purple">{highlight}</span>
        {title.slice(title.indexOf(highlight) + highlight.length)}
      </>
    ) : (
      title
    );

  return (
    <div
      className={cn(
        "rounded-[1.35rem] border border-white/70 bg-white/92 p-4 shadow-[0_28px_70px_rgba(72,56,85,0.12),inset_0_1px_0_rgba(255,255,255,0.86)] backdrop-blur-md",
        className,
      )}
    >
      <h1 className="text-[1.35rem] font-extrabold leading-snug text-yas-ink">
        {titleNode}
      </h1>
      {subtitle ? (
        <p className="mt-1.5 text-sm text-yas-ink/55">{subtitle}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">شماره موبایل</span>
          <Phone
            className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-yas-ink/35"
            aria-hidden
          />
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
            className="h-11 w-full rounded-xl border border-black/8 bg-white pe-10 ps-3 text-left text-sm outline-none ring-yas-purple/25 focus:ring-2"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="h-11 shrink-0 rounded-xl bg-yas-purple px-5 text-sm font-bold text-white disabled:opacity-60"
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
