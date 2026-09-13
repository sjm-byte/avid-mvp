import Link from "next/link";
import { Eye, FileText, ScrollText, Table2 } from "lucide-react";
import { transparencySectionHref } from "@/lib/transparency-sections";
import { cn } from "@/lib/utils";

const previews = [
  {
    id: "history" as const,
    step: "۰۱",
    title: "سابقه عملکردی",
    hook: "جدول تسویه و فاصله پیش‌بینی تا واقعیت",
    icon: Table2,
  },
  {
    id: "methodology" as const,
    step: "۰۲",
    title: "اصول قراردادی",
    hook: "ریسک اعتباری، ریسک اقتصادی، و جایگاه وجه",
    icon: ScrollText,
  },
  {
    id: "contracts" as const,
    step: "۰۳",
    title: "متن قراردادها",
    hook: "مرابحه، سلف و مشارکت — ساختار هر مدل",
    icon: FileText,
  },
] as const;

function PreviewCard({
  item,
  className,
}: {
  item: (typeof previews)[number];
  className?: string;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={transparencySectionHref(item.id)}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-5 transition-all duration-300",
        "hover:border-gold/50 hover:bg-gold/[0.04] hover:shadow-[0_12px_28px_-16px_rgba(13,27,62,0.35)]",
        "md:hover:-translate-y-0.5",
        className,
      )}
      aria-label={`${item.title} — مشاهده در صفحه شفافیت`}
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium tracking-wide text-muted-foreground">
          {item.step}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-navy transition-colors group-hover:bg-gold/20">
          <Icon className="size-4" aria-hidden />
        </span>
      </div>

      <h3 className="mt-6 text-lg font-semibold text-navy">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {item.hook}
      </p>
    </Link>
  );
}

export function HomeContractPrinciplesTeaser() {
  return (
    <section className="border-b bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            قبل از مشارکت، صفحه شفافیت را ببینید
          </h2>
        </div>

        {/* Mobile: horizontal peek carousel (Yas-style) */}
        <div className="mt-8 md:hidden">
          <ul
            className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="بخش‌های شفافیت"
          >
            {previews.map((item) => (
              <li
                key={item.id}
                className="w-[78%] shrink-0 snap-center first:ms-1 last:me-1"
              >
                <PreviewCard item={item} className="min-h-[11.5rem]" />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            برای دیدن بقیه، به چپ و راست بکشید
          </p>
        </div>

        {/* Desktop: three-column grid */}
        <ul className="mt-10 hidden gap-4 md:grid md:grid-cols-3">
          {previews.map((item) => (
            <li key={item.id}>
              <PreviewCard item={item} />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <Link
            href="/transparency"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 transparency-cta-shimmer"
          >
            <span className="transparency-cta-icon relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-navy">
              <Eye className="size-3.5" aria-hidden />
            </span>
            <span className="relative z-[1] whitespace-nowrap">
              صفحه شفافیت آوید
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
