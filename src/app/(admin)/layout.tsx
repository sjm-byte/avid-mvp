import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
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
    <AdminShell user={user}>{children}</AdminShell>
  );
}
