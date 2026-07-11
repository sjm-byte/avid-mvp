"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    document.cookie = "avid_demo_role=; path=/; max-age=0";

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Supabase not configured
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="mt-1 w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      خروج
    </Button>
  );
}
