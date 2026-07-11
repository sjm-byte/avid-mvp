import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getInvestorDocuments } from "@/lib/data/documents";
import { AvidDocumentList } from "@/components/documents/AvidDocumentList";
import { DOCUMENT_CENTER_DISCLAIMER } from "@/types/document";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default async function DashboardDocumentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const documents = await getInvestorDocuments(user.id);

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">اسناد و قراردادها</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          اسناد عمومی، قراردادهای پروژه‌های شما و مدارک مرتبط با مشارکت
        </p>
      </div>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4 text-xs text-amber-900">
          {DOCUMENT_CENTER_DISCLAIMER}
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-4 text-lg font-semibold">اسناد در دسترس شما</h2>
        <AvidDocumentList
          documents={documents}
          emptyMessage="هنوز سندی برای نمایش وجود ندارد. پس از ثبت درخواست مشارکت یا تخصیص، اسناد مرتبط اینجا نمایش داده می‌شود."
        />
      </section>
    </div>
  );
}
