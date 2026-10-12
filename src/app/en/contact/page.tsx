import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { EnSectionHeading } from "@/components/en/EnSection";
import { EnConsultationForm } from "@/components/en/EnConsultationForm";
import { EN_COMPANY } from "@/components/en/en-company";
import { companyEmail, companyPhoneTel } from "@/lib/company-contact";
import { MobilePublicPageShell, MobileSurface } from "@/components/layout/mobile/MobilePublicPageShell";
import { EnMobilePhoneCapture } from "@/components/en/mobile/EnMobilePhoneCapture";

export const metadata: Metadata = {
  title: "Contact us",
  alternates: { languages: { fa: "/contact", en: "/en/contact" } },
};

export default function EnglishContactPage() {
  const items = [
    {
      icon: Phone,
      label: "Telephone",
      value: (
        <a href={`tel:+98${companyPhoneTel.slice(1)}`} className="hover:text-gold">
          {EN_COMPANY.phone}
        </a>
      ),
    },
    {
      icon: Mail,
      label: "Email",
      value: (
        <a href={`mailto:${companyEmail}`} className="hover:text-gold">
          {companyEmail}
        </a>
      ),
    },
    { icon: MapPin, label: "Office address", value: <address className="not-italic">{EN_COMPANY.address}</address> },
  ];

  const lead =
    "For questions about the participation model, project risks, or to arrange expressing your interest, get in touch with the Avid office.";

  return (
    <>
    <div className="md:hidden">
      <MobilePublicPageShell title="Contact us" lead={lead}>
        <MobileSurface>
          <h2 className="font-display text-xl font-bold text-white">Head office</h2>
          <ul className="mt-3 space-y-4">
            {items.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#7B60A1]/25 text-[#C9B4DE]">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-white/55">{label}</p>
                  <div className="mt-0.5 text-[15px] font-medium text-[#E8DCF5]">{value}</div>
                </div>
              </li>
            ))}
          </ul>
        </MobileSurface>
        <EnMobilePhoneCapture />
      </MobilePublicPageShell>
    </div>
    <div className="mx-auto hidden max-w-6xl px-4 py-16 sm:px-6 md:block md:py-20">
      <EnSectionHeading
        as="h1"
        title="Contact us"
        lead="For questions about the participation model, project risks, or to arrange expressing your interest, get in touch with the Avid office."
      />

      <div className="mt-14 grid max-w-5xl gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <section aria-labelledby="office-heading">
          <h2 id="office-heading" className="text-3xl text-navy">Head office</h2>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {items.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex gap-4 py-5">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold">
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <div className="mt-0.5 text-[1.0625rem] font-medium text-navy">{value}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <EnConsultationForm id="contact-consultation" />
      </div>
    </div>
    </>
  );
}
