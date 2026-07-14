import Link from "next/link";
import {
  ActiveProjectUpdateItem,
  SETTLEMENT_OUTLOOK_LABELS,
  SettlementOutlook,
  UpdateMediaKind,
} from "@/lib/data/mock/active-project-updates-mock";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, ImageIcon, Video } from "lucide-react";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fa-IR");
}

function outlookBadgeClass(outlook: SettlementOutlook): string {
  switch (outlook) {
    case "on_schedule":
      return "bg-emerald-100 text-emerald-900";
    case "possibly_earlier":
      return "bg-sky-100 text-sky-900";
    case "possibly_delayed":
      return "bg-amber-100 text-amber-900";
  }
}

function MediaPlaceholder({
  kind,
  label,
}: {
  kind: UpdateMediaKind;
  label: string;
}) {
  const Icon =
    kind === "image" ? ImageIcon : kind === "video" ? Video : FileText;

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-md border border-dashed bg-muted/40 px-3 py-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium">پیوست نمایشی</p>
        <p className="truncate text-[11px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

interface ActiveProjectUpdatesBoxProps {
  updates: ActiveProjectUpdateItem[];
}

export function ActiveProjectUpdatesBox({
  updates,
}: ActiveProjectUpdatesBoxProps) {
  return (
    <section className="min-w-0 max-w-full space-y-4">
      <div>
        <h2 className="text-lg font-semibold">آخرین وضعیت پروژه‌های فعال</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          گزارش‌های مدیریتی برای پروژه‌هایی که هنوز در حال اجرا هستند.
        </p>
      </div>

      {updates.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          در حال حاضر پروژه فعالی با به‌روزرسانی ثبت‌شده وجود ندارد.
        </div>
      ) : (
        <ul className="min-w-0 space-y-4">
          {updates.map((item) => (
            <li key={item.id} className="min-w-0">
              <Card className="min-w-0 overflow-hidden">
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
                    <CardTitle className="min-w-0 text-base font-semibold leading-snug">
                      <Link
                        href={`/dashboard/projects/${item.projectSlug}`}
                        className="hover:underline"
                      >
                        {item.projectName}
                      </Link>
                    </CardTitle>
                    <span
                      className={cn(
                        "shrink-0 rounded px-2 py-0.5 text-[11px] font-medium",
                        outlookBadgeClass(item.settlementOutlook),
                      )}
                    >
                      {SETTLEMENT_OUTLOOK_LABELS[item.settlementOutlook]}
                    </span>
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium leading-snug">
                      {item.updateTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      تاریخ به‌روزرسانی: {formatDate(item.updateDate)}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="min-w-0 space-y-3 text-sm">
                  <p className="leading-relaxed text-foreground/90">
                    {item.shortStatus}
                  </p>

                  <div className="rounded-md border bg-muted/30 p-3">
                    <p className="text-[11px] text-muted-foreground">
                      یادداشت مدیر برای سرمایه‌گذار
                    </p>
                    <p className="mt-1 text-xs leading-relaxed">
                      {item.adminNote}
                    </p>
                  </div>

                  {item.media && (
                    <MediaPlaceholder
                      kind={item.media.kind}
                      label={item.media.label}
                    />
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
