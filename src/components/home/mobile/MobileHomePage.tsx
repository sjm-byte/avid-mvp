import Link from "next/link";
import {
  BookOpen,
  Eye,
  FilePenLine,
  FileText,
  HandHelping,
  ScrollText,
  Table2,
} from "lucide-react";
import { MobileHomeHero } from "@/components/home/mobile/MobileHomeHero";
import { MobilePhoneCapture } from "@/components/home/mobile/MobilePhoneCapture";
import { SafeProjectCoverImage } from "@/components/projects/SafeProjectCoverImage";
import { transparencySectionHref } from "@/lib/transparency-sections";
import type { PublicProject } from "@/lib/data/public-projects";
import { formatJalaliDateDisplay, formatPersianNumber } from "@/lib/utils";

const transparencyCards = [
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

const steps = [
  {
    step: "۰۱",
    title: "مطالعه صفحه شفافیت",
    href: "/transparency" as const,
    icon: BookOpen,
  },
  {
    step: "۰۲",
    title: "اعلام آمادگی",
    href: "/contact" as const,
    icon: HandHelping,
  },
  {
    step: "۰۳",
    title: "عقد قرارداد و واریز وجه",
    href: "/projects" as const,
    icon: FilePenLine,
  },
] as const;

const faqItems = [
  {
    q: "آوید صندوق سرمایه‌گذاری است؟",
    a: "خیر. آوید پلتفرم مدیریت مشارکت پروژه‌ای است. وجه نزد آوید نگهداری نمی‌شود.",
  },
  {
    q: "آیا بازده پیش‌بینی‌شده همان نتیجه واقعی پروژه است؟",
    a: "خیر. بازده پیش‌بینی‌شده صرفاً سناریو است و همان نتیجه واقعی پروژه محسوب نمی‌شود.",
  },
  {
    q: "چگونه در یک پروژه مشارکت کنم؟",
    a: "ابتدا صفحه شفافیت آوید را مطالعه کرده و سپس درخواست مشارکت ثبت کنید. در صورت موافقت، پروژه مدنظر به شما معرفی خواهد شد.",
  },
] as const;

const stats = [
  { label: "پروژه خاتمه‌یافته", value: "+۱۵" },
  { label: "حجم مشارکت ثبت‌شده", value: "+۵۰ میلیارد تومان" },
  { label: "میانگین سود ماهانه محقق‌شده", value: "+۵٪" },
] as const;

export function MobileHomePage({
  projects,
}: {
  projects: PublicProject[];
}) {
  return (
    <div className="bg-white text-yas-ink">
      <MobileHomeHero />

      {/* Intro / transparency CTA — Yas-style soft panel */}
      <section className="bg-gradient-to-b from-[#EDE7F5] to-white px-4 py-10">
        <h2 className="text-center text-xl font-bold">شفافیت آوید</h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-yas-ink/65">
          سابقه، اصول قراردادی و متن قراردادها را پیش از مشارکت بخوانید.
        </p>
        <Link
          href="/transparency"
          className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-yas-purple px-4 py-3.5 text-sm font-semibold text-white"
        >
          <Eye className="size-4" aria-hidden />
          صفحه شفافیت آوید
        </Link>
      </section>

      {/* Family / stats — Yas light stats strip */}
      <section className="px-4 py-10">
        <h2 className="text-center text-xl font-bold leading-snug">
          خلاصه عملکرد آوید در یک نگاه
        </h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-black/8 bg-white">
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-black/8">
            {stats.map((stat) => (
              <div key={stat.label} className="px-2 py-4 text-center">
                <p className="text-[10px] leading-relaxed text-yas-ink/55">
                  {stat.label}
                </p>
                <p className="mt-2 text-sm font-bold leading-snug text-yas-ink">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Link
          href="/transparency"
          className="mt-4 block rounded-full bg-yas-mist px-4 py-3 text-center text-sm font-medium text-yas-ink"
        >
          جزئیات عملکرد در شفافیت
        </Link>
      </section>

      {/* Dark carousel — Yas “why silver” pattern */}
      <section className="bg-[#14101c] py-10 text-white">
        <h2 className="px-4 text-center text-[1.35rem] font-bold leading-snug">
          قبل از مشارکت، این سه بخش را ببینید
        </h2>
        <ul
          className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="بخش‌های شفافیت"
        >
          {transparencyCards.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className="w-[78%] shrink-0 snap-center"
              >
                <Link
                  href={transparencySectionHref(item.id)}
                  className="flex h-full min-h-[11rem] flex-col rounded-2xl border border-white/10 bg-[#1c1728] p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/45">{item.step}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yas-purple/25 text-yas-purple-soft">
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {item.hook}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Steps — Yas numbered flow as swipe cards */}
      <section className="bg-yas-mist px-4 py-10">
        <p className="text-center text-xs font-semibold text-yas-purple">
          ۳ گام شفاف
        </p>
        <h2 className="mt-2 text-center text-xl font-bold">مسیر مشارکت در آوید</h2>
        <ul className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.step} className="w-[72%] shrink-0 snap-center">
                <Link
                  href={item.href}
                  className="flex h-full flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-yas-ink/40">{item.step}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yas-purple/10 text-yas-purple">
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold leading-snug">
                    {item.title}
                  </h3>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Projects carousel */}
      <section className="px-4 py-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold">طرح‌های سرمایه‌گذاری</h2>
          <Link href="/projects" className="text-sm font-medium text-yas-purple">
            همه
          </Link>
        </div>
        <ul className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {projects.map((project) => (
            <li key={project.id} className="w-[82%] shrink-0 snap-center">
              <Link
                href={`/projects/${project.slug}`}
                className="block overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm"
              >
                <SafeProjectCoverImage
                  src={project.image}
                  alt={project.title}
                  aspectClassName="aspect-[5/3]"
                  className="rounded-none border-b"
                />
                <div className="p-4">
                  <h3 className="text-base font-semibold leading-snug">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-xs text-yas-ink/55">{project.activity}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-yas-ink/45">مبلغ</p>
                      <p className="mt-0.5 font-semibold">
                        {formatPersianNumber(project.amount)} تومان
                      </p>
                    </div>
                    <div>
                      <p className="text-yas-ink/45">شروع</p>
                      <p className="mt-0.5 font-semibold" dir="ltr">
                        {formatJalaliDateDisplay(project.startDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-yas-ink/45">مدت</p>
                      <p className="mt-0.5 font-semibold">{project.duration}</p>
                    </div>
                    <div>
                      <p className="text-yas-ink/45">بازده پیش‌بینی</p>
                      <p className="mt-0.5 font-semibold leading-snug">
                        {project.predictedReturn.replace(
                          /^بازده پیش‌بینی‌شده\s*/,
                          "",
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] leading-relaxed text-amber-800">
                    این عدد پیش‌بینی است و سود قطعی یا تضمینی محسوب نمی‌شود.
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Guide / phone again */}
      <section className="bg-gradient-to-b from-[#EDE7F5] to-white px-4 py-10">
        <h2 className="text-center text-xl font-bold">درخواست مشاوره</h2>
        <p className="mt-2 text-center text-sm text-yas-ink/65">
          اگر آماده‌اید یا سوال دارید، شماره بگذارید تا تماس بگیریم.
        </p>
        <div className="mt-5">
          <MobilePhoneCapture
            title="راهنمای مشارکت در آوید"
            highlight="آوید"
            subtitle="شماره بگذارید تا با شما تماس بگیریم"
            submitLabel="درخواست راهنما"
          />
        </div>
      </section>

      {/* FAQ accordion-ish */}
      <section className="px-4 py-10">
        <h2 className="text-center text-xl font-bold">سوالات پرتکرار</h2>
        <div className="mt-6 space-y-3">
          {faqItems.map((item, index) => {
            const step = ["۰۱", "۰۲", "۰۳"][index] ?? "۰۱";
            return (
            <details
              key={item.q}
              className="group rounded-2xl border border-black/8 bg-white open:shadow-sm"
              open={index === 0}
            >
              <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="me-2 text-yas-purple">{step}</span>
                {item.q}
              </summary>
              <p className="border-t border-black/5 px-4 py-3 text-sm leading-relaxed text-yas-ink/65">
                {item.a}
              </p>
            </details>
            );
          })}
        </div>
        <Link
          href="/faq"
          className="mt-5 block text-center text-sm font-medium text-yas-purple"
        >
          همه سوالات
        </Link>
      </section>
    </div>
  );
}
