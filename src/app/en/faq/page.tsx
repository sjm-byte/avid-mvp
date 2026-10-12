import type { Metadata } from "next";
import { EnSectionHeading } from "@/components/en/EnSection";
import { EnFaqList } from "@/components/en/EnFaqList";
import { EN_FAQ } from "@/components/en/en-faq";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  alternates: { languages: { fa: "/faq", en: "/en/faq" } },
};

export default function EnglishFaqPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <EnSectionHeading
        as="h1"
        title="Frequently asked questions"
        lead="Answers to common questions about Avid’s model, where funds go, projected returns and how to take part."
      />
      <div className="mt-12">
        <EnFaqList items={EN_FAQ} />
      </div>
    </div>
  );
}
