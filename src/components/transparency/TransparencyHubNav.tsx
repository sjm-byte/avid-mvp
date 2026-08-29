import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  transparencyPillars,
  type TransparencyPillarPath,
} from "@/components/transparency/transparency-pillars";

interface TransparencyHubNavProps {
  current: TransparencyPillarPath;
}

export function TransparencyHubNav({ current }: TransparencyHubNavProps) {
  return (
    <nav aria-label="بخش‌های شفافیت آوید">
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        شفافیت در سه بخش
      </p>
      <div className="flex flex-wrap gap-2">
        {transparencyPillars.map((pillar) => {
          const isActive = pillar.href === current;

          return (
            <Link
              key={pillar.id}
              href={pillar.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-md border px-3 py-2 text-sm transition-colors",
                isActive
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-muted bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
              )}
            >
              {pillar.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
