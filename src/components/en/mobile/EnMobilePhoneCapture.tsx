"use client";

import { FormEvent, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/** Compact consultation form in the purple mobile style; accepts international numbers. */
export function EnMobilePhoneCapture({ className }: { className?: string }) {
  const [phone, setPhone] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedback(null);
    setError(null);
    if (phone.replace(/[^\d]/g, "").length < 8) {
      setError("Enter a phone number with its country code.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/consultation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, locale: "en" }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "We could not record your request.");
      setFeedback("Request received. We will call you shortly.");
      setPhone("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not record your request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={cn("rounded-2xl border border-white/12 bg-[#242030] p-4", className)}>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#A07CC4]/30 text-[#C9B4DE]">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <h3 className="pt-1 font-en text-base font-semibold text-white">
          Request a consultation
        </h3>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-3" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="en-mobile-phone" className="block text-xs text-white/55">
            Phone number
          </label>
          <input
            id="en-mobile-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+44 7700 900123"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError(null);
              setFeedback(null);
            }}
            aria-invalid={error ? true : undefined}
            className="h-11 w-full rounded-xl border border-white/15 bg-[#18141f] px-3 text-base text-white outline-none ring-[#A07CC4]/40 placeholder:text-white/35 focus:ring-2"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="h-11 w-full rounded-full bg-[#A07CC4] text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Request a call"}
        </button>
      </form>

      <p
        role="status"
        className={cn(
          "mt-2 text-xs leading-relaxed",
          error ? "text-red-300" : feedback ? "text-emerald-300" : "text-center text-white/45",
        )}
      >
        {error ?? feedback ?? "Your number is used only for the Avid team to contact you."}
      </p>
    </div>
  );
}
