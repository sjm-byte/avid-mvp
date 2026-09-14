import Link from "next/link";
import {
  BookOpen,
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
    step: "۰۱",
    title: "مطالعه صفحه شفافیت",
    description: "سابقه، اصول قراردادی و متن قراردادها را پیش از مشارکت بخوانید.",
    href: "/transparency" as const,
    icon: BookOpen,
  },
  {
    step: "۰۲",
    title: "اعلام آمادگی",
    description: "شماره تماس بگذارید تا تیم آوید برای هماهنگی با شما تماس بگیرد.",
    href: "/contact" as const,
    icon: HandHelping,
  },
  {
    step: "۰۳",
    title: "عقد قرارداد و واریز وجه",
    description: "پس از موافقت، قرارداد تنظیم و دستور پرداخت اعلام می‌شود.",
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
  { label: "حجم مشارکت ثبت‌شده", value: "+۵۰", unit: "میلیارد تومان" },
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
                <p className="mt-auto pt-1.5 text-base font-bold leading-snug text-[#C9B4DE]">
                  <span dir="ltr" className="inline-block">
                    {stat.value}
                  </span>
                  {"unit" in stat && stat.unit ? (
                    <span className="ms-1 text-[11px] font-semibold">
                      {stat.unit}
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid purple — softer step from dark stats band */}
      <section
        className="py-5 text-white"
        style={{
          backgroundImage:
            "radial-gradient(70% 50% at 80% 0%, rgba(148,118,185,0.22), transparent 60%), linear-gradient(180deg, #221c2e 0%, #2c243c 48%, #241e32 100%)",
        }}
      >
        <div className="px-4">
          <Link
            href="/transparency"
            className="group relative mx-auto flex max-w-sm flex-col items-center overflow-hidden rounded-2xl border border-[#C9B4DE]/28 bg-[#1c1826]/75 px-5 py-4 text-center shadow-[0_10px_24px_-16px_rgba(0,0,0,0.4)] transition-colors active:bg-[#221c2e]"
          >
            <span
              className="absolute inset-x-10 top-0 h-px bg-gradient-to-l from-transparent via-[#D4AF37]/45 to-transparent"
              aria-hidden
            />
            <span className="text-xs font-medium leading-relaxed text-[#D8CDE8]">
              قبل از مشارکت بخوانید
            </span>
            <span className="mt-2 text-[1.15rem] font-bold leading-snug tracking-tight text-[#F3EEF8]">
              صفحه شفافیت آوید
            </span>
            <span
              className="mt-3 h-px w-16 bg-gradient-to-l from-transparent via-[#D4AF37]/55 to-transparent"
              aria-hidden
            />
            <span className="mt-2.5 text-xs font-medium text-[#B9A3D0]">
              مشاهده شفافیت
            </span>
          </Link>
        </div>
        <ul
          className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="بخش‌های شفافیت"
        >
          {transparencyCards.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="w-[78%] shrink-0 snap-center">
                <Link
                  href={transparencySectionHref(item.id)}
                  className="flex h-full min-h-[11rem] flex-col rounded-2xl border border-white/14 bg-[#2a2438]/90 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center text-3xl font-extrabold leading-none tracking-tight text-[#D4AF37]/90">
                      {item.step}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A07CC4]/30 text-[#E4D6F2]">
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#F0EAF6]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#C8BDD8]">
                    {item.hook}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Dark */}
      <section className="px-4 py-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold text-white">نمونه طرح‌های قبلی</h2>
          <Link href="/projects" className="text-sm font-medium text-[#C9B4DE]">
            آرشیو
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

      {/* Yas-style participation path + consultation */}
      <section
        className="relative overflow-hidden px-4 py-8 text-[#292334]"
        style={{
          backgroundColor: "#F5F3F8",
          backgroundImage: `
            radial-gradient(95% 55% at 50% 100%, rgba(167, 139, 250, 0.28), transparent 68%),
            repeating-linear-gradient(
              -32deg,
              transparent 0,
              transparent 14px,
              rgba(123, 96, 161, 0.055) 14px,
              rgba(123, 96, 161, 0.055) 15px
            ),
            linear-gradient(180deg, #F7F5FA 0%, #F2EFF7 100%)
          `,
        }}
      >
        <h2 className="text-center text-[1.45rem] font-extrabold leading-snug tracking-tight">
          مسیر مشارکت در{" "}
          <span className="bg-gradient-to-l from-[#7B60A1] to-[#B9A0D4] bg-clip-text text-transparent">
            آوید
          </span>
        </h2>
        <ul className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.step} className="w-[78%] shrink-0 snap-center">
                <Link
                  href={item.href}
                  className="relative flex h-full min-h-[10.5rem] flex-col overflow-hidden rounded-[1.35rem] bg-white p-5 shadow-[0_14px_36px_-18px_rgba(72,56,110,0.28)]"
                >
                  <span
                    className="pointer-events-none absolute start-5 top-3 text-[3.4rem] font-extrabold leading-none text-[#292334]/[0.08]"
                    aria-hidden
                  >
                    {item.step}
                  </span>
                  <div className="relative z-[1] flex justify-end">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[0.7rem] bg-[#7B60A1] text-white shadow-[0_8px_18px_-10px_rgba(123,96,161,0.7)]">
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>
                  <h3 className="relative z-[1] mt-10 text-base font-bold leading-snug text-[#292334]">
                    {item.title}
                  </h3>
                  <p className="relative z-[1] mt-2 text-[13px] leading-relaxed text-[#292334]/55">
                    {item.description}
                  </p>
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
