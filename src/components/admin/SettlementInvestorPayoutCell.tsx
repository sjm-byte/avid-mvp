"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markSettlementPayoutPaid } from "@/lib/actions/settlement-payouts";
import {
  InvestorSettlementDistributionRow,
  InvestorSettlementPayoutRecord,
  INVESTOR_SETTLEMENT_PAYOUT_STATUS_LABELS,
  MANUAL_PAYOUT_DISCLAIMER,
} from "@/types/settlement";
import { formatToman } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SettlementInvestorPayoutCellProps {
  settlementId: string;
  row: InvestorSettlementDistributionRow;
  payout: InvestorSettlementPayoutRecord | null;
  isFinalized: boolean;
}

export function SettlementInvestorPayoutCell({
  settlementId,
  row,
  payout,
  isFinalized,
}: SettlementInvestorPayoutCellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState(
    String(Math.round(row.finalAmount / 10))
  );
  const [paidDate, setPaidDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentReferenceNumber, setPaymentReferenceNumber] = useState("");
  const [adminNote, setAdminNote] = useState("");

  if (!isFinalized) {
    return <span className="text-muted-foreground">—</span>;
  }

  if (payout) {
    return (
      <div className="space-y-1 text-xs">
        <span className="inline-flex rounded-full border bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800">
          {INVESTOR_SETTLEMENT_PAYOUT_STATUS_LABELS.paid_manually}
        </span>
        <p>{formatToman(payout.paidAmount)}</p>
        <p className="text-muted-foreground">
          {new Date(payout.paidDate).toLocaleDateString("fa-IR")}
        </p>
        <p className="text-muted-foreground">پیگیری: {payout.paymentReferenceNumber}</p>
        {payout.adminNote && (
          <p className="text-muted-foreground">{payout.adminNote}</p>
        )}
      </div>
    );
  }

  if (!open) {
    return (
      <div className="space-y-1">
        <span className="inline-flex rounded-full border bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900">
          {INVESTOR_SETTLEMENT_PAYOUT_STATUS_LABELS.pending_manual_payout}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
        >
          ثبت پرداخت دستی
        </Button>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await markSettlementPayoutPaid({
        settlementId,
        investorId: row.investorId,
        paidAmount: Number(paidAmount) * 10,
        paidDate,
        paymentReferenceNumber,
        adminNote,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setOpen(false);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-[220px] space-y-2 rounded-md border bg-muted/20 p-3">
      <p className="text-xs text-amber-900">{MANUAL_PAYOUT_DISCLAIMER}</p>
      <div className="space-y-1">
        <Label htmlFor={`paid-amount-${row.investorId}`} className="text-xs">
          مبلغ پرداخت (تومان)
        </Label>
        <Input
          id={`paid-amount-${row.investorId}`}
          type="number"
          min={1}
          value={paidAmount}
          onChange={(e) => setPaidAmount(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`paid-date-${row.investorId}`} className="text-xs">
          تاریخ پرداخت
        </Label>
        <Input
          id={`paid-date-${row.investorId}`}
          type="date"
          value={paidDate}
          onChange={(e) => setPaidDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`paid-ref-${row.investorId}`} className="text-xs">
          شماره پیگیری
        </Label>
        <Input
          id={`paid-ref-${row.investorId}`}
          value={paymentReferenceNumber}
          onChange={(e) => setPaymentReferenceNumber(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`paid-note-${row.investorId}`} className="text-xs">
          یادداشت ادمین
        </Label>
        <Textarea
          id={`paid-note-${row.investorId}`}
          rows={2}
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "در حال ثبت…" : "ثبت پرداخت"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
          disabled={isPending}
        >
          انصراف
        </Button>
      </div>
    </form>
  );
}
