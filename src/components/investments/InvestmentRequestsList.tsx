import Link from "next/link";
import { InvestmentRequestRecord } from "@/types/investment";
import { ProjectPaymentInstructions } from "@/types/payment";
import { formatToman } from "@/lib/utils";
import { InvestmentRequestStatusBadge } from "@/components/investments/InvestmentRequestStatusBadge";
import { PaymentInstructionsCard } from "@/components/investments/PaymentInstructionsCard";
import { SubmitReceiptButton } from "@/components/investments/SubmitReceiptButton";
import { PaymentReceiptCard } from "@/components/investments/PaymentReceiptCard";
import { PaymentReceiptRecord } from "@/types/receipt";
import { CancelRequestButton } from "@/components/investments/CancelRequestButton";
import { RequestCheckboxConfirmations } from "@/components/investments/RequestCheckboxConfirmations";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InvestmentRequestsListProps {
  requests: InvestmentRequestRecord[];
  showCancel?: boolean;
  showConfirmations?: boolean;
  paymentInstructionsByRequestId?: Record<string, ProjectPaymentInstructions>;
  receiptsByRequestId?: Record<string, PaymentReceiptRecord>;
}

export function InvestmentRequestsList({
  requests,
  showCancel = true,
  showConfirmations = false,
  paymentInstructionsByRequestId = {},
  receiptsByRequestId = {},
}: InvestmentRequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
        <p>هنوز درخواست مشارکتی ثبت نکرده‌اید.</p>
        <p className="mt-2">
          <Link href="/projects" className="font-medium text-primary hover:underline">
            مشاهده پروژه‌های باز و ثبت اولین درخواست
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">
                <Link
                  href={`/projects/${request.projectSlug}`}
                  className="hover:underline"
                >
                  {request.projectTitle}
                </Link>
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatToman(request.requestedAmount)}
              </p>
            </div>
            <InvestmentRequestStatusBadge status={request.status} />
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {request.investorNote && (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">یادداشت: </span>
                {request.investorNote}
              </p>
            )}
            {request.adminNote && (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">پیام آوید: </span>
                {request.adminNote}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              ثبت:{" "}
              {new Date(request.createdAt).toLocaleDateString("fa-IR", {
                dateStyle: "medium",
              })}
            </p>
            {showConfirmations && (
              <div className="rounded-md border bg-muted/20 p-3">
                <p className="mb-2 text-xs font-medium text-foreground">
                  تأییدهای ثبت درخواست
                </p>
                <RequestCheckboxConfirmations />
              </div>
            )}
            {showCancel &&
              ["submitted", "under_review"].includes(request.status) && (
                <CancelRequestButton requestId={request.id} />
              )}
            {request.status === "approved_pending_payment" &&
              paymentInstructionsByRequestId[request.id] && (
                <>
                  <PaymentInstructionsCard
                    instructions={paymentInstructionsByRequestId[request.id]}
                    requestedAmount={request.requestedAmount}
                    projectTitle={request.projectTitle}
                  />
                  {(!receiptsByRequestId[request.id] ||
                    receiptsByRequestId[request.id].status === "rejected") && (
                    <SubmitReceiptButton request={request} />
                  )}
                </>
              )}
            {receiptsByRequestId[request.id] &&
              (request.status === "receipt_submitted" ||
                request.status === "allocated") && (
                <PaymentReceiptCard receipt={receiptsByRequestId[request.id]} />
              )}
            {receiptsByRequestId[request.id]?.status === "rejected" &&
              request.status === "approved_pending_payment" && (
                <PaymentReceiptCard receipt={receiptsByRequestId[request.id]} />
              )}
            {request.status === "allocated" && (
              <p className="rounded-md bg-teal-50 px-3 py-2 text-xs text-teal-900">
                رسید تأیید شده و سرمایه شما به‌صورت حسابداری به این پروژه تخصیص
                یافته است. این ثبت حسابداری است و مبلغی نزد آوید نگهداری نمی‌شود.
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
