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
      <header className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          صفحه شفافیت آوید
        </h1>
        <p className="text-sm leading-relaxed text-justify text-muted-foreground md:text-base">
          این صفحه ضمن سه بخش به شما کمک می‌کند تا با آوید بیشتر آشنا شوید.
        </p>
      </header>

      <div className="sticky top-14 z-30 mt-10 border-y border-gold/15 bg-gradient-to-b from-background/98 to-muted/20 py-5 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:top-[72px]">
        <TransparencyFlowNav
          activeSection={activeSection}
          onSelect={setSection}
        />
      </div>

      <Card className="mt-6 border-muted/80 shadow-sm">
        <CardContent className="p-6 md:p-8">
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
