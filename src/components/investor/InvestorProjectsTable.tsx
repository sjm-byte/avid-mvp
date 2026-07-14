import Link from "next/link";
import {
  InvestorProjectRow,
  InvestorProjectLifecycle,
} from "@/lib/data/mock/investor-portfolio-mock";
import { cn, formatToman } from "@/lib/utils";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fa-IR");
}

function rowStyle(lifecycle: InvestorProjectLifecycle): string {
  switch (lifecycle) {
    case "active":
      return "border-r-4 border-r-blue-500 bg-blue-50/40";
    case "completed":
      return "border-r-4 border-r-amber-500 bg-amber-50/30";
    case "settled":
      return "border-r-4 border-r-emerald-600 bg-emerald-50/30";
  }
}

function lifecycleBadge(lifecycle: InvestorProjectLifecycle): string {
  switch (lifecycle) {
    case "active":
      return "bg-blue-100 text-blue-900";
    case "completed":
      return "bg-amber-100 text-amber-900";
    case "settled":
      return "bg-emerald-100 text-emerald-900";
  }
}

interface InvestorProjectsTableProps {
  projects: InvestorProjectRow[];
  compact?: boolean;
}

export function InvestorProjectsTable({
  projects,
  compact = false,
}: InvestorProjectsTableProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
        هنوز پروژه‌ای برای شما ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="hidden md:block">
        <div className="w-full min-w-0 overflow-hidden rounded-md border">
          <table className="w-full table-fixed border-collapse text-xs">
            <thead>
              <tr className="bg-muted/60 text-center">
                <th className="border-b px-2 py-2.5 font-medium">پروژه</th>
                <th className="border-b px-2 py-2.5 font-medium">مبلغ مشارکت</th>
                {!compact && (
                  <>
                    <th className="border-b px-2 py-2.5 font-medium">آورده جدید</th>
                    <th className="border-b px-2 py-2.5 font-medium">آورده قبلی</th>
                  </>
                )}
                <th className="border-b px-2 py-2.5 font-medium">تاریخ شروع</th>
                <th className="border-b px-2 py-2.5 font-medium">تاریخ پایان</th>
                <th className="border-b px-2 py-2.5 font-medium">موعد سود</th>
                <th className="border-b px-2 py-2.5 font-medium">وضعیت</th>
                <th className="border-b px-2 py-2.5 font-medium">نتیجه/تسویه</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className={cn("text-center align-middle", rowStyle(project.lifecycle))}
                >
                  <td className="border-b px-2 py-2.5 text-right font-medium leading-snug">
                    <Link
                      href={`/dashboard/projects/${project.slug}`}
                      className="hover:underline"
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="border-b px-2 py-2.5 whitespace-nowrap">
                    {formatToman(project.participationAmount)}
                  </td>
                  {!compact && (
                    <>
                      <td className="border-b px-2 py-2.5 whitespace-nowrap">
                        {formatToman(project.newCapital)}
                      </td>
                      <td className="border-b px-2 py-2.5 whitespace-nowrap">
                        {project.transferredFromPrevious > 0
                          ? formatToman(project.transferredFromPrevious)
                          : "—"}
                      </td>
                    </>
                  )}
                  <td className="border-b px-2 py-2.5 whitespace-nowrap">
                    {formatDate(project.startDate)}
                  </td>
                  <td className="border-b px-2 py-2.5 whitespace-nowrap">
                    {formatDate(project.endDate)}
                  </td>
                  <td className="border-b px-2 py-2.5 whitespace-nowrap">
                    {formatDate(project.profitDueDate)}
                  </td>
                  <td className="border-b px-2 py-2.5">
                    <span
                      className={cn(
                        "inline-block rounded px-2 py-0.5 text-[11px] font-medium",
                        lifecycleBadge(project.lifecycle),
                      )}
                    >
                      {project.statusLabel}
                    </span>
                  </td>
                  <td className="border-b px-2 py-2.5 text-[11px] leading-snug">
                    {project.lifecycle === "settled" &&
                    project.settlementAmount != null ? (
                      <span className="font-medium text-emerald-800">
                        {project.statusLabel}
                        <br />
                        تسویه شد / مبلغ واریزی:{" "}
                        {formatToman(project.settlementAmount)}
                      </span>
                    ) : project.lifecycle === "completed" ? (
                      <span className="text-amber-800">در انتظار تسویه</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {projects.map((project) => (
          <article
            key={project.id}
            className={cn("rounded-lg border p-4 text-sm", rowStyle(project.lifecycle))}
          >
            <Link
              href={`/dashboard/projects/${project.slug}`}
              className="font-medium hover:underline"
            >
              {project.title}
            </Link>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <div>
                <dt className="text-muted-foreground">مبلغ مشارکت</dt>
                <dd className="font-medium">
                  {formatToman(project.participationAmount)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">آورده جدید</dt>
                <dd>{formatToman(project.newCapital)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">آورده قبلی</dt>
                <dd>
                  {project.transferredFromPrevious > 0
                    ? formatToman(project.transferredFromPrevious)
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">تاریخ شروع</dt>
                <dd>{formatDate(project.startDate)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">تاریخ پایان</dt>
                <dd>{formatDate(project.endDate)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">موعد سود</dt>
                <dd>{formatDate(project.profitDueDate)}</dd>
              </div>
            </dl>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded px-2 py-0.5 text-[11px] font-medium",
                  lifecycleBadge(project.lifecycle),
                )}
              >
                {project.statusLabel}
              </span>
              {project.lifecycle === "settled" &&
                project.settlementAmount != null && (
                  <span className="text-[11px] font-medium text-emerald-800">
                    {project.statusLabel} — تسویه شد / مبلغ واریزی:{" "}
                    {formatToman(project.settlementAmount)}
                  </span>
                )}
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-blue-500" />
          فعال
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-amber-500" />
          پایان‌یافته
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-emerald-600" />
          تسویه‌شده
        </span>
      </div>
    </div>
  );
}
