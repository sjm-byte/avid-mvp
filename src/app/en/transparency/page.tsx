import type { Metadata } from "next";
import { Suspense } from "react";
import { getTransparencySettlementRows } from "@/lib/data/transparency-settlement-table";
import { EnTransparencyHub } from "@/components/en/transparency/EnTransparencyHub";

export const metadata: Metadata = {
  title: "Transparency",
  description:
    "Track record, contract principles and contract texts — Avid’s three transparency sections on one page.",
  alternates: { languages: { fa: "/transparency", en: "/en/transparency" } },
};

export default function EnglishTransparencyPage() {
  const rows = getTransparencySettlementRows();
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-24 text-muted-foreground">Loading…</div>}>
      <EnTransparencyHub rows={rows} />
    </Suspense>
  );
}
