"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelInvestmentRequest } from "@/lib/actions/investment-requests";
import { Button } from "@/components/ui/button";

interface CancelRequestButtonProps {
  requestId: string;
}

export function CancelRequestButton({ requestId }: CancelRequestButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (!confirm("آیا از لغو این درخواست مطمئن هستید؟")) return;
    setLoading(true);
    const result = await cancelInvestmentRequest(requestId);
    setLoading(false);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCancel}
      disabled={loading}
    >
      {loading ? "در حال لغو..." : "لغو درخواست"}
    </Button>
  );
}
