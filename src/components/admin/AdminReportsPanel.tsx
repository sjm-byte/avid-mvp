"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createFinancialReport,
  createProjectMilestone,
  createProjectUpdate,
} from "@/lib/actions/project-reports";
import { AdminProjectSummary } from "@/types/project-report";
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

interface AdminReportsPanelProps {
  projects: AdminProjectSummary[];
}

export function AdminReportsPanel({ projects }: AdminReportsPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<"update" | "financial" | "milestone">(
    "update"
  );

  const today = new Date().toISOString().split("T")[0];

  function handleUpdateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createProjectUpdate({
        projectId,
        title: String(form.get("title") ?? ""),
        summary: String(form.get("summary") ?? ""),
        detailedNote: String(form.get("detailedNote") ?? "") || undefined,
        status: String(form.get("status") ?? "normal") as
          | "normal"
          | "important"
          | "delayed"
          | "resolved",
        visibility: String(form.get("visibility") ?? "investor_only") as
          | "public"
          | "investor_only",
        publishedAt: String(form.get("publishedAt") ?? today),
      });

      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess("گزارش پیشرفت با موفقیت منتشر شد.");
      router.refresh();
      e.currentTarget.reset();
    });
  }

  function handleFinancialSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createFinancialReport({
        projectId,
        title: String(form.get("title") ?? ""),
        periodStart: String(form.get("periodStart") ?? today),
        periodEnd: String(form.get("periodEnd") ?? today),
        capitalAllocated: Number(form.get("capitalAllocated") ?? 0),
        costsRecorded: Number(form.get("costsRecorded") ?? 0),
        revenueRecorded: Number(form.get("revenueRecorded") ?? 0),
        estimatedCurrentResult: Number(form.get("estimatedCurrentResult") ?? 0),
        adminNotes: String(form.get("adminNotes") ?? "") || undefined,
        visibility: String(form.get("visibility") ?? "investor_only") as
          | "public"
          | "investor_only",
        publishedAt: String(form.get("publishedAt") ?? today),
      });

      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess("گزارش مالی پیش‌نویس ثبت شد.");
      router.refresh();
      e.currentTarget.reset();
    });
  }

  function handleMilestoneSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createProjectMilestone({
        projectId,
        title: String(form.get("title") ?? ""),
        description: String(form.get("description") ?? "") || undefined,
        plannedDate: String(form.get("plannedDate") ?? "") || undefined,
        status: String(form.get("status") ?? "planned") as
          | "planned"
          | "in_progress"
          | "completed"
          | "delayed"
          | "cancelled",
        sortOrder: Number(form.get("sortOrder") ?? 1),
      });

      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess("مرحله جدید ثبت شد.");
      router.refresh();
      e.currentTarget.reset();
    });
  }

  if (projects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        پروژه‌ای برای ثبت گزارش وجود ندارد.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="max-w-md space-y-2">
        <Label htmlFor="project-select">پروژه</Label>
        <select
          id="project-select"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["update", "گزارش پیشرفت"],
            ["financial", "گزارش مالی"],
            ["milestone", "مرحله"],
          ] as const
        ).map(([id, label]) => (
          <Button
            key={id}
            type="button"
            variant={activeTab === id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(id)}
          >
            {label}
          </Button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-700">{success}</p>}

      {activeTab === "update" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">انتشار گزارش پیشرفت</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">خلاصه</Label>
                <Textarea id="summary" name="summary" required rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detailedNote">توضیح تکمیلی (اختیاری)</Label>
                <Textarea id="detailedNote" name="detailedNote" rows={3} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">وضعیت</Label>
                  <select
                    id="status"
                    name="status"
                    className="flex h-10 w-full rounded-md border px-3 text-sm"
                  >
                    <option value="normal">عادی</option>
                    <option value="important">مهم</option>
                    <option value="delayed">با تأخیر</option>
                    <option value="resolved">رفع‌شده</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">دسترسی</Label>
                  <select
                    id="visibility"
                    name="visibility"
                    className="flex h-10 w-full rounded-md border px-3 text-sm"
                  >
                    <option value="public">عمومی</option>
                    <option value="investor_only">فقط سرمایه‌گذاران</option>
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="publishedAt">تاریخ</Label>
                  <Input
                    id="publishedAt"
                    name="publishedAt"
                    type="date"
                    defaultValue={today}
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? "در حال ثبت…" : "انتشار گزارش"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === "financial" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">گزارش مالی پیش‌نویس</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFinancialSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="f-title">عنوان گزارش</Label>
                <Input id="f-title" name="title" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="periodStart">شروع دوره</Label>
                  <Input
                    id="periodStart"
                    name="periodStart"
                    type="date"
                    defaultValue={today}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodEnd">پایان دوره</Label>
                  <Input
                    id="periodEnd"
                    name="periodEnd"
                    type="date"
                    defaultValue={today}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="capitalAllocated">سرمایه تخصیص‌یافته (تومان)</Label>
                  <Input
                    id="capitalAllocated"
                    name="capitalAllocated"
                    type="number"
                    min={0}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costsRecorded">هزینه‌های ثبت‌شده</Label>
                  <Input
                    id="costsRecorded"
                    name="costsRecorded"
                    type="number"
                    min={0}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenueRecorded">درآمدهای ثبت‌شده</Label>
                  <Input
                    id="revenueRecorded"
                    name="revenueRecorded"
                    type="number"
                    min={0}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedCurrentResult">نتیجه برآوردی</Label>
                  <Input
                    id="estimatedCurrentResult"
                    name="estimatedCurrentResult"
                    type="number"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminNotes">یادداشت ادمین</Label>
                <Textarea id="adminNotes" name="adminNotes" rows={2} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="f-visibility">دسترسی</Label>
                  <select
                    id="f-visibility"
                    name="visibility"
                    className="flex h-10 w-full rounded-md border px-3 text-sm"
                  >
                    <option value="public">عمومی</option>
                    <option value="investor_only">فقط سرمایه‌گذاران</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="f-publishedAt">تاریخ انتشار</Label>
                  <Input
                    id="f-publishedAt"
                    name="publishedAt"
                    type="date"
                    defaultValue={today}
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-amber-800">
                ارقام پیش‌نویس هستند و تا تسویه نهایی ثبت نشده‌اند.
              </p>
              <Button type="submit" disabled={isPending}>
                {isPending ? "در حال ثبت…" : "ثبت گزارش مالی"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === "milestone" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ثبت مرحله</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMilestoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="m-title">عنوان مرحله</Label>
                <Input id="m-title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">توضیح</Label>
                <Textarea id="description" name="description" rows={2} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="status">وضعیت</Label>
                  <select
                    id="status"
                    name="status"
                    className="flex h-10 w-full rounded-md border px-3 text-sm"
                  >
                    <option value="planned">برنامه‌ریزی‌شده</option>
                    <option value="in_progress">در حال اجرا</option>
                    <option value="completed">تکمیل‌شده</option>
                    <option value="delayed">با تأخیر</option>
                    <option value="cancelled">لغوشده</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plannedDate">تاریخ برنامه</Label>
                  <Input id="plannedDate" name="plannedDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">ترتیب</Label>
                  <Input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    min={1}
                    defaultValue={1}
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? "در حال ثبت…" : "ثبت مرحله"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
