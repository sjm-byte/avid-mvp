import { getAllInvestmentRequests } from "@/lib/data/investor-dashboard";
import { formatToman } from "@/lib/utils";
import { InvestmentRequestStatusBadge } from "@/components/investments/InvestmentRequestStatusBadge";
import { AdminRequestActions } from "@/components/investments/AdminRequestActions";
import { RequestCheckboxConfirmations } from "@/components/investments/RequestCheckboxConfirmations";

export default async function AdminRequestsPage() {
  const requests = await getAllInvestmentRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">درخواست‌های مشارکت</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          بررسی، تأیید یا رد درخواست‌های سرمایه‌گذاران
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          <p>درخواستی برای بررسی ثبت نشده است.</p>
          <p className="mt-2 text-xs">
            برای آزمایش جریان: با «ورود آزمایشی — سرمایه‌گذار» یک درخواست مشارکت
            در صفحه پروژه ثبت کنید.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-md border">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-right">
                <th className="px-4 py-3 font-medium">سرمایه‌گذار</th>
                <th className="px-4 py-3 font-medium">پروژه</th>
                <th className="px-4 py-3 font-medium">مبلغ</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">تأییدها</th>
                <th className="px-4 py-3 font-medium">تاریخ</th>
                <th className="px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b">
                  <td className="px-4 py-3 text-muted-foreground">
                    {request.investorId.slice(0, 12)}…
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {request.projectTitle}
                  </td>
                  <td className="px-4 py-3">
                    {formatToman(request.requestedAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <InvestmentRequestStatusBadge status={request.status} />
                  </td>
                  <td className="px-4 py-3 align-top">
                    <RequestCheckboxConfirmations compact />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-3">
                    <AdminRequestActions
                      requestId={request.id}
                      currentStatus={request.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        تأیید درخواست به معنی ثبت حسابداری تخصیص سرمایه نیست. رسیدهای ثبت‌شده در
        بخش رسیدها قابل مشاهده است.
      </p>
    </div>
  );
}
