import type { Metadata } from "next";
import { EnSectionHeading } from "@/components/en/EnSection";
import { EnFaqList } from "@/components/en/EnFaqList";
import { EN_FAQ } from "@/components/en/en-faq";
import { MobilePublicPageShell, MobileSurface } from "@/components/layout/mobile/MobilePublicPageShell";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  alternates: { languages: { fa: "/faq", en: "/en/faq" } },
};

const LEAD =
  "Answers to common questions about Avid’s model, where funds go, projected returns and how to take part.";

export default function EnglishFaqPage() {
  return (
    <>
    <div className="md:hidden">
      <MobilePublicPageShell title="Frequently asked questions" lead={LEAD}>
        {EN_FAQ.map((item, i) => (
          <MobileSurface key={item.q}>
            <h2 className="flex gap-2 font-en text-base font-semibold leading-snug text-white">
              <span className="text-[#C9B4DE]">{i + 1}</span>
              {item.q}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{item.a}</p>
          </MobileSurface>
        ))}
      </MobilePublicPageShell>
    </div>
    <div className="mx-auto hidden max-w-6xl px-4 py-16 sm:px-6 md:block md:py-20">
      <EnSectionHeading
        as="h1"
        title="Frequently asked questions"
        lead={LEAD}
      />
      <div className="mt-12">
        <EnFaqList items={EN_FAQ} />
      </div>
    </div>
    </>
  );
}
