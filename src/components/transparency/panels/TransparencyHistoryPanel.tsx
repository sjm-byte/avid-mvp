import { TransparencySettlementTable } from "@/components/transparency/TransparencySettlementTable";
import { TransparencyStatsCards } from "@/components/transparency/TransparencyStatsCards";
import type { PublicProject } from "@/lib/data/public-projects";

interface TransparencyHistoryPanelProps {
  rows: PublicProject[];
}

export function TransparencyHistoryPanel({ rows }: TransparencyHistoryPanelProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold md:text-2xl">
          سابقه عملکرد و نتایج
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          در این بخش نتایج پروژه‌های خاتمه‌یافته آوید را می‌بینید. بررسی سابقه
          پروژه‌ها می‌تواند به شما در تصمیم‌گیری کمک کند.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">نکته مهم: </span>
          عملکرد گذشته معیار قطعی برای آینده نیست. هر پروژه جدید، ریسک و بازده
          پیش‌بینی‌شده مخصوص به خود را دارد.
        </p>
      </div>

      <TransparencyStatsCards />

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">جدول وضعیت تسویه پروژه‌ها</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
      </div>
    </div>
  );
}
