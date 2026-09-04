import { BookOpen, FilePenLine, HandHelping } from "lucide-react";
import { ConsultationSupportSignupCard } from "@/components/home/ConsultationSupportSignupCard";

const steps = [
  {
    step: "۱",
    title: "مطالعه صفحه شفافیت آوید",
    description:
      "سابقه عملکرد، اصول قراردادی و انواع قراردادها را در صفحه شفافیت ببینید.",
    icon: BookOpen,
  },
  {
    step: "۲",
    title: "اعلام آمادگی",
    description: "علاقه خود را به مشارکت در پروژه مورد نظر اعلام کنید.",
    icon: HandHelping,
  },
  {
    step: "۳",
    title: "عقد قرارداد و واریز وجه",
    description:
      "قرارداد و واریز به حساب پروژه خارج از آوید انجام می‌شود؛ پلتفرم درگاه پرداخت ندارد.",
    icon: FilePenLine,
  },
] as const;

export function ParticipationPathSection() {
  return (
    <section className="border-y bg-muted/25">
      <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl">مسیر مشارکت در آوید</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            سه گام شفاف تا هماهنگی مشارکت؛ بدون درگاه پرداخت داخل سامانه.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(17rem,0.9fr)] lg:gap-10">
          <ol className="relative grid gap-0 sm:grid-cols-3">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === steps.length - 1;

              return (
                <li
                  key={item.step}
                  className="participation-step relative flex gap-4 px-1 py-2 sm:flex-col sm:items-center sm:gap-4 sm:px-3 sm:text-center"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  {!isLast ? (
                    <>
                      <span
                        className="participation-connector absolute end-5 top-[1.65rem] bottom-2 w-px bg-gradient-to-b from-gold/70 via-navy/25 to-transparent sm:hidden"
                        aria-hidden
                      />
                      <span
                        className="participation-connector absolute start-[calc(50%+1.35rem)] top-7 hidden h-px w-[calc(100%-2.7rem)] bg-gradient-to-l from-gold/80 via-navy/30 to-navy/10 sm:block"
                        aria-hidden
                      />
                    </>
                  ) : null}

                  <div className="relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/45 bg-navy text-sm font-bold text-white shadow-[0_8px_24px_-12px_rgba(13,27,62,0.55)]">
                    <span className="absolute inset-0 rounded-full bg-gold/10" aria-hidden />
                    <span className="relative">{item.step}</span>
                  </div>

                  <div className="min-w-0 flex-1 space-y-2 pt-1 sm:pt-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-background/70 px-2.5 py-1 text-gold sm:mx-auto">
                      <Icon className="size-3.5" aria-hidden />
                      <span className="text-[11px] font-medium text-navy">
                        گام {item.step}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold leading-snug text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <ConsultationSupportSignupCard layout="tile" />
          </div>
        </div>
      </div>
    </section>
  );
}
