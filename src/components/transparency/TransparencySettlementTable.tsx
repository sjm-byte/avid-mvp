import Link from "next/link";
import { Check } from "lucide-react";
import {
  SETTLEMENT_OUTCOME_COLUMNS,
  getProjectEndDate,
  getSettlementOutcome,
  getTransparencyNote,
} from "@/lib/data/transparency-settlement-table";
import { formatJalaliDateDisplay, toPersianDigits } from "@/lib/utils";
import type { PublicProject } from "@/lib/data/public-projects";

const TABLE_COLGROUP = (
  <colgroup>
    <col className="w-[4%]" />
    <col className="w-[16%]" />
    <col className="w-[18%]" />
    <col className="w-[9%]" />
    <col className="w-[9%]" />
    <col className="w-[7%]" />
    <col className="w-[8%]" />
    <col className="w-[10%]" />
    <col className="w-[10%]" />
    <col className="w-[9%]" />
  </colgroup>
);

function SettlementTableHead() {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="bg-muted text-right">
        <th
          rowSpan={2}
          className="border-b bg-muted px-1 py-2 text-center align-middle text-[11px] font-semibold text-muted-foreground"
        >
          ردیف
        </th>
        <th
          rowSpan={2}
          className="border-b bg-muted px-2 py-2 align-middle text-[11px] font-semibold"
        >
          پروژه
        </th>
        <th
          rowSpan={2}
          className="border-b bg-muted px-2 py-2 align-middle text-[11px] font-semibold"
        >
          موضوع فعالیت
        </th>
        <th
          rowSpan={2}
          className="border-b bg-muted px-1 py-2 text-center align-middle text-[11px] font-semibold"
        >
          تاریخ شروع
        </th>
        <th
          rowSpan={2}
          className="border-b bg-muted px-1 py-2 text-center align-middle text-[11px] font-semibold"
        >
          تاریخ پایان
        </th>
        <th
          colSpan={SETTLEMENT_OUTCOME_COLUMNS.length}
          className="border-b border-navy/10 bg-[hsl(221_30%_90%)] px-1 py-2 text-center align-middle text-[11px] font-semibold text-navy"
        >
          وضعیت تسویه پروژه
        </th>
        <th
          rowSpan={2}
          className="border-b bg-muted px-2 py-2 align-middle text-[11px] font-semibold"
        >
          توضیحات
        </th>
      </tr>
      <tr className="border-b bg-muted text-right">
        {SETTLEMENT_OUTCOME_COLUMNS.map((col) => (
          <th
            key={col.key}
            title={col.hint}
            className="border-b bg-[hsl(221_25%_93%)] px-1 py-1.5 text-center text-[10px] font-medium leading-4 text-navy/80"
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TickCell({
  checked,
  label,
}: {
  checked: boolean;
  label: string;
}) {
  return (
    <td className="bg-navy/[0.04] px-1 py-2.5 text-center align-middle">
      {checked ? (
        <span
          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"
          aria-label={label}
          title={label}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
      ) : (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/25" />
      )}
    </td>
  );
}

function SettlementTableBody({ rows }: { rows: PublicProject[] }) {
  return (
    <tbody>
      {rows.map((project, index) => {
        const outcome = getSettlementOutcome(project.id);
        const endDate = getProjectEndDate(project);
        const note = getTransparencyNote(project.id);

        return (
          <tr
            key={project.id}
            className="border-b last:border-b-0 odd:bg-background even:bg-muted/20"
          >
            <td className="px-1 py-2.5 text-center align-middle text-xs tabular-nums text-muted-foreground">
              {toPersianDigits(index + 1)}
            </td>
            <td className="px-2 py-2.5 align-middle">
              <Link
                href={`/projects/${project.slug}`}
                className="text-xs font-semibold leading-5 text-foreground hover:text-primary hover:underline"
              >
                {project.title}
              </Link>
            </td>
            <td className="px-2 py-2.5 align-middle text-xs leading-5 text-muted-foreground">
              {project.activity}
            </td>
            <td className="px-1 py-2.5 text-center align-middle text-[11px] tabular-nums">
              {formatJalaliDateDisplay(project.startDate)}
            </td>
            <td className="px-1 py-2.5 text-center align-middle text-[11px] tabular-nums">
              {endDate ? formatJalaliDateDisplay(endDate) : "—"}
            </td>
            {SETTLEMENT_OUTCOME_COLUMNS.map((col) => (
              <TickCell
                key={col.key}
                checked={outcome === col.key}
                label={col.hint}
              />
            ))}
            <td className="px-2 py-2.5 align-middle text-[11px] leading-5 text-muted-foreground">
              {note || "—"}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}

function TransparencySettlementMobileCards({ rows }: { rows: PublicProject[] }) {
  return (
    <div className="space-y-3 md:hidden">
      {rows.map((project, index) => {
        const outcome = getSettlementOutcome(project.id);
        const endDate = getProjectEndDate(project);
        const note = getTransparencyNote(project.id);
        const outcomeLabel = SETTLEMENT_OUTCOME_COLUMNS.find(
          (col) => col.key === outcome,
        );

        return (
          <article
            key={project.id}
            className="rounded-lg border bg-card p-4 text-sm shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  ردیف {toPersianDigits(index + 1)}
                </p>
                <Link
                  href={`/projects/${project.slug}`}
                  className="mt-1 block font-semibold leading-snug hover:text-primary hover:underline"
                >
                  {project.title}
                </Link>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {project.activity}
                </p>
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <div>
                <dt className="text-muted-foreground">تاریخ شروع</dt>
                <dd className="font-medium">
                  {formatJalaliDateDisplay(project.startDate)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">تاریخ پایان</dt>
                <dd className="font-medium">
                  {endDate ? formatJalaliDateDisplay(endDate) : "—"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">وضعیت تسویه</dt>
                <dd className="mt-0.5 font-medium">
                  {outcomeLabel ? outcomeLabel.hint : "در جریان — بدون تیک"}
                </dd>
              </div>
              {note ? (
                <div className="col-span-2">
                  <dt className="text-muted-foreground">توضیحات</dt>
                  <dd className="mt-0.5 leading-relaxed">{note}</dd>
                </div>
              ) : null}
            </dl>
          </article>
        );
      })}
    </div>
  );
}

export function TransparencySettlementTable({
  rows,
}: {
  rows: PublicProject[];
}) {
  return (
    <>
      <TransparencySettlementMobileCards rows={rows} />

      <div className="hidden overflow-hidden rounded-xl border bg-card shadow-sm md:block">
        <div className="w-full min-w-0 overflow-x-auto">
          <div
            dir="ltr"
            className="max-h-[min(55vh,28rem)] min-w-[720px] overflow-y-auto overscroll-contain"
            aria-label="ردیف‌های جدول وضعیت تسویه"
          >
            <table dir="rtl" className="w-full table-fixed border-separate border-spacing-0 text-sm">
              {TABLE_COLGROUP}
              <SettlementTableHead />
              <SettlementTableBody rows={rows} />
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
