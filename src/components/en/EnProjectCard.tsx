import Link from "next/link";
import type { PublicProject } from "@/lib/data/public-projects";
import { SafeProjectCoverImage } from "@/components/projects/SafeProjectCoverImage";
import { formatJalaliAsGregorian } from "@/lib/i18n/dates";
import {
  durationEn,
  formatTomanEn,
  predictedReturnEn,
  projectActivityEn,
  projectNameEn,
} from "@/lib/i18n/en-projects";
import { EN_PROJECTION_NOTE } from "@/components/en/EnSection";

export function EnProjectCard({ project }: { project: PublicProject }) {
  const name = projectNameEn(project);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md border border-border bg-card">
      <SafeProjectCoverImage src={project.image} alt={name} aspectClassName="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[1.65rem] leading-tight text-navy">{name}</h3>
        <p className="mt-1.5 text-[0.95rem] leading-snug text-muted-foreground">
          {projectActivityEn(project)}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-border pt-5 text-[0.95rem] tabular">
          <div>
            <dt className="text-sm text-muted-foreground">Amount</dt>
            <dd className="mt-0.5 font-semibold">{formatTomanEn(project.amount)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Start date</dt>
            <dd className="mt-0.5 font-semibold">{formatJalaliAsGregorian(project.startDate)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Term</dt>
            <dd className="mt-0.5 font-semibold">{durationEn(project)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Projected return</dt>
            <dd className="mt-0.5 font-semibold">{predictedReturnEn(project)}</dd>
          </div>
        </dl>

        <p className="mt-5 text-sm leading-relaxed text-amber-900">{EN_PROJECTION_NOTE}</p>

        <Link
          href={`/en/projects/${project.slug}`}
          className="mt-auto inline-flex pt-6 text-sm font-semibold text-navy underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
        >
          View past project details
        </Link>
      </div>
    </article>
  );
}
