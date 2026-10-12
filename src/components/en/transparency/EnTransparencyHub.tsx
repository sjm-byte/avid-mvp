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
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <header className="max-w-3xl">
        <h1 className="text-[2.5rem] leading-[1.08] text-navy sm:text-5xl md:text-[3.5rem]">
          Avid’s transparency page
        </h1>
        <span className="mt-4 block h-px w-12 bg-gold" aria-hidden />
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground">
          Review our track record and get to know the principles and working methods behind Avid’s
          approach to investment.
        </p>
      </header>

      <aside
        aria-label="Featured offer"
        className="mt-10 max-w-3xl border-l-2 border-gold bg-[hsl(43_60%_95%)] px-6 py-5"
      >
        <p className="text-sm font-semibold text-[#6b5413]">Featured offer</p>
        <p className="mt-1.5 font-display text-[1.45rem] leading-snug text-[#2F2610]">
          Building a portfolio can lower risk and also help increase returns. By diversifying your
          portfolio, we can offer a mix of gold-based, dollar-based and rial-based returns.
        </p>
      </aside>

      <nav
        aria-label="Transparency sections"
        className="sticky top-16 z-30 -mx-4 mt-12 border-b border-border bg-background/95 px-4 backdrop-blur sm:top-[72px] sm:-mx-6 sm:px-6"
      >
        <ol role="tablist" className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {EN_TRANSPARENCY_SECTIONS.map((s, i) => {
            const selected = s.id === active;
            return (
              <li key={s.id} className="shrink-0">
                <button
                  type="button"
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${s.id}`}
                  onClick={() => router.replace(enTransparencyHref(s.id), { scroll: false })}
                  className={cn(
                    "relative flex items-baseline gap-2 px-3 py-4 text-[0.95rem] transition-colors sm:px-4",
                    selected
                      ? "font-semibold text-navy after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-gold sm:after:inset-x-4"
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
        className="pt-12"
      >
        {active === "history" && <EnHistoryPanel rows={rows} />}
        {active === "methodology" && <EnMethodologyPanel />}
        {active === "contracts" && <EnContractsPanel />}
      </div>
    </div>
  );
}
