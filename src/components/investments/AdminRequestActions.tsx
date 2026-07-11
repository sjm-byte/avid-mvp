"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateInvestmentRequestStatus } from "@/lib/actions/investment-requests";
import { InvestmentRequestUiStatus } from "@/types/investment";
import { Button } from "@/components/ui/button";

interface AdminRequestActionsProps {
  requestId: string;
  currentStatus: InvestmentRequestUiStatus;
}

export function AdminRequestActions({
  requestId,
  currentStatus,
}: AdminRequestActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: InvestmentRequestUiStatus) {
    setLoading(true);
    const result = await updateInvestmentRequestStatus(requestId, status);
    setLoading(false);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  if (["rejected", "cancelled"].includes(currentStatus)) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus === "submitted" && (
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => updateStatus("under_review")}
        >
          شروع بررسی
        </Button>
      )}
      {["submitted", "under_review"].includes(currentStatus) && (
        <>
          <Button
            size="sm"
            disabled={loading}
            onClick={() => updateStatus("approved_pending_payment")}
          >
            تأیید
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={loading}
            onClick={() => updateStatus("rejected")}
          >
            رد
          </Button>
        </>
      )}
    </div>
  );
}
