import { PlaceholderSection } from "@/components/shared/PlaceholderSection";

export default function AdminInvestorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">مدیریت سرمایه‌گذاران</h1>
      <PlaceholderSection
        title="لیست سرمایه‌گذاران"
        description="در نسخه فعلی، سرمایه‌گذاران از طریق درخواست‌ها و رسیدها قابل پیگیری هستند. صفحه اختصاصی پروفایل و تاریخچه مشارکت به‌زودی اضافه می‌شود."
      />
    </div>
  );
}
