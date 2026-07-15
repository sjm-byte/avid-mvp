"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CASH_FLOW_KIND_LABELS,
  CashFlowEvent,
  CashFlowKind,
  InvestorPortfolioSummary,
} from "@/lib/data/mock/investor-portfolio-mock";
import { cn, formatToman } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fa-IR");
}

function kindColor(kind: CashFlowKind): string {
  switch (kind) {
    case "deposit":
      return "border-blue-500 bg-blue-50 text-blue-900";
    case "profit":
      return "border-emerald-600 bg-emerald-50 text-emerald-900";
    case "withdrawal":
      return "border-amber-500 bg-amber-50 text-amber-900";
  }
}

function signedAmount(kind: CashFlowKind, amount: number): string {
  const formatted = formatToman(amount);
  if (kind === "withdrawal") return `− ${formatted}`;
  return `+ ${formatted}`;
}

function TooltipRow({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "max-w-[10rem] text-left font-medium leading-snug",
          emphasize ? "text-foreground" : "text-foreground/90",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function TimelineTooltipPortal({
  anchorRef,
  open,
  tooltipId,
  event,
  isStart,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  tooltipId: string;
  event?: CashFlowEvent;
  isStart?: boolean;
}) {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    function update() {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const width = 256;
      const gap = 10;
      let left = rect.left + rect.width / 2 - width / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
      const estimatedHeight = 200;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top =
        spaceBelow < estimatedHeight + gap
          ? Math.max(8, rect.top - estimatedHeight - gap)
          : rect.bottom + gap;
      setCoords({ top, left });
    }

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, anchorRef]);

  if (!open || !coords || typeof document === "undefined") return null;

  return createPortal(
    <div
      id={tooltipId}
      role="tooltip"
      className="pointer-events-none fixed z-[100] w-64 rounded-lg border bg-background p-3 text-right text-xs shadow-lg"
      style={{ top: coords.top, left: coords.left }}
    >
      <dl className="space-y-1.5">
        {isStart ? (
          <>
            <TooltipRow label="نقطه شروع" value="شروع همکاری" emphasize />
            <TooltipRow label="مانده نقدینگی" value={formatToman(0)} emphasize />
            <TooltipRow
              label="توضیح"
              value="هنوز تراکنشی ثبت نشده است."
            />
          </>
        ) : event ? (
          <>
            <TooltipRow
              label="نوع تراکنش"
              value={CASH_FLOW_KIND_LABELS[event.kind]}
              emphasize
            />
            <TooltipRow
              label="مبلغ"
              value={signedAmount(event.kind, event.amount)}
            />
            <TooltipRow
              label="مانده پس از تراکنش"
              value={formatToman(event.balanceAfter)}
              emphasize
            />
            <TooltipRow label="تاریخ" value={formatDate(event.date)} />
            {event.projectTitle && (
              <TooltipRow label="پروژه مرتبط" value={event.projectTitle} />
            )}
            {event.note && <TooltipRow label="یادداشت" value={event.note} />}
          </>
        ) : null}
      </dl>
    </div>,
    document.body,
  );
}

function TimelineNode({
  label,
  sublabel,
  event,
  isStart,
}: {
  label: string;
  sublabel?: string;
  event?: CashFlowEvent;
  isStart?: boolean;
}) {
  const tooltipId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="relative flex w-[7.5rem] shrink-0 flex-col items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={cn(
          "relative z-10 flex size-8 items-center justify-center rounded-full border-2 text-[10px] font-semibold outline-none transition-shadow",
          "hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isStart
            ? "border-foreground/40 bg-muted text-foreground"
            : kindColor(event?.kind ?? "deposit"),
        )}
        aria-label={
          isStart
            ? "شروع همکاری — مانده نقدینگی صفر"
            : `${CASH_FLOW_KIND_LABELS[event?.kind ?? "deposit"]} — ${label}`
        }
      >
        <span aria-hidden>●</span>
      </button>
      <p className="mt-2 w-full text-center text-[11px] font-medium leading-snug">
        {label}
      </p>
      {sublabel && (
        <p className="mt-0.5 text-center text-[10px] text-muted-foreground">
          {sublabel}
        </p>
      )}

      {mounted && (
        <TimelineTooltipPortal
          anchorRef={buttonRef}
          open={open}
          tooltipId={tooltipId}
          event={event}
          isStart={isStart}
        />
      )}
    </div>
  );
}

function TimelineConnector({ variant = 0 }: { variant?: number }) {
  const wave =
    variant % 2 === 0
      ? "M 44 12 C 32 3, 20 21, 12 12"
      : "M 44 12 C 32 21, 20 3, 12 12";

  return (
    <div
      className="relative mt-3 flex h-9 w-10 shrink-0 items-center sm:w-14"
      aria-hidden
    >
      <svg
        viewBox="0 0 56 28"
        className="h-full w-full overflow-visible text-foreground/55"
        fill="none"
      >
        <path
          d={wave}
          stroke="currentColor"
          strokeWidth="1.75"
          strokeDasharray="2.5 3.5"
          strokeLinecap="round"
        />
        <path
          d="M14 12 L8 12 M8 12 L11.5 8.5 M8 12 L11.5 15.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

interface InvestorPortfolioTimelineProps {
  summary: InvestorPortfolioSummary;
}

export function InvestorPortfolioTimeline({
  summary,
}: InvestorPortfolioTimelineProps) {
  const events = summary.cashFlowEvents;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">خط زمانی جریان نقدینگی</CardTitle>
        <p className="text-xs text-muted-foreground">
          ورود وجه، تحقق سود، برداشت و نقدینگی جدید — به‌ترتیب تاریخ ثبت.
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full border-2 border-blue-500 bg-blue-50"
              aria-hidden
            />
            واریز وجه
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full border-2 border-emerald-600 bg-emerald-50"
              aria-hidden
            />
            واریز سود
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full border-2 border-amber-500 bg-amber-50"
              aria-hidden
            />
            برداشت وجه
          </span>
        </div>

        <div className="w-full max-w-full min-w-0 overflow-x-auto overscroll-x-contain py-2">
          <div
            dir="rtl"
            className="flex min-w-max items-start justify-start gap-0 px-2"
          >
            <TimelineNode
              isStart
              label={summary.timelineStartLabel}
              sublabel={formatDate(summary.timelineStartDate)}
            />

            {events.map((event, index) => (
              <div key={event.id} className="flex items-start">
                <TimelineConnector variant={index} />
                <TimelineNode
                  label={CASH_FLOW_KIND_LABELS[event.kind]}
                  sublabel={formatDate(event.date)}
                  event={event}
                />
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          برای دیدن مبلغ و مانده، موس را روی هر دایره نگه دارید. جهت زمان از راست
          به چپ است (←).
        </p>
      </CardContent>
    </Card>
  );
}
