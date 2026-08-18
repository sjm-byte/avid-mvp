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

export function TransparencySettlementTable({
  rows,
}: {
  rows: PublicProject[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="max-h-[min(70vh,40rem)] overflow-y-auto overflow-x-hidden">
        <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
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
          <thead className="sticky top-0 z-20 bg-muted shadow-[0_1px_0_0_hsl(var(--border))]">
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
        </table>
      </div>
    </div>
  );
}
