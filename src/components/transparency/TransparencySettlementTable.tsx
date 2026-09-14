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

function shortSettlementLabel(
  outcome: ReturnType<typeof getSettlementOutcome>,
): string {
  if (!outcome) return "در جریان";
  return (
    SETTLEMENT_OUTCOME_COLUMNS.find((col) => col.key === outcome)?.label ??
    "تسویه شده"
  );
}

/** Compact 3-column row list for mobile — closer to a table than stacked cards. */
function TransparencySettlementMobileTable({
  rows,
}: {
  rows: PublicProject[];
}) {
  return (
    <div
      className="md:hidden overflow-hidden rounded-xl border border-white/15 bg-white/[0.06]"
      role="table"
      aria-label="خلاصه وضعیت تسویه طرح‌ها"
    >
      <div
        className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)_minmax(0,1fr)] border-b border-white/15 bg-white/[0.08] px-3 py-2.5 text-[11px] font-semibold text-[#E8E0F2]"
        role="row"
      >
        <div role="columnheader">طرح</div>
        <div className="text-center" role="columnheader">
          بازه
        </div>
        <div className="text-center" role="columnheader">
          تسویه
        </div>
      </div>

      <ul className="max-h-[min(62vh,28rem)] overflow-y-auto overscroll-contain">
        {rows.map((project, index) => {
          const outcome = getSettlementOutcome(project.id);
          const endDate = getProjectEndDate(project);
          const note = getTransparencyNote(project.id);
          const settled = Boolean(outcome);
          const settlementText = shortSettlementLabel(outcome);
          const startLabel = formatJalaliDateDisplay(project.startDate);
          const endLabel = endDate ? formatJalaliDateDisplay(endDate) : "—";

          return (
            <li
              key={project.id}
              className="border-b border-white/10 last:border-b-0"
              role="row"
            >
              <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)_minmax(0,1fr)] items-stretch gap-0 px-3 py-3">
                <div className="min-w-0 pe-2" role="cell">
                  <p className="text-[10px] tabular-nums text-[#B9ADC8]">
                    {toPersianDigits(index + 1)}
                  </p>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="mt-0.5 block text-[13px] font-semibold leading-snug text-[#F8F4FC] hover:text-[#E8DCF5] hover:underline"
                  >
                    {project.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-[#C8BCD8]">
                    {project.activity}
                  </p>
                  {note ? (
                    <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-[#D4AF37]/85">
                      {note}
                    </p>
                  ) : null}
                </div>

                <div
                  className="flex flex-col items-center justify-center border-x border-white/10 px-1.5 text-center"
                  role="cell"
                >
                  <p className="text-[11px] font-medium tabular-nums leading-snug text-[#F0EAF6]" dir="ltr">
                    {startLabel}
                  </p>
                  <span className="my-1 text-[10px] text-[#9E92B4]" aria-hidden>
                    ↓
                  </span>
                  <p className="text-[11px] font-medium tabular-nums leading-snug text-[#F0EAF6]" dir="ltr">
                    {endLabel}
                  </p>
                </div>

                <div
                  className="flex flex-col items-center justify-center gap-1.5 ps-2 text-center"
                  role="cell"
                >
                  {settled ? (
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"
                      aria-hidden
                    >
                      <Check className="size-3.5" strokeWidth={2.5} />
                    </span>
                  ) : (
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full bg-[#9E92B4]/70"
                      aria-hidden
                    />
                  )}
                  <p className="text-[11px] font-medium leading-snug text-[#E8E0F2]">
                    {settlementText}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
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
      <TransparencySettlementMobileTable rows={rows} />

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
