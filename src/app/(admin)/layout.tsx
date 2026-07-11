import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { getMockUser } from "@/lib/auth/mock";
import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types/user";

async function getAdminUser(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get("avid_demo_role")?.value;

  if (demoRole === "admin") {
    return getMockUser("admin");
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const role = user.user_metadata?.role as UserProfile["role"];
      if (role === "admin" || role === "finance") {
        return {
          id: user.id,
          email: user.email ?? "",
          fullName: (user.user_metadata?.full_name as string) ?? "مدیر",
          role,
        };
      }
    }
  } catch {
    // Supabase not configured
  }

  return null;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen min-w-0 max-w-full overflow-x-hidden">
      <AdminSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 min-w-0 shrink-0 items-center border-b bg-background px-6">
          <h1 className="min-w-0 text-sm font-medium text-muted-foreground">
            پنل مدیریت آوید
          </h1>
        </header>
        <main className="min-w-0 max-w-full flex-1 overflow-x-hidden overflow-y-auto bg-muted/20 p-6">
          <div className="w-full max-w-full min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
