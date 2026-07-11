import { ProjectMilestoneRow } from "@/types/database";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react";

const STATUS_ICONS = {
  done: CheckCircle2,
  in_progress: Clock,
  planned: Circle,
  delayed: Clock,
  cancelled: XCircle,
} as const;

const STATUS_COLORS = {
  done: "text-emerald-600",
  in_progress: "text-blue-600",
  planned: "text-muted-foreground",
  delayed: "text-orange-600",
  cancelled: "text-red-500",
} as const;

interface ProjectTimelineProps {
  milestones: ProjectMilestoneRow[];
  className?: string;
}

export function ProjectTimeline({ milestones, className }: ProjectTimelineProps) {
  if (milestones.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        زمان‌بندی این پروژه هنوز ثبت نشده است.
      </p>
    );
  }

  const sorted = [...milestones].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <ol className={cn("space-y-0", className)}>
      {sorted.map((milestone, index) => {
        const Icon = STATUS_ICONS[milestone.status] ?? Circle;
        const isLast = index === sorted.length - 1;

        return (
          <li key={milestone.id} className="relative flex gap-4 pb-6">
            {!isLast && (
              <span
                className="absolute right-[11px] top-6 h-full w-px bg-border"
                aria-hidden
              />
            )}
            <div className="relative z-10 mt-0.5">
              <Icon
                className={cn("h-5 w-5", STATUS_COLORS[milestone.status])}
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{milestone.title}</p>
              {milestone.description && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {milestone.description}
                </p>
              )}
              {milestone.planned_date && (
                <p className="mt-1 text-xs text-muted-foreground">
                  برنامه:{" "}
                  {new Date(milestone.planned_date).toLocaleDateString("fa-IR")}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
