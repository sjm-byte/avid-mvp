"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  InvestorPortfolioSummary,
  InvestorProjectRow,
  TIMELINE_STATUS_LABELS,
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

function lifecycleColor(lifecycle: InvestorProjectRow["lifecycle"]): string {
  switch (lifecycle) {
    case "active":
      return "border-blue-500 bg-blue-50 text-blue-900";
    case "completed":
      return "border-amber-500 bg-amber-50 text-amber-900";
    case "settled":
      return "border-emerald-600 bg-emerald-50 text-emerald-900";
  }
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
          "max-w-[9rem] text-left font-medium leading-snug",
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
  title,
  newCapital,
  transferredFromPrevious,
  balanceAfter,
  statusLabel,
  isStart,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  tooltipId: string;
  title: string;
  newCapital: number;
  transferredFromPrevious: number;
  balanceAfter: number;
  statusLabel: string;
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
      // Prefer just under the circle; if near bottom of viewport, show above.
      const estimatedHeight = 180;
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
        <TooltipRow
          label={isStart ? "نقطه شروع" : "نام پروژه"}
          value={title}
          emphasize
        />
        <TooltipRow label="آورده جدید" value={formatToman(newCapital)} />
        <TooltipRow
          label="آورده قبلی / منتقل‌شده از پروژه قبل"
          value={
            transferredFromPrevious > 0
              ? formatToman(transferredFromPrevious)
              : "—"
          }
        />
        <TooltipRow
          label="تراز سرمایه نزد آوید"
          value={formatToman(balanceAfter)}
          emphasize
        />
        <TooltipRow label="وضعیت" value={statusLabel} />
      </dl>
    </div>,
    document.body,
  );
}

function TimelineNode({
  label,
  sublabel,
  lifecycle,
  project,
  isStart,
}: {
  label: string;
  sublabel?: string;
  lifecycle?: InvestorProjectRow["lifecycle"];
  project?: InvestorProjectRow;
  isStart?: boolean;
}) {
  const tooltipId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tooltipProps = isStart
    ? {
        title: "شروع همکاری",
        newCapital: 0,
        transferredFromPrevious: 0,
        balanceAfter: 0,
        statusLabel: "شروع",
        isStart: true as const,
      }
    : project
      ? {
          title: project.title,
          newCapital: project.newCapital,
          transferredFromPrevious: project.transferredFromPrevious,
          balanceAfter: project.balanceAfterProject,
          statusLabel: TIMELINE_STATUS_LABELS[project.timelineStatus],
          isStart: false as const,
        }
      : null;

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
            : lifecycleColor(lifecycle ?? "active"),
        )}
        aria-label={
          isStart
            ? "شروع همکاری — تراز سرمایه نزد آوید صفر"
            : `جزئیات پروژه ${project?.title ?? label}`
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

      {mounted && tooltipProps && (
        <TimelineTooltipPortal
          anchorRef={buttonRef}
          open={open}
          tooltipId={tooltipId}
          {...tooltipProps}
        />
      )}
    </div>
  );
}

function TimelineConnector({ variant = 0 }: { variant?: number }) {
  // Path goes right → left (time direction in RTL UI).
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
        {/* Wavy dotted line: from right (past) toward left (next) */}
        <path
          d={wave}
          stroke="currentColor"
          strokeWidth="1.75"
          strokeDasharray="2.5 3.5"
          strokeLinecap="round"
        />
        {/* Explicit left-pointing arrow (←) at the end of time flow */}
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
  const projects = [...summary.projects].sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">خط زمانی مشارکت‌ها</CardTitle>
      </CardHeader>
      <CardContent>
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

            {projects.map((project, index) => (
              <div key={project.id} className="flex items-start">
                <TimelineConnector variant={index} />
                <TimelineNode
                  label={
                    project.title.length > 22
                      ? `${project.title.slice(0, 20)}…`
                      : project.title
                  }
                  sublabel={formatDate(project.startDate)}
                  lifecycle={project.lifecycle}
                  project={project}
                />
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          برای دیدن جزئیات، موس را روی هر دایره نگه دارید. جهت زمان از راست به
          چپ است (←).
        </p>
      </CardContent>
    </Card>
  );
}
