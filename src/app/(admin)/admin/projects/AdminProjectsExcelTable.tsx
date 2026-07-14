"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn, formatPercent, formatToman } from "@/lib/utils";
import {
  AdminProjectTableRow,
} from "@/lib/data/admin-project-table";

type SortField = "startDate" | "endDate";
type SortDirection = "asc" | "desc";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fa-IR");
}

function compareDates(
  a: string | null,
  b: string | null,
  direction: SortDirection,
): number {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  const diff = new Date(a).getTime() - new Date(b).getTime();
  return direction === "asc" ? diff : -diff;
}

function SortableHeader({
  label,
  field,
  activeField,
  direction,
  onSort,
}: {
  label: string;
  field: SortField;
  activeField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const isActive = activeField === field;
  const Icon = !isActive ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="mx-auto flex items-center justify-center gap-1 font-medium hover:text-foreground"
    >
      <span>{label}</span>
      <Icon className="size-3.5 shrink-0 opacity-70" aria-hidden />
    </button>
  );
}

function StackedCell({ children }: { children: React.ReactNode[] }) {
  return (
    <ul className="divide-y divide-border/80">
      {children.map((child, i) => (
        <li
          key={i}
          className="flex min-h-[2rem] items-center justify-center px-1 py-1.5 text-center leading-snug"
        >
          {child}
        </li>
      ))}
    </ul>
  );
}

const cellClass = "border border-border px-2 py-2 text-center align-middle";
const headerClass =
  "border border-border px-2 py-2 text-center align-middle font-medium";

interface AdminProjectsExcelTableProps {
  rows: AdminProjectTableRow[];
}

export function AdminProjectsExcelTable({ rows }: AdminProjectsExcelTableProps) {
  const [sortField, setSortField] = useState<SortField>("startDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) =>
      compareDates(a[sortField], b[sortField], sortDirection),
    );
  }, [rows, sortField, sortDirection]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection("desc");
  }

  return (
    <div className="space-y-3">
      <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-sm border border-border shadow-sm">
        <table className="w-full min-w-[1100px] border-collapse text-xs">
          <thead>
            <tr className="bg-muted/70">
              <th className={headerClass}>پروژه</th>
              <th className={cn(headerClass, "whitespace-nowrap")}>سرمایه کل</th>
              <th className={headerClass}>سرمایه‌گذاران</th>
              <th className={headerClass}>مبالغ سرمایه‌گذاران</th>
              <th className={headerClass}>
                <SortableHeader
                  label="تاریخ شروع"
                  field="startDate"
                  activeField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className={headerClass}>
                <SortableHeader
                  label="تاریخ پایان"
                  field="endDate"
                  activeField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className={cn(headerClass, "whitespace-nowrap")}>بازده ماهانه</th>
              <th className={headerClass}>وثیقه</th>
              <th className={cn(headerClass, "whitespace-nowrap")}>کارمزد</th>
              <th className={headerClass}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, index) => (
              <tr
                key={row.id}
                className={cn(
                  index % 2 === 0 ? "bg-background" : "bg-muted/20",
                )}
              >
                <td className={cn(cellClass, "font-medium leading-relaxed")}>
                  <div>{row.title}</div>
                  <div className="mt-1 text-[10px] font-normal text-muted-foreground">
                    {row.lifecycle === "active"
                      ? "فعال"
                      : row.lifecycle === "completed"
                        ? "پایان‌یافته"
                        : "تسویه‌شده"}
                  </div>
                </td>
                <td className={cn(cellClass, "whitespace-nowrap")}>
                  {formatToman(row.totalCapital)}
                </td>
                <td className={cn(cellClass, "p-0")}>
                  <StackedCell>{row.investors.map((name) => name)}</StackedCell>
                </td>
                <td className={cn(cellClass, "p-0")}>
                  <StackedCell>
                    {row.investors.map((name, i) => (
                      <span
                        key={`${row.id}-${name}`}
                        className="whitespace-nowrap"
                      >
                        {formatToman(row.investorAmounts[i] ?? 0)}
                      </span>
                    ))}
                  </StackedCell>
                </td>
                <td className={cn(cellClass, "whitespace-nowrap")}>
                  {formatDate(row.startDate)}
                </td>
                <td className={cn(cellClass, "whitespace-nowrap")}>
                  {formatDate(row.endDate)}
                </td>
                <td className={cn(cellClass, "whitespace-nowrap")}>
                  {formatPercent(row.monthlyReturn)}
                </td>
                <td className={cn(cellClass, "leading-relaxed")}>
                  {row.collateral}
                </td>
                <td className={cellClass}>
                  <div className="space-y-1">
                    <div className="whitespace-nowrap">
                      {formatPercent(row.commissionPercent)}
                    </div>
                    <div className="text-[11px] leading-snug text-muted-foreground">
                      {row.commissionStatus}
                    </div>
                  </div>
                </td>
                <td className={cn(cellClass, "whitespace-nowrap")}>
                  <Link
                    href={`/admin/projects/${row.slug}`}
                    className="text-primary hover:underline"
                  >
                    مدیریت
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        بازده ماهانه عدد برآوردی است و سود قطعی یا تضمینی محسوب نمی‌شود.
      </p>
    </div>
  );
}
