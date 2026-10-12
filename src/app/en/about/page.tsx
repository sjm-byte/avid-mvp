import type { Metadata } from "next";
import { EnRiskNote, EnSectionHeading } from "@/components/en/EnSection";
import { EN_COMPANY } from "@/components/en/en-company";
import { companyEmail } from "@/lib/company-contact";

export const metadata: Metadata = {
  title: "About Avid",
  alternates: { languages: { fa: "/about", en: "/en/about" } },
};

const PRINCIPLES = [
  "Each project is independent, and investors choose each project separately.",
  "Money is not held in Avid’s account; payment goes directly to the project’s account.",
  "Avid holds a contract with the investor and acts as the investor’s representative.",
  "The projected return is only a scenario and is not the project’s actual result.",
  "A project’s actual result is known only after it has been carried out and its financial report prepared.",
];

export default function EnglishAboutPage() {
  const rows: [string, React.ReactNode][] = [
    ["Registration number", EN_COMPANY.registrationNumber],
    ["National ID", EN_COMPANY.nationalId],
    ["Office address", EN_COMPANY.address],
    ["Telephone", EN_COMPANY.phone],
    [
      "Email",
      <a key="e" href={`mailto:${companyEmail}`} className="text-navy underline decoration-gold/50 underline-offset-4 hover:decoration-gold">
        {companyEmail}
      </a>,
    ],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <EnSectionHeading
        as="h1"
        title="About Avid"
        lead="Avid is a platform for managing participation in projects. Retail and mid-sized investors can review commercial and manufacturing projects, read the risks and terms of each one, and follow the status of their capital while the project runs."
      />

      <section className="mt-16">
        <h2 className="text-3xl text-navy">Legal identity</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The Avid platform operates under the following legal entity.
        </p>
        <div className="mt-6 max-w-3xl border-t-2 border-gold/60 bg-card">
          <p className="border-b border-border px-5 py-4 font-display text-2xl font-semibold text-navy">
            {EN_COMPANY.legalName}
          </p>
          <dl className="tabular">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1 border-b border-border px-5 py-3.5 last:border-b-0 sm:grid-cols-[12rem_1fr]"
              >
                <dt className="text-[0.95rem] text-muted-foreground">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl text-navy">Key principles</h2>
        <ol className="mt-6 max-w-3xl divide-y divide-border border-y border-border">
          {PRINCIPLES.map((text, i) => (
            <li key={text} className="flex gap-5 py-5">
              <span className="w-6 shrink-0 font-display text-2xl font-semibold leading-none text-gold [font-variant-numeric:lining-nums]">
                {i + 1}
              </span>
              <p className="leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <EnRiskNote className="mt-16 max-w-3xl">
        Investing in Avid projects carries risk. The projected return is only a scenario and is not
        the project’s actual result. Avid does not promise any participation amount or return.
      </EnRiskNote>
    </div>
  );
}
