"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addManagedProjectReportAction,
  settleManagedProjectAction,
  updateManagedProjectAction,
} from "@/lib/actions/project-ops";
import {
  ProjectOpsRecord,
  SETTLEMENT_OUTLOOK_LABELS,
  SETTLEMENT_TIMING_LABELS,
  SettlementOutlook,
  SettlementTimingStatus,
  UpdateMediaKind,
} from "@/types/project-ops";
import { formatToman } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function rialToTomanInput(rial: number | null | undefined): string {
  if (rial == null) return "";
  return String(Math.round(rial / 10));
}

function investorsToText(project: ProjectOpsRecord): string {
  return project.investors
    .map(
      (inv) =>
        `${inv.name} | ${Math.round(inv.amount / 10)} | ${Math.round(inv.newCapital / 10)} | ${Math.round(inv.transferredFromPrevious / 10)}`,
    )
    .join("\n");
}

function settlementsToText(project: ProjectOpsRecord): string {
  return project.investors
    .map((inv) => {
      const paid =
        inv.settledPaidAmount != null
          ? Math.round(inv.settledPaidAmount / 10)
          : Math.round(inv.amount / 10);
      return `${inv.name} | ${paid}`;
    })
    .join("\n");
}

interface AdminProjectOpsPanelProps {
  project: ProjectOpsRecord;
}

export function AdminProjectOpsPanel({ project }: AdminProjectOpsPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [totalCapitalToman, setTotalCapitalToman] = useState(
    rialToTomanInput(project.totalCapital),
  );
  const [profitDueToman, setProfitDueToman] = useState(
    rialToTomanInput(project.profitDue),
  );
  const [startDate, setStartDate] = useState(project.startDate?.slice(0, 10) ?? "");
  const [endDate, setEndDate] = useState(project.endDate?.slice(0, 10) ?? "");
  const [predictedReturnPercent, setPredictedReturnPercent] = useState(
    String(Math.round(project.predictedReturn * 100)),
  );
  const [collateral, setCollateral] = useState(project.collateral);
  const [commissionPercent, setCommissionPercent] = useState(
    String(Math.round(project.commissionPercent * 1000) / 10),
  );
  const [commissionStatus, setCommissionStatus] = useState(
    project.commissionStatus,
  );
  const [investorsText, setInvestorsText] = useState(investorsToText(project));

  const [reportTitle, setReportTitle] = useState("");
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [shortStatus, setShortStatus] = useState("");
  const [outlook, setOutlook] = useState<SettlementOutlook>("on_schedule");
  const [adminNote, setAdminNote] = useState("");
  const [mediaKind, setMediaKind] = useState<UpdateMediaKind | "">("");
  const [mediaLabel, setMediaLabel] = useState("");

  const [actualResult, setActualResult] = useState(project.actualResult ?? "");
  const [settlementDate, setSettlementDate] = useState(
    project.settlementDate?.slice(0, 10) ??
      new Date().toISOString().slice(0, 10),
  );
  const [settlementTiming, setSettlementTiming] =
    useState<SettlementTimingStatus>(
      project.settlementTiming ?? "settled_on_time",
    );
  const [settlementsText, setSettlementsText] = useState(
    settlementsToText(project),
  );

  const latestReports = useMemo(() => project.reports.slice(0, 3), [project.reports]);

  function run(
    action: () => Promise<{ ok: true } | { ok: false; error: string }>,
    successMessage: string,
  ) {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage(successMessage);
      router.refresh();
    });
  }

  return (
    <div className="min-w-0 space-y-6">
      {(message || error) && (
        <p
          className={
            error
              ? "text-sm text-destructive"
              : "text-sm text-emerald-700"
          }
        >
          {error ?? message}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">ویرایش فیلدهای مدیریتی</CardTitle>
          <CardDescription>
            این مقادیر در جدول ادمین و داشبورد سرمایه‌گذار (mock) همگام می‌شوند.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="totalCapital">سرمایه کل (تومان)</Label>
              <Input
                id="totalCapital"
                value={totalCapitalToman}
                onChange={(e) => setTotalCapitalToman(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profitDue">سود مستحق (تومان)</Label>
              <Input
                id="profitDue"
                value={profitDueToman}
                onChange={(e) => setProfitDueToman(e.target.value)}
                placeholder="اختیاری"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">تاریخ شروع</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">تاریخ پایان</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="predictedReturn">بازده ماهانه (%)</Label>
              <Input
                id="predictedReturn"
                value={predictedReturnPercent}
                onChange={(e) => setPredictedReturnPercent(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                پیش‌بینی است و سود قطعی یا تضمینی محسوب نمی‌شود.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="commissionPercent">کارمزد (%)</Label>
              <Input
                id="commissionPercent"
                value={commissionPercent}
                onChange={(e) => setCommissionPercent(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="collateral">وثیقه</Label>
              <Input
                id="collateral"
                value={collateral}
                onChange={(e) => setCollateral(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="commissionStatus">وضعیت کارمزد</Label>
              <Input
                id="commissionStatus"
                value={commissionStatus}
                onChange={(e) => setCommissionStatus(e.target.value)}
                placeholder="مثلاً در انتها / دریافت شد"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="investors">
                سرمایه‌گذاران و مبالغ (هر سطر: نام | مبلغ | آورده جدید | آورده
                قبلی)
              </Label>
              <Textarea
                id="investors"
                rows={6}
                value={investorsText}
                onChange={(e) => setInvestorsText(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>
          <Button
            type="button"
            disabled={isPending}
            onClick={() =>
              run(
                () =>
                  updateManagedProjectAction({
                    slug: project.slug,
                    totalCapitalToman,
                    profitDueToman,
                    startDate,
                    endDate,
                    predictedReturnPercent,
                    collateral,
                    commissionPercent,
                    commissionStatus,
                    investorsText,
                  }),
                "فیلدهای مدیریتی ذخیره شد.",
              )
            }
          >
            ذخیره فیلدها
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">ثبت گزارش وضعیت پروژه</CardTitle>
          <CardDescription>
            گزارش برای پروژه‌های فعال در پنل سرمایه‌گذار نمایش داده می‌شود.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {latestReports.length > 0 && (
            <ul className="space-y-2 rounded-md border bg-muted/30 p-3 text-xs">
              {latestReports.map((r) => (
                <li key={r.id}>
                  <span className="font-medium">{r.title}</span>
                  {" — "}
                  {new Date(r.reportDate).toLocaleDateString("fa-IR")}
                  {" / "}
                  {SETTLEMENT_OUTLOOK_LABELS[r.settlementOutlook]}
                </li>
              ))}
            </ul>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="reportTitle">عنوان گزارش</Label>
              <Input
                id="reportTitle"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportDate">تاریخ گزارش</Label>
              <Input
                id="reportDate"
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outlook">انتظار تسویه</Label>
              <select
                id="outlook"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={outlook}
                onChange={(e) =>
                  setOutlook(e.target.value as SettlementOutlook)
                }
              >
                {(
                  Object.keys(SETTLEMENT_OUTLOOK_LABELS) as SettlementOutlook[]
                ).map((key) => (
                  <option key={key} value={key}>
                    {SETTLEMENT_OUTLOOK_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="shortStatus">وضعیت کوتاه</Label>
              <Input
                id="shortStatus"
                value={shortStatus}
                onChange={(e) => setShortStatus(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="adminNote">یادداشت مدیر (قابل مشاهده برای سرمایه‌گذار)</Label>
              <Textarea
                id="adminNote"
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mediaKind">نوع پیوست نمایشی</Label>
              <select
                id="mediaKind"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={mediaKind}
                onChange={(e) =>
                  setMediaKind(e.target.value as UpdateMediaKind | "")
                }
              >
                <option value="">بدون پیوست</option>
                <option value="image">تصویر</option>
                <option value="video">ویدیو</option>
                <option value="report">گزارش</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mediaLabel">برچسب پیوست</Label>
              <Input
                id="mediaLabel"
                value={mediaLabel}
                onChange={(e) => setMediaLabel(e.target.value)}
                placeholder="مثلاً تصویر انبار (نمایشی)"
              />
            </div>
          </div>
          <Button
            type="button"
            disabled={isPending}
            onClick={() =>
              run(
                () =>
                  addManagedProjectReportAction({
                    slug: project.slug,
                    title: reportTitle,
                    reportDate,
                    shortStatus,
                    settlementOutlook: outlook,
                    adminNote,
                    mediaKind,
                    mediaLabel,
                  }),
                "گزارش وضعیت ثبت شد.",
              )
            }
          >
            ثبت گزارش
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">تکمیل / تسویه پروژه</CardTitle>
          <CardDescription>
            نتیجه واقعی و مبلغ واریزی هر سرمایه‌گذار را ثبت کنید. بدون تضمین سود.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
            وضعیت فعلی:{" "}
            <span className="font-medium text-foreground">
              {project.lifecycle === "active"
                ? "فعال"
                : project.lifecycle === "completed"
                  ? "پایان‌یافته — در انتظار تسویه"
                  : "تسویه‌شده"}
            </span>
            {project.actualResult && (
              <p className="mt-2">نتیجه ثبت‌شده: {project.actualResult}</p>
            )}
            {project.investors.some((i) => i.settledPaidAmount != null) && (
              <ul className="mt-2 space-y-1">
                {project.investors.map((inv) =>
                  inv.settledPaidAmount != null ? (
                    <li key={inv.name}>
                      {inv.name}: {formatToman(inv.settledPaidAmount)}
                    </li>
                  ) : null,
                )}
              </ul>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="actualResult">نتیجه واقعی پروژه</Label>
              <Textarea
                id="actualResult"
                rows={3}
                value={actualResult}
                onChange={(e) => setActualResult(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settlementDate">تاریخ تسویه</Label>
              <Input
                id="settlementDate"
                type="date"
                value={settlementDate}
                onChange={(e) => setSettlementDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settlementTiming">وضعیت تسویه</Label>
              <select
                id="settlementTiming"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={settlementTiming}
                onChange={(e) =>
                  setSettlementTiming(e.target.value as SettlementTimingStatus)
                }
              >
                {(
                  Object.keys(
                    SETTLEMENT_TIMING_LABELS,
                  ) as SettlementTimingStatus[]
                ).map((key) => (
                  <option key={key} value={key}>
                    {SETTLEMENT_TIMING_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="settlementsText">
                مبلغ واریزی هر سرمایه‌گذار (نام | مبلغ تومان)
              </Label>
              <Textarea
                id="settlementsText"
                rows={5}
                value={settlementsText}
                onChange={(e) => setSettlementsText(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() =>
                run(
                  () =>
                    settleManagedProjectAction({
                      slug: project.slug,
                      actualResult,
                      settlementDate,
                      settlementTiming,
                      settlementsText,
                      markCompletedOnly: true,
                    }),
                  "پروژه به‌عنوان پایان‌یافته ثبت شد.",
                )
              }
            >
              علامت‌گذاری پایان‌یافته
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={() =>
                run(
                  () =>
                    settleManagedProjectAction({
                      slug: project.slug,
                      actualResult,
                      settlementDate,
                      settlementTiming,
                      settlementsText,
                      markCompletedOnly: false,
                    }),
                  "تسویه پروژه ثبت شد.",
                )
              }
            >
              ثبت تسویه نهایی
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
