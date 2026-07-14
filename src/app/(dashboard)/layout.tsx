import { redirect } from "next/navigation";
import { InvestorHeader } from "@/components/layout/InvestorHeader";
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
    <div className="flex min-h-screen min-w-0 max-w-full flex-col overflow-x-hidden">
      <InvestorHeader user={user} />
      <main className="min-w-0 max-w-full flex-1 overflow-x-hidden overflow-y-auto bg-muted/20 p-4 sm:p-6">
        <div className="mx-auto w-full min-w-0 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
