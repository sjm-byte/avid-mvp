import { TransparencySettlementTable } from "@/components/transparency/TransparencySettlementTable";
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
        <p className="text-sm leading-relaxed text-justify text-muted-foreground">
          در این بخش نتایج پروژه‌های آوید را می‌بینید. تیک هر طرح بر اساس
          آخرین وضعیت همان طرح گذاشته شده است. طرح‌های در جریان تیک ندارند.
        </p>
      </div>

      <div className="space-y-4">
        {rows.length === 0 ? (
          <p className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
            هنوز پروژه‌ای برای نمایش ثبت نشده است.
          </p>
        ) : (
          <TransparencySettlementTable rows={rows} />
        )}

        <div className="rounded-lg border border-muted/80 bg-muted/20 px-5 py-4 shadow-sm">
          <p className="font-semibold text-foreground">خلاصه عملکردی</p>
          <p className="mt-2 text-sm leading-relaxed text-justify text-muted-foreground">
            در هیچ پروژه‌ای زیان متوجه اصل سرمایه نشده است. در اغلب پروژه‌ها
            تسویه به موقع انجام شده و در برخی با حدود یک ماه تأخیر تسویه صورت
            گرفته است.
          </p>
        </div>

        <div
          className="rounded-lg border border-orange-200/90 bg-gradient-to-l from-orange-50 to-amber-50/80 px-5 py-4 text-sm leading-relaxed text-orange-950 shadow-sm"
          role="note"
        >
          <p className="font-semibold text-orange-900">هشدار ریسک</p>
          <p className="mt-2 text-sm leading-relaxed text-justify">
            عملکرد گذشته معیار قطعی برای آینده نیست. هر پروژه جدید، ریسک و
            بازده پیش‌بینی‌شده مخصوص به خود را دارد.
          </p>
        </div>
      </div>
    </div>
  );
}
