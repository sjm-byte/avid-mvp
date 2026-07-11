import {
  PROJECT_UPDATE_TYPE_LABELS,
  ProjectUpdateRecord,
  REPORT_VISIBILITY_LABELS,
  UPDATE_STATUS_LABELS,
} from "@/types/project-report";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  normal: "bg-emerald-50 text-emerald-800",
  important: "bg-amber-50 text-amber-800",
  delayed: "bg-orange-50 text-orange-800",
  resolved: "bg-blue-50 text-blue-800",
} as const;

interface ProjectUpdatesListProps {
  updates: ProjectUpdateRecord[];
  showVisibility?: boolean;
  emptyMessage?: string;
}

export function ProjectUpdatesList({
  updates,
  showVisibility = false,
  emptyMessage = "هنوز گزارشی منتشر نشده است.",
}: ProjectUpdatesListProps) {
  if (updates.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-4">
      {updates.map((update) => (
        <li key={update.id} className="rounded-md border p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-medium">{update.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {update.summary}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-muted px-2 py-0.5">
                {PROJECT_UPDATE_TYPE_LABELS[update.updateType]}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5",
                  STATUS_STYLES[update.operationalStatus]
                )}
              >
                {UPDATE_STATUS_LABELS[update.operationalStatus]}
              </span>
              {showVisibility && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                  {REPORT_VISIBILITY_LABELS[update.visibility]}
                </span>
              )}
            </div>
          </div>
          {update.detailedNote && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {update.detailedNote}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {new Date(update.publishedAt).toLocaleDateString("fa-IR")}
          </p>
        </li>
      ))}
    </ul>
  );
}
