import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen min-w-0 max-w-full overflow-x-hidden">
      <DashboardSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 min-w-0 shrink-0 items-center border-b bg-background px-6">
          <p className="min-w-0 text-sm text-muted-foreground">
            مبالغ و سود/زیان پیش‌بینی‌شده تا زمان تسویه نهایی ثبت نشده‌اند.
          </p>
        </header>
        <main className="min-w-0 max-w-full flex-1 overflow-x-hidden overflow-y-auto bg-muted/20 p-6">
          <div className="w-full max-w-full min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
