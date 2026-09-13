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
    step: "۱",
    title: "سابقه عملکردی",
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

const steps = [
  {
    step: "۱",
    title: "مطالعه صفحه شفافیت",
    href: "/transparency" as const,
    icon: BookOpen,
  },
  {
    step: "۲",
    title: "اعلام آمادگی",
    href: "/contact" as const,
    icon: HandHelping,
  },
  {
    step: "۳",
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

/** Alternating bands: dark → mid-purple → dark → light → dark → soft. */
export function MobileHomePage({
  projects,
}: {
  projects: PublicProject[];
}) {
  return (
    <div className="bg-[#18141f] text-white">
      <MobileHomeHero />

      {/* Dark */}
      <section className="px-4 py-5">
        <h2 className="text-center text-xl font-bold leading-snug text-white">
          خلاصه عملکرد آوید در یک نگاه
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/12 bg-[#242030]">
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-white/12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col px-2 py-3.5 text-center"
              >
                <p className="min-h-[2.6rem] text-[10px] leading-snug text-white/55">
                  {stat.label}
                </p>
                <p className="mt-auto pt-1.5 text-sm font-bold leading-snug text-[#C9B4DE]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lighter purple */}
      <section
        className="py-10 text-white"
        style={{
          backgroundImage:
            "radial-gradient(70% 55% at 80% 0%, rgba(168,128,205,0.4), transparent 62%), linear-gradient(165deg, #3a2860 0%, #4a3578 45%, #322250 100%)",
        }}
      >
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
              <li key={item.id} className="w-[78%] shrink-0 snap-center">
                <Link
                  href={transparencySectionHref(item.id)}
                  className="flex h-full min-h-[11rem] flex-col rounded-2xl border border-white/20 bg-white/12 p-5 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold leading-none tracking-tight text-[#D4AF37]">
                      {item.step}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A07CC4]/40 text-[#F0E6FA]">
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    {item.hook}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-8 flex justify-center px-4">
          <Link
            href="/transparency"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#A07CC4] px-5 py-3 text-sm font-semibold text-white"
          >
            <Eye className="size-4" aria-hidden />
            صفحه شفافیت آوید
          </Link>
        </div>
      </section>

      {/* Dark */}
      <section className="px-4 py-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold text-white">طرح‌های سرمایه‌گذاری</h2>
          <Link href="/projects" className="text-sm font-medium text-[#C9B4DE]">
            همه
          </Link>
        </div>
        <ul className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {projects.map((project) => (
            <li key={project.id} className="w-[82%] shrink-0 snap-center">
              <Link
                href={`/projects/${project.slug}`}
                className="block overflow-hidden rounded-2xl border border-white/12 bg-[#242030]"
              >
                <SafeProjectCoverImage
                  src={project.image}
                  alt={project.title}
                  aspectClassName="aspect-[5/3]"
                  className="rounded-none border-b border-white/12"
                />
                <div className="p-4">
                  <h3 className="text-base font-semibold leading-snug text-white">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/55">{project.activity}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/90">
                    <div>
                      <p className="text-white/45">مبلغ</p>
                      <p className="mt-0.5 font-semibold">
                        {formatPersianNumber(project.amount)} تومان
                      </p>
                    </div>
                    <div>
                      <p className="text-white/45">شروع</p>
                      <p className="mt-0.5 font-semibold" dir="ltr">
                        {formatJalaliDateDisplay(project.startDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/45">مدت</p>
                      <p className="mt-0.5 font-semibold">{project.duration}</p>
                    </div>
                    <div>
                      <p className="text-white/45">بازده پیش‌بینی</p>
                      <p className="mt-0.5 font-semibold leading-snug">
                        {project.predictedReturn.replace(
                          /^بازده پیش‌بینی‌شده\s*/,
                          "",
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] leading-relaxed text-amber-100/85">
                    این عدد پیش‌بینی است و سود قطعی یا تضمینی محسوب نمی‌شود.
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Light — participation path + consultation (one band) */}
      <section
        className="px-4 py-5 text-[#292334]"
        style={{
          backgroundImage:
            "radial-gradient(80% 55% at 0% 0%, rgba(210,228,245,0.9), transparent 65%), linear-gradient(180deg, #eaf0fb 0%, #efe8f7 100%)",
        }}
      >
        <h2 className="text-center text-xl font-bold text-[#2A4A6E]">
          مسیر مشارکت در آوید
        </h2>
        <ul className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.step} className="w-[72%] shrink-0 snap-center">
                <Link
                  href={item.href}
                  className="flex h-full min-h-[8.5rem] flex-col rounded-2xl border border-[#8aa9c8]/30 bg-white/95 p-5 shadow-[0_12px_28px_-18px_rgba(42,74,110,0.35)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center text-2xl font-extrabold leading-none text-[#2A4A6E]/85">
                      {item.step}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2A4A6E]/10 text-[#2A4A6E]">
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-auto pt-5 text-base font-semibold leading-snug text-[#292334]">
                    {item.title}
                  </h3>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6">
          <MobilePhoneCapture />
        </div>
      </section>

      {/* Soft lighter band */}
      <section
        className="px-4 py-10 pb-14"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #2a2438 0%, #221e30 55%, #1c1826 100%)",
        }}
      >
        <h2 className="text-center text-xl font-bold text-white">
          سوالات پرتکرار
        </h2>
        <div className="mt-6 space-y-3">
          {faqItems.map((item, index) => {
            const step = ["۱", "۲", "۳"][index] ?? "۱";
            return (
              <details
                key={item.q}
                className="group rounded-2xl border border-white/12 bg-[#2e2840]"
                open={index === 0}
              >
                <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-white marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="me-2 text-[#C9B4DE]">{step}</span>
                  {item.q}
                </summary>
                <p className="border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-white/70">
                  {item.a}
                </p>
              </details>
            );
          })}
        </div>
        <Link
          href="/faq"
          className="mt-5 block text-center text-sm font-medium text-[#C9B4DE]"
        >
          همه سوالات
        </Link>
      </section>
    </div>
  );
}
