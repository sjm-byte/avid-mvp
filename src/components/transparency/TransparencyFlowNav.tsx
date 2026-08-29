"use client";

import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  transparencySections,
  type TransparencySectionId,
} from "@/lib/transparency-sections";

const stepPulseClass = [
  "transparency-flow-pulse-0",
  "transparency-flow-pulse-1",
  "transparency-flow-pulse-2",
] as const;

interface TransparencyFlowNavProps {
  activeSection: TransparencySectionId;
  onSelect: (id: TransparencySectionId) => void;
}

export function TransparencyFlowNav({
  activeSection,
  onSelect,
}: TransparencyFlowNavProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <div
        className="flex flex-wrap items-center justify-center gap-1 sm:gap-0"
        role="tablist"
        aria-label="بخش‌های شفافیت"
      >
        {transparencySections.map((section, index) => {
          const isActive = section.id === activeSection;
          const stepNumber = index + 1;

          return (
            <div
              key={section.id}
              className="flex items-center gap-1 sm:gap-0"
            >
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`transparency-panel-${section.id}`}
                id={`transparency-tab-${section.id}`}
                onClick={() => onSelect(section.id)}
                className={cn(
                  "group relative flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-300 sm:px-4",
                  !isActive && stepPulseClass[index],
                  isActive
                    ? "border-gold/70 bg-navy text-white shadow-[0_4px_18px_-4px_rgba(13,27,62,0.45)]"
                    : "border-border/80 bg-card text-foreground/90 shadow-sm hover:border-gold/45 hover:bg-gold/5 transparency-flow-shimmer",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    isActive
                      ? "bg-gold text-navy"
                      : "bg-muted text-muted-foreground group-hover:bg-gold/15 group-hover:text-navy",
                  )}
                >
                  {stepNumber}
                </span>
                <span className="whitespace-nowrap">{section.label}</span>
              </button>

              {index < transparencySections.length - 1 && (
                <ChevronLeft
                  className="mx-0.5 hidden size-5 shrink-0 text-gold/55 sm:mx-1 sm:block"
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
