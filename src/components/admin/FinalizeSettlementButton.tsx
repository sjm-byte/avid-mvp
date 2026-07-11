"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { finalizeProjectSettlement } from "@/lib/actions/project-settlements";
import { FINALIZE_SETTLEMENT_CONFIRM_MESSAGE } from "@/types/settlement";
import { Button } from "@/components/ui/button";

interface FinalizeSettlementButtonProps {
  settlementId: string;
  projectTitle?: string;
}

export function FinalizeSettlementButton({
  settlementId,
  projectTitle,
}: FinalizeSettlementButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    const label = projectTitle ? `«${projectTitle}»` : "این تسویه";
    const confirmed = window.confirm(
      `${FINALIZE_SETTLEMENT_CONFIRM_MESSAGE}\n\nپروژه: ${label}`
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await finalizeProjectSettlement(settlementId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-1">
      <Button
        type="button"
        size="sm"
        disabled={isPending}
        onClick={handleClick}
      >
        {isPending ? "در حال نهایی‌سازی…" : "نهایی‌سازی تسویه"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
