import { cn } from "@/lib/utils";

/** Section heading used across the English site: serif title, optional lead. */
export function EnSectionHeading({
  title,
  lead,
  align = "left",
  className,
  as: Tag = "h2",
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <header className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      <Tag
        className={cn(
          "text-navy",
          Tag === "h1"
            ? "text-[2.5rem] leading-[1.08] sm:text-5xl md:text-[3.5rem]"
            : "text-[2rem] leading-[1.12] sm:text-[2.5rem]",
        )}
      >
        {title}
      </Tag>
      <span
        className={cn("mt-4 block h-px w-12 bg-gold", align === "center" && "mx-auto")}
        aria-hidden
      />
      {lead ? (
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground">{lead}</p>
      ) : null}
    </header>
  );
}

/** Small disclaimer placed next to every projected-return figure. */
export const EN_PROJECTION_NOTE =
  "This figure is a projection; it is not a guaranteed or certain return.";

export function EnRiskNote({
  title = "Risk warning",
  children,
  className,
  tone = "amber",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "amber" | "plain";
}) {
  return (
    <div
      role="note"
      className={cn(
        "border-l-2 px-5 py-4 text-[0.95rem] leading-relaxed",
        tone === "amber"
          ? "border-amber-500 bg-amber-50/80 text-amber-950"
          : "border-gold bg-card text-foreground",
        className,
      )}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1.5">{children}</p>
    </div>
  );
}
