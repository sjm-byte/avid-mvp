import { cn } from "@/lib/utils";

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
    <div className={cn("px-4 py-8 pb-12", className)}>
      <header className="space-y-2">
        <h1 className="text-[1.65rem] font-extrabold leading-snug tracking-tight text-white">
          {title}
        </h1>
        {lead ? (
          <p className="max-w-2xl text-sm leading-relaxed text-white/65">
            {lead}
          </p>
        ) : null}
      </header>
      <div className="mt-7">{children}</div>
    </div>
  );
}

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
        "rounded-2xl border border-white/12 bg-[#242030] p-4 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
