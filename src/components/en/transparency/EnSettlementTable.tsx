import Link from "next/link";
import { Check } from "lucide-react";
import type { PublicProject } from "@/lib/data/public-projects";
import {
  SETTLEMENT_OUTCOME_COLUMNS,
  getProjectEndDate,
  getSettlementOutcome,
  type TransparencySettlementOutcome,
} from "@/lib/data/transparency-settlement-table";
import { formatJalaliAsGregorian } from "@/lib/i18n/dates";
import { projectActivityEn, projectNameEn } from "@/lib/i18n/en-projects";

const OUTCOME_EN: Record<TransparencySettlementOutcome, { label: string; hint: string }> = {
  on_time: { label: "On time", hint: "Settled on the due date" },
  delay_one_month: { label: "Up to 1 month late", hint: "Settled up to one month late" },
  delay_over_month_extra_profit: {
    label: "Late, with extra profit",
    hint: "Settled more than one month late, with additional profit",
  },
  delay_over_month_no_extra_profit: {
    label: "Late, no extra profit",
    hint: "Settled more than one month late, without additional profit",
  },
};

export function EnSettlementTable({ rows }: { rows: PublicProject[] }) {
  return (
    <>
      {/* Phones: one row per project, settlement as a short label. */}
      <ul className="divide-y divide-border border-y border-border md:hidden" aria-label="Settlement status by project">
        {rows.map((p, i) => {
          const outcome = getSettlementOutcome(p.id);
          return (
            <li key={p.id} className="grid grid-cols-[1.6rem_minmax(0,1fr)_auto] gap-x-3 py-4">
              <span className="pt-0.5 text-sm text-muted-foreground tabular">{i + 1}</span>
              <div className="min-w-0">
                <Link href={`/en/projects/${p.slug}`} className="font-semibold text-navy hover:underline">
                  {projectNameEn(p)}
                </Link>
                <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{projectActivityEn(p)}</p>
                <p className="mt-1.5 text-sm tabular">
                  {formatJalaliAsGregorian(p.startDate)} – {formatJalaliAsGregorian(getProjectEndDate(p))}
                </p>
              </div>
              <span className="pt-0.5 text-right text-sm">
                {outcome ? (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-800">
                    <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
                    {OUTCOME_EN[outcome].label}
                  </span>
                ) : (
                  <span className="text-muted-foreground">In progress</span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Tablet and up: full table with one column per settlement outcome. */}
      <div className="hidden overflow-x-auto border-y border-border md:block">
        <table className="w-full min-w-[860px] border-collapse text-left text-[0.9rem]">
          <caption className="sr-only">
            Past projects with start and end dates and how each was settled. Projects still running have no tick.
          </caption>
          <thead>
            <tr className="border-b border-border align-bottom text-sm text-muted-foreground">
              <th rowSpan={2} scope="col" className="w-10 py-3 pe-2 font-medium">#</th>
              <th rowSpan={2} scope="col" className="w-[13.5rem] py-3 pe-4 font-medium">Project</th>
              <th rowSpan={2} scope="col" className="py-3 pe-4 font-medium">Line of business</th>
              <th rowSpan={2} scope="col" className="whitespace-nowrap py-3 pe-4 font-medium">Start</th>
              <th rowSpan={2} scope="col" className="whitespace-nowrap py-3 pe-4 font-medium">End</th>
              <th
                colSpan={SETTLEMENT_OUTCOME_COLUMNS.length}
                scope="colgroup"
                className="border-b border-gold/50 bg-[hsl(222_30%_95%)] px-2 pb-2 pt-3 text-center font-semibold text-navy"
              >
                Settlement
              </th>
            </tr>
            <tr className="border-b border-border text-xs text-muted-foreground">
              {SETTLEMENT_OUTCOME_COLUMNS.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  title={OUTCOME_EN[c.key].hint}
                  className="w-[5.5rem] bg-[hsl(222_30%_95%)] px-2 py-2 text-center font-medium leading-tight"
                >
                  {OUTCOME_EN[c.key].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular">
            {rows.map((p, i) => {
              const outcome = getSettlementOutcome(p.id);
              return (
                <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-[hsl(43_54%_54%/0.05)]">
                  <td className="py-3 pe-2 text-muted-foreground">{i + 1}</td>
                  <td className="py-3 pe-4">
                    <Link href={`/en/projects/${p.slug}`} className="font-semibold text-navy hover:underline">
                      {projectNameEn(p)}
                    </Link>
                  </td>
                  <td className="py-3 pe-4 text-muted-foreground">{projectActivityEn(p)}</td>
                  <td className="whitespace-nowrap py-3 pe-4">{formatJalaliAsGregorian(p.startDate)}</td>
                  <td className="whitespace-nowrap py-3 pe-4">{formatJalaliAsGregorian(getProjectEndDate(p))}</td>
                  {SETTLEMENT_OUTCOME_COLUMNS.map((c) => (
                    <td key={c.key} className="bg-[hsl(222_30%_97%)] px-2 py-3 text-center">
                      {outcome === c.key ? (
                        <Check
                          className="mx-auto size-4 text-emerald-700"
                          strokeWidth={2.5}
                          aria-label={OUTCOME_EN[c.key].hint}
                        />
                      ) : (
                        <span className="sr-only">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
