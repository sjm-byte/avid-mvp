"use client";

import { useId, useState } from "react";
import {
  CapitalMovementDetail,
  InvestorPortfolioSummary,
} from "@/lib/data/mock/investor-portfolio-mock";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { cn, formatToman } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, List } from "lucide-react";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fa-IR");
}

function DetailPanel({
  open,
  panelId,
  title,
  emptyText,
  rows,
  showProject,
}: {
  open: boolean;
  panelId: string;
  title: string;
  emptyText: string;
  rows: CapitalMovementDetail[];
  showProject: boolean;
}) {
  if (!open) return null;

  return (
    <div
      id={panelId}
      className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-md border bg-background p-3 text-right shadow-lg"
      role="region"
      aria-label={title}
    >
      <p className="mb-2 text-xs font-semibold text-foreground">{title}</p>
      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="divide-y rounded-md border bg-background">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-xs"
            >
              <span className="text-muted-foreground">
                {formatDate(row.date)}
              </span>
              <span className="font-medium">{formatToman(row.amount)}</span>
              {showProject && row.projectTitle && (
                <p className="w-full text-[11px] leading-snug text-muted-foreground">
                  {row.projectTitle}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ExpandableStatCard({
  title,
  value,
  description,
  panelTitle,
  emptyText,
  details,
  showProjectInDetails,
  className,
}: {
  title: string;
  value: string;
  description?: string;
  panelTitle: string;
  emptyText: string;
  details: CapitalMovementDetail[];
  showProjectInDetails: boolean;
  className?: string;
}) {
  const panelId = useId();
  const [open, setOpen] = useState(false);

  return (
    <Card className={cn("relative overflow-visible", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 w-full justify-between"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="inline-flex items-center gap-2">
            <List className="size-3.5" aria-hidden />
            {open ? "بستن جزئیات" : "مشاهده جزئیات"}
          </span>
          {open ? (
            <ChevronUp className="size-3.5" aria-hidden />
          ) : (
            <ChevronDown className="size-3.5" aria-hidden />
          )}
        </Button>
        <DetailPanel
          open={open}
          panelId={panelId}
          title={panelTitle}
          emptyText={emptyText}
          rows={details}
          showProject={showProjectInDetails}
        />
      </CardContent>
    </Card>
  );
}

interface InvestorSummaryStatsProps {
  summary: InvestorPortfolioSummary;
}

export function InvestorSummaryStats({ summary }: InvestorSummaryStatsProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium">سه تراز اصلی</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          چقدر وارد شده و درگیر است، چقدر مانده ریالی دارد، و چقدر تاکنون خارج
          شده — ثبت دستی توسط مدیرعامل.
        </p>
      </div>

      <div className="grid items-start gap-4 md:grid-cols-3">
        <ExpandableStatCard
          title="تراز سرمایه نزد آوید"
          value={formatToman(summary.activeProjectCapital)}
          description="الان در پروژه‌های فعال درگیر است"
          panelTitle="واریزها (تاریخ و مبلغ)"
          emptyText="هنوز واریزی ثبت نشده است."
          details={summary.depositDetails}
          showProjectInDetails
          className="ring-1 ring-blue-200/80"
        />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              تراز ریالی نزد آوید
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">
              {formatToman(summary.rialBalanceWithAvid)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              مانده پروژه‌های پایان‌یافته تا انتقال یا تسویه ریالی
            </p>
          </CardContent>
        </Card>
        <ExpandableStatCard
          title="تراز تسویه شده تاکنون"
          value={formatToman(summary.settledBalanceToDate)}
          description="مبالغی که تاکنون خارج / تسویه شده‌اند"
          panelTitle="تسویه‌ها (تاریخ و مبلغ)"
          emptyText="هنوز تسویه خروجی ثبت نشده است."
          details={summary.settlementDetails}
          showProjectInDetails={false}
          className="ring-1 ring-emerald-200/80"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="تعداد پروژه‌های پایان‌یافته"
          value={summary.endedProjectCount}
        />
        <StatCard
          title="تعداد پروژه‌های فعال"
          value={summary.activeProjectCount}
        />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        تاریخ و مبلغ ورود/خروج را مدیرعامل به‌صورت دستی ثبت می‌کند؛ کیف پول یا
        درگاه پرداخت نیست.
      </p>
    </div>
  );
}
