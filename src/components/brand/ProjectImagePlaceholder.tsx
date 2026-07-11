import { PROJECT_IMAGE_ASSETS } from "@/lib/assets";
import { cn } from "@/lib/utils";

interface ProjectImagePlaceholderProps {
  category?: string | null;
  projectType?: string | null;
  className?: string;
  aspectClassName?: string;
}

export function ProjectImagePlaceholder({
  category,
  projectType,
  className,
  aspectClassName = "aspect-[16/9]",
}: ProjectImagePlaceholderProps) {
  const meta = [category, projectType].filter(Boolean).join(" · ");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-muted/30",
        aspectClassName,
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PROJECT_IMAGE_ASSETS.placeholder}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-background/10 to-transparent"
        aria-hidden="true"
      />
      {meta ? (
        <p className="absolute bottom-3 right-3 left-3 text-right text-xs font-medium text-foreground/80">
          {meta}
        </p>
      ) : (
        <p className="absolute bottom-3 right-3 text-right text-xs text-muted-foreground">
          تصویر پروژه
        </p>
      )}
    </div>
  );
}
