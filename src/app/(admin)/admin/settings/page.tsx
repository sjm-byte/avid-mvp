import { PlaceholderSection } from "@/components/shared/PlaceholderSection";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">تنظیمات</h1>
      <PlaceholderSection
        title="تنظیمات سیستم"
        description="کارمزد پروژه‌ها، نقش‌های کاربری و پیکربندی سامانه فعلاً ثابت هستند. تنظیمات مدیریتی به‌زودی از اینجا قابل تغییر خواهد بود."
      />
    </div>
  );
}
