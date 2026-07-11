import { PlaceholderSection } from "@/components/shared/PlaceholderSection";

export default function DashboardProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">پروفایل</h1>
      <PlaceholderSection
        title="اطلاعات کاربری"
        description="در حالت آزمایشی، نام و نقش از ورود نمایشی خوانده می‌شود. ویرایش پروفایل و تنظیمات حساب به‌زودی در همین صفحه قرار می‌گیرد."
      />
    </div>
  );
}
