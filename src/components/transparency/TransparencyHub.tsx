"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TransparencyContractsPanel } from "@/components/transparency/panels/TransparencyContractsPanel";
import { TransparencyHistoryPanel } from "@/components/transparency/panels/TransparencyHistoryPanel";
import { TransparencyMethodologyPanel } from "@/components/transparency/panels/TransparencyMethodologyPanel";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
        <p className="text-sm leading-relaxed text-justify text-muted-foreground md:text-base md:whitespace-nowrap">
          سه بخش{" "}
          <span className="font-medium text-foreground">سابقه</span>،{" "}
          <span className="font-medium text-foreground">اصول قراردادی</span>{" "}
          و{" "}
          <span className="font-medium text-foreground">متن قراردادها</span> —
          برای تصویر کامل، هر سه را ببینید.
        </p>
      </header>

      <div className="sticky top-14 z-30 mt-10 border-y bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:top-[72px]">
        <div
          className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="بخش‌های شفافیت"
        >
          {transparencySections.map((section) => {
            const isActive = section.id === activeSection;

            return (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`transparency-panel-${section.id}`}
                id={`transparency-tab-${section.id}`}
                onClick={() => setSection(section.id)}
                className={cn(
                  "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground/85 shadow-sm hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
                )}
              >
                {section.label}
              </button>
            );
          })}
        </div>
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
