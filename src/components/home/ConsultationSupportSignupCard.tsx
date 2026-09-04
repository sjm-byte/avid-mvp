"use client";

import { FormEvent, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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

export function ConsultationSupportSignupCard({
  layout = "banner",
}: {
  layout?: "banner" | "tile";
}) {
  const isTile = layout === "tile";
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
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-background via-gold/[0.06] to-navy/[0.04] p-4 shadow-[0_10px_40px_-24px_rgba(13,27,62,0.45)] sm:p-5",
        isTile && "flex h-full flex-col",
      )}
    >
      <div
        className="pointer-events-none absolute -left-8 -top-8 size-24 rounded-full bg-gold/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 -right-6 size-28 rounded-full bg-navy/8 blur-2xl"
        aria-hidden
      />

      <div className="relative flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
          <Sparkles className="size-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground">
            درخواست مشاوره و اعلام آمادگی
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            شماره موبایل خود را بگذارید تا برای مشاوره یا اعلام آمادگی با شما
            تماس بگیریم.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative mt-4 flex flex-col gap-2.5",
          isTile ? "mt-auto" : "sm:flex-row sm:items-end",
        )}
      >
        <div className="min-w-0 flex-1 space-y-1.5">
          <Label htmlFor="consultation-phone" className="text-xs text-muted-foreground">
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
            className="h-9 border-gold/25 bg-background/80 text-left text-sm focus-visible:ring-gold/40"
            aria-invalid={feedback?.type === "error"}
            aria-describedby={feedback ? "consultation-feedback" : undefined}
          />
        </div>
        <Button
          type="submit"
          disabled={submitting}
          size="sm"
          className="h-9 shrink-0 rounded-full bg-navy px-4 text-xs font-semibold text-white hover:bg-navy-light sm:h-9"
        >
          {submitting ? "در حال ثبت…" : "ثبت درخواست"}
        </Button>
      </form>

      {feedback ? (
        <p
          id="consultation-feedback"
          role="status"
          className={
            feedback.type === "success"
              ? "relative mt-2 text-xs leading-relaxed text-emerald-700"
              : "relative mt-2 text-xs leading-relaxed text-red-600"
          }
        >
          {feedback.message}
        </p>
      ) : (
        <p className="relative mt-2 text-[11px] leading-relaxed text-muted-foreground">
          اطلاعات شما فقط برای تماس تیم آوید استفاده می‌شود.
        </p>
      )}
    </div>
  );
}
