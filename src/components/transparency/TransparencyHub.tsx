"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TransparencyFlowNav } from "@/components/transparency/TransparencyFlowNav";
import { TransparencyContractsPanel } from "@/components/transparency/panels/TransparencyContractsPanel";
import { TransparencyHistoryPanel } from "@/components/transparency/panels/TransparencyHistoryPanel";
import { TransparencyMethodologyPanel } from "@/components/transparency/panels/TransparencyMethodologyPanel";
import { Card, CardContent } from "@/components/ui/card";
import {
  isTransparencySectionId,
  transparencySections,
  type TransparencySectionId,
} from "@/lib/transparency-sections";
import type { PublicProject } from "@/lib/data/public-projects";

interface TransparencyHubProps {
  rows: PublicProject[];
}

function sectionHref(id: TransparencySectionId): string {
  return id === "history" ? "/transparency" : `/transparency?section=${id}`;
}

export function TransparencyHub({ rows }: TransparencyHubProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  const activeSection: TransparencySectionId = isTransparencySectionId(
    sectionParam,
  )
    ? sectionParam
    : "history";

  const activeMeta = transparencySections.find(
    (section) => section.id === activeSection,
  );

  const setSection = useCallback(
    (id: TransparencySectionId) => {
      router.replace(sectionHref(id), { scroll: false });
    },
    [router],
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
      <header className="mx-auto max-w-3xl space-y-4 text-center max-md:rounded-2xl max-md:border max-md:border-[#1F1A2A]/8 max-md:bg-white/70 max-md:px-4 max-md:py-5 max-md:shadow-sm max-md:backdrop-blur-sm">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F1A2A] md:text-4xl md:text-foreground">
          صفحه شفافیت آوید
        </h1>
        <p className="text-sm leading-relaxed text-justify text-[#292334]/65 md:text-muted-foreground md:text-base">
          در این صفحه می‌توانید با مرور سوابق عملکردی و آشنایی با اصول و شیوه‌های کاری، با رویکرد آوید در سرمایه‌گذاری بیشتر آشنا شوید.
        </p>
      </header>

      <div className="sticky top-14 z-30 mt-8 border-y border-gold/15 bg-gradient-to-b from-background/98 to-muted/20 py-5 backdrop-blur supports-[backdrop-filter]:bg-background/85 max-md:rounded-2xl max-md:border max-md:border-[#1F1A2A]/10 max-md:bg-white/80 max-md:from-white/90 max-md:to-white/75 sm:top-[72px]">
        <TransparencyFlowNav
          activeSection={activeSection}
          onSelect={setSection}
        />
      </div>

      <Card className="mt-6 border-muted/80 shadow-sm max-md:rounded-2xl max-md:border-[#1F1A2A]/12 max-md:bg-[#242030] max-md:text-white max-md:shadow-[0_14px_32px_-22px_rgba(40,30,60,0.35)]">
        <CardContent className="p-6 md:p-8 max-md:[&_.text-muted-foreground]:text-[#D8CFE8] max-md:[&_.text-foreground]:text-[#F3EEF8] max-md:[&_h2]:text-[#F3EEF8] max-md:[&_.bg-muted\/20]:bg-white/[0.08] max-md:[&_.bg-muted\/30]:bg-white/[0.08] max-md:[&_.border-muted\/80]:border-white/18 max-md:[&_.border-orange-200\/90]:border-amber-300/40 max-md:[&_.from-orange-50]:from-amber-500/10 max-md:[&_.to-amber-50\/80]:to-amber-500/5 max-md:[&_.text-orange-950]:text-amber-100 max-md:[&_.text-orange-900]:text-amber-100">
          {activeMeta?.description ? (
            <p className="mb-6 text-sm leading-relaxed text-justify text-muted-foreground">
              {activeMeta.description}
            </p>
          ) : null}

          <div
            role="tabpanel"
            id={`transparency-panel-${activeSection}`}
            aria-labelledby={`transparency-tab-${activeSection}`}
          >
            {activeSection === "history" && (
              <TransparencyHistoryPanel rows={rows} />
            )}
            {activeSection === "methodology" && (
              <TransparencyMethodologyPanel />
            )}
            {activeSection === "contracts" && <TransparencyContractsPanel />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
