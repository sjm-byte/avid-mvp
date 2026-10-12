import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PUBLIC_PROJECTS, getPublicProjectBySlug } from "@/lib/data/public-projects";
import { SafeProjectCoverImage } from "@/components/projects/SafeProjectCoverImage";
import { EN_PROJECTION_NOTE, EnRiskNote } from "@/components/en/EnSection";
import { EN_PROJECT_RISK } from "@/components/en/en-copy";
import { formatJalaliAsGregorian } from "@/lib/i18n/dates";
import {
  durationEn,
  formatTomanEn,
  predictedReturnEn,
  projectActivityEn,
  projectNameEn,
} from "@/lib/i18n/en-projects";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PUBLIC_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getPublicProjectBySlug(slug);
  if (!project) return {};
  return {
    title: projectNameEn(project),
    alternates: { languages: { fa: `/projects/${slug}`, en: `/en/projects/${slug}` } },
  };
}

export default async function EnglishProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getPublicProjectBySlug(slug);
  if (!project) notFound();

  const name = projectNameEn(project);
  const activity = projectActivityEn(project);
  const start = formatJalaliAsGregorian(project.startDate);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <div className="grid gap-12 border-b border-border pb-14 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
        <div className="min-w-0">
          <SafeProjectCoverImage
            src={project.image}
            alt={name}
            aspectClassName="aspect-[21/9]"
            className="rounded-md"
          />
          <p className="mt-8 text-sm font-medium text-gold">Past project in the public archive</p>
          <h1 className="mt-2 text-[2.5rem] leading-[1.08] text-navy sm:text-5xl">{name}</h1>
          <p className="mt-2 text-[1.0625rem] text-muted-foreground">{activity}</p>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            This page is not an open offer to the public. Details of this past project are shown so
            you can get to know Avid’s track record. New opportunities are arranged through contact
            and introduction.
          </p>
        </div>

        <aside className="self-start border-t-2 border-gold/60 bg-card p-6" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="text-2xl text-navy">Project summary</h2>
          <dl className="mt-4 divide-y divide-border text-[0.95rem] tabular">
            {[
              ["Amount", formatTomanEn(project.amount)],
              ["Start date", start],
              ["Term", durationEn(project)],
              ["Projected return", predictedReturnEn(project)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-amber-900">{EN_PROJECTION_NOTE}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            New opportunities and payments are arranged outside the platform. Avid does not receive
            any funds.
          </p>
          <div className="mt-6 grid gap-2.5">
            <Link
              href="/en/contact"
              className="inline-flex h-11 items-center justify-center rounded-md bg-navy text-[0.95rem] font-semibold text-white hover:bg-navy-light"
            >
              Express interest / contact
            </Link>
            <Link
              href="/en/transparency"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border text-[0.95rem] font-semibold text-navy hover:border-gold"
            >
              See transparency and results
            </Link>
          </div>
        </aside>
      </div>

      <div className="mt-12 max-w-3xl space-y-12">
        <EnRiskNote title="Important risk warning">{EN_PROJECT_RISK}</EnRiskNote>

        <section>
          <h2 className="text-3xl text-navy">About this project</h2>
          <p className="mt-4 leading-relaxed">
            {name}: {activity.charAt(0).toLowerCase() + activity.slice(1)}. Project amount{" "}
            {formatTomanEn(project.amount)}, starting {start}, for a term of {durationEn(project)}.
          </p>
          <p className="mt-3 text-[0.95rem] text-muted-foreground">
            A detailed description of this project will be added soon.
          </p>
        </section>

        <section>
          <h2 className="text-3xl text-navy">Documents</h2>
          <p className="mt-4 border border-dashed border-border px-5 py-6 text-[0.95rem] text-muted-foreground">
            Public documents for this project will be published soon.
          </p>
        </section>

        <section>
          <h2 className="text-3xl text-navy">Reports</h2>
          <p className="mt-4 border border-dashed border-border px-5 py-6 text-[0.95rem] text-muted-foreground">
            Public progress and financial reports will be added to this section soon.
          </p>
        </section>
      </div>
    </div>
  );
}
