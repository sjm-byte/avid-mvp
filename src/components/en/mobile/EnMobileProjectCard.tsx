import Link from "next/link";
import type { PublicProject } from "@/lib/data/public-projects";
import { SafeProjectCoverImage } from "@/components/projects/SafeProjectCoverImage";
import { EN_PROJECTION_NOTE } from "@/components/en/EnSection";
import { formatJalaliAsGregorian } from "@/lib/i18n/dates";
import {
  durationEn,
  formatTomanEn,
  predictedReturnEn,
  projectActivityEn,
  projectNameEn,
} from "@/lib/i18n/en-projects";

/** Dark project card used on the English mobile home page and archive. */
export function EnMobileProjectCard({ project }: { project: PublicProject }) {
  return (
    <Link
      href={`/en/projects/${project.slug}`}
      className="block overflow-hidden rounded-2xl border border-white/12 bg-[#242030]"
    >
      <SafeProjectCoverImage
        src={project.image}
        alt={projectNameEn(project)}
        aspectClassName="aspect-[5/3]"
        className="rounded-none border-b border-white/12"
      />
      <div className="p-4">
        <h3 className="font-display text-xl font-bold leading-snug text-white">{projectNameEn(project)}</h3>
        <p className="mt-1 text-xs text-white/55">{projectActivityEn(project)}</p>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/90">
          <div><dt className="text-white/45">Amount</dt><dd className="mt-0.5 font-semibold">{formatTomanEn(project.amount)}</dd></div>
          <div><dt className="text-white/45">Start</dt><dd className="mt-0.5 font-semibold">{formatJalaliAsGregorian(project.startDate)}</dd></div>
          <div><dt className="text-white/45">Term</dt><dd className="mt-0.5 font-semibold">{durationEn(project)}</dd></div>
          <div><dt className="text-white/45">Projected return</dt><dd className="mt-0.5 font-semibold leading-snug">{predictedReturnEn(project)}</dd></div>
        </dl>
        <p className="mt-3 text-[11px] leading-relaxed text-amber-100/85">{EN_PROJECTION_NOTE}</p>
      </div>
    </Link>
  );
}
