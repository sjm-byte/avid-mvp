import { cn } from "@/lib/utils";

/**
 * Light mist page + dark content surfaces.
 * Gives subpages contrast without the flat all-dark look.
 */
export function MobilePublicPageShell({
  title,
  lead,
  children,
  className,
}: {
  title: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden pb-12 text-[#292334]", className)}
      style={{
        backgroundImage: `
          radial-gradient(90% 55% at 100% 0%, rgba(232,220,241,0.95), transparent 62%),
          radial-gradient(80% 50% at 0% 100%, rgba(210,228,245,0.55), transparent 60%),
          linear-gradient(180deg, #F7F5FA 0%, #F0EEF6 48%, #EDEAF4 100%)
        `,
      }}
    >
      <div className="px-4 pt-8">
        <header className="space-y-2">
          <h1 className="text-[1.65rem] font-extrabold leading-snug tracking-tight text-[#1F1A2A]">
            {title}
          </h1>
          {lead ? (
            <p className="max-w-2xl text-sm leading-relaxed text-[#292334]/65">
              {lead}
            </p>
          ) : null}
        </header>
        <div className="mt-7 space-y-4">{children}</div>
      </div>
    </div>
  );
}

/** Dark elevated panel on the light mist page. */
export function MobileSurface({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#1F1A2A]/10 bg-[#242030] p-4 text-white shadow-[0_16px_40px_-24px_rgba(40,30,60,0.35)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Shared class for dark content cards on light mobile pages. */
export const mobileDarkCardClassName =
  "max-md:border-[#1F1A2A]/12 max-md:bg-[#242030] max-md:text-white max-md:shadow-[0_14px_32px_-22px_rgba(40,30,60,0.35)] max-md:[&_.text-muted-foreground]:text-white/60 max-md:[&_a.text-navy]:text-[#C9B4DE] max-md:[&_a]:text-[#C9B4DE]";
