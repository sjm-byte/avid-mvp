"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { PublicProject } from "@/lib/data/public-projects";
import { cn } from "@/lib/utils";
import {
  EN_TRANSPARENCY_SECTIONS,
  enTransparencyHref,
} from "@/components/en/EnTransparencyTeaser";
import {
  EnContractsPanel,
  EnHistoryPanel,
  EnMethodologyPanel,
} from "@/components/en/transparency/EnTransparencyPanels";

type SectionId = (typeof EN_TRANSPARENCY_SECTIONS)[number]["id"];

function isSection(v: string | null): v is SectionId {
  return v === "history" || v === "methodology" || v === "contracts";
}

export function EnTransparencyHub({ rows }: { rows: PublicProject[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("section");
  const active: SectionId = isSection(raw) ? raw : "history";

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 max-md:px-3 max-md:py-6">
      <header className="max-w-3xl max-md:rounded-2xl max-md:border max-md:border-[#1F1A2A]/10 max-md:bg-[#E4DEEE]/90 max-md:px-4 max-md:py-5">
        <h1 className="text-[2.5rem] leading-[1.08] text-navy sm:text-5xl md:text-[3.5rem] max-md:text-[2rem] max-md:font-bold max-md:text-[#1F1A2A]">
          Avid’s transparency page
        </h1>
        <span className="mt-4 block h-px w-12 bg-gold max-md:hidden" aria-hidden />
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground max-md:mt-3 max-md:text-sm">
          Review our track record and get to know the principles and working methods behind Avid’s
          approach to investment.
        </p>
      </header>

      <aside
        aria-label="Featured offer"
        className="mt-10 max-w-3xl border-l-2 border-gold bg-[hsl(43_60%_95%)] px-6 py-5 max-md:mt-5 max-md:rounded-2xl max-md:border max-md:border-[#C9A227]/55 max-md:bg-gradient-to-r max-md:from-[#FFF8E8] max-md:to-[#EFE0B8] max-md:px-4 max-md:py-4"
      >
        <p className="text-sm font-semibold text-[#6b5413]">Featured offer</p>
        <p className="mt-1.5 font-display text-[1.25rem] leading-snug text-[#2F2610] sm:text-[1.45rem]">
          Building a portfolio can lower risk and also help increase returns. By diversifying your
          portfolio, we can offer a mix of gold-based, dollar-based and rial-based returns.
        </p>
      </aside>

      <nav
        aria-label="Transparency sections"
        className="sticky top-16 z-30 -mx-4 mt-12 border-b border-border bg-background/95 px-4 backdrop-blur sm:top-[72px] sm:-mx-6 sm:px-6 max-md:mx-0 max-md:mt-4 max-md:rounded-2xl max-md:border max-md:border-[#1F1A2A]/12 max-md:bg-[#DDD6EA]/95 max-md:px-1"
      >
        <ol role="tablist" className="grid grid-cols-3 sm:flex sm:gap-1">
          {EN_TRANSPARENCY_SECTIONS.map((s, i) => {
            const selected = s.id === active;
            return (
              <li key={s.id} className="min-w-0">
                <button
                  type="button"
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${s.id}`}
                  onClick={() => router.replace(enTransparencyHref(s.id), { scroll: false })}
                  className={cn(
                    "relative flex h-full w-full flex-col items-start gap-0.5 px-2 py-3 text-left text-sm leading-tight transition-colors sm:flex-row sm:items-baseline sm:gap-2 sm:px-4 sm:py-4 sm:text-[0.95rem]",
                    selected
                      ? "font-semibold text-navy after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-gold sm:after:inset-x-4"
                      : "text-muted-foreground hover:text-navy",
                  )}
                >
                  <span className="font-display text-lg font-semibold text-gold [font-variant-numeric:lining-nums]">
                    {i + 1}
                  </span>
                  {s.title}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className={cn(
          "pt-12",
          // Phones: dark purple reading surface, as on the Persian mobile page.
          "max-md:mt-4 max-md:rounded-2xl max-md:bg-[#3A334C] max-md:px-4 max-md:py-6 max-md:text-[#F0EAF6]",
          "max-md:[&_.text-muted-foreground]:text-[#D2C8E0] max-md:[&_.text-navy]:text-[#F3EEF8] max-md:[&_.text-foreground]:text-[#F3EEF8]",
          "max-md:[&_.bg-card]:bg-white/10 max-md:[&_.border-border]:border-white/15 max-md:[&_.divide-border]:divide-white/15",
          "max-md:[&_.text-emerald-800]:text-emerald-300 max-md:[&_.text-emerald-700]:text-emerald-300",
        )}
      >
        {active === "history" && <EnHistoryPanel rows={rows} />}
        {active === "methodology" && <EnMethodologyPanel />}
        {active === "contracts" && <EnContractsPanel />}
      </div>
    </div>
  );
}
