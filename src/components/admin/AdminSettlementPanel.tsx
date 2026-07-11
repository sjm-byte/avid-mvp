"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProjectSettlementDraft } from "@/lib/actions/project-settlements";
import {
  calculateSettlementFigures,
  ProjectSettlementRecord,
  SETTLEMENT_FORM_DISCLAIMER,
  SETTLEMENT_STATUS_LABELS,
} from "@/types/settlement";
import { formatToman } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface SettlementProjectOption {
  id: string;
  title: string;
  totalVerifiedAmount?: number;
}

interface AdminSettlementPanelProps {
  projects: SettlementProjectOption[];
  settlementsByProjectId: Record<string, ProjectSettlementRecord>;
}

function parseTomanInput(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function AdminSettlementPanel({
  projects,
  settlementsByProjectId,
}: AdminSettlementPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");

  const today = new Date().toISOString().split("T")[0];
  const selectedProject = projects.find((p) => p.id === projectId);
  const existing = settlementsByProjectId[projectId];

  const [totalCapital, setTotalCapital] = useState("");
  const [revenue, setRevenue] = useState("");
  const [costs, setCosts] = useState("");
  const [initialFee, setInitialFee] = useState("0");
  const [successFeeRatePercent, setSuccessFeeRatePercent] = useState("0");
  const [successFeeOverride, setSuccessFeeOverride] = useState("");
  const [settlementDate, setSettlementDate] = useState(today);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!selectedProject) return;

    const draft = settlementsByProjectId[selectedProject.id];
    if (draft) {
      setTotalCapital(String(Math.round(draft.totalVerifiedCapital / 10)));
      setRevenue(String(Math.round(draft.totalRevenue / 10)));
      setCosts(String(Math.round(draft.totalCosts / 10)));
      setInitialFee(String(Math.round(draft.initialFeeAmount / 10)));
      setSuccessFeeRatePercent(String(draft.successFeeRate * 100));
      setSuccessFeeOverride(
        draft.successFeeAmount > 0
          ? String(Math.round(draft.successFeeAmount / 10))
          : ""
      );
      setSettlementDate(draft.settlementDate);
      setNotes(draft.adminNotes ?? "");
    } else {
      setTotalCapital(
        selectedProject.totalVerifiedAmount
          ? String(Math.round(selectedProject.totalVerifiedAmount / 10))
          : ""
      );
      setRevenue("");
      setCosts("");
      setInitialFee("0");
      setSuccessFeeRatePercent("0");
      setSuccessFeeOverride("");
      setSettlementDate(today);
      setNotes("");
    }
  }, [projectId, selectedProject, settlementsByProjectId, today]);

  const preview = useMemo(() => {
    const revenueRial = (parseTomanInput(revenue) ?? 0) * 10;
    const costsRial = (parseTomanInput(costs) ?? 0) * 10;
    const initialFeeRial = (parseTomanInput(initialFee) ?? 0) * 10;
    const rate = (parseTomanInput(successFeeRatePercent) ?? 0) / 100;
    const overrideRaw = successFeeOverride.trim();
    const override =
      overrideRaw === "" ? null : (parseTomanInput(overrideRaw) ?? 0) * 10;

    return calculateSettlementFigures({
      totalRevenue: revenueRial,
      totalCosts: costsRial,
      initialFeeAmount: initialFeeRial,
      successFeeRate: rate,
      successFeeAmountOverride: override,
    });
  }, [revenue, costs, initialFee, successFeeRatePercent, successFeeOverride]);

  const isFinalized = existing?.status === "finalized";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!projectId) {
      setError("انتخاب پروژه الزامی است.");
      return;
    }

    if (!settlementDate) {
      setError("تاریخ تسویه الزامی است.");
      return;
    }

    const fields = [
      { value: totalCapital, label: "سرمایه تخصیص‌یافته" },
      { value: revenue, label: "کل درآمد" },
      { value: costs, label: "کل هزینه‌ها" },
      { value: initialFee, label: "کارمزد اولیه آوید" },
      { value: successFeeRatePercent, label: "درصد کارمزد موفقیت" },
    ];

    for (const field of fields) {
      if (parseTomanInput(field.value) === null) {
        setError(`مقدار «${field.label}» باید عدد معتبر باشد.`);
        return;
      }
    }

    if (
      successFeeOverride.trim() !== "" &&
      parseTomanInput(successFeeOverride) === null
    ) {
      setError("مبلغ کارمزد موفقیت باید عدد معتبر باشد.");
      return;
    }

    startTransition(async () => {
      const result = await saveProjectSettlementDraft({
        projectId,
        totalVerifiedCapital: Number(totalCapital) * 10,
        totalRevenue: Number(revenue) * 10,
        totalCosts: Number(costs) * 10,
        initialFeeAmount: Number(initialFee) * 10,
        successFeeRatePercent: Number(successFeeRatePercent),
        successFeeAmountOverride:
          successFeeOverride.trim() === ""
            ? null
            : Number(successFeeOverride) * 10,
        settlementDate,
        adminNotes: notes,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess("پیش‌نویس تسویه ذخیره شد.");
      router.refresh();
    });
  }

  if (projects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        پروژه‌ای با تخصیص فعال برای ثبت تسویه وجود ندارد.
      </p>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4 text-sm text-amber-900">
          {SETTLEMENT_FORM_DISCLAIMER}
        </CardContent>
      </Card>

      {existing && (
        <p className="text-sm text-muted-foreground">
          وضعیت فعلی:{" "}
          <span className="font-medium">
            {SETTLEMENT_STATUS_LABELS[existing.status]}
          </span>
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-700">{success}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">ثبت تسویه نهایی پروژه</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="w-full max-w-full space-y-2 md:max-w-md">
              <Label htmlFor="settlement-project">پروژه</Label>
              <select
                id="settlement-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                disabled={isFinalized}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="totalCapital">کل سرمایه تخصیص‌یافته (تومان)</Label>
                <Input
                  id="totalCapital"
                  type="number"
                  min={0}
                  value={totalCapital}
                  onChange={(e) => setTotalCapital(e.target.value)}
                  required
                  disabled={isFinalized}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenue">کل درآمد (تومان)</Label>
                <Input
                  id="revenue"
                  type="number"
                  min={0}
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  required
                  disabled={isFinalized}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costs">کل هزینه‌ها (تومان)</Label>
                <Input
                  id="costs"
                  type="number"
                  min={0}
                  value={costs}
                  onChange={(e) => setCosts(e.target.value)}
                  required
                  disabled={isFinalized}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initialFee">کارمزد اولیه آوید (تومان)</Label>
                <Input
                  id="initialFee"
                  type="number"
                  min={0}
                  value={initialFee}
                  onChange={(e) => setInitialFee(e.target.value)}
                  disabled={isFinalized}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="successFeeRatePercent">درصد کارمزد موفقیت</Label>
                <Input
                  id="successFeeRatePercent"
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={successFeeRatePercent}
                  onChange={(e) => setSuccessFeeRatePercent(e.target.value)}
                  disabled={isFinalized}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="successFeeOverride">
                  مبلغ کارمزد موفقیت (اختیاری، تومان)
                </Label>
                <Input
                  id="successFeeOverride"
                  type="number"
                  min={0}
                  value={successFeeOverride}
                  onChange={(e) => setSuccessFeeOverride(e.target.value)}
                  placeholder="در صورت خالی، از درصد محاسبه می‌شود"
                  disabled={isFinalized}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="settlementDate">تاریخ تسویه</Label>
                <Input
                  id="settlementDate"
                  type="date"
                  value={settlementDate}
                  onChange={(e) => setSettlementDate(e.target.value)}
                  required
                  disabled={isFinalized}
                />
              </div>
            </div>

            <div className="rounded-md border bg-muted/30 p-4 text-sm">
              <p className="mb-3 font-medium">پیش‌نمایش محاسبات</p>
              <dl className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <dt className="text-muted-foreground">نتیجه خالص</dt>
                  <dd className="font-medium">{formatToman(preview.netResult)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">کارمزد موفقیت آوید</dt>
                  <dd className="font-medium">
                    {formatToman(preview.successFeeAmount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">مبلغ قابل توزیع</dt>
                  <dd className="font-semibold">
                    {formatToman(preview.distributableAmount)}
                  </dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-muted-foreground">
                کارمزد موفقیت فقط در صورت سود مثبت اعمال می‌شود.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">یادداشت ادمین</Label>
              <Textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isFinalized}
              />
            </div>

            <Button type="submit" disabled={isPending || isFinalized}>
              {isPending
                ? "در حال ذخیره…"
                : isFinalized
                  ? "تسویه نهایی شده"
                  : "ذخیره پیش‌نویس تسویه"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
