import Link from "next/link";
import { getFeaturedPublicProjects } from "@/lib/data/public-projects";
import { EnHero } from "@/components/en/EnHero";
import { EnStats } from "@/components/en/EnStats";
import { EnTransparencyTeaser } from "@/components/en/EnTransparencyTeaser";
import { EnProjectCard } from "@/components/en/EnProjectCard";
import { EnParticipationPath } from "@/components/en/EnParticipationPath";
import { EnFaqList } from "@/components/en/EnFaqList";
import { EnSectionHeading } from "@/components/en/EnSection";
import { EN_FAQ_HOME } from "@/components/en/en-faq";

export default function EnglishHomePage() {
  const projects = getFeaturedPublicProjects(3);

  return (
    <>
      <EnHero />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
        <EnSectionHeading
          title="Avid’s performance at a glance"
          lead="Avid publishes the results of completed projects so you can compare projections with what actually happened."
        />
        <div className="mt-12">
          <EnStats />
        </div>
      </section>

      <section className="bg-card py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <EnSectionHeading title="Before you take part, read the transparency page" />
          <div className="mt-12">
            <EnTransparencyTeaser />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <EnSectionHeading
            title="Examples of past projects"
            lead="This is an archive of our track record, not a list of open opportunities. New opportunities are arranged by contacting the office."
          />
          <Link
            href="/en/projects"
            className="shrink-0 text-[0.95rem] font-semibold text-navy underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
          >
            View the full archive
          </Link>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <EnProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-[hsl(222_30%_95%)] py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <EnSectionHeading title="How to take part with Avid" />
          <div className="mt-14">
            <EnParticipationPath />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
        <EnSectionHeading title="Frequently asked questions" />
        <div className="mt-10">
          <EnFaqList items={EN_FAQ_HOME} />
        </div>
        <Link
          href="/en/faq"
          className="mt-8 inline-block text-[0.95rem] font-semibold text-navy underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
        >
          All questions
        </Link>
      </section>
    </>
  );
}
