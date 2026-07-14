import Link from "next/link";
import { PublicProject } from "@/lib/data/public-projects";
import { formatJalaliDateDisplay, formatPersianNumber } from "@/lib/utils";
import { SafeProjectCoverImage } from "@/components/projects/SafeProjectCoverImage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatAmountToman(amount: number): string {
  return `${formatPersianNumber(amount)} تومان`;
}

interface PublicProjectCardProps {
  project: PublicProject;
}

export function PublicProjectCard({ project }: PublicProjectCardProps) {
  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden transition-shadow hover:shadow-md">
      <SafeProjectCoverImage
        src={project.image}
        alt={project.title}
        className="rounded-none border-b"
      />
      <CardHeader className="space-y-2 pb-3">
        <CardTitle className="text-lg font-semibold leading-snug">
          {project.title}
        </CardTitle>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.activity}
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pb-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">مبلغ طرح</p>
            <p className="font-semibold leading-snug">
              {formatAmountToman(project.amount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">تاریخ شروع</p>
            <p className="font-semibold" dir="ltr">
              {formatJalaliDateDisplay(project.startDate)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">مدت</p>
            <p className="font-semibold">{project.duration}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">بازده پیش‌بینی‌شده</p>
            <p className="font-semibold leading-snug">
              {project.predictedReturn.replace(/^بازده پیش‌بینی‌شده\s*/, "")}
            </p>
          </div>
        </div>

        <p className="rounded-md border border-amber-200 bg-amber-50/60 px-3 py-2 text-xs leading-relaxed text-amber-900">
          این عدد پیش‌بینی است و سود قطعی یا تضمینی محسوب نمی‌شود.
        </p>
      </CardContent>

      <CardFooter className="border-t bg-muted/20 pt-4">
        <Button asChild className="w-full" size="lg">
          <Link href={`/projects/${project.slug}`}>مشاهده جزئیات پروژه</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
