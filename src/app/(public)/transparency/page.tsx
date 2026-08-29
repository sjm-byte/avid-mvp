import type { Metadata } from "next";
import { Suspense } from "react";
import { getTransparencySettlementRows } from "@/lib/data/transparency-settlement-table";
import { TransparencyHub } from "@/components/transparency/TransparencyHub";

export const metadata: Metadata = {
  title: "صفحه شفافیت آوید",
  description:
    "سابقه عملکرد، منطق و قواعد کاری، و متن قراردادها — سه بخش شفافیت آوید در یک صفحه.",
};

export default function TransparencyPage() {
  const rows = getTransparencySettlementRows();

  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-6xl px-4 py-16 text-center text-muted-foreground">
          در حال بارگذاری…
        </div>
      }
    >
      <TransparencyHub rows={rows} />
    </Suspense>
  );
}
