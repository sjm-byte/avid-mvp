import Link from "next/link";
import { ArrowLeft, FileText, ScrollText, Table2 } from "lucide-react";
import { transparencySectionHref } from "@/lib/transparency-sections";

const previews = [
  {
    id: "history" as const,
    step: "۱",
    title: "سابقه",
    hook: "جدول تسویه و فاصله پیش‌بینی تا واقعیت",
    icon: Table2,
  },
  {
    id: "methodology" as const,
    step: "۲",
    title: "اصول قراردادی",
    hook: "ریسک اعتباری، ریسک اقتصادی، و جایگاه وجه",
    icon: ScrollText,
  },
  {
    id: "contracts" as const,
    step: "۳",
    title: "متن قراردادها",
    hook: "مرابحه، سلف و مشارکت — ساختار هر مدل",
    icon: FileText,
  },
] as const;

export function HomeContractPrinciplesTeaser() {
  return (
    <section className="border-b bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-14 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            قبل از مشارکت، صفحه شفافیت را ببینید
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            سه درگاه به همان سه بخش شفافیت؛ جزئیات همان‌جا خوانده می‌شود.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {previews.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Link
                  href={transparencySectionHref(item.id)}
                  className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-gold/[0.04] hover:shadow-[0_12px_28px_-16px_rgba(13,27,62,0.35)]"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />

                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/35 bg-navy text-xs font-bold text-white">
                      {item.step}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-navy transition-colors group-hover:bg-gold/20">
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.hook}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-navy/80 transition-colors group-hover:text-navy">
                    مشاهده در شفافیت
                    <ArrowLeft
                      className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
