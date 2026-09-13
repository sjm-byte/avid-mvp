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

export function MobileHomePage({
  projects,
}: {
  projects: PublicProject[];
}) {
  return (
    <div className="bg-[#F7F4FB] text-yas-ink">
      <MobileHomeHero />

      {/* Soft mint stats */}
      <section
        className="px-4 py-10"
        style={{
          backgroundImage:
            "radial-gradient(90% 70% at 100% 0%, rgba(210,236,220,0.95), transparent 70%), linear-gradient(180deg, #eef8f1 0%, #f7f4fb 100%)",
        }}
      >
        <h2 className="text-center text-xl font-bold leading-snug">
          خلاصه عملکرد آوید در یک نگاه
        </h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-900/8 bg-white/90 shadow-[0_12px_32px_-20px_rgba(40,90,60,0.35)] backdrop-blur-sm">
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-emerald-900/8">
            {stats.map((stat) => (
              <div key={stat.label} className="px-2 py-4 text-center">
                <p className="text-[10px] leading-relaxed text-yas-ink/55">
                  {stat.label}
                </p>
                <p className="mt-2 text-sm font-bold leading-snug text-[#2F5D45]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lavender transparency intro */}
      <section
        className="px-4 py-10"
        style={{
          backgroundImage:
            "radial-gradient(80% 60% at 0% 100%, rgba(232,220,241,0.95), transparent 65%), linear-gradient(180deg, #f3eaf8 0%, #f7f4fb 100%)",
        }}
      >
        <h2 className="text-center text-xl font-bold text-[#4A3568]">
          شفافیت آوید
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-yas-ink/65">
          سابقه، اصول قراردادی و متن قراردادها را پیش از مشارکت بخوانید.
        </p>
      </section>

      {/* Deep violet gateways */}
      <section
        className="py-10 text-white"
        style={{
          backgroundImage:
            "radial-gradient(70% 50% at 80% 0%, rgba(148,108,185,0.35), transparent 60%), linear-gradient(165deg, #1a1228 0%, #2a1b45 48%, #14101c 100%)",
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
                  className="flex h-full min-h-[11rem] flex-col rounded-2xl border border-white/15 bg-white/8 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold leading-none tracking-tight text-gold-light">
                      {item.step}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yas-purple/35 text-yas-purple-soft">
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {item.hook}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-8 px-4">
          <Link
            href="/transparency"
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-yas-purple to-[#946CB9] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_-12px_rgba(123,96,161,0.7)]"
          >
            <Eye className="size-4" aria-hidden />
            صفحه شفافیت آوید
          </Link>
        </div>
      </section>

      {/* Warm cream projects */}
      <section
        className="px-4 py-10"
        style={{
          backgroundImage:
            "radial-gradient(70% 50% at 100% 20%, rgba(245,230,200,0.7), transparent 60%), linear-gradient(180deg, #fbf6ee 0%, #f7f4fb 100%)",
        }}
      >
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold text-[#5A3F1E]">
            طرح‌های سرمایه‌گذاری
          </h2>
          <Link href="/projects" className="text-sm font-medium text-[#9A6B2F]">
            همه
          </Link>
        </div>
        <ul className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {projects.map((project) => (
            <li key={project.id} className="w-[82%] shrink-0 snap-center">
              <Link
                href={`/projects/${project.slug}`}
                className="block overflow-hidden rounded-2xl border border-[#d9c4a0]/35 bg-white shadow-[0_14px_30px_-18px_rgba(120,80,30,0.35)]"
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

      {/* Soft blue participation path */}
      <section
        className="px-4 py-10"
        style={{
          backgroundImage:
            "radial-gradient(80% 55% at 0% 0%, rgba(210,228,245,0.95), transparent 65%), linear-gradient(180deg, #eaf2fb 0%, #f0eef8 100%)",
        }}
      >
        <h2 className="text-center text-xl font-bold text-[#2A4A6E]">
          مسیر مشارکت در آوید
        </h2>
        <ul className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.step} className="w-[72%] shrink-0 snap-center">
                <Link
                  href={item.href}
                  className="flex h-full flex-col rounded-2xl border border-[#8aa9c8]/25 bg-white/95 p-5 shadow-[0_12px_28px_-18px_rgba(42,74,110,0.4)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-[#2A4A6E]/85">
                      {item.step}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2A4A6E]/10 text-[#2A4A6E]">
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

      {/* Consultation — lavender band */}
      <section
        className="px-4 py-10"
        style={{
          backgroundImage:
            "radial-gradient(90% 60% at 50% 0%, rgba(236,220,250,0.95), transparent 70%), linear-gradient(180deg, #efe6f8 0%, #f7f4fb 100%)",
        }}
      >
        <MobilePhoneCapture />
      </section>

      {/* FAQ on soft blush */}
      <section
        className="px-4 py-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #f8f1f4 0%, #f7f4fb 55%, #ffffff 100%)",
        }}
      >
        <h2 className="text-center text-xl font-bold text-[#5C3550]">
          سوالات پرتکرار
        </h2>
        <div className="mt-6 space-y-3">
          {faqItems.map((item, index) => {
            const step = ["۱", "۲", "۳"][index] ?? "۱";
            return (
              <details
                key={item.q}
                className="group rounded-2xl border border-[#c9a0b4]/25 bg-white open:shadow-[0_10px_24px_-16px_rgba(92,53,80,0.35)]"
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
