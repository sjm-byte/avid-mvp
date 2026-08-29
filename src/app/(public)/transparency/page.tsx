import {
  getTransparencySettlementRows,
} from "@/lib/data/transparency-settlement-table";
import { TransparencySettlementTable } from "@/components/transparency/TransparencySettlementTable";
import { TransparencyStatsCards } from "@/components/transparency/TransparencyStatsCards";

export default function TransparencyPage() {
  const rows = getTransparencySettlementRows();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
      <header className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          گزارش پروژه‌های خاتمه‌یافته
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          در این صفحه نتایج پروژه‌های خاتمه‌یافته آوید را می‌بینید. بررسی سابقه
          پروژه‌ها می‌تواند به شما در تصمیم‌گیری کمک کند.
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">نکته مهم: </span>
          عملکرد گذشته معیار قطعی برای آینده نیست. هر پروژه جدید، ریسک و بازده
          پیش‌بینی‌شده مخصوص به خود را دارد که می‌توانید قبل از مشارکت، صفحه
          همان پروژه و افشای ریسک را مطالعه کنید.
        </p>
      </header>

      <div className="mt-10">
        <TransparencyStatsCards />
      </div>

      <section className="mt-12 space-y-4">
        <div>
          <h2 className="text-xl font-semibold md:text-2xl">
            جدول وضعیت تسویه پروژه‌ها
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            تیک هر طرح بر اساس آخرین بند وضعیت همان طرح گذاشته شده است. طرح‌های
            در جریان تیک ندارند.
          </p>
        </div>

        {rows.length === 0 ? (
          <p className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
            هنوز پروژه‌ای برای نمایش ثبت نشده است.
          </p>
        ) : (
          <TransparencySettlementTable rows={rows} />
        )}
      </section>
    </div>
  );
}
