"use client";

import { FormEvent, useState } from "react";

type Feedback = { type: "success" | "error"; message: string } | null;

/** Same request as the Persian form; accepts international numbers. */
export function EnConsultationForm({ id = "en-consultation" }: { id?: string }) {
  const [phone, setPhone] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedback(null);
    const digits = phone.replace(/[^\d]/g, "");
    if (digits.length < 8) {
      setFeedback({
        type: "error",
        message: "Enter a phone number with its country code, e.g. +44 7700 900123.",
      });
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
      setFeedback({
        type: "success",
        message: "Request received. The Avid team will call you shortly.",
      });
      setPhone("");
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "We could not record your request.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border border-gold/40 bg-card p-6 sm:p-7">
      <h3 className="text-2xl text-navy">Request a consultation</h3>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
        Leave your number and the Avid office will call you to talk it through.
      </p>
      <form onSubmit={onSubmit} className="mt-5 space-y-3" noValidate>
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          Phone number
        </label>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+44 7700 900123"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (feedback) setFeedback(null);
          }}
          aria-invalid={feedback?.type === "error" || undefined}
          aria-describedby={`${id}-note`}
          className="h-11 w-full rounded-md border border-input bg-background px-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold"
        />
        <button
          type="submit"
          disabled={submitting}
          className="h-11 w-full rounded-md bg-navy text-[0.95rem] font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Request a call"}
        </button>
      </form>
      <p
        id={`${id}-note`}
        role="status"
        className={
          "mt-3 text-sm leading-relaxed " +
          (feedback?.type === "error"
            ? "text-red-700"
            : feedback?.type === "success"
              ? "text-emerald-700"
              : "text-muted-foreground")
        }
      >
        {feedback?.message ?? "Your number is used only for the Avid team to contact you."}
      </p>
    </div>
  );
}
