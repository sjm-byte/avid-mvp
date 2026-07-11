"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  rejectPaymentReceipt,
  verifyPaymentReceipt,
} from "@/lib/actions/payment-receipts";
import { PaymentReceiptUiStatus } from "@/types/receipt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminReceiptActionsProps {
  receiptId: string;
  currentStatus: PaymentReceiptUiStatus;
}

export function AdminReceiptActions({
  receiptId,
  currentStatus,
}: AdminReceiptActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  async function handleVerify() {
    if (!confirm("آیا از تأیید این رسید و تخصیص سرمایه مطمئن هستید؟")) return;
    setLoading(true);
    const result = await verifyPaymentReceipt(receiptId);
    setLoading(false);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await rejectPaymentReceipt(receiptId, rejectReason.trim());
    setLoading(false);
    if (result.success) {
      setShowReject(false);
      setRejectReason("");
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  if (["verified", "rejected"].includes(currentStatus)) {
    return null;
  }

  if (showReject) {
    return (
      <form onSubmit={handleReject} className="flex min-w-[200px] flex-col gap-2">
        <Label htmlFor={`reject-${receiptId}`} className="text-xs">
          دلیل رد (اختیاری)
        </Label>
        <Input
          id={`reject-${receiptId}`}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="مثلاً مبلغ با رسید مطابقت ندارد"
          className="text-sm"
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" variant="destructive" disabled={loading}>
            {loading ? "..." : "تأیید رد"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={() => setShowReject(false)}
          >
            انصراف
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" disabled={loading} onClick={handleVerify}>
        تأیید رسید
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={loading}
        onClick={() => setShowReject(true)}
      >
        رد
      </Button>
    </div>
  );
}
