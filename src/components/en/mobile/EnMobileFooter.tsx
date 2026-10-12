import Link from "next/link";
import { AvidLogo } from "@/components/brand/AvidLogo";
import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { companyEmail, companyPhoneTel } from "@/lib/company-contact";
import { EN_COMPANY } from "@/components/en/en-company";

const LINKS = [
  { href: "/en/transparency", label: "Transparency" },
  { href: "/en/projects", label: "Project archive" },
  { href: "/en/about", label: "About Avid" },
  { href: "/en/faq", label: "FAQ" },
  { href: "/en/contact", label: "Contact us" },
];

export function EnMobileFooter() {
  return (
    <footer
      className="border-t border-white/15 text-white"
      style={{
        backgroundImage:
          "radial-gradient(80% 60% at 100% 0%, rgba(148,108,185,0.32), transparent 55%), linear-gradient(165deg, #241833 0%, #18141f 70%)",
      }}
    >
      <div className="px-4 py-10">
        <AvidLogo href="/en" imageClassName="h-11 w-auto" />
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          A platform for taking part in the real economy.
        </p>

        <nav className="mt-8" aria-label="Quick links">
          <p className="text-xs font-semibold text-yas-purple-soft">Quick links</p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-xl bg-white/5 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <LanguageSwitch
                current="en"
                variant="text"
                className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              />
            </li>
          </ul>
        </nav>

        <div className="mt-8 space-y-2 text-sm text-white/65">
          <p className="font-semibold text-yas-purple-soft">Head office</p>
          <a href={`tel:+98${companyPhoneTel.slice(1)}`} className="block text-white">
            {EN_COMPANY.phone}
          </a>
          <a href={`mailto:${companyEmail}`} className="block text-white">
            {companyEmail}
          </a>
          <p className="leading-relaxed">{EN_COMPANY.address}</p>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 text-center text-[11px] text-white/45">
          © {new Date().getFullYear()} {EN_COMPANY.legalName}
        </p>
      </div>
    </footer>
  );
}
