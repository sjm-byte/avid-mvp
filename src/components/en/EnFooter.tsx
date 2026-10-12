import Link from "next/link";
import { AvidLogo } from "@/components/brand/AvidLogo";
import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { companyEmail, companyPhoneTel } from "@/lib/company-contact";
import { EN_COMPANY } from "@/components/en/en-company";

export function EnFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1.4fr]">
          <div>
            <AvidLogo href="/en" imageClassName="h-11 w-auto" />
            <p className="mt-4 max-w-xs font-display text-xl italic leading-snug text-white/80">
              A platform for taking part in the real economy.
            </p>
          </div>

          <div>
            <h2 className="font-en text-sm font-semibold text-gold">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-[0.95rem] text-white/75">
              <li><Link href="/en/projects" className="hover:text-white">Project archive</Link></li>
              <li><Link href="/en/transparency" className="hover:text-white">Transparency</Link></li>
              <li><Link href="/en/about" className="hover:text-white">About Avid</Link></li>
              <li><Link href="/en/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/en/contact" className="hover:text-white">Contact us</Link></li>
              <li>
                <LanguageSwitch
                  current="en"
                  variant="text"
                  className="inline-flex items-center gap-1.5 text-white/75"
                />
              </li>
            </ul>
          </div>

          <div className="text-[0.95rem] text-white/75">
            <h2 className="font-en text-sm font-semibold text-gold">Head office</h2>
            <address className="mt-4 space-y-2.5 not-italic">
              <p>{EN_COMPANY.address}</p>
              <p>
                <a href={`tel:+98${companyPhoneTel.slice(1)}`} className="text-white hover:text-gold">
                  {EN_COMPANY.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${companyEmail}`} className="text-white hover:text-gold">
                  {companyEmail}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
          © {new Date().getFullYear()} {EN_COMPANY.legalName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
