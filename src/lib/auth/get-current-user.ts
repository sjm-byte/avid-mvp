import { cookies } from "next/headers";
import { getMockUser } from "@/lib/auth/mock";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { UserProfile } from "@/types/user";

export async function getCurrentUser(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get("avid_demo_role")?.value;

  if (demoRole) {
    return getMockUser(demoRole);
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return {
        id: user.id,
        email: user.email ?? "",
        fullName: (user.user_metadata?.full_name as string) ?? "کاربر",
        role: (user.user_metadata?.role as UserProfile["role"]) ?? "investor",
      };
    }
  } catch {
    // Supabase not configured or session error
  }

  return null;
}
