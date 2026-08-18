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

function TickCell({
  checked,
  label,
}: {
  checked: boolean;
  label: string;
}) {
  return (
    <td className="bg-navy/[0.04] px-3 py-4 text-center align-middle">
      {checked ? (
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"
          aria-label={label}
          title={label}
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
        </span>
      ) : (
        <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/20" />
      )}
    </td>
  );
}

export function TransparencySettlementTable({
  rows,
}: {
  rows: PublicProject[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="w-full max-w-full min-w-0 overflow-x-auto">
        <table className="w-full min-w-[1240px] border-collapse text-sm">
          <thead>
            <tr className="bg-muted/30 text-right">
              <th
                rowSpan={2}
                className="w-12 border-b px-4 py-3 text-center align-middle text-xs font-semibold text-muted-foreground"
              >
                ردیف
              </th>
              <th
                rowSpan={2}
                className="min-w-[11rem] border-b px-4 py-3 align-middle text-xs font-semibold"
              >
                پروژه
              </th>
              <th
                rowSpan={2}
                className="min-w-[12rem] border-b px-4 py-3 align-middle text-xs font-semibold"
              >
                موضوع فعالیت
              </th>
              <th
                rowSpan={2}
                className="min-w-[7.5rem] whitespace-nowrap border-b px-4 py-3 text-center align-middle text-xs font-semibold"
              >
                تاریخ شروع
              </th>
              <th
                rowSpan={2}
                className="min-w-[7.5rem] whitespace-nowrap border-b px-4 py-3 text-center align-middle text-xs font-semibold"
              >
                تاریخ پایان
              </th>
              <th
                colSpan={SETTLEMENT_OUTCOME_COLUMNS.length}
                className="border-b border-r border-l border-navy/10 bg-navy/10 px-3 py-3 text-center align-middle text-xs font-semibold text-navy"
              >
                وضعیت تسویه پروژه
              </th>
              <th
                rowSpan={2}
                className="min-w-[12rem] border-b px-4 py-3 align-middle text-xs font-semibold"
              >
                توضیحات
              </th>
            </tr>
            <tr className="border-b text-right">
              {SETTLEMENT_OUTCOME_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  title={col.hint}
                  className="min-w-[8.5rem] bg-navy/[0.06] px-3 py-2.5 text-center text-[11px] font-medium leading-5 text-navy/80"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((project, index) => {
              const outcome = getSettlementOutcome(project.id);
              const endDate = getProjectEndDate(project);
              const note = getTransparencyNote(project.id);
              return (
                <tr
                  key={project.id}
                  className="border-b last:border-b-0 odd:bg-background even:bg-muted/20 hover:bg-muted/40"
                >
                  <td className="px-4 py-4 text-center align-middle tabular-nums text-muted-foreground">
                    {toPersianDigits(index + 1)}
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="font-semibold leading-snug text-foreground hover:text-primary hover:underline"
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-4 py-4 align-middle leading-6 text-muted-foreground">
                    {project.activity}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center align-middle tabular-nums">
                    {formatJalaliDateDisplay(project.startDate)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center align-middle tabular-nums">
                    {endDate ? formatJalaliDateDisplay(endDate) : "—"}
                  </td>
                  {SETTLEMENT_OUTCOME_COLUMNS.map((col) => (
                    <TickCell
                      key={col.key}
                      checked={outcome === col.key}
                      label={col.hint}
                    />
                  ))}
                  <td className="max-w-[16rem] px-4 py-4 align-middle text-xs leading-6 text-muted-foreground">
                    {note || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
