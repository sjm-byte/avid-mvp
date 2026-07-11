"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface ProjectDetailTabsProps {
  tabs: Tab[];
  tabPanels: Record<string, React.ReactNode>;
}

export function ProjectDetailTabs({ tabs, tabPanels }: ProjectDetailTabsProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-t-md px-4 py-2.5 text-sm font-medium transition-colors",
              active === tab.id
                ? "border border-b-0 border-border bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-8">{tabPanels[active]}</div>
    </div>
  );
}
