import type { Metadata } from "next";
import Link from "next/link";
import { getPublicProjectsArchive } from "@/lib/data/public-projects";
import { EnProjectCard } from "@/components/en/EnProjectCard";
import { EnRiskNote, EnSectionHeading } from "@/components/en/EnSection";
import { EN_PROJECT_RISK } from "@/components/en/en-copy";

export const metadata: Metadata = {
  title: "Archive of past projects",
  alternates: { languages: { fa: "/projects", en: "/en/projects" } },
};

const linkClass =
  "font-medium text-navy underline decoration-gold/50 underline-offset-4 hover:decoration-gold";

export default function EnglishProjectsPage() {
  const projects = getPublicProjectsArchive();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <EnSectionHeading
        as="h1"
        title="Archive of past projects"
        lead="This page is not where open opportunities are announced. It shows a selection of Avid’s past projects so you can see our track record. New opportunities are arranged through contact and introduction; companies that raised more than once appear here once, showing their latest project."
      />
      <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
        To compare projections with actual results, see the{" "}
        <Link href="/en/transparency" className={linkClass}>transparency page</Link>. To express your
        interest, <Link href="/en/contact" className={linkClass}>contact the Avid office</Link>.
      </p>

      <EnRiskNote title="Important risk warning" className="mt-10 max-w-3xl">
        {EN_PROJECT_RISK}
      </EnRiskNote>

      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <EnProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
